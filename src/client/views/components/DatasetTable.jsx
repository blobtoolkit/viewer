import React, { Component } from "react";
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ReactDOM from "react-dom";
import styles from './Layout.scss';
//import 'react-table/react-table.css';
import './style/node_modules.css'
import {
  datasetSummaries,
  listingColumns,
  getDatasetPage,
  setDatasetPage,
  getDatasetPageSize,
  setDatasetPageSize,
  getDatasetSorted,
  setDatasetSorted} from '../reducers/datasetTable'
import colors from './_colors'

class DatasetTableComponent extends Component {
  constructor() {
    super();
  }

  // btkUrl(props){
  //   let url = `https://blobtoolkit.genomehubs.org/view/${props.id}/dataset/${props.id}`
  //   if (!props.reads){
  //     url += '/cumulative'
  //   }
  //   return url
  // }

  // openWithAll(props){
  //   let sites = {
  //     BTK: {url:this.btkUrl(props)},
  //     Ensembl: {url:`http://ensembl.lepbase.org/${props.id}`},
  //     Download: {url:`http://download.lepbase.org/${props.id}`}
  //   }
  //   let links = []
  //   Object.keys(sites).forEach((site,i)=>{
  //     links.push(
  //       <a key={i} href={sites[site].url} target="_blank">
  //         {site}
  //       </a>
  //     )
  //   })
  //   return <span className={styles.links}>{links}</span>
  // }

  render() {
    let css = styles.list_container
    if (this.props.active){
      css += ` ${styles.active}`
    }
    let columns = this.props.columns
    return (
      <div id="list" className={css} style={{fontSize:'0.75em',paddingBottom:'0.5em'}}>
        <ReactTable
          data={this.props.data}
          columns={columns}
          className={'-highlight'}
          min-width={50}
          defaultPageSize={Math.min(this.props.pageSize,this.props.data.length)}
          showPageSizeOptions={this.props.data.length > 10}
          showPagination={this.props.data.length > 10}
          filterable={this.props.data.length > 1}
          sorted={this.props.sorted}
          page={this.props.page}
          defaultFilterMethod={(filter, row) =>
            (String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase()))}
          getTrProps={(state, rowInfo, column) => {
            return {
              onClick: (e, handleOriginal) => {
                let view = 'blob'
                if (!rowInfo.row['read-sets'] || rowInfo.row['read-sets'] == 0){
                  view = 'cumulative'
                }
                this.props.onDatasetClick(rowInfo.row.id, view)
              },
              style: {
                cursor: 'pointer',
              }
            }
          }}
          onSortedChange={(arr)=>{this.props.setPage(0); this.props.setSorted(arr);}}
          onPageChange={(newPage)=>{this.props.setPage(newPage)}}
          onPageSizeChange={(newPageSize, pageIndex)=>{this.props.changePageSize(newPageSize,this.props.pageSize,this.props.page); return (newPageSize,pageIndex)}}

        />
      </div>
    );
  }
}

// getTableProps={(props)=>{
//   return props
//   // props.page
//   // props.pageSize
//   // props.sorted
// }}
class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: datasetSummaries(state),
        columns: listingColumns(state),
        page: getDatasetPage(state),
        pageSize: getDatasetPageSize(state),
        sorted: getDatasetSorted(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        setPage: (page) => dispatch(setDatasetPage(page)),
        changePageSize: (newSize,oldSize,oldPage) => {
          dispatch(setDatasetPageSize(newSize))
          let newPage = Math.floor(oldSize / newSize * oldPage)
          dispatch(setDatasetPage(newPage))
        },
        setSorted: (arr) => dispatch(setDatasetSorted(arr))
      }
    }
  }

  render(){
    const ConnectedTable = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(DatasetTableComponent)
    return <ConnectedTable {...this.props}/>
  }
}

export default DatasetTable
