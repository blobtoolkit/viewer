import { createSelector } from 'reselect'
import { getColorScheme } from './color'
import { getLargeFonts } from './plotParameters'

const fontFamily = '"Open Sans", Arial, sans-serif'
const textAnchor = 'middle'

export const plotText = createSelector(
  getColorScheme,
  getLargeFonts,
  (colors, largeFonts) => {
    return {
      axisTitle: {
        fontFamily,
        textAnchor,
        fontSize: largeFonts ? '28px' : '24px'
      },
      axisTitleSmall: {
        fontFamily,
        textAnchor,
        fontSize: largeFonts ? '20px' : '26px'
      },
      axisTick: {
        fontFamily,
        textAnchor,
        fontSize: largeFonts ? '22px' : '16px'
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
        fontSize: largeFonts ? '18px' : '13px'
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
  }
)

export const grid = createSelector(
  getColorScheme,
  getLargeFonts,
  (colors, largeFonts) => (
    {
      stroke: colors.paleColor,
      strokeWidth: 0.5,
      pointerEvents: 'auto',
      cursor: 'pointer',
    }
  )
)

export const gridShape = createSelector(
  getColorScheme,
  grid,
  (colors, grid) => (
    Object.assign(
      {},
      grid,
      {
        fill: colors.clearColor
      }
    )
  )
)

export const gridShapePartSelected = createSelector(
  getColorScheme,
  gridShape,
  (colors, grid) => (
    Object.assign(
      {},
      gridShape,
      {
        stroke: colors.highlightColor,
        strokeWidth: 4
      }
    )
  )
)

export const gridShapeSelected = createSelector(
  getColorScheme,
  gridShapePartSelected,
  (colors, grid) => (
    Object.assign(
      {},
      gridShapePartSelected,
      {
        fill: colors.highlightColor,
        fillOpacity: 0.75
      }
    )
  )
)

export const plotPaths = createSelector(
  getColorScheme,
  getLargeFonts,
  (colors, largeFonts) => (
    {
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
        fillOpacity: 0.75
        // fill: colors.clearColor
      },
      clampedDivider: {
        stroke: colors.deepColor,
        strokeOpacity: 0.6,
        strokeWidth: 3,
        strokeDasharray: 5
      }
    }
  )
)

export const fillParent = {
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%'
}

export const plotShapes = createSelector(
  getColorScheme,
  getLargeFonts,
  (colors, largeFonts) => (
    {
      circle: {
        opacity: 0.6,
        strokeWidth: 1,
        stroke: colors.shadeColor
      }
    }
  )
)
