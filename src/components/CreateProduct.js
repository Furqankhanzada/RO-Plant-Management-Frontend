import React, { Component, Fragment } from 'react';
import  { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import {
    Layout, Menu, Button, Form, Input, InputNumber, Radio, Cascader, Row, AutoComplete, Icon, Col, Table } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { graphql } from 'react-apollo'
import { Query } from 'react-apollo';

const Option = AutoComplete.Option;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class CreatesProducts extends Component {
    constructor(props){
        super(props);
        this.state={
            discount:[
                {
                    percentage:0,
                    product:''
                }
            ],
            name: '',
            password: '',
            mobile: '',
            town: '',
            area: '',
            block: '',
            house: '',
            products:[],
            result: [],
            drawer: false,
            selectedRowKeys: []
        }
    }

    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {

        const { getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const SubMenu = Menu.SubMenu;
        const MenuItemGroup = Menu.ItemGroup;
        const { Header, Content, Sider } = Layout;
        const { discount, result, drawer } = this.state;
        const { history } = this.props;

        console.log(drawer,'===drawer==pp');
        const children = result.map(email => <Option key={email}>{email}</Option>);

        // products table method //
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
        };
        // products table method //

        return (
            <Query query={PRODUCT}>
                {({ data, loading }) => {
                    console.log('data**************', data);
                    const {products} = data;
                    const options = products?products
                        .map(group => (
                            <Option key={group.name} value={group.name}>
                                <span>Volume: {group.name}</span>
                                <br/>
                                <span>Price: {group.price}</span>
                            </Option>
                        )):[];
                    return (
                        <Fragment>

                            <Layout>
                                <AppBar handleClick = {this.openDrawer} />
                                <Layout className="dashboard-main">
                                    <Sidebar handleClick = {this.handleClick} history = {history}/>

                                    <Layout className="remove-padding" style={{ padding: '30px 24px 0', height:'100vh' }}>
                                        <div className="create-main-div">
                                            <div className="create-products">
                                                <Form layout="inline" onSubmit={this.handleSubmit}>
                                                    <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
                                                        {getFieldDecorator('username', {
                                                            rules: [{ required: true, message: 'Please input your name!' }],
                                                        })(
                                                            <Input
                                                                placeholder="Enter Your Name"
                                                                />
                                                        )}
                                                    </Form.Item>
                                                    <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                                                        {getFieldDecorator('password', {
                                                            rules: [{ required: true, message: 'Please input your Number!' }],
                                                        })(
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter Price"
                                                                />
                                                        )}
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                                                            Create
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </div>
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

const FEED_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
            node {
                id
                name
            }
        }
    }
`;
const PRODUCT = gql`
    query ProductQuery {
        products {
            id
            name
            price
        }
    }
`;

withRouter(CreatesProducts);

const ProductsData = Form.create({ name: 'normal_login' })(CreatesProducts);

export default ProductsData