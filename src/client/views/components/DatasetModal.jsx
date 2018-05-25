import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import styles from './Layout.scss'
import JSONPretty from 'react-json-pretty';

export class DatasetModal extends React.Component {
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

  render() {
    let meta = {}
    let keys = ['id','taxon','assembly']
    keys.forEach(k=>
      meta[k] = this.props.meta[k]
    )
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}} onClick={()=>this.handleClick()}>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={()=>this.handleClose()}>
            <ModalDialog onClose={()=>this.handleClose()}>
              <div className={styles.modal}>
                <h2>{meta.name}</h2>
                <div className={styles.code_block}>
                  <JSONPretty id="json-pretty" json={meta}/>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}


export default DatasetModal
