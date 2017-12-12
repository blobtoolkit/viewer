import React from 'react'
import styles from './Palette.scss';
import PaletteSwatch from './PaletteSwatch'

class Palette extends React.Component {

  render() {
    let width = 100 / this.props.colors.length
    let cols = this.props.colors.map((c,i) => {
      if (this.props.id == 'user'){
        return (
          <PaletteSwatch
            key={i}
            index={i}
            color={c}
            width={width+'%'}
            editPalette={(color) => {
              let colors = this.props.colors.slice(0)
              colors[i] = color
              this.props.editPalette({id:this.props.id,[this.props.id]:colors})
            }}
            />
        )
      }
      return (
        <span key={i}
          className={styles.block}
          style={{backgroundColor:c,
          width:width+'%'}}>
        </span>
      )
    })
    return (
      <div className={styles.palette}>
        <div className={styles.title}
          onClick={()=>this.props.selectPalette(this.props.id)}
          >
          {this.props.id}
        </div>
        {cols}
      </div>
    )
  }
}

export default Palette
