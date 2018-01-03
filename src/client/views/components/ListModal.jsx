import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

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

  render() {
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}} onClick={()=>this.handleClick()}>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={()=>this.handleClose()}>
            <ModalDialog onClose={()=>this.handleClose()}>
              <h1>List summary</h1>
              <h2>Name: {this.props.name}</h2>
              <button onClick={()=>this._downloadJSONFile(this.props.name,this.props.identifiers)}>Download JSON</button>
              <p>Metadata, view and copy list functions coming soon</p>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}


export default ListModal
