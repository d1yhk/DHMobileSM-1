/*global jMap*/ 
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import $ from "jquery";
import * as config from '../components/config';

import btnback from '../image/btn_back.png';


import footer_address from '../image/map-footer-address.png';
import footer_danger from '../image/map-footer-danger.png';
import footer_layer from '../image/map-footer-layer.png';
import footer_space from '../image/map-footer-space.png';

import * as service from '../services/posts';
class Map extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/Map'){
			config.back.url.push('/Map');
		}
	}

	componentDidMount() {
		//config.back.url = [];
		config.header.title = "지도";
		$(".header_title").html( "지도");
		$(".contents").css("display","none");
		$(".map").css("display","block");
		$(".footer").css("display","block");
	}

	render() { 
		return (
			<>

			</>
		);
	}
}


export default Map;
