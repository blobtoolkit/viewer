import { connect } from 'react-redux'
import { fetchMeta } from '../actions/dataset'
import AvailableDatasetList from '../components/AvailableDatasetList'
import { BrowserHistory } from 'react-history'

const mapStateToProps = state => {
  console.log(state)
  return {
    isFetching: state.repository.isFetching,
    datasets: state.repository.availableDatasets
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDatasetClick: id => {}
  }
}
const Repository = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableDatasetList)

export default Repository
