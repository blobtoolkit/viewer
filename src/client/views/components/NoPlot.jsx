import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getSearchTerm } from '../reducers/location'

class NotFound extends React.Component {
  render(){
    let datasetId = this.props.datasetId
    let searchTerm = this.props.searchTerm

    return (
      <div className={styles.outer}>
        <div className={styles.centerContent}>
          <p className={styles.warn}>{`Dataset ${datasetId} could not be found`}</p>
          
        </div>
      </div>
    )
  }
}

class NoPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        searchTerm: getSearchTerm(state)
      }
    }
  }

  render(){
    const ConnectedNoPlot = connect(
      this.mapStateToProps
    )(NotFound)
    return <ConnectedNoPlot {...this.props}/>
  }
}

export default NoPlot
