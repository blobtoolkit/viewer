import { createSelector } from 'reselect'
//import * as d3 from 'd3'
import { getTransformFunction } from './plotParameters'
import { getTransformFunctionParams } from './plotParameters'
import { getSquareGrid } from './plotSquareBins'

export const getTransformLines = createSelector(
  getTransformFunctionParams,
  getTransformFunction,
  getSquareGrid,
  (params,transform,grid) => {
    let lines = []
    for (let j = 0; j <= grid.size; j+= grid.height){
      let [x,y] = transform([0,j])
      let line = 'M0 '+(grid.size-y)
      for (let i = 1; i <= grid.size; i++){
        [x,y] = transform([i,j])
        line += ' L'+x+' '+(grid.size-y)
      }
      lines.push(line)
    }
    for (let i = 0; i <= grid.size; i+= grid.width){
      let [x,y] = transform([i,0])
      let line = 'M'+x+' '+(grid.size-y)
      for (let j = 1; j <= grid.size; j++){
        [x,y] = transform([i,j])
        line += ' L'+x+' '+(grid.size-y)
      }
      lines.push(line)
    }
    return { lines, params }
  }
)
