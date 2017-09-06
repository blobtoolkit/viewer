import React from 'react'
import styles from './Fields.scss'
import { connect } from 'react-redux'
import { getBarsForFieldId } from '../reducers/field'
import { setDimension } from '../reducers/dimension'
import Spinner from './Spinner'
import PreviewBars from './PreviewBars'

class FieldRawDataPreview extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        bars: getBarsForFieldId(state, this.props.fieldId),
        barcss: styles.bar
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        onMount: (obj) => dispatch(setDimension(obj))
      }
    }
  }

  render(){
    const ConnectedRawDataPreview = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(RawDataPreview)
    return <ConnectedRawDataPreview {...this.props}/>
  }
}

class RawDataPreview extends React.Component {

  componentDidMount(){
    this.props.onMount({
      id:'preview',
      width:this.svg.clientWidth,
      height:this.svg.clientHeight
    })
  }

  render() {
    return (
      <div className={styles.data_preview_container}>
        <svg ref={(elem) => { this.svg = elem; }}>
          <PreviewBars bars={this.props.bars} barcss={this.props.barcss} />
        </svg>
      </div>
    );
  }

}

export default FieldRawDataPreview
