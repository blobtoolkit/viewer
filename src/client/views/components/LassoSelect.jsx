import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
import colors from './_colors'
import PlotParameters from './PlotParameters'
import MainPlotBoundary from './MainPlotBoundary'
import Pointable from 'react-pointable';
import { getScatterPlotData,
  getDetailsForX,
  getDetailsForY } from '../reducers/plotData'
import { addRecords,
  replaceRecords,
  selectNone,
  getSelectPolygon,
  changeSelectPolygon,
  getSelectedRecords,
  getSelectionDisplay,
  getSelectSource,
  setSelectSource } from '../reducers/select'
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { polygonContains as d3polygonContains } from 'd3-polygon';
import { polygonHull as d3polygonHull } from 'd3-polygon';

export default class LassoSelect extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return {
          data: getScatterPlotData(state),
          polygon: getSelectPolygon(state),
          selectedRecords: getSelectedRecords(state),
          selectionDisplay: getSelectionDisplay(state),
          xMeta: getDetailsForX(state),
          yMeta: getDetailsForY(state),
          selectSource: getSelectSource(state)
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        addRecords:(arr) => {
          dispatch(setSelectSource('circle'))
          dispatch(addRecords(arr))
        },
        replaceRecords:(arr) => {
          dispatch(setSelectSource('circle'))
          dispatch(replaceRecords(arr))
        },
        selectNone:(arr) => {
          dispatch(setSelectSource('circle'))
          dispatch(selectNone())
        },
        changeSelectPolygon:(arr) => {
          dispatch(setSelectSource('circle'))
          dispatch(changeSelectPolygon(arr))
        }
      }
    }
  }

  render(){
    const ConnectedLassoSelect = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(Lasso)
    return (
      <ConnectedLassoSelect {...this.props}/>
    )
  }
}

const xScale = d3scaleLinear().range([-55.556,955.556])
const yScale = d3scaleLinear().range([-55.556,955.556])

const relativeCoords = event => {
  let bounds = event.target.getBoundingClientRect();
  //let width = bounds.right - bounds.left;
  xScale.domain([bounds.left,bounds.right])
  yScale.domain([bounds.top,bounds.bottom])
  let x = xScale(event.clientX)
  let y = yScale(event.clientY)
  //let height = bounds.bottom - bounds.top;
  //let x = ((event.clientX - bounds.left) - width * 0.05) / (width * 0.9) * 1000;
  //let y = ((event.clientY - bounds.top) - height * 0.05) / (height * 0.9) * 1000;
  return {x,y}
}

class Lasso extends React.Component {
  constructor(props) {
    super(props);
    let polygon = props.polygon
    if (props.selectSource != 'circle' && props.selectSource != 'list'){
      let len = props.selectedRecords.length
      if (len > 2){
        let points = []
        for (let i = 0; i < len; i++){
          let point = props.data.data.find(obj => {
            return obj.id === props.selectedRecords[i]
          })
          if (point) points.push([point.x,point.y])
        }
        polygon = d3polygonHull(points)
      }
    }
    let internodes = []
    let complete = false
    if (polygon && polygon.length > 2){
      if (props.selectSource == 'circle' || props.selectSource == 'list' ){
        let xConvert = props.xMeta.xScale.copy().range([0,900])
        let yConvert = props.yMeta.xScale.copy().range([900,0])
        polygon = polygon.map(arr=>[xConvert(arr[0]),yConvert(arr[1])])
      }
      if (props.selectSource == 'list' ){
        this.updateSelection(polygon, props.data.data)
      }
      complete = true
      polygon.forEach((x,i)=>{
        let point
        if (i > 0){
          point = [(x[0]+polygon[(i-1)][0])/2,(x[1]+polygon[(i-1)][1])/2]
        }
        else if (complete){
          point = [(x[0]+polygon[(polygon.length-1)][0])/2,(x[1]+polygon[(polygon.length-1)][1])/2]
        }
        if (point){
          internodes.push(point)
        }
      })
    }
    this.state = {active:false,mouseDown:false,points:polygon,internodes,last:{},current:[],complete,moveNode:-1}
  }

