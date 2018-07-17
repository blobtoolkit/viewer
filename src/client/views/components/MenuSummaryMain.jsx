import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getSummary } from '../reducers/summary'
import MenuSummary from './MenuSummary'


const SummaryMenu = ({values,zAxis,bins,palette,other}) => {
  let props = {values,zAxis,bins,palette,other}
  return (
    <div className={styles.fill_parent}>
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
