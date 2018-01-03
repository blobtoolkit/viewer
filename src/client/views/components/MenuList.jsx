import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { fetchIdentifiers } from '../reducers/identifiers'
import { getSelectedList, updateSelectedList, getIdentifiersForList } from '../reducers/list'
import ListModal from './ListModal';

const ListItem = ({id,list,onClick,identifiers,active}) => {

  let css = styles.menu_item
  if (active) css += ' '+styles.active
  return (
    <div className={css} onClick={()=>onClick(id)}>
    <ListModal name={id} selected={active} dismiss={()=>onClick(null)} identifiers={identifiers}>&nbsp;</ListModal>
      <h3>{id}</h3>
      <span className={styles.menu_subtitle}>{list.length}</span>
    </div>
  )
}

class MenuList extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        identifiers: getIdentifiersForList(state),
        active: getSelectedList(state) == this.props.id
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
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
