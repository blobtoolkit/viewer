import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { CSVLink, CSVDownload } from 'react-csv'
import { getCSVdata } from '../reducers/summary'
import { getSelectedDatasetId } from '../reducers/selectorCreators'

export const DownloadCSVComponent = ({data,dataset}) => {
  return (
    <CSVLink
      className={styles.save_csv}
      filename={dataset+'.csv'}
      data={data}>
      download csv
      </CSVLink>
  )
}


class DownloadCSV extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: getCSVdata(state),
        dataset: getSelectedDatasetId(state)
      }
    }
  }

  render(){
    const ConnectedCSV = connect(
      this.mapStateToProps
    )(DownloadCSVComponent)
    return <ConnectedCSV {...this.props}/>
  }
}

export default DownloadCSV
