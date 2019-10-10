import React from 'react';
import { connect } from 'react-redux'
import { getKitePlotData }  from '../reducers/plotData'

export default class PlotKitesSVG extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => (
        getKitePlotData(state)
      )
    }
  }

  render(){
    const ConnectedKites = connect(
      this.mapStateToProps
    )(KitesSVG)
    return (
      <ConnectedKites />
    )
  }
}

const KitesSVG = ({ coords, bins, colors }) => {
  if (!coords){
    return null
  }
  let paths = []
  coords.forEach((group,i)=>{
    if (coords[i].x){
      paths.push( <g key={i}
                     stroke={colors[i]}
                     strokeWidth="1px"
                     transform={`rotate(${coords[i].angle},${coords[i].y[0][0]},${coords[i].x[0][1]})`}
                     fill="none">
                    <line key={`${i}_x`}
                          x1={coords[i].x[0][0]}
                          y1={coords[i].x[0][1]}
                          x2={coords[i].x[1][0]}
                          y2={coords[i].x[1][1]}/>
                    <line key={`${i}_y`}
                          x1={coords[i].y[0][0]}
                          y1={coords[i].y[0][1]}
                          x2={coords[i].y[1][0]}
                          y2={coords[i].y[1][1]}/>
                    <polygon key={`${i}_poly`}
                             strokeWidth="5px"
                             points={coords[i].poly.map(c=>c[0]+','+c[1]).join(' ')}/>
                  </g>)
    }
  })
  return (
    <g>
      {paths}
    </g>
  )
}
