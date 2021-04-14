
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';

import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveUseInspRslt extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveUseInspRslt'){
			config.back.url.push('/retrieveUseInspRslt');
		}

		if(config.table_name.file !== "retrieveUseInspRslt"){
			config.detail_file.index = "";

			config.grpifm.select_no=-1;
			config.grpifm.search={};
			config.grpifm.list=[];
			config.grpifm.form = [];
			config.table.param1="";
			config.table.param2="";
			config.table.param3="";
			config.table.attach1="";
			config.table.attach2="";
			config.table.attach3="";
			config.table.attach4="";
			config.table.attach5="";
		}
		this.state = {
			startDate: null,
			endDate: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.results = [];

	}
	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}



	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['gbFcltNm']) ? result[count]['gbFcltNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['clsInsp']) ? result[count]['clsInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noEmpInspNm']) ? result[count]['noEmpInspNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdRsltNm']) ? result[count]['cdRsltNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['contUncorr']) ? result[count]['contUncorr'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtCorr']) ? result[count]['dtCorr'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noEmpCorrNm']) ? result[count]['noEmpCorrNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['contCorr']) ? result[count]['contCorr'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_useinsp_list tbody").html(td);
		}else{
			$(".grp_useinsp_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_useinsp_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var gbFclt = config.form_search(search_type,'gbFclt');
		var cdFclt = config.form_search(search_type,'cdFclt');
		var nmFclt = config.form_search(search_type,'nmFclt');
		var txAddr = config.form_search(search_type,'txAddr');
		var inspGubun = config.form_search(search_type,'inspGubun');
		var dtInspFr = config.form_search(search_type,'dtInspFr');
		var dtInspTo = config.form_search(search_type,'dtInspTo');
		var cdRslt = config.form_search(search_type,'cdRslt');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_useinsp_list tbody").html("");
			config.grpifm.list=[];
		}
		
		try {
			const common = await Promise.all([ 
				//bjdNm, idInspType, nmFclt, dtLawFr, dtLawTo, dtInspPlnFr, dtInspPlnTo, 
				service.retrieveUseInspRslt(gbFclt,cdFclt,nmFclt,txAddr,inspGubun,dtInspFr,dtInspTo,cdRslt,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_useinsp_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_useinsp_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_useinsp_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	fetchDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			var cdFclt = config.grpifm.list[config.grpifm.select_no].cdFclt;
			var idInsp = config.grpifm.list[config.grpifm.select_no].idInsp;
			var idInspType  = config.grpifm.list[config.grpifm.select_no].idInspType ;
			
			
			this.props.history.push('/retrieveUseInspRsltDetail/'+cdFclt+"/"+idInsp+"/"+idInspType );

		}
	}
	fetchSisul = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			if(config.grpifm.list[config.grpifm.select_no].gbFcltNm === "공동주택" ){

				if(config.grpifm.list[config.grpifm.select_no].cdFclt !== ''){
					this.props.history.push('/retrieveCommunalDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt);
				}else{
					alert("상세정보가 없습니다.");
				}

			}else if(config.grpifm.list[config.grpifm.select_no].gbFcltNm === "특정사용시설" ){
				if(config.grpifm.list[config.grpifm.select_no].cdFclt !== ''){
					this.props.history.push('/retrieveSpecificDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt);
				}else{
					alert("상세정보가 없습니다.");
				}

			}else if(config.grpifm.list[config.grpifm.select_no].gbFcltNm === "압력조정기" ){
				if(config.grpifm.list[config.grpifm.select_no].cdFclt !=='' ){
					this.props.history.push('/retrieveGovernorDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt+"/압력조정기");
				}else{
					alert("상세정보가 없습니다.");
				}

			}
		}
	}
/*
	componentDidUpdate(){
		$(".footer").css("display","none");
		$(".map").css("display","none");
	}
	*/
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");
		config.table_name.file = 'retrieveUseInspRslt';

		config.fetchCommon("사용시설","시설구분","gbFclt");
		config.fetchCommon("사용시설","검사구분","inspGubun");
		config.fetchCommon("점검","결과","cdRslt");

		if(config.grpifm.list.length > 0 ){
			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
				}
			});
			let result = config.grpifm.list;
			this.page.total = (result.length);
			this.lists(result,1,0);

			$(".grp_useinsp_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_useinsp_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_useinsp_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_useinsp_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_useinsp_list").scrollTop() >= ($(".grp_useinsp_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_useinsp_list tr");
		$(document).on("click",".grp_useinsp_list tr",function(){
			config.grpifm.scroll = $(".grp_useinsp_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_useinsp_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			//위치,길안내
			
			if(config.grpifm.list[config.grpifm.select_no].gbFcltNm==="압력조정기"){
				config.table.p1="사용자정압기";
				config.table.p2=config.grpifm.list[config.grpifm.select_no].id;
			}else{
				var lAddr = "";
				if(config.grpifm.list[config.grpifm.select_no].lAddr){
					lAddr = ",BULD_MNNM:'"+config.grpifm.list[config.grpifm.select_no].lAddr+"'";
				}
				var sAddr = "";
				if(config.grpifm.list[config.grpifm.select_no].sAddr){
					sAddr = ",BULD_SLNO:'"+config.grpifm.list[config.grpifm.select_no].sAddr+"'";
				}

				config.table.p1="건물";
				config.table.p2="filter=ROAD_NM:'"+config.grpifm.list[config.grpifm.select_no].roadAddr+"'"+lAddr+sAddr;
			}


			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
			
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrieveAptInsp"><span>공동주택</span></Link>
						<Link to="/retrieveSpecificInsp2"><span>특정사용시설</span></Link>
						<Link to="/retrieveRegulatorInsp2"><span>압력조정기</span></Link>
						<Link to="/retrieveUseInspRslt" className="active"><span>검사이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>시설구분</label>
											<select id="gbFclt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설코드</label>
											<input type="text" id="cdFclt" />
										</div>
										<div className="form4">
											<label>시설명</label>
											<input type="text" id="nmFclt" />
										</div>
										<div className="form4">
											<label>주소</label>
											<input type="text" id="txAddr" />
										</div>
										<div className="form4">
											<label>검사구분</label>
											<select id="inspGubun">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>검사일자</label>
											<DatePicker
												 locale="ko" 
												id="dtInspFr"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form4">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="dtInspTo"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form4">
											<label>검사결과</label>
											<select id="cdRslt">
												<option value="">전체</option>
											</select>
										</div>
									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>시설구분</th>
												<th>검사구분</th>
												<th>검사세부항목</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>검사일자</th>
												<th>검사자</th>
												<th>검사결과</th>
												<th>부적합내용</th>
												<th>개선일자</th>
												<th>재검사자</th>
												<th>개선조 결과</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_useinsp_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>

						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />개선조치 결과등록</button>
						<button type="button" className="btn_detail" onClick={this.fetchSisul}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>



					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveUseInspRslt;