import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import {
    Layout, Menu, Breadcrumb, Icon, Avatar, Button, Checkbox, Input, Form
} from 'antd';


class CreateCustomer extends Component {
    componentWillReceiveProps(nextProps) {
        //if (this.props.location.key !== nextProps.location.key) {
        //    // this.props.feedQuery.refetch()
        //}
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const SubMenu = Menu.SubMenu;
        const MenuItemGroup = Menu.ItemGroup;
        const { Header, Content, Sider } = Layout;
        return (
            <Fragment>

                <Layout>
                    <Header className="header header-custom " style={{backgroundColor: '#ffffff'}}>
                        <div className='nav-logo'>
                            <img alt="logo" src={require('../assests/images/labbaik.png')} className = "login-signup-logo"/>
                        </div>
                        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu} className="nav-ul">
                            <SubMenu
                                title={
                                <Fragment>
                                    <span style={{ color: '#999', marginRight: 4 }}>
                                        <span>Hi,</span>
                                    </span>
                                    <span>Guest</span>
                                    <Avatar style={{ marginLeft: 8 }} src="https://randomuser.me/api/portraits/men/43.jpg" />
                                </Fragment>
                             }
                                >
                                <Menu.Item key="SignOut">
                                    <span>Sign out</span>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>

                    </Header>
                    <Layout className="dashboard-main">
                    <Sider width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
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
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '30px 24px 0', height:'100vh' }}>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('remember', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                    })(
                                        <Checkbox>Remember me</Checkbox>
                                    )}
                                    <a className="login-form-forgot" href="">Forgot password</a>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>
                                    Or <a href="">register now!</a>
                                </Form.Item>
                            </Form>
                        </Layout>
                    </Layout>
                </Layout>
            </Fragment>
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
`
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
`



const CreateCustomerData = Form.create({ name: 'normal_login' })(CreateCustomer);

export default CreateCustomerData