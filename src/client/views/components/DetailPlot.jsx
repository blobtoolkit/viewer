import React from 'react'
import { connect } from 'react-redux'
import plotStyles from './Plot.scss'
import styles from './Layout.scss'
import './style/node_modules.css'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import ReactTable from 'react-table'
import ExternalLink from './ExternalLink'
import DownloadCSV from './TableCSV'

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page:0,
      pageSize:10,
      filter:[],
      sort:[],
      size:[]
    }
    // onPageChange={(pageIndex) => {...}} // Called when the page index is changed by the user
    // onPageSizeChange={(pageSize, pageIndex) => {...}} // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
    // onSortedChange={(newSorted, column, shiftKey) => {...}} // Called when a sortable column header is clicked with the column itself and if the shiftkey was held. If the column is a pivoted column, `column` will be an array of columns
    // onExpandedChange={(newExpanded, index, event) => {...}} // Called when an expander is clicked. Use this to manage `expanded`
    // onFilteredChange={(column, value) => {...}} // Called when a user enters a value into a filter input field or the value passed to the onFiltersChange handler by the Filter option.
    // onResizedChange={(newResized, event) => {...}} // Called when a user clicks on a resizing component (the right edge of a column header)
  }

  injectThProps(state, rowInfo, column){
    return {style:{display:'none'}}
  }

  render(){
    console.log(this.props.meta)
    // let keys = this.props.data.keys
    let data = this.props.data
    // let links = this.props.data.links
    // let ids = data.map(o=>o._id)
    let columns = [{
      Header:'Assembly metadata',
      columns:
      [
        {
          accessor: 'group'
        },
        {
          accessor: 'key'
        },
        {
          accessor: 'value',

        },
        // {
        //   Header: 'Links',
        //   id: 'links',
        //   accessor: d => (
        //     links.record.map((link,i)=>(
        //       <ExternalLink key={i} title={link.title} target='_blank' url={link.func(d)}/>
        //     ))
        //   ),
        //   show:(links.record[0] && links.record[0].title) ? true : false
        // }
      ]
    }]
    return (
      <div className={plotStyles.outer}>
        <ReactTable
            data={data}
            page={this.state.page}
            onPageChange={(page)=>{this.setState({page})}}
            columns={columns}
            showPagination={false}
            defaultPageSize={data.length}
            getTheadThProps={this.injectThProps}
          />
          <DownloadCSV data={data}/>
      </div>
    )
  }
}

class DetailPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: [
          {group:'Taxon',key:'Name',value:'Species name'},
          {group:'',key:'Taxon ID',value:1234},
          {group:'Assembly',key:'Accession',value:'GCA_000000.1'},
          {group:'',key:'INSDC',value:'CCMX01'},
        ],
        meta: getSelectedDatasetMeta(state)
      }
    }
  }

  render(){
    const ConnectedDetail = connect(
      this.mapStateToProps
    )(Detail)
    return <ConnectedDetail {...this.props}/>
  }
}

export default DetailPlot
