import React from 'react'
import styles from './Layout.scss'
import DOIBadge from './DOIBadge'

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <Header tabs={tabs} onTabClick={(tab)=>{toggleHash(tab)}}/>
    )
  }
}

export default Footer
