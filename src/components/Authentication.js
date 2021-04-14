
import React, { Component } from 'react';
import PropTypes from 'prop-types';
 
import * as service from '../services/posts';
import login_logo from '../image/login_logo.png';
import login_logo_ifm from '../image/login_logo_ifm.png';
import $ from "jquery";

class Authentication extends Component {
    state = {
      username:"",
      password:""
    }
 
    handleChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
 
    handleRegister = () => {
        let id = this.state.username;
        let pw = this.state.password;
 
        this.props.onRegister(id, pw).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: ''
                    });
                }
            }
        );
    }
 
    handleLogin = () => {
        let id = this.state.username;
        let pw = this.state.password;
        this.props.onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }
		handleKeyPress = (e) => {
        if(e.charCode===13) {
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

		btnFileDown = async () => {
			
				var form = document.createElement("form");
				form.target = "_self";			//_blank  Map
				form.method = "POST";
				//form.action = service.url+"/apk/grpifm.apk";
				form.action = "http://grpmobile.dhgas.com:4800/DHMobileSM/apk/grpifm.apk";
				form.style.display = "none";

				document.body.appendChild(form);
				//form.submit();
				window.location.href = service.url + "/apk/grpifm.apk?1=1";
				//window.location.href="http://ibc.iptime.org:8080/DHMobileSM/file/download3.do?1=1&ext=jpg&gbNmFile=%ED%98%84%EC%9E%A5%EA%B5%90%EC%9C%A1&totalcount=3&seqFile=1&num=3&cdKey1=20200051&noFile=2000000072&filename=200477766001_11_20210210175951741.jpg&idInsert=null&rowNum=2&dtsInsert=2021-02-10%2016:55&gbFile=SFR34_03_06&gubun=%EA%B3%B5%EC%82%AC%ED%98%84%EC%9E%A5";
				return;
		}
		onStart = () => {
			setTimeout(function(){
				if( $(".app_version").val().toString() !== $(".vdown").find("span").html().toString()){
					$(".vdown").css("display","inline-block");
				}
			},500);
		}
		apkDown = () => {
			//alert(0);
			window.location.href = service.url+"/apk/grpifm.apk";
		}
		
	btnPicResgist = () =>{
		window.Android.Attach();
		//this.props.history.push('/AttachAdd/'+this.props.match.params.title);
	}
    render() {
				/*
        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>Username</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.username}/>
                </div>
                <div className="input-field col s12">
                    <label>Password</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.password}
										onKeyPress={this.handleKeyPress}/>
                </div>
            </div>
        );
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {inputBoxes}
                        <a className="waves-effect waves-light btn" onClick={this.handleLogin}>SUBMIT</a>
                    </div>
                </div>
 
 
                <div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>
 
            </div>
        );

        const registerView = (
            <div className="card-content">
                <div className="row">
                    {inputBoxes}
                    <a className="waves-effect waves-light btn"
                      onClick={this.handleRegister}>CREATE</a>
                </div>
            </div>
        );
				*/

        return (
					<div className="zero" onLoad={this.onStart}>
						<div className="login">
							<div className="login_box">
								<form>
									<img alt="" src={login_logo} width="283" height="35" />
									<img alt="" src={login_logo_ifm} width="214" height="45" id="test" />
									<input type="text" placeholder="아이디를 입력하세요."  className="uid" name="username" onChange={this.handleChange} value={this.state.username}/>
									<input type="password" placeholder="비밀번호를 입력하세요." className="upw" name="password" onChange={this.handleChange} value={this.state.password} onKeyPress={this.handleKeyPress}/>
									<button type="button" className="login_token" onClick={this.handleLogin}>로그인</button>
									<div className="version_check">
										<div className="version">Current : v0.3.4</div>
{/*<button type="button" className="onBarcode">바코드</button>*/}
{/*<button type="button" className="onDraw">서명</button>*/}
{/*<button type="button" onClick={this.btnPicResgist}>첨부파일</button>*/}
										<button type="button" type="button" className="vdown" onClick={this.btnFileDown} target="_self">Download : v<span>0.3.4</span></button>
{/*<button type="button" type="button" className="vdown" onClick={this.apkDown} target="_self">2Download : v0.2.7</button>브라우저*/}
									</div>
								</form>
								
							</div>
						</div>
					</div> 

        );
    }
}

Authentication.propTypes = {
    mode: PropTypes.bool,
    onRegister: PropTypes.func,
    onLogin: PropTypes.func
};
 
Authentication.defaultProps = {
    mode: true,
    onRegister: (id, pw) => { console.error("register function is not defined"); },
    onLogin: (id, pw) => { console.error("login function not defined"); }
};
 
export default Authentication;
