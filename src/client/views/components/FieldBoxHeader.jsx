import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeaderButton from './FieldBoxHeaderButton'
import SVGIcon from './SVGIcon'
import xAxisIcon from './svg/xAxis.svg';
import yAxisIcon from './svg/yAxis.svg';
import zAxisIcon from './svg/zAxis.svg';
import categoryIcon from './svg/category.svg';

class FieldBoxHeader extends React.Component {
  checkAxisStatus(axis){
    if (this.props.plot.axes &&
      this.props.plot.axes[axis] == this.props.fieldId){
        return true
      }
    return false
  }
  render(){
    return (
      <div className={styles.header}>
        <h1 className={styles.inline} onClick={()=>{this.props.onHeaderClick()}}>{this.props.fieldId}</h1>
        <div className={styles.header_buttons}>
          <SVGIcon sprite={xAxisIcon} active={this.checkAxisStatus('x')} onIconClick={()=>{this.props.onAxisButtonClick('x',this.props.fieldId)}}/>
          <SVGIcon sprite={yAxisIcon} active={this.checkAxisStatus('y')} onIconClick={()=>{this.props.onAxisButtonClick('y',this.props.fieldId)}}/>
          <SVGIcon sprite={zAxisIcon} active={this.checkAxisStatus('z')} onIconClick={()=>{this.props.onAxisButtonClick('z',this.props.fieldId)}}/>
          <SVGIcon sprite={categoryIcon} active={this.checkAxisStatus('cat')} onIconClick={()=>{this.props.onAxisButtonClick('cat',this.props.fieldId)}}/>
        </div>
      </div>
    );
  }
}

export default FieldBoxHeader
