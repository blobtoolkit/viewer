import React from 'react'
import { connect } from 'react-redux'
import styles from './Layout.scss'

export class NoBlobWarning extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dismissed: false };
  }

  toggleDismissed(dismissed){
    this.setState({dismissed})
  }

  render(){
    if (this.state.dismissed){
      return <span className={styles.info} onClick={()=>this.toggleDismissed(false)}/>
    }
    else {
      return (
        <div className={styles.warning}>
          <h2>Plot axes have not been set</h2>
          <p>Default plot axes are not available for this dataset</p>
          Use the Filters menu to assign variables to axes.
          <span className={styles.dismiss} onClick={()=>this.toggleDismissed(true)}/>
        </div>
      )
    }

  }
}


export default NoBlobWarning
