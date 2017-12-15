import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getListsForCurrentDataset, getSelectedList } from '../reducers/list'
import MenuList from './MenuList'


const ListsMenu = ({lists,selectedList,onListClick}) => {

  return (
    <div className={styles.menu}>
      { lists.length == 0 ?
        'Sorry, no list display yet.' :
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

const mapDispatchToProps = dispatch => {
  return {
    onListClick: id => console.log('coming soon...') //dispatch(loadList(id))
  }
}
const MenuListsMain = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListsMenu)

export default MenuListsMain
