import React from 'react'
import { connect } from 'react-redux'
import { getAllPalettes, selectPalette, editPalette } from '../reducers/color'
import PalettesComp from '../components/Palettes'
import { withRouter } from 'react-router-dom'
import { addQueryValues } from '../History'

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
          addQueryValues({palette:id})
          return dispatch(selectPalette(id))
        },
        editPalette: (obj) => {return dispatch(editPalette(obj))}
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
