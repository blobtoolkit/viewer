import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { fetchIdentifiers } from '../reducers/identifiers'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import { urlSearchTerm } from '../reducers/history'
import { getSelectedList, updateSelectedList, getIdentifiersForList, chooseList } from '../reducers/list'
import ListModal from './ListModal';

const ListItem = ({id,list,params,search,onClick,identifiers,active,onChooseList,meta}) => {
  let css = styles.menu_item
  if (active) css += ' '+styles.active
  let obj = {id,search,params,identifiers}
  return (
    <div className={css}>
      <ListModal name={id} selected={active} dismiss={()=>onClick(null)} list={obj} type={meta.record_type} dataset={meta.id} chooseList={onChooseList}>&nbsp;</ListModal>
      <h3>{id}</h3>
      <span className={styles.menu_subtitle}>{list.length} {meta.record_type}</span>
    </div>
  )
}

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        identifiers: getIdentifiersForList(state),
        active: getSelectedList(state) == this.props.id,
        meta: getSelectedDatasetMeta(state),
        search: urlSearchTerm(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onChooseList: (id) => {
          dispatch(chooseList(id))
        },
        onClick: (id) => {
          dispatch(updateSelectedList(id))
          dispatch(fetchIdentifiers())
        }
      }
    }
  }

  render(){
    const ConnectedListItem = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(ListItem)
    return (
      <ConnectedListItem {...this.props}/>
    )
  }
}

export default MenuList
