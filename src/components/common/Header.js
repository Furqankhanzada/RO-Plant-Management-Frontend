import React, { Fragment, Component } from 'react'
import { Layout, Menu, Avatar, Icon, Popover, Button } from 'antd';
import { client } from '../../index'
import { gql } from "apollo-boost/lib/index";
import { ME } from '../../graphql/queries/customer'
import { Query } from 'react-apollo'
const { Header } = Layout;
const SubMenu = Menu.SubMenu;


export class AppBar extends Component {

    openMainDrawer = () => {
        client.mutate({
            mutation: gql`
            mutation openMainDrawer($status: Boolean!) {
                openMainDrawer(status: $status) @client {
                    MainDrawer
                }
            }
            `
        })
    }
    render() {

        const content = (
            <div>
                <div className="notification-details">
                    <p>New User is registered. <Icon type="right" /></p>
                    <span>3 hours ago</span>
                </div>
                <div className="notification-details">
                    <p>Application has been approved. <Icon type="right" /></p>
                    <span>14 hours ago</span>
                </div>
                <div className="clear-notification">
                    <a href="javascript:">Clear notifications</a>
                </div>
            </div>
        );

        const buttonWidth = 70;

        return (
            <Header className="header header-custom " style={{ backgroundColor: '#ffffff' }}>
                <div className='nav-logo'>
                    <img alt="logo" src={require('../../assests/images/labbaik.png')} className="login-signup-logo" />
                    <Icon onClick={this.openMainDrawer} className="toggleIcon" type="menu" />
                </div>
                <Menu key="user" mode="horizontal" className="nav-ul">
                    <SubMenu
                        title={
                            <Fragment>
                                <span style={{ color: '#999', marginRight: 4 }}>

                                    <span>Welcome,</span>
                                </span>
                                <Query query={ME}>
                                    {
                                        ({ data }) => {
                                            const { me } = data || {};
                                            const { name }  = me || '';
                                            return (
                                                <span>{name}</span>
                                            )
                                        }
                                    }
                                </Query>
                                <Avatar style={{ marginLeft: 8 }} src={require('../../assests/images/user.png')} />
                            </Fragment>
                        }
                    >
                        <Menu.Item key="SignOut">
                            <span>Sign out</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                <div style={{ display: 'inline-block', float: 'right', margin: '0 10px' }}>
                    <Popover placement="bottom" content={content} trigger="click">
                        <span className="notification-badge">
                            <Icon type="bell" />
                            <sup data-show="true" className="ant-scroll-number ant-badge-dot" title="2"></sup>
                        </span>
                    </Popover>
                </div>

            </Header>
        )
    }
}
