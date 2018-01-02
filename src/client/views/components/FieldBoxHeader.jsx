import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeaderButton from './FieldBoxHeaderButton'
import FieldBoxHeaderFilterButtons from './FieldBoxHeaderFilterButtons'
import SVGIcon from './SVGIcon'
import xAxisIcon from './svg/xAxis.svg';
import yAxisIcon from './svg/yAxis.svg';
import zAxisIcon from './svg/zAxis.svg';
import categoryIcon from './svg/category.svg';
import cloneIcon from './svg/clone.svg';
import showIcon from './svg/show.svg';
import hideIcon from './svg/showHide.svg';
import selectInverseIcon from './svg/invert.svg';
import selectAllIcon from './svg/selectAll.svg';
import selectNoneIcon from './svg/selectNone.svg';
import invertSelectionIcon from './svg/invertSelection.svg';

class FieldBoxHeader extends React.Component {
  checkAxisStatus(axis){
    if (this.props.plot.axes &&
      this.props.plot.axes[axis] == this.props.fieldId){
        return true
      }
    return false
  }
  render(){
    let buttons
    if (this.props.active){
      let icons
      if (this.props.type == 'variable'){
        icons = (
          <span>
            <SVGIcon sprite={xAxisIcon} active={this.checkAxisStatus('x')} onIconClick={()=>{this.props.onAxisButtonClick('x',this.props.fieldId)}}/>
            <SVGIcon sprite={yAxisIcon} active={this.checkAxisStatus('y')} onIconClick={()=>{this.props.onAxisButtonClick('y',this.props.fieldId)}}/>
            <SVGIcon sprite={zAxisIcon} active={this.checkAxisStatus('z')} onIconClick={()=>{this.props.onAxisButtonClick('z',this.props.fieldId)}}/>
            <SVGIcon sprite={cloneIcon} onIconClick={()=>{this.props.onCloneButtonClick(this.props.fieldId)}}/>
          </span>
        )
      }
      else if (this.props.type == 'category'){
        icons = (
          <span>
            <SVGIcon sprite={categoryIcon} active={this.checkAxisStatus('cat')} onIconClick={()=>{this.props.onAxisButtonClick('cat',this.props.fieldId)}}/>
          </span>
        )
      }
      if (this.props.type == 'selection'){
        icons = (
          <span>
          {this.props.hideSelection ? '' :
            (<span>
              <SVGIcon sprite={invertSelectionIcon} onIconClick={()=>{this.props.invertSelection()}}/>
              <SVGIcon sprite={selectNoneIcon} onIconClick={()=>{this.props.selectNone()}}/>
              <SVGIcon sprite={selectAllIcon} onIconClick={()=>{this.props.selectAll()}}/>
            </span>)}
            <SVGIcon sprite={this.props.hideSelection ? hideIcon : showIcon} active={this.props.hideSelection} onIconClick={()=>{this.props.toggleSelection(!this.props.hideSelection)}}/>
          </span>
        )
      }
      buttons = (
        <div className={styles.header_buttons}>
          {icons}
          <FieldBoxHeaderFilterButtons {...this.props}/>
        </div>
      )
    }
    else {
      buttons = (<div className={styles.header_type}>{this.props.type}</div>)
    }
    return (
      <div className={styles.header + ' ' + (this.props.active ? styles.active : '')}>
        <h1 className={styles.inline} onClick={()=>{this.props.onHeaderClick()}}>{this.props.fieldId}</h1>
        {buttons}
      </div>
    );
  }
}

export default FieldBoxHeader
