import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message, Spin, Select } from 'antd';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { GET_TRANSACTIONS, GET_TRANSACTION } from '../../graphql/queries/transaction';
import { CREATE_TRANSACTION_MUTATION, UPDATE_TRANSACTION_MUTATION } from '../../graphql/mutations/transaction';
import { client } from '../../index'
import gql from 'graphql-tag';

const { Option } = Select;
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
      user: '',
      type: '',
      status: '',
      PaymentStatus: '',
      PaymentMethod:'',
      town: '',
      paid: '',
      balance: '',
      house: '',
      products: [],
      result: [],
      drawer: false,
      disableBtn: false,
      selectedValue: '',
      deleteDiscount: [],
      editDiscount: []
    }
  }

  add() {
    const { discounts } = this.state;
    const { transaction: { id } = {} } = this.props;

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
      discounts
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.transaction.id) {
      const { transaction } = nextProps;
      const { id, type, user, status, address: { town, paid, balance, house } } = transaction;
      // If updating transaction
      if (id) {
        // make discounts
        const discountArray = transaction.discounts.map((value) => {
          value.product.selected = true;
          return value
        });
        // set transaction to state
        this.setState({ user, type, status, town, paid, balance, house, discounts: discountArray})
      }
    } else {
      this.setState({ user: '', type: 'SELL', status: 'PENDING', PaymentStatus: 'PAID', PaymentMethod: 'CASH', password: '', town: '', area: '', block: '', house: '', discounts: []})
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
    const { transaction: { id } = {} } = this.props;

    if (id) {
      const deleteDiscountObj = { id: value.id };
      deleteDiscount.push(deleteDiscountObj);
      this.setState({
        deleteDiscount
      })
    }
    discounts.splice(index, 1);
    this.setState({
      discounts
    })
  }
  handledSubmit (e) {
    e.preventDefault();
    const { transaction: { id } = {}, form, createTransaction, updateTransaction } = this.props;
    const { validateFields, resetFields } = form;

    let { discounts, deleteDiscount } = this.state;
    const dupDiscount = [];
    const editDup = [];
    validateFields(async (err, values) => {

      if (!err) {
        this.setState({
          disableBtn: true,
          loading: true
        });
        const { type, user, status, town, paid, balance, house } = values;

        console.log('types',values)

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
                    create: {
                      name: discounts[i].product.name,
                      price: discounts[i].product.price
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

        let transaction = {
          data: {
            user,
            type
          }
        };

        if (id) {
          delete transaction.user;
          transaction.id = id;

          if (dupDiscount.length < 1 && deleteDiscount.length > 0) {
            delete transaction.data.discounts.create;
            transaction.data.discounts.delete = deleteDiscount
          }
          else if (dupDiscount.length < 1 && deleteDiscount.length < 1 && editDup.length < 1) {
            delete transaction.data.discounts
          }
          else if (dupDiscount.length > 0 && deleteDiscount.length > 0) {
            transaction.data.discounts.delete = deleteDiscount
          }
          if (editDup.length > 0) {
            transaction.data.discounts.update = editDup;
          }
          updateTransaction({
            variables: transaction,
            update: (proxy, { data: { updateTransaction } }) => {
              // Read the data from our cache for this query.
              let data = proxy.readQuery({ query: GET_TRANSACTION, variables: { id } });
              data.transaction = updateTransaction;
              // // Write our data back to the cache.
              proxy.writeQuery({ query: GET_TRANSACTION, data, variables: { where: { id } } });
            }
          }).then(result => {
            this.setState({
              disableBtn: false,
              editDiscount: [],
              deleteDiscount: []
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
            delete transaction.data.discounts
          }
          createTransaction({
            variables: transaction,
            update: (proxy, { data: { createTransaction } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: GET_TRANSACTIONS, variables: { where: {} } });
              // Add our comment from the mutation to the end.
              data.transactions.push(createTransaction);
              data.transactions = [...data.transactions];
              // Write our data back to the cache.
              proxy.writeQuery({ query: GET_TRANSACTIONS, data, variables: { where: {} } });
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
            }, () => {
              resetFields();
              message.success('Transaction has been created successfully');
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

  getTransactionDetails(ev) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      [ev.target.name]: ev.target.value
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
    })
  }

  render() {
    const { form, transaction: { id } = {}, options, loading } = this.props;
    const { getFieldDecorator } = form;
    const { discounts, disableBtn } = this.state;
    const { user, type, status, PaymentStatus, PaymentMethod, town, paid, balance, house } = this.state;
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
                    <FormItem label={`Customer`} >
                      {getFieldDecorator('user', {
                        initialValue: user,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="user" onChange={this.getTransactionDetails.bind(this)} />)}
                    </FormItem>
                    <Form.Item label={`Type`}>
                      {getFieldDecorator('type', {
                        initialValue: type,
                        rules: [{ required: true, message: 'Type is Required!' }],
                      })(
                          <Select
                              onChange={this.handleSelectChange}
                          >
                            <Option value="SELL">SELL</Option>
                            <Option value="PURCHASE">PURCHASE</Option>
                          </Select>,
                      )}
                    </Form.Item>
                    <Form.Item label={`Status`}>
                      {getFieldDecorator('status', {
                        initialValue: status,
                        rules: [{ required: true, message: 'Status is Required!' }],
                      })(
                          <Select
                              placeholder="Select a Option"
                              onChange={this.handleSelectChange}
                          >
                            <Option value="PENDING">PENDING</Option>
                            <Option value="PROCESSING">PROCESSING</Option>
                            <Option value="COMPLETED">COMPLETE</Option>
                          </Select>,
                      )}
                    </Form.Item>

                  </Col>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>Payment</h3>
                    <Form.Item label={`Method`}>
                      {getFieldDecorator('PaymentMethod', {
                        initialValue: PaymentMethod,
                        rules: [{ required: true, message: 'Type is Required!' }],
                      })(
                          <Select
                              onChange={this.handleSelectChange}
                          >
                            <Option value="CASH">CASH</Option>
                            <Option value="BANK_TRANSFER">BANK TRANSFER</Option>
                            <Option value="CHEQUE">CHEQUE</Option>
                          </Select>,
                      )}
                    </Form.Item>
                    <Form.Item label={`Status`}>
                      {getFieldDecorator('status', {
                        initialValue: PaymentStatus,
                        rules: [{ required: true, message: 'Status is Required!' }],
                      })(
                          <Select
                              placeholder="Select a Payment status"
                              onChange={this.handleSelectChange}
                          >
                            <Option value="PAID">PAID</Option>
                            <Option value="UNPAID">UNPAID</Option>
                          </Select>,
                      )}
                    </Form.Item>
                    <FormItem label={`Paid`} >
                      {getFieldDecorator('paid', {
                        initialValue: paid,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="paid" onChange={this.getTransactionDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`Balance`} >
                      {getFieldDecorator('balance', {
                        initialValue: balance,
                        rules: [
                          {
                            required: true,
                            message: `Balance is Required!`
                          }
                        ]
                      })(<Input name="balance" onChange={this.getTransactionDetails.bind(this)} />)}
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
                                <InputNumber disabled = {true}
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

const ComposedForm = Form.create({ name: 'transaction' })(MainForm);

const TransactionForm = compose(
  graphql(CREATE_TRANSACTION_MUTATION, { name: "createTransaction" }),
  graphql(UPDATE_TRANSACTION_MUTATION, { name: "updateTransaction" })
)(ComposedForm);

withRouter(TransactionForm);

export default TransactionForm;
