import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getListsForCurrentDataset, getSelectedList } from '../reducers/list'
import MenuList from './MenuList'


const ListsMenu = ({lists,selectedList,onListClick}) => {

  return (
    <div className={styles.menu}>
      { lists.length == 0 ?
        'Create lists in the Filters menu' :
        lists.map((list,i) => (<MenuList key={i} {...list} onListClick={onListClick}/>))
      }
    </div>
  )
};

const mapStateToProps = state => {
  return {
    lists: getListsForCurrentDataset(state),
    selectedList: getSelectedList(state)
  }
}

const MenuListsMain = connect(
  mapStateToProps
)(ListsMenu)

export default MenuListsMain
