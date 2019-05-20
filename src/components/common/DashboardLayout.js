import React from 'react'
import { Layout } from 'antd';
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom'
import { Sidebar } from './sidebar'
import { AppBar } from './header'
import CustomersDetail from "../customers/Detail";
import CreateProduct from "../CreateProduct";
import CreateCustomer from "../CreateCustomer";
import ProductPage from "../Products";
import CustomersPage from "../CustomersPage";

const ProtectedRoute = ({ component: Component, token, ...rest }) => {
    return token ? (
        <Route {...rest} render={matchProps => <Component {...matchProps} />} />
    ) : (
        <Redirect to="/login" />
    )
};

export const DashboardLayout = ({handleClick}) => {
    return (
        <Layout>
            <AppBar />
            <Layout className="dashboard-main">
                <Sidebar handleClick = {this.handleClick} history={}/>
                <Layout style={{ padding: '30px 24px 0', height: '100vh' }}>
                    <Switch>
                        <ProtectedRoute exact path="/customers" token={this.state.token} component={CustomersPage}/>
                        <ProtectedRoute exact path="/customers/create" token={this.state.token} component={CreateCustomer} />
                        <ProtectedRoute exact path="/customers/:id" token={this.state.token} component={CustomersDetail}/>
                        <ProtectedRoute exact path="/customers/update/:id" token={this.state.token} component={CreateCustomer} />

                        <ProtectedRoute exact path="/products" token={this.state.token} component={ProductPage}/>
                        <ProtectedRoute exact path="/products/create" token={this.state.token} component={CreateProduct} />
                    </Switch>
                </Layout>
            </Layout>
        </Layout>
    )
};
