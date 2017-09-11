import React from 'react'
import styles from './Plot.scss';
import PlotBubblesSVG from './PlotBubblesSVG'
import PlotBubblesCanvas from './PlotBubblesCanvas'

class MainPlotBox extends React.Component {
  componentDidMount(){

  }

  render() {
    // return (
    //   <div className={styles.outer}>
    //     <PlotBubblesCanvas {...this.props} bubbles={this.props.data[0] ? this.props.data : [{}]} bubblecss={''}/>
    //   </div>
    // );
    let categories = []
    let canvases = []
    this.props.data.forEach((catData,i) => {
      if (catData.length > 0){
        categories.push(
          <PlotBubblesSVG key={i} {...this.props} bubbles={catData} color={this.props.colors[i]} bubblecss={''}/>
        )
        canvases.push(
          <PlotBubblesCanvas key={i} {...this.props} bubbles={catData} color={this.props.colors[i]} bubblecss={''}/>
        )
      }
    })
    return (
      <div className={styles.outer}>
        {canvases}
      </div>
    );
    // return (
    //   <div className={styles.outer}>
    //     <svg ref={(elem) => { this.svg = elem; }}
    //       className={styles.main_plot}
    //       viewBox='0 0 100 100'>
    //       {categories}
    //     </svg>
    //   </div>
    // );
  }
}

export default MainPlotBox
