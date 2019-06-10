import React, { Component } from "react";
import { connect } from 'react-redux'
import ReactDOM from "react-dom";
import styles from './Layout.scss';
import treeStyles from './Tree.scss';
import {
  getDatasetTree,
  fetchDatasetTree,
  treeData,
  getExpandedNodes,
  expandNode,
  collapseNode,
  getDatasetCounter,
  setDatasetCounter} from '../reducers/datasetTree'
import { fetchRepository } from '../reducers/repository'
import colors from './_colors'
import Spinner from './Spinner'




class DatasetTreeComponent extends Component {
  constructor() {
    super();
  }

  componentDidMount(){
    if (!this.props.data.isInitialised && !this.props.data.isFetching){
      this.props.fetchDatasetTree()
    }
  }



  drawNested(obj){
    let widths = this.props.treeData.widths
    let nested = obj.map((child,i) => {
      let inner
      let toggleNode = this.props.expandNode
      let css = treeStyles.outer
      // if (!child.leaf && !child.count){
      //   css += ' '+treeStyles.zero
      // }
      // else if (child.count && child.count < child.total){
      //   css += ' '+treeStyles.partial
      // }
      // else {
      //   css += ' '+treeStyles.complete
      // }
      css += ' '+treeStyles['d'+child.depth]

      if (this.props.expanded.hasOwnProperty(child.node_id)){
          inner = (<div className={treeStyles.group}>
            {this.drawNested((child.descendants || []))}
          </div>)
          toggleNode = this.props.collapseNode
        }
        let countField = 'count'
        let totalField = 'total'
        if (this.props.datasetCounter === 'species'){
          countField = 'species'
          totalField = 'speciesTotal'
        }
        let count
        let progress
        let pbar
        let name = child.name
        if (name.endsWith('-undef')) name = 'Other '+name.replace('-undef','')
        let label = (<span className={treeStyles.plain}>
          {name} </span>)

        if (child[countField]){
          count = (<span className={treeStyles.search} onClick={()=>toggleNode([child.node_id],child.parent)}>
            ({child[countField]}
             {child[totalField] && <span className={treeStyles.total}>/{child[totalField]}</span>})
          </span>)
          label = (<span className={treeStyles.search} onClick={() => this.props.onChooseTerm(child.name)}>
            {name} </span>)
          progress = <div className={treeStyles.progress} style={{width:(child[countField]/child[totalField]*100)+'%'}}></div>
        }
        else if (child[totalField]){
          count = (<span className={treeStyles.search} onClick={()=>toggleNode([child.node_id],child.parent)}>
            (0
              <span className={treeStyles.total}>/{child[totalField]}</span>
            )
          </span>)
        }
        if (child[totalField]){
          let pcss = treeStyles.progress_outer
          if (child[countField]){
            pcss += ' '+treeStyles.partial
          }
          pbar = <div className={pcss}>{progress}</div>
        }
        return (
          <div key={i} className={css}>
            <div className={treeStyles.name}
                 style={{width:widths[child.depth]*this.props.scale+'em'}}>
              {label}
              {count}
              {pbar}
            </div>
            {inner}
          </div>
        )
      })
    return nested
  }

  counterChange(e){
    this.props.setDatasetCounter(e.currentTarget.value)
  }

  render() {
    if (!this.props.treeData.nested){
      return null
    }
    let ranks = this.props.treeData.ranks
    let widths = this.props.treeData.widths
    let scale = this.props.scale
    let headers = (<div>
      {ranks.map((rank,i)=>{
        return (
          <span key={i}
                className={treeStyles.header}
                style={{width:widths[i]*scale+'em'}}>
            {rank}
          </span>
        )
      })}
    </div>)
    let nestedDivs = this.drawNested(this.props.treeData.nested)
    let width = Math.max(widths.reduce((a,b)=>a+b)*scale, 60)
    return (
      <div className={treeStyles.container}
           style={{width:width+'em'}}>
        <p>Browse datasets:</p>
        <div className={treeStyles.scroller}>
          {headers}
          {nestedDivs}
        </div>
        <span className={styles.hints}>
          <ul style={{marginTop:'0.25em'}}>
            <li>show counts for
              <input type="radio"
                     name="datasetCounter"
                     value="assemblies"
                     checked={this.props.datasetCounter === 'assemblies'}
                     onChange={(e)=>this.counterChange(e)}/>
              assemblies or
              <input type="radio"
                     name="datasetCounter"
                     value="species"
                     checked={this.props.datasetCounter === 'species'}
                     onChange={(e)=>this.counterChange(e)}/>
              species.</li>
            <li>Click a taxon name to list all assemblies in that taxon.</li>
            <li>Numbers indicate available {this.props.datasetCounter} / total INSDC registered {this.props.datasetCounter}, click a number to expand taxonomy.</li>
          </ul>
        </span>
      </div>
    )
  }
}

class DatasetTree extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: getDatasetTree(state),
        expanded: getExpandedNodes(state),
        treeData: treeData(state),
        datasetCounter: getDatasetCounter(state),
        scale: 0.75
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        fetchDatasetTree: () => dispatch(fetchDatasetTree()),
        setDatasetCounter: (value) => dispatch(setDatasetCounter(value)),
        expandNode: (node,parent) => dispatch(expandNode(node,parent)),
        collapseNode: (node) => dispatch(collapseNode(node)),
        onChooseTerm: (str) => {
          dispatch(fetchRepository(str.replace('-undef','')))
        }
      }
    }
  }

  render(){
    const ConnectedTable = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(DatasetTreeComponent)
    return <ConnectedTable {...this.props}/>
  }
}

export default DatasetTree
