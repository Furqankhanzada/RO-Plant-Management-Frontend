import React, { PureComponent, Fragment } from 'react'
import { Table, Divider, Tag } from 'antd';
import { Sidebar } from './../common/sidebar'
import { AppBar } from './../common/header'

import { Layout } from 'antd';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a href="#">{text}</a>,
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
        return (
            <Fragment>
                <Layout>
                    <AppBar />
                    <Layout className="dashboard-main">
                        <Sidebar handleClick = {this.handleClick} history = {history}/>
                        <Layout className="ant-layout" style={{ padding: '30px 24px 0', height: '100vh' }}>
                            <Layout className="user-main-div">
                                <Table columns={columns} dataSource={data} />
                            </Layout>
                        </Layout>

                    </Layout>
                </Layout>,
            </Fragment>
            )
    }
}


export default Detail
