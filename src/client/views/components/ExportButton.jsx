import React from 'react'
import { connect } from 'react-redux'
import styles from './Plot.scss'
const saveSvgAsPng = require('save-svg-as-png/lib/saveSvgAsPng.js')
import { getPngResolution } from '../reducers/plotParameters'


const _downloadJSONFile = (name,content) => {
  var element = document.createElement('a');
  var file = new Blob([JSON.stringify(content)], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = (name || 'file') + '.json';
  element.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}))
}

const _downloadTextFile = (name,content,format) => {
  var element = document.createElement('a');
  var file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = (name || 'file') + '.'+format;
  element.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}))
}

const screenScale = () => {
  let query = "(-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2), (min-resolution: 192dpi)";
  if (window.matchMedia(query).matches) {
    return 2
  }
  else {
    return 1
  }
}

const Button = ({element,data,format,prefix,scale=1,func,size=1000,res=1000}) => {
  if (!func){
    func = () => {}
    if (format == 'svg'){
      func = ()=>(saveSvgAsPng.saveSvg(document.getElementById(element),prefix+'.svg'))
    }
    else if (format == 'png'){
      let scale = res / size / screenScale()
      func = ()=>(saveSvgAsPng.saveSvgAsPng(document.getElementById(element),prefix+'.png',{backgroundColor:'white',scale}))
    }
    else if (format == 'json'){
      func = ()=>_downloadJSONFile(prefix,data)
    }
    else {
      func = ()=>_downloadTextFile(prefix,data,format)
    }
  }
  return (
    <a id={'blob_save_'+format} className={styles.save_svg} onClick={func}>&#8681;{format}</a>
  )
}

export class ExportButton extends React.Component {
  constructor(props) {
    super(props);
    this.mapStateToProps = state => {
      return {
        res: getPngResolution(state)
      }
    }
  }

  render(){
    const ConnectedExportButton = connect(
      this.mapStateToProps
    )(Button)
    return (
      <ConnectedExportButton {...this.props}/>
    )
  }
}

export default ExportButton
