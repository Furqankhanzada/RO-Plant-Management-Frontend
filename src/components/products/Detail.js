import React, { PureComponent } from 'react'
import { Table, Divider, Tag } from 'antd';
import {graphql, Query} from 'react-apollo';
import { Layout, Card, Icon, Empty, Row, Col, Statistic, Spin } from 'antd';
import {PRODUCTS_QUERY, GET_CUSTOMERS} from '../../graphql/queries/customer'
import {GET_TRANSACTION, GET_TRANSACTIONS, TRANSACTION_SUBSCRIPTION} from '../../graphql/queries/transaction'
import Transaction from '../transactions/index.js'
import moment from "../TransactionsPage";
import { parse } from 'qs'



class Detail extends PureComponent {
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }
    onRouteChanged() {
        let { transactionsQuery: { refetch }, location: { search, pathname } } = this.props;
        pathname = pathname.split("/")[2]
        const query = parse(search);
        let where = {payment:{}};
        where.user = {
            id: pathname
        }
        if (query.type) {
            where.type = query.type
        }
        if (query.status) {
            where.status = query.status
        }

        if (query.payment ) {
            where.payment.status = query.payment
        }

        if (query.transactionAt) {
            where.createdAt_gte = moment(query.transactionAt[0]).startOf('day');
            where.createdAt_lte = moment(query.transactionAt[1]).endOf('day');
        }

        refetch({
            where
        })
    }
    render() {

        const { history, match, transactionsQuery } = this.props;
        let { transactions } = transactionsQuery;
        let paymentTransaction = [];
        let paid = 0;
        let due = 0;
        let quantity = 0;
        paymentTransaction = transactions ? transactions.map((value)=>{
            paid = paid + value.payment.paid
            due = due + value.payment.balance



            value.items.map((item)=>{
            quantity = quantity + item.quantity
            })

        }) :[]


        const { params } = match;
        const { id } = params;
        return (
            <Layout className="user-main-div">
                <Row className="flex-box">
                    <Col className="flex-box" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                        <div className="card padding-none loading-center">
                            <Query query={CUSTOMER_QUERY} variables={{ id }}>
                                {({ data: { product }, loading }) => {
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
                                            <h3>{product.name}</h3>
                                            <p
                                                style={{ fontWeight:600 }}
                                            >{product.mobile}</p>
                                            <p>{`${product.address.house} ${product.address.area} ${product.address.block} ${product.address.town}`}</p>
                                            {
                                                product.discounts.map((value, index) => {
                                                    return(
                                                        <div className="product-details">
                                                            <h3>Product : <span>{value.product.name}</span></h3>
                                                            <h3>Discounted Price : <span>{value.discount}</span> <span className={ value.discount ? "line-through" :""}>{value.product.price}</span></h3>
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
                                                                <Statistic title="Total Amount" value={paid+due} precision={2} />
                                                            </Col>
                                                            <Col className="bottom-space" xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                                                <Statistic title="Amount Recived" value={ paid } precision={2} />
                                                            </Col>
                                                            <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                                                <Statistic title="Due Amount" value={due} precision={2} />
                                                            </Col>
                                                            <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                                                                <Statistic title="Bottles Deliver" value={quantity} />
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

                    <Transaction transactions={transactions} loading={transactions ? false : true} history={history} />

                </div>
            </Layout>
        )
    }
}

export default graphql(GET_TRANSACTIONS, {
    name: 'transactionsQuery', // name of the injected prop: this.props.transactionsQuery...
    options: ({ location: { search = {}, pathname } = {} }) => {
        pathname = pathname.split("/")[2]
        const query = parse(search);
        let where = {payment:{}};
        where.user = {
            id: pathname
        }
        if (query.type) {
            where.type = query.type
        }
        if (query.status) {
            where.status = query.status
        }

        if (query.payment  ) {
            where.payment.status  = query.payment
        }
        if (query.transactionAt) {
            where.createdAt_gte = moment(query.transactionAt[0]).startOf('day');
            where.createdAt_lte = moment(query.transactionAt[1]).endOf('day');
        }

        return {
            variables: {
                where
            }
        }
    },
    props: props => {
        return Object.assign({}, props, {
            subscribeToTransaction: params => {
                return props.transactionsQuery.subscribeToMore({
                    document: TRANSACTION_SUBSCRIPTION,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) {
                            return prev
                        }
                        const newTransaction = subscriptionData.data.transactionSubscription;
                        if (newTransaction) {
                            if (prev.transactions.find(transaction => transaction.id === newTransaction.id)) {
                                return prev
                            }
                            return Object.assign({}, prev, {
                                transactions: [...prev.transactions, newTransaction]
                            })
                        }
                        // Execute when delete item
                        return Object.assign({}, prev, {
                            transactions: [...prev.transactions]
                        })
                    }
                })
            }
        })
    }
})(Detail)



