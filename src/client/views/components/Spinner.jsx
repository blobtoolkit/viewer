import React from 'react'
import PropTypes from 'prop-types'
import styles from './Repository.scss';

class Spinner extends React.Component {
  render(){
    return (
      <div style={{zIndex:100,width:'10em',height:'10em',position:'absolute',top:0,left:0,backgroundColor:'red'}}>
        loading&hellip;
      </div>
    )
  }
}
export default Spinner
