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

const columns = [
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Age',
        dataIndex: 'age'
    },
    {
        title: 'Address',
        dataIndex: 'address'
    }
];
const dataSource = [];
for (let i = 0; i < 46; i++) {
    dataSource.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
    });
}

class Products extends Component {
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

    render() {

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const SubMenu = Menu.SubMenu;
        const MenuItemGroup = Menu.ItemGroup;
        const { Header, Content, Sider } = Layout;
        const { discount, result, drawer } = this.state;
        console.log(drawer,'===drawer==pp');
        const children = result.map(email => <Option key={email}>{email}</Option>);

        // products table method //
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: [
                {
                    key: 'all-data',
                    text: 'Select All Data',
                    onSelect: () => {
                        this.setState({
                            selectedRowKeys: [...Array(46).keys()] // 0...45
                        });
                    }
                },
                {
                    key: 'odd',
                    text: 'Select Odd Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }
                            return true;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    }
                },
                {
                    key: 'even',
                    text: 'Select Even Row',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    }
                }
            ],
            onSelection: this.onSelection
        };
        // products table method //

        return (
            <Query query={Products_QUERY}>
                {({ data, loading }) => {
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
                                                <Menu.Item key="1" onClick={()=>this.props.history.push('/customers/create')}>Create</Menu.Item>
                                            </SubMenu>
                                            <Menu.Item key="mail">
                                                <Icon type="gift" />
                                                Products
                                            </Menu.Item>
                                        </Menu>
                                    </Sider>
                                    <Layout className="remove-padding" style={{ padding: '30px 24px 0', height:'100vh' }}>
                                        <div className="create-main-div">
                                            <div className="products-table">
                                                <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
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
    mutation LoginMutation($mobile: String!, $password: String!) {
        login(mobile: $mobile, password: $password) {
            token
            user {
                id
                name
                mobile
            }
        }
    }
`;
const ProductsData = Form.create({ name: 'normal_login' })(Products);

export default ProductsData