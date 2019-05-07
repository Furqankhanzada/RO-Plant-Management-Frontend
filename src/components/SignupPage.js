import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { AUTH_TOKEN } from '../constant'

class SignupPage extends Component {
    state = {
        mobile: '',
        password: '',
        name: '',
    }

    render() {
        return (
            <div className="pa4 flex justify-center bg-white">
                <form onSubmit={this._signup}>
                    <h3>
                        Already have an account!!! <a href="/login"> Login</a>
                    </h3>
                    <input
                        autoFocus
                        className="w-100 pa2 mv2 br2 b--black-20 bw1"
                        placeholder="Name"
                        type="text"
                        onChange={e => this.setState({ name: e.target.value })}
                        value={this.state.name}
                    />
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
                        placeholder="Enter Password"
                        type="password"
                        onChange={e => this.setState({ password: e.target.value })}
                        value={this.state.password}
                    />

                    <input
                        className={`pa3 bg-black-10 dim pointer}`}
                    disabled={
                    !this.state.mobile || !this.state.name || !this.state.password
                }
                      type="submit"
                      value="Sign Up"
                />
            </form>
    </div>
    )
    }

    _signup = async e => {
        e.preventDefault()
        const { mobile, name, password } = this.state
        const result = await this.props.signupMutation({
            variables: {
                name,
                mobile,
                password,
            },
        })

        const token = result.data.signup.token
        localStorage.setItem(AUTH_TOKEN, token)

        this.props.refreshTokenFn &&
        this.props.refreshTokenFn({
            [AUTH_TOKEN]: token,
        })

        this.props.history.replace('/')
        window.location.reload()
    }
}

const SIGNUP_USER_MUTATION = gql`
    mutation SignupMutation($mobile: String!, $password: String!, $name: String!) {
        signup(mobile: $mobile, password: $password, name: $name) {
            token
            user {
                id
                name
                mobile
            }
        }
    }
`

export default graphql(SIGNUP_USER_MUTATION, { name: 'signupMutation' })(
    withRouter(SignupPage),
)
