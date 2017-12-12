import React from 'react'
import styles from './Menu.scss';
import Palettes from '../containers/Palettes'

class MenuItem extends React.Component {
  render(){
    let content
    if (this.props.type == 'palette'){
      content = <Palettes/>
    }
    return (
      <div className={styles.outer}>
        <div className={styles.header}>
          <h1 className={styles.inline}>{this.props.name}</h1>
        </div>
        <div className={styles.content}>
          {content}
        </div>
      </div>
    )
  }
}


export default MenuItem
