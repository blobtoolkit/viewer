import React from 'react'
import styles from './Filters.scss'
import { connect } from 'react-redux'
import { getFilteredBarsForFieldId } from '../reducers/preview'
import * as d3 from 'd3'
import Spinner from './Spinner'
import PreviewBars from './PreviewBars'

class FilterPreview extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        bars: getFilteredBarsForFieldId(state, this.props.filterId),
        barcss: styles.bar
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedPreview = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FilteredDataPreview)
    return <ConnectedPreview {...this.props}/>
  }
}

class FilteredDataPreview extends React.Component {

  render() {
    return (
      <div className={styles.filter_preview_container}>
        <svg>
          <PreviewBars bars={this.props.bars} barcss={this.props.barcss} />
        </svg>
      </div>
    );
  }

}

export default FilterPreview
