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
      let factor = 10
      const ctx = this.canvas.getContext('2d');
      console.log(factor)
      console.log(this.props.bubbles)
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha=0.4
      this.props.bubbles.map(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.cx*factor, bubble.cy*factor, bubble.r*factor, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.props.color;
        ctx.fill();
        //ctx.lineWidth = 5;
        //ctx.strokeStyle = '#003300';
        //ctx.stroke();
      })

    }
    render() {
        return (
            <canvas className={styles.fill_parent} ref={(elem) => { this.canvas = elem; }} width={1000} height={1000}/>
        );
    }
}

export default PlotBubblesCanvas;
