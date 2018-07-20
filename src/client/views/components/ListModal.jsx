import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import { addQueryValues } from '../reducers/history'
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
  handleClick(){ this.setState({isShowingModal: true}) }
  handleClose(){
    this.setState({isShowingModal: false})
    this.props.dismiss()
  }

  _downloadJSONFile(name,content){
    var element = document.createElement('a');
    var file = new Blob([JSON.stringify(content)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = (name || 'file') + '.json';
    element.click();
  }

  loadFromList(list){
    addQueryValues(list.params,'?')
    // TODO: move function to dispatch queryToStore(dispatch,{values})
  }

  render() {
    let inParams = this.props.list.params;
    let params = {};
    Object.keys(inParams).sort().forEach(function(key) {
      params[key] = inParams[key];
    });
    let loadButton = (<a className={styles.button} onClick={()=>{this.props.chooseList(this.props.name,Boolean(params['selection--Active']));this.handleClose()}}>Load List</a>)
    let loadList = this.props.name == 'current' ? '' : loadButton
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}} onClick={()=>this.handleClick()}>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={()=>this.handleClose()}>
            <ModalDialog onClose={()=>this.handleClose()}>
              <div className={styles.modal}>
                <a className={styles.button} onClick={()=>this._downloadJSONFile(this.props.dataset+'.'+this.props.name,this.props.list)}>Download JSON</a>
                {loadList}
                <h2>{this.props.name}</h2>
                <p>{this.props.list.identifiers.length} {this.props.type}</p>
                <div className={styles.code_block}>
                  <JSONPretty id="json-pretty" json={params}/>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}


export default ListModal
