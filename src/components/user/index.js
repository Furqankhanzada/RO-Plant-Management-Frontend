import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
//import { router } from 'utils'
import { Row, Col, Button, Popconfirm } from 'antd'
import { stringify } from 'qs'
import List from './list.js'
import Filter from './filter.js'
import Modal from './modal.js'

class User extends PureComponent {
    render() {
        const { location, dispatch, i18n, history } = this.props;
        console.log(this.props.customers,'customer child props')
        const loading = {
            effects:{
                "app/query":false,
                "login/login":false,
                "user/query":false
            },global: false, models: {app: false, login: false, user: false}
        };
        const query = {page: "1"};
        const user = {
            "list":this.props.customers,
            "pagination":{
                "showSizeChanger":true,
                "showQuickJumper":true,
                "current":1,
                "total":81,
                "pageSize":30
            },
            "currentItem":{
            },
            "modalVisible":false,
            "modalType":"create",
            "selectedRowKeys":[]
        };
        const {
            list,
            pagination,
            currentItem,
            modalVisible,
            modalType,
            selectedRowKeys,
            } = user;

        const handleRefresh = newQuery => {
            //router.push({
            //    pathname,
            //    search: stringify(
            //        {
            //            ...query,
            //            ...newQuery,
            //        },
            //        { arrayFormat: 'repeat' }
            //    ),
            //})
        };

        const modalProps = {
            item: modalType === 'create' ? {} : currentItem,
            visible: modalVisible,
            maskClosable: false,
            confirmLoading: loading.effects[`user/${modalType}`],
            title: `modal`,
            centered: true,
            onOk(data) {
                dispatch({
                    type: `user/${modalType}`,
                    payload: data
                }).then(() => {
                    handleRefresh()
                })
            },
            onCancel() {
                dispatch({
                    type: 'user/hideModal'
                })
            }
        };

        const listProps = {
            dataSource: list,
            loading: loading.effects['user/query'],
            pagination,
            onChange(page) {
                handleRefresh({
                    page: page.current,
                    pageSize: page.pageSize
                })
            },
            onDeleteItem(id) {
                dispatch({
                    type: 'user/delete',
                    payload: id,
                }).then(() => {
                    handleRefresh({
                        page:
                            list.length === 1 && pagination.current > 1
                                ? pagination.current - 1
                                : pagination.current,
                    })
                })
            },
            onEditItem(item) {
                dispatch({
                    type: 'user/showModal',
                    payload: {
                        modalType: 'update',
                        currentItem: item,
                    },
                })
            },
            rowSelection: {
                selectedRowKeys,
                onChange: keys => {
                    dispatch({
                        type: 'user/updateState',
                        payload: {
                            selectedRowKeys: keys,
                        },
                    })
                },
            }
        };

        const filterProps = {
            filter: {
                ...query,
            },
            onFilterChange(value) {
                handleRefresh({
                    ...value,
                    page: 1,
                })
            },
            onAdd() {
                dispatch({
                    type: 'user/showModal',
                    payload: {
                        modalType: 'create',
                    },
                })
            },
        };

        const handleDeleteItems = () => {
            dispatch({
                type: 'user/multiDelete',
                payload: {
                    ids: selectedRowKeys,
                },
            }).then(() => {
                handleRefresh({
                    page:
                        list.length === selectedRowKeys.length && pagination.current > 1
                            ? pagination.current - 1
                            : pagination.current,
                })
            })
        };

        return (
            <div className="user-main-div">
                <Filter {...filterProps} history={history}/>

                {selectedRowKeys.length > 0 && (
                    <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
                        <Col>
                            {`Selected ${selectedRowKeys.length} items `}
                            <Popconfirm
                                title="Are you sure delete these items?"
                                placement="left"
                                onConfirm={handleDeleteItems}
                                >
                                <Button type="primary" style={{ marginLeft: 8 }}>
                                    Remove
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                )}
                <List {...listProps} />
                {modalVisible && <Modal {...modalProps} />}
            </div>
            )
    }
}


export default User