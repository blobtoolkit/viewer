import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { getView, getDatasetID } from '../reducers/location'
import GetStarted from './GetStarted'
import MainPlot from './MainPlot'
import CumulativePlot from './CumulativePlot'
import DetailPlot from './DetailPlot'
import SnailPlot from './SnailPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'
import DatasetSpinner from './DatasetSpinner'

class PlotsLayoutComponent extends React.Component {
  // constructor(props) {
  //   super(props);
  //   console.log('construct')
  //   if (this.props.datasetId && !this.props.active){
  //     this.state = { spinner: true }
  //     this.props.onLoad(this.props.datasetId)
  //   }
  //   else {
  //     this.state = { spinner: false }
  //   }
  // }
  //
  // componentDidMount(){
  //   console.log('mount')
  //
  // }
  //
  // componentWillUpdate() {
  //   console.log('update')
  //   if (this.props.active && this.state.spinner == true){
  //     this.setState({spinner: false})
  //   }
  // }

  render(){
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
      return {
        active: getDatasetIsActive(state),
        datasetId: getDatasetID(state),
        view: getView(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onLoad: (id) => dispatch(loadDataset(id))
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(PlotsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default LayoutPlots
