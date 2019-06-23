import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom'
import { GET_MAIN_DRAWER_STATUS } from '../../client'
import { Query } from 'react-apollo'
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;


class Sidebar extends Component {
    render() {
        const { history, defaultSelectedKeys, defaultOpenKeys } = this.props;
        return (
            <Query query={GET_MAIN_DRAWER_STATUS}>
                {
                    ({ data }) => {
                        const { MainDrawer } = data;
                        if (MainDrawer) {
                            const { open } = MainDrawer;
                            return (
                                <Sider className={` ${open ? 'showHideView' : ''}`} width={200} style={{ background: '#ffffff', boxShadow: '0 0 28px 0 rgba(24,144,255,.1)' }}>
                                    <Menu
                                        mode="inline"
                                        defaultSelectedKeys={defaultSelectedKeys ? defaultSelectedKeys : []}
                                        defaultOpenKeys={defaultOpenKeys ? defaultOpenKeys : []}
                                    >

                                        <Menu.Item key="5" onClick={() => history.push('/dashboard')}>
                                            <Icon type="appstore" />
                                            <span>Dashboard</span>
                                        </Menu.Item>
                                        <Menu.Item key="1" onClick={() => history.push('/customers')}>
                                            <Icon type="team" />
                                            <span>Customers</span>
                                        </Menu.Item>

                                      <Menu.Item key="2" onClick={() => history.push('/transactions')}>
                                        <Icon type="bar-chart" />
                                        <span>Transactions</span>
                                      </Menu.Item>

                                        <SubMenu key="sub2" title={<span><Icon type="shopping" />Products</span>}>
                                            <Menu.Item key="3" onClick={() => history.push('/products/create')}>Create</Menu.Item>
                                            <Menu.Item key="4" onClick={() => history.push('/products')}>List</Menu.Item>
                                        </SubMenu>
                                    </Menu>
                                </Sider>
                            )
                        } else {
                            return null
                        }
                    }
                }
            </Query>

        )
    }
}
export default withRouter(Sidebar);
