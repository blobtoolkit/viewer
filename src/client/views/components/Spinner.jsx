import React from 'react'
import PropTypes from 'prop-types'
import styles from './Spinner.scss';

class Spinner extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.id && (!this.props.active || this.props.active == 'loading')){
      this.state = { spinner: true }
      if (!this.props.active) this.props.onLoad(this.props.id)
    }
    else {
      this.state = { spinner: false }
    }
  }

  componentDidMount(){
  }

  componentWillUpdate() {
    if (this.props.active && this.props.active != 'loading' && this.state.spinner == true){
      this.setState({spinner: false})
    }
  }

  render(){
    if (!this.state.spinner){
      return null
    }
    return (
      <div id='spinner' className={styles.outer}>
        <div className={styles['lds-ripple']}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles.text}>
          loading
        </div>
      </div>
    )
  }
}
export default Spinner
