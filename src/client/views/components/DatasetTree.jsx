import React, { Component } from "react";
import { connect } from 'react-redux'
import ReactDOM from "react-dom";
import styles from './Layout.scss';
import treeStyles from './Tree.scss';
import {
  getDatasetTree,
  fetchDatasetTree,
  getExpandedNodes,
  expandNode,
  collapseNode} from '../reducers/datasetTree'
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

  drawNested(obj,name){
    console.log(this.props)
    let nodes = this.props.expanded
    if (obj.d){
      let nested = Object.keys(obj.d).map((key,i) => {
        let inner
        let toggleNode = this.props.expandNode
        if (this.props.expanded[obj.d[key].n]){
          inner = (<div className={treeStyles.group}>
            {this.drawNested(obj.d[key],key)}
          </div>)
          toggleNode = this.props.collapseNode
        }
        let count
        if (obj.d[key].c){
          count = (<span onClick={()=>toggleNode([obj.d[key].n])}>
            ({obj.d[key].c})
          </span>)
        }
        return (
          <div key={i} className={treeStyles.outer}>
            <div className={treeStyles.name}>
              <span onClick={()=>this.props.onChooseTerm(key)}>
                {key} </span>
              {count}
            </div>
            {inner}
          </div>
        )
        // return this.drawNestedDivs(obj.d[key],name, rank)
      })
      return nested
    }
  }

  drawNestedDivs(obj,name,rank){
    if (obj.d){
      let nested = Object.keys(obj.d).map((key,i) => {
        if (obj.d[key].r && obj.d[key].r != rank){
          return (
            <div key={i} className={treeStyles.outer}>
              <div className={treeStyles.name}>
                <span onClick={()=>this.props.onChooseTerm(key)}>
                  {key} </span>
                <span onClick={()=>this.props.setExpandedNodes(obj.d[key].n)}>
                  ({obj.d[key].c})
                </span>
              </div>
              <div className={treeStyles.group}>
                {this.drawNestedDivs(obj.d[key],key,rank)}
              </div>
            </div>
          )
        }
        else if (rank && obj.d[key].r == rank){
          return (<div key={i} className={treeStyles.outer}>
            <div className={treeStyles.name}>
              <span onClick={()=>this.props.onChooseTerm(key)}>
                {key} </span>
              <span onClick={()=>this.props.setExpandedNodes(obj.d[key].n)}>
                ({obj.d[key].c})
              </span>
            </div>
          </div>)
        }
        return this.drawNestedDivs(obj.d[key],name, rank)
      })
      return nested
    }
    return (
      <div key={name}
           className={treeStyles.leaf}
           onClick={()=>this.props.onChooseTerm(name)}>
        {name}
      </div>
    )
  }

  render() {
    if (!this.props.data.tree){
      return null
    }
    // let nestedDivs = this.drawNestedDivs(this.props.data.tree,'root','family')
    let nestedDivs = this.drawNested(this.props.data.tree,'root')
    return (
      <div id="list" className={'none'} style={{fontSize:'0.75em',paddingBottom:'0.5em'}}>
        {nestedDivs}
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
        expanded: getExpandedNodes(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        fetchDatasetTree: () => dispatch(fetchDatasetTree()),
        expandNode: (int) => dispatch(expandNode(int)),
        collapseNode: (int) => dispatch(collapseNode(int)),
        onChooseTerm: (str) => {
          dispatch(fetchRepository(str))
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
