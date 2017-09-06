import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeader from './FieldBoxHeader'
import FieldRawDataPreview from './FieldRawDataPreview'
import Filter from './Filter'
import * as d3 from 'd3'
import { getFieldMetadata, getFilterMetadata } from '../reducers/repository'

class FieldBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {yScale:d3.scaleLinear().domain([0, 100]).range([100, 0])}
  }
  toggleState(key){
    let obj = {id:this.props.fieldId};
    obj[key] = this.props.hasOwnProperty(key) ? !this.props[key] : true;
    this.props.toggleActive(obj);
    this.props.showData(this.props.fieldId);
  }
  render(){
    let outer_css = styles.outer
    if (this.props.active){
      outer_css += ' '+styles.expanded;
    }
    let filterType = false;
    return (
      <div id={this.props.fieldId} className={outer_css} onClick={()=>{}}>
        <FieldBoxHeader {...this.props} onHeaderClick={()=>{this.toggleState('active')}}/>
        <div className={styles.main}>
          <FieldRawDataPreview {...this.props} updateYScale={(obj)=>{this.setState(obj)}}/>
        </div>
        <Filter {...this.props} />
      </div>
    );
  }
}

export default FieldBox
