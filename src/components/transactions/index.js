import React, { PureComponent } from 'react'
import List from './List.js'
import Filter from './Filter.js'
import { stringify, parse } from 'qs'
import RightDrawer from './RightDrawer'
import { GET_DRAWER_STATUS } from '../../client'
import { Query } from 'react-apollo'

class User extends PureComponent {
  render() {
    const { loading, history, transactions } = this.props;
    const {location: {pathname}} = history;
    // const {user} = transactions;
    // Fill filters input by url query params
    const { location: { search } } = history;
    const query = parse(search.replace('?', ''));

    const handleRefresh = newQuery => {
      this.props.history.push({
        pathname: pathname === "/transactions" ? "/transactions" : pathname,
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
      dataSource: transactions,
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
        <List  {...listProps} history={history} />
        <Query query={GET_DRAWER_STATUS}>
          {
            ({ data: { Drawer } }) => {
              if (Drawer) {
                const { id, open } = Drawer;
                return (
                  <RightDrawer visible={open} id={id} />
                )
              }
              return null;
            }
          }
        </Query>
      </div>
    )
  }
}

export default User
