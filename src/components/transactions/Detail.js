import React, { PureComponent } from 'react'
import { Query } from 'react-apollo';
import moment from 'moment';
import { Layout, Row, Col, Statistic, Spin, Table, Tag, Descriptions, Badge } from 'antd';
import { GET_TRANSACTION } from '../../graphql/queries/transaction'

const columns = [
  {
    title: 'Date',
    dataIndex: 'transactionAt',
    key: 'date',
    render: (text, record) =>{
      return(
          <span>{moment(text).format("ddd DD MMMM YYYY")}</span>
      )
    }
  },
  {
    title: 'Name',
    dataIndex: 'product.name',
    key: 'name'
  },

  {
    title: 'Price',
    dataIndex: 'product.price',
    key: 'price',
    render: (method, price) => {
      const {discount,quantity} = price
      if (discount === method){
        return <Tag color='green'><span className="discount-price">{method}</span> <span>{method-(discount/quantity)}</span></Tag>
      }
      return <Tag color='green'><span>{method}</span></Tag>
    }
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (method) => {
      return <Tag color='magenta'>{method}</Tag>
    }
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (method) => {
      return <Tag color='red'>{method}</Tag>
    }
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
          let { status, user: { name, mobile, address, bottleBalance }, payment, items, createdAt }  = transaction;
          return (
            <Layout className="user-main-div">
              <Row className="margin-bottom">
                <Col>
                  <Descriptions bordered className='transaction-detail' column={{ xxl: 4, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Customer">{name}</Descriptions.Item>
                    <Descriptions.Item label="Mobile">{mobile}</Descriptions.Item>
                    <Descriptions.Item label="Have Bottles (Count)"><Tag color='red'>{bottleBalance}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Order month">{moment(createdAt).format('MMMM YYYY')}</Descriptions.Item>
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
