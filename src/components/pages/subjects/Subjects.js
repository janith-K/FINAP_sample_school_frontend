import React, { Component } from "react";
import { Collapsible, ErrorSpan } from "../../core";
import { get, post, del } from "../../../utility/apiClient";
import {
  FormGroup,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Label,
  Input,
} from "reactstrap";
import "./Style.scss";

/*-- Imports for redux --*/
import { connect } from "react-redux";
import {
  showMessageBox,
  resetMessageBox,
} from "../../../redux/actions/messageBoxActions";
import {
  showLoadingScreen,
  hideLoadingScreen,
} from "../../../redux/actions/loadingScreenActions";

/**
 * Author   :   Dinushka Rukshan
 * Remarks  :   This is a basic user interface used crud operations
 */

/*-- Map the redux states to props --*/
function mapStateToProps(state) {
  return {};
}

/*-- Map the redux actions to props --*/
const mapDispatchToProps = {
  showMessageBox,
  resetMessageBox,
  showLoadingScreen,
  hideLoadingScreen,
};

class Subject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectID: 0,
      subjectName: "",
      subjectNameError: "",
      existingSubjectList: [],
    };
  }

  componentDidMount() {
    this.loadExistingSubjects();
  }

  handleChangeEvent = (event) => {
    if (event.target.value === "") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else {
      if (event.target.name === "subjectName") {
        if (/^[A-Za-z ]+$/.test(event.target.value)) {
          this.setState({
            [event.target.name]: event.target.value,
          });
        }
      } else {
        this.setState({ [event.target.name]: event.target.value });
      }
    }

    if (event.target.name === "subjectName") {
      this.setState({ subjectNameError: "" });
    }
  };

  resetFormData(showConfirmation) {
    if (showConfirmation) {
      let messageBox = {
        show: true,
        title: "Confirmation",
        className: "warning",
        content: "Are you sure you want to reset the form data.?",
        isConfirmation: true,
        callBackFunction: (response) => {
          if (response) {
            this.setState({
              subjectID: 0,
              subjectName: "",
              subjectNameError: "",
            });
          }
        },
      };
      this.props.showMessageBox(messageBox);
    } else {
      this.setState({
        subjectID: 0,
        subjectName: "",
        subjectNameError: "",
      });
    }
  }

  loadSelectedSubjectData(selectedSubject) {
    if (selectedSubject) {
      this.setState({
        subjectID: selectedSubject.subjectID,
        subjectName: selectedSubject.subjectName,
      });
    }
  }

  validateSaveData() {
    let isValidate = true;
    if (this.state.subjectName === "" || this.state.subjectName === null) {
      isValidate = false;
      this.setState({ firstNameError: "Subject name is required" });
    }

    return isValidate;
  }

  loadExistingSubjects() {
    this.props.showLoadingScreen();
    get("Subject/Subjects").then((response) => {
      this.props.hideLoadingScreen();
      if (response.data.statusCode === 200) {
        if (response.data.result !== null) {
          this.setState({
            existingSubjectList: response.data.result,
          });
        }
      } else {
        let messageBox = {
          show: true,
          title: "Oops!",
          className: "error",
          content:
            "Get existing subjects failed.\nYou may be able to try again.",
          isConfirmation: false,
          callBackFunction: null,
        };
        this.props.showMessageBox(messageBox);
        console.error(
          `Get existing subjects failed. | ${response.data.errorMessage}`
        );
      }
    });
  }

  deleteFormData() {
    if (this.state.subjectID !== 0) {
      let messageBox = {
        show: true,
        title: "Confirmation",
        className: "error",
        content: "Are you sure you want to delete this subject.?",
        isConfirmation: true,
        callBackFunction: (response) => {
          if (response) {
            this.props.showLoadingScreen();
            del(`Subject/Subject/${this.state.subjectID}`).then((response) => {
              this.props.hideLoadingScreen();
              if (response.data.statusCode === 200) {
                let messageBox = {
                  show: true,
                  title: "Success",
                  className: "success",
                  content: "Subject details successfully deleted",
                  isConfirmation: false,
                  callBackFunction: () => {
                    this.resetFormData(false);
                    this.loadExistingSubjects();
                  },
                };
                this.props.showMessageBox(messageBox);
              } else {
                let messageBox = {
                  show: true,
                  title: "Oops!",
                  className: "error",
                  content:
                    "Delete subject failed.\nYou may be able to try again.",
                  isConfirmation: false,
                  callBackFunction: null,
                };
                this.props.showMessageBox(messageBox);
                console.error(
                  `Delete subject failed. | ${response.data.errorMessage}`
                );
              }
            });
          }
        },
      };
      this.props.showMessageBox(messageBox);
    } else {
      let messageBox = {
        show: true,
        title: "Warning",
        className: "warning",
        content: "Please select an existing subject",
        isConfirmation: false,
        callBackFunction: null,
      };
      this.props.showMessageBox(messageBox);
    }
  }

  saveFormData() {
    if (this.validateSaveData()) {
      let formData = {
        SubjectID: this.state.subjectID,
        SubjectName: this.state.subjectName,
      };
      this.props.showLoadingScreen();
      post("Subject/Subject", formData).then((response) => {
        this.props.hideLoadingScreen();
        if (response.data.statusCode === 200) {
          let messageBox = {
            show: true,
            title: "Success",
            className: "success",
            content: `Subject details successfully ${
              this.state.subjectID === 0 ? "saved" : "updated"
            }`,
            isConfirmation: false,
            callBackFunction: () => {
              this.resetFormData(false);
              this.loadExistingSubjects();
            },
          };
          this.props.showMessageBox(messageBox);
        } else {
          let messageBox = {
            show: true,
            title: "Oops!",
            className: "error",
            content:
              "Save subject details failed.\nYou may be able to try again.",
            isConfirmation: false,
            callBackFunction: null,
          };
          this.props.showMessageBox(messageBox);
          console.error(
            `Save subject details failed. | ${response.data.errorMessage}`
          );
        }
      });
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col md="12" sm="12" xs="12">
            <Card>
              <CardHeader>
                <i className="fa fa-cube"></i> Subject Details
                <Collapsible id="subject_input_criteria_id" />
              </CardHeader>
              <CardBody id="subject_input_criteria_id">
                <FormGroup row>
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>Subject Name</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="subject_name_id"
                          name="subjectName"
                          type="text"
                          value={this.state.subjectName}
                          maxLength={50}
                          autoComplete="off"
                          onChange={this.handleChangeEvent.bind(this)}
                        />
                        <ErrorSpan
                          IsVisible={true}
                          ErrorName={this.state.firstNameError}
                        />
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col className="offset-3" md="3" sm="3" xs="3">
                    <Button
                      block
                      className="btn btn-success mr-2"
                      onClick={this.saveFormData.bind(this)}
                    >
                      {this.state.subjectID === 0 ? "Save" : "Update"}
                    </Button>
                  </Col>
                  <Col md="3" sm="3" xs="3">
                    <Button
                      block
                      className="btn btn-danger"
                      onClick={this.deleteFormData.bind(this)}
                    >
                      Delete
                    </Button>
                  </Col>
                  <Col md="3" sm="3" xs="3">
                    <Button
                      block
                      className="btn btn-warning"
                      onClick={this.resetFormData.bind(this)}
                    >
                      Reset
                    </Button>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <i className="fa fa-cube"></i> Existing Subjects
                <Collapsible id="subject_exist_details_id" />
              </CardHeader>
              <CardBody id="ssubject_exist_details_id">
                <FormGroup row>
                  <Col md="12" sm="12" xs="12">
                    <div style={{ overflowX: "auto" }}>
                      <table className="exist-subject-table">
                        <tbody>
                          <tr
                            style={{
                              color: "white",
                              backgroundColor: "#6c757d",
                            }}
                          >
                            <th>Subject Name</th>
                          </tr>
                          <React.Fragment>
                            {this.state.existingSubjectList.map(
                              (subject, index) => (
                                <tr
                                  key={index}
                                  onClick={this.loadSelectedSubjectData.bind(
                                    this,
                                    subject
                                  )}
                                >
                                  <td>{subject.subjectName}</td>
                                </tr>
                              )
                            )}
                          </React.Fragment>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subject);
