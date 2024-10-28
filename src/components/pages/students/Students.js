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

class Students extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentID: 0,
      firstName: "",
      firstNameError: "",
      lastName: "",
      lastNameError: "",
      contactPerson: "",
      contactPersonError: "",
      contactNo: "",
      contactNoError: "",
      existingStudentList: [],
    };
  }

  componentDidMount() {
    this.loadExistingStudents();
  }

  handleChangeEvent = (event) => {
    if (event.target.value === "") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else {
      if (
        event.target.name === "firstName" ||
        event.target.name === "lastName" ||
        event.target.name === "contactPerson"
      ) {
        if (/^[A-Za-z ]+$/.test(event.target.value)) {
          this.setState({
            [event.target.name]: event.target.value,
          });
        }
      } else if (event.target.name === "contactNo") {
        if (!!/^[0-9]+$/.test(event.target.value)) {
          this.setState({
            [event.target.name]: event.target.value,
          });
        }
      } else {
        this.setState({ [event.target.name]: event.target.value });
      }
    }

    if (event.target.name === "firstName") {
      this.setState({ firstNameError: "" });
    }
    if (event.target.name === "lastName") {
      this.setState({ lastNameError: "" });
    }
    if (event.target.name === "contactPerson") {
      this.setState({ contactPersonError: "" });
    }
    if (event.target.name === "contactNo") {
      this.setState({ contactNoError: "" });
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
              studentID: 0,
              firstName: "",
              firstNameError: "",
              lastName: "",
              lastNameError: "",
              contactPerson: "",
              contactPersonError: "",
              contactNo: "",
              contactNoError: "",
            });
          }
        },
      };
      this.props.showMessageBox(messageBox);
    } else {
      this.setState({
        studentID: 0,
        firstName: "",
        firstNameError: "",
        lastName: "",
        lastNameError: "",
        contactPerson: "",
        contactPersonError: "",
        contactNo: "",
        contactNoError: "",
      });
    }
  }

  loadSelectedStudentData(selectedStudent) {
    if (selectedStudent) {
      this.setState({
        studentID: selectedStudent.studentID,
        firstName: selectedStudent.firstName,
        lastName: selectedStudent.lastName,
        contactPerson: selectedStudent.contactPerson,
        contactNo: selectedStudent.contactNo,
      });
    }
  }

  validateSaveData() {
    let isValidate = true;
    if (this.state.firstName === "" || this.state.firstName === null) {
      isValidate = false;
      this.setState({ firstNameError: "First name is required" });
    }
    if (this.state.lastName === "" || this.state.lastName === null) {
      isValidate = false;
      this.setState({ lastNameError: "Last name is required" });
    }
    if (this.state.contactPerson === "" || this.state.contactPerson === null) {
      isValidate = false;
      this.setState({ contactPersonError: "Contact person is required" });
    }
    if (this.state.contactNo === "" || this.state.contactNo === null) {
      isValidate = false;
      this.setState({ contactNoError: "Contact number is required" });
    } else {
      if (!/^[0-9]+$/.test(this.state.contactNo)) {
        isValidate = false;
        this.setState({ contactNoError: "Contact number is invalid" });
      }
    }
    return isValidate;
  }

  loadExistingStudents() {
    this.props.showLoadingScreen();
    get("Student/Students").then((response) => {
      this.props.hideLoadingScreen();
      if (response.data.statusCode === 200) {
        if (response.data.result !== null) {
          this.setState({
            existingStudentList: response.data.result,
          });
        }
      } else {
        let messageBox = {
          show: true,
          title: "Oops!",
          className: "error",
          content:
            "Get existing studets failed.\nYou may be able to try again.",
          isConfirmation: false,
          callBackFunction: null,
        };
        this.props.showMessageBox(messageBox);
        console.error(
          `Get existing studets failed. | ${response.data.errorMessage}`
        );
      }
    });
  }

  deleteFormData() {
    if (this.state.studentID !== 0) {
      let messageBox = {
        show: true,
        title: "Confirmation",
        className: "error",
        content: "Are you sure you want to delete this student.?",
        isConfirmation: true,
        callBackFunction: (response) => {
          if (response) {
            this.props.showLoadingScreen();
            del(`Student/Student/${this.state.studentID}`).then((response) => {
              this.props.hideLoadingScreen();
              if (response.data.statusCode === 200) {
                let messageBox = {
                  show: true,
                  title: "Success",
                  className: "success",
                  content: "Student details successfully deleted",
                  isConfirmation: false,
                  callBackFunction: () => {
                    this.resetFormData(false);
                    this.loadExistingStudents();
                  },
                };
                this.props.showMessageBox(messageBox);
              } else {
                let messageBox = {
                  show: true,
                  title: "Oops!",
                  className: "error",
                  content:
                    "Delete student failed.\nYou may be able to try again.",
                  isConfirmation: false,
                  callBackFunction: null,
                };
                this.props.showMessageBox(messageBox);
                console.error(
                  `Delete student failed. | ${response.data.errorMessage}`
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
        content: "Please select an existing student",
        isConfirmation: false,
        callBackFunction: null,
      };
      this.props.showMessageBox(messageBox);
    }
  }

  saveFormData() {
    if (this.validateSaveData()) {
      let formData = {
        StudentID: this.state.studentID,
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        ContactPerson: this.state.contactPerson,
        ContactNo: this.state.contactNo,
      };
      this.props.showLoadingScreen();
      post("Student/Student", formData).then((response) => {
        this.props.hideLoadingScreen();
        if (response.data.statusCode === 200) {
          let messageBox = {
            show: true,
            title: "Success",
            className: "success",
            content: `Student details successfully ${
              this.state.studentID === 0 ? "saved" : "updated"
            }`,
            isConfirmation: false,
            callBackFunction: () => {
              this.resetFormData(false);
              this.loadExistingStudents();
            },
          };
          this.props.showMessageBox(messageBox);
        } else {
          let messageBox = {
            show: true,
            title: "Oops!",
            className: "error",
            content:
              "Save student details failed.\nYou may be able to try again.",
            isConfirmation: false,
            callBackFunction: null,
          };
          this.props.showMessageBox(messageBox);
          console.error(
            `Save student details failed. | ${response.data.errorMessage}`
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
                <i className="fa fa-cube"></i> Student Details
                <Collapsible id="student_input_criteria_id" />
              </CardHeader>
              <CardBody id="student_input_criteria_id">
                <FormGroup row>
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>First Name</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="first_name_id"
                          name="firstName"
                          type="text"
                          value={this.state.firstName}
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
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>Last Name</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="last_name_id"
                          name="lastName"
                          type="text"
                          value={this.state.lastName}
                          maxLength={50}
                          autoComplete="off"
                          onChange={this.handleChangeEvent.bind(this)}
                        />
                        <ErrorSpan
                          IsVisible={true}
                          ErrorName={this.state.lastNameError}
                        />
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>Contact Person</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="contact_person_id"
                          name="contactPerson"
                          type="text"
                          value={this.state.contactPerson}
                          maxLength={50}
                          autoComplete="off"
                          onChange={this.handleChangeEvent.bind(this)}
                        />
                        <ErrorSpan
                          IsVisible={true}
                          ErrorName={this.state.contactPersonError}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>Contact No.</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="contact_no_id"
                          name="contactNo"
                          type="text"
                          value={this.state.contactNo}
                          maxLength={10}
                          autoComplete="off"
                          onChange={this.handleChangeEvent.bind(this)}
                        />
                        <ErrorSpan
                          IsVisible={true}
                          ErrorName={this.state.contactNoError}
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
                      {this.state.studentID === 0 ? "Save" : "Update"}
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
                <i className="fa fa-cube"></i> Existing Students
                <Collapsible id="student_exist_student_details_id" />
              </CardHeader>
              <CardBody id="student_exist_student_details_id">
                <FormGroup row>
                  <Col md="12" sm="12" xs="12">
                    <div style={{ overflowX: "auto" }}>
                      <table className="exist-student-table">
                        <tbody>
                          <tr
                            style={{
                              color: "white",
                              backgroundColor: "#6c757d",
                            }}
                          >
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Contact Person</th>
                            <th>Contact No.</th>
                          </tr>
                          <React.Fragment>
                            {this.state.existingStudentList.map(
                              (student, index) => (
                                <tr
                                  key={index}
                                  onClick={this.loadSelectedStudentData.bind(
                                    this,
                                    student
                                  )}
                                >
                                  <td>{student.studentID}</td>
                                  <td>{student.firstName}</td>
                                  <td>{student.lastName}</td>
                                  <td>{student.contactPerson}</td>
                                  <td>{student.contactNo}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Students);
