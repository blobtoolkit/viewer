import React from 'react'
import styles from './Fields.scss';
import FieldBoxHeaderButton from './FieldBoxHeaderButton'

class FieldBoxHeader extends React.Component {
  render(){
    return (
      <div className={styles.header}>
        <h1 className={styles.inline} onClick={()=>{this.props.onHeaderClick()}}>{this.props.fieldId}</h1>
        <FieldBoxHeaderButton axis='cat' {...this.props} onAxisButtonClick={(axis,id)=>{console.log(axis);this.props.onAxisButtonClick(axis,id)}}/>
        <FieldBoxHeaderButton axis='z' {...this.props} onAxisButtonClick={(axis,id)=>{console.log(axis);this.props.onAxisButtonClick(axis,id)}}/>
        <FieldBoxHeaderButton axis='y' {...this.props} onAxisButtonClick={(axis,id)=>{console.log(axis);this.props.onAxisButtonClick(axis,id)}}/>
        <FieldBoxHeaderButton axis='x' {...this.props} onAxisButtonClick={(axis,id)=>{console.log(axis);this.props.onAxisButtonClick(axis,id)}}/>
      </div>
    );
  }
}

export default FieldBoxHeader
