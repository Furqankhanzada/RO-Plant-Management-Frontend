import React, { Fragment, Component } from 'react'
import { Layout, Menu, Avatar, Icon, Popover, Button } from 'antd';
import { client } from '../../index'
import {gql} from "apollo-boost/lib/index";

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
    render(){

        const text = <span>Title</span>;

        const content = (
            <div>
                <p>Content</p>
                <p>Content</p>
            </div>
        );

        const buttonWidth = 70;

        return (
            <Header className="header header-custom " style={{ backgroundColor: '#ffffff' }}>
                <div className='nav-logo'>
                    <img alt="logo" src={require('../../assests/images/labbaik.png')} className="login-signup-logo" />
                    <Icon onClick={this.openMainDrawer} className="toggleIcon" type="menu" />
                </div>
                <Menu key="user" mode="horizontal"  className="nav-ul">
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
                <div style={{ display: 'inline-block', float: 'right', margin: '0 10px' }}>
                    <Popover placement="bottom" title={text} content={content} trigger="click">
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
