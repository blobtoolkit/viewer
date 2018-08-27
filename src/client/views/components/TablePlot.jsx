import React from 'react'
import { connect } from 'react-redux'
import plotStyles from './Plot.scss'
import styles from './Layout.scss'
import './style/node_modules.css'
import {
  getTablePage, setTablePage,
  getTablePageSize, setTablePageSize,
  getTableSortField, setTableSortField,
  getTableSortOrder, setTableSortOrder
} from '../reducers/plotParameters'
import { getTableData,getBinnedColors,getTableDataForPage } from '../reducers/summary'
import { getColorPalette } from '../reducers/color'
import { addRecords, removeRecords } from '../reducers/select'
import PlotLegend from './PlotLegend'
import PlotAxisTitle from './PlotAxisTitle'
import CumulativePlotBoundary from './CumulativePlotBoundary'
const saveSvgAsPng = require('save-svg-as-png/lib/saveSvgAsPng.js')
import AxisTitle from './AxisTitle'
import ReactTable from 'react-table'
import ExternalLink from './ExternalLink'
import { fetchIdentifiers } from '../reducers/identifiers'
import DownloadCSV from './TableCSV'

const CategoryLabel = ({index,keys,colors}) => {
  return (
    <span>
      <span
          className={styles.colored_tab}
          style={{backgroundColor:colors[index]}}>
      </span>
      {keys[index]}
    </span>
  )
}

const RecordSelector = ({selected,id,toggleSelect}) => {
  let css = styles.colored_tab
  css += selected ? ' ' + styles['highlight'] : ' ' + styles['clear']
  return (
    <span className={css} onClick={()=>toggleSelect(id,!selected)}/>
  )
}


class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page:props.page,
      pageSize:props.pageSize,
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

  generateColumns(fields,keys,plotCategory,binnedColors){
    let variables = { Header:'Variables', columns: [] }
    let categories = { Header:'Categories', columns: [] }
    Object.keys(fields).forEach(id=>{
      let field = fields[id]
      if (field.type == 'category'){
        let cat = {
          id: field.id,
          Header: () => field.name.replace('_',' '),
          accessor: d => d[id]
        }
        if (id == plotCategory){
          cat.Cell = props => <CategoryLabel index={props.value} keys={keys[id]} colors={binnedColors}/>
        }
        else {
          cat.Cell = props => keys[id] ? keys[id][props.value] : 0
        }
        categories.columns.push(cat)
      }
      if (field.type == 'variable'){
        variables.columns.push({
          id: field.id,
          Header: () => field.name.replace('_',' '),
          accessor: d => d[id],
          minWidth: 50
        })
      }
    })
    return [variables,categories]
  }
  render(){
    if (!this.props.data) return null
    let keys = this.props.data.keys
    let data = this.props.data.values
    let links = this.props.data.links
    let ids = data.map(o=>o._id)
    let toggleSelect = this.props.toggleSelect
    let columns = [{
      Header:'',
      columns:
      [
        {
          accessor: 'selected',
          Cell: props => <RecordSelector selected={props.original.sel} id={[props.original._id]} toggleSelect={toggleSelect}/>,
          width: 30,
          Header: props => <RecordSelector selected={this.props.selectAll} id={ids} toggleSelect={toggleSelect}/>,
          resizable: false
        },
        {
          Header: '#',
          accessor: '_id',
          width: 65
        },
        {
          Header: 'ID',
          accessor: 'id',
          show:(data[0] && data[0].id) ? true : false
        },
        {
          Header: 'Links',
          id: 'links',
          accessor: d => (
            links.record.map((link,i)=>(
              <ExternalLink key={i} title={link.title} target='_blank' url={link.func(d)}/>
            ))
          ),
          show:(links.record[0] && links.record[0].title) ? true : false
        }
      ]
    }]
    columns = columns.concat(this.generateColumns(this.props.data.fields,this.props.data.keys,this.props.data.plot.cat.meta.id,this.props.binnedColors))
    let warning
    if (this.props.warning){
      warning = <span>Only showing first 100,000 rows, download <code>csv</code> for full dataset</span>
    }
    let page = this.props.page
    let pages = this.props.data.pages
    let pageSize = this.props.pageSize
    return (
      <div className={plotStyles.outer}>
        <ReactTable
            data={data}
            page={0}
            pageSize={pageSize}
            columns={columns}
            getPaginationProps={(props)=>{
              let updated = {...props}
              updated.pages = pages
              updated.page = page
              updated.canNext = updated.page < updated.pages - 1
              updated.canPrevious = updated.page > 0
              return updated
            }}
            onSortedChange={(arr)=>{this.props.updateSort(arr);}}
            onPageChange={(newPage)=>{this.props.changePage(newPage)}}
            onPageSizeChange={(newPageSize, pageIndex)=>{this.props.changePageSize(newPageSize,page,pageSize); return (newPageSize,pageIndex)}}
          />
        <DownloadCSV data={data}/>
        {warning}
      </div>
    )
  }
}

class TablePlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      let data = getTableDataForPage(state)
      if (!data) return {}
      let warning
      if (data.values.length > 100000){
        let subset = {}
        subset.values = data.values.slice(0,100000)
        subset.keys = data.keys
        subset.plot = data.plot
        subset.fields = data.fields
        subset.links = data.links
        warning = true
        data = subset
      }
      let selCount = data.values.filter(o=>o.sel==true).length
      return {
        data,
        palette: getColorPalette(state),
        page: getTablePage(state),
        pageSize: getTablePageSize(state),
        binnedColors: getBinnedColors(state),
        selectAll:(selCount == data.values.length),
        warning
      }
    }
    this.mapDispatchToProps = dispatch => {
      dispatch(fetchIdentifiers())
      return {
        toggleSelect: (id,add) => {
          if (add){
            dispatch(addRecords(id))
          }
          else {
            dispatch(removeRecords(id))
          }
        },
        changePage: (page) => {
          dispatch(setTablePage(page))
        },
        changePageSize: (newSize,oldSize,oldPage) => {
          dispatch(setTablePageSize(newSize))
          let newPage = Math.floor(oldSize / newSize * oldPage)
          dispatch(setTablePage(newPage))
        },
        updateSort: (arr) => {
          if (arr.length == 1){
            dispatch(setTableSortField(arr[0].id))
            dispatch(setTableSortOrder(arr[0].desc ? 'desc' : 'asc'))
          }
          dispatch(setTablePage(0))
        }
      }
    }
  }

  render(){
    const ConnectedTable = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Table)
    return <ConnectedTable {...this.props}/>
  }
}

export default TablePlot
