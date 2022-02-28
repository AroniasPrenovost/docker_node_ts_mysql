import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmailAddress = this.onChangeEmailAddress.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.state = {
      email_address: "",
      account_password: "",
      loading: false,
      message: ""
    };
  }
  onChangeEmailAddress(e) {
    this.setState({
      email_address: e.target.value
    });
  }
  onChangePassword(e) {
    this.setState({
      account_password: e.target.value
    });
  }
  handleLogin(e) {
    e.preventDefault();
    this.setState({
      message: "",
      loading: true
    });
    this.form.validateAll();
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.email_address, this.state.account_password).then(
        () => {
          if (!this.props.history) {
            this.props.history = ["/profile"];
          } else {
            this.props.history.push("/profile");
          }
          window.location.href = "http://localhost:8888/profile";
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }
  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="email_address">Email Address</label>
              <Input
                type="text"
                className="form-control"
                name="email_address"
                value={this.state.email_address}
                onChange={this.onChangeEmailAddress}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <label htmlFor="account_password">Account Password</label>
              <Input
                type="password"
                className="form-control"
                name="account_password"
                value={this.state.account_password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>
            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
