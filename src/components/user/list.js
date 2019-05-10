import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar, Dropdown, Menu, Icon, Button } from 'antd'

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
        const DropOption = ({
            onMenuClick,
            menuOptions = [],
            buttonStyle,
            dropdownProps,
            }) => {
            const menu = menuOptions.map(item => (
                <Menu.Item key={item.key}>{item.name}</Menu.Item>
            ))
            return (
                <Dropdown
                    overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
                    {...dropdownProps}
                    >
                    <Button style={{ border: 'none', ...buttonStyle }}>
                        <Icon style={{ marginRight: 2 }} type="bars" />
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            )
        }
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
                { key: '1', name: `Update` },
                { key: '2', name: `Delete` },
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
          showTotal: total =>`Total ${total} Items`,
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