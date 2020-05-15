import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getSearchTerm } from '../reducers/location'

const apiUrl = API_URL || '/api/v1'

class NotFound extends React.Component {
  render(){
    let datasetId = this.props.datasetId
    let searchTerm = this.props.searchTerm
    let message
    if (this.props.reason == 'api'){
      message = `Unable to connect to API at ${apiUrl}`
    }
    else if (datasetId){
      message = `Dataset ${datasetId} could not be found`
    }
    else {
      message = `An unknown error has occured`
    }
    return (
      <div className={styles.outer}>
        <div className={styles.centerContent}>
          <p className={styles.warn}>{message}</p>

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
