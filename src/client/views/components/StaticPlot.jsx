import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getStaticFields } from '../reducers/dataset'
import StaticWarning from './StaticWarning'
import StaticMissing from './StaticMissing'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import { getStaticThreshold } from '../reducers/repository'
import { getPlotShape } from '../reducers/plotParameters'

const apiUrl = API_URL || '/api/v1'

const arrayBufferToBase64 = buffer => {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};

class Static extends React.Component {
  constructor(props) {
    super(props);
    this.state = { source: null, available: true }
  }

  componentDidMount(){
    if (this.refs.static_image && this.props.hasStatic){
      let shape
      if (this.props.view == 'blob'){
        shape = this.props.shape
      }
      this.fetchImage(this.props.view, shape)
    }
  }
  componentWillUpdate(nextProps){
    if (this.refs.static_image
      && this.props.hasStatic
      && nextProps.shape != this.props.shape
    ){
      let shape
      if (this.props.view == 'blob'){
        shape = nextProps.shape
      }
      this.fetchImage(this.props.view, shape)
    }
  }


  fetchImage(view, shape) {
    let url = apiUrl + '/image/'+this.props.datasetId+'/'+view
    if (shape){
      url += '/' + shape
    }
    fetch(url)
      .then(
        response => {
          if (!response.ok){
            this.setState({ available: false})
            return
          }
          response.arrayBuffer().then((buffer) => {
            let base64Flag = 'data:image/png;base64,';
            let imageStr = arrayBufferToBase64(buffer);
            if (this.refs.static_image){
              this.refs.static_image.src = base64Flag + imageStr;
              this.setState({ available: true})
            }
          }
        )},
        error => console.log('An error occured.', error)
      )
  }

  render(){
    let warning
    if (this.state.available){
      warning = <StaticWarning name={this.props.meta.name} threshold={this.props.threshold} records={this.props.meta.records} />
    }
    else {
      warning = <StaticMissing name={this.props.meta.name} view={this.props.view} />
    }
    return (
      <div className={styles.fill_parent+' '+styles.centered_content}>
        <img className={styles.static_image} ref="static_image" />
        {warning}
      </div>
    )
  }
}

class StaticPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        hasStatic: getStaticFields(state),
        meta: getSelectedDatasetMeta(state),
        threshold: getStaticThreshold(state),
        shape: getPlotShape(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedStatic = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Static)
    return <ConnectedStatic {...this.props}/>
  }
}

export default StaticPlot
