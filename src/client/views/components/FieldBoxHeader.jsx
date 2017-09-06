import React from 'react'
import styles from './Fields.scss';

class FieldBoxHeader extends React.Component {
  render(){
    return (
      <div className={styles.header} onClick={()=>{this.props.onHeaderClick()}}>
        <h1>{this.props.fieldId}</h1>
      </div>
    );
  }
}

export default FieldBoxHeader
