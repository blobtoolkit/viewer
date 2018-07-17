import React from 'react';
import { connect } from 'react-redux'
import styles from './Plot.scss'

import { getCirclePlotDataForCategoryIndex }  from '../reducers/plotData'
import { getPlotResolution, getZScale }  from '../reducers/plotParameters'

export default class PlotBubblesCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        let val = getCirclePlotDataForCategoryIndex(state,this.props.x0)
        let obj = {}
        obj.color = val.color
        obj.data = val.data
        obj.scale = getZScale(state)
        obj.res = getPlotResolution(state)
        return obj
      }
    }
  }

  render(){
    const ConnectedBubblesCanvas = connect(
      this.mapStateToProps
    )(BubblesCanvas)
    return (
      <ConnectedBubblesCanvas />
    )
  }
}

class BubblesCanvas extends React.Component {
    componentDidMount() {
      let parent = this.canvas.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      let width = parent.clientWidth * 900 / 1420
      let height = parent.clientHeight * 900 / 1420
      this.canvas.width = Math.min(width,height)
      this.canvas.height = this.canvas.width
      this.updateCanvas()
    }
    componentDidUpdate() {
      let parent = this.canvas.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      let width = parent.clientWidth * 900 / 1420
      let height = parent.clientHeight * 900 / 1420
      this.canvas.width = Math.min(width,height)
      this.canvas.height = this.canvas.width
      this.updateCanvas();
    }
    updateCanvas() {
      let width = this.canvas.width*window.devicePixelRatio
      let height = this.canvas.height*window.devicePixelRatio
      // width = Math.min(width,height)
      // height = width
      const ctx = this.canvas.getContext('2d');
      ctx.scale(1/window.devicePixelRatio,1/window.devicePixelRatio)
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha=0.4
      ctx.fillStyle = this.props.color;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(89, 101, 111)';
      this.props.data.map(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x*width/900, bubble.y*width/900, bubble.r*width/900, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      })
    }


    render() {
      return (
        <canvas className={styles.main_canvas} ref={(elem) => { this.canvas = elem; }} width={this.canvas ? this.canvas.width : 1000 } height={this.canvas ? this.canvas.height : 1000}/>
      );
    }
}
