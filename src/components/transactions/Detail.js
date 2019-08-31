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
    render: (text) =>{
      if(text == 'Total'){
        return <b>{text}</b>
      }
        return <span>{moment(text).format("ddd DD MMMM YYYY")}</span>
    },
  },
  {
    title: 'Name',
    dataIndex: 'product.name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'product.price',
    key: 'price',
    render: (method, price) => {
      let totalPrice = price.discount ? price.total : method;
      if (method !== totalPrice){
        return <Tag color='green'><span className="discount-price">{method}</span> <span>{totalPrice/price.quantity}</span></Tag>
      }
      return <Tag color='green'><span>{totalPrice}</span></Tag>
    },
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (method) => {
      if (typeof method == 'string'){
        return <b>{method}</b>
      }
      return <Tag color='magenta'>{method}</Tag>
    },
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    render: (method) => {
      if (typeof method == 'string'){
        return <b>{method}</b>
      }
      return <Tag color='red'>{method}</Tag>
    },
  },

];

class Detail extends PureComponent {
  render() {

    const { match } = this.props;
    const { params } = match;
    const { id } = params;

    const footerRow = {
      transactionAt: '',
      quantity: '',
      total: ''
    };

    return (
      <Query query={GET_TRANSACTION} variables={{ id }}>
        {({ data: { transaction} = '', loading }) => {
          if(loading) return <Spin />;
          let { status, user: { name, mobile, address, bottleBalance }, payment, items, createdAt }  = transaction;
          items.push(footerRow);

          let totalQuantity = 0;
          let totalOfTotal = 0;
          items.forEach((values)=>{
            totalQuantity = totalQuantity + values.quantity;
            totalOfTotal = totalOfTotal + values.total;
          });

          footerRow.transactionAt = 'Total';
          footerRow.quantity = 'Rs' + totalQuantity;
          footerRow.total = 'Rs' + totalOfTotal;

          return (
            <Layout className="user-main-div">
              <Row className="margin-bottom">
                <Col>
                  <Descriptions bordered className='transaction-detail' column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }}>
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
                    <Descriptions.Item label="Payment Method" span={1.5}><Tag color='magenta'>{payment.method?payment.method.replace("_", " "):""}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Payment Status" span={1.5}><Tag color='green'>{payment.status}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Total Amount"><Tag color='green'>Rs</Tag><Statistic value={payment.balance + payment.paid || 0} precision={2} /></Descriptions.Item>
                    <Descriptions.Item label="Paid Amount"><Tag color='lightgrey'>Rs</Tag><Statistic value={ payment.paid } precision={2} /></Descriptions.Item>
                    <Descriptions.Item label="Balance Amount"><Tag color='red'>Rs</Tag><Statistic value={ payment.balance } precision={2} /></Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <div className="card padding-none margin-bottom">
                <Table columns={columns} pagination={false} dataSource={items} bordered simple scroll={{ x: 1000 }}
                />
              </div>
            </Layout>
          )
        }}
      </Query>
    )
  }
}


export default Detail
