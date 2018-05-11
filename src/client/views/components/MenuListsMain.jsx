import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getListsForCurrentDataset,
  getSelectedList,
  uploadedFileToList } from '../reducers/list'
import MenuList from './MenuList'
import ListUpload from './MenuListUpload'

const ListsMenu = ({lists,selectedList,onListClick,onDrop}) => {
  return (
    <div className={styles.menu}>
      { lists.length == 0 ?
        'Create lists in the Filters menu' :
        lists.map((list,i) => (<MenuList key={i} {...list} onListClick={onListClick}/>))
      }
      {<ListUpload active={false} onDrop={onDrop}/>}
    </div>
  )
};

const mapStateToProps = state => {
  return {
    lists: getListsForCurrentDataset(state),
    selectedList: getSelectedList(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDrop: (acceptedFiles) => dispatch(uploadedFileToList(acceptedFiles))
  }
}

const MenuListsMain = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListsMenu)

export default MenuListsMain
