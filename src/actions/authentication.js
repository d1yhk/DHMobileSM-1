import axios from 'axios';

import * as service from '../services/posts';

import {
    AUTH_REGISTER,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE,
    AUTH_LOGIN,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_GET_STATUS,
    AUTH_GET_STATUS_SUCCESS,
    AUTH_GET_STATUS_FAILURE,
    AUTH_LOGOUT
} from './ActionTypes';
 
/* REGISTER */
export function registerRequest(username, password) {
    return (dispatch) => {
        // Inform Register API is starting
        dispatch(register());
 
        return axios.post('/api/account/signup', { username, password })
        .then((response) => {
            dispatch(registerSuccess());
        }).catch((error) => {
            dispatch(registerFailure(error.response.data.code));
        });
    };
}
 
export function register() {
    return {
        type: AUTH_REGISTER
    };
}
 
export function registerSuccess() {
    return {
        type: AUTH_REGISTER_SUCCESS,
    };
}
 
export function registerFailure(error) {
    return {
        type: AUTH_REGISTER_FAILURE,
        error
    };
}

/* LOGIN */
export function loginRequest(userid, password) {
  return (dispatch) => {
      // Inform Login API is starting
      dispatch(login());

      // API REQUEST
      return axios.post(service.url+'/common/userAuth.do', {idUser: userid, passWord: password})
      .then((response) => {
					if(response.data.code === "1"){
          // SUCCEED
						//console.log(response);
		        dispatch(loginSuccess(userid,response.data.result.nmUser,response.data.result.token2));
						return {uname:response.data.result.nmUser,token2:response.data.result.token2};
					}else{
						alert(response.data.message);
					}
					
      }).catch((error) => {
          // FAILED

          dispatch(loginFailure());
      });
		
  };
}
 
export function login() {
    return {
        type: AUTH_LOGIN
    };
}
 
export function loginSuccess(userid,username,usertoken) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        userid,
        username,
        usertoken
    };
}
 
export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

/* GET STATUS */
export function getStatusRequest() {
    return (dispatch) => {
        // inform Get Status API is starting
				
        dispatch(getStatus());
				
        //return axios.get('/api/account/getInfo')
				return axios.post(service.url+'/common/userAuth.do', {idUser: '', passWord: ''})
        .then((response) => {
            dispatch(getStatusSuccess(response.data.info.username)); //HTTP 틍신을 통해 username을 빋이옴
        }).catch((error) => {
            dispatch(getStatusFailure());
        });



    };
}
 
export function getStatus() {
    return {
        type: AUTH_GET_STATUS
    };
}
 
export function getStatusSuccess(username) {
    return {
        type: AUTH_GET_STATUS_SUCCESS,
        username
    };
}
 
export function getStatusFailure() {
    return {
        type: AUTH_GET_STATUS_FAILURE
    };
}
/* Logout */
export function logoutRequest() {
    return (dispatch) => {
        return axios.post('/api/account/logout')
        .then((response) => {
            dispatch(logout());
        });
    };
}
 
export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}
