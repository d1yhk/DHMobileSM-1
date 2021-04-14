import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import retrievePipe from "../html/supply/retrievePipe";
import retrieveValve from "../html/supply/retrieveValve";
import retrieveGov from "../html/supply/retrieveGov";
import retrieveSpecial from "../html/supply/retrieveSpecial";

import retrieveCommunal from "../html/use/retrieveCommunal";
import retrieveSpecific from "../html/use/retrieveSpecific";
import retrieveGeneral from "../html/use/retrieveGeneral";
import retrieveGovernor from "../html/use/retrieveGovernor";
import retrieveRegulator from "../html/use/retrieveRegulator";

import retrieveTb from "../html/protect/retrieveTb";
import retrieveRectifier from "../html/protect/retrieveRectifier";
import retrieveJoin from "../html/protect/retrieveJoin";

import retrieveCoatdamage from "../html/manage/retrieveCoatdamage";
import retrieveSoilresist from "../html/manage/retrieveSoilresist";
import retrievePunch from "../html/manage/retrievePunch";

import retrieveMemo from "../html/etc/retrieveMemo";
import retrievePlanpipe from "../html/etc/retrievePlanpipe";
import retrieveEdit from "../html/etc/retrieveEdit";
import retrieveRebuild from "../html/etc/retrieveRebuild";

import retrieveInspPln from "../html/supplyInsp/retrieveInspPln";
import retrieveInspRslt from "../html/supplyInsp/retrieveInspRslt";


import Login from "../html/Login";
import Attach from "../html/Attach";
import Map from "../html/Map";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as config from '../components/config';

// App.js에 있던 Aladin, LionKing, SpiderMan을
// Components/Routes.js 로 이동
// eslint-disable-next-line

export default () => (
	<>

		<Login />
			<Header />
			{/*시설물 공급시설*/}
			<Route path="/Map" component={Map} /> 
			<Route path="/retrievePipe" component={retrievePipe} /> 
			<Route path="/retrieveValve" component={retrieveValve} /> 
			<Route path="/retrieveGov" component={retrieveGov} /> 
			<Route path="/retrieveSpecial" component={retrieveSpecial} /> 
			{/*사용시설*/}
			<Route path="/retrieveCommunal" component={retrieveCommunal} /> 
			<Route path="/retrieveSpecific" component={retrieveSpecific} /> 
			<Route path="/retrieveGeneral" component={retrieveGeneral} /> 
			<Route path="/retrieveGovernor" component={retrieveGovernor} /> 
			<Route path="/retrieveRegulator" component={retrieveRegulator} /> 
			{/*시설물 방식시설*/}
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
			<Route path="/retrieveInspPln" component={retrieveInspPln} /> 
			<Route path="/retrieveInspRslt" component={retrieveInspRslt} /> 
			<Route path="/Attach" component={Attach} /> 
		<Footer/>	
	</>
)
