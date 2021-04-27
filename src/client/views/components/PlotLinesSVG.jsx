import {
  addRecords,
  changeSelectPolygon,
  getSelectPolygon,
  getSelectSource,
  getSelectedRecords,
  getSelectionDisplay,
  replaceRecords,
  selectNone,
  setSelectSource,
} from "../reducers/select";
import { getCatAxis, getXAxis, getYAxis, getZAxis } from "../reducers/plot";
import { getPlotScale, getZScale } from "../reducers/plotParameters";

import React from "react";
import { connect } from "react-redux";
import { fetchRawData } from "../reducers/field";
import { getLinesPlotData } from "../reducers/plotData";
import { plotShapes } from "../reducers/plotStyles";

export default class PlotLinesSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = (state) => ({
      xAxis: getXAxis(state),
      yAxis: getYAxis(state),
      zAxis: getZAxis(state),
      catAxis: getCatAxis(state),
      zScale: getZScale(state),
      plotScale: getPlotScale(state),
      data: getLinesPlotData(state),
      selectedRecords: getSelectedRecords(state),
    });
    this.mapDispatchToProps = (dispatch) => ({
      fetchData: (id) => dispatch(fetchRawData(id)),
      addRecords: (arr) => {
        dispatch(setSelectSource("lines"));
        dispatch(addRecords(arr));
      },
      replaceRecords: (arr) => {
        dispatch(setSelectSource("lines"));
        dispatch(replaceRecords(arr));
      },
      selectNone: () => {
        dispatch(setSelectSource("lines"));
        dispatch(selectNone());
      },
    });
  }

  render() {
    const ConnectedLines = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(LinesSVG);
    return <ConnectedLines {...this.props} />;
  }
}

class LinesSVG extends React.Component {
  componentDidMount() {
    if (
      !this.props.data ||
      !this.props.data.coords ||
      this.props.data.coords.length == 0
    ) {
      this.props.fetchData(`${this.props.xAxis}_windows`);
      this.props.fetchData(`${this.props.yAxis}_windows`);
      this.props.fetchData(`${this.props.zAxis}_windows`);
      this.props.fetchData(`${this.props.catAxis}_windows`);
    }
  }

  // componentDidUpdate() {
  //   if (
  //     !this.props.data ||
  //     !this.props.data.coords ||
  //     this.props.data.coords.length == 0
  //   ) {
  //     this.props.fetchData(`${this.props.xAxis}_windows`);
  //     this.props.fetchData(`${this.props.yAxis}_windows`);
  //     this.props.fetchData(`${this.props.zAxis}_windows`);
  //     this.props.fetchData(`${this.props.catAxis}_windows`);
  //   }
  // }

  handleClick(e, id) {
    e.stopPropagation();
    e.preventDefault();
    let arr = [...this.props.selectedRecords];
    if (arr.includes(id)) {
      this.props.replaceRecords(arr.filter((val) => val != id));
    } else {
      this.props.addRecords([id]);
    }
  }

  render() {
    let coords = this.props.data.coords;
    if (!coords || coords.length == 0) {
      return null;
    }
    let colors = this.props.data.colors;
    let paths = [];
    let selection = [];
    let selectedById = {};
    let highlightColor = "rgb(156, 82, 139)";
    this.props.selectedRecords.forEach((id) => {
      selectedById[id] = true;
    });
    coords.forEach((group, i) => {
      if (group.x.length > 0) {
        let points = [];
        let groupCircles = [];
        group.x.forEach((x, j) => {
          points.push(`${x},${group.y[j]}`);
          let color;
          if (isNaN(group.cats[j])) {
            color = "white";
          } else {
            color = colors[group.cats[j]] || colors[9];
          }
          groupCircles.push(
            <circle
              key={`${group.id}_${j}`}
              cx={x}
              cy={group.y[j]}
              r={group.r[j]}
              fill={color}
              fillOpacity={selectedById[group.id] ? 1 : 0.6}
              style={{
                strokeWidth: selectedById[group.id] ? "6px" : "1px",
                stroke: selectedById[group.id]
                  ? highlightColor
                  : "rgb(89, 101, 111)",
              }}
              onPointerDown={(e) => this.handleClick(e, group.id)}
            />
          );
        });

        let groupPaths = [];

        if (selectedById[group.id]) {
          groupPaths.push(
            <polyline
              key={`${group.id}_sel`}
              style={{ strokeWidth: "10px" }}
              stroke={highlightColor}
              strokeLinejoin="round"
              fill="none"
              points={points.join(" ")}
              onPointerDown={(e) => this.handleClick(e, group.id)}
            />
          );
        }
        groupPaths.push(
          <polyline
            key={group.id}
            style={{ strokeWidth: selectedById[group.id] ? "4px" : "2px" }}
            stroke={colors[group.cat]}
            strokeLinejoin="round"
            fill="none"
            points={points.join(" ")}
            onPointerDown={(e) => this.handleClick(e, group.id)}
          />
        );
        if (selectedById[group.id]) {
          selection.push(...groupPaths, ...groupCircles);
        } else {
          paths.push(...groupPaths, ...groupCircles);
        }
      }
      //   let kite = <g key={i}
      //                 style={{strokeWidth:"1px"}}
      //                 transform={`rotate(${coords[i].angle},${coords[i].y[0][0]},${coords[i].x[0][1]})`}
      //                 stroke={colors[i]}
      //                 fill="none">
      //                 <line key={`${i}_x`}
      //                       style={{strokeWidth:"3px"}}
      //                       x1={coords[i].x[0][0]}
      //                       y1={coords[i].x[0][1]}
      //                       x2={coords[i].x[1][0]}
      //                       y2={coords[i].x[1][1]}/>
      //                 <line key={`${i}_y`}
      //                       x1={coords[i].y[0][0]}
      //                       y1={coords[i].y[0][1]}
      //                       x2={coords[i].y[1][0]}
      //                       y2={coords[i].y[1][1]}/>
      //                 <polygon key={`${i}_poly`}
      //                          style={{strokeWidth:`3px`}}
      //                          points={coords[i].poly.map(c=>c[0]+','+c[1]).join(' ')}/>
      //               </g>
      //   paths.push( kite )
      // }
    });
    return (
      <g
        transform="translate(0, 0)"
        style={{ cursor: "pointer", pointerEvents: "auto" }}
      >
        {paths}
        {selection}
      </g>
    );
  }
}
