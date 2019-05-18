import React, { Component, Fragment } from 'react';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import { Layout, Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { graphql } from 'react-apollo'
import { Query } from 'react-apollo';

const FormItem = Form.Item;
const Option = AutoComplete.Option;


class CreateCustomer extends Component {
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

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        });
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
    getCustomerDetails = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    };
    handledSubmit = e => {
        e.preventDefault();
        const { resetFields } = this.props.form;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                const { name, mobile, password, town, area, block, house, discount } = this.state;
                const dupDiscount = [];
                for(var i = 0 ; i<discount.length; i++){
                    const discountObj = {
                        discount: discount[i].discount,
                        product:{
                            connect:{
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

                this.props
                    .createCustomer({
                        variables: customer
                    })
                    .then(result => {
                        this.setState({disableBtn: false, name:'', mobile:'', password:'', town:'', area:'', block:'', house:'',
                        discount: [
                            {
                                discount: 0,
                                product: ''
                            }
                        ],
                    },() =>
                        {
                            message.success('Customer has been created successfully');
                        });
                        resetFields();
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
        });
    };
    handleSearch = value => {
        let result;
        if (!value || value.indexOf('@') >= 0) {
            result = [];
        } else {
            result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
        }
        this.setState({ result });
    };
    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { history } = this.props;
        const { disableBtn, name, mobile, password, town, area, block, house, discount } = this.state;

        
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 }
            }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        
        // add field method end here //

        return (
            <Query query={Products_QUERY}>
                {({ data, loading }) => {
                    const { products } = data;
                    const options = products ? products
                        .map(group => (
                            <Option key={group} value={JSON.stringify(group)}>
                                <span>Volume: {group.name}</span>
                                <br />
                                <span>Price: {group.price}</span>
                            </Option>
                        )) : [];
                    return (
                        <Fragment>

                            <Layout>
                                <AppBar handleClick = {this.openDrawer} />
                                <Layout className="dashboard-main">
                                    <Sidebar handleClick = {this.handleClick} history = {history}/>

                                    <Layout className="remove-padding" style={{ padding: '30px 24px 0', height: '100vh' }}>
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
                                                            })(<Input name="mobile" onChange={this.getCustomerDetails} value={mobile}/>)}
                                                        </FormItem>
                                                        <FormItem label={`Password Should be Number with Prefix`} >
                                                            {getFieldDecorator('password', {
                                                                rules: [
                                                                    {
                                                                        required: true
                                                                    }
                                                                ]
                                                            })(<Input name="password" onChange={this.getCustomerDetails} value={password}/>)}
                                                        </FormItem>
                                                        <FormItem label={`Name`} >
                                                            {getFieldDecorator('name', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: `The input is not valid phone!`
                                                                    }
                                                                ]
                                                            })(<Input name="name" onChange={this.getCustomerDetails} value={name}/>)}
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
                                                            })(<Input name="town" onChange={this.getCustomerDetails} value={town}/>)}
                                                        </FormItem>
                                                        <FormItem label={`Area`} >
                                                            {getFieldDecorator('area', {
                                                                rules: [
                                                                    {
                                                                        required: true
                                                                    }
                                                                ]
                                                            })(<Input name="area" onChange={this.getCustomerDetails} value={area}/>)}
                                                        </FormItem>
                                                        <FormItem label={`Block`} >
                                                            {getFieldDecorator('block', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: `The input is not valid phone!`
                                                                    }
                                                                ]
                                                            })(<Input name="block" onChange={this.getCustomerDetails} value={block}/>)}
                                                        </FormItem>
                                                        <FormItem label={`House`} >
                                                            {getFieldDecorator('house', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: `The input is not valid Address!`
                                                                    }
                                                                ]
                                                            })(<Input name="house" onChange={this.getCustomerDetails} value={house}/>)}
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
                                                                                    value = {value.product?value.product.selected?value.product.name:'':''}
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
                                                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handledSubmit} loading={disableBtn}>
                                                        Create
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Fragment>
                    )
                }}
            </Query>
        )
    }
}


const Products_QUERY = gql`
    query ProductQuery {
        products {
            id
            name
            price
        }
    }
`;
withRouter(CreateCustomer);

const CREATE_CUSTOMER_MUTATION = gql`
mutation createCustomer($data: UserCreateInput!) {
    createCustomer(data: $data){
        name
    }
}
`;
const CreateCustomerData = Form.create({ name: 'normal_login' })(CreateCustomer);




export default graphql(CREATE_CUSTOMER_MUTATION, { name: 'createCustomer' })(
    withRouter(CreateCustomerData)
)
