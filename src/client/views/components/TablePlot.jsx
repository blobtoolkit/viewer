import React from 'react'
import { connect } from 'react-redux'
import plotStyles from './Plot.scss'
import styles from './Layout.scss'
import './style/node_modules.css'
import { getTableData,getBinnedColors } from '../reducers/summary'
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

  generateColumns(fields,keys,plotCategory,binnedColors){
    let variables = { Header:'Variables', columns: [] }
    let categories = { Header:'Categories', columns: [] }
    Object.keys(fields).forEach(id=>{
      let field = fields[id]
      if (field.type == 'category'){
        let cat = {
          id: field.name,
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
          id: field.name,
          Header: () => field.name.replace('_',' '),
          accessor: d => d[id],
          minWidth: 50
        })
      }
    })
    return [variables,categories]
  }
  render(){
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
    return (
      <div className={plotStyles.outer}>
        <ReactTable
            data={data}
            page={this.state.page}
            onPageChange={(page)=>{this.setState({page})}}
            columns={columns}
            defaultPageSize={Math.min(this.state.pageSize,data.length)}
          />
          <DownloadCSV data={data}/>
      </div>
    )
  }
}

class TablePlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      let data = getTableData(state)
      let selCount = data.values.filter(o=>o.sel==true).length
      return {
        data,
        palette: getColorPalette(state),
        binnedColors: getBinnedColors(state),
        selectAll:(selCount == data.values.length),
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
