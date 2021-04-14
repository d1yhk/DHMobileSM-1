import React, { useState, useEffect } from 'react';
import './App.css';
import { signIn } from './auth';
import { BrowserRouter as Router, Route, Switch,withRouter } from 'react-router-dom';

import Routers from "./components/Routers";


import LoginForm from './LoginForm';
import AuthRoute from './AuthRoute';
import Main from './html/Main';


import retrievePipe from "./html/supply/retrievePipe";
import retrievePipeDetail from "./html/supply/retrievePipeDetail";

import retrieveValve from "./html/supply/retrieveValve";
import retrieveGov from "./html/supply/retrieveGov";
import retrieveSpecial from "./html/supply/retrieveSpecial";

import retrieveCommunal from "./html/use/retrieveCommunal";
import retrieveSpecific from "./html/use/retrieveSpecific";
import retrieveGeneral from "./html/use/retrieveGeneral";
import retrieveGovernor from "./html/use/retrieveGovernor";
import retrieveRegulator from "./html/use/retrieveRegulator";

import retrieveTb from "./html/protect/retrieveTb";
import retrieveRectifier from "./html/protect/retrieveRectifier";
import retrieveJoin from "./html/protect/retrieveJoin";

import retrieveCoatdamage from "./html/manage/retrieveCoatdamage";
import retrieveSoilresist from "./html/manage/retrieveSoilresist";
import retrievePunch from "./html/manage/retrievePunch";

import retrieveMemo from "./html/etc/retrieveMemo";
import retrievePlanpipe from "./html/etc/retrievePlanpipe";
import retrieveEdit from "./html/etc/retrieveEdit";
import retrieveRebuild from "./html/etc/retrieveRebuild";

import retrieveInspPln from "./html/supplyInsp/retrieveInspPln";
import retrieveInspRslt from "./html/supplyInsp/retrieveInspRslt";



import Attach from "./html/Attach";
import Map from "./html/Map";



function App() {
  const [user, setUser] = useState(null);
  const authenticated = user != null;
	


  const login = ({ email, password }) => setUser(signIn({ email, password }));
  const logout = () => setUser(null);

  return (
    <Router>
      <main>
        <Switch>
         
          <Route
            path="/login"
            render={props => (
              <LoginForm authenticated={authenticated} login={login} {...props} />
            )}
          />
					
          <AuthRoute
            authenticated={authenticated}
            path="/"
            render={props => <Main user={user} {...props} />}
          />
				</Switch>


				<Switch>
						<Route path="/retrievePipe" component={retrievePipe} /> 
						<Route path="/retrievePipeDetail/:idx" component={retrievePipeDetail} /> 
						<Route path="/retrieveValve/:idx" component={retrieveValve} /> 
						<Route path="/retrieveValve" component={retrieveValve} /> 
						<Route path="/retrieveGov/:idx" component={retrieveGov} /> 
						<Route path="/retrieveGov" component={retrieveGov} /> 
						<Route path="/retrieveSpecial/:idx" component={retrieveSpecial} /> 
						<Route path="/retrieveSpecial" component={retrieveSpecial} /> 
						{/*사용시설*/}
						<Route path="/retrieveCommunal" component={retrieveCommunal} /> 
						<Route path="/retrieveSpecific" component={retrieveSpecific} /> 
						<Route path="/retrieveGeneral" component={retrieveGeneral} /> 
						<Route path="/retrieveGovernor" component={retrieveGovernor} /> 
						<Route path="/retrieveRegulator" component={retrieveRegulator} /> 
						{/*시설물 방식시설*/}
						<Route path="/retrieveTb/:idx" component={retrieveTb} /> 
						<Route path="/retrieveTb" component={retrieveTb} /> 
						<Route path="/retrieveRectifier" component={retrieveRectifier} /> 
						<Route path="/retrieveJoin" component={retrieveJoin} /> 
						{/*시설물 관리시설*/}
						<Route path="/retrieveCoatdamage" component={retrieveCoatdamage} /> 
						<Route path="/retrieveSoilresist" component={retrieveSoilresist} /> 
						<Route path="/retrievePunch" component={retrievePunch} /> 
						{/*시설물 기타시설*/}
						<Route path="/retrieveMemo" component={retrieveMemo} /> 
						<Route path="/retrievePlanpipe" component={retrievePlanpipe} /> 
						<Route path="/retrieveEdit" component={retrieveEdit} /> 
						<Route path="/retrieveRebuild" component={retrieveRebuild} /> 
						{/*안점점검 공급시설*/}
						<Route path="/retrieveInspPln/:name" component={retrieveInspPln} /> 
						<Route path="/retrieveInspPln" component={retrieveInspPln} /> 
						<Route path="/retrieveInspRslt/:type/:type1" component={retrieveInspRslt} /> 
						<Route path="/retrieveInspRslt/:type" component={retrieveInspRslt} /> 
						<Route path="/retrieveInspRslt" component={retrieveInspRslt} /> 
						<Route path="/Attach/:title" component={Attach} /> 
						<Route path="/Attach" component={Attach} /> 
        </Switch>
      </main>
    </Router>
  );
}

export default App;
