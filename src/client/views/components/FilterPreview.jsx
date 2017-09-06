import React from 'react'
import styles from './Filters.scss'
import { connect } from 'react-redux'
import { getFilteredDataForFieldId } from '../reducers/filter'
import * as d3 from 'd3'
import Spinner from './Spinner'


class FilterPreview extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        values: getFilteredDataForFieldId(state, this.props.filterId)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
      }
    }
  }

  render(){
    const ConnectedPreview = connect(
      // this.makeMapStateToProps,
      this.mapStateToProps,
      this.mapDispatchToProps
    )(FilteredDataPreview)
    return <ConnectedPreview {...this.props}/>
  }
}

class FilteredDataPreview extends React.Component {

  componentDidMount() {
    if (this.props.values && this.props.values.length > 0) this.drawChart();
  }

  componentDidUpdate() {
    if (this.props.values && this.props.values.length > 0) this.drawChart();
  }


  shouldComponentUpdate() {
    return true;
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
      <div className={styles.filter_preview_container}>
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

export default FilterPreview
