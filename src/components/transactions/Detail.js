import React, { PureComponent } from 'react'
import { Query } from 'react-apollo';
import { Layout, Row, Col, Statistic, Spin, Table, Tag, Descriptions, Badge } from 'antd';
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
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total'
  }
];

class Detail extends PureComponent {
  render() {

    const { match } = this.props;
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
                    <Descriptions.Item label="Have Bottles (Count)"><Tag color='red'>{bottle.balance}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
                    <Descriptions.Item label="Address" span={3}>
                      {`${address.house} ${address.area} ${address.block} ${address.town}`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" span={3}>
                      <Badge status="processing" text={status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Method" span={1.5}><Tag color='magenta'>{payment.method.replace("_", " ")}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Payment Status" span={1.5}><Tag color='green'>{payment.status}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Total Amount"><Tag color='green'>Rs</Tag><Statistic value={payment.balance + payment.paid || 0} precision={2} /></Descriptions.Item>
                    <Descriptions.Item label="Paid Amount"><Tag color='lightgrey'>Rs</Tag><Statistic value={ payment.paid } precision={2} /></Descriptions.Item>
                    <Descriptions.Item label="Balance Amount"><Tag color='red'>Rs</Tag><Statistic value={ payment.balance } precision={2} /></Descriptions.Item>
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
