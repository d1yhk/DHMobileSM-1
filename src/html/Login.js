import React, { Component } from 'react';
//import { withRouter } from 'react-router-dom';
import * as service from '../services/posts';
import * as config from '../components/config';
//import { Link } from "react-router-dom";


import login_logo from '../image/login_logo.png';
import login_logo_ifm from '../image/login_logo_ifm.png';
import $ from "jquery";


class Login extends Component {


	//로그인
	btnLogin = async () => { 
		var id = $(".uid").val();
		var pw = $(".upw").val();
		if(id==="" || pw === ""){
			alert("아이디 또는 암호가 올바르지 않습니다.");
			return;
		}
		try {
			const login = await Promise.all([ 
				service.login(id,pw)
			]);
			if(login[0].data.code === "-1"){
				alert(login[0].data.message);
			}else{
				
				config.login.session = login[0].data.result.JSESSIONID;
				config.user.id = login[0].data.result.idUser;
				this.props.history.push("/");
			}
			
		} catch(err){
			alert("아이디 또는 암호가 올바르지 않습니다.");
		}
	
	}


	componentWillMount() {
	}
	render() { 

		return (
			<div className="zero">

				<div className="login">
					<div className="login_box">
						<form>
							<img alt="" src={login_logo} width="283" height="35" />
							<img alt="" src={login_logo_ifm} width="214" height="45"  />
							<input type="text" placeholder="아이디를 입력하세요."  className="uid" />
							<input type="password" placeholder="비밀번호를 입력하세요." className="upw" />
							<button type="button" onClick={this.btnLogin}>로그인</button>
						</form>
					</div>
				</div>
			</div> 
		);
	}
}

export default Login
