import React from 'react'
import styles from './Plot.scss';

class MainPlotBox extends React.Component {
  render(){
    console.log(this.props)
    return (
      <div className={styles.outer}>
        Main plot goes here
      </div>
    );
  }
}

export default MainPlotBox
