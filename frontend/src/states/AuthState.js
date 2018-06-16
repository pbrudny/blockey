import { action, observable } from 'mobx';
import Cookies from 'js-cookie'

class AuthState {
  @observable loginData = {
    username: "",
    password: ""
  };
  @observable registerData = {
    name: "",
    email: "",
    username: "",
    password: "",
    repeat_password: "",
    tos: false,
    formError: "",
  };
  @observable isLoggedIn = Cookies.get('token') !== undefined;
  @observable token = Cookies.get('token');
}

const authState = new AuthState();

export function cleanAuthState() {
  action(() => {
    authState.loginData = {
      username: "",
      password: ""
    };

    authState.registerData = {
      name: "",
      email: "",
      username: "",
      password: "",
      repeat_password: "",
      tos: false,
      formError: "",
    };

    authState.isLoggedIn = false;
    authState.token = null;
    Cookies.remove('isJWT');
    Cookies.remove('token', {
      path: '/'
    });
  })();
}


export default authState;