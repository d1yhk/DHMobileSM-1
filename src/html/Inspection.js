//검사 이력
import React, { Component } from 'react';
//import { withRouter } from 'react-router-dom';
//import * as service from '../services/posts';
import * as config from '../components/config';

//import $ from "jquery";


//import RetrieveInspPln from "./supplyInsp/retrieveInspPln";
import RetrieveInspRslt from "./supplyInsp/retrieveInspRslt";

class Inspection extends Component {

	componentWillMount() {
		
	}
	render() { 
		let inspec;
		if( config.inspection.type === "정압기" ){
			inspec = <RetrieveInspRslt/>
		}else{
			inspec = <RetrieveInspRslt/>
		}


		return (
			<div>
			{inspec}
			</div> 
		);
	}
}

export default Inspection
