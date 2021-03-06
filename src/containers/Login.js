
import React, { Component } from 'react';
import { Authentication } from '../components';
import { connect } from 'react-redux';
import { loginRequest } from '../actions/authentication';

class Login extends Component {
 
    handleLogin = (id, pw) => {
        return this.props.loginRequest(id, pw).then(
            (response) => {
                if(this.props.status === "SUCCESS") {
									
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        userid: id,
                        username: unescape(encodeURIComponent(response.uname))
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
 
                    //Materialize.toast('Welcome, ' + id + '!', 2000);
                    this.props.history.push('/');
                    return true;
                } else {
                    //let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    //Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }

    render() {
        return (
            <div>
                <Authentication mode={true}
                  onLogin={this.handleLogin} onAppVersion={this.appVersion}/>
            </div>
        );
    }
}
 
const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => {
            return dispatch(loginRequest(id,pw));
        }
    };
};
 
 
export default connect(mapStateToProps, mapDispatchToProps)(Login);