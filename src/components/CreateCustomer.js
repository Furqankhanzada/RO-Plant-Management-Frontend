import React, { Component, Fragment } from 'react';
import  { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import {
    Layout, Menu, Button, Form, Input, InputNumber, Radio, Cascader, Row } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'

const FormItem = Form.Item
class CreateCustomer extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {
        const { history, form } = this.props;
        const { getFieldDecorator } = form;
        const SubMenu = Menu.SubMenu;
        const { Header } = Layout;
        return (
            <Fragment>

                <Layout>
                    <AppBar />
                    <Layout className="dashboard-main">
                    <Sidebar handleClick = {this.handleClick} history = {history} defaultSelectedKeys = {['1']}  defaultOpenKeys = {['sub1']}/>

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
withRouter(CreateCustomer)
const CreateCustomerData = Form.create({ name: 'normal_login' })(CreateCustomer);
export default CreateCustomerData