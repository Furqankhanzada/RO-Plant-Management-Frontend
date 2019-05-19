import React, { PureComponent } from 'react'
import { Table, Modal, Avatar, Dropdown, Menu, Icon, Button } from 'antd'

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
        const { history, ...tableProps } = this.props
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
                title: <span>Mobile</span>,
                dataIndex: 'mobile',
                key: 'mobile',
            },
            {
                title: <span>Town</span>,
                dataIndex: 'address.town',
                key: 'address.town',
            },
            {
                title: <span>Block</span>,
                dataIndex: 'address.block',
                key: 'address.block',
            },
            {
                title: <span>Address</span>,
                dataIndex: 'address.house',
                key: 'address.house',
            },
            {
                title: <span>Balance</span>,
                dataIndex: 'bottle.balance',
                key: 'bottle.balance',
            },
            {
                title: <span>CreateTime</span>,
                dataIndex: 'createdAt',
                key: 'createdAt',
            },
            {
                title: <span>Operation</span>,
                key: 'id',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <DropOption
                            onMenuClick={e => history.push(`/customers/update/${record.id}`)}
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
