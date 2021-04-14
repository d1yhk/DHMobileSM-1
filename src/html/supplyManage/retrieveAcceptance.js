
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon10 from '../../image/icon10.png';



import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveAcceptance extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveAcceptance'){
			config.back.url.push('/retrieveAcceptance');
		}

		if(config.table_name.file !== "retrieveAcceptance"){
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
		if(config.table.page > 0 ){
			this.page.page = config.table.page;
		}
		
		this.state = {
				startDate: null,
				endDate: null,
				startDate2: null,
				endDate2: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange2 = this.endDateChange2.bind(this);
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
	startDateChange2(date) {
			this.setState({
					startDate2: date
			});
	}
	endDateChange2(date) {
			this.setState({
					endDate2: date
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
					td = td + '<td>'+((result[count]['dtTakeTo']) ? result[count]['dtTakeTo'] : '')+'</td>';
					td = td + '<td data-id="'+result[count]['idConst']+'">'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmCom']) ? result[count]['nmCom'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtConstFr']) ? result[count]['dtConstFr'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtConstTo']) ? result[count]['dtConstTo'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmEmpGive']) ? result[count]['nmEmpGive'] : '')+'</td>';					
					td = td + '<td>'+((result[count]['dtTakeFr']) ? result[count]['dtTakeFr'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmEmpTakeinsp']) ? result[count]['nmEmpTakeinsp'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmEmp2Takeinsp']) ? result[count]['nmEmp2Takeinsp'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtTakeinsp']) ? result[count]['dtTakeinsp'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmRsltTakeinsp']) ? result[count]['nmRsltTakeinsp'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtTakeGis']) ? result[count]['dtTakeGis'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtEntrGis']) ? result[count]['dtEntrGis'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmEmpInsp2']) ? result[count]['nmEmpInsp2'] : '')+'</td>';					
					td = td + '<td>'+((result[count]['dtTakeinsp2']) ? result[count]['dtTakeinsp2'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmRsltTakeinsp2']) ? result[count]['nmRsltTakeinsp2'] : '')+'</td>';
					td = td + '<td>'+((result[count]['txTakeinsp']) ? result[count]['txTakeinsp'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_acceptance_list tbody").html(td);
		}else{
			$(".grp_acceptance_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_acceptance_list tbody").html('<tr><td colspan="18">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var cdCom = config.form_search(search_type,'cdCom');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var noEmpGive = config.form_search(search_type,'noEmpGive');
		var dtTakeFrSt = config.form_search(search_type,'dtTakeFrSt');
		var dtTakeFrEd = config.form_search(search_type,'dtTakeFrEd');
		var noEmpTakeinsp = config.form_search(search_type,'noEmpTakeinsp');
		var dtTakeToSt = config.form_search(search_type,'dtTakeToSt');
		var dtTakeToEd = config.form_search(search_type,'dtTakeToEd');
		var cdRsltTakeinsp = config.form_search(search_type,'cdRsltTakeinsp');
		var ynTakeTo = config.form_search(search_type, 'ynTakeTo');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_acceptance_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([ 
				service.retrieveAcceptanceList(cdCom, idConst, nmConst, noEmpGive, dtTakeFrSt, dtTakeFrEd, noEmpTakeinsp, dtTakeToSt, dtTakeToEd, cdRsltTakeinsp, ynTakeTo,(this.page.page * 100),100)
			]);

			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_acceptance_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_acceptance_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_acceptance_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
    }
    
    fetchDetail() {
			var jupno = config.grpifm.list[config.grpifm.select_no].jupno;
      this.props.history.push('/retrieveAcceptanceDetail/'+jupno);
    }

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급관리";
		$(".header_title").html( "공급관리");
		config.table_name.file = 'retrieveAcceptance';


        config.fetchCommon("점검","결과","cdRsltTakeinsp");			//cdRsltTakeinsp
		config.fetchCommon("ERP","CG_Z_00104","cdCom");			//cdCom

		$(".message").html("검색중입니다.");
		config.fetchERPDong("");
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

			$(".grp_acceptance_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_acceptance_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_acceptance_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_acceptance_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_acceptance_list").scrollTop() >= ($(".grp_acceptance_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_acceptance_list tr");
		$(document).on("click",".grp_acceptance_list tr",function(){
			config.grpifm.scroll = $(".grp_acceptance_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_acceptance_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			config.table.p1="배관";
			config.table.p2="filter=id_const:'"+$(this).find("td:eq(1)").attr("data-id")+"'";
      		config.table.attach1 = '인수검사';
      		config.table.attach2 = config.grpifm.list[config.grpifm.select_no].idConst;
      		config.detail_file.index = $(this).find("td:eq(1)").attr("data-id");
		});
	}
	btnDetail = () =>{
		this.props.history.push("/retrieveAcceptanceVb/"+config.grpifm.list[config.grpifm.select_no].idConst);
	}
	btnSisul = () =>{
		//alert("시설물 조회 페이지?");
		//this.props.history.push("/retrieveAcceptanceInfoForTakeinsp/"+config.grpifm.list[config.grpifm.select_no].idConst);
	}
	btnInfo = () =>{
		this.props.history.push("/retrieveAcceptanceInfoForTakeinsp/"+config.grpifm.list[config.grpifm.select_no].idConst);
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>인수검사</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>공사ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form4">
											<label>공사명</label>
											<input type="text" id="nmConst" />
										</div>
										<div className="form4">
											<label>검사결과</label>
											<select id="cdRsltTakeinsp" name="cdRsltTakeinsp">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>인수여부</label>
											<select id="ynTakeTo" name="ynTakeTo">
												<option value="">전체</option>
												<option value="No">No</option>
												<option value="Yes">Yes</option>
											</select>
										</div>
										<div className="form4">
											<label>인계자</label>
											<input type="text" id="noEmpGive" />
										</div>
										<div className="form4">
											<label>인수검사자</label>
											<input type="text" id="noEmpTakeinsp" />
										</div>
										<div className="form4">
											<label>인계일자</label>
											<DatePicker
												 locale="ko" 
												id="dtTakeFrSt"
												className="datepicker dtTakeFrSt"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyyMMdd"
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
												id="dtTakeFrEd"
												className="datepicker dtTakeFrEd"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form2">
											<label>시공업체</label>
											<select id="cdCom" name="cdCom">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>인수일자</label>
											<DatePicker
												 locale="ko" 
												id="dtTakeToSt"
												className="datepicker dtTakeToSt"
												selected={this.state.startDate2}
												onChange={this.startDateChange2}
												dateFormat="yyyyMMdd"
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
												id="dtTakeToEd"
												className="datepicker dtTakeToEd"
												selected={this.state.endDate2}
												onChange={this.endDateChange2}
												dateFormat="yyyyMMdd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="mw2000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="120"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
										</colgroup>
										<thead>
											<tr>
												<th>인수일</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>시공업체</th>
												<th>착공일자</th>
												<th>준공일자</th>
												<th>인계자</th>
												<th>인계일</th>
												<th>검사자(정)</th>
												<th>검사자(부)</th>
												<th>인수검사일자</th>
												<th>검사결과</th>
												<th>GIS인수일자</th>
												<th>GIS입력일자</th>
												<th>재검사자</th>
												<th>재검일자</th>
												<th>재검결과</th>
												<th>부적합내용</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw2000 grp_acceptance_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="120"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
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
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" onClick={this.btnInfo}><img alt="" src={icon2} width="15" height="15" />검사정보</button>
						{/*<button type="button" onClick={this.btnSisul}><img alt="" src={icon2} width="15" height="15" />시설물정보</button>*/}
						<button type="button" onClick={this.btnDetail}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default withRouter(retrieveAcceptance);