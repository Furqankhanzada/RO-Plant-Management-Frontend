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

    render() {
        const { loading, form, i18n } = this.props;
        return (
            <Fragment>

                <Fragment>
                    <div className='form'>
                        <div className='logo'>
                            <img alt="logo" src='https://antd-admin.zuiidea.com/logo.svg'/>
                            <span>RO PLANT</span>
                        </div>
                        <form>
                            <FormItem hasFeedback>
                                <Input
                                    onPressEnter={this.handleOk}
                                    placeholder={`Username`}
                                />
                            </FormItem>
                            <FormItem hasFeedback>
                                <Input
                                    type="password"
                                    onPressEnter={this.handleOk}
                                    placeholder={`Password`}
                                />
                            </FormItem>
                            <Row>
                                <Button
                                    type="primary"
                                    onClick={this.handleOk}
                                >
                                    <span>Sign in</span>
                                </Button>
                            </Row>
                            <h3>
                                Don't have an account? <a href="/signup">Signup</a>
                            </h3>
                        </form>
                    </div>

                </Fragment>


                {/* <div>
                    <h3>
                        Don't have an account? <a href="/signup">Signup</a>
                    </h3>
                    <input
                        autoFocus
                        className="w-100 pa2 mv2 br2 b--black-20 bw1"
                        placeholder="Email"
                        type="mobile"
                        onChange={e => this.setState({ mobile: e.target.value })}
                        value={this.state.mobile}
                    />
                    <input
                        autoFocus
                        className="w-100 pa2 mv2 br2 b--black-20 bw1"
                        placeholder="Password"
                        type="password"
                        onChange={e => this.setState({ password: e.target.value })}
                        value={this.state.password}
                    />
                    {this.state.mobile &&
                        this.state.password && (
                            <Button
                                type="primary"
                                onClick={this._login}
                            >
                                Sign in
                        </Button>

                        )}
                </div> */}
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


export default graphql(LOGIN_USER_MUTATION, { name: 'loginMutation' })(
    withRouter(LoginPage),
)
