import React, { Component, Fragment } from 'react'
import {
    NavLink,
    Link,
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PageNotFound from './PageNotFound'
import LogoutPage from './LogoutPage'
import DashboardPage from './DashboardPage'
import { AUTH_TOKEN } from '../constant'
import { isTokenExpired } from '../helper/jwtHelper'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    return token ? (
        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    )
};

class RootContainer extends Component {
    constructor(props) {
        super(props);
        this.refreshTokenFn = this.refreshTokenFn.bind(this);

        this.state = {
            token: props.token,
        }
    }

    refreshTokenFn(data = {}) {
        const token = data[AUTH_TOKEN];

        if (token) {
            localStorage.setItem(AUTH_TOKEN, token)
        } else {
            localStorage.removeItem(AUTH_TOKEN)
        }

        this.setState({
            token: data[AUTH_TOKEN],
        })
    }

    bootStrapData() {
        try {
            const token = localStorage.getItem(AUTH_TOKEN);
            if (token !== null && token !== undefined) {
                const expired = isTokenExpired(token);
                if (!expired) {
                    this.setState({ token: token })
                } else {
                    localStorage.removeItem(AUTH_TOKEN);
                    this.setState({ token: null })
                }
            }
        } catch (e) {
            console.log('')
        }
    }

    //verify localStorage check
    componentDidMount() {
        this.bootStrapData()
    }

    render() {
        return (
            <Router>
                <Fragment>
                    {this.renderNavBar()}
                    {this.renderRoute()}
                </Fragment>
            </Router>
        )
    }

    renderNavBar() {
        return (
            <nav className="pa3 pa4-ns">
                <Link className="link dim black b f6 f5-ns dib mr3" to="/" title="Feed">
                    Blog
                </Link>
                <NavLink
                    className="link dim f6 f5-ns dib mr3 black"
                    activeClassName="gray"
                    exact={true}
                    to="/"
                    title="Feed"
                >
                    Feed
                </NavLink>
                {this.props.data &&
                this.props.data.me &&
                this.props.data.me.mobile &&
                this.state.token && (
                    <NavLink
                        className="link dim f6 f5-ns dib mr3 black"
                        activeClassName="gray"
                        exact={true}
                        to="/drafts"
                        title="Drafts"
                    >
                        Drafts
                    </NavLink>
                )}
                {this.state.token ? (
                    <div
                        onClick={() => {
                            this.refreshTokenFn &&
                            this.refreshTokenFn({
                                [AUTH_TOKEN]: null,
                            });
                            window.location.href = '/'
                        }}
                        className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
                    >
                        Logout
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
                    >
                        Login
                    </Link>
                )}
                {this.props.data &&
                this.props.data.me &&
                this.props.data.me.mobile &&
                this.state.token && (
                    <Link
                        to="/create"
                        className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
                    >
                        + Create Draft
                    </Link>
                )}
            </nav>
        )
    }

    renderRoute() {
        return (
            <div className="fl w-100 pl4 pr4">
                <Switch>
                    <ProtectedRoute exact path="/" token={this.state.token} component={DashboardPage} />

                    {/*<ProtectedRoute*/}
                        {/*token={this.state.token}*/}
                        {/*path="/"*/}
                        {/*component={DashboardPage}*/}
                    {/*/>*/}

                    <Route
                        token={this.state.token}
                        path="/login"
                        render={props => <LoginPage refreshTokenFn={this.refreshTokenFn} />}
                    />
                    <Route
                        token={this.state.token}
                        path="/signup"
                        render={props => (
                            <SignupPage refreshTokenFn={this.refreshTokenFn} />
                        )}
                    />
                    <Route path="/logout" component={LogoutPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </div>
        )
    }
}

const ME_QUERY = gql`
    query MeQuery {
        me {
            id
            mobile
            name
        }
    }
`;

export default graphql(ME_QUERY, {
    options: {
        errorPolicy: 'all',
    },
})(RootContainer)
