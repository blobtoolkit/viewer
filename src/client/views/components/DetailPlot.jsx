import React from 'react'
import { connect } from 'react-redux'
import plotStyles from './Plot.scss'
import styles from './Layout.scss'
import './style/node_modules.css'
import { getSelectedDatasetMeta } from '../reducers/dataset'
import { getSelectedDatasetTable, getLinks } from '../reducers/summary'
import ReactTable from 'react-table'
import ExternalLink from './ExternalLink'
import ExportButton from './ExportButton'
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
  }

  injectThProps(state, rowInfo, column){
    return {style:{display:'none'}}
  }

  render(){
    let data = this.props.data.data
    let meta = this.props.data.meta
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
          id: 'value',
          accessor: d => {
            let link
            if (d.link){
              link = (
                <span className={styles.detail_link}>
                  <ExternalLink title={d.link.title} target='_blank' url={d.link.func(d.meta)}/>
                </span>
              )
            }
            return (
              <span>
                {d.value}
                {link}
              </span>
            )
          }
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
      <div className={plotStyles.outer} style={{top:'4em',width:'calc(100% - 8em)',height:'calc(100% - 8em)'}}>
        <ReactTable
            data={data}
            page={this.state.page}
            onPageChange={(page)=>{this.setState({page})}}
            columns={columns}
            showPagination={false}
            defaultPageSize={data.length}
            getTheadThProps={this.injectThProps}
          />
          <span className={plotStyles.download}>
            <ExportButton data={meta} format='json' prefix={meta.id+'.meta'}/>
          </span>
      </div>
    )
  }
}

class DetailPlot extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        data: getSelectedDatasetTable(state),
        links: getLinks(state)
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
