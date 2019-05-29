import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter, Link } from 'react-router-dom'
import { Layout, Breadcrumb, Icon } from 'antd';
import { parse } from 'qs'

import Customer from './customers/index.js'
import { Loader } from './common/Loader'
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'

import { GET_CUSTOMERS, CUSTOMER_SUBSCRIPTION } from '../graphql/queries/customer'


class BreadCrumbs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'mail',
            drawer: false
        }
    }

    render() {
        const { history } = this.props;
        const { location } = history;
        const { pathname } = location;
        const pathSnippets = pathname.split('/').filter(i => i);
        const breadcrumbNameMap = {
            '/customers': {name:'Customers',iconType:'team'},
            '/customers/create': {name:'Create',iconType:'user-add'},
            '/products': {name:'Products',iconType:'team'},
            '/products/create': {name:'Create',iconType:'user-add'},
          };
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return (
              <Breadcrumb.Item key={url}>
                <Link to={url}><Icon type={breadcrumbNameMap[url].iconType} />{breadcrumbNameMap[url].name}</Link>
              </Breadcrumb.Item>
            );
          });
          const breadcrumbItems = [
            <Breadcrumb.Item key="home">
              <Link to="/">Home</Link>
            </Breadcrumb.Item>,
          ].concat(extraBreadcrumbItems);
       
          console.log(pathname, '====match')
        return (
            <Fragment>
                <div className="bread-crumbs">
                <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>
                                    {/* {
                        pathname === '/customers/create' || pathname === '/customers' ? (
                            <Breadcrumb>
                                <Breadcrumb.Item onClick={() =>pathname!== '/customers' ? history.push('/customers') : null}>
                                    <Icon type="home" />
                                    <span>Customers</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item onClick={() => pathname!== '/customers/create' ? history.push('/customers/create') : null}>
                                    <Icon type="user" />
                                    <span>Create</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        ) : (
                                <Breadcrumb>
                                    <Breadcrumb.Item onClick={() =>pathname!== '/products' ? history.push('/products') : null}>
                                        <Icon type="home" />
                                        <span>Products</span>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item onClick={() =>pathname!== '/products/create' ? history.push('/products/create') : null}>
                                        <Icon type="user" />
                                        <span>Create</span>
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            )
                    } */}
                </div>
            </Fragment>
        )
    }
}



export default withRouter(BreadCrumbs);
