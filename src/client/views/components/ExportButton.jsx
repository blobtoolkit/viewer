import React from 'react'
import styles from './Plot.scss'
const saveSvgAsPng = require('save-svg-as-png/saveSvgAsPng.js')

export const ExportButton = ({element,format,prefix}) => {
  let func = () => {}
  if (format == 'svg'){
    func = ()=>(saveSvgAsPng.saveSvg(document.getElementById(element),prefix+'.svg'))
  }
  else if (format == 'png'){
    func = ()=>(saveSvgAsPng.saveSvgAsPng(document.getElementById(element),prefix+'.png',{backgroundColor:'white'}))
  }
  return (
    <a className={styles.save_svg} onClick={func}>&#8681;{format}</a>
  )
}

export default ExportButton
