
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';

import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrieveInspPln extends Component {
	constructor(props) {
		super(props);

		if(this.props.match.params.gubun !== undefined && config.back.url[config.back.url.length-1] !== '/retrieveInspPln/'+this.props.match.params.gubun){
			config.back.url.push('/retrieveInspPln/'+this.props.match.params.gubun);
		}else if(config.back.url[config.back.url.length-1] !== '/retrieveInspPln'){
			config.back.url.push('/retrieveInspPln');
		}
		this.plnlink = "/retrieveInspPln/" + this.props.match.params.gubun;
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

		if(config.table_name.file2 !== "retrieveInspPln" || config.table_name.file3 !== this.props.match.params.gubun){
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

		this.link = "/retrievePipe";
		//this.link = "/retrieveGov";
		//this.link = "/retrieveInspRslt";

	}

	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm_insp.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
				td = td + '<td data-kd="'+result[count]['kdFclt']+'" data-sp="'+result[count]['idInsp']+'" data-sptype="'+result[count]['idInspType']+'">'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['gbFragNm']) ? result[count]['gbFragNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdDongNm']) ? result[count]['cdDongNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['yyPln']) ? result[count]['yyPln'] : '')+'</td>';
				td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['gbPipeNm']) ? result[count]['gbPipeNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_insppin_list tbody").html(td);
		}else{
			$(".grp_insppin_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_insppin_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var inspGubun = config.form_search(search_type,'inspGubun');
		var kdFclt = config.form_search(search_type,'kdFclt');
		var gbFrag = config.form_search(search_type,'gbFrag');
		var yyPln = config.form_search(search_type,'yyPln');
		var gbPipe = config.form_search(search_type,'gbPipe');
		//var idPipeRoad = config.form_search(search_type,'idPipeRoad');
		var noSector1Nm = config.form_search(search_type,'noSector1Nm');
		var cdDong = config.form_search(search_type,'cdDong');

		//검색 초기화
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_insppin_list tbody").html("");
			config.grpifm_insp.list=[];
			config.grpifm_insp.select_no = -1;
			config.grpifm_insp.index = "";
			config.grpifm_insp.form = [];
		}

		//if(!inspGubun){
			if(this.props.match.params.gubun === "0" ){
				inspGubun = 10;
			}
			if(this.props.match.params.gubun === "1" ){
				inspGubun = 20;
			}
			if(this.props.match.params.gubun === "2" ){
				inspGubun = 3070;
			}
			if(inspGubun===null){
				inspGubun = 10;
			}
			$("#inspGubun").val(inspGubun);
		//}

		if(!kdFclt){
			//kdFclt = 31;
		}

		try {
			const common = await Promise.all([ 
				service.retrieveInspPlnList(inspGubun,kdFclt,gbFrag,yyPln,gbPipe,noSector1Nm,cdDong,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_insppin_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_insppin_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){

		}
	}
	//상세정보
	/*
	componentDidUpdate(){
		if(parseInt(this.props.match.params.gubun) >= 0 ){
			$("#inspGubun option").prop("selected",false);
			$("#inspGubun option:eq("+parseInt(this.props.match.params.gubun)+")").attr("selected","selected");
			
			$(".grp_insppin_list tbody").html("");
			this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

			this.componentDidMount();
		}
	}
	*/

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

	componentDidUpdate() {
		if(config.table_name.file2 === "retrieveInspPln"){
			var t = this;
			setTimeout(function(){
				var inspGubun;
				if(t.props.match.params.gubun === "0" ){
					inspGubun = 10;
				}
				if(t.props.match.params.gubun === "1" ){
					inspGubun = 20;
				}
				if(t.props.match.params.gubun === "2" ){
					inspGubun = 3070;
				}
				if(inspGubun===null){
					inspGubun = 10;
				}
				$("#inspGubun").val(inspGubun);
				
				config.table_name.file3 = t.props.match.params.gubun;
			},500);
			t.fetchSearch(1);
		}

	}
	
	
	//검사 구분때문에 따로 배정
	fetchCommon = async (feature,type,id,filter) => { 
		if(config.grpifm.form[feature+'_'+type+"_"+filter] !== undefined && config.grpifm.form[feature+'_'+type+"_"+filter].length > 0 ){
			var result = config.grpifm.form[feature+'_'+type+"_"+filter];
			var selected = '';
			for(var count = 0; count < result.length; count++){
				selected = '';
				if(config.grpifm.search[id] === result[count].lcode){
					selected = ' selected';
				}
				$("#"+id).append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
			}
		}else{
			const common = await Promise.all([service.getCommon(feature,type,filter)]);
			var result = common[0].data.result;
			config.grpifm.form[feature+'_'+type+"_"+filter] = result;
			for(var count = 0; count < result.length; count++){
				$("#"+id).append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
			}
		}

		if(this.props.match.params.gubun === "0" ){
			$("#inspGubun option:eq(0)").attr("selected","selected");
		}
		if(this.props.match.params.gubun === "1" ){
			$("#inspGubun option:eq(1)").attr("selected","selected");
		}
		if(this.props.match.params.gubun === "2" ){
			$("#inspGubun option:eq(2)").attr("selected","selected");
		}

	}

	componentDidMount() {
		$(".map").css("display","none");
		$(".footer").css("display","none");
		$(".types tbody").html("");
		$(".types tfoot").html("");
		var d = new Date();
		var n = d.getFullYear();
		var selected='';
		for(var i=n-5; i <= n+5; i++){
			selected='';
			if(i === n){
				selected = ' selected';
			}
			$("#yyPln").append('<option value="'+i+'" '+selected+'>'+i+'</option>');
		}

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");;
		config.table_name.file2 = 'retrieveInspPln';
		config.table_name.file3 = this.props.match.params.gubun;
			
		this.plnlink = "/retrieveInspPln/" + this.props.match.params.gubun;
		
		this.fetchCommon("공급시설검사","검사구분","inspGubun");
		config.fetchCommon("공급시설검사","시설종류","kdFclt");
		config.fetchCommon("ERP","CG_F_00014","gbFrag");
		config.fetchCommon("ERP","CG_F_00037","gbPipe");
		//config.fetchCommon("ERP","CG_F_00082","idPipeRoad");
		config.fetchCommon("ERP","CG_F_00007","noSector1Nm");
		config.fetchCommon("점검","결과","cdRslt");


		//다름 다시 봐야함.
		//this.fetchCommon("배관","관경","status");

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
			this.lists(result,1,0);

			$(".grp_insppin_list tr:eq("+config.grpifm_insp.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_insppin_list").scrollTop( config.grpifm_insp.scroll);
			},500);

			this.page.num = $(".grp_insppin_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_insppin_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_insppin_list").scrollTop() >= ($(".grp_insppin_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_insppin_list tr");
		$(document).on("click",".grp_insppin_list tr",function(){
			config.grpifm_insp.scroll = $(".grp_insppin_list").scrollTop();
			config.grpifm_insp.select_no = $(this).index();
			$(".grp_insppin_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1=$(this).find("td:eq(1)").html();
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");
				
//				alert(t.props.match.params.name);


			config.report.param1=$(this).find("td:eq(1)").attr("data-kd");
			config.report.param2=$(this).find("td:eq(1)").attr("data-sp");
			config.report.param3=$(this).find("td:eq(1)").attr("data-sptype");

			config.table.change1 = $(this).find("td:eq(0)").attr("data-id");
			config.table.change2 = "08";
			//config.grpifm_insp.select_no = $(this).find("td:eq(1)").html();
			config.grpifm_insp.index = $(this).find("td:eq(0)").attr("data-id");
			config.his.back="pln";

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

		$("#gbFrag").prop("disabled",true);
		$("#gbFrag").addClass("readonly");
		$("#gbFrag").val("");
		//시설종류 중점관리 대상일경우
		$(document).on("change","#kdFclt",function(){
			if( $(this).val() === "33" ){
				$("#gbFrag").prop("disabled",false);
				$("#gbFrag").removeClass("readonly");
			}else{
				$("#gbFrag").prop("disabled",true);
				$("#gbFrag").addClass("readonly");
				$("#gbFrag").val("");
			}
		});
	}

	fetchDetail = () => {
		if(config.grpifm_insp.index ===""){
			alert("항목을 선택해주세요");
		}else{
			this.props.history.push('/retrieveInspPlnDetail/'+config.grpifm_insp.list[config.grpifm_insp.select_no].kdFclt+'/'+config.grpifm_insp.list[config.grpifm_insp.select_no].idInsp+'/'+config.grpifm_insp.list[config.grpifm_insp.select_no].idInspType);
		}
	}
	render() { 
		//const { link } = this.link
		/*
		const { params } = this.props.match;
		$( document ).ready(function() {
			if(params.name === "0" ){
				$("#inspGubun option:eq(0)").attr("selected","selected");

			}else if(params.name === "1" ){
				$("#inspGubun option:eq(1)").attr("selected","selected");

			}else if(params.name === "2" ){
				$("#inspGubun option:eq(2)").attr("selected","selected");
			}
		});
		*/
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab2">
						{this.props.match.params.gubun >= 0 ? <Link to={this.plnlink} className="active"><span>검사대상</span></Link> : <Link to="/retrieveInspPln" className="active"><span>검사대상</span></Link>}
						<Link to="/retrieveInspRslt" ><span>검사이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>검사구분</label>
											<select id="inspGubun" className="readonly" disabled>
												
											</select>
										</div>
										<div className="form4">
											<label>시설종류</label>
											<select id="kdFclt" name="kdFclt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설구분</label>
											<select id="gbFrag" name="gbFrag">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>계획년도</label>
											<select id="yyPln" name="yyPln"></select>
										</div>
			
										<div className="form4">
											<label>배관구분</label>
											<select id="gbPipe" name="gbPipe">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>관로순찰구간</label>
											<select id="noSector1Nm" name="noSector1Nm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>법정동</label>
											<select id="cdDong" name="cdDong">
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
											<col width="110"/>
											<col width="80"/>
											<col width="90"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
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
												<th>계획년도</th>
												<th>순찰구간</th>
												<th>배관구분</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_insppin_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="110"/>
											<col width="80"/>
											<col width="90"/>
											<col width="auto"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation(1)}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props,1)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						{this.props.match.params.gubun !== "2" ?
						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />점검등록</button>
						: '' }
						
						<button type="button" className="btn_detail" onClick={this.fetchSisul}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveInspPln;