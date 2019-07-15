import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message, Spin } from 'antd';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { PRODUCTS_QUERY } from '../../graphql/queries/product';
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION } from '../../graphql/mutations/product';
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
      price: 0,
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
    const { product: { id } = {} } = this.props;

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
    if (nextProps.product.id) {
      const { product } = nextProps;
      const { id, name, price } = product;
      const { adding } = this.state;
      // If updating product
      if (id) {
        if (!adding) {
          // set product to state
          this.setState({ name, price })
        }
      }
    } else {
      this.setState({ name: '', price: '' })
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
    const { product: { id } = {} } = this.props;

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
    const { product: { id } = {}, form, createProduct, updateProduct } = this.props;
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
        const { name, price } = values;
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

        let product = {
          data: {
            price: parseInt(price),
            name
          }
        };
        if (id) {
          delete product.name;
          delete product.price;
          product.id = id;

          if (dupDiscount.length < 1 && deleteDiscount.length > 0) {
            delete product.data.discounts.create;
            product.data.discounts.delete = deleteDiscount
          }
          else if (dupDiscount.length < 1 && deleteDiscount.length < 1 && editDup.length < 1) {
            delete product.data.discounts
          }
          else if (dupDiscount.length > 0 && deleteDiscount.length > 0) {
            product.data.discounts.delete = deleteDiscount
          }
          if (editDup.length > 0) {
            product.data.discounts.update = editDup;
          }
          updateProduct({
            variables: product,
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
            delete product.data.discounts
          }
          createProduct({
            variables: product,
            update: (proxy, { data: { createProduct } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: PRODUCTS_QUERY, variables: { where: {}} });
              // Add our comment from the mutation to the end.
              data.products.push(createProduct);
              data.products = [...data.products];
              // Write our data back to the cache.
              proxy.writeQuery({ query: PRODUCTS_QUERY, data, variables: { where: {}} });
            }
          })
            .then(result => {
              this.setState({
              disableBtn: false,

            }, () => {
              resetFields();
              message.success('Product has been created successfully');
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

  getProductDetails(ev) {
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
    const { form, product: { id } = {}, options, loading } = this.props;
    const { getFieldDecorator } = form;
    const { discounts, disableBtn } = this.state;
    const { name, price } = this.state;
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
                    <FormItem label={`Name`} >
                      {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [
                          {
                            required: true,
                            message: `The input is not valid phone!`
                          }
                        ]
                      })(<Input name="name" onChange={this.getProductDetails.bind(this)} />)}
                    </FormItem>
                    <FormItem label={`Price`} >
                      {getFieldDecorator('price', {
                        initialValue: price,
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(<Input name="price" type="number" onChange={this.getProductDetails.bind(this)} />)}
                    </FormItem>
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

const ComposedForm = Form.create({ name: 'product' })(MainForm);

const ProductForm = compose(
  graphql(CREATE_PRODUCT_MUTATION, { name: "createProduct" }),
  graphql(UPDATE_PRODUCT_MUTATION, { name: "updateProduct" })
)(ComposedForm);

withRouter(ProductForm);

export default ProductForm;
