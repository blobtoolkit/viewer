import React from 'react'
import { connect } from 'react-redux'
import { getAllPalettes, selectPalette, editPalette, choosePalette, chooseColors } from '../reducers/color'
import PalettesComp from '../components/Palettes'
import { withRouter } from 'react-router-dom'
import { addQueryValues } from '../reducers/history'

class Palettes extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = () => {
      return (state, props) => {
        return getAllPalettes(state)
      }
    }
    this.mapDispatchToProps = dispatch => {
      return {
        selectPalette: (id) => {
          return dispatch(choosePalette(id))
        },
        editPalette: (obj) => {return dispatch(chooseColors(obj))}
      }
    }
  }

  render(){
    const ConnectedPalettes = connect(
      this.mapStateToProps,
      this.mapDispatchToProps
    )(PalettesComp)
    return (
      <ConnectedPalettes name={'palettes'} {...this.props}/>
    )
  }
}

export default withRouter(Palettes)
