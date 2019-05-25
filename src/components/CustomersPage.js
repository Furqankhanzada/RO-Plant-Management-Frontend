import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd';
import { parse } from 'qs'

import Customer from './customers/index.js'
import { Loader } from './common/Loader'
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import BreadCrumbs from './BreadCrumbs';

import { GET_CUSTOMERS, CUSTOMER_SUBSCRIPTION } from '../graphql/queries/customer'


class CustomersPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 'mail',
            drawer: false
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        const { customersQuery: { refetch }, location: { search } } = this.props;
        const query = parse(search);
        refetch({
            where: {
                name_contains: query.name
            }
        })
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
    };

    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };

    render() {

        const { drawer } = this.state;
        const { customers, loading, error } = this.props.customersQuery;
        const { history } = this.props;
            return (
                <Fragment>
                    <Layout>
                        <AppBar handleClick={this.openDrawer} />
                        <Layout className="dashboard-main">
                            <Sidebar handleClick = {this.handleClick} history = {history} drawer={drawer} />
                            <Layout style={{ padding: '20px 24px 0', height: '100vh' }}>
                                <BreadCrumbs />
                                <Customer customers={customers} loading={loading} history={this.props.history}/>
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
    options: ({ location : { search = {}} }) => {
        const query = parse(search);
        return {
            variables: {
                where: {
                    name_contains: query.name
                }
            }
        }
    },
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
