import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Row, Form, Icon, Input } from 'antd'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import { AUTH_TOKEN } from '../constant'

import './LoginPage.css'
const FormItem = Form.Item

class LoginPage extends Component {
    state = {
        mobile: '',
        password: '',
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { mobile, password } = this.state
                this.props
                    .loginMutation({
                        variables: {
                            mobile,
                            password,
                        },
                    })
                    .then(result => {
                        const token = result.data.login.token
                        this.props.refreshTokenFn &&
                        this.props.refreshTokenFn({
                            [AUTH_TOKEN]: token,
                        })
                        this.props.history.replace('/');
                        window.location.reload()
                    })
                    .catch(err => {
                        console.log('error')
                    })
            }
        });
    }
    render() {
        const { loading, form, i18n } = this.props;
        const { getFieldDecorator } = form;

        return (
                <Fragment>
                    <div className='form'>
                        <div className='logo'>
                            <img alt="logo" src={require('../assests/images/labbaik.png')} className = "login-signup-logo"/>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem hasFeedback>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Input
                                        onPressEnter={this.handleOk}
                                        placeholder={`Username`}
                                        />
                                )}
                            </FormItem>
                            <FormItem hasFeedback>
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                        },
                                    ],
                                })(
                                    <Input
                                        type="password"
                                        onPressEnter={this.handleOk}
                                        placeholder={`Password`}
                                        />
                                )}
                            </FormItem>

                            <Row>
                                <Button
                                    type="primary" htmlType="submit" className="login-form-button"
                                >Sign in</Button>
                            </Row>
                            <h3 class="login-signup-switcher">
                                Don't have an account? <a href="/signup" className="signup-link">Signup</a>
                            </h3>
                        </Form>
                    </div>

                </Fragment>


        )
    }
    _login = async e => {
        const { mobile, password } = this.state
        this.props
            .loginMutation({
                variables: {
                    mobile,
                    password,
                },
            })
            .then(result => {
                const token = result.data.login.token
                this.props.refreshTokenFn &&
                    this.props.refreshTokenFn({
                        [AUTH_TOKEN]: token,
                    })
                this.props.history.replace('/');
                window.location.reload()
            })
            .catch(err => {
                console.log('error')
            })
    }
}
const LOGIN_USER_MUTATION = gql`
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
`

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginPage);

export default graphql(LOGIN_USER_MUTATION, { name: 'loginMutation' })(
    withRouter(WrappedNormalLoginForm),
)
