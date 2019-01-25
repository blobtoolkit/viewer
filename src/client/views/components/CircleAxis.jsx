import React from 'react';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { radialLine as d3RadialLine } from 'd3-shape';
import { arc as d3Arc } from 'd3-shape';
import { format as d3Format } from 'd3-format'
import { plotPaths, plotText } from './PlotStyles'

export const CircleAxis = ({domain=[0, 100], range=[0, 360], unit='%', major=10, minor=2, radius=100, inner=false, outer=true}) => {
  let cScale = d3ScaleLinear().domain(domain).range(range.map(x=>x*2*Math.PI/360))
  let rScale = d3ScaleLinear().domain([0, 100]).range([0, radius])
  let circ = d3Arc()({
    startAngle: cScale(range[0]),
    endAngle: cScale(range[1]),
    innerRadius: rScale(0),
    outerRadius: rScale(100)
  })
  let start = d3RadialLine()(
    [
      [cScale(domain[0]),rScale(0)],
      [cScale(domain[0]),rScale(100)]
    ]
  )
  let ticks = []
  let labels = []
  let rmin = inner ? 94 : 100
  let rmax = outer ? 106 : 100
  for (let i = domain[0]; i <= domain[1]; i += major){
    ticks.push(d3RadialLine()(
      [
        [cScale(i),rScale(rmin)],
        [cScale(i),rScale(rmax)]
      ]
    ))
    let text = i
    if (i == domain[0]){
      text += unit
    }
    if (i == domain[1]){
      text = ''
    }
    labels.push(
      {
        path: d3RadialLine()(
          ([...Array(10).keys()]).map(j=>(
            [cScale(i+j-9),rScale(rmax+3)],
            [cScale(i+j-9),rScale(rmax+3)]
          ))
        ),
        text: text,
        fontSize: rScale(16)
      }
    )
  }
  rmin = inner ? 97 : 100
  rmax = outer ? 103 : 100
  let minorTicks = []
  for (let i = domain[0]; i <= domain[1]; i += minor){
    if (i % major != 0){
      minorTicks.push(d3RadialLine()(
        [
          [cScale(i),rScale(rmin)],
          [cScale(i),rScale(rmax)]
        ]
      ))
    }
  }
  return (
    <g>
      <path d={circ} style={plotPaths.axis} stroke='black'/>
      <path d={start} style={plotPaths.axis} stroke='black'/>
      {
        ticks.map((d,i)=>(
          <path d={d} key={i} style={plotPaths.axis} stroke='black'/>
        ))
      }
      {
        minorTicks.map((d,i)=>(
          <path d={d} key={i} style={plotPaths.fine} stroke='black'/>
        ))
      }
      {
        labels.map((d,i)=>{
          return (
            <g key={i}>
              <path d={d.path} id={'path_'+i} style={plotPaths.axis} stroke='none'/>
              <text style={Object.assign({}, plotText.axisLabel, {fontSize:d.fontSize})}>
                <textPath
                      xlinkHref={'#path_'+i}
                      textAnchor={'end'}
                      startOffset={'100%'}>
                  {d.text}
                </textPath>
              </text>
            </g>
          )
        })

      }

    </g>
  )
}

// axes.outer.path = d3RadialLine()(
//   gc.map((n,i)=>[cScale(i),oScale(1)])
// )
// axes.radial.path = d3RadialLine()([
//   [cScale(0),rScale(radius)],
//   [cScale(0),rScale(0)]
// ])
// axes.radial.ticks = {major:[],minor:[],labels:[]}
// for (let r = radius; r > 10; r /= 10){
//   let len = String(Math.floor(r)).length-1
//   let value = Math.pow(10,len)
//   axes.radial.ticks.major.push(
//     d3Line()([
//       [cScale(0),-rScale(value)],
//       [cScale(0)-2*len,-rScale(value)]
//     ])
//   )
//   for (let m = 2; m < 10; m++){
//     if (m*value < radius){
//       axes.radial.ticks.minor.push(
//         d3Line()([
//           [cScale(0),-rScale(m*value)],
//           [cScale(0)-len,-rScale(m*value)]
//         ])
//       )
//     }
//   }
//   if (r > radius / 1000){
//     axes.radial.ticks.labels.push(
//       {
//         path: d3Line()([
//           [cScale(0)-2*len-80,-rScale(value)],
//           [cScale(0)-2*len-5,-rScale(value)]
//         ]),
//         text: si(value),
//         align: 'right'
//       }
//     )
//     let points = []
//     nXlen.forEach((n,i)=>{
//       if (value <= nXlen[i])
//       points.push([cScale(i),rScale(value)])
//     })
//     paths['radial_'+len] = d3RadialLine()(points)
//     pathProps['radial_'+len] = {fill:'none',stroke:'#cccccc',strokeWidth:1, strokeDasharray:16}
//   }
// }


export default CircleAxis
