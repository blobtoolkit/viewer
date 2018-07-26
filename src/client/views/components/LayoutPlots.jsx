import React from 'react'
import { connect } from 'react-redux'
import { Router, Switch, Route } from 'react-router-dom'
import styles from './Layout.scss'
import { loadDataset, getDatasetIsActive } from '../reducers/repository'
import { withRouter } from 'react-router-dom'
import GetStarted from './GetStarted'
import MainPlot from './MainPlot'
import CumulativePlot from './CumulativePlot'
import DetailPlot from './DetailPlot'
import SnailPlot from './SnailPlot'
import TablePlot from './TablePlot'
import TreeMapPlot from './TreeMapPlot'


class PlotsLayoutComponent extends React.Component {
  render(){
    let view = <GetStarted {...this.props}/>
    switch (this.props.match.params.view || 'blob') {
      case 'cumulative':
        view = <CumulativePlot {...this.props}/>
        break
      case 'detail':
        view = <DetailPlot {...this.props}/>
        break
      case 'snail':
        view = <SnailPlot {...this.props}/>
        break
      case 'table':
        view = <TablePlot {...this.props}/>
        break
      case 'treemap':
        view = <TreeMapPlot {...this.props}/>
        break
      case 'report':
        view = (
          <div className={styles.fill_parent}>
            <div className={styles.quarter}>
              <DetailPlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <MainPlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <CumulativePlot {...this.props}/>
            </div>
            <div className={styles.quarter}>
              <SnailPlot {...this.props}/>
            </div>
          </div>
        )
        break
      default:
        view = <MainPlot {...this.props}/>
        break

    }
    return (
      <div className={styles.fill_parent}>
        {this.props.active ? view : <GetStarted/>}
      </div>
    )
  }
}

class LayoutPlots extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        active: getDatasetIsActive(state)
      }
    }
  }

  render(){
    const ConnectedLayout = connect(
      this.mapStateToProps
    )(PlotsLayoutComponent)
    return <ConnectedLayout {...this.props}/>
  }
}

export default withRouter(LayoutPlots)
