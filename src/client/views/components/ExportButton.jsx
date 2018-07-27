import React from 'react'
import styles from './Plot.scss'
const saveSvgAsPng = require('save-svg-as-png/lib/saveSvgAsPng.js')


const _downloadJSONFile = (name,content) => {
  var element = document.createElement('a');
  var file = new Blob([JSON.stringify(content)], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = (name || 'file') + '.json';
  element.click();
}

export const ExportButton = ({element,data,format,prefix,scale=1}) => {
  let func = () => {}
  if (format == 'svg'){
    func = ()=>(saveSvgAsPng.saveSvg(document.getElementById(element),prefix+'.svg'))
  }
  else if (format == 'png'){
    func = ()=>(saveSvgAsPng.saveSvgAsPng(document.getElementById(element),prefix+'.png',{backgroundColor:'white',scale:scale}))
  }
  else if (format == 'json'){
    func = ()=>_downloadJSONFile(prefix,data)
  }
  return (
    <a className={styles.save_svg} onClick={func}>&#8681;{format}</a>
  )
}

export default ExportButton
