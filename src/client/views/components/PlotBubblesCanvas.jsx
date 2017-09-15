import React from 'react';
import styles from './Plot.scss'
import CanvasCircle from './CanvasCircle'
import { Layer, Stage } from 'react-konva';

class PlotBubblesCanvas extends React.Component {
    componentDidMount() {
       this.updateCanvas();
    }
    componentDidUpdate() {
       this.updateCanvas();
    }
    updateCanvas() {
      let width = this.canvas.width
      let height = this.canvas.height
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha=0.4
      ctx.fillStyle = this.props.color;
      ctx.lineWidth = 0.25;
      ctx.strokeStyle = '#999';
      this.props.bubbles.map(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.cx, bubble.cy, bubble.r, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
      })
    }
    render() {
      // console.log(this.props)
      return (
        <canvas className={styles.fill_parent} ref={(elem) => { this.canvas = elem; }} width={1000} height={1000}/>
      );
      // let circles = this.props.bubbles.map((bubble,i) => {
      //   return <CanvasCircle key={i} cx={bubble.cx} cy={bubble.cy} r={bubble.r} color={this.props.color}/>
      // })
      // return (
      //   <Stage width={1000} height={1000}>
      //     <Layer>
      //         {circles}
      //     </Layer>
      //   </Stage>
      // )
    }
}

export default PlotBubblesCanvas;
