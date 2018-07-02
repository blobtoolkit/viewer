import React from 'react'
import styles from './Palette.scss';
import { SketchPicker } from 'react-color'
import { addQueryValues } from '../reducers/history'

class PaletteSwatch extends React.Component {
  constructor(props) {
    super(props);
    let color = this.props.color.replace(/[rgba\(\)]/g,'').split(',');
    this.state = {
      displayColorPicker: false,
      color: {
        r: color[0],
        g: color[1],
        b: color[2],
        a: color[3] || 1
      },
    };
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose() {
    let rgb = 'rgb('+this.state.color.r+','+this.state.color.g+','+this.state.color.b+')'
    addQueryValues({['color'+this.props.index]:rgb})
    this.setState({ displayColorPicker: false })
  };



  render(){
    const handleChange = (color) => {
      this.setState({ color: color.rgb })
    };
    const handleChangeComplete = (color) => {
      let rgba = 'rgba('+color.rgb.r+','+color.rgb.g+','+color.rgb.b+','+color.rgb.a+')'
      this.props.editPalette(rgba)
    };
    return (
      <div className={styles.block}
        style={{width:this.props.width}}
        data-tip data-for='edit-swatch'>
        <div className={ styles.swatch } onClick={ ()=>{this.handleClick()} }>
          <div className={ styles.color }
            style={{backgroundColor:`rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`}} />
        </div>
        { this.state.displayColorPicker ? <div className={ styles.popover }>
          <div className={ styles.cover } onClick={ ()=>{this.handleClose()} }/>
          <SketchPicker color={ this.state.color } onChange={ handleChange } onChangeComplete={ handleChangeComplete } />
        </div> : null }

      </div>
    )
  }
}

export default PaletteSwatch
