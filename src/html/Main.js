import React, { Component } from 'react';

//import * as service from './services/posts';
//import * as config from './components/config';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//import Map from "../html/Map";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import * as config from '../components/config';
//import * as service from '../services/posts';

//import login_logo from '../image/login_logo.png';
//import login_logo_ifm from '../image/login_logo_ifm.png';
//import $ from "jquery";


class Main extends Component {


	componentDidMount() {
		
	}
	render() { 
//		let inspec;
		/*
		if( config.user.id === "" ){
			inspec = <Login/>
		}else{

		}
		*/

		return (
			<div className="zero"> 
				<div className="router">
						<Header />
						<Footer />
				</div>
			</div> 
		);
	}
}

export default Main;
