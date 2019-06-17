import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
// import { getBuscoSets, getAllBuscoCSV } from '../reducers/summary'
import StaticBusco from './StaticBusco'
// import BuscoData from './BuscoData'
import PlotMissing from './PlotMissing'
import { getDatasetID } from '../reducers/location'
import { getSelectedDatasetMeta } from '../reducers/dataset'

class BuscoSets extends React.Component {

  render(){
    let buscoSets = this.props.meta.summaryStats.busco
    if (!buscoSets) {
      return (
        <PlotMissing view='busco' name={this.props.datasetName}/>
      )
    }
    let buscos = []
    Object.keys(buscoSets).forEach((id,i)=>{
      buscos.push(<StaticBusco key={i} id={id} data={buscoSets[id]}/>)
    })
    // <BuscoData {...this.props}/>
    return (
      <div className={styles.fill_parent}>
        {buscos}
      </div>
    )
  }
}

class StaticBuscoPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        meta: getSelectedDatasetMeta(state),
        datasetName: getDatasetID(state)
      }
    }
  }

  render(){
    const ConnectedBuscoSets = connect(
      this.mapStateToProps
    )(BuscoSets)
    return <ConnectedBuscoSets {...this.props}/>
  }
}

export default StaticBuscoPlot
