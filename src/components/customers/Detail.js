import React, { PureComponent, Fragment } from 'react'
import { Table, Divider, Tag } from 'antd';
import  Sidebar  from './../common/sidebar'
import { AppBar } from './../common/header'

import { Layout, Card, Icon, Avatar } from 'antd';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <span>
        {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
        })}
      </span>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <span>
        <a href="#">Invite {record.name}</a>
        <Divider type="vertical" />
        <a href="#">Delete</a>
      </span>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];

class Detail extends PureComponent {
    render() {
        const { history } = this.props;
        const { Meta } = Card;

        return (
                <Layout className="user-main-div">
                    <Card
                        style={{ width: 300, marginBottom: 25 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                    >
                        <h3>Abdul Raheem</h3>
                        <p>03462799866</p>
                        <p>FL-1, R-3, Sector-1, Sultanabad</p>
                    </Card>
                    <Table columns={columns} dataSource={data} bordered simple />
                </Layout>
            )
    }
}


export default Detail
