import React, { PureComponent } from 'react'
import List from './List.js'
import Filter from './Filter.js'
import { stringify, parse } from 'qs'
import RightDrawer from './RightDrawer'
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
