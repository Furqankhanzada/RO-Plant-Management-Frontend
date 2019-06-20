import React, { PureComponent } from 'react'
import { Table, Divider, Tag, Descriptions, Badge } from 'antd';
import { Query } from 'react-apollo';
import { Layout, Card, Icon, Empty, Row, Col, Statistic, Spin } from 'antd';
import { GET_TRANSACTION } from '../../graphql/queries/transaction'

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text, record) => (
         <span>Jun 19 2019</span>
      )
  },
  {
    title: 'Name',
    dataIndex: 'product.name',
    key: 'name'
  },
  {
    title: 'Price',
    dataIndex: 'product.price',
    key: 'price'
  },
  {
    title: 'Discount',
    dataIndex: 'discount',
    key: 'discount'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  //{
  //  title: 'Bottle In',
  //  dataIndex: 'bottleIn',
  //  key: 'bottleIn'
  //},
  //{
  //  title: 'Bottle Out',
  //  dataIndex: 'bottleOut',
  //  key: 'bottleOut'
  //},
  //{
  //  title: 'Bottle Balance',
  //  dataIndex: 'bottleBalance',
  //  key: 'bottleBalance'
  //},
  //{
  //  title: 'Payment Status',
  //  key: 'paymentStatus',
  //  dataIndex: 'paymentStatus',
  //  render: tags => (
  //    <span>
  //      {tags.map(tag => {
  //        let color = tag.length > 5 ? 'geekblue' : 'green';
  //        if (tag === 'Unpaid') {
  //          color = 'volcano';
  //        }
  //        return (
  //          <Tag color={color} key={tag}>
  //            {tag.toUpperCase()}
  //          </Tag>
  //        );
  //      })}
  //    </span>
  //  )
  //},
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total'
  },
  //{
  //  title: 'Amount Received',
  //  dataIndex: 'amountReceived',
  //  key: 'amountReceived'
  //}
  //{
  //  title: 'Action',
  //  key: 'action',
  //  render: (text, record) => (
  //    <span>
  //      <p>Invite {record.name}</p>
  //      <Divider type="vertical" />
  //      <p>Delete</p>
  //    </span>
  //  )
  //}
];

const data = [
  {
    key: '1',
    date: '10/02/2019',
    bottleIn: 5,
    bottleOut: 0,
    bottleBalance: 5,
    paymentStatus: ['Paid'],
    amount: 300,
    amountReceived: 0
  },
  {
    key: '2',
    date: '10/02/2019',
    bottleIn: 5,
    bottleOut: 5,
    bottleBalance: 5,
    paymentStatus: ['Unpaid'],
    amount: 300,
    amountReceived: 0
  },
  {
    key: '3',
    date: '10/02/2019',
    bottleIn: 5,
    bottleOut: 4,
    bottleBalance: 6,
    paymentStatus: ['Paid'],
    amount: 300,
    amountReceived: 600
  }
];

class Detail extends PureComponent {
  render() {

    const { history, match } = this.props;
    const { params } = match;
    const { id } = params;

    return (
      <Query query={GET_TRANSACTION} variables={{ id }}>
        {({ data: { transaction }, loading }) => {
          if(loading) return <Spin />;
          let { status, user: { name, mobile, address, bottle }, payment, items }  = transaction;
          return (
            <Layout className="user-main-div">
              <Row className="margin-bottom">
                <Col>
                  <Descriptions bordered className='transaction-detail'>
                    <Descriptions.Item label="Customer">{name}</Descriptions.Item>
                    <Descriptions.Item label="Mobile">{mobile}</Descriptions.Item>
                    <Descriptions.Item label="Have Bottles (Count)">{bottle.balance}</Descriptions.Item>
                    <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                      {`${address.house} ${address.area} ${address.block} ${address.town}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      <Badge status="processing" text={status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Method" span={1.5}>{ payment.method}</Descriptions.Item>
                    <Descriptions.Item label="Payment Status" span={1.5}>{ payment.status}</Descriptions.Item>
                    <Descriptions.Item label="Total Amount">Rs{ payment.balance + payment.paid || 0}</Descriptions.Item>
                    <Descriptions.Item label="Paid Amount">Rs{ payment.paid }</Descriptions.Item>
                    <Descriptions.Item label="Balance Amount">Rs{ payment.balance }</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <div className="card padding-none margin-bottom">
                <Table columns={columns} pagination={false} dataSource={items} scroll={{ x: 1000 }} bordered simple />
              </div>
            </Layout>
          )
        }}
      </Query>
    )
  }
}


export default Detail
