import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { getDatasetMeta } from '../reducers/repository'
import { withRouter } from "react-router-dom";

class MenuDataset extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => (
      {
        meta: getDatasetMeta(state,this.props.id)
      }
    )
  }

  componentDidMount(){
    this.props.onDatasetMount(this.props.id);
  }

  render(){
    const ConnectedDataset = connect(
      this.mapStateToProps,
      false
    )(Dataset)

    // return (
    //   <Link to={'/view/'+this.props.id}>
    //     <div className={styles.menu_item} onClick={()=>{this.props.onMount(this.props.id)}}>
    //       <ConnectedDataset/>
    //     </div>
    //   </Link>
    // )
    return (
      <ConnectedDataset {...this.props}/>

    )

  }


}

// <div className={css} onClick={()=>this.props.onDatasetClick(this.props.id)}>

class Dataset extends React.Component {
  onDatasetClick(id){
    this.props.history.push('/view/'+id)
  }
  render(){
    if (!this.props.meta){
      return <Spinner/>
    }
    let css = styles.menu_item
    if (this.props.active) css += ' '+styles.active
    return (
      <div className={css} onClick={()=>this.onDatasetClick(this.props.id)}>
        <h3>{this.props.meta.name}</h3>
        <span className={styles.menu_subtitle}>{this.props.meta.records} {this.props.meta.record_type}</span>
      </div>
    )
  }
}

export default withRouter(MenuDataset)
