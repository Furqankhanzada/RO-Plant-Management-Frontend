import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { gql } from 'apollo-boost'
import {
    Layout, Menu, Breadcrumb, Icon, Avatar
} from 'antd';
import User from './user/index.js'
import { Loader } from './common/Loader'


class DashboardPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            customers : []
        }
    }
    componentWillReceiveProps(nextProps) {
        const { customers } = nextProps.customers;
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
        const MenuItemGroup = Menu.ItemGroup;
        const { Header, Content, Sider } = Layout;
        const { customers } = this.state;
        console.log(customers,' state customers')
        if (this.props.customers.loading) {
            return (
                <Loader spinning />
            )
        }
        return (
            <Fragment>

                <Layout>
                    <Header className="header header-custom " style={{ backgroundColor: '#ffffff' }}>
                        <div className='nav-logo'>
                            <img alt="logo" src={require('../assests/images/labbaik.png')} className="login-signup-logo" />
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
                        <Sider width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
                            {/* <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%', borderRight: 0 }}
                            >
                                <Menu.Item key="5"><Icon type="team" />Customers</Menu.Item>
                            </Menu> */}
                            <Menu
                                onClick={this.handleClick}
                                mode="inline"
                                >
                                <SubMenu key="sub1" title={<span><Icon type="team" />Customers</span>}>
                                        <Menu.Item key="1" onClick={()=>this.props.history.push('/customers/create')}>Create</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
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
`
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


withRouter(DashboardPage)


export default graphql(CUSTOMERS, {
    name: 'customers', // name of the injected prop: this.props.feedQuery...
    options: {
        fetchPolicy: 'network-only',
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
                        const newPost = subscriptionData.data.userSubscription.node
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