  updateSelection(points, data){
    let records = []
    if (points.length > 2){
      let len = data.length
      for (let i = 0; i < len; i++){
        let point = data[i]
        if (d3polygonContains(points, [point.x,point.y])){
          records.push(point.id)
        }
      }
    }
    let xConvert = this.props.xMeta.xScale.copy().range([0,900])
    let yConvert = this.props.yMeta.xScale.copy().range([900,0])
    points = points.map(arr=>[xConvert.invert(arr[0]),yConvert.invert(arr[1])])
    this.props.changeSelectPolygon(points)
    this.props.replaceRecords(records)
  }

  setMouseDown(bool,coords){
    //this.setState({mouseDown:bool})
    let active = this.state.active
    let arr = coords ? [coords.x, coords.y] : []
    let complete = false
    if (bool){
      if (!active){
        active = true
        this.props.selectNone()
      }
    }
    if (bool){
      this.setState({
        mouseDown:bool,
        current:arr,
        active
      })
    }
    else {
      if (!coords){
        if (this.state.complete){
          return
        }
        this.setState({
          mouseDown:bool,
          points: [],
          current:[],
          last: {},
          active: false,
          complete: false,
          internodes: []
        })
        return
      }
      let points = this.state.points.slice(0)
      let last = coords
      if (this.state.hover >= 0){
        if (this.state.hover == 0){
          active = false
          complete = true
          // points.push(arr)
          this.updateSelection(points, this.props.data.data)
        }
        else {
          complete = false
          last = {
            x:points[this.state.hover][0],
            y:points[this.state.hover][1]
          }
          points = points.slice(0,this.state.hover+1)
        }
      }
      else {
        if (this.state.complete){
          points = [arr]
          last = coords
          this.props.selectNone()
        }
        else {
          points.push(arr)
        }
      }
      // if (this.state.points.length > 1){
      //   points = this.state.points.concat([this.state.points[0]])
      //   last = {
      //     x:this.state.points[this.state.points.length-1][0],
      //     y:this.state.points[this.state.points.length-1][1]}
      // }
      let internodes = []
      points.forEach((x,i)=>{
        let point
        if (i > 0){
          point = [(x[0]+points[(i-1)][0])/2,(x[1]+points[(i-1)][1])/2]
        }
        else if (complete){
          point = [(x[0]+points[(points.length-1)][0])/2,(x[1]+points[(points.length-1)][1])/2]
        }
        if (point){
          internodes.push(point)
        }
      })
      this.setState({
        mouseDown:bool,
        points,
        current:[],
        last,
        active,
        complete,
        internodes
      })
    }
  }

  drawNode(coords, key, fill=-1){
    let nodeWidth = 20
    return (
      <rect fill={fill ? colors.highlightColor : colors.lightColor}
            key={key}
            x={coords[0]-nodeWidth/2}
            y={coords[1]-nodeWidth/2}
            height={nodeWidth}
            width={nodeWidth}/>
    )
  }

  drawInterNode(coords, key, fill=-1){
    let nodeWidth = 14
    return (
      <rect fill={fill ? colors.highlightColor : colors.lightColor}
            key={key}
            x={coords[0]-nodeWidth/2}
            y={coords[1]-nodeWidth/2}
            fillOpacity={fill ? 1 : 0.5}
            height={nodeWidth}
            width={nodeWidth}/>
    )
  }

