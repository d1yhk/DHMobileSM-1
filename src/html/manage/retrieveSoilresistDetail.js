
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);


class retrieveSoilresistDetail extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveSoilresistDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveSoilresistDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

		this.state = {
				startDate: '',//new Date(),
				endDate: '',
				startDate2: '',
				endDate2: ''
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange2 = this.endDateChange2.bind(this);
	}
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	//if(date.getTime() > this.state.endDate.getTime()){
	//	this.endDateChange(date);
	//}
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}
	startDateChange2(date) {
			this.setState({
					startDate2: date
			});
	//if(date.getTime() > this.state.endDate2.getTime()){
	//	this.endDateChange2(date);
	//}
	}
	endDateChange2(date) {
			this.setState({
					endDate2: date
			});
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".footer_contents").css("display","block");

		config.header.title = "관리시설";
		$(".header_title").html( "관리시설");


		config.table.name="배관";
		config.table.filter="id";
		config.detail_file.folder1="protect";
		config.detail_file.folder2="location";
		config.detail_file.name="retrieveJointDetail";
		


	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>토양비저항 상세정보</h2>
					</div>
					<div className="wrap">
						<div className="box info">
	
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveSoilresist','토양비저항')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.Ready()}><img alt="" src={icon1} width="15" height="15" />탐측결과</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveSoilresistDetail;