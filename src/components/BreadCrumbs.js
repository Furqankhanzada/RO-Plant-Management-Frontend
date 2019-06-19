import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Breadcrumb, Icon } from 'antd';

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
        let breadcrumbNameMap = {
            '/customers': { name: 'Customers', iconType: 'team' },
            '/customers/create': { name: 'Create', iconType: 'user-add' },
            '/customers/update': { name: 'Update', iconType: 'edit' },
            '/products': { name: 'Products', iconType: 'team' },
            '/products/create': { name: 'Create', iconType: 'user-add' },
            '/dashboard': { name: 'Dashboard', iconType: 'appstore' }
        };
        if (!breadcrumbNameMap[pathname]) {
            if (!pathname.split('/')[3]) {
                breadcrumbNameMap[pathname] = { name: pathname.split('/')[2], iconType: pathname.split('/')[2] === 'update' ? 'edit' : '' };
            } else {
                breadcrumbNameMap[pathname] = { name: pathname.split('/')[3] };
            }
        }
        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url === '/customers/update' ? `/customers/${pathname.split('/')[3]}` : url}><Icon type={breadcrumbNameMap[url].iconType} />{breadcrumbNameMap[url].name}</Link>
                </Breadcrumb.Item>
            );
        });
        return (
            <Fragment>
                <div className="bread-crumbs">
                    <Breadcrumb>{extraBreadcrumbItems}</Breadcrumb>
                </div>
            </Fragment>
        )
    }
}



export default withRouter(BreadCrumbs);
