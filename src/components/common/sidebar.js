import React from 'react'
import { Layout, Menu, Icon } from 'antd';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


export const Sidebar = ({ handleClick, history, defaultSelectedKeys, defaultOpenKeys }) => {
    return (
        <Sider width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
            <Menu 
                onClick={handleClick} 
                mode="inline"
                defaultSelectedKeys={ defaultSelectedKeys ? defaultSelectedKeys : []}
                defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : []}
            >
                <SubMenu key="sub1" title={<span><Icon type="team" />Customers</span>}>
                    <Menu.Item key="1" onClick={() => history.push('/customers/create')}>Create</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
    )
};