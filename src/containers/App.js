import React, { Component } from 'react';
import { Header } from '../components';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route,Link,Switch,withRouter } from 'react-router-dom';
import { getStatusRequest, logoutRequest  } from '../actions/authentication';
import retrievePipe from "../html/supply/retrievePipe";
import retrieveValve from "../html/supply/retrieveValve";

import Footer from "../components/Footer";
import * as config from '../components/config';
import $ from "jquery";

class App extends Component {

		componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
			console.log("--------------")
			// get cookie by name
			function getCookie(name) {
					var value = "; " + document.cookie; 
					var parts = value.split("; " + name + "="); 
					if (parts.length == 2) return parts.pop().split(";").shift();
			}
 
			// get loginData from cookie
			let loginData = getCookie('key');
 
			// if loginData is undefined, do nothing
			if(typeof loginData === "undefined") {
				this.props.history.push('/login');
				return;
			}
			// decode base64 & parse json
			loginData = JSON.parse(atob(loginData));
				// if not logged in, do nothing
			if(!loginData.isLoggedIn) {
				this.props.history.push('/login');
				return;
			}
 
			// page refreshed & has a session in cookie,
			// check whether this cookie is valid or not
			
			
			this.props.getStatusRequest().then(
					() => {
							/*
							let loginData = getCookie('key');
							loginData = JSON.parse(atob(loginData));
							
							
							*/

							document.cookie='key=' + btoa(JSON.stringify(loginData));
							//alert(document.cookie);
							// if session is not valid
							/*
							if(!this.props.status.valid) {
									// logout the session
									loginData = {
											isLoggedIn: false,
											userid: '',
											username: ''
									};
 
									document.cookie='key=' + btoa(JSON.stringify(loginData));
 
									// and notify
									//let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
									//Materialize.toast($toastContent, 4000);
							}
							*/
					}
			);
				
		}
    handleLogout = () => {
        this.props.logoutRequest().then(
            () => {
                //Materialize.toast('Good Bye!', 2000);
 
                // EMPTIES THE SESSION
                let loginData = {
                    isLoggedIn: false,
                    userid: '',
                    username: '',
                    token2: ''
                };
 
                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        );
    }
		
		//componentWillUnmount(){}

		//컴포넌트가 리렌더링을 마친 후 실행
		//componentDidUpdate(){}

		//컴포넌트가 업데이트 되기 전에 실행
		//componentWillUpdate(){}

		//prop 혹은 state 가 변경 되었을 때, 리렌더링을 할지 말지 정하는 메소드
		//shouldComponentUpdate(){}

		//컴포넌트가 prop 을 새로 받았을 때 실행
		componentWillReceiveProps(){
			//alert(config.user.id);
			
			//console.log(this.props);

		}

		//컴포넌트가 DOM 위에 만들어지기 전에 실행
		//componentWillMount(){console.log("5");}
		
		

    render(){
      /* Check whether current route is login or register using regex */
      let re = /(login|register)/;
      let isAuth = re.test(this.props.location.pathname);

      return (
        <div>
          {isAuth ? undefined : <Header loginInfo={this.props.status} />}
					<Footer />
        </div>
      );
    }
}
 
const mapStateToProps = (state) => {
    return {
        status: state.authentication.status
    };
};
 
const mapDispatchToProps = (dispatch) => {
    return {

        getStatusRequest: () => {
            return dispatch(getStatusRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        }
    };
};
 
export default connect(mapStateToProps, mapDispatchToProps)(App);