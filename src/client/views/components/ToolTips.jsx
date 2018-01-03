import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { editFilter } from '../reducers/filter'
import { getDetailsForFilterId } from '../reducers/preview'


const sets = (set) => {
  let tips = {}
  tips.xAxis = {name:'xAxis',detail:'assign variable to x-axis',filterMenu:1}
  tips.yAxis = {name:'yAxis',detail:'assign variable to y-axis',filterMenu:1}
  tips.zAxis = {name:'zAxis',detail:'use variable to scale points/bins',filterMenu:1}
  tips.category = {name:'category',filterMenu:1}
  tips.clone = {name:'clone',filterMenu:1}
  tips.invert = {name:'invert',filterMenu:1}
  tips.show = {name:'showSelection',filterMenu:1}
  tips.showHide = {name:'hideSelection',filterMenu:1}
  tips.selectAll = {name:'selectAll',filterMenu:1}
  tips.selectNone = {name:'selectNone',filterMenu:1}
  tips.invertSelection = {name:'invertSelection',filterMenu:1}
  tips['field-header'] = {name:'activate',filterMenu:1}
  //tips['header-type'] = {name:'field type',filterMenu:1}
  tips['active-field-header'] = {name:'deactivate',filterMenu:1}
  tips['draggable-arrow'] = {name:'drag to set range',filterMenu:1}
  tips['range-input'] = {name:'set range',filterMenu:1}
  tips['create-list-input'] = {name:'set list name',filterMenu:1}
  tips['create-list-button'] = {name:'convert current filter to list',filterMenu:1}
  tips['filter-summary'] = {name:'summary of filtered dataset',filterMenu:1}
  tips['filter-button'] = {name:'apply filter',filterMenu:1}
  tips['category-toggle'] = {name:'toggle category',filterMenu:1}
  return tips
}

const ActiveToolTips = ( { set, detail } ) => {
  let tips = sets(set)
  let toolTips = Object.keys(tips).map(tip=>(<ReactTooltip key={tip} id={tip}>{tips[tip].name}</ReactTooltip>))
  return (
    <span>
      {toolTips}
    </span>
  )
}

class ToolTips extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return {}
        // return getDetailsForFilterId(state, props.filterId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        // onUpdateRange: (id,range) => {return dispatch(editFilter({id,range}))}
      }
    }
  }

  render(){
    const ConnectedToolTips = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(ActiveToolTips)
    return (
      <ConnectedToolTips {...this.props}/>
    )
  }
}

export default ToolTips
