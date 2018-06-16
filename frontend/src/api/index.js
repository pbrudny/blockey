import axios from "axios";
import authState, {cleanAuthState} from "root/states/AuthState";
import config from "./config";
import { action, autorun } from "mobx";
import { enableLogging } from 'mobx-logger';
import Cookies from "js-cookie";

if (process.env.NODE_ENV !== 'production') enableLogging();

class AuthToken {
  _token = null;

  constructor(token = null) {
    this._token = token;
  }

  set (token) {
    this._token = token;
  }

  get () {
    return this._token;
  }
}

class Api {
  constructor() {
    this.tokenContainer = new AuthToken();
    this.instance = this.createInstance();

    autorun(() => {
      this.authorized = authState.isLoggedIn;
      this.tokenContainer.set(authState.token);
    })
  }

  createInstance = () => {

    // const withCredentials = !(process.env.NODE_ENV === 'development');
    const withCredentials = false;

    this.instance = axios.create({
      baseURL: config.host,
      withCredentials: withCredentials,
      // xsrfCookieName: 'csrftoken',
      // xsrfHeaderName : 'X-CSRFToken'
    });

    // this.instance.defaults.withCredentials = withCredentials;

    this.instance.interceptors.response.use(response => response, (error) => {

      if (error.response && error.response.status === 401) {

        cleanAuthState();
        action(() => {
          authState.isLoggedIn = false;
        })();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    });

    this.instance.interceptors.request.use((config) => {
      if (authState.isLoggedIn) {
        if(Cookies.get('isJWT')) {
          config.headers['Authorization'] = 'JWT ' + this.tokenContainer.get();
        }else {
          config.headers['Authorization'] = 'Token ' + this.tokenContainer.get();
        }

      }
      if( window.localStorage.i18nextLng) {
        config.headers['User-Language'] = window.localStorage.i18nextLng;
      }
      return config;
    }, (error) => {
      // Do something with response error
      return Promise.reject(error);
    });
  };

  getInstance = () => {
    if (this.instance == null) {
      this.createInstance();
    }

    if (this.instance != null || typeof this.instance !== "undefined") {
      return this.instance;
    }
  };
  ValidatePost = (data) => {
    console.log('data', data);
    return this.getInstance().post('/kyc', data);
  };
}

const api = new Api();
export default api;

export function getFileFromInput(e) {
  return new Promise((accept, reject) => {
    let files = e.target.files;
    if (FileReader && files && files.length) {
      let fr = new FileReader();
      fr.onload = function () {
        accept(fr.result);
      };
      fr.onerror = function () {
        reject();
      };
      fr.onabort = function () {
        reject();
      };
      fr.readAsDataURL(files[0]);
    }
  });
}
