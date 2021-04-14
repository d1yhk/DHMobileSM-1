
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

class retrieveGovInspRslt extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };


		if(this.props.match.params.facilNo!==undefined && config.back.url[config.back.url.length-1] !== '/retrieveGovInspRslt/'+this.props.match.params.facilNo){
			config.back.url.push('/retrieveGovInspRslt/'+this.props.match.params.facilNo);
		}else if(config.back.url[config.back.url.length-1] !== '/retrieveGovInspRslt'){
			config.back.url.push('/retrieveGovInspRslt');
		}

		if(config.table_name.file !== "retrieveGovInspRslt"){

			config.detail_file.index = "";

			config.grpifm_rslt.select_no=-1;
			config.grpifm_rslt.search=[];
			config.grpifm_rslt.list=[];
			config.grpifm_rslt.form = [];
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
				config.grpifm_rslt.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td data-id="'+result[count]['id']+'" data-insp="'+result[count]['idInsp']+'" data-insptype="'+result[count]['idInspType']+'">'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['inspTypeNm']) ? result[count]['inspTypeNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtLaw']) ? result[count]['dtLaw'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdModelNm']) ? result[count]['cdModelNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['noEmpInspNm']) ? result[count]['noEmpInspNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdRsltNm']) ? result[count]['cdRsltNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_govinsp_list tbody").html(td);
		}else{
			$(".grp_govinsp_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_govinsp_list tbody").html('<tr><td colspan="11">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var inspGubun = config.form_search(search_type,'inspGubun');
		var dtInspFr = config.form_search(search_type,'dtInspFr');
		var dtInspTo = config.form_search(search_type,'dtInspTo');
		var cdRslt = config.form_search(search_type,'cdRslt');
		var inspType = config.form_search(search_type,'inspType');
		var cdFclt = config.form_search(search_type,'cdFclt');
		var nmFclt = config.form_search(search_type,'nmFclt');

		
		if(this.props.match.params.facilNo!==undefined && cdFclt === ""){
			$("#cdFclt").val(this.props.match.params.facilNo)
			cdFclt = this.props.match.params.facilNo
		}
		
		if(inspGubun ==="1042" || inspGubun ==="1075"){
			inspType="";
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
			$(".grp_govinsp_list tbody").html("");
			config.grpifm_rslt.list=[];
			config.grpifm_rslt.select_no = -1;
			config.detail_file.index = "";
			inspGubun = "";
			dtInspFr = "";
			dtInspTo = "";
			cdRslt = "";
			inspType = "";
			cdFclt = "";
			nmFclt = "";
		}
		
		try {
			const common = await Promise.all([ 
				//bjdNm, idInspType, nmFclt, dtLawFr, dtLawTo, dtInspPlnFr, dtInspPlnTo, 
				service.retrieveGovInspRsltList(inspGubun,dtInspFr,dtInspTo,cdRslt,inspType,cdFclt,nmFclt,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_govinsp_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_govinsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_govinsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	fetchDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			var cdFclt = $(".grp_govinsp_list tbody tr:eq("+config.grpifm_rslt.select_no+")").find("td:eq(2)").html();
			var insp = $(".grp_govinsp_list tbody tr:eq("+config.grpifm_rslt.select_no+")").find("td:eq(0)").attr("data-insp");
			var insptype = $(".grp_govinsp_list tbody tr:eq("+config.grpifm_rslt.select_no+")").find("td:eq(0)").attr("data-insptype");
			
			var select = $(".grp_govinsp_list tr:eq("+config.grpifm_rslt.select_no+")");

			if( select.find("td:eq(0)").html() === "주간점검" ){
				this.props.history.push('/retrieveWeeklyInspDetail/'+cdFclt+"/"+insp+"/"+insptype);
			}else if( select.find("td:eq(0)").html() === "분기점검" ){
				if( select.find("td:eq(1)").html() === "MOV작동점검" ){
					this.props.history.push('/retrieveQuarterInspDetail/'+cdFclt+"/"+insp+"/"+insptype);
				}else if( select.find("td:eq(1)").html() === "곡관부두께측정" ){
					this.props.history.push('/retrieveQuarterInspDetail2/'+cdFclt+"/"+insp+"/"+insptype);
				}else if( select.find("td:eq(1)").html() === "압력센서점검" ){
					this.props.history.push('/retrieveQuarterInspDetail3/'+cdFclt+"/"+insp+"/"+insptype);
				}
			}else if( select.find("td:eq(0)").html() === "자율/정기검사" ){
				this.props.history.push('/retrieveAutoPeriodicInspDetail/'+cdFclt+"/"+insp+"/"+insptype);
			}else if( select.find("td:eq(0)").html() === "분해점검" ){
				this.props.history.push('/retrieveDisassemblyInspInfo/'+insp+"/"+insptype);
			}else if( select.find("td:eq(0)").html() === "공급압력조정기점검" ){
				this.props.history.push('/retrieveRegulatorInspInfo/'+insp+"/"+insptype);
			}


		}
	}
	govDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			//alert(config.grpifm_rslt.list[config.grpifm_rslt.select_no].idInspType);
			var select = $(".grp_govinsp_list tr:eq("+config.grpifm_rslt.select_no+")");
			if(config.detail_file.index === 'undefined'){
				if(select.find("td:eq(0)").html() === "공급압력조정기점검" ){	//1075
					this.props.history.push('/retrieveGovernorDetail/'+config.grpifm_rslt.list[config.grpifm_rslt.select_no].cdFclt+"/압력조정기");
				}else{
					alert("아이디 값이 없습니다.")
				}
			}else{
				if( select.find("td:eq(0)").html() === "주간점검" || select.find("td:eq(0)").html() === "분기점검" || select.find("td:eq(0)").html() === "자율/정기검사" || (select.find("td:eq(0)").html() === "분해점검" && select.find("td:eq(1)").html() === "정압기분해점검") ){
					//parameter name : cdFcltBld, parameter value : ROW의 result.cdFclt)
					//링크 확인 체크 해야함.
					this.props.history.push('/retrieveGovDetail/'+config.detail_file.index);
				}
				
				if( select.find("td:eq(0)").html() === "공급압력조정기점검" || (select.find("td:eq(0)").html() === "분해점검" && select.find("td:eq(1)").html() === "공급압력조정기") ){
					if(select.find("td:eq(0)").html() === "공급압력조정기점검" ){	//1075
						this.props.history.push('/retrieveGovernorDetail/'+config.grpifm_rslt.list[config.grpifm_rslt.select_no].cdFclt+"/압력조정기");
					}else{
						this.props.history.push('/retrieveGovernorDetail/'+config.detail_file.index);
					}
				}
			}
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");
		config.table_name.file = "retrieveGovInspRslt"

		config.fetchCommon("정압기","점검구분","inspGubun");
		config.fetchCommon("점검","결과","cdRslt");
		config.fetchCommon("정압기","점검유형","inspType");



		if(config.grpifm_rslt.list.length > 0 ){
			let result = config.grpifm_rslt.list;
			this.page.total = (result.length);
			this.lists(result,1,0);

			$(".grp_govinsp_list tr:eq("+config.grpifm_rslt.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_govinsp_list").scrollTop( config.grpifm_rslt.scroll);
			},500);

			this.page.num = $(".grp_govinsp_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_govinsp_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_govinsp_list").scrollTop() >= ($(".grp_govinsp_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_govinsp_list tr");
		$(document).on("click",".grp_govinsp_list tr",function(){
			config.grpifm_rslt.scroll = $(".grp_govinsp_list").scrollTop();
			config.grpifm_rslt.select_no = $(this).index();
			$(".grp_govinsp_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1=$(this).find("td:eq(0)").html();
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");

			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
		});
		
		
		if(this.props.match.params.facilNo!==undefined){
			$("#cdFclt").val(this.props.match.params.facilNo)
		}
	}
	inspGubunChange = () => {
		if( $("#inspGubun").val() === "1042" || $("#inspGubun").val() === "1075"){
			$("#inspType").prop("disabled",true);
			$("#inspType").addClass("readonly");

		}else{
			$("#inspType").prop("disabled",false);
			$("#inspType").removeClass("readonly");
		}
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab6">
						<Link to="/retrieveWeeklyInsp"><span>주간점검</span></Link>
						<Link to="/retrieveQuarterInsp"><span>분기점검</span></Link>
						<Link to="/retrieveAutoPeriodicInsp"><span>자율/정기검사</span></Link>
						<Link to="/retrieveDisassemblyInsp"><span>분해점검</span></Link>
						<Link to="/retrieveRegulatorInsp"><span>공급압력조정기 점검</span></Link>
						<Link to="/retrieveGovInspRslt" className="active"><span>점검이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>점검구분</label>
											<select id="inspGubun" onChange={this.inspGubunChange}>
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>점검일자</label>
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
											<label>점검결과</label>
											<select id="cdRslt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>점검유형</label>
											<select id="inspType">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설코드</label>
											<input type="text" id="cdFclt" />
										</div>
										<div className="form2">
											<label>시설명</label>
											<input type="text" id="nmFclt" />
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
											<col width="80"/>
											<col width="120"/>
											<col width="200"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>점검구분</th>
												<th>점검유형</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>완성검사일</th>
												<th>정압기 모델</th>
												<th>점검일자</th>
												<th>점검자</th>
												<th>점검결과</th>
												<th>점검메모</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_govinsp_list">
									<table>
										<colgroup>
											<col width="120"/>
											<col width="80"/>
											<col width="120"/>
											<col width="200"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
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

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />점검조회</button>
						<button type="button" className="btn_detail" onClick={this.govDetail}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>



					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveGovInspRslt;