import axios from "axios";
const API_URL = "http://localhost:6868/api/v1/users/";
class AuthService {
  login(email_address, account_password) {
    return axios
      .post(API_URL + "login", {
        email_address,
        account_password
      })
      .then(response => {
        console.log('RESPONSE: ', response)
        if (response.data.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        return response.data;
      });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}
export default new AuthService();