import React from 'react'
import styles from './Fields.scss';

class FieldSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {expanded:false}
  }
  toggleState(key){
    this.setState({[key]:!this.state[key]});
  }

  render(){
    let css = styles.preview_container
    if (this.state.expanded){
      css += ' '+styles.expanded
    }
    return (
  //    <div className={styles.header} onClick={()=>{this.props.onHeaderClick()}}>
      <div className={css}>
        <div className={styles.preview_container_header}
          onClick={()=>{this.toggleState('expanded')}}>
          <h1>{this.props.title}</h1>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default FieldSet
