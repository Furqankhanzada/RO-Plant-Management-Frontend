import React, { PureComponent } from 'react'
import List from './list.js'
import Filter from './filter.js'
import { stringify, parse } from 'qs'
import CustomerDrawer from './CustomerDrawer'
import gql from 'graphql-tag';
import { client } from '../../index'
import { GET_DRAWER_STATUS } from '../../client'
import { Query } from 'react-apollo'

class User extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            tempId: false,
            visible: false
        }
    }
    hideUpdateForm = () => {
        client.mutate({
            mutation: gql`
            mutation openDrawer($status: Boolean!, $id: String) {
                openDrawer(status: $status, id: $id) @client {
                    Drawer
                }
            }
            `,
            variables: { status: false, id: '' }
        })
    }

    openUpdateForm = (id) => {
        client.mutate({
            mutation: gql`
            mutation openDrawer($status: Boolean!, $id: String) {
                openDrawer(status: $status, id: $id) @client {
                    Drawer
                }
            }
            `,
            variables: { status: true, id }
        })
    }

    showDrawerProp = () => {
        this.setState({
            visible: true
        })
    }
    render() {
        const { loading, history, customers } = this.props;
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
            <div className="contents">
                <Filter {...filterProps} history={history} />
                <List history={history} {...listProps} />
                <Query query={GET_DRAWER_STATUS}>
                    {
                        ({ data }) => {
                            const { Drawer } = data;
                            if (Drawer) {
                                const { id, open } = Drawer
                                return (
                                    <CustomerDrawer visible={open} id={id} />
                                )
                            } else {
                                return null
                            }
                        }
                    }
                </Query>
            </div>
        )
    }
}


export default User
