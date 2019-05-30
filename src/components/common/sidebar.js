import React, { Component, Fragment } from 'react'
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class Sidebar extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { history, defaultSelectedKeys, defaultOpenKeys, drawer } = this.props;
        return (
            <Sider className={` ${drawer ? 'showHideView' : ''}`} width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={defaultSelectedKeys ? defaultSelectedKeys : []}
                    defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : []}
                >
                    <SubMenu key="sub1" title={<span><Icon type="team" />Customers</span>}>
                        <Menu.Item key="1" onClick={() => history.push('/customers/create')}>Create</Menu.Item>
                        <Menu.Item key="2" onClick={() => history.push('/customers')}>List</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="team" />Products</span>}>
                        <Menu.Item key="3" onClick={() => history.push('/products/create')}>Create</Menu.Item>
                        <Menu.Item key="4" onClick={() => history.push('/products')}>List</Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }
}
export default withRouter(Sidebar);