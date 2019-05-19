import React, { Component, Fragment } from 'react'
import {
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
import CreateProduct from './CreateProduct'
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



const UnProtectedRoute = ({ component: Component, token, ...rest }) => {
    return !token ? (
        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/customers" />
    )
};

class RootContainer extends Component {
    constructor(props) {
        super(props);
        this.refreshTokenFn = this.refreshTokenFn.bind(this);

        this.state = {
            token: props.token
        }
    }

    refreshTokenFn(data = {}) {
        const token = data[AUTH_TOKEN];
        console.log(token,'token===');
        if (token) {
            localStorage.setItem(AUTH_TOKEN, token)
        } else {
            localStorage.removeItem(AUTH_TOKEN)
        }

        this.setState({
            token: data[AUTH_TOKEN]
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

    renderRoute() {
        return (
            <div className="fl w-100 pl4 pr4">
                <Switch>
                    <ProtectedRoute exact path="/customers" token={this.state.token} component={DashboardPage}/>
                    <ProtectedRoute exact path="/products" token={this.state.token} component={ProductPage}/>

                    <ProtectedRoute exact path="/customers/create" token={this.state.token} component={CreateCustomer} />
                    <ProtectedRoute exact path="/customers/update/:id" token={this.state.token} component={CreateCustomer} />
                    <ProtectedRoute exact path="/products/create" token={this.state.token} component={CreateProduct} />

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
        errorPolicy: 'all'
    }
})(RootContainer)
