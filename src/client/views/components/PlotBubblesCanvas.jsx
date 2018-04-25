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
      this.updateCanvas();
    }
    componentDidUpdate() {
      //console.log(this.props)
      this.updateCanvas();
    }
    updateCanvas() {
      let width = this.canvas.width
      let height = this.canvas.height
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha=0.4
      ctx.fillStyle = this.props.color;
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgb(89, 101, 111)';
      this.props.data.map(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      })
    }
    render() {
      return (
        <div className={styles.fill_parent}>
          <canvas className={styles.main_canvas} ref={(elem) => { this.canvas = elem; }} width={this.canvas ? this.canvas.width : 1000 } height={this.canvas ? this.canvas.height : 1000}/>
        </div>
      );
    }
}
