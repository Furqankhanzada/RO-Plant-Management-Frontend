import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import {
    Layout, Menu, Breadcrumb, Icon, Avatar, Button, Checkbox
,  Form, Input, InputNumber, Radio, Modal, Cascader, Row } from 'antd';

const FormItem = Form.Item
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
                            <div className="create-main-div">

                            <Form layout="horizontal">
                                <FormItem label={`Name`} >
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)}
                                </FormItem>
                                <FormItem label={`NickName`} >
                                    {getFieldDecorator('nickName', {
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(<Input />)}
                                </FormItem>
                                <FormItem label={`Gender`} >
                                    {getFieldDecorator('isMale', {
                                        rules: [
                                            {
                                                required: true,
                                                type: 'boolean',
                                            },
                                        ],
                                    })(
                                        <Radio.Group>
                                            <Radio value>
                                                <span>Male</span>
                                            </Radio>
                                            <Radio value={false}>
                                                <span>Female</span>
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                                <FormItem label={`Age`} >
                                    {getFieldDecorator('age', {
                                        rules: [
                                            {
                                                required: true,
                                                type: 'number',
                                            },
                                        ],
                                    })(<InputNumber min={18} max={100} />)}
                                </FormItem>
                                <FormItem label={`Phone`} >
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            {
                                                required: true,
                                                pattern: /^1[34578]\d{9}$/,
                                                message: `The input is not valid phone!`,
                                            },
                                        ],
                                    })(<Input />)}
                                </FormItem>
                                <FormItem label={`Email`} >
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                required: true,
                                                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                                                message: `The input is not valid E-mail!`,
                                            },
                                        ],
                                    })(<Input />)}
                                </FormItem>
                                <FormItem label={`Address`} >
                                    {getFieldDecorator('address', {
                                        rules: [
                                            {
                                                required: true,
                                            },
                                        ],
                                    })(
                                        <Cascader
                                            style={{ width: '100%' }}
                                            options={[]}
                                            placeholder={`Pick an address`}
                                            />
                                    )}
                                </FormItem>
                                <Row>
                                    <Button  type="primary" htmlType="submit" className="login-form-button" >
                                        Create
                                    </Button>
                                </Row>
                            </Form>
                                </div>
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