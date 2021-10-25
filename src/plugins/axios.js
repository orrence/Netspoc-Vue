"use strict";

import Vue from 'vue';
import axios from "axios";
import router from '../router';
import EventBus from './event-bus';
import store from '../store'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let baseURL = process.env.BASE_URL ? process.env.BASE_URL + '/backend/' : '/netspocvue/backend/';
console.log('baseURL: ' + baseURL);
let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  baseURL: baseURL,
  timeout: 30 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    const response = error.response;
    store.dispatch('auth/setLoggedIn', false);
    let loginpath = store.state.loginpath;
    if(response.data.msg == 'Login required' || response.data.msg == 'Login failed' ) {
      router.replace({
        path: loginpath,
      })
    } else {
      router.replace({
        path: loginpath,
      });
      EventBus.$emit('httperror',response);
    }
    return Promise.reject(error);
  }
);
Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
