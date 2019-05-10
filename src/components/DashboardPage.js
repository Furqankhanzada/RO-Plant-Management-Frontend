import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import {
    Layout, Menu, Breadcrumb, Icon, Avatar
} from 'antd';
import User from './user/index.js'

class DashboardPage extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.location.key !== nextProps.location.key) {
            // this.props.feedQuery.refetch()
        }
    }

    componentDidMount() {
        // this.props.subscribeToNewFeed()
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
        const { SubMenu } = Menu;
        const { Header, Content, Sider } = Layout;
        if (this.props.feedQuery.loading) {
            return (
                <div className="flex w-100 h-100 items-center justify-center pt7">
                    <div>Loading (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})</div>
                </div>
            )
        }
        return (
            <Fragment>

                <Layout>
                    <Header className="header header-custom " style={{backgroundColor: '#ffffff'}}>
                        <div className='nav-logo'>
                            <img alt="logo" src={require('../assests/images/labbaik.png')} className = "login-signup-logo"/>
                        </div>
                        <Menu key="user" mode="horizontal" onClick={this.handleClickMenu} className="nav-ul">
                            <SubMenu
                                title={
                                <Fragment>
                                    <span style={{ color: '#999', marginRight: 4 }}>
                                        <span>Hi,</span>
                                    </span>
                                    <span>Guest</span>
                                    <Avatar style={{ marginLeft: 8 }} src="https://randomuser.me/api/portraits/men/43.jpg" />
                                </Fragment>
                             }
                                >
                                <Menu.Item key="SignOut">
                                    <span>Sign out</span>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>

                    </Header>
                    <Layout className="dashboard-main">
                        <Sider width={200} style={{ background: '#ffffff', boxShadow:'0 0 28px 0 rgba(24,144,255,.1)' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                                >
                                <Menu.Item key="5"><Icon type="team" />Customers</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '30px 24px 0', height:'100vh' }}>
                            <User/>
                        </Layout>
                    </Layout>
                </Layout>,
            </Fragment>
        )
    }
}

const FEED_QUERY = gql`
    query FeedQuery {
        feed {
            id
            text
            title
            isPublished
            author {
                name
            }
        }
    }
`
const FEED_SUBSCRIPTION = gql`
    subscription FeedSubscription {
        feedSubscription {
            node {
                id
                text
                title
                isPublished
                author {
                    name
                }
            }
        }
    }
`

export default graphql(FEED_QUERY, {
    name: 'feedQuery', // name of the injected prop: this.props.feedQuery...
    options: {
        fetchPolicy: 'network-only',
    },
    props: props =>
        Object.assign({}, props, {
            subscribeToNewFeed: params => {
                return props.feedQuery.subscribeToMore({
                    document: FEED_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                            return prev
                        }
                        const newPost = subscriptionData.data.feedSubscription.node
                        if (prev.feed.find(post => post.id === newPost.id)) {
                            return prev
                        }
                        return Object.assign({}, prev, {
                            feed: [...prev.feed, newPost],
                        })
                    },
                })
            },
        }),
})(DashboardPage)
