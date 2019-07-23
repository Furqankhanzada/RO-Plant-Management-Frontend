import React, { PureComponent } from 'react'
import { Table, Modal, Tag, Badge, Dropdown, Menu, Icon, Button } from 'antd'
import _ from 'lodash';
import moment from 'moment';
import {gql} from "apollo-boost/lib/index";
import {graphql} from "react-apollo/index";
import { Link, withRouter } from 'react-router-dom'
import { GET_TRANSACTIONS } from '../../graphql/queries/transaction'
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
    const { deleteTransaction } = this.props;
    if (e.key === '1') {
      this.onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record?`,
        onOk: () => {
          this.setState({loading: true});
          deleteTransaction({
            variables: {
              where: {
                id: record.id
              }
            },
            update: (proxy, { data: { deleteTransaction } }) => {
              // Read the data from our cache for this query.
              const data = proxy.readQuery({ query: GET_TRANSACTIONS, variables: { where: { payment: {} } } });
              // Add our comment from the mutation to the end.
              _.remove(data.transactions, (transaction) => {
                return transaction.id === deleteTransaction.id
              });

              data.transactions = [...data.transactions];
              // Write our data back to the cache.
              proxy.writeQuery({ query: GET_TRANSACTIONS, data, variables: { where: { payment: {} } } });
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
        title: <span>Transaction At</span>,
        dataIndex: 'transactionAt',
        key: 'transactionAt',
        render: (text, record) => <Link to={`/transactions/${record.id}`}>{moment(text).format('MMMM Do YYYY')}</Link>,
      },
      {
        title: <span>Name</span>,
        dataIndex: 'user.name',
        key: 'user.name',
        render: (text, record) => <Link to={`/customers/${record.user.id}`}>{text}</Link>,
      },
      {
        title: <span>Type</span>,
        dataIndex: 'type',
        key: 'type',
        render: (text) =><Tag color={`${text === 'PURCHASE' ? 'red' : 'green'}`}><Icon type={`${text === 'PURCHASE' ? 'arrow-left' : 'arrow-right'}`}/>{text}</Tag>,
      },
      {
        title: <span>Status</span>,
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          let color = '#e0e0e0';
          switch (status) {
            case 'PROCESSING':
              color = 'orange';
              break;
            case 'COMPLETED':
              color = 'green';
              break
          }
          return <Tag color={color} >{status}</Tag>
        },
      },
      {
        title: <span>Payment</span>,
        children: [
          {
            title: <span>Method</span>,
            dataIndex: 'payment.method',
            key: 'payment.method',
            render: (method) => {
              return <Tag color='magenta'>{method.replace("_", " ")}</Tag>
            }
          },
          {
            title: <span>Paid</span>,
            dataIndex: 'payment.paid',
            key: 'payment.paid',
            render: (text) => <Badge style={{backgroundColor: '#52c41a'}} count={`Rs${text}`} />
          },
          {
            title: <span>Balance</span>,
            dataIndex: 'payment.balance',
            key: 'payment.balance',
            render: (text) => <Badge style={{backgroundColor: '#ffa0a0'}} count={`Rs${text}`} />
          },
          {
            title: <span>Total</span>,
            dataIndex: 'payment.total',
            key: 'payment.total',
            render: (text, record) => <Badge count={`Rs${record.payment.paid + record.payment.balance}`} />
          },
          {
            title: <span>Status</span>,
            dataIndex: 'payment.status',
            key: 'payment.status',
            render: (status) => {
              let color = 'red';
              switch (status) {
                case 'PAID':
                  color = '#87d068';
                  break;
              }
              return <Tag color={color} >{status}</Tag>
            }
          }
        ]
      },
      {
        title: <span>Items</span>,
        dataIndex: 'items',
        key: 'items',
        render: (text) => text.length,
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
          className="transaction-table"
        size='small'
        pagination={false}
        bordered
        scroll={{ x: 1200 }}
        columns={columns}
        simple
        rowKey={(record, i) => i}
        loading={this.state.loading}
      />
    )
  }
}

withRouter(List);

const DELETE_TRANSACTION_MUTATION = gql`
    mutation deleteTransaction($where: TransactionWhereUniqueInput!) {
        deleteTransaction(where: $where){
            id
        }
    }
`;

export default  graphql(DELETE_TRANSACTION_MUTATION, { name: 'deleteTransaction' })(List)
