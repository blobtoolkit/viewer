import React from 'react';
import PlotBubble from './PlotBubble'
import styles from './Plot.scss'

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
      this.props.bubbles.map(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.cx, bubble.cy, bubble.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.props.color;
        ctx.fill();
        ctx.lineWidth = 0.25;
        ctx.strokeStyle = '#999';
        ctx.stroke();
      })
    }
    render() {
      return (
        <canvas className={styles.fill_parent} style={{zIndex:this.props.zIndex}} ref={(elem) => { this.canvas = elem; }} width={1000} height={1000}/>
      );
    }
}

export default PlotBubblesCanvas;
