import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getBuscoSets } from '../reducers/summary'
import Busco from './Busco'
import PlotMissing from './PlotMissing'
import getSelectedDatasetMeta from '../reducers/dataset'

class BuscoSets extends React.Component {
  render(){
    if (!this.props.buscoSets) {
      return (
        <PlotMissing view='busco' name={this.props.datasetName}/>
      )
    }
    let buscos = []
    this.props.buscoSets.forEach((id,i)=>{
      buscos.push(<Busco key={i} id={id}/>)
    })
    return (
      <div className={styles.fill_parent}>
        {buscos}
      </div>
    )
  }
}

class BuscoPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        buscoSets: getBuscoSets(state)
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

export default BuscoPlot
