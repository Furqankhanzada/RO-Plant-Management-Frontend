import React, { Component, Fragment } from 'react';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import {
    Layout, Menu, Button, Form, Input, InputNumber, Radio, Cascader, Row, AutoComplete, Icon, Col, message
} from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { graphql } from 'react-apollo'
import { Query } from 'react-apollo';

const FormItem = Form.Item;
let id = 0;
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

function renderTitle(title) {
    return (
        <span>
            {title}
            <a
                style={{ float: 'right' }}
                href="https://www.google.com/search?q=antd"
                target="_blank"
                rel="noopener noreferrer"
                >
            </a>
        </span>
    );
}

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
    //componentWillReceiveProps(nextProps){
    //    if(nextProps.data.products && nextProps.data){
    //        console.log(nextProps.data.products,' nextProps.data.products')
    //        this.setState({
    //            products: nextProps.data.products
    //        })
    //    }
    //}

    // add field method start here //
    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        });
    };

    add = () => {
        const { discount } = this.state;
        const discountObj = {
            percentage: 0,
            product: ''
        };

        // can use data-binding to get
        discount.push(discountObj);
        this.setState({
            discount
        })
    };
    removeDiscount = (index) => {
        alert();
        const { discount } = this.state;
        discount.splice(index, 1);
        this.setState({
            discount
        })
    };
    onChangeDiscount = (type, index, ev) => {
        console.log(ev,'===ev');
        const { discount } = this.state;
        const discountObject = discount[index];
        console.log(ev, 'evvv');
        if (type == "percentage") {
            discountObject.discount = ev;
        } else {
            const selectedProduct = JSON.parse(ev);
            this.setState({
                selectedValue: selectedProduct.name
            });
            console.log(selectedProduct,'selectp');
            discountObject.product = {
                name: selectedProduct.name,
                price: selectedProduct.price
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

        console.log(this.state.discount,'discounts======');
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                });
                const { name, mobile, password, town, area, block, house, discount } = this.state;

                let customer = {
                    data: {
                        mobile: mobile,
                        name: name,
                        password: password,
                        address: {
                            create: {
                                town: town,
                                area: area,
                                block: block,
                                house: house
                            }
                        },
                        discounts: {
                            create: discount
                        }
                    }
                };

                console.log(customer, '===customer');
                this.props
                    .createCustomer({
                        variables: customer
                    })
                    .then(result => {
                        this.setState({disableBtn: false, name:'', mobile:'', password:'', town:'', area:'', block:'', house:''},() =>
                        {
                            message.success('Customer has been created successfully');
                        });
                        console.log(result, '=====result')
                    })
                    .catch(err => {
                        this.setState({
                            disableBtn: false
                        });
                        const { graphQLErrors } = err;
                        console.log(err, 'errr');
                        // graphQLErrors.forEach(element => {
                        //     message.error(element.message);
                        // });
                        // this.setState({
                        //     loading: false
                        // });
                    })
            }
        });
    };
    // add field method end here //

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    onChange = (value) => {
        console.log('changed', value);
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
        console.log(this.state.discount,'dis=====');

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const SubMenu = Menu.SubMenu;
        const MenuItemGroup = Menu.ItemGroup;
        const { Header, Content, Sider } = Layout;
        const { disableBtn, name, mobile, password, town, area, block, house, selectedValue, discount, result, drawer } = this.state;
        console.log(drawer,'===drawer==pp');
        const children = result.map(email => <Option key={email}>{email}</Option>);

        // add field method start here //
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 }
            }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 }
            }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <div>
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '' : ''}
                    required={false}
                    key={k}
                    >
                    {getFieldDecorator(`names[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input passenger's name or delete this field."
                            }
                        ]
                    })(<Input className="passenger-input" placeholder="passenger name" />)}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                            />
                    ) : null}
                </Form.Item>
                <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '' : ''}
                    required={false}
                    key={k}
                    >
                    {getFieldDecorator(`names[${k}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [
                            {
                                required: true,
                                whitespace: true,
                                message: "Please input passenger's name or delete this field."
                            }
                        ]
                    })(<Input className="passenger-input" placeholder="passenger name" />)}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                            />
                    ) : null}
                </Form.Item>

            </div>
        ));
        // add field method end here //

        return (
            <Query query={Products_QUERY}>
                {({ data, loading }) => {
                    const { products } = data;
                    console.log(products,'options');
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
                                    <Sider className={` ${drawer? 'showHideView' : ''}`} width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
                                        {/* <Menu
                                         mode="inline"
                                         defaultSelectedKeys={['1']}
                                         defaultOpenKeys={['sub1']}
                                         style={{ height: '100%', borderRight: 0 }}
                                         >
                                         <Menu.Item key="5"><Icon type="team" />Customers</Menu.Item>
                                         </Menu> */}
                                        <Menu
                                            onClick={this.handleClick}
                                            mode="inline"
                                            defaultSelectedKeys={['1']}
                                            defaultOpenKeys={['sub1']}
                                            >
                                            <SubMenu key="sub1" title={<span><Icon type="team" />Customers</span>}>
                                                <Menu.Item key="1" onClick={() => this.props.history.push('/customers/create')}>Create</Menu.Item>
                                            </SubMenu>
                                        </Menu>
                                    </Sider>
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
                                                        {/*<div>
                                                         <InputNumber
                                                         defaultValue={100}
                                                         min={0}
                                                         max={100}
                                                         formatter={value => `${value}%`}
                                                         parser={value => value.replace('%', '')}
                                                         onChange=""
                                                         />

                                                         <AutoComplete style={{ width: 200 }} onSearch={this.handleSearch} placeholder="input here">
                                                         {children}
                                                         </AutoComplete>
                                                         </div>*/}



                                                        <div>
                                                            {
                                                                discount.map((value, index) => {
                                                                    console.log(value, 'val======per')
                                                                    return (
                                                                        <div>
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
                                                                                    value = {selectedValue}
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
const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            id
            text
            title
            isPublished
            author {
                name
            }
        }
    }
`;
const FEED_SUBSCRIPTION = gql`
    subscription FeedSubscription {
        feedSubscription {
            node {
                id
                text
                title
                isPublished
                author {
                    name
                }
            }
        }
    }
`;

const Products_QUERY = gql`
    query ProductQuery {
        products {
            id
            name
            price
        }
    }
`;
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
