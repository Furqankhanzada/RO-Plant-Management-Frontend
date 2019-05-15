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
import ProductPage from './Products'
import SignupPage from './SignupPage'
import PageNotFound from './PageNotFound'
import LogoutPage from './LogoutPage'
import DashboardPage from './DashboardPage'
import CreateCustomer from './CreateCustomer'
import { AUTH_TOKEN } from '../constant'
import { isTokenExpired } from '../helper/jwtHelper'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { Menu, Icon, Layout, Avatar, Popover, Badge, List } from 'antd'
import classnames from 'classnames'
//import styles from './Header.less'

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    return token ? (
        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    )
};



const UnProtectedRoute = ({ component: Component, token, ...rest }) => {
    return !token ? (
        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/customers" />
    )
};
const { SubMenu } = Menu

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
        console.log(token,'token===')
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
                console.log(expired,'====')
                if (!expired) {
                    this.setState({ token: token })
                } else {
                    localStorage.removeItem(AUTH_TOKEN);
                    this.setState({ token: null })
                }
            }
        } catch (e) {
            localStorage.removeItem(AUTH_TOKEN);
            this.setState({ token: null })
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
                    {
                        // this.renderNavBar()
                    }
                    {this.renderRoute()}
                </Fragment>
            </Router>
        )
    }

    //renderNavBar() {
    //    const {
    //        i18n,
    //        fixed,
    //        avatar,
    //        username,
    //        collapsed,
    //        notifications,
    //        onCollapseChange,
    //        onAllNotificationsRead,
    //        } = this.props;
    //
    //    const rightContent = [
    //        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu}>
    //            <SubMenu
    //                title={
    //        <Fragment>
    //          <span style={{ color: '#999', marginRight: 4 }}>
    //            <span>Hi,</span>
    //          </span>
    //          <span>{username}</span>
    //          <Avatar style={{ marginLeft: 8 }} src={avatar} />
    //        </Fragment>
    //      }
    //                >
    //                <Menu.Item key="SignOut">
    //                    <span>Sign out</span>
    //                </Menu.Item>
    //            </SubMenu>
    //        </Menu>,
    //    ]
    //    return (
    //        //<nav className="pa3 pa4-ns">
    //        //    <Link className="link dim black b f6 f5-ns dib mr3" to="/" title="Feed">
    //        //        Blog
    //        //    </Link>
    //        //    <NavLink
    //        //        className="link dim f6 f5-ns dib mr3 black"
    //        //        activeClassName="gray"
    //        //        exact={true}
    //        //        to="/"
    //        //        title="Feed"
    //        //        >
    //        //        Feed
    //        //    </NavLink>
    //        //    {this.props.data &&
    //        //    this.props.data.me &&
    //        //    this.props.data.me.mobile &&
    //        //    this.state.token && (
    //        //        <NavLink
    //        //            className="link dim f6 f5-ns dib mr3 black"
    //        //            activeClassName="gray"
    //        //            exact={true}
    //        //            to="/drafts"
    //        //            title="Drafts"
    //        //            >
    //        //            Drafts
    //        //        </NavLink>
    //        //    )}
    //        //    {this.state.token ? (
    //        //        <div
    //        //            onClick={() => {
    //        //                this.refreshTokenFn &&
    //        //                this.refreshTokenFn({
    //        //                    [AUTH_TOKEN]: null,
    //        //                });
    //        //                window.location.href = '/'
    //        //            }}
    //        //            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
    //        //            >
    //        //            Logout
    //        //        </div>
    //        //    ) : (
    //        //        <Link
    //        //            to="/login"
    //        //            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
    //        //            >
    //        //            Login
    //        //        </Link>
    //        //    )}
    //        //    {this.props.data &&
    //        //    this.props.data.me &&
    //        //    this.props.data.me.mobile &&
    //        //    this.state.token && (
    //        //        <Link
    //        //            to="/create"
    //        //            className="f6 link dim br1 ba ph3 pv2 fr mb2 dib black"
    //        //            >
    //        //            + Create Draft
    //        //        </Link>
    //        //    )}
    //        //</nav>
    //        <Layout.Header
    //            className={classnames(styles.header, {
    //      [styles.fixed]: fixed,
    //      [styles.collapsed]: collapsed,
    //    })}
    //            id="layoutHeader"
    //            >
    //            <div
    //                className={styles.button}
    //                onClick={onCollapseChange.bind(this, !collapsed)}
    //                >
    //                <Icon
    //                    type={classnames({
    //          'menu-unfold': collapsed,
    //          'menu-fold': !collapsed,
    //        })}
    //                    />
    //            </div>
    //
    //            <div className={styles.rightContainer}>{rightContent}</div>
    //        </Layout.Header>
    //    )
    //}

    renderRoute() {
        return (
            <div className="fl w-100 pl4 pr4">
                <Switch>
                    <ProtectedRoute exact path="/customers" token={this.state.token} component={DashboardPage}/>
                                <ProtectedRoute exact path="/customers/create" token={this.state.token} component={CreateCustomer} />

                    {/* <ProtectedRoute exact token={this.state.token} path="/" component={DashboardPage} /> */}
                    <UnProtectedRoute exact token={this.state.token} path="/login" component={LoginPage} />

                    
                    <Route
                        token={this.state.token}
                        path="/login"
                        render={props => <LoginPage refreshTokenFn={this.refreshTokenFn}  token={this.state.token} />}
                        />
                    <Route
                        token={this.state.token}
                        path="/signup"
                        render={props => (
                            <SignupPage refreshTokenFn={this.refreshTokenFn} />
                        )}
                    />
                    <Route
                        token={this.state.token}
                        path="/products"
                        render={props => <ProductPage refreshTokenFn={this.refreshTokenFn}  token={this.state.token} />}
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
