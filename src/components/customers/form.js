import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message } from 'antd';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { GET_CUSTOMERS } from '../../graphql/queries/customer'
import _ from 'lodash';
const FormItem = Form.Item;
class FormClass extends Component {

    constructor(props) {
        super(props)
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
            selectedValue: ''
        }
    }
    onChangeDiscount = (type, index, ev) => {
        const { discounts } = this.state;
        const discountsObject = discounts[index];
        if (type === "percentage") {
            discountsObject.discount = ev;
        } else {
            const selectedProduct = JSON.parse(ev);
            discountsObject.product = {
                name: selectedProduct.name,
                price: selectedProduct.price,
                id: selectedProduct.id,
                selected: true
            };
        }
        discounts[index] = discountsObject;

        this.setState({
            discounts
        })
    };

    add = () => {
        const { discounts } = this.state;
        const discountsObj = {
            discount: 0,
            product: ''
        };

        // can use data-binding to get
        discounts.push(discountsObj);
        this.setState({
            discounts
        })
    };

    removeDiscount = (index) => {
        const { discounts } = this.state;
        discounts.splice(index, 1);
        this.setState({
            discounts
        })
    };
    handledSubmit = (e) => {
        e.preventDefault();
        const { id, form, createCustomer } = this.props;
        const { validateFields, resetFields } = form;
        validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                let { discounts } = this.state;
               
                const { name, mobile, password, town, area, block, house } = values;
                const dupDiscount = [];
                for (var i = 0; i < discounts.length; i++) {
                    if(discounts[i].discount!=0 && discounts[i].product){
                        const discountsObj = {
                            discount: discounts[i].discount,
                            product: {
                                connect: {
                                    id: discounts[i].product.id
                                }
                            }
                        }
    
                        dupDiscount.push(discountsObj)
                    }
                }

                let customer = {
                    data: {
                        mobile,
                        name,
                        password,
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
                if(dupDiscount.length<1){
                    delete customer.data.discounts
                }

                if (id) {

                } else {
                   createCustomer({
                            variables: customer,
                            update: (proxy, { data: { createCustomer} }) => {
                                // Read the data from our cache for this query.
                                const data = proxy.readQuery({ query: GET_CUSTOMERS });
                                // Add our comment from the mutation to the end.
                                data.customers.push(createCustomer)
                                data.customers = [...data.customers]
                                // Write our data back to the cache.
                                proxy.writeQuery({ query: GET_CUSTOMERS, data });
                            }
                        })
                        .then(result => {
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
                                message.success('Customer has been created successfully');
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
                }
            }
        });


    };

    getCustomerDetails = (ev) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            [ev.target.name]: ev.target.value
        });
    };
    render() {
        const { form, id, options } = this.props;
        const { getFieldDecorator, getFieldsValue } = form;

        const { discounts, disableBtn } = this.state;
        const { name, mobile, password, town, area, block, house } = getFieldsValue();

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 }
            }
        };

        return (
            <div className="create-main-div">
                            <Form layout="horizontal" onSubmit={this.handledSubmit}>
                                <Row gutter={16}>
                                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                                        <h3>General</h3>
                                        <FormItem label={`Mobile Number`} >
                                            {getFieldDecorator('mobile', {
                                                initialValue: mobile,
                                                rules: [
                                                    {
                                                        required: true
                                                    }
                                                ]
                                            })(<Input name="mobile" onChange={this.getCustomerDetails} />)}
                                        </FormItem>
                                        <FormItem label={`Password Should be Number with Prefix`} >
                                            {getFieldDecorator('password', {
                                                initialValue: password,
                                                rules: [
                                                    {
                                                        required: true
                                                    }
                                                ]
                                            })(<Input name="password" onChange={this.getCustomerDetails} />)}
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
                                            })(<Input name="name" onChange={this.getCustomerDetails} />)}
                                        </FormItem>
                                    </Col>
                                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                                        <h3>Address</h3>
                                        <FormItem label={`Town`} >
                                            {getFieldDecorator('town', {
                                                initialValue: town,
                                                rules: [
                                                    {
                                                        required: true
                                                    }
                                                ]
                                            })(<Input name="town" onChange={this.getCustomerDetails} />)}
                                        </FormItem>
                                        <FormItem label={`Area`} >
                                            {getFieldDecorator('area', {
                                                initialValue: area,
                                                rules: [
                                                    {
                                                        required: true
                                                    }
                                                ]
                                            })(<Input name="area" onChange={this.getCustomerDetails} />)}
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
                                            })(<Input name="block" onChange={this.getCustomerDetails} />)}
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
                                            })(<Input name="house" onChange={this.getCustomerDetails} />)}
                                        </FormItem>
                                    </Col>
                                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                                        <h3>Discount</h3>
                                        <div className="discount-details">
                                            {
                                                discounts.map((value, index) => {

                                                    return (
                                                        <div className="discounts" key={index}>
                                                            <Icon
                                                                className="dynamic-delete-button removeButtonDiscount"
                                                                type="minus-circle-o"
                                                                onClick={this.removeDiscount}
                                                            />
                                                            <Form.Item>

                                                                <AutoComplete
                                                                    className="certain-category-search"
                                                                    dropdownClassName="certain-category-search-dropdown"
                                                                    dropdownMatchSelectWidth={false}
                                                                    dropdownStyle={{ width: 300 }}
                                                                    size="large"
                                                                    style={{ width: '100%' }}
                                                                    dataSource={options}

                                                                    placeholder="Products"
                                                                    value={value.product ? value.product.selected ? value.product.name : '' : ''}
                                                                    onChange={this.onChangeDiscount.bind(this, 'product', index)}
                                                                >
                                                                    <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                                                                </AutoComplete>

                                                            </Form.Item>
                                                            <Form.Item>
                                                                <InputNumber
                                                                    defaultValue={value.percentage}
                                                                    min={0}
                                                                    max={100}
                                                                    formatter={value => `${value}%`}
                                                                    parser={value => value.replace('%', '')}
                                                                    onChange={this.onChangeDiscount.bind(this, 'percentage', index)}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    )

                                                })
                                            }
                                            <Form.Item className="fields-adds" {...formItemLayoutWithOutLabel}>
                                                <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                                                    <Icon type="plus" /> Add field
                                </Button>
                                            </Form.Item>
                                        </div>

                                    </Col>
                                </Row>
                                <Row className="top-space" type="flex" justify="center">
                                    <Col xs={{ span: 16 }} sm={{ span: 16 }} md={{ span: 8 }} lg={{ span: 5 }} xl={{ span: 4 }}>


                                        <Button type="primary" htmlType="submit" className="login-form-button"  onClick={this.handledSubmit} loading={disableBtn}>{id ? 'Update' : 'Create'}</Button>

                                    </Col>
                                </Row>
                            </Form>
            </div>
        )
    }

}
const CustomerForm = Form.create({ name: 'normal_login' })(FormClass);




const CREATE_CUSTOMER_MUTATION = gql`
mutation createCustomer($data: UserCreateInput!) {
                    createCustomer(data: $data){
                        name
                        id
                        mobile
                        address{
                            town
                            house
                            block
                        }
                        createdAt
                        bottle{
                            balance
                        }
                }
                }
                `;

export default graphql(CREATE_CUSTOMER_MUTATION, { name: 'createCustomer' })(
    withRouter(CustomerForm)
)
