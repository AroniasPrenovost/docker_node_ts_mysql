import React, { Component } from "react";
import AuthService from "../services/auth.service";
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: AuthService.getCurrentUser()
    };
  }
  render() {
    const { currentUser } = this.state;
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.data.first_name}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.token.substring(0, 20)} ...{" "}
          {currentUser.token.substr(currentUser.token.length - 20)}
        </p>
        <p>
          <strong>User Id:</strong>{" "}
          {currentUser.data.id}
        </p>
        <p>
          <strong>Email Address:</strong>{" "}
          {currentUser.data.email_address}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.role &&
            currentUser.role.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>
    );
  }
}