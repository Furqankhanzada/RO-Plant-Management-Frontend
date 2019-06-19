import React, { PureComponent } from 'react'
import { Table, Divider, Tag, Descriptions, Badge } from 'antd';
import { Query } from 'react-apollo';
import { Layout, Card, Icon, Empty, Row, Col, Statistic, Spin } from 'antd';
import { CUSTOMER_QUERY } from '../../graphql/queries/customer'

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date'
  },
  {
    title: 'Bottle In',
    dataIndex: 'bottleIn',
    key: 'bottleIn'
  },
  {
    title: 'Bottle Out',
    dataIndex: 'bottleOut',
    key: 'bottleOut'
  },
  {
    title: 'Bottle Balance',
    dataIndex: 'bottleBalance',
    key: 'bottleBalance'
  },
  {
    title: 'Payment Status',
    key: 'paymentStatus',
    dataIndex: 'paymentStatus',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'Unpaid') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    )
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount'
  },
  {
    title: 'Amount Received',
    dataIndex: 'amountReceived',
    key: 'amountReceived'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <p>Invite {record.name}</p>
        <Divider type="vertical" />
        <p>Delete</p>
      </span>
    )
  }
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
      <Layout className="user-main-div">
        <Row className="margin-bottom">
          <Col>
            <Descriptions bordered className='transaction-detail'>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
              <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
              <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
              <Descriptions.Item label="Usage Time" span={3}>
                2019-04-24 18:00:00
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Badge status="processing" text="Running" />
              </Descriptions.Item>
              <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
              <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
              <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
              <Descriptions.Item label="Config Info">
                Data disk type: MongoDB
                <br />
                Database version: 3.4
                <br />
                Package: dds.mongo.mid
                <br />
                Storage space: 10 GB
                <br />
                Replication_factor:3
                <br />
                Region: East China 1<br />
              </Descriptions.Item>
            </Descriptions>          </Col>
        </Row>
        <div className="card padding-none margin-bottom">
          <Table columns={columns} pagination={false} dataSource={data} scroll={{ x: 1000 }} bordered simple />
        </div>
      </Layout>
    )
  }
}


export default Detail
