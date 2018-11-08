import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getBuscoSets } from '../reducers/summary'
import ExportButton from './ExportButton'
import Busco from './Busco'

class BuscoSets extends React.Component {
  render(){
    if (!this.props.buscoSets) return null
    let buscos = []
    this.props.buscoSets.forEach((id,i)=>{
      buscos.push(<Busco key={i} id={id}/>)
    })
    return (<div className={styles.fill_parent}>{buscos}</div>)
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
