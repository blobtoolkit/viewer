import React from 'react';
import { connect } from 'react-redux'
import styles from './Layout.scss'
import { getLists,
  getSelectedList,
  uploadedFileToList } from '../reducers/list'
import { fetchRawData } from '../reducers/field'
import {
  getFullSummary,
  getBuscoSets
} from '../reducers/summary'
import MenuList from './MenuList'
import ListUpload from './MenuListUpload'
import DatasetCreateList from './DatasetCreateList'
import MenuDataset from './MenuDataset'
import { getDatasetID, getHashString } from '../reducers/location'

// const ListsMenu = ({lists,selectedList,onListClick,onDrop,datasetId}) => {
class ListsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {called: -1}
  }

  loadBusco() {
    if (this.props.buscoSets && this.props.fullSummary.busco){
      for (let i = 0; i < this.props.buscoSets.length; i++){
        let set = this.props.buscoSets[i].replace('_busco','')
        if (!this.props.fullSummary.busco[set]){
          if (i > this.state.called){
            this.props.fetchBuscoData(this.props.buscoSets[i])
            this.setState({called:i})
          }
          break
        }
      }
    }
  }

  componentDidMount(){
    this.loadBusco()
  }

  shouldComponentUpdate(nextProps, nextState){
    if (nextProps.buscoSets && nextProps.buscoSets.length > 1 && nextProps.fullSummary.busco){
      if (!this.props.fullSummary.busco){
        return true
      }
      let keys = Object.keys(nextProps.fullSummary.busco)
      for (let i = 0; i < keys.length; i++){
        let key = keys[i]
        if (!this.props.fullSummary.busco[key] || nextProps.fullSummary.busco[key].string != this.props.fullSummary.busco[key].string){
          return true
        }
      }
      return false
    }
    return true
  }

  componentDidUpdate(){
    this.loadBusco()
  }

  render(){
    if (this.state.loading){
      return (
        <div className={styles.menu_outer}>
          <MenuDataset
            key={this.props.datasetId}
            id={this.props.datasetId}
            active={false}
            onDatasetClick={()=>{}}
            onDatasetMount={()=>{}}
          />
          <DatasetCreateList />
          { this.props.lists.map((list,i) => (<MenuList key={i} onListClick={this.props.onListClick}/>))}
          {<ListUpload active={false} onDrop={this.props.onDrop}/>}
        </div>
      )
    }
    return (
      <div className={styles.menu_outer}>
        <MenuDataset
          key={this.props.datasetId}
          id={this.props.datasetId}
          active={false}
          onDatasetClick={()=>{}}
          onDatasetMount={()=>{}}
        />
        <DatasetCreateList />
        { this.props.lists.map((list,i) => (<MenuList key={i} {...list} summaryStats={this.props.fullSummary} onListClick={this.props.onListClick}/>))}
        {<ListUpload active={false} onDrop={this.props.onDrop}/>}
      </div>
    )
  }

};

const mapStateToProps = state => {
  return {
    lists: getLists(state),
    selectedList: getSelectedList(state),
    datasetId: getDatasetID(state),
    fullSummary: getFullSummary(state) || {},
    buscoSets: getBuscoSets(state),
    hashString: getHashString(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDrop: (acceptedFiles) => dispatch(uploadedFileToList(acceptedFiles)),
    fetchBuscoData: id => dispatch(fetchRawData(id))
  }
}

const MenuListsMain = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListsMenu)

export default MenuListsMain
