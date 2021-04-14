
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import $ from "jquery";
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);


class retrieveInspRslt extends Component {
	constructor(props) {
		super(props);
		var nowDate = new Date();
		var weekDate= new Date(Date.parse(nowDate) - 7 * 1000 * 60 * 60 * 24); 

		if(config.table_name.file3 >= 0 ){
			this.plnlink = "/retrieveInspPln/"+config.table_name.file3;
		}else{
			this.plnlink = "/retrieveInspPln/0";
		}

		if(this.props.match.params.type!==undefined && this.props.match.params.type1 !== undefined && config.back.url[config.back.url.length-1] !== '/retrieveInspRslt/'+this.props.match.params.type+"/"+this.props.match.params.type1+"/"+this.props.match.params.type2){
			config.back.url.push('/retrieveInspRslt/'+this.props.match.params.type+"/"+this.props.match.params.type1+"/"+this.props.match.params.type2);
		}else if(this.props.match.params.type!==undefined && this.props.match.params.type1 !== undefined && config.back.url[config.back.url.length-1] !== '/retrieveInspRslt/'+this.props.match.params.type+"/"+this.props.match.params.type1){
			config.back.url.push('/retrieveInspRslt/'+this.props.match.params.type+"/"+this.props.match.params.type1);
		}else if(config.back.url[config.back.url.length-1] !== '/retrieveInspRslt'){
			config.back.url.push('/retrieveInspRslt');
		}

		if(config.table_name.file2 !== "retrieveInspRslt"){
			config.grpifm_insp.index = "";

			config.grpifm_insp.select_no=-1;
			config.grpifm_insp.search=[];
			config.grpifm_insp.list=[];
			config.grpifm_insp.form = [];
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
			param3:config.table.param3,
			startDate: weekDate,
			endDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
	
	}
	startDateChange(date) {
		this.setState({
			startDate: date
		});
	//	if(date.getTime() > this.state.endDate.getTime()){
	//		this.endDateChange(date);
	//	}
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}

	//공통함수
	/*
	fetchCommon = async (feature,type,id) => { 
		
		const common = await Promise.all([service.getCommon(feature,type)]);
		var result = common[0].data.result;

		var selected='';
		for(var count = 0; count < result.length; count++){
			selected='';
			if(result[count].lvalue === config.table.name){
				selected = ' selected';
			}
			if(result[count].lcode === config.table.param2){
				selected = ' selected';
			}
			if(result[count].lcode === config.table.param3){
				selected = ' selected';
			}
			$("#"+id).append($("<option value=\""+result[count].lcode+"\""+selected+">"+result[count].lvalue+"</option>"));
		}


		if(id==="kdFclt"){
			//$("#kdFclt option:eq("+this.props.match.params.type+")").attr("selected","selected");
			$("#kdFclt option:eq("+config.table.param3+")").attr("selected","selected");
		}
		if(id==="gbFrag"){
			$("#gbFrag option:eq("+config.table.param2+")").attr("selected","selected");
		}
	}
	*/


	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm_insp.list.push(result[count]);
			}
			
