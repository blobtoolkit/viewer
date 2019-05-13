import React, { Component } from "react";
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ReactDOM from "react-dom";
import styles from './Layout.scss';
import 'react-table/react-table.css';
import { datasetSummaries, listingColumns } from '../reducers/summary'

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
      <div id="list" className={css} style={{fontSize:'0.75em'}}>
        <ReactTable
          data={this.props.data}
          columns={columns}
          className={'-highlight'}
          min-width={50}
          defaultPageSize={Math.min(10,this.props.data.length)}
          showPageSizeOptions={this.props.data.length > 10}
          showPagination={this.props.data.length > 10}
          filterable={this.props.data.length > 1}
          defaultFilterMethod={(filter, row) =>
            (String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase()))}
        />
      </div>
    );
  }
}

class DatasetTable extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: datasetSummaries(state),
        columns: listingColumns(state)
      }
    }
  }

  render(){
    const ConnectedTable = connect(
      this.mapStateToProps
    )(DatasetTableComponent)
    return <ConnectedTable {...this.props}/>
  }
}

export default DatasetTable
