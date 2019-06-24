import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message, Spin, Select, Empty, Checkbox } from 'antd';
import { graphql, compose, Query } from 'react-apollo';
import { debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
import { GET_CUSTOMERS } from '../../graphql/queries/customer';
import { GET_TRANSACTIONS, GET_TRANSACTION } from '../../graphql/queries/transaction';
import { CREATE_TRANSACTION_MUTATION, UPDATE_TRANSACTION_MUTATION } from '../../graphql/mutations/transaction';
import { client } from '../../index'
import gql from 'graphql-tag';
import { DatePicker } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const { Option } = Select;
const FormItem = Form.Item;
class MainForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      items: [
        {
          quantity: 0,
          product: '',
          total: 0,
          bottleStatus: false,
          transactionAt: new Date()
        }
      ],
      products: [],
      result: [],
      drawer: false,
      disableBtn: false,
      selectedValue: '',
      deleteItem: [],
      editItem: [],
      user: '',
      userUpdateDiscount: '',
      type: '', status: '', payment: { paid: 0, balance: 0 },
      adding: false
    };
    this.searchCustomer = debounce(this.searchCustomer, 400);
  }

  add() {
    const { items } = this.state;
    const { transaction: { id } = {} } = this.props;

    const itemsObj = {
      quantity: 0,
      product: '',
      total: 0,
      transactionAt: new Date()
    };
    if (id) {
      itemsObj.new = true
    }
    // can use data-binding to get
    items.push(itemsObj);
    this.setState({
      items,
      adding: true
    })
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.updateStatus) {
      const { transaction, open } = nextProps;
      const { items, adding } = this.state;
      const { id, type, user, status, payment } = transaction;
      // // If updating transaction
      if (id) {
        // make items
        if (!adding) {
          const discountArray = transaction.items.map((value) => {
            value.product.selected = true;
            value.bottleStatus = value.bottleOut ? true : false
            return value
          });
          // set transaction to state
          this.setState({ user: user, type, status, payment, items: discountArray, userUpdateDiscount: user })
        }
      }
    } else {
      this.setState({
        user: '',
        type: 'SELL',
        status: 'PENDING',
        quantity: ''
      })
    }
  }
  getPaidValue = (ev) => {
    const { payment } = this.state;
    const total = payment.paid + payment.balance;
    if (payment.balance !== total || payment.balance >= 0) {
      payment.balance = total - ev
    }
    payment.paid = ev;

    this.setState({
      payment
    })
  }
  onChangeItem(type, index, itemtId, ev) {
    const { items, editItem, payment, userUpdateDiscount } = this.state;
    const itemsObject = items[index];
    const { discounts } = userUpdateDiscount;
    let balancedPrice = 0;
    if (type === "percentage") {
      itemsObject.quantity = ev
      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;
        balancedPrice = balancedPrice + productPrice;
      })

    } else if (type === "bottle") {
      console.log(ev,"====btn")
      itemsObject.bottleStatus = ev;
      if (!ev) {
        delete itemsObject.bottleOut
      }
      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;

        balancedPrice = balancedPrice + productPrice;
      })
    } else if (type === "bottlesOut") {
      itemsObject.bottleOut = ev;
      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;

        balancedPrice = balancedPrice + productPrice;
      })
    } else if (type === "transactionAt") {
      itemsObject.transactionAt = new Date(ev);
      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;

        balancedPrice = balancedPrice + productPrice;
      })
    }
    else {
      const selectedProduct = JSON.parse(ev);
      itemsObject.product = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        id: selectedProduct.id,
        selected: true
      };
      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;

        balancedPrice = balancedPrice + productPrice;
      })
    }
    if (itemtId) {
      itemsObject.edit = true;
      itemsObject.itemtId = itemtId
    }
    payment.balance = balancedPrice - payment.paid
    items[index] = itemsObject;

    console.log(items, "====items")
    this.setState({
      items,
      itemsObject,
      editItem,
      payment
    })
  }
  removeItem(index, value) {
    const { items, deleteItem, payment, userUpdateDiscount } = this.state;
    const { transaction: { id } = {} } = this.props;
    const { discounts } = userUpdateDiscount;
    let balancedPrice = 0;

    if (items.length > 1) {
      if (id && value.id) {
        const deleteItemObj = { id: value.id };
        deleteItem.push(deleteItemObj);
      }
      items.splice(index, 1);

      items.map((value) => {
        const discountedProduct = discounts ? discounts.find((discountObject) => {
          return value.product.id === discountObject.product.id
        }) : null
        const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;
        balancedPrice = balancedPrice + productPrice;
      })


      this.setState({
        items,
        payment: {
          balance: balancedPrice - payment.paid,
          paid: payment.paid,
          status: payment.status,
          method: payment.method,
        },
        deleteItem,
        adding: true
      })
    }
  }
  handledSubmit(e) {
    e.preventDefault();
    const { form, createTransaction, updateTransaction } = this.props;
    const { validateFields, resetFields } = form;
    const id = this.props.updateStatus;
    let { items, deleteItem } = this.state;
    const dupItem = [];
    const editDup = [];
    validateFields(async (err, values) => {

      if (!err) {
        this.setState({
          disableBtn: true,
          loading: true
        });
        let { type, user, payment, status } = values;

        for (let i = 0; i < items.length; i++) {
          if (items[i].quantity !== 0 && items[i].product && items[i].transactionAt) {
            let userDiscount;
            if (id) {
              const { userUpdateDiscount } = this.state;
              userDiscount = userUpdateDiscount.discounts;
            } else {
              userDiscount = JSON.parse(user).discounts
            }

            if (userDiscount) {
              userDiscount = userDiscount.find((value) => {
                return value.product.id === items[i].product.id
              })
            }
            let itemsObj = {
              quantity: items[i].quantity,
              transactionAt: items[i].transactionAt,
              bottleOut: items[i].bottleOut ? items[i].bottleOut : 0,
              total: userDiscount ? items[i].quantity * userDiscount.discount : items[i].quantity * items[i].product.price,
              product: {
                connect: {
                  id: items[i].product.id
                }
              }
            };

            console.log(itemsObj, "====ItemsObjs")

            if (items[i].edit) {
              const editObj = {
                where: {
                  id: items[i].itemtId
                },
                data: {
                  quantity: items[i].quantity,
                  transactionAt: items[i].transactionAt,
                  bottleOut: items[i].bottleOut ? items[i].bottleOut : 0,
                  total: userDiscount ? items[i].quantity * userDiscount.discount : items[i].quantity * items[i].product.price,
                  product: {
                    connect: {
                      id: items[i].product.id
                    }
                  }
                }
              };
              editDup.push(editObj)
            }
            if (id && items[i].new === true) {
              dupItem.push(itemsObj)
            } else if (!id) {
              dupItem.push(itemsObj)
            }
          }
        }
        // create transaction object
        if (!id) {
          user = JSON.parse(user).id
        }
        let transaction = {
          data: {
            user: {
              connect: {
                id: user
              }
            },
            payment: {
              create: {
                ...payment
              }
            },
            type,
            status,
            items: {
              create: dupItem
            }
          }
        };

        if (id) {
          delete transaction.data.user;
          transaction.where = { id };


          if (dupItem.length < 1 && deleteItem.length > 0) {
            delete transaction.data.items.create;
            transaction.data.items.delete = deleteItem
          }
          else if (dupItem.length < 1 && deleteItem.length < 1 && editDup.length < 1) {
            delete transaction.data.items
          }
          else if (dupItem.length > 0 && deleteItem.length > 0) {
            transaction.data.items.delete = deleteItem
          }
          if (editDup.length > 0) {
            transaction.data.items.update = editDup;
          }
          console.log(transaction, "last tran object")
          updateTransaction({
            variables: transaction,
            refetchQueries: [{ query: GET_TRANSACTIONS, variables: transaction }, { query: GET_TRANSACTION, variables: { id } }]
          }).then(result => {
            this.setState({
              disableBtn: false,
              editItem: [],
              deleteItem: [],
              items: [],
              adding: false
            }, () => {
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
          console.log(transaction, "=====transcation====")
          if (dupItem.length < 1) {
            delete transaction.data.items
          }
          createTransaction({
            variables: transaction,
            update: (proxy, { data: { createTransaction } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: GET_TRANSACTIONS, variables: { where: {} } });
              // Add our comment from the mutation to the end.
              data.transactions.unshift(createTransaction);
              data.transactions = [...data.transactions];
              // Write our data back to the cache.
              proxy.writeQuery({ query: GET_TRANSACTIONS, data, variables: { where: {} } });
            }
          }).then(result => {
            this.setState({
              disableBtn: false,
              items: [
                {
                  discount: 0,
                  product: ''
                }
              ],
              adding: false
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
    }).then(() => {
      this.setState({
        adding: false
      })
    })
  }

  searchCustomer(searchValue) {
    this.setState({
      searchValue
    });
  }

  getCustomer(user) {
    const userDiscount = JSON.parse(user)
    let balancedPrice = 0;
    const { items, payment } = this.state;
    const { discounts } = userDiscount;
    items.map((value) => {
      const discountedProduct = discounts ? discounts.find((discountObject) => {
        return value.product.id === discountObject.product.id
      }) : null
      const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;
      balancedPrice = balancedPrice + productPrice;
    })

    this.setState({
      userUpdateDiscount: userDiscount,
      payment: {
        balance: balancedPrice - payment.paid,
        paid: payment.paid,
        status: payment.status,
        method: 'CASH',
      }
    })


  }

  render() {
    const { form: { getFieldDecorator }, transaction: { id } = {}, options, loading } = this.props;
    const { items, disableBtn, searchValue, user, type, status, payment } = this.state;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 }
      }
    };

    let where = {};
    if (searchValue) {
      where.name_contains = searchValue
    }
    return (
      <div className="create-main-div">
        <Form layout="horizontal" onSubmit={this.handledSubmit.bind(this)} className="form-create-update">
          {
            loading || (disableBtn && id) ? (<Spin className="update_form_loader" />) : (
              <React.Fragment>
                <Row gutter={16}>
                  <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>General</h3>

                    <Query query={GET_CUSTOMERS} variables={{ where, first: 3 }}>
                      {({ loading, error, data: { customers = [] } }) => {
                        if (loading) {
                          customers = [];
                        }
                        if (error) return `Error! ${error.message}`;
                        return (
                          <Form.Item label={`Customer`}>
                            {getFieldDecorator('user', {
                              initialValue: user ? `${user.name} : ${user.mobile}` : '',
                              rules: [{ required: true, message: 'Type is Required!' }],
                            })(
                              <Select
                                showSearch={true}
                                onChange={this.getCustomer.bind(this)}
                                onSearch={this.searchCustomer.bind(this)}
                                placeholder="Select customer"
                                filterOption={false}
                                disabled={user.name ? true : false}
                                notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                              >
                                {customers.map(({ id, name, mobile, discounts }) => <Option key={JSON.stringify({ id, discounts })}>{name} : {mobile}</Option>)}


                              </Select>,
                            )}
                          </Form.Item>
                        );
                      }}
                    </Query>
                    <Form.Item label={`Type`}>
                      {getFieldDecorator('type', {
                        initialValue: type,
                        rules: [{ message: 'Type is Required!' }],
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
                        rules: [{ message: 'Status is Required!' }],
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
                      {getFieldDecorator('payment.method', {
                        initialValue: payment.method,
                        rules: [{ message: 'Type is Required!' }],
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
                      {getFieldDecorator('payment.status', {
                        initialValue: payment.balance === 0 ? 'PAID' : 'UNPAID',
                        rules: [{ message: 'Status is Required!' }],
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
                      {getFieldDecorator('payment.paid', {
                        initialValue: payment.paid ? payment.paid : 0,
                      })(<InputNumber
                        formatter={value => `Rs${value}`}
                        parser={value => value.replace('Rs', '')}
                        onChange={this.getPaidValue}
                        min={0}
                        max={payment.balance + payment.paid}
                      />)}
                    </FormItem>
                    <FormItem label={`Balance`} >
                      {getFieldDecorator('payment.balance', {
                        initialValue: payment.balance ? payment.balance : 0
                      })(<InputNumber
                        formatter={value => `Rs${value}`}
                        parser={value => value.replace('Rs', '')}
                        disabled={true}
                      />)}
                    </FormItem>
                  </Col>
                  <Col className="discount-box" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }} xl={{ span: 24 }}>
                    <h3>Items</h3>
                    <div className="discount-details">
                      {
                        items.map((value, index) => {
                          console.log(value, "===vals")
                          const { userUpdateDiscount } = this.state;
                          const { discounts } = userUpdateDiscount;
                          const discountedProduct = discounts ? discounts.find((discountObject) => {
                            return value.product.id === discountObject.product.id
                          }) : null
                          const productPrice = discountedProduct ? value.quantity * discountedProduct.discount : value.quantity * value.product.price;
                          return (
                            <div className="discounts" key={index}>
                              <Icon
                                className="dynamic-delete-button removeButtonDiscount"
                                type="minus-circle-o"
                                onClick={this.removeItem.bind(this, index, value)}
                              />
                              <FormItem label={`Is Returnable ?`} colon={false} className={`${value.bottleStatus ? 'small-width' : 'full-width'}`}>

                                <Button type="primary" size="medium"  onClick={this.onChangeItem.bind(this, 'bottle', index, value.id, !value.bottleStatus )} >
                                  {value.bottleStatus ? 'No' : 'Yes'}
                                </Button>
                              </FormItem>

                              <FormItem label={`Transaction At`} className={`${value.bottleStatus ? 'small-width' : 'full-width'}`}>
                                <DatePicker defaultValue={moment(value.transactionAt, dateFormat)} onChange={this.onChangeItem.bind(this, 'transactionAt', index, value.id)} format={dateFormat} />
                              </FormItem>


                              <Form.Item label={'Select Product'} className={`${value.bottleStatus ? 'small-width' : 'full-width'}`}>

                                <AutoComplete
                                  className="certain-category-search"
                                  dropdownClassName="certain-category-search-dropdown"
                                  dropdownMatchSelectWidth={false}
                                  dropdownStyle={{ width: 300 }}
                                  style={{ width: '100%' }}
                                  dataSource={options}
                                  placeholder="Products"
                                  value={value.product ? value.product.selected ? value.product.name : '' : ''}
                                  onChange={this.onChangeItem.bind(this, 'product', index, value.id)}
                                >
                                  <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                                </AutoComplete>
                              </Form.Item>


                              <FormItem label={`Quantity`} className='bottle-status-width'>
                                <InputNumber
                                  defaultValue={value.quantity}
                                  formatter={value => `${value}`}
                                  onChange={this.onChangeItem.bind(this, 'percentage', index, value.id)}
                                />
                              </FormItem>
                              <FormItem label={`Total`} className={`${value.bottleStatus ? 'small-width' : 'full-width'}`}>
                                <InputNumber disabled={true}
                                  value={productPrice ? productPrice : 0}
                                  formatter={value => `PKR ${value}`}
                                  parser={value => value.replace('PKR', '')}
                                />
                              </FormItem>


                              {
                                value.bottleStatus ? (
                                  <FormItem label={`Bottles Out`} className={`${value.bottleStatus ? 'bottle-status-width' : 'full-width'}`}>
                                    <InputNumber
                                      value={value.bottleOut}
                                      formatter={value => `${value}`}
                                      onChange={this.onChangeItem.bind(this, 'bottlesOut', index, value.id)}

                                    />
                                  </FormItem>
                                ) : null
                              }
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
