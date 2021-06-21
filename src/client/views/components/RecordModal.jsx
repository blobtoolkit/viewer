// import { FlexDialog, ModalContainer } from "react-modal-dialog-react16";

import CategoryDistribution from "./CategoryDistribution";
import Modal from "@material-ui/core/Modal";
import React from "react";
import styles from "./Layout.scss";

export class RecordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal:
        this.props.currentRecord || this.props.currentRecord === 0,
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.currentRecord !== nextProps.currentRecord) {
      this.setState({
        isShowingModal:
          this.props.currentRecord || this.props.currentRecord === 0,
      });
    }
  }

  handleClick() {
    this.setState({ isShowingModal: true });
  }

  handleClose() {
    this.props.dismiss();
    this.setState({ isShowingModal: false });
  }

  render() {
    if (this.state.isShowingModal) {
      return (
        <div className={styles.modal}>
          <Modal
            open={this.state.isShowingModal}
            onClose={() => this.handleClose()}
          >
            {/* <FlexDialog onClose={() => this.handleClose()}> */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                border: "none",
                boxShadow: "none",
                padding: "10px",
                overflow: "visible",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <CategoryDistribution />
            </div>
            {/* </FlexDialog> */}
          </Modal>
        </div>
      );
    }
    return <div className={styles.modal} />;
  }
}

export default RecordModal;
