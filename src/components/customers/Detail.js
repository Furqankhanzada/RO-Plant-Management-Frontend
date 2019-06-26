import React, { PureComponent } from 'react'
import { Table, Divider, Tag } from 'antd';
import { Query } from 'react-apollo';
import { Layout, Card, Icon, Empty, Row, Col, Statistic, Spin } from 'antd';
import { CUSTOMER_QUERY } from '../../graphql/queries/customer'
import { GET_TRANSACTIONS } from '../../graphql/queries/transaction'
import Transaction from '../transactions/index.js'



class Detail extends PureComponent {
    render() {

        const { history, match } = this.props;
        const { params } = match;
        const { id } = params;
        return (
            <Layout className="user-main-div">
                <Row className="flex-box">

                    <Col className="flex-box" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                        <div className="card padding-none loading-center">
                            <Query query={CUSTOMER_QUERY} variables={{ id }}>
                                {({ data: { customer }, loading }) => {
                                    if(loading) return <Spin />;
                                    return (
                                        <Card
                                            style={{ width: '100%' }}
                                            cover={
                                                <img
                                                    alt="example"
                                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                                />
                                            }
                                            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                                        >
                                            <h3>{customer.name}</h3>
                                            <p
                                                style={{ fontWeight:600 }}
                                            >{customer.mobile}</p>
                                            <p>{`${customer.address.house} ${customer.address.area} ${customer.address.block} ${customer.address.town}`}</p>
                                            {
                                                customer.discounts.map((value, index) => {
                                                    return(
                                                        <div className="product-details">
                                                            <h3>Discount : <span>{value.discount ? (100 - (value.discount / value.product.price) * 100).toFixed() : 0}%</span></h3>
                                                            <h3>Product : <span>{value.product.name}</span></h3>
                                                            <h3>Price : <span>{value.product.price}</span></h3>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <Tag color="#87d068">Cash</Tag>
                                            <Tag color="#2db7f5">Monthly</Tag>
                                        </Card>
                                    )
                                }}
                            </Query>
                        </div>
                    </Col>

                    <Col className="flex-box" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }} xl={{ span: 18 }}>
                        <div className="quantity">
                            <div className="card">
                                <Row gutter={16}>
                                    <Col className="bottom-space" xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                        <Statistic title="Total Amount" value={1250} precision={2} />
                                    </Col>
                                    <Col className="bottom-space" xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                        <Statistic title="Amount Recived" value={1000} precision={2} />
                                    </Col>
                                    <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                        <Statistic title="Due Amount" value={250} precision={2} />
                                    </Col>
                                    <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                        <Statistic title="Bottles Deliver" value={17} />
                                    </Col>
                                </Row>
                                <Divider />
                                <Empty
                                    style={{ marginTop: 60 }}
                                    description={
                                        <span>
                                           Chart Will be here
                                        </span>
                                    }
                                >
                                </Empty>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="card padding-none space-bottom">
                    <Query query={GET_TRANSACTIONS} variables={{where:{user:{id}}}}>
                        { ({ data, loading }) => {
                            const {transactions} = data;
                            return(
                                <Transaction transactions={transactions} loading={loading} history={history} />
                            )
                        }}
                    </Query>
                </div>
            </Layout>
        )
    }
}


export default Detail

