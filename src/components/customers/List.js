import React, { PureComponent } from 'react'
import { Table, Modal, Avatar, Dropdown, Menu, Icon, Button } from 'antd'
import _ from 'lodash';
import {gql} from "apollo-boost/lib/index";
import {graphql} from "react-apollo/index";
import { Link, withRouter } from 'react-router-dom'
import { GET_CUSTOMERS } from '../../graphql/queries/customer'
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
              const data = proxy.readQuery({ query: GET_CUSTOMERS, variables:{where:{}} });
              // Add our comment from the mutation to the end.
              _.remove(data.customers, (customer) => {
                return customer.id === deleteCustomer.id
              });

              data.customers = [...data.customers];
              // Write our data back to the cache.
              proxy.writeQuery({ query: GET_CUSTOMERS, data, variables:{where:{}}});
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
        title: <span>Sr. no</span>,
        dataIndex: 'avatar',
        key: 'avatar',
        width: 72,
        fixed: 'left',
        render: (text, record, i) => <Avatar style={{ marginLeft: 8 }}>{i+1}</Avatar>,
      },
      {
        title: <span className="space-left">Name</span>,
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link className="space-left" to={`/customers/${record.id}`}>{text}</Link>,
      },
      {
        title: <span>Mobile</span>,
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: <span>Address</span>,
        dataIndex: 'address',
        key: 'address',
        render: (text) => `${text.house} ${text.area} ${text.block} ${text.town}`
      },
      {
        title: <span>Bottles balance</span>,
        dataIndex: 'bottleBalance',
        key: 'bottleBalance',
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

const DELETE_CUSTOMER_MUTATION = gql`
    mutation deleteCustomer($where: UserWhereUniqueInput!) {
        deleteCustomer(where: $where){
            id
        }
    }
`;

export default graphql(DELETE_CUSTOMER_MUTATION, { name: 'deleteCustomer' })(List)
