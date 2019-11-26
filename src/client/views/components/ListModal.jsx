import React from 'react';
import {ModalContainer, FlexDialog} from 'react-modal-dialog-react16'
import styles from './Layout.scss'
import JSONPretty from 'react-json-pretty';
import { queryToStore } from '../querySync'

class ListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: this.props.selected,
    }
  }
  handleClick(){ this.setState({isShowingModal: !this.state.isShowingModal}) }
  handleClose(){
    this.setState({isShowingModal: false})
    this.props.dismiss()
  }

  _downloadJSONFile(name,content){
    // console.log(name)
    var element = document.createElement('a');
    var file = new Blob([JSON.stringify(content, null, (content.identifiers ? null : 2))], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = (name || 'file') + '.json';
    element.dispatchEvent(new MouseEvent(`click`, {bubbles: true, cancelable: true, view: window}))
  }

  render() {
    if (!this.props.list.params || !this.props.dataset){
      return null
    }
    if (!this.props.list.identifiers || this.props.list.identifiers.length == 0){
      return null
    }
    let inParams = this.props.list.params;
    let params = {};
    Object.keys(inParams).sort().forEach(function(key) {
      let value = JSON.stringify(inParams[key]).replace(/\"/g,'')
      if (value.length > 50){
        value = value.slice(0,47)+'...'
      }
      params[key] = value;
    });
    let loadButton = (<a className={styles.button} onClick={()=>{this.props.chooseList(this.props.name,Boolean(params['selection--Active']));this.handleClose()}}>Load List</a>)
    let loadList = this.props.name == 'current' ? '' : loadButton
    let list = this.props.list
    let noIdList = {}
    Object.keys(list).forEach(key=>{
      if (key != 'identifiers'){
        noIdList[key] = list[key]
      }
    })
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}} onClick={()=>this.handleClick()}>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={()=>this.handleClose()}>
            <FlexDialog onClose={()=>this.handleClose()}>
              <div className={styles.modal}>
                <a id='full_list_download'
                  className={styles.button}
                  onClick={()=>this._downloadJSONFile(this.props.dataset+'.'+this.props.name,list)}>
                    Full List
                 </a>&nbsp;
                <a id='noId_list_download'
                  className={styles.button}
                  onClick={()=>this._downloadJSONFile(this.props.dataset+'.'+this.props.name,noIdList)}>
                    List Stats
                </a>&nbsp;
                {loadList}
                <h2>{this.props.name}</h2>
                <p>{this.props.list.identifiers.length} {this.props.type}</p>
                <div className={styles.code_block}>
                  <JSONPretty id="json-pretty" json={params}/>
                </div>
              </div>
            </FlexDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}


export default ListModal
