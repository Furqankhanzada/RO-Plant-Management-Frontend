import React, { Component, Fragment } from 'react'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message } from 'antd';
import { gql } from 'apollo-boost';
import { graphql, Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { async } from 'q';

const FormItem = Form.Item;
class UpdateCreateForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            discount: [
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
        const { discount } = this.state;
        const discountObject = discount[index];
        if (type == "percentage") {
            discountObject.discount = ev;
        } else {
            const selectedProduct = JSON.parse(ev);
            discountObject.product = {
                name: selectedProduct.name,
                price: selectedProduct.price,
                id: selectedProduct.id,
                selected: true
            };
        }
        discount[index] = discountObject;

        this.setState({
            discount
        })
    };

    add = () => {
        const { discount } = this.state;
        const discountObj = {
            discount: 0,
            product: ''
        };

        // can use data-binding to get
        discount.push(discountObj);
        this.setState({
            discount
        })
    };

    removeDiscount = (index) => {
        const { discount } = this.state;
        discount.splice(index, 1);
        this.setState({
            discount
        })
    };
    handledSubmit = (mutation) => {
        const { resetFields } = this.props.form;
        const { id } = this.props;
        console.log(mutation, '======')
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                const { name, mobile, password, town, area, block, house, discount } = this.state;
                const dupDiscount = [];
                for (var i = 0; i < discount.length; i++) {
                    const discountObj = {
                        discount: discount[i].discount,
                        product: {
                            connect: {
                                id: discount[i].product.id
                            }
                        }
                    }

                    dupDiscount.push(discountObj)
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
                if (id) {

                } else {
                    await mutation({ variables: customer });
                    // this.props
                    //     .createCustomer({
                    //         variables: customer
                    //     })
                    //     .then(result => {
                    //         this.setState({
                    //             disableBtn: false, name: '', mobile: '', password: '', town: '', area: '', block: '', house: '',
                    //             discount: [
                    //                 {
                    //                     discount: 0,
                    //                     product: ''
                    //                 }
                    //             ],
                    //         }, () => {
                    //             message.success('Customer has been created successfully');
                    //         });
                    //         resetFields();
                    //     })
                    //     .catch(err => {
                    //         this.setState({
                    //             disableBtn: false
                    //         });
                    //         const { graphQLErrors } = err;
                    //         graphQLErrors.forEach(element => {
                    //             message.error(element.message);
                    //         });
                    //         this.setState({
                    //             loading: false
                    //         });
                    //     })
                }
            }
        });


    };

    getCustomerDetails = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    };
    render() {
        const { form, id, options } = this.props;
        const { getFieldDecorator } = form;

        const { disableBtn, name, mobile, password, town, area, block, house, discount } = this.state;
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 }
            }
        };
        return (
            <div className="create-main-div">
                <Row gutter={16}>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                        <h3>General</h3>
                        <Form layout="horizontal">
                            <FormItem label={`Mobile Number`} >
                                {getFieldDecorator('number', {
                                    rules: [
                                        {
                                            required: true
                                        }
                                    ]
                                })(<Input name="mobile" onChange={this.getCustomerDetails} value={mobile} />)}
                            </FormItem>
                            <FormItem label={`Password Should be Number with Prefix`} >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true
                                        }
                                    ]
                                })(<Input name="password" onChange={this.getCustomerDetails} value={password} />)}
                            </FormItem>
                            <FormItem label={`Name`} >
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: `The input is not valid phone!`
                                        }
                                    ]
                                })(<Input name="name" onChange={this.getCustomerDetails} value={name} />)}
                            </FormItem>
                        </Form>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                        <h3>Address</h3>
                        <Form layout="horizontal">
                            <FormItem label={`Town`} >
                                {getFieldDecorator('town', {
                                    rules: [
                                        {
                                            required: true
                                        }
                                    ]
                                })(<Input name="town" onChange={this.getCustomerDetails} value={town} />)}
                            </FormItem>
                            <FormItem label={`Area`} >
                                {getFieldDecorator('area', {
                                    rules: [
                                        {
                                            required: true
                                        }
                                    ]
                                })(<Input name="area" onChange={this.getCustomerDetails} value={area} />)}
                            </FormItem>
                            <FormItem label={`Block`} >
                                {getFieldDecorator('block', {
                                    rules: [
                                        {
                                            required: true,
                                            message: `The input is not valid phone!`
                                        }
                                    ]
                                })(<Input name="block" onChange={this.getCustomerDetails} value={block} />)}
                            </FormItem>
                            <FormItem label={`House`} >
                                {getFieldDecorator('house', {
                                    rules: [
                                        {
                                            required: true,
                                            message: `The input is not valid Address!`
                                        }
                                    ]
                                })(<Input name="house" onChange={this.getCustomerDetails} value={house} />)}
                            </FormItem>
                        </Form>
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }}>
                        <h3>Discount</h3>
                        <Form layout="horizontal">
                            <div className="discount-details">
                                {
                                    discount.map((value, index) => {

                                        return (
                                            <div className="discounts">
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

                        </Form>
                    </Col>
                </Row>
                <Row className="top-space" type="flex" justify="center">
                    <Col xs={{ span: 16 }} sm={{ span: 16 }} md={{ span: 8 }} lg={{ span: 5 }} xl={{ span: 4 }}>
                        <Mutation
                            onCompleted={() => {
                                message.success('Customer has been created successfully');
                            }}
                            mutation={CREATE_CUSTOMER_MUTATION}
                        >
                            {(createProduct, { loading, error }) => {
                                if (error) {
                                    console.log(error,'error.....=====')
                                    const { graphQLErrors } = error;
                                    graphQLErrors.forEach(element => {
                                    return  message.error(element.message);
                                    });
                                }
                                return (
                                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => this.handledSubmit(createProduct)} loading={loading}>{id ? 'Update' : 'Create'}</Button>
                                )
                            }}
                        </Mutation>
                    </Col>
                </Row>
            </div>
        )
    }

}
const CreateUpdateCustomerForm = Form.create({ name: 'normal_login' })(UpdateCreateForm);




const CREATE_CUSTOMER_MUTATION = gql`
mutation createCustomer($data: UserCreateInput!) {
                    createCustomer(data: $data){
                    name
                }
                }
                `;

export default graphql(CREATE_CUSTOMER_MUTATION, { name: 'createCustomer' })(
    withRouter(CreateUpdateCustomerForm)
)
