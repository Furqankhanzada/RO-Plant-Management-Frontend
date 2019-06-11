import React, { PureComponent } from 'react'
import { Table, Divider, Tag } from 'antd';

import { Layout, Card, Icon, Empty, Row, Col, Statistic } from 'antd';

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Bottle In',
        dataIndex: 'bottleIn',
        key: 'bottleIn',
    },
    {
        title: 'Bottle Out',
        dataIndex: 'bottleOut',
        key: 'bottleOut',
    },
    {
        title: 'Bottle Balance',
        dataIndex: 'bottleBalance',
        key: 'bottleBalance',
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
        key: 'amount',
    },
    {
        title: 'Amount Received',
        dataIndex: 'amountReceived',
        key: 'amountReceived',
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
        amountReceived: 0,
    },
    {
        key: '2',
        date: '10/02/2019',
        bottleIn: 5,
        bottleOut: 5,
        bottleBalance: 5,
        paymentStatus: ['Unpaid'],
        amount: 300,
        amountReceived: 0,
    },
    {
        key: '3',
        date: '10/02/2019',
        bottleIn: 5,
        bottleOut: 4,
        bottleBalance: 6,
        paymentStatus: ['Paid'],
        amount: 300,
        amountReceived: 600,
    },
];

class Detail extends PureComponent {
    render() {
        return (
                <Layout className="user-main-div">
                    <div className="card">
                        <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }} xl={{ span: 6 }}>
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
                                <h3>Abdul Raheem</h3>
                                <p
                                    style={{ marginBottom:0, fontWeight:600 }}
                                >03462799866</p>
                                <p>FL-1, R-3, Sector-1, Sultanabad Manghopir Road Karachi</p>
                                <h2>Price : 60</h2>
                                <Tag color="#87d068">Cash</Tag>
                                <Tag color="#2db7f5">Monthly</Tag>
                            </Card>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }} xl={{ span: 18 }}>
                            <div className="quantity">
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
                        </Col>
                    </Row>
                    </div>
                    <div className="card">
                        <Table columns={columns} pagination={false} dataSource={data} scroll={{ x: 1000 }} bordered simple />
                    </div>
                </Layout>
            )
    }
}


export default Detail