  render(){
    let points = this.state.points
    let thresh = 15
    let latest
    let nodes, internodes
    let path

    if (this.props.selectionDisplay){
      if (this.state.active){
        let current = this.state.current
        let line
        if (current.length == 2){
          if (points.length > 0){
            line = <path d={`M${this.state.last.x} ${this.state.last.y}L${current.join(' ')}`}/>
          }
          let square = this.drawNode(current, 0, false)

          latest = (
            <g fill='none'
               stroke={colors.highlightColor}
               strokeWidth={5}
               opacity={0.5}>
              {line}
              {square}
            </g>
          )
        }

      }
      if (points && points.length > 0){
        nodes = []
        points.forEach((x,i)=>{
          nodes.push(this.drawNode(x,i,this.state.hover == i))
        })
        internodes = []
        this.state.internodes.forEach((x,i)=>{
          internodes.push(this.drawInterNode(x,i,this.state.ihover == i))
        })
        if (points.length > 1){
          let complete = this.state.complete ? 'Z' : ''
          path = (
            <path stroke={colors.highlightColor}
                  strokeWidth={5}
                  d={`M${(points[0]||[]).join(' ')} ${(points.slice(1)||[]).map(x=>'L'+(x||[]).join(' ')).join('')}${complete}`}/>
          )
        }

      }

    }
    let dasharray = this.props.selectSource == 'circle' ? undefined : '10'
    let fill = this.state.complete ? this.props.selectSource == 'circle' ? colors.halfHighlightColor : 'url(#pattern-checkers)' : 'none'
    return (
      <g>
        <pattern id="pattern-checkers" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" >
          <rect x="0" width="10" height="10" y="0" fill={colors.halfHighlightColor}/>
          <rect x="10" width="10" height="10" y="10" fill={colors.halfHighlightColor}/>
        </pattern>
        {this.props.selectionDisplay && (
          <g transform='translate(50,50)'>
            {latest}
            {points && points.length > 1 && (
              <g strokeDasharray={dasharray}
                 fill={fill}>
                {path}
              </g>)}
            {points && points.length > 0 && (
              <g fill={colors.lightColor}
                 stroke={colors.highlightColor}
                 strokeWidth={5}>
                {nodes}
                {internodes}
              </g>
            )}
          </g>
        )}
        <Pointable
          tagName='g'
          onPointerMove={(e)=>{
            e.preventDefault()
            let coords = relativeCoords(e)
            let current = [coords.x,coords.y]
            if (this.state.moveNode >= 0){
              points[this.state.moveNode] = current
              let internodes = []
              points.forEach((x,i)=>{
                let point
                if (i > 0){
                  point = [(x[0]+points[(i-1)][0])/2,(x[1]+points[(i-1)][1])/2]
                }
                else if (this.state.complete){
                  point = [(x[0]+points[(points.length-1)][0])/2,(x[1]+points[(points.length-1)][1])/2]
                }
                if (point){
                  internodes.push(point)
                }
              })
              this.setState({
                points,
                internodes
              })
            }
            else {
              let hover = -1
              let ihover = -1
              this.state.points.forEach((point,i)=>{
                let deltaX = (coords.x - point[0])
                let deltaY = (coords.y - point[1])
                if (Math.abs(deltaX) <= thresh && Math.abs(deltaY) <= thresh){
                  current = [point[0],point[1]]
                  hover = i
                }
              })
              this.state.internodes.forEach((point,i)=>{
                let deltaX = (coords.x - point[0])
                let deltaY = (coords.y - point[1])
                if (Math.abs(deltaX) <= thresh && Math.abs(deltaY) <= thresh){
                  ihover = i
                }
              })
              this.setState({
                current,
                hover,
                ihover
              })
            }
            // else {
            //   let hover = -1
            //   this.state.points.forEach((point,i)=>{
            //     let deltaX = (coords.x - point[0])
            //     let deltaY = (coords.y - point[1])
            //     if (Math.abs(deltaX) <= thresh && Math.abs(deltaY) <= thresh){
            //       hover = i
            //     }
            //   })
            //   this.setState({
            //     hover
            //   })
            // }
          }}
          onPointerLeave={(e)=>{
            e.preventDefault()
            this.setMouseDown(false)
          }}
          onPointerDown={(e)=>{
            e.preventDefault()
            let coords = relativeCoords(e)
            if (this.state.hover >= 0 && this.state.complete){
              this.setState({moveNode:this.state.hover})
            }
            else if (this.state.ihover >= 0 && this.state.complete){
              let hover = this.state.ihover
              let moveNode = hover
              let ihover = -1
              points.splice(this.state.ihover,0,this.state.internodes[this.state.ihover])
              this.setState({
                points,
                hover,
                moveNode,
                ihover})
            }
            else {
              this.setMouseDown(true,coords)
            }
          }}
          onPointerUp={(e)=>{
            e.preventDefault()
            if (this.state.moveNode >= 0){
              this.updateSelection(this.state.points, this.props.data.data)
              this.setState({moveNode:-1})
            }
            else {
              let coords = relativeCoords(e)
              if (this.state.hover >= 0){
                coords = {
                  x:this.state.points[this.state.hover][0],
                  y:this.state.points[this.state.hover][1]
                }
              }
              this.setMouseDown(false,coords)
            }


          }}
          >
          <MainPlotBoundary/>
        </Pointable>
      </g>
    )
  }
}
