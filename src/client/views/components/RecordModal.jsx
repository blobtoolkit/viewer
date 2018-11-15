import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import styles from './Layout.scss'
import CategoryDistribution from './CategoryDistribution'

export class RecordModal extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClose(){
    this.props.dismiss()
  }

  render() {
    if (!this.props.currentRecord) return null
    let content = <CategoryDistribution/>
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}}>
        <ModalContainer onClose={()=>this.handleClose()}>
          <ModalDialog onClose={()=>this.handleClose()}>
            <div className={styles.modal}>
              <CategoryDistribution/>
            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    )
  }
}


export default RecordModal
