
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

class retrieveDisassemblyInsp extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveDisassemblyInsp'){
			config.back.url.push('/retrieveDisassemblyInsp');
		}
		if(config.table_name.file !== "retrieveDisassemblyInsp"){
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
				td = td + '<td>'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtLaw']) ? result[count]['dtLaw'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInspPln']) ? result[count]['dtInspPln'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_disasembly_list tbody").html(td);
		}else{
			$(".grp_disasembly_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_disasembly_list tbody").html('<tr><td colspan="6">검색 결과가 없습니다.</td></tr>');
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


		if(!inspGubun){
			inspGubun = 1041;
		}
		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_disasembly_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		
		try {
			const common = await Promise.all([ 
				//bjdNm, idInspType, nmFclt, dtLawFr, dtLawTo, dtInspPlnFr, dtInspPlnTo, 
				service.retrieveDisassemblyInspList(inspGubun,dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_disasembly_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_disasembly_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_disasembly_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	fetchDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{

			var idInsp = config.grpifm.list[config.grpifm.select_no].idInsp;
			var idInspType = config.grpifm.list[config.grpifm.select_no].idInspType;
			this.props.history.push("/retrieveDisassemblyInspInfo/"+idInsp+"/"+idInspType);

		}
	}
	govDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			//alert(config.table.cdFclt);
			var idInspType = config.grpifm.list[config.grpifm.select_no].idInspType;
			var id = config.grpifm.list[config.grpifm.select_no].id;
			if(!id){
				alert("id값이 없습니다.");
			}else{
				if(idInspType === "1041"){
					this.props.history.push('/retrieveGovDetail/'+id);
				}else if(idInspType === "1071"){
					this.props.history.push('/retrieveGovernorDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt);
				}
			}
		}
	}

	componentDidUpdate(){
		$(".footer").css("display","none");
		$(".map").css("display","none");
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");
		config.table_name.file = "retrieveDisassemblyInsp"
		config.fetchCommon("정압기","점검유형","inspGubun","분해점검");



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

			$(".grp_disasembly_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_disasembly_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_disasembly_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}


		var t = this;
	
		$(".grp_disasembly_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_disasembly_list").scrollTop() >= ($(".grp_disasembly_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_disasembly_list tr");
		$(document).on("click",".grp_disasembly_list tr",function(){
			config.grpifm.scroll = $(".grp_disasembly_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_disasembly_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			
			var id = config.grpifm.list[config.grpifm.select_no].id;
			if(config.grpifm.list[config.grpifm.select_no].inspGubunNm === "정압기분해점검"){
				config.table.p1="정압기";
			}else{
				config.table.p1="사용자정압기";
			}
			config.table.p2=id;

			config.detail_file.index = id;
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab6">
						<Link to="/retrieveWeeklyInsp"><span>주간점검</span></Link>
						<Link to="/retrieveQuarterInsp"><span>분기점검</span></Link>
						<Link to="/retrieveAutoPeriodicInsp"><span>자율/정기검사</span></Link>
						<Link to="/retrieveDisassemblyInsp" className="active"><span>분해점검</span></Link>
						<Link to="/retrieveRegulatorInsp"><span>공급압력조정기 점검</span></Link>
						<Link to="/retrieveGovInspRslt"><span>점검이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사구분</label>
											<select id="inspGubun">
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
											<col width="150"/>
											<col width="120"/>
											<col width="200"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>검사구분</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>시공감리일</th>
												<th>검사계획월</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_disasembly_list">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="120"/>
											<col width="200"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
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

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />점검등록</button>
						<button type="button" className="btn_detail" onClick={this.govDetail}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>



					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveDisassemblyInsp;