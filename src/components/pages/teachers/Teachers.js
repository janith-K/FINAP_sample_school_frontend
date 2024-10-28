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

class Teachers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherID: 0,
      firstName: "",
      firstNameError: "",
      lastName: "",
      lastNameError: "",
      contactNo: "",
      contactNoError: "",
      email: "",
      emailError: "",
      existingTeacherList: [],
    };
  }

  componentDidMount() {
    this.loadExistingTeachers();
  }

  handleChangeEvent = (event) => {
    if (event.target.value === "") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    } else {
      if (
        event.target.name === "firstName" ||
        event.target.name === "lastName"
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
    if (event.target.name === "contactNo") {
      this.setState({ contactNoError: "" });
    }
    if (event.target.name === "email") {
      this.setState({ emailError: "" });
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
              teacherID: 0,
              firstName: "",
              firstNameError: "",
              lastName: "",
              lastNameError: "",
              contactNo: "",
              contactNoError: "",
              email: "",
              emailError: "",
            });
          }
        },
      };
      this.props.showMessageBox(messageBox);
    } else {
      this.setState({
        teacherID: 0,
        firstName: "",
        firstNameError: "",
        lastName: "",
        lastNameError: "",
        contactNo: "",
        contactNoError: "",
        email: "",
        emailError: "",
      });
    }
  }

  loadSelectedTeacherData(selectedTeacher) {
    if (selectedTeacher) {
      this.setState({
        teacherID: selectedTeacher.teacherID,
        firstName: selectedTeacher.firstName,
        lastName: selectedTeacher.lastName,
        contactNo: selectedTeacher.contactNo,
        email: selectedTeacher.email,
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
    if (this.state.email === "" || this.state.email === null) {
      isValidate = false;
      this.setState({ emailError: "Email is required" });
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

  loadExistingTeachers() {
    this.props.showLoadingScreen();
    get("Teacher/Teachers").then((response) => {
      this.props.hideLoadingScreen();
      if (response.data.statusCode === 200) {
        if (response.data.result !== null) {
          this.setState({
            existingTeacherList: response.data.result,
          });
        }
      } else {
        let messageBox = {
          show: true,
          title: "Oops!",
          className: "error",
          content:
            "Get existing teachers failed.\nYou may be able to try again.",
          isConfirmation: false,
          callBackFunction: null,
        };
        this.props.showMessageBox(messageBox);
        console.error(
          `Get existing teachers failed. | ${response.data.errorMessage}`
        );
      }
    });
  }

  deleteFormData() {
    if (this.state.teacherID !== 0) {
      let messageBox = {
        show: true,
        title: "Confirmation",
        className: "error",
        content: "Are you sure you want to delete this teacher.?",
        isConfirmation: true,
        callBackFunction: (response) => {
          if (response) {
            this.props.showLoadingScreen();
            del(`Teacher/Teacher/${this.state.teacherID}`).then((response) => {
              this.props.hideLoadingScreen();
              if (response.data.statusCode === 200) {
                let messageBox = {
                  show: true,
                  title: "Success",
                  className: "success",
                  content: "Teacher details successfully deleted",
                  isConfirmation: false,
                  callBackFunction: () => {
                    this.resetFormData(false);
                    this.loadExistingTeachers();
                  },
                };
                this.props.showMessageBox(messageBox);
              } else {
                let messageBox = {
                  show: true,
                  title: "Oops!",
                  className: "error",
                  content:
                    "Delete teacher failed.\nYou may be able to try again.",
                  isConfirmation: false,
                  callBackFunction: null,
                };
                this.props.showMessageBox(messageBox);
                console.error(
                  `Delete teacher failed. | ${response.data.errorMessage}`
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
        content: "Please select an existing teacher",
        isConfirmation: false,
        callBackFunction: null,
      };
      this.props.showMessageBox(messageBox);
    }
  }

  saveFormData() {
    if (this.validateSaveData()) {
      let formData = {
        TeacherID: this.state.teacherID,
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        ContactNo: this.state.contactNo,
        Email: this.state.email,
      };
      this.props.showLoadingScreen();
      post("Teacher/Teacher", formData).then((response) => {
        this.props.hideLoadingScreen();
        if (response.data.statusCode === 200) {
          let messageBox = {
            show: true,
            title: "Success",
            className: "success",
            content: `Teacher details successfully ${
              this.state.teacherID === 0 ? "saved" : "updated"
            }`,
            isConfirmation: false,
            callBackFunction: () => {
              this.resetFormData(false);
              this.loadExistingTeachers();
            },
          };
          this.props.showMessageBox(messageBox);
        } else {
          let messageBox = {
            show: true,
            title: "Oops!",
            className: "error",
            content:
              "Save teacher details failed.\nYou may be able to try again.",
            isConfirmation: false,
            callBackFunction: null,
          };
          this.props.showMessageBox(messageBox);
          console.error(
            `Save teacher details failed. | ${response.data.errorMessage}`
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
                <i className="fa fa-cube"></i> Teacher Details
                <Collapsible id="teacher_input_criteria_id" />
              </CardHeader>
              <CardBody id="teacher_input_criteria_id">
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
                  <Col md="6" sm="12" xs="12">
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Label>Email Address</Label>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <Input
                          id="email_id"
                          name="email"
                          type="text"
                          value={this.state.email}
                          maxLength={50}
                          autoComplete="off"
                          onChange={this.handleChangeEvent.bind(this)}
                        />
                        <ErrorSpan
                          IsVisible={true}
                          ErrorName={this.state.emailError}
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
                      {this.state.teacherID === 0 ? "Save" : "Update"}
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
                <i className="fa fa-cube"></i> Existing Teachers
                <Collapsible id="teacher_exist_teacher_details_id" />
              </CardHeader>
              <CardBody id="teacher_exist_teacher_details_id">
                <FormGroup row>
                  <Col md="12" sm="12" xs="12">
                    <div style={{ overflowX: "auto" }}>
                      <table className="exist-teacher-table">
                        <tbody>
                          <tr
                            style={{
                              color: "white",
                              backgroundColor: "#6c757d",
                            }}
                          >
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Contact No.</th>
                            <th>Email</th>
                          </tr>
                          <React.Fragment>
                            {this.state.existingTeacherList.map(
                              (teacher, index) => (
                                <tr
                                  key={index}
                                  onClick={this.loadSelectedTeacherData.bind(
                                    this,
                                    teacher
                                  )}
                                >
                                  <td>{teacher.firstName}</td>
                                  <td>{teacher.lastName}</td>
                                  <td>{teacher.contactNo}</td>
                                  <td>{teacher.email}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(Teachers);
