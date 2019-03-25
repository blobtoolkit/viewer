import colors from './_colors'

let fontFamily = '"Open Sans", Arial, sans-serif'
let textAnchor = 'middle'

export const plotText = {
  axisTitle: {
    fontFamily,
    textAnchor,
    fontSize: '24px'
  },
  axisTitleSmall: {
    fontFamily,
    textAnchor,
    fontSize: '16px'
  },
  plotTitle: {
    fontFamily,
    fontSize: '16px',
    dominantBaseline: 'hanging'
  },
  snailPlotTitle: {
    fontFamily,
    fontSize: '28px',
    dominantBaseline: 'hanging'
  },
  legend: {
    fontFamily,
    fontSize: '13px'
  },
  horizLegend: {
    fontFamily,
    fontSize: '12px'
  },
  legendTitle: {
    fontFamily,
    fontSize: '24px'
  },
  snailLegend: {
    fontFamily,
    fontSize: '16px'
  },
  snailLegendTitle: {
    fontFamily,
    fontSize: '28px'
  }
}

export const grid = {
  stroke: colors.paleColor,
  strokeWidth: 0.5,
  pointerEvents: 'auto',
  cursor: 'pointer',
}

export const gridShape = Object.assign(
  {},
  grid,
  {
    fill: colors.clearColor
  }
)

export const gridShapePartSelected = Object.assign(
  {},
  gridShape,
  {
    stroke: colors.highlightColor,
    strokeWidth: 4
  }
)

export const gridShapeSelected = Object.assign(
  {},
  gridShapePartSelected,
  {
    fill: colors.highlightColor,
    fillOpacity: 0.75
  }
)

export const plotPaths = {
  bold: {
    strokeWidth: 5,
    opacity: 1
  },
  axis: {
    strokeWidth: 3,
    opacity: 1,
    fill: 'none'
  },
  fine: {
    strokeWidth: 1,
    opacity: 1
  },
  boundary: {
    stroke: colors.darkColor,
    strokeWidth: 2,
    fill: colors.clearColor,
    cursor: 'pointer',
    pointerEvents: 'auto'
  },
  sideBins: {
    strokeWidth: 2,
    strokeOpacity: 1,
    fillOpacity: 0.5
    // fill: colors.clearColor
  },
  clampedDivider: {
    stroke: colors.deepColor,
    strokeOpacity: 0.6,
    strokeWidth: 3,
    strokeDasharray: 5
  }

}

export const fillParent = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%'
}

export const plotShapes = {
  circle: {
    opacity: 0.6,
    strokeWidth: 1,
    stroke: colors.shadeColor
  }
}



let css = `
.main_plot {
  // height:100%;
  // width:100%;
  pointer-events:none;

  .bold_path {
    stroke-width:5;
    opacity:1;
  }

  .axis_path {
    stroke-width:3;
    opacity:1;
  }

  .fine_path {
    stroke-width:1;
    opacity:1;
  }

  .axis_label {
    font-family:sans-serif;
    font-size:1.5em;
  }

  circle {
    // fill:currentColor;
    opacity:0.6;
    stroke-width:1;
    stroke:$shadeColor;
  }

  rect {
    // stroke:currentColor;
    // fill:currentColor;
    stroke-width:3;
    box-sizing: border-box;
  }

  polygon {
    // stroke:currentColor;
    // fill:currentColor;
    stroke-width:3;
    box-sizing: border-box;
  }

  .plot_boundary {
    stroke:$darkColor;
    stroke-width:2;
    fill:rgba($lightColor,0);
    cursor: pointer;
    pointer-events: auto;
  }

  .small_axis_title {
    font-family:sans-serif;
    text-anchor:middle;
    font-size:1.5em;
  }

  .plot_title {
    font-family:sans-serif;
    font-size:1.5em;
    dominant-baseline: hanging;
  }

  .snail_plot_title {
    font-family:sans-serif;
    text-anchor:middle;
    font-size:36px;
  }

  .legend {
    font-family:sans-serif;
  }

  .horiz_legend {
    font-family:sans-serif;
    font-size:0.8em;
  }

  .legend_title {
    font-family:sans-serif;
    font-size:1.5em;
  }

  .snail_legend {
    font-family:sans-serif;
    font-size:16.8px;
  }

  .snail_legend_title {
    font-family:sans-serif;
    font-size:28px;
  }


}
`
