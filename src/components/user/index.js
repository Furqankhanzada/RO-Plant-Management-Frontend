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
        const { location, dispatch, i18n } = this.props;
        const loading = {
            effects:{
                "app/query":false,
                "login/login":false,
                "user/query":false
            },global: false, models: {app: false, login: false, user: false}
        };
        const query = {page: "1"};
        const user = {
            "list":[
                {
                    "id":"320000201808284268",
                    "name":"David Thompson",
                    "nickName":"Perez",
                    "phone":"14848322073",
                    "age":98,
                    "address":"??? ??????? ???",
                    "isMale":false,
                    "email":"a.rlysel@nobjanw.bo",
                    "createTime":"2014-01-29 07:38:38",
                    "avatar":"https://tinyfac.es/data/avatars/475605E3-69C5-4D2B-8727-61B7BB8C4699-500w.jpeg"
                },
                {
                    "id":"540000199404148842",
                    "name":"Melissa Gonzalez",
                    "nickName":"Taylor",
                    "phone":"15909018123",
                    "age":68,
                    "address":"??? ??? ???",
                    "isMale":true,
                    "email":"i.uclhfb@yvq.ao",
                    "createTime":"1987-11-19 20:36:23",
                    "avatar":"https://randomuser.me/api/portraits/men/43.jpg"
                },
                {
                    "id":"710000201306251493",
                    "name":"Linda Taylor",
                    "nickName":"Anderson",
                    "phone":"14337305515",
                    "age":23,
                    "address":"?? ??? ???",
                    "isMale":true,
                    "email":"x.gdadu@gboxrjm.na",
                    "createTime":"2010-09-28 15:40:11",
                    "avatar":"https://tinyfac.es/data/avatars/475605E3-69C5-4D2B-8727-61B7BB8C4699-500w.jpeg"
                },
                {
                    "id":"140000197412065138",
                    "name":"Sandra Thompson",
                    "nickName":"Johnson",
                    "phone":"18585425723",
                    "age":31,
                    "address":"??? ???? ???",
                    "isMale":true,
                    "email":"e.wcpsjyrpzb@ipyyv.id",
                    "createTime":"1970-08-05 07:33:20",
                    "avatar":"https://pbs.twimg.com/profile_images/943227488292962306/teiNNAiy.jpg"
                },
                {
                    "id":"810000198305151203",
                    "name":"Christopher Jackson",
                    "nickName":"Jackson",
                    "phone":"17752727302",
                    "age":82,
                    "address":"?? ??? ???",
                    "isMale":false,
                    "email":"d.lszzlfr@rugi.ba",
                    "createTime":"2000-12-28 23:35:55",
                    "avatar":"https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                    "id":"150000201301145312",
                    "name":"Jason Gonzalez",
                    "nickName":"Smith",
                    "phone":"18635387998",
                    "age":79,
                    "address":"??? ???? ????",
                    "isMale":true,
                    "email":"z.tsyweha@itasiwwtc.cn",
                    "createTime":"1991-10-07 04:52:33",
                    "avatar":"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb"
                },
                {
                    "id":"140000199609094767",
                    "name":"Brian Garcia",
                    "nickName":"Thompson",
                    "phone":"14698343596",
                    "age":36,
                    "address":"?? ??? ???",
                    "isMale":true,
                    "email":"k.sfbyt@iaq.ma",
                    "createTime":"2009-02-28 05:17:36",
                    "avatar":"https://pbs.twimg.com/profile_images/943227488292962306/teiNNAiy.jpg"
                },
                {
                    "id":"340000198112188955",
                    "name":"Barbara Johnson",
                    "nickName":"Hernandez",
                    "phone":"13574843426",
                    "age":16,
                    "address":"??? ?????????? ???",
                    "isMale":true,
                    "email":"k.adodkogrg@suipmzu.ev",
                    "createTime":"2012-07-28 01:40:54",
                    "avatar":"https://d3iw72m71ie81c.cloudfront.net/male-5.jpg"
                },
                {
                    "id":"420000197809128587",
                    "name":"Shirley Gonzalez",
                    "nickName":"Perez",
                    "phone":"17744858416",
                    "age":90,
                    "address":"??? ??? ???",
                    "isMale":false,
                    "email":"t.lpfjg@frrfkbbjj.nc",
                    "createTime":"2001-04-26 00:47:20",
                    "avatar":"https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                    "id":"220000201112186439",
                    "name":"George Lee",
                    "nickName":"Johnson",
                    "phone":"14375742261",
                    "age":92,
                    "address":"???????? ???? ???",
                    "isMale":true,
                    "email":"m.rogry@rhsectq.ms",
                    "createTime":"1987-01-31 15:40:55",
                    "avatar":"https://pbs.twimg.com/profile_images/835224725815246848/jdMBCxHS.jpg"
                },
                {
                    "id":"320000201808284268",
                    "name":"David 2 Thompson",
                    "nickName":"Perez",
                    "phone":"14848322073",
                    "age":98,
                    "address":"??? ??????? ???",
                    "isMale":false,
                    "email":"a.rlysel@nobjanw.bo",
                    "createTime":"2014-01-29 07:38:38",
                    "avatar":"https://tinyfac.es/data/avatars/475605E3-69C5-4D2B-8727-61B7BB8C4699-500w.jpeg"
                },
                {
                    "id":"540000199404148842",
                    "name":"Melissa Gonzalez",
                    "nickName":"Taylor",
                    "phone":"15909018123",
                    "age":68,
                    "address":"??? ??? ???",
                    "isMale":true,
                    "email":"i.uclhfb@yvq.ao",
                    "createTime":"1987-11-19 20:36:23",
                    "avatar":"https://randomuser.me/api/portraits/men/43.jpg"
                },
                {
                    "id":"710000201306251493",
                    "name":"Linda Taylor",
                    "nickName":"Anderson",
                    "phone":"14337305515",
                    "age":23,
                    "address":"?? ??? ???",
                    "isMale":true,
                    "email":"x.gdadu@gboxrjm.na",
                    "createTime":"2010-09-28 15:40:11",
                    "avatar":"https://tinyfac.es/data/avatars/475605E3-69C5-4D2B-8727-61B7BB8C4699-500w.jpeg"
                },
                {
                    "id":"140000197412065138",
                    "name":"Sandra Thompson",
                    "nickName":"Johnson",
                    "phone":"18585425723",
                    "age":31,
                    "address":"??? ???? ???",
                    "isMale":true,
                    "email":"e.wcpsjyrpzb@ipyyv.id",
                    "createTime":"1970-08-05 07:33:20",
                    "avatar":"https://pbs.twimg.com/profile_images/943227488292962306/teiNNAiy.jpg"
                },
                {
                    "id":"810000198305151203",
                    "name":"Christopher Jackson",
                    "nickName":"Jackson",
                    "phone":"17752727302",
                    "age":82,
                    "address":"?? ??? ???",
                    "isMale":false,
                    "email":"d.lszzlfr@rugi.ba",
                    "createTime":"2000-12-28 23:35:55",
                    "avatar":"https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                    "id":"150000201301145312",
                    "name":"Jason Gonzalez",
                    "nickName":"Smith",
                    "phone":"18635387998",
                    "age":79,
                    "address":"??? ???? ????",
                    "isMale":true,
                    "email":"z.tsyweha@itasiwwtc.cn",
                    "createTime":"1991-10-07 04:52:33",
                    "avatar":"https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb"
                },
                {
                    "id":"140000199609094767",
                    "name":"Brian Garcia",
                    "nickName":"Thompson",
                    "phone":"14698343596",
                    "age":36,
                    "address":"?? ??? ???",
                    "isMale":true,
                    "email":"k.sfbyt@iaq.ma",
                    "createTime":"2009-02-28 05:17:36",
                    "avatar":"https://pbs.twimg.com/profile_images/943227488292962306/teiNNAiy.jpg"
                },
                {
                    "id":"340000198112188955",
                    "name":"Barbara Johnson",
                    "nickName":"Hernandez",
                    "phone":"13574843426",
                    "age":16,
                    "address":"??? ?????????? ???",
                    "isMale":true,
                    "email":"k.adodkogrg@suipmzu.ev",
                    "createTime":"2012-07-28 01:40:54",
                    "avatar":"https://d3iw72m71ie81c.cloudfront.net/male-5.jpg"
                },
                {
                    "id":"420000197809128587",
                    "name":"Shirley Gonzalez",
                    "nickName":"Perez",
                    "phone":"17744858416",
                    "age":90,
                    "address":"??? ??? ???",
                    "isMale":false,
                    "email":"t.lpfjg@frrfkbbjj.nc",
                    "createTime":"2001-04-26 00:47:20",
                    "avatar":"https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                    "id":"220000201112186439",
                    "name":"George Lee",
                    "nickName":"Johnson",
                    "phone":"14375742261",
                    "age":92,
                    "address":"???????? ???? ???",
                    "isMale":true,
                    "email":"m.rogry@rhsectq.ms",
                    "createTime":"1987-01-31 15:40:55",
                    "avatar":"https://pbs.twimg.com/profile_images/835224725815246848/jdMBCxHS.jpg"
                }


            ],
            "pagination":{
                "showSizeChanger":true,
                "showQuickJumper":true,
                "current":1,
                "total":81,
                "pageSize":10
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
                <Filter {...filterProps} />

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