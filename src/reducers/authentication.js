import * as types from '../actions/ActionTypes';
 
const initialState = {
    login: {
        status: 'INIT'
    },
    register: {
        status: 'INIT',
        error: -1
    },
    status: {
        valid: false,
        isLoggedIn: false,
        currentUserId: '',
        currentUser: '',
        currentToken2: ''
    }
};
 
export default function authentication(state = initialState, action) {
  switch(action.type) {
    case types.AUTH_REGISTER:
      return {
        ...state,
        register: {
          status: 'WAITING',
          error: -1
        }
      }
    case types.AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        register: {
          ...state.register,
          status: 'SUCCESS'
        }
      }
    case types.AUTH_REGISTER_FAILURE:
      return {
        ...state,
        register:{
          status: 'FAILURE',
          error: action.error
        }
      }
/* CHECK LOGIN */
    case types.AUTH_LOGIN:
        return {
          ...state,
          login : {
            status: 'WAITING'
          }
        }
    case types.AUTH_LOGIN_SUCCESS:
        return {
          ...state,
          login: {
              status: 'SUCCESS'
          },
          status: {
            ...state.status,
            isLoggedIn: true,
            currentUserId: action.userid,
            currentUser: action.username,
            currentToken2: action.usertoken
          }
        }
    case types.AUTH_LOGIN_FAILURE:
        return {
          ...state,
          login:{
            status: 'FAILURE'
          }
        }
/* CHECK SESSIONS */
    case types.AUTH_GET_STATUS:
        return {
          ...state,
          status: {
            ...state.staus,
            isLoggedIn: true
          }
        }
    case types.AUTH_GET_STATUS_SUCCESS:
        return {
          ...state,
          status: {
            ...state.status,
            valid: true,
            currentUser: action.username
          }
        }
    case types.AUTH_GET_STATUS_FAILURE:
        return {
          ...state,
          status: {
            ...state.status,
            valid: false,
            isLoggedIn: false
          }
        }
    /* LOGOUT */
    case types.AUTH_LOGOUT:
        return {
          ...state,
          status: {
            ...state.status,
            isLoggedIn: false,
            currentUser: ''
          }
        }
    default:
      return state;
  }
};
