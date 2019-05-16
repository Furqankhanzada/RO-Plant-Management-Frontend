import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { gql } from 'apollo-boost'
import {
    Layout, Menu, Breadcrumb, Icon, Avatar
} from 'antd';

import User from './user/index.js'
import { Loader } from './common/Loader'
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'


class DashboardPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            customers : []
        }
    }
    componentWillReceiveProps(nextProps) {
        const { customers, error } = nextProps.customers;
        if(error){
            const { graphQLErrors } = error;
            graphQLErrors.map((value,index) => {
                if(value.message === 'Not Authorised!') {
                    localStorage.removeItem('AUTH_TOKEN');
                    window.location.reload()
                }
            })
        }

        if(customers){
            this.setState({
                customers
            })
        }
        if (this.props.location.key !== nextProps.location.key) {

            // this.props.feedQuery.refetch()
        }
    }

    state = {
        current: 'mail'
    };

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key
        });
    };

    render() {
        const SubMenu = Menu.SubMenu;
        const { Header } = Layout;
        const { customers } = this.state;
        const { loading, error } = this.props.customers;
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

const FEED_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
            node {
                id
                name
            }
        }
    }
`;
const CUSTOMERS = gql`
query{
customers{
    name
    id
    mobile
    address{
      town
      house
      block
    }
    createdAt
    bottle{
      balance
    }
  }
}
`;


withRouter(DashboardPage);


export default graphql(CUSTOMERS, {
    name: 'customers', // name of the injected prop: this.props.feedQuery...
    options: {
        fetchPolicy: 'network-only'
    },
    props: props =>
        Object.assign({}, props, {  
            subscribeToCustomer: params => {
                return props.customers.subscribeToMore({
                    document: FEED_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                            return prev
                        }
                        const newPost = subscriptionData.data.userSubscription.node;
                        if (prev.feed.find(post => post.id === newPost.id)) {
                            return prev
                        }
                        return Object.assign({}, prev, {
                            feed: [...prev.feed, newPost]
                        })
                    }
                })
            }
        })
})(DashboardPage)
