import React from 'react'
import styles from './Plot.scss';
import PlotLayer from './PlotLayer'
import PlotLayerTabs from './PlotLayerTabs'
import PlotLayerTab from './PlotLayerTab'

class MainPlotBox extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
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
    let layers = []
    let tabs = []
    this.props.bins.forEach((bin,i) => {
      let zIndex = i == this.state.toFront ? 1 : 0
        layers.push(
          //<PlotLayer key={i} index={i} zIndex={zIndex} type='bubblesCanvas' zIndex={zIndex}/>
          <PlotLayer key={i} index={i} zIndex={zIndex} type='squareBinsSVG'/>
        )
        // canvases.push(
        //   <PlotBubblesCanvas key={i} zIndex={zIndex} {...this.props} />
        // )
        tabs.push(
          <PlotLayerTab key={i} layer={i} bin={this.props.bins[i]} color={this.props.bins[i].color} onMouseOver={()=>{this.onTabMouseOver(i)}}/>
        )
    })
    return (
      <div className={styles.outer}>
        <svg ref={(elem) => { this.svg = elem; }}
          className={styles.main_plot}
          viewBox='0 0 1000 1000'>
          {layers}
        </svg>
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
