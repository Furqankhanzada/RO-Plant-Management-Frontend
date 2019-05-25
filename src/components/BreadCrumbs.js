import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { Layout, Breadcrumb, Icon } from 'antd';
import { parse } from 'qs'

import Customer from './customers/index.js'
import { Loader } from './common/Loader'
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'

import { GET_CUSTOMERS, CUSTOMER_SUBSCRIPTION } from '../graphql/queries/customer'


class BreadCrumbs extends Component {
    constructor(props){
        super(props);
        this.state = {
            current: 'mail',
            drawer: false
        }
    }

    render() {
        return (
            <Fragment>
                <div className="bread-crumbs">
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <Icon type="home" />
                            <span>Home</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <Icon type="user" />
                            <span>Dashboard</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Application</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
            </Fragment>
        )
    }
}

withRouter(BreadCrumbs);

export default graphql(GET_CUSTOMERS, {

})(BreadCrumbs)
