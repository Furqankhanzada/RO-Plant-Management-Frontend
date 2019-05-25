import React, { Component, Fragment } from 'react';
import  { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import { Layout, AutoComplete, Table } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { Query } from 'react-apollo';
import BreadCrumbs from './BreadCrumbs';

const Option = AutoComplete.Option;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name'
    },
    {
        title: 'Price',
        dataIndex: 'price'
    }
];


class Products extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            drawer: false
        }

    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        })
    };

    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };

    render() {

        const { drawer } = this.state;
        const { history } = this.props;

        return (
            <Query query={PRODUCT}>
                {({ data: { products = [] }, loading }) => {
                     products.map(group => (
                            <Option key={group.name} value={group.name}>
                                <span>Volume: {group.name}</span>
                                <br/>
                                <span>Price: {group.price}</span>
                            </Option>
                        ));
                    return (
                        <Fragment>

                            <Layout>
                                <AppBar handleClick={this.openDrawer} />
                                <Layout className="dashboard-main">
                                    <Sidebar handleClick = {this.handleClick} history = {history} drawer={drawer} />

                                    <Layout className="remove-padding" style={{ padding: '20px 24px 0', height:'100vh' }}>
                                        <BreadCrumbs />
                                        <div className="create-main-div">
                                            <div className="products-table">
                                                <Table columns={columns} dataSource={products} rowKey="id" />
                                            </div>
                                        </div>
                                    </Layout>
                                </Layout>
                            </Layout>
                        </Fragment>
                    )
                }}
            </Query>
        )
    }
}

const PRODUCT = gql`
    query ProductQuery {
        products {
            id
            name
            price
        }
    }
`;

withRouter(Products);


export default Products
