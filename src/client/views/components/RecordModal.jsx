import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import styles from './Layout.scss'
import CategoryDistribution from './CategoryDistribution'

export class RecordModal extends React.Component {
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
    return (
      <div style={{position:'absolute', top:0, right:0, bottom:0, left:0}} onClick={()=>this.handleClick()}>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={()=>this.handleClose()}>
            <ModalDialog onClose={()=>this.handleClose()}>
              <div className={styles.modal}>
                <CategoryDistribution/>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}


export default RecordModal
