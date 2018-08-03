import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getDatasetIsActive } from '../reducers/repository'
import { getView, getDatasetID } from '../reducers/location'
import { getScatterPlotData } from '../reducers/plotData'
import GetStarted from './GetStarted'
import MainPlot from './MainPlot'
import CumulativePlot from './CumulativePlot'
import DetailPlot from './DetailPlot'
import SnailPlot from './SnailPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'
import DatasetSpinner from './DatasetSpinner'

class PlotsLayoutComponent extends React.Component {

  render(){
    if (!this.props.datasetId) return null
    let view
    switch (this.props.view || 'blob') {
      case 'cumulative':
        view = <CumulativePlot {...this.props}/>
        break
      case 'detail':
        view = <DetailPlot {...this.props}/>
        break
      case 'snail':
        view = <SnailPlot {...this.props}/>
        break
      case 'table':
        view = <TablePlot {...this.props}/>
        break
      case 'treemap':
        view = <TreeMapPlot {...this.props}/>
        break
      case 'report':
        view = (
          <div className={styles.fill_parent}>
            <div className={styles.quarter}>
              <DetailPlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <MainPlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <CumulativePlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <SnailPlot {...this.props}/>
            </div>
          </div>
        )
        break
      default:
        view = <MainPlot {...this.props}/>
        break

    }
    return (
      <div className={styles.fill_parent}>
        {view}
        <DatasetSpinner/>
      </div>
    )
  }
}

class LayoutPlots extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      if (!getScatterPlotData(state)) {
        return {
          datasetId: getDatasetID(state)
        }
      }
      return {
        active: getDatasetIsActive(state),
        datasetId: getDatasetID(state),
        view: getView(state)
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps
    )(PlotsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default LayoutPlots
