/*global hwindow*/
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import * as config from './components/config';

import login_logo from './image/login_logo.png';
import login_logo_ifm from './image/login_logo_ifm.png';

function LoginForm({ authenticated, login, location }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = () => {
    //try {
      login({ email, password });
			
			//hwindow.Android.keyOut();
   //} catch (e) {
    //  alert('아이디 비번 확인');
    //  setEmail('');
    //  setPassword('');
    //}




  };

  const { from } = location.state || { from: { pathname: "/" } };
  if (authenticated) return <Redirect to={from} />;

  return (
    <>

			<div className="zero">
				<div className="login">
					<div className="login_box">
						<form>
							<img alt="" src={login_logo} width="283" height="35" />
							<img alt="" src={login_logo_ifm} width="214" height="45"  />
							<input type="text" placeholder="아이디를 입력하세요."  className="uid"  value={email}  onChange={({ target: { value } }) => setEmail(value)}/>
							<input type="password" placeholder="비밀번호를 입력하세요." className="upw" value={password} onChange={({ target: { value } }) => setPassword(value)}/>
							<button type="button" onClick={handleClick}>로그인</button>
						</form>
						<div className="version">V0.1.8</div>
					</div>
				</div>
			</div> 

    </>
  );
}

export default LoginForm;