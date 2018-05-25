import React from 'react'
import styles from './Filters.scss';
import Palette from './Palette'

class Palettes extends React.Component {
  render(){
    let palettes = []
    this.props.allIds.forEach(id => {
      palettes.push(
        <Palette
          id={id}
          key={id}
          active={this.props.selected==id}
          location={this.props.location}
          colors={this.props.byId[id]}
          selectPalette={this.props.selectPalette}
          editPalette={(obj)=>this.props.editPalette(obj)}
          />
        )
    })
    return (
      <span>
        {palettes}
      </span>
    )
  }
}

export default Palettes