			td = td + '<tr>';
					td = td + '<td data-id="'+result[count]['id']+'" data-type="'+result[count]['idInspType']+'">'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
					td = td + '<td data-kd="'+result[count]['kdFclt']+'" data-sp="'+result[count]['idInsp']+'" data-sptype="'+result[count]['idInspType']+'">'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['gbFragNm']) ? result[count]['gbFragNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
					td = td + '<td class="text-left">'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
					td = td + '<td>'+((result[count]['cdDongNm']) ? result[count]['cdDongNm'] : '')+'</td>';
					//td = td + '<td>'+((result[count]['idPipeRoadNm']) ? result[count]['idPipeRoadNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['gbPipeNm']) ? result[count]['gbPipeNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
					td = td + '<td>'+((result[count]['noEmpInspNm']) ? result[count]['noEmpInspNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['cdRsltNm']) ? result[count]['cdRsltNm'] : '')+'</td>';
			td = td + '</tr>';
		}	
		if(search_type === 1){			
			$(".grp_insprslt_list tbody").html(td);
		}else{
			$(".grp_insprslt_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_insprslt_list tbody").html('<tr><td colspan="11">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		//service.smValveDetail(610);

		var inspGubun = config.form_search(search_type,'inspGubun_rslt');
		var kdFclt = config.form_search(search_type,'kdFclt_rslt');
		var gbFrag = config.form_search(search_type,'gbFrag_rslt');
		var gbPipe = config.form_search(search_type,'gbPipe_rslt');
		//var idPipeRoad = config.form_search(search_type,'idPipeRoad_rslt');
		var noSector1Nm = config.form_search(search_type,'noSector1Nm');
		var cdDong = config.form_search(search_type,'cdDong_rslt');
		var dtInspFr = config.form_search(search_type,'dtInspFr_rslt');
		var dtInspTo = config.form_search(search_type,'dtInspTo_rslt');
		var cdRslt = config.form_search(search_type,'cdRslt_rslt');
		var cdFclt = config.form_search(search_type,'cdFclt_rslt');



		//검색 초기화
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_insprslt_list tbody").html("");
			config.grpifm_insp.list=[];
			config.grpifm_insp.select_no = -1;
			config.grpifm_insp.index = "";
		}
		/*
		if(!kdFclt && this.props.match.params.type >= 0 ){
			kdFclt  = this.props.match.params.type;
		}
		*/
		/*
		if(!kdFclt && config.table.param3 !== ''){
			kdFclt  = config.table.param3;
		}
		if(!gbFrag && config.table.param2 !== '' ){
			gbFrag  = config.table.param2;
		}
		*/

		try {
			const common = await Promise.all([ 
				service.retrieveInspRsltList(inspGubun,kdFclt,gbFrag,gbPipe,noSector1Nm,cdDong,dtInspFr,dtInspTo,cdRslt,cdFclt,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				//console.log(result);

				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_insprslt_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_insprslt_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_insprslt_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	onDateChange = date => { 
		this.setState({
			date:date
			//date: moment(date).format("YYYY-MM-DD")
		})
	}

	componentDidUpdate() {
/*
		if(this.props.match.params.type !== undefined){
			$("#gbFrag").val(this.props.match.params.type)
		}

		if(this.props.match.params.type1 !== undefined){
			$("#cdFclt").val(this.props.match.params.type1)
		}
*/
	}

	componentDidMount() {
		if(config.table_name.file3 >= 0 ){
			this.plnlink = "/retrieveInspPln/"+config.table_name.file3;
		}else{
			this.plnlink = "/retrieveInspPln/0";
		}

		$(".map").css("display","none");
		$(".footer").css("display","none");
		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");
		config.table_name.file2 = 'retrieveInspRslt';

		config.table.param1="검사이력";

		$(".message").html("검색중입니다.");

		config.fetchCommon("공급시설검사","검사구분","inspGubun_rslt");
		config.fetchCommon("공급시설검사","시설종류","kdFclt_rslt");
		config.fetchCommon("ERP","CG_F_00014","gbFrag_rslt");
		config.fetchCommon("ERP","CG_F_00037","gbPipe_rslt");
		//config.fetchCommon("ERP","CG_F_00082","idPipeRoad_rslt");
		config.fetchCommon("ERP","CG_F_00007","noSector1Nm");
		config.fetchCommon("점검","결과","cdRslt_rslt");

		var t = this;

		config.fetchERPDong("");
		if(config.grpifm_insp.list.length > 0 ){			
			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
				}
			});
			let result = config.grpifm_insp.list;
			this.page.total = (result.length);
			this.lists(result,1,1);
			$(".grp_insprslt_list tr:eq("+config.grpifm_insp.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_insprslt_list").scrollTop( config.grpifm_insp.scroll);
			},500);

			this.page.num = $(".grp_insprslt_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}



		$(".grp_insprslt_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_insprslt_list").scrollTop() >= ($(".grp_insprslt_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_insprslt_list tr");
		$(document).on("click",".grp_insprslt_list tr",function(){
			config.grpifm_insp.scroll = $(".grp_insprslt_list").scrollTop();
			config.grpifm_insp.select_no = $(this).index();
			$(".grp_insprslt_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1=$(this).find("td:eq(1)").html();
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");

			//alert(config.table.p1 +"/"+ config.table.p2);



			config.table.param1=$(this).find("td:eq(1)").attr("data-kd");
			config.table.param2=$(this).find("td:eq(1)").attr("data-sp");
			config.table.param3=$(this).find("td:eq(1)").attr("data-sptype");

			config.table.change1 = $(this).find("td:eq(0)").attr("data-id");
			config.table.change2 = "08";
			
			//config.grpifm_insp.select_no = $(this).find("td:eq(1)").html();
			//config.grpifm_insp.index = $(this).find("td:eq(3)").html();
			config.grpifm_insp.index = $(this).find("td:eq(0)").attr("data-id");
			config.his.back="rslt";

			// 중점관리대상일경우 ID값 또는 시설코드를 대입
			if($(this).find("td:eq(1)").attr("data-kd") == "33"){
				if($(this).find("td:eq(0)").attr("data-id") == "undefined"){
					config.grpifm_insp.index = $(this).find("td:eq(3)").html();
					config.detail_file.param = "facilNo";
				} else {
					config.grpifm_insp.index = $(this).find("td:eq(0)").attr("data-id");
					config.detail_file.param = "id";
				}

				if($(this).find("td:eq(2)").html() === "수취기"){
					config.table.param2 = '5';
					config.table.p1="수취기";
				}
			}
		});
		setTimeout(function(){

			if(t.props.match.params.type !== undefined){
				$("#kdFclt_rslt option:eq("+t.props.match.params.type+")").prop("selected", true);
				if( t.props.match.params.type == "3" ){
					$("#gbFrag_rslt").removeClass("readonly");
					$("#gbFrag_rslt").prop("disabled",false);
				}
			}

			if(t.props.match.params.type2 !== undefined){
				$("#gbFrag_rslt").val(t.props.match.params.type2)
			}

			if(t.props.match.params.type1 !== undefined){
				$("#cdFclt_rslt").val(t.props.match.params.type1)
			}

		},500);

/*
		if(parseInt(this.props.match.params.type) !== 2 ){
			$("#gbFrag_rslt").prop("disabled",true);
			$("#gbFrag_rslt").addClass("readonly");
			$("#gbFrag_rslt").val("");
		}

		
		//시설종류 중점관리 대상일경우

		$(document).off("change","#kdFclt_rslt");
		$(document).on("change","#kdFclt_rslt",function(){
			if( $(this).val() === "33" ){
				$("#gbFrag_rslt").prop("disabled",false);
				$("#gbFrag_rslt").removeClass("readonly");
			}else{
				$("#gbFrag_rslt").prop("disabled",true);
				$("#gbFrag_rslt").addClass("readonly");
				$("#gbFrag_rslt").val("");
			}
		});

		if(parseInt(this.props.match.params.type1) >= 0 ){
			$("#gbFrag option:eq("+this.props.match.params.type1+")").prop("selected","selected");
		}
*/
		//$("#cdFclt").val(config.table.param3);
	}
	
	//시설물로 이동
	fetchSisul = () => {
		if(config.grpifm_insp.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			if(config.grpifm_insp.index != "undefined" ){
				if( config.grpifm_insp.list[config.grpifm_insp.select_no].kdFcltNm === "밸브"){
					this.props.history.push('/retrieveValveDetail/'+config.grpifm_insp.index);
				}else if( config.grpifm_insp.list[config.grpifm_insp.select_no].kdFcltNm === "전기방식"){
					this.props.history.push('/retrieveTbDetail/'+config.grpifm_insp.index);
				}else if( config.grpifm_insp.list[config.grpifm_insp.select_no].kdFcltNm === "중점관리대상"){
					if(config.grpifm_insp.list[config.grpifm_insp.select_no].id === undefined && config.grpifm_insp.list[config.grpifm_insp.select_no].cdFclt.length != 7){
						alert("아이디 값 또는 시설코드를 확인해주세요.");
					} else {
						if(config.grpifm_insp.list[config.grpifm_insp.select_no].id === undefined){
							this.props.history.push('/retrieveSpecialDetail/'+config.grpifm_insp.list[config.grpifm_insp.select_no].cdFclt);
						} else {
							this.props.history.push('/retrieveSpecialDetail/'+config.grpifm_insp.list[config.grpifm_insp.select_no].id);
						}
					}
				}
			}else{
				alert("아이디 값 또는 시설코드를 확인해주세요.");
			}
		}
	}
	onParam3 = (e) => {
		this.setState({
		  param3: e.target.value
		});
	}
	kdFclt_rslt = () => {
		$("#gbFrag_rslt").addClass("readonly");
		$("#gbFrag_rslt").prop("disabled",true);

		if( $("#kdFclt_rslt").val() == "33" ){
			$("#gbFrag_rslt").removeClass("readonly");
			$("#gbFrag_rslt").prop("disabled",false);
		}
	}
	fetchDetail = () => {
		this.props.history.push('/retrieveInspPlnDetail/'+config.grpifm_insp.list[config.grpifm_insp.select_no].kdFclt+'/'+config.grpifm_insp.list[config.grpifm_insp.select_no].idInsp+'/'+config.grpifm_insp.list[config.grpifm_insp.select_no].idInspType);
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab2">
						<Link to={this.plnlink}><span>검사대상</span></Link>
						<Link to="/retrieveInspRslt" className="active"><span>검사이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<legend>검색</legend>
									<div className="form-contoll">
										<div className="form4">
											<label>검사구분</label>
											<select id="inspGubun_rslt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설종류</label>
											<select id="kdFclt_rslt" onChange={this.kdFclt_rslt}>
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설구분</label>
											<select id="gbFrag_rslt" className="readonly" disabled>
												<option value="">선택</option>
											</select>
										</div>
										<div className="form4">
											<label>배관구분</label>
											<select id="gbPipe_rslt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>관로순찰구간</label>
											<select id="noSector1Nm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>법정동</label>
											<select id="cdDong_rslt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>점검일자</label>
												<DatePicker
													 locale="ko" 
													id="dtInspFr_rslt"
													className="datepicker"
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
													id="dtInspTo_rslt"
													className="datepicker"
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
										{/*
										<div className="form3 small-datepicker">
											<label>점검일자</label>
											<div className="date-box">
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
											<span>~</span>
											<div className="date-box">
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
										</div>
										*/}
										<div className="form4">
											<label>점검결과</label>
											<select id="cdRslt_rslt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설코드</label>
											<input type="text" id="cdFclt_rslt" />
										</div>


									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="*"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="100"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>검사구분</th>
												<th>시설종류</th>
												<th>시설구분</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>법정동</th>
												<th>순찰구간</th>
												<th>배관구분</th>
												<th>점검일자</th>
												<th>점검자</th>
												<th>점검결과</th>
											</tr>
										</thead>

									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_insprslt_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="*"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="100"/>
											<col width="80"/>
										</colgroup>
										<tbody>
											<tr>
											</tr>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation(1)}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props,1)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />검사정보</button>
						<button type="button" className="btn_detail" onClick={this.fetchSisul}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>
					</div>
				</footer>

			</div>
		);
	}
}

export default retrieveInspRslt;
