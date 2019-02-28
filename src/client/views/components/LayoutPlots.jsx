import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getDatasetIsActive } from '../reducers/repository'
import { toggleHash, getView, getStatic, getDatasetID } from '../reducers/location'
import { getDatasetName } from '../reducers/dataset'
import { getScatterPlotData } from '../reducers/plotData'
import GetStarted from './GetStarted'
import MainPlot from './MainPlot'
import BuscoPlot from './BuscoPlot'
import CumulativePlot from './CumulativePlot'
import DetailPlot from './DetailPlot'
import SnailPlot from './SnailPlot'
import StaticPlot from './StaticPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'
import DatasetSpinner from './DatasetSpinner'
import HomePage from './HomePage'
import SelectWarning from './SelectWarning'

class PlotsLayoutComponent extends React.Component {

  render(){
    if (!this.props.datasetId) return <HomePage toggleHash={this.props.toggleHash}/>
    let view
    if (this.props.static){
      switch (this.props.view) {
        case 'detail':
          view = <DetailPlot {...this.props}/>
          break
        default:
          view = <StaticPlot {...this.props}/>
          break
      }
    }
    else {
      switch (this.props.view || 'blob') {
        case 'busco':
          view = <BuscoPlot {...this.props}/>
          break
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

    }
    return (
      <div className={styles.fill_parent}>
        {view}
        <DatasetSpinner/>
        <SelectWarning/>
      </div>
    )
  }
}

class LayoutPlots extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      let isStatic = getStatic(state)
      if (isStatic){
        return {
          active: getDatasetIsActive(state),
          datasetId: getDatasetID(state),
          view: getView(state),
          static: true
        }
      }
      // if (!getScatterPlotData(state)) {
      //   return {
      //     datasetId: getDatasetID(state)
      //   }
      // }
      return {
        active: getDatasetIsActive(state),
        datasetId: getDatasetID(state),
        datasetName: getDatasetName(state),
        view: getView(state)
      }
    },
    this.mapDispatchToProps = dispatch => {
      return {
        toggleHash: value => dispatch(toggleHash(value))
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps,
      this.mapDispatchToProps,
    )(PlotsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default LayoutPlots
