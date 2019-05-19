import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd';

import User from './customers/index.js'
import { Loader } from './common/Loader'
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'

import { GET_CUSTOMERS, CUSTOMER_SUBSCRIPTION } from '../graphql/queries/customer'


class CustomersPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 'mail'
        }
    }
    componentDidMount() {
        this.props.subscribeToCustomer();
    }
    componentWillReceiveProps(nextProps) {
        const { error } = nextProps.customersQuery;
        if(error){
            const { graphQLErrors } = error;
            graphQLErrors.forEach((value) => {
                if(value.message === 'Not Authorised!') {
                    localStorage.removeItem('AUTH_TOKEN');
                    window.location.reload()
                }
            })
        }
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    }

    render() {
        const { customers, loading, error } = this.props.customersQuery;
        const { history } = this.props;
        if (loading || error) {
            return (
                <Loader spinning />
            )
        }
            return (
                <Fragment>
                    <Layout>
                        <AppBar />
                        <Layout className="dashboard-main">
                            <Sidebar handleClick = {this.handleClick} history = {history}/>
                            <Layout style={{ padding: '30px 24px 0', height: '100vh' }}>
                                <User customers={customers} history={this.props.history}/>
                            </Layout>
                        </Layout>
                    </Layout>,
                </Fragment>
            )
    }
}

withRouter(CustomersPage);

export default graphql(GET_CUSTOMERS, {
    name: 'customersQuery', // name of the injected prop: this.props.customersQuery...
    props: props => {
        return Object.assign({}, props, {
            subscribeToCustomer: params => {
                return props.customersQuery.subscribeToMore({
                    document: CUSTOMER_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                            return prev
                        }
                        const newCustomer = subscriptionData.data.userSubscription;
                        if(newCustomer) {
                            if (prev.customers.find(customer => customer.id === newCustomer.id)) {
                                return prev
                            }
                            return Object.assign({}, prev, {
                                customers: [...prev.customers, newCustomer]
                            })
                        }
                        // Execute when delete item
                        return Object.assign({}, prev, {
                            customers: [...prev.customers]
                        })
                    }
                })
            }
        })
    }
})(CustomersPage)
