import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { toggleHash, getView, getStatic, getDatasetID, getQueryString, setQueryString, getHashString } from '../reducers/location'
import { getDatasetName, getSelectedDatasetMeta } from '../reducers/dataset'
import { getScatterPlotData } from '../reducers/plotData'
import { getMainPlot, getCatAxis } from '../reducers/plot'
import { getDatasetIsActive, getStaticThreshold, getNohitThreshold } from '../reducers/repository'
import { getBinsForCat } from '../reducers/field'
import GetStarted from './GetStarted'
import FindDatasets from './FindDatasets'
import MainPlot from './MainPlot'
import BuscoPlot from './BuscoPlot'
import CumulativePlot from './CumulativePlot'
import DetailPlot from './DetailPlot'
import NoPlot from './NoPlot'
import SnailPlot from './SnailPlot'
import StaticPlot from './StaticPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'
import DatasetSpinner from './DatasetSpinner'
import HomePage from './HomePage'
import SelectWarning from './SelectWarning'
import { queryToStore } from '../querySync'
import qs from 'qs'
import { NoHitWarning } from './NoHitWarning'

const dataset_table = DATASET_TABLE || false

class PlotsLayoutComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {datasetId: this.props.datasetId, static: this.props.static, keys: false, cat: false, warn: false}
  }

  componentDidMount(){

  }
  componentDidUpdate(){
    if (!this.props.static && this.state.static){
      if (this.props.meta && this.props.meta.records > this.props.staticThreshold){
        this.setState({static: this.props.static})
      }
    }
    else if (this.props.static && !this.state.static){
      this.setState({static: this.props.static})
    }
    else if (this.props.queryString) {
      if (this.state.keys && !this.state.warn && qs.parse(this.props.queryString)[this.state.cat] == this.state.keys){
        this.setState({warn: true})
      }
      else if (this.state.warn && qs.parse(this.props.queryString)[this.state.cat] != this.state.keys){
        this.setState({warn: false})
      }
    }
    else if (this.state.warn){
      this.setState({warn: false})
    }
    if (!this.props.static){
      if (this.props.meta && this.props.meta.records > this.props.nohitThreshold
            && this.props.bins && this.props.cat
            && !this.state.keys && !this.state.cat){
        let index = this.props.bins.findIndex(x=>x.id=='no-hit')
        if (index > -1){
          let keys = this.props.bins[index].keys
          let cat = `${this.props.cat}--Keys`
          let qstr = `${this.props.cat}--Keys=${keys.join(',')}`
          this.setState({keys: keys.join(','), cat})
          this.props.updateStore(qstr)
          this.setState({warn: true})
        }
      }
      else if (this.props.meta && this.props.meta.records <= this.props.nohitThreshold
                 && this.state.keys && this.state.cat && this.state.warn){
        let qstr=`${this.props.cat}--Keys=&nohitThreshold=${this.props.nohitThreshold}`
        this.props.updateStore(qstr)
        this.setState({keys: false, cat: false, warn: false})
      }
    }


  }
  render(){
    let warning = this.state.warn && <NoHitWarning nohitThreshold={this.props.nohitThreshold}/>
    if (!this.props.datasetId ||
    dataset_table && this.props.activeTab == 'Datasets'){
      return <HomePage toggleHash={this.props.toggleHash}/>
    }
    let defaultPlot = <MainPlot {...this.props}/>
    if (this.props.active && this.props.active != 'loading' && Object.keys(this.props.plot.axes).length < 4){
      defaultPlot = <CumulativePlot {...this.props} warning='noBlob'/>
    }
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
        case 'notfound':
          view = <NoPlot {...this.props}/>
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
                <MainPlot {...this.props}/>
              </div>
              <div className={styles.quarter}>
                <CumulativePlot {...this.props}/>
              </div>
              <div className={styles.quarter}>
                <SnailPlot {...this.props}/>
              </div>
              <div className={styles.quarter}>
                <BuscoPlot {...this.props}/>
              </div>
              <div className={styles.quarter}>
                <DetailPlot {...this.props}/>
              </div>
            </div>
          )
          break
        default:
          view = defaultPlot
          break
      }

    }
    return (
      <div className={styles.fill_parent}>
        {view}
        <DatasetSpinner/>
        {warning}
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
          plot: getMainPlot(state),
          activeTab: getHashString(state),
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
        plot: getMainPlot(state),
        activeTab: getHashString(state),
        view: getView(state),
        bins: getBinsForCat(state),
        cat: getCatAxis(state),
        staticThreshold: getStaticThreshold(state),
        nohitThreshold: getNohitThreshold(state),
        meta: getSelectedDatasetMeta(state),
        static: false,
        queryString: getQueryString(state)
      }
    },
    this.mapDispatchToProps = dispatch => {
      return {
        toggleHash: value => dispatch(toggleHash(value)),
        updateStore: (str,searchReplace) => {
          let values = qs.parse(str.replace('?',''))
          dispatch(queryToStore({values,searchReplace}))
        },
        updateQueryString: (qStr) => dispatch(setQueryString(qStr))
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
