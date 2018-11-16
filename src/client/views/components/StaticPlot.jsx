import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import { getStaticFields } from '../reducers/dataset'
import StaticWarning from './StaticWarning'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import { getStaticThreshold } from '../reducers/repository'

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
    this.state = { source: null };
  }

  componentDidMount(){
    if (this.refs.static_image && this.props.hasStatic){
      this.fetchImage(this.props.view)
    }
  }


  fetchImage(view) {
    fetch(apiUrl + '/image/'+this.props.datasetId+'/'+view)
      .then(
        response => {
          response.arrayBuffer().then((buffer) => {
            let base64Flag = 'data:image/png;base64,';
            let imageStr = arrayBufferToBase64(buffer);
            if (this.refs.static_image){
              this.refs.static_image.src = base64Flag + imageStr;
            }
          }
        )},
        error => console.log('An error occured.', error)
      )
  }

  render(){
    return (
      <div className={styles.fill_parent}>
        <img  ref="static_image" style={{height:'100%'}} />
        <StaticWarning name={this.props.meta.name} threshold={this.props.threshold} records={this.props.meta.records} />
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
        threshold: getStaticThreshold(state)
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
