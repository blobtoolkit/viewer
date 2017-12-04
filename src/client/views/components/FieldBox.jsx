import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeader from './FieldBoxHeader'
import FieldRawDataPreview from './FieldRawDataPreview'
import Filter from './Filter'
import * as d3 from 'd3'
import { CSSTransitionGroup } from 'react-transition-group'

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
    let fieldContent
    let filterContent
    if (this.props.active){
      outer_css += ' '+styles.expanded;
      fieldContent = (<div className={styles.main}>
        <FieldRawDataPreview {...this.props} updateYScale={(obj)=>{this.setState(obj)}}/>
      </div>)
      filterContent = <Filter {...this.props} />
    }
    let filterType = false;
    return (
      <div id={this.props.fieldId} className={outer_css} onClick={()=>{}}>
        <FieldBoxHeader {...this.props} onHeaderClick={()=>{this.toggleState('active')}}
         onAxisButtonClick={(axis,id)=>{this.props.setAxes(axis,id)}}
         onCloneButtonClick={(id)=>{this.props.cloneField(id)}}/>
        <CSSTransitionGroup
          transitionName={{
            enter: styles.preview_enter,
            enterActive: styles.preview_enter_active,
            leave: styles.preview_leave,
            leaveActive: styles.preview_leave_active,
            appear: styles.preview_appear,
            appearActive: styles.preview_appear_active
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          {fieldContent}
          {filterContent}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default FieldBox
