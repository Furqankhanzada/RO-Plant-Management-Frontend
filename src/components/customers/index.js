import React, { PureComponent } from 'react'
import List from './list.js'
import Filter from './filter.js'

class User extends PureComponent {
    render() {
        const { history } = this.props;

        const query = {page: "1"};
        const user = {
            "list": this.props.customers,
            "pagination":{
                "showSizeChanger":true,
                "showQuickJumper":true,
                "current":1,
                "total":81,
                "pageSize":30
            },
            "currentItem": {
            }
        };
        const {
            list,
            pagination,
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


        const listProps = {
            dataSource: list,
            loading: false,
            pagination,
            onChange(page) {
                handleRefresh({
                    page: page.current,
                    pageSize: page.pageSize
                })
            },
            onDeleteItem(id) {
                // then
                handleRefresh({
                    page:
                        list.length === 1 && pagination.current > 1
                            ? pagination.current - 1
                            : pagination.current,
                })
            },
            onEditItem(item) {

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
            }
        };

        return (
            <div className="user-main-div">
                <Filter {...filterProps} history={history}/>
                <List  history = {history} {...listProps}/>
            </div>
            )
    }
}


export default User
