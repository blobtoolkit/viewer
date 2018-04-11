import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getSummary } from '../reducers/summary'
import MenuSummary from './MenuSummary'


const SummaryMenu = ({values,zAxis,bins,palette}) => {
  let props = {values,zAxis,bins,palette}
  return (
    <div className={styles.menu}>
      { bins ?
        <MenuSummary {...props}/> :
        'Select a dataset to view summary statistics'
      }
    </div>
  )
};

const mapStateToProps = state => {
  return getSummary(state)
}

const MenuSummaryMain = connect(
  mapStateToProps
)(SummaryMenu)

export default MenuSummaryMain
