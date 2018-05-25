import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styles from './Layout.scss';
import { Link } from 'react-router-dom'
import Spinner from './Spinner'
import { createSelector } from 'reselect'
import { getDatasetMeta } from '../reducers/repository'
import { withRouter } from 'react-router-dom';
import { DatasetModal } from './DatasetModal'

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
  constructor(props) {
    super(props);
    this.state = {show:false}
  }
  render(){
    if (!this.props.meta){
      return <Spinner/>
    }
    let css = styles.menu_item
    if (this.props.active) css += ' '+styles.active
    // <div className={css} onClick={()=>this.props.onDatasetClick(this.props.id)}>
    return (
      <div className={css}>
        <div data-tip data-for='view-metadata' className={styles.right} onClick={()=>this.setState({show:true})}>
          meta
          <DatasetModal meta={this.props.meta} selected={this.state.show} dismiss={()=>this.setState({show:false})}/>
        </div>
        <a data-tip data-for='load-dataset' className={styles.most} href={'/demo/view/'+this.props.id}>
          <h3>{this.props.meta.name}</h3>
        </a>
        <span className={styles.menu_subtitle}>{this.props.meta.records} {this.props.meta.record_type}</span>
      </div>

    )
    // return (
    //   <a href={'/demo/view/'+this.props.id}>
    //     <div className={css}>
    //       <h3>{this.props.meta.name}</h3>
    //       <span className={styles.menu_subtitle}>{this.props.meta.records} {this.props.meta.record_type}</span>
    //       <Albert/>
    //     </div>
    //   </a>
    // )
  }
}

export default withRouter(MenuDataset)
