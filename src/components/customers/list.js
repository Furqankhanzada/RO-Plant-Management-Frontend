import React, { PureComponent } from 'react'
import { Table, Modal, Avatar, Dropdown, Menu, Icon, Button } from 'antd'
import _ from 'lodash';
import {gql} from "apollo-boost/lib/index";
import {graphql} from "react-apollo/index";

import { GET_CUSTOMERS } from '../../graphql/queries/customer'

const { confirm } = Modal;

class List extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }
    onEditItem(record) {
        this.props.history.push(`/customers/update/${record.id}`)
    }
    handleMenuClick (record, e) {
        const { deleteCustomer } = this.props;
        if (e.key === '1') {
            this.onEditItem(record);
        } else if (e.key === '2') {
            confirm({
                title: `Are you sure delete this record?`,
                onOk: () => {
                    this.setState({loading: true});
                    deleteCustomer({
                        variables: {
                            where: {
                                id: record.id
                            }
                        },
                        update: (proxy, { data: { deleteCustomer } }) => {
                            // Read the data from our cache for this query.
                            const data = proxy.readQuery({ query: GET_CUSTOMERS });
                            // Add our comment from the mutation to the end.
                            _.remove(data.customers, (customer) => {
                                return customer.id === deleteCustomer.id
                            });

                            data.customers = [...data.customers];
                            // Write our data back to the cache.
                            proxy.writeQuery({ query: GET_CUSTOMERS, data });
                            this.setState({loading: false});
                        }
                    })
                }
            })
        }
    };

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

    render() {
        const { history, ...tableProps } = this.props;
        const columns = [
            {
                title: <span>Avatar</span>,
                dataIndex: 'avatar',
                key: 'avatar',
                width: 72,
                fixed: 'left',
                render: text => <Avatar style={{ marginLeft: 8 }} src={text} />,
            },
            {
                title: <span>Name</span>,
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: <span>Mobile</span>,
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: <span>Town</span>,
                dataIndex: 'address.town',
                key: 'address.town',
            },
            {
                title: <span>Block</span>,
                dataIndex: 'address.block',
                key: 'address.block',
            },
            {
                title: <span>Address</span>,
                dataIndex: 'address.house',
                key: 'address.house',
            },
            {
                title: <span>Balance</span>,
                dataIndex: 'bottle.balance',
                key: 'bottle.balance',
            },
            {
                title: <span>CreateTime</span>,
                dataIndex: 'createdAt',
                key: 'createdAt',
            },
            {
                title: <span>Operation</span>,
                key: 'id',
                fixed: 'right',
                render: this.actionColumn.bind(this),
            }
        ]

        return (
            <Table
                {...tableProps}
                pagination={{ ...tableProps.pagination, showTotal: total =>`Total ${total} Items`}}
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

const DELETE_CUSTOMER_MUTATION = gql`
    mutation deleteCustomer($where: UserWhereUniqueInput!) {
        deleteCustomer(where: $where){
            id
        }
    }
`;

export default graphql(DELETE_CUSTOMER_MUTATION, { name: 'deleteCustomer' })(List)
