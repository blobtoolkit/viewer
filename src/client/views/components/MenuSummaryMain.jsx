import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getSummary } from '../reducers/summary'
import MenuSummary from './MenuSummary'
import MenuDataset from './MenuDataset'
import { getDatasetID } from '../reducers/location'


const SummaryMenu = ({values,zAxis,bins,palette,other,datasetId}) => {
  let props = {values,zAxis,bins,palette,other}
  return (
    <div className={styles.menu_outer}>
      <MenuDataset
        key={datasetId}
        id={datasetId}
        active={false}
        onDatasetClick={()=>{}}
        onDatasetMount={()=>{}}
      />

      { bins ?
        <MenuSummary {...props}/> :
        'Select a dataset to view summary statistics'
      }
    </div>
  )
};

const mapStateToProps = state => {
  let summary = getSummary(state) || {}
  let datasetId = getDatasetID(state)
  return {datasetId,...summary}
}

const MenuSummaryMain = connect(
  mapStateToProps
)(SummaryMenu)

export default MenuSummaryMain
