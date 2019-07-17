import React, { Component, Fragment } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    withRouter
} from 'react-router-dom'
import LoginPage from './LoginPage'
import ProductPage from './Products'
import CustomersPage from './CustomersPage'
import CustomersDetail from "./customers/Detail";
import TransactionsPage from './TransactionsPage'
import TransactionsDetail from "./transactions/Detail";
import { Layout } from 'antd';
import CreateProduct from './CreateProduct'
import { AUTH_TOKEN } from '../constant'
import { isTokenExpired } from '../helper/jwtHelper'
import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
import BreadCrumbs from "./BreadCrumbs";
import Dashboard from "./Dashboard";
import Sidebar from './common/Sidebar'
import { AppBar } from './common/Header'
import { ME } from '../graphql/queries/customer'


const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    return token ? (
        <Fragment>
            <Layout>
                <AppBar />
                <Layout className="dashboard-main">
                    <Sidebar />
                    <Layout style={{ padding: '20px 24px 0', height: '100vh' }}>
                        <BreadCrumbs />
                        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
                    </Layout>
                </Layout>
            </Layout>,
        </Fragment>
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

                {this.renderRoute()}

            </Router>
        )
    }

    renderRoute() {
        return (
            <div className="fl w-100 pl4 pr4">
                <Switch>
                    <ProtectedRoute exact path="/" token={this.state.token} component={CustomersPage} />
                    <ProtectedRoute exact path="/customers" token={this.state.token} component={CustomersPage} />
                    <ProtectedRoute exact path="/customers/:id" token={this.state.token} component={CustomersDetail} />

                    <ProtectedRoute exact path="/transactions" token={this.state.token} component={TransactionsPage} />
                    <ProtectedRoute exact path="/transactions/:id" token={this.state.token} component={TransactionsDetail} />

                    <ProtectedRoute exact path="/products" token={this.state.token} component={ProductPage} />
                    <ProtectedRoute exact path="/dashboard" token={this.state.token} component={Dashboard} />
                    <ProtectedRoute exact path="/products/create" token={this.state.token} component={CreateProduct} />
                    <UnProtectedRoute exact token={this.state.token} path="/login" component={LoginPage} />
                </Switch>
            </div>
        )
    }
}


withRouter(RootContainer);

export default graphql(ME, {
    options: {
        errorPolicy: 'all'
    }
})(RootContainer)
