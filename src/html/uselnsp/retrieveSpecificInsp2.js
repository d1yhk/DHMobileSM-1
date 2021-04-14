
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

class retrieveSpecificInsp2 extends Component {

	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveSpecificInsp2'){
			config.back.url.push('/retrieveSpecificInsp2');
		}
		if(config.table_name.file !== "retrieveSpecificInsp2"){
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
				td = td + '<td>'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtFstInsp']) ? result[count]['dtFstInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntHsTot']) ? result[count]['cntHsTot'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdPress']) ? result[count]['cdPress'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmsafe']) ? result[count]['nmsafe'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noTelSafe']) ? result[count]['noTelSafe'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtInspPln']) ? result[count]['dtInspPln'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_sepcific_list_2 tbody").html(td);
		}else{
			$(".grp_sepcific_list_2 tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_sepcific_list_2 tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var inspGubun = config.form_search(search_type,'inspGubun');
		var dtInspPlnFr = config.form_search(search_type,'dtInspPlnFr');
		var dtInspPlnTo = config.form_search(search_type,'dtInspPlnTo');
		var nmFclt = config.form_search(search_type,'nmFclt');
		var txAddr = config.form_search(search_type,'txAddr');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_sepcific_list_2 tbody").html("");
			config.grpifm.list=[];
		}
		
		try {
			const common = await Promise.all([ 
				service.retrieveSpecificInspList2(inspGubun, dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_sepcific_list_2 tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_sepcific_list_2 tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_sepcific_list_2 tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	fetchDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{

			var cdFclt = config.grpifm.list[config.grpifm.select_no].cdFclt;
			var idInsp = config.grpifm.list[config.grpifm.select_no].idInsp;
			var idInspType = config.grpifm.list[config.grpifm.select_no].idInspType;
			
			this.props.history.push('/retrieveSpecificDetail2/'+cdFclt+"/"+idInsp+"/"+idInspType);
		}
	}
	govDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			this.props.history.push('/retrieveSpecificDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt);
		}
	}

	componentDidUpdate(){
		$(".footer").css("display","none");
		$(".map").css("display","none");
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");
		config.table_name.file = 'retrieveSpecificInsp2';

		config.fetchCommon("사용시설","검사구분","inspGubun","특정사용시설");
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

			$(".grp_sepcific_list_2 tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_sepcific_list_2").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_sepcific_list_2 tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_sepcific_list_2").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_sepcific_list_2").scrollTop() >= ($(".grp_sepcific_list_2 tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_sepcific_list_2 tr");
		$(document).on("click",".grp_sepcific_list_2 tr",function(){
			config.grpifm.scroll = $(".grp_sepcific_list_2").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_sepcific_list_2 tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			
			var id = config.grpifm.list[config.grpifm.select_no].id;

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

			config.detail_file.index = id;
			config.table.change1 = config.grpifm.list[config.grpifm.select_no].cdFcltBld;
			config.table.change2 = "06";
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrieveAptInsp" ><span>공동주택</span></Link>
						<Link to="/retrieveSpecificInsp2" className="active"><span>특정사용시설</span></Link>
						<Link to="/retrieveRegulatorInsp2"><span>압력조정기</span></Link>
						<Link to="/retrieveUseInspRslt"><span>검사이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">

										<div className="form3">
											<label>검사구분</label>
											<select id="inspGubun">
												<option value="">전체</option>
											</select>
										</div>

										<div className="form3">
											<label>검사계획일자</label>
											<DatePicker
												 locale="ko" 
												id="dtInspPlnFr"
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
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="dtInspPlnTo"
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
										<div className="form3">
											<label>시설명</label>
											<input type="text" id="nmFclt" />
										</div>
										<div className="form6">
											<label>주소</label>
											<input type="text" id="txAddr" />
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
											<col width="120"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>시설구분</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>완성검사일</th>
												<th>모델명</th>
												<th>제조사</th>
												<th>사용세대</th>
												<th>시공사</th>
												<th>검사계획</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_sepcific_list_2">
									<table>
										<colgroup>
											<col width="120"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
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

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />검사등록</button>
						<button type="button" className="btn_detail" onClick={this.govDetail}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>



					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveSpecificInsp2;