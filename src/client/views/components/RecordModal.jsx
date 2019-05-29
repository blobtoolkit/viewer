import React from 'react';
import {ModalContainer, FlexDialog} from 'react-modal-dialog-react16';
import styles from './Layout.scss'
import CategoryDistribution from './CategoryDistribution'

export class RecordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: (this.props.currentRecord || this.props.currentRecord === 0)
    }
  }

  componentDidUpdate(nextProps){
    if (this.props.currentRecord !== nextProps.currentRecord){
      this.setState({
        isShowingModal: (this.props.currentRecord || this.props.currentRecord === 0)
      })
    }
  }

  handleClick(){
    this.setState({isShowingModal: true})
  }

  handleClose(){
    this.props.dismiss()
    this.setState({isShowingModal: false})
  }

  render() {
    if (this.state.isShowingModal){
      return (
        <div className={styles.modal}>
          <ModalContainer onClose={()=>this.handleClose()}>
            <FlexDialog onClose={()=>this.handleClose()}>
              <div className={styles.modal}>
                <CategoryDistribution/>
              </div>
            </FlexDialog>
          </ModalContainer>
        </div>
      )
    }
    return (
      <div className={styles.modal}/>
    )

  }
}


export default RecordModal
