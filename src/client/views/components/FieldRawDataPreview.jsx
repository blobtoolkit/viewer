import React from 'react'
import styles from './Fields.scss'
import { connect } from 'react-redux'
import { makeGetFieldRawData } from '../reducers/repository'
import * as d3 from 'd3'
import Spinner from './Spinner'


class FieldRawDataPreview extends React.Component {
  constructor(props) {
    super(props);
    this.makeMapStateToProps = () => {
      const getFieldRawData = makeGetFieldRawData()
      return (state, props) => {
        let data = getFieldRawData(state, props)
        return {
          fieldId: this.props.fieldId,
          xScale: this.props.xScale,
          values: data.values || []
        }
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedRawDataPreview = connect(
      this.makeMapStateToProps,
      this.mapDispatchToProps
    )(RawDataPreview)
    return <ConnectedRawDataPreview {...this.props}/>
  }
}

class RawDataPreview extends React.Component {

  componentDidMount() {
    if (this.props.values && this.props.values.length > 0) this.drawChart();
  }

  shouldComponentUpdate() {
  //  return false;
  }

  componentWillUnmount() {
    // ReactDOM.unmountComponentAtNode(this.tooltipTarget);
  }

  drawChart() {
    /*
      D3 code to create our visualization by appending onto this.svg
    */

    var svg = d3.select(this.svg);

    var height = this.svg.clientHeight;
    var width = this.svg.clientWidth;

    var data = this.props.values;//d3.range(1000).map(d3.randomBates(10));
    var g = svg.append("g")
    var x = this.props.xScale;
    var thresh = Array.from(Array(24).keys()).map((n)=>{return x.invert((n+1)*width/25)});
    var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(thresh)
    (data);
    var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d) { return d.length; })])
    .range([height, 0]);

    var bar = g.selectAll('.'+styles.bar)
        .data(bins)
        .enter().append("g")
          .attr("class", styles.bar)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ;})
        .attr("height", function(d) { return height - y(d.length); });
    // // At some point we render a child, say a tooltip
    // const tooltipData = ...
    // this.renderTooltip([50, 100], tooltipData);
  }

  render() {
    return (
      <div className={styles.data_preview_container}>
        {
          //<div ref={(elem) => { this.tooltipTarget = elem; }} />
        }
        <svg ref={(elem) => { this.svg = elem; }}>
        </svg>
      </div>
    );
  }


  // render(){
  //   return (
  //     <div>
  //       <Spinner />
  //       {this.props.values ? this.props.values.length : 0 } values
  //     </div>
  //   )
  // }


}

export default FieldRawDataPreview
