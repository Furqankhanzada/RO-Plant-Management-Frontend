import React, { PureComponent } from 'react'
import List from './list.js'
import Filter from './filter.js'
import { stringify, parse } from 'qs'

class User extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            id: '',
            tempId: false
        }
    }
    hideUpdateForm = () =>{
        this.setState({
            id : '',
            tempId: false
        })
    }

    openUpdateForm = (id) => {
        this.setState({
            id,
            tempId: true
        })
    }
    render() {
        const { loading, history, customers } = this.props;
        const { id, tempId } = this.state;

        // Fill filters input by url query params
        const { location: { search } } = history;
        const query = parse(search.replace('?', ''));

        const handleRefresh = newQuery => {
            this.props.history.push({
                pathname: '/customers',
                   search: stringify(
                       {
                           ...query,
                           ...newQuery,
                       },
                       { arrayFormat: 'repeat' }
                   )
            })
        };


        const listProps = {
            dataSource: customers,
            loading,
            onChange(page) {
                handleRefresh({
                    page: page.current,
                    pageSize: page.pageSize
                })
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
                <Filter {...filterProps} history={history} id = {id} tempId={tempId} hideUpdateForm = {this.hideUpdateForm}/>
                <List  history={history} {...listProps} openUpdateForm = {this.openUpdateForm} />
            </div>
            )
    }
}


export default User
