import React from 'react'
import styles from './Plot.scss';
import PlotBubblesSVG from './PlotBubblesSVG'
import PlotBubblesCanvas from './PlotBubblesCanvas'
import PlotLayerTabs from './PlotLayerTabs'
import PlotLayerTab from './PlotLayerTab'

class MainPlotBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toFront:-1}
  }

  componentDidMount(){

  }

  onTabMouseOver(index){
    this.setState({toFront:index})
  }

  render() {
    // return (
    //   <div className={styles.outer}>
    //     <PlotBubblesCanvas {...this.props} bubbles={this.props.data[0] ? this.props.data : [{}]} bubblecss={''}/>
    //   </div>
    // );
    let categories = []
    let canvases = []
    let tabs = []
    this.props.data.forEach((catData,i) => {
      let zIndex = i == this.state.toFront ? 1 : 0
      if (catData.length > 0){
        categories.push(
          <PlotBubblesSVG key={i} {...this.props} bubbles={catData} color={this.props.colors[i]} bubblecss={''}/>
        )
        canvases.push(
          <PlotBubblesCanvas key={i} zIndex={zIndex} {...this.props} bubbles={catData} color={this.props.colors[i]} bubblecss={''}/>
        )
        tabs.push(
          <PlotLayerTab key={i} layer={i} color={this.props.colors[i]} onMouseOver={()=>{this.onTabMouseOver(i)}}/>
        )
      }
    })
    return (
      <div className={styles.outer}>
        {canvases}
        <PlotLayerTabs children={tabs}/>
      </div>
    );
    // return (
    //   <div className={styles.outer}>
    //     <svg ref={(elem) => { this.svg = elem; }}
    //       className={styles.main_plot}
    //       viewBox='0 0 1000 1000'>
    //       {categories}
    //     </svg>
    //   </div>
    // );
  }
}

export default MainPlotBox
