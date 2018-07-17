import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getLists,
  getSelectedList,
  uploadedFileToList } from '../reducers/list'
import MenuList from './MenuList'
import ListUpload from './MenuListUpload'
import DatasetCreateList from './DatasetCreateList'

const ListsMenu = ({lists,selectedList,onListClick,onDrop}) => {
  return (
    <div className={styles.fill_parent}>
      <DatasetCreateList />
      { lists.map((list,i) => (<MenuList key={i} {...list} onListClick={onListClick}/>))}
      {<ListUpload active={false} onDrop={onDrop}/>}
    </div>
  )
};

const mapStateToProps = state => {
  return {
    lists: getLists(state),
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
