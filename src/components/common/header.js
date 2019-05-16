import React, { Fragment } from 'react'
import { Layout, Menu, Avatar, Icon } from 'antd';

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export const AppBar = ({handleClick}) => {
    return (
        <Header className="header header-custom " style={{ backgroundColor: '#ffffff' }}>
            <div className='nav-logo'>
                <img alt="logo" src={require('../../assests/images/labbaik.png')} className="login-signup-logo" />
                <Icon onClick={handleClick} className="toggleIcon" type="menu" />
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

        </Header>
    )
};