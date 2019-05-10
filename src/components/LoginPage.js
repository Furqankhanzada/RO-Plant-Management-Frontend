import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Row, Form, Input, message } from 'antd'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import { AUTH_TOKEN } from '../constant'

import './LoginPage.css'

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            password: '',
            loading: false
        };
    }

    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                const { mobile, password } = this.state;
                this.props
                    .loginMutation({
                        variables: {
                            mobile,
                            password
                        }
                    })
                    .then(result => {
                        const token = result.data.login.token;
                        this.props.refreshTokenFn &&
                        this.props.refreshTokenFn({
                            [AUTH_TOKEN]: token
                        });
                        message.success('Login SuccessFully');
                        this.props.history.replace('/');
                        window.location.reload()
                    })
                    .catch(err => {
                        message.error('User Does Not Matched');
                        this.setState({
                            loading: false
                        });
                    })
            }
        });
    }
    render() {
        const { form } = this.props;
        const { loading } = this.state;
        const { getFieldDecorator, getFieldsError } = form;

        return (
            <Fragment>
                <div className='form'>
                    <div className='logo'>
                        <img alt="logo" src={require('../assests/images/labbaik.png')} className = "login-signup-logo"/>
                    </div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem hasFeedback>
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {
                                        required: true,
                                    },
                                ],
                            })(
                                <Input
                                    onPressEnter={this.handleOk}
                                    placeholder={`Mobile`}
                                    onChange={e => this.setState({ mobile: e.target.value })}
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
                                    onChange={e => this.setState({ password: e.target.value })}
                                    placeholder={`Password`}
                                />
                            )}
                        </FormItem>

                        <Row>
                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button" disabled={hasErrors(getFieldsError())}>
                                Sign in
                            </Button>
                        </Row>
                    </Form>
                </div>
            </Fragment>
        )
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
`;

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginPage);

export default graphql(LOGIN_USER_MUTATION, { name: 'loginMutation' })(
    withRouter(WrappedNormalLoginForm)
)
