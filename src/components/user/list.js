import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
//import { DropOption } from 'components'
import Link from 'umi/link'
//import styles from './List.less'

const { confirm } = Modal

class List extends PureComponent {
    handleMenuClick = (record, e) => {
        const { onDeleteItem, onEditItem, i18n } = this.props

        if (e.key === '1') {
            onEditItem(record)
        } else if (e.key === '2') {
            confirm({
                title: i18n.t`Are you sure delete this record?`,
                onOk() {
                    onDeleteItem(record.id)
                },
            })
        }
    }

    render() {
        const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

        const columns = [
            {
                title: <span>Avatar</span>,
                dataIndex: 'avatar',
                key: 'avatar',
                width: 72,
                fixed: 'left',
                render: text => <Avatar style={{ marginLeft: 8 }} src={text} />,
            },
            {
                title: <span>Name</span>,
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
            },
            {
                title: <span>NickName</span>,
                dataIndex: 'nickName',
                key: 'nickName',
            },
            {
                title: <span>Age</span>,
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: <span>Gender</span>,
                dataIndex: 'isMale',
                key: 'isMale',
                render: text => <span>{text ? 'Male' : 'Female'}</span>,
            },
            {
                title: <span>Phone</span>,
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: <span>Email</span>,
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: <span>Address</span>,
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: <span>CreateTime</span>,
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: <span>Operation</span>,
                key: 'operation',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <DropOption
                            onMenuClick={e => this.handleMenuClick(record, e)}
                            menuOptions={[
                { key: '1', name: i18n.t`Update` },
                { key: '2', name: i18n.t`Delete` },
              ]}
                            />
                    )
                },
            },
        ]

        return (
            <Table
                {...tableProps}
                pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
                //className={styles.table}
                bordered
                scroll={{ x: 1200 }}
                columns={columns}
                simple
                rowKey={record => record.id}
                />
        )
    }
}


export default List