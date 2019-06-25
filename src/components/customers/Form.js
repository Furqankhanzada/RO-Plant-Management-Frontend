import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message, Spin } from 'antd';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { GET_CUSTOMERS, CUSTOMER_QUERY } from '../../graphql/queries/customer';
import { CREATE_CUSTOMER_MUTATION, UPDATE_CUSTOMER_MUTATION } from '../../graphql/mutations/customer';
import { client } from '../../index'
import gql from 'graphql-tag';

const FormItem = Form.Item;
class MainForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      discounts: [
        {
          discount: 0,
          product: ''
        }
      ],
      name: '',
      password: '',
      mobile: '',
      town: '',
      area: '',
      block: '',
      house: '',
      products: [],
      result: [],
      drawer: false,
      disableBtn: false,
      selectedValue: '',
      deleteDiscount: [],
      editDiscount: [],
      adding: false,
      addressId: ''
    }
  }

  add() {
    const { discounts } = this.state;
    const { customer: { id } = {} } = this.props;

    const discountsObj = {
      discount: 0,
      product: ''
    };
    if (id) {
      discountsObj.new = true
    }
    // can use data-binding to get
    discounts.push(discountsObj);
    this.setState({
      discounts,
      adding: true
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.customer.id) {

      const { customer } = nextProps;
      const { id, name, mobile, address: { town, area, block, house } } = customer;
      const { adding } = this.state;
      // If updating customer
      if (id) {
        if (!adding) {
          // make discounts
          const discountArray = customer.discounts.map((value) => {
            value.product.selected = true;
            return value
          });
          // set customer to state
          this.setState({ name, town, area, block, house, mobile, discounts: discountArray })
        }
      }
    } else {
      this.setState({ name: '', password: '', town: '', area: '', block: '', house: '', mobile: '' })
    }
  }

  onChangeDiscount(type, index, discountId, ev) {
    const { discounts, editDiscount } = this.state;
    const discountsObject = discounts[index];
    if (type === "percentage") {
      discountsObject.discount = parseInt((discountsObject.product.price - (ev / 100) * discountsObject.product.price).toFixed());
    } else {
      const selectedProduct = JSON.parse(ev);
      discountsObject.product = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        id: selectedProduct.id,
        selected: true
      };
    }
    if (discountId) {
      discountsObject.edit = true;
      discountsObject.discountId = discountId
    }

    discounts[index] = discountsObject;
    this.setState({
      discounts,
      discountsObject,
      editDiscount
    })
  }
  removeDiscount(index, value) {
    const { discounts, deleteDiscount } = this.state;
    const { customer: { id } = {} } = this.props;

    if (id) {
      const deleteDiscountObj = { id: value.id };
      deleteDiscount.push(deleteDiscountObj);
      this.setState({
        deleteDiscount
      })
    }
    discounts.splice(index, 1);
    this.setState({
      discounts,
      adding: true
    })
  }
  handledSubmit(e) {
    e.preventDefault();
    const { customer: { id } = {}, form, createCustomer, updateCustomer } = this.props;
    const { validateFields, resetFields } = form;

    let { discounts, deleteDiscount, addressId } = this.state;
    const dupDiscount = [];
    const editDup = [];
    validateFields(async (err, values) => {

      if (!err) {
        this.setState({
          disableBtn: true,
          loading: true
        });
        const { name, mobile, town, area, block, house } = values;

        for (let i = 0; i < discounts.length; i++) {
          if (discounts[i].discount !== 0 && discounts[i].product) {
            let discountsObj = {
              discount: discounts[i].discount,
              product: {
                connect: {
                  id: discounts[i].product.id
                }
              }
            };
            if (discounts[i].edit) {
              const editObj = {
                where: {
                  id: discounts[i].discountId
                },
                data: {
                  discount: discounts[i].discount,
                  product: {
                    connect: {
                      id: discounts[i].product.id
                    }
                  }
                }
              };
              editDup.push(editObj)
            }
            if (id && discounts[i].new === true) {
              dupDiscount.push(discountsObj)
            } else if (!id) {
              dupDiscount.push(discountsObj)
            }
          }
        }

        let customer = {
          data: {
            mobile,
            name,
            password: `${mobile}-labbaik`,
            address: {
              create: {
                town,
                area,
                block,
                house
              }
            },
            discounts: {
              create: dupDiscount
            }
          }
        };

        if (id) {
          delete customer.password;
          delete customer.mobile;
          customer.id = id;
          delete customer.data.address;
          customer.data.address = {
            update: {
              town,
              area,
              block,
              house
            }
          }
          if (dupDiscount.length < 1 && deleteDiscount.length > 0) {
            delete customer.data.discounts.create;
            customer.data.discounts.delete = deleteDiscount
          }
          else if (dupDiscount.length < 1 && deleteDiscount.length < 1 && editDup.length < 1) {
            delete customer.data.discounts
          }
          else if (dupDiscount.length > 0 && deleteDiscount.length > 0) {
            customer.data.discounts.delete = deleteDiscount
          }
          if (editDup.length > 0) {
            customer.data.discounts.update = editDup;
          }


          console.log(customer, " address id----------")

          updateCustomer({
            variables: customer,
            refetchQueries: [{ query: CUSTOMER_QUERY, variables: customer }],
          }).then(result => {
            this.setState({
              disableBtn: false,
              editDiscount: [],
              deleteDiscount: [],
              adding: false
            });
            client.mutate({
              mutation: gql`
                  mutation openDrawer($status: Boolean!, $id: String) {
                      openDrawer(status: $status, id: $id) @client {
                          Drawer
                      }
                  }
              `,
              variables: { status: false, id: '' }
            })
          })
            .catch(err => {
              this.setState({
                disableBtn: false
              });
              const { graphQLErrors } = err;
              graphQLErrors.forEach(element => {
                message.error(element.message);
              });
              this.setState({
                loading: false
              });
            })
        } else {
          if (dupDiscount.length < 1) {
            delete customer.data.discounts
          }
          createCustomer({
            variables: customer,
            update: (proxy, { data: { createCustomer } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: GET_CUSTOMERS, variables: { where: {} } });
              // Add our comment from the mutation to the end.
              data.customers.push(createCustomer);
              data.customers = [...data.customers];
              // Write our data back to the cache.
              proxy.writeQuery({ query: GET_CUSTOMERS, data, variables: { where: {} } });
            }
          }).then(result => {
            this.setState({
              disableBtn: false,
              discounts: [
                {
                  discount: 0,
                  product: ''
                }
              ],
              adding: false
            }, () => {
              resetFields();
              message.success('Customer has been created successfully');
              client.mutate({
                mutation: gql`
                    mutation openDrawer($status: Boolean!, $id: String) {
                        openDrawer(status: $status, id: $id) @client {
                            Drawer
                        }
                    }
                `,
                variables: { status: false, id: '' }
              })
            });
          }).catch(err => {
            this.setState({
              disableBtn: false
            });
            const { graphQLErrors } = err;
            graphQLErrors.forEach(element => {
              message.error(element.message);
            });
            this.setState({
              loading: false
            });
          })
        }
      }
    });
  }

  getCustomerDetails(ev) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      [ev.target.name]: ev.target.value
    }, () => {
        this.setState({
          adding: true
        })
    });
  }

  closeDrawer() {
    client.mutate({
      mutation: gql`
          mutation openDrawer($status: Boolean!, $id: String) {
              openDrawer(status: $status, id: $id) @client {
                  Drawer
              }
          }
      `,
      variables: { status: false, id: '' }
    }).then(() => {
      this.setState({
        adding: false
      })
    })
  }

  render() {
    const { form, customer: { id } = {}, options, loading } = this.props;
    const { getFieldDecorator } = form;
    const { discounts, disableBtn } = this.state;
    const { name, mobile, town, area, block, house } = this.state;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 }
      }
    };

    return (
      <div className="create-main-div">
        <Form layout="horizontal" onSubmit={this.handledSubmit.bind(this)} className="form-create-update">
          {
            loading || (disableBtn && id) ? (<Spin className="update_form_loader" />) : (
              <React.Fragment>
                <Row gutter={16}>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>General</h3>
                    <FormItem label={`Mobile Number`} >
                      {getFieldDecorator('mobile', {
                        initialValue: mobile,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="mobile" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`Name`} >
                      {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [
                          {
                            required: true,
                            message: `The input is not valid phone!`
                          }
                        ]
                      })(<Input name="name" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>Address</h3>
                    <FormItem label={`Town`} >
                      {getFieldDecorator('town', {
                        initialValue: town,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="town" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`Area`} >
                      {getFieldDecorator('area', {
                        initialValue: area,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="area" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`Block`} >
                      {getFieldDecorator('block', {
                        initialValue: block,
                        rules: [
                          {
                            required: true,
                            message: `The input is not valid phone!`
                          }
                        ]
                      })(<Input name="block" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`House`} >
                      {getFieldDecorator('house', {
                        initialValue: house,
                        rules: [
                          {
                            required: true,
                            message: `The input is not valid Address!`
                          }
                        ]
                      })(<Input name="house" onChange={this.getCustomerDetails.bind(this)} />)}
                    </FormItem>
                  </Col>
                  <Col className="discount-box" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>Discount</h3>
                    <div className="discount-details">
                      {
                        discounts.map((value, index) => {
                          const productPrice = value.product.price;
                          return (
                            <div className="discounts" key={index}>
                              <Icon
                                className="dynamic-delete-button removeButtonDiscount"
                                type="minus-circle-o"
                                onClick={this.removeDiscount.bind(this, index, value)}
                              />
                              <Form.Item label={'Select Product'}>

                                <AutoComplete
                                  className="certain-category-search"
                                  dropdownClassName="certain-category-search-dropdown"
                                  dropdownMatchSelectWidth={false}
                                  dropdownStyle={{ width: 300 }}
                                  style={{ width: '100%' }}
                                  dataSource={options}
                                  placeholder="Products"
                                  value={value.product ? value.product.selected ? value.product.name : '' : ''}
                                  onChange={this.onChangeDiscount.bind(this, 'product', index, value.id)}
                                >
                                  <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                                </AutoComplete>

                              </Form.Item>

                              <Form.Item label={'Add Discount'}>
                                <InputNumber
                                  value={value.discount ? (100 - (value.discount / productPrice) * 100).toFixed() : 0}
                                  min={0}
                                  max={90}
                                  formatter={value => `${value}%`}
                                  parser={value => value.replace('%', '')}
                                  onChange={this.onChangeDiscount.bind(this, 'percentage', index, value.id)}
                                />
                              </Form.Item>

                              <FormItem label={`Discounted Price`} >
                                <InputNumber disabled={true}
                                  value={value.discount === 0 ? productPrice : value.discount}
                                  formatter={value => `PKR ${value}`}
                                  parser={value => value.replace('PKR', '')}
                                />
                              </FormItem>
                            </div>
                          )

                        })
                      }
                      <Form.Item className="fields-adds" {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add.bind(this)} style={{ width: '100%' }}>
                          <Icon type="plus" /> Add field
                        </Button>
                      </Form.Item>
                    </div>

                  </Col>
                </Row>

                <div className="create-button-div">
                  <Button onClick={this.closeDrawer.bind(this)} style={{ marginRight: 8 }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" onClick={this.handledSubmit.bind(this)} loading={disableBtn}>
                    {id ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </React.Fragment>
            )
          }
        </Form>
      </div>
    )
  }

}

const ComposedForm = Form.create({ name: 'customer' })(MainForm);

const CustomerForm = compose(
  graphql(CREATE_CUSTOMER_MUTATION, { name: "createCustomer" }),
  graphql(UPDATE_CUSTOMER_MUTATION, { name: "updateCustomer" })
)(ComposedForm);

withRouter(CustomerForm);

export default CustomerForm;
