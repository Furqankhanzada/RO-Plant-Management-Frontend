import React, { PureComponent } from 'react'
import { Table, Modal, Avatar, Dropdown, Menu, Icon, Button } from 'antd'
import _ from 'lodash';
import {gql} from "apollo-boost/lib/index";
import {graphql} from "react-apollo/index";
import { Link, withRouter } from 'react-router-dom'
import { PRODUCTS_QUERY } from '../../graphql/queries/product'
import { DELETE_PRODUCT_MUTATION } from '../../graphql/mutations/product'
import { client } from '../../index'
const { confirm } = Modal;

class List extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: props.loading
        }
    }
    onEditItem(record) {
        const { id } = record;
        client.mutate({
            mutation: gql`
          mutation openDrawer($status: Boolean!, $id: String) {
              openDrawer(status: $status, id: $id) @client {
                  Drawer
              }
          }
      `,
            variables: { status: true, id }
        })
    }
    handleMenuClick (record, e) {
        const { deleteProduct } = this.props;
        if (e.key === '1') {
            this.onEditItem(record);
        } else if (e.key === '2') {
            confirm({
                title: `Are you sure delete this record?`,
                onOk: () => {
                    this.setState({loading: true});
                    deleteProduct({
                        variables: {
                            where: {
                                id: record.id
                            }
                        },
                        update: (proxy, { data: { deleteProduct } }) => {
                            // Read the data from our cache for this query.
                            const data = proxy.readQuery({ query: PRODUCTS_QUERY, variables:{where:{}} });
                            // Add our comment from the mutation to the end.
                            _.remove(data.products, (product) => {
                                return product.id === deleteProduct.id
                            });

                            data.products = [...data.products];
                            // Write our data back to the cache.
                            proxy.writeQuery({ query: PRODUCTS_QUERY, data, variables:{where:{}}});
                            this.setState({loading: false});
                        }
                    })
                }
            })
        }
    }
    actionColumn(text, record) {
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this, record)}>
                <Menu.Item key={1}>Update</Menu.Item>
                <Menu.Item key={2}>Delete</Menu.Item>
            </Menu>
        );
        return (
            <Dropdown overlay={menu}>
                <Button style={{ border: 'none' }}>
                    <Icon style={{ marginRight: 2 }} type="bars" />
                    <Icon type="down" />
                </Button>
            </Dropdown>
        )
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.loading !== this.props.loading) {
            this.setState({
                loading: nextProps.loading
            })
        }
    }
    render() {
        const { ...tableProps } = this.props;
        const columns = [
            {
                title: <span>Name</span>,
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: <span>Price</span>,
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: <span>Operation</span>,
                key: 'id',
                fixed: 'right',
                render: this.actionColumn.bind(this)
            }
        ];

        return (
            <Table
                {...tableProps}
                size='small'
                pagination={false}
                bordered
                scroll={{ x: 1200 }}
                columns={columns}
                simple
                rowKey={record => record.id}
                loading={this.state.loading}
            />
        )
    }
}

withRouter(List);


export default graphql(DELETE_PRODUCT_MUTATION, { name: 'deleteProduct' })(List)
