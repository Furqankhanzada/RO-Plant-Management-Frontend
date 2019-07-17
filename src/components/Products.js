import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { withRouter } from 'react-router-dom'
import { AutoComplete, Table } from 'antd';
import { Query } from 'react-apollo';

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
    constructor(props) {
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
        return (
            <Query query={PRODUCT}>
                {({ data: { products = [] }, loading }) => {
                    products.map(group => (
                        <Option key={group.name} value={group.name}>
                            <span>Volume: {group.name}</span>
                            <br />
                            <span>Price: {group.price}</span>
                        </Option>
                    ));
                    return (
                        <div className="create-main-div">
                            <div className="products-table">
                                <Table columns={columns} pagination={false} dataSource={products} rowKey="id" />
                            </div>
                        </div>
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
