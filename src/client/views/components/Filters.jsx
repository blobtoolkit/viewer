import React from 'react'
import { Link } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Resizable from 'react-resizable-box'
import styles from './Filters.scss';
import testSprite from './svg/test.svg';
import * as d3 from 'd3';


class AvailableFiltersBox extends React.Component {
  render() {
    var children = [];
    this.props.filters.forEach((filter) => {
      children.push(<FilterBox datasetId={this.props.datasetId} filter={filter} key={filter.id} />)
    });
    return (
      <div>
        {children}
      </div>
    )
  }
}

class FilterBox extends React.Component {
  render() {
    return (
      <div id={this.props.filter.id} className={styles.outer}>
        <FilterHeader datasetId={this.props.datasetId} filter={this.props.filter}/>
        <div className={styles.main}>
          <FilterDataPreview datasetId={this.props.datasetId} filter={this.props.filter} />
          <FilterHandles datasetId={this.props.datasetId} filterName={this.props.filter.id} />
          </div>
      </div>
    )
  }
}

class FilterHeader extends React.Component {
  render() {
    return (
      <div className={styles.header}>
        <h1>{this.props.filter.name}</h1>
        <FilterRange datasetId={this.props.datasetId} filter={this.props.filter}/>
        <FilterControls datasetId={this.props.datasetId} filter={this.props.filter}/>
      </div>
    )
  }
}

class FilterRange extends React.Component {
  render() {
    return (
      <div className={styles.range}>
        <input type='text' className={styles.range_input} defaultValue={this.props.filter.limits[0]}/>
        &nbsp;:&nbsp;
        <input type='text' className={styles.range_input} defaultValue={this.props.filter.limits[1]}/>
      </div>
    )
  }
}

class FilterControls extends React.Component {
  render() {
    return (
      <div className={styles.controls}>
        <FilterSwitch datasetId={this.props.datasetId} filter={this.props.filter}/>
      </div>
    )
  }
}

class FilterSwitch extends React.Component {
  render() {
    return (
      <svg viewBox={testSprite.viewBox} className={styles.icon}>
        <use xlinkHref={'#'+testSprite.id} />
      </svg>
    )
  }
}


class FilterDataPreview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loading: true};
  }

  componentDidMount() {
    d3.json('http://localhost:8000/api/v1/field/'+this.props.datasetId+'/'+this.props.filter.id, (error, data) => {
      if (error){
        console.error(error);
      }
      else {
        this.state.data = data.values;
        this.drawChart();
      }
    });
  }

  shouldComponentUpdate() {
    return false;
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

    var data = this.state.data;//d3.range(1000).map(d3.randomBates(10));
    var g = svg.append("g")

    var x = d3.scaleLog()
    if (this.props.filter.id == 'gc'){ x = d3.scaleLinear() }
    x.domain(this.props.filter.limits)
    .range([0, width]);
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

  // renderTooltip(coordinates, tooltipData) {
  //   const tooltipComponent = (
  //     <MyTooltipComponent
  //       coordinates={coordinates}
  //       data={tooltipData} />
  //   );
  //
  //   ReactDOM.render(tooltipComponent, this.tooltipTarget);
  // }
}


class FilterHandles extends React.Component {
  render() {
    return (
      <div className={styles.resizables_container}>
        <FilterHandle filterName={this.props.filterName} handlePosition='right'/>
          <FilterHandle filterName={this.props.filterName} handlePosition='left'/>
      </div>
    )
  }
}



class FilterHandle extends React.Component {
  render() {
    return (
      <Resizable className={styles.resizable}
        width={this.props.handlePosition == 'right' ? '100%' : 0}
        bounds={'parent'}
        height={'100%'}
        handlerClasses={{
          right: `${styles.handle} ${styles[this.props.handlePosition]}`
        }}
        enable={{top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false}}
        onResize={
          (e,direction,ref,delta) => {}
        }
        onResizeStop={
          (e,direction,ref,delta) => {var ratio = ref.clientWidth/ref.parentNode.clientWidth; console.log(ratio)}
        }
      />
    )
  }
}

export default AvailableFiltersBox;

export {
  AvailableFiltersBox,
  FilterBox
}
