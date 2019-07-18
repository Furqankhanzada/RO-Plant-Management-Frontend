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
      name: '',
      price: 0,
      drawer: false,
      disableBtn: false,
      selectedValue: '',
      adding: false,
    }
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

  handledSubmit(e) {
    e.preventDefault();
    const { product: { id } = {}, form, createProduct, updateProduct } = this.props;
    const { validateFields, resetFields } = form;

    validateFields(async (err, values) => {

      if (!err) {
        this.setState({
          disableBtn: true,
          loading: true
        });
        const { name, price } = values;
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

          updateProduct({
            variables: product,
          }).then(result => {
            this.setState({
              disableBtn: false,
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
    const { form, product: { id } = {}, loading } = this.props;
    const { getFieldDecorator } = form;
    const { disableBtn } = this.state;
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
