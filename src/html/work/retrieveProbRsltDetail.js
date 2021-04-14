/*global jMap*/
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import footer_regist from '../../image/footer_regist.png';

import btn_save from '../../image/btn-save.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveProbRsltDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveProbRsltDetail/'+this.props.match.params.idConst+'/'+this.props.match.params.yyPln){
			config.back.url.push('/retrieveProbRsltDetail/'+this.props.match.params.idConst+'/'+this.props.match.params.yyPln);
		}
		if(config.table_name.file !== "retrieveProb"){
			config.grpifm_rprd.idx = -1;
		}
		this.state = {
				startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.info = [];
		this.vb_list = [];
		this.tb_list = [];
		this.idx = -1;
		this.vb_idx = -1;
		this.tb_idx = -1;

		this.feature = '';
		this.p1 = '배관';
		this.p2 = "filter=ID_CONST:'"+this.props.match.params.idConst+"'";
  }
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}
	//상세정보
	fetchDetail = async () => { 
		const common = await Promise.all([ 
			service.retrieveProbRsltDetail(this.props.match.params.idConst,this.props.match.params.yyPln)
		]);
		var result = common[0].data.probRsltList;
		this.info = result;

		if(result.dtProb !== undefined){
			this.setState({startDate : new Date(result.dtProb)})
		}

		//console.log(this.info);
		$(".propList tbody").html("");
		for(var count = 0; count < result.length; count++){
			var td = '<tr>';
			td = td + '<td>'+((result[count]['seqProb']) ? result[count]['seqProb'] : '')+'</td>'
			td = td + '<td>'+((result[count]['gbProbNm']) ? result[count]['gbProbNm'] : '')+'</td>'
			td = td + '<td>'+((result[count]['dtProb']) ? result[count]['dtProb'] : '')+'</td>'
			td = td + '<td>'+((result[count]['plcProbFr']) ? result[count]['plcProbFr'] : '')+'</td>'
			td = td + '<td>'+((result[count]['plcProbTo']) ? result[count]['plcProbTo'] : '')+'</td>'
			td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmEmp']) ? result[count]['nmEmp'] : '')+'</td>'
			td = td + '</tr>';
			$(".propList tbody").append(td);
		}
		this.tb_list = common[0].data.tbList;
		$("#prob1_list tbody").html("");
		for(var count = 0; count < this.tb_list.length; count++){
			var td = '<tr>';
			td = td + '<td>'+((this.tb_list[count]['noTb']) ? this.tb_list[count]['noTb'] : '')+'</td>'
			td = td + '<td>'+((this.tb_list[count]['nmTb']) ? this.tb_list[count]['nmTb'] : '')+'</td>'
			td = td + '<td>'+((this.tb_list[count]['nmDia']) ? this.tb_list[count]['nmDia'] : '')+'</td>'
			td = td + '</tr>';
			$("#prob1_list tbody").append(td);
		}
		this.vb_list = common[0].data.vbList;
		$("#prob2_list tbody").html("");
		for(var count = 0; count < this.vb_list.length; count++){
			var td = '<tr>';
			td = td + '<td>'+((this.vb_list[count]['noVb']) ? this.vb_list[count]['noVb'] : '')+'</td>'
			td = td + '<td>'+((this.vb_list[count]['nmVb']) ? this.vb_list[count]['nmVb'] : '')+'</td>'
			td = td + '<td>'+((this.vb_list[count]['nmDia']) ? this.vb_list[count]['nmDia'] : '')+'</td>'
			td = td + '</tr>';
			$("#prob2_list tbody").append(td);
		}
		var t = this;
		if(config.grpifm_rprd.idx >= 0 ){
			t.idx = config.grpifm_rprd.idx;
			$(".propList tbody tr:eq("+t.idx+")").css({"background-color":"#eee"});

			$(".yyPln").html(t.info[t.idx].yyPln);
			$(".idConst").html(t.info[t.idx].idConst);
			$(".yyConst").html(t.info[t.idx].yyConst);
			$(".qtyLen").html(t.info[t.idx].qtyLen);
			$(".nmConst").html(t.info[t.idx].nmConst);
			$(".gbProb").val(t.info[t.idx].gbProb);
			$(".dtProb").val(t.info[t.idx].dtProb);
			$(".nmEmp").val(t.info[t.idx].nmEmp);
			$(".qtyLen").val(t.info[t.idx].qtyLen);
			$(".plcProbFr").val(t.info[t.idx].plcProbFr);
			$(".plcProbTo").val(t.info[t.idx].plcProbTo);
			$(".cntDcvg").val(t.info[t.idx].cntDcvg);
			$(".lenDcvg").val(t.info[t.idx].lenDcvg);
			$(".cntCips").val(t.info[t.idx].cntCips);
			$(".qtyResi").val(t.info[t.idx].qtyResi);
			$(".plcResi").val(t.info[t.idx].plcResi);
			
			t.inputReset();
			
			$("#gbProbNm").addClass("readonly");
			$("#gbProbNm").prop("disabled",true);
			if(t.info[t.idx].gbProb === "1"){
				$(".lenDcvg").removeClass("readonly");
				$(".lenDcvg").prop("readonly" ,false);
				t.retrieveProbRsltDcvgList();
			
			}else if(t.info[t.idx].gbProb === "2"){
				$(".cntCips").removeClass("readonly");
				$(".cntCips").prop("readonly" ,false);

			}else if(t.info[t.idx].gbProb === "3"){
				$(".qtyResi").removeClass("readonly");
				$(".qtyResi").prop("readonly" ,false);
				$(".plcResi").removeClass("readonly");
				$(".plcResi").prop("readonly" ,false);
			}

		}
		config.setWindowHeight();


	}

	
	btnRemove = async () => {
		if(this.idx >= 0 ){
			if(window.confirm("피복탐측 결과 정보를 삭제하시겠습니까?")){
				const save = await Promise.all([ 
					service.deleteProbRslt(this.props.match.params.yyPln, this.props.match.params.idConst, this.info[this.idx].seqProb)
				]);
				
				if(this.info[this.idx].id !== ''){
					jMap.cancelFeature('피복손상부', this.info[this.idx].id, function (result) {
						//console.log("fnCancelFeature", result);
						if (result) {
							if (result.msg) {
								//ifm.com.alert({title:'',content:result.msg});
							}
						}
					})
				}

				this.fetchDetail();
				this.inputReset();
				$(".nmEmp").val("");
				$(".qtyLen").val("");
				$(".plcProbFr").val("");
				$(".plcProbTo").val("");
				$(".cntDcvg").val("");
				$(".lenDcvg").val("");
				$(".cntCips").val("");
				$(".qtyResi").val("");
				$(".plcResi").val("");
				alert(save[0].data.message);
			}
		}else{
			alert("삭제할 항목을 선택해주세요");
		}
	}

	btnSave = async () => {
		//보수 정보 저장
		var idConst = this.props.match.params.idConst;
		var yyPln = this.props.match.params.yyPln;
		var seqProb;
		if(this.idx >= 0){
			seqProb = this.info[this.idx].seqProb
		}
		var gbProb = $(".gbProb").val();
		var dtProb = $(".dtProb").val();
		var nmEmp = $(".nmEmp").val();
		var qtyLen = $(".qtyLen").val();
		var plcProbFr = $(".plcProbFr").val();
		var plcProbTo = $(".plcProbTo").val();
		var cntDcvg = $(".cntDcvg").val();
		var lenDcvg = $(".lenDcvg").val();
		var cntCips = $(".cntCips").val();
		var qtyResi = $(".qtyResi").val();
		var plcResi = $(".plcResi").val();

		const save = await Promise.all([ 
			service.saveProbRslt(idConst,yyPln,seqProb,gbProb,dtProb,nmEmp,qtyLen,plcProbFr,plcProbTo,cntDcvg,lenDcvg,cntCips,qtyResi,plcResi)
		]);
		this.fetchDetail();
		this.inputReset();
		$(".nmEmp").val("");
		$(".qtyLen").val("");
		$(".plcProbFr").val("");
		$(".plcProbTo").val("");
		$(".cntDcvg").val("");
		$(".lenDcvg").val("");
		$(".cntCips").val("");
		$(".qtyResi").val("");
		$(".plcResi").val("");
		alert(save[0].data.message);

	
	}
	btnNew = async () => {
		$(".propList tr").css({"background-color":"transparent"});
		this.idx =-1;
		
		this.inputReset();
		$("#gbProbNm").removeClass("readonly");
		$("#gbProbNm").prop("disabled",false);

		$(".gbProb").val("");
		this.state.startDate = new Date();
		this.startDateChange(this.state.startDate);
		$(".nmEmp").val("");
		$(".qtyLen").val("");
		$(".plcProbFr").val("");
		$(".plcProbTo").val("");
		$(".cntDcvg").val("");
		$(".lenDcvg").val("");
		$(".cntCips").val("");
		$(".qtyResi").val("");
		$(".plcResi").val("");
	}
	retrieveProbRsltDcvgList = async () => {
		$(".dcvg_list tbody").html('<tr><td colSpan="8">검색된 내용이 없습니다.</td></tr>');
		var cntDcvg = this.info[this.idx].cntDcvg;
		var dtProb = this.info[this.idx].dtProb;
		var seqProb = this.info[this.idx].seqProb;
		const common = await Promise.all([ 
			service.retrieveProbRsltDcvgList(cntDcvg,dtProb,seqProb,this.props.match.params.idConst,this.props.match.params.yyPln)
		]);
		
		if(common[0].data.code === "1"){
			var result = common[0].data.dcvgList;

		console.log(result);
			$(".dcvg_list tbody").html("");
			for(var count = 0; count < result.length; count++){
				var option='';
				for(var i = 0; i < this.feature.length; i++){
					var selected='';
					if(this.feature[i].lcode === result[count]['result']) {
						selected = ' selected';
					}
					option += "<option value=\""+this.feature[i].lcode+"\""+selected+">"+this.feature[i].lvalue+"</option>"
				}

				var td = '<tr>';
				td = td + '<td data-seqProb="'+((result[count]['seqProb']) ? result[count]['seqProb'] : '')+'">'+(count+1)+'</td>';
				td = td + '<td>'+((result[count]['dcvgCd']) ? result[count]['dcvgCd'] : '')+'</td>';
				td = td + '<td><input type="text" value="'+((result[count]['loc']) ? result[count]['loc'] : '')+'"/></td>';
				td = td + '<td><input type="text" value="'+((result[count]['dia']) ? result[count]['dia'] : '')+'"/></td>';
				td = td + '<td><input type="text" value="'+((result[count]['damageLen']) ? result[count]['damageLen'] : '')+'"/></td>';
				td = td + '<td><input type="text" value="'+((result[count]['repairLen']) ? result[count]['repairLen'] : '')+'"/></td>';
				td = td + '<td><select><option value="">선택</option>'+option+'</select></td>';
				td = td + '<td>'+((result[count]['id']) ? result[count]['id'] : '<button type="button" class="area_id_btn" >위치등록</button>')+'</td>';
				td = td + '</tr>';
				$(".dcvg_list tbody").append(td);

			}
		}
	}
	dcvgSave = async () => {
		if(this.idx >= 0 ){
			var yyPln = this.props.match.params.yyPln;
			var idConst = this.props.match.params.idConst;
			var seqProb = this.info[this.idx].seqProb;
			var dtProb = this.info[this.idx].dtProb;
			var dcvgList = [];
			var t = this;
			$(".dcvg_list tbody tr").each(function(){
				var seqProb2 = t.info[t.idx].seqProb;
				var dcvgCd = $(this).find("td:eq(1)").html(); 
				var loc = $(this).find("input:eq(0)").val();
				var dia = $(this).find("input:eq(1)").val();
				var damageLen = $(this).find("input:eq(2)").val();
				var repairLen = $(this).find("input:eq(3)").val();
				var result = $(this).find("select:eq(0)").val();
				dcvgList.push({seqProb:seqProb2,dcvgCd:dcvgCd,loc:loc,dia:dia,damageLen:damageLen,repairLen:repairLen,result:result});
			});
			console.log(dcvgList);

			const save = await Promise.all([ 
				service.saveProbRsltDcvg(yyPln, idConst, seqProb, dtProb, dcvgList)
			]);
			alert(save[0].data.message);
		}else{
			alert("피복탐측결과 정보리스트 항목을 선택해주세요")
		}
	}
	dcvgReport = () => {
		//보수이력 페이지 이동.
		//this.props.history.push("/retrieveProbRsltDetail/"+config.grpifm.list[config.grpifm.select_no].idConst+"/"+config.grpifm.list[config.grpifm.select_no].yyPln);
	}
	dcvgArea = () => {
		if(this.p1!==""){
			//alert(this.p1+"/"+this.p2);
			jMap.map(this.p1, this.p2, function(result) {
				if (result) {
					if(result.state==="success"){
						jMap.drawFeature('천공칩');
						//jMap.drawFeature('배관');
					}
					if (result.msg) {
						alert(result.msg);
					};
				};
			});
			this.props.history.push('/Map');
		}
	}
	featureList = async () => {
		const common = await Promise.all([service.getCommon("피복손상부","탐측결과")]);
		var result = common[0].data.result;
		this.feature = common[0].data.result;

	}

	componentDidMount() {

		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");
		
		this.featureList();
		config.fetchCommon("탐측결과","탐측구분","gbProbNm");
		//config.fetchCommon("피복손상부","탐측구분","status");

		this.fetchDetail();
		var t = this;

		$(document).off("click",".area_id_btn");
		$(document).on("click",".area_id_btn",function(){
			t.dcvgArea();
			//alert(0);
		});

		//테이블 리스트 선택
		$(document).off("click",".propList tbody tr");
		$(document).on("click",".propList tbody tr",function(){
			$(".propList tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.idx = $(this).index();
			config.grpifm_rprd.idx = t.idx;

			$(".yyPln").html(t.info[t.idx].yyPln);
			$(".idConst").html(t.info[t.idx].idConst);
			$(".yyConst").html(t.info[t.idx].yyConst);
			$(".qtyLen").html(t.info[t.idx].qtyLen);
			$(".nmConst").html(t.info[t.idx].nmConst);
			$(".gbProb").val(t.info[t.idx].gbProb);
			$(".dtProb").val(t.info[t.idx].dtProb);
			$(".nmEmp").val(t.info[t.idx].nmEmp);
			$(".qtyLen").val(t.info[t.idx].qtyLen);
			$(".plcProbFr").val(t.info[t.idx].plcProbFr);
			$(".plcProbTo").val(t.info[t.idx].plcProbTo);
			$(".cntDcvg").val(t.info[t.idx].cntDcvg);
			$(".lenDcvg").val(t.info[t.idx].lenDcvg);
			$(".cntCips").val(t.info[t.idx].cntCips);
			$(".qtyResi").val(t.info[t.idx].qtyResi);
			$(".plcResi").val(t.info[t.idx].plcResi);
			
			t.inputReset();
			
			$("#gbProbNm").addClass("readonly");
			$("#gbProbNm").prop("disabled",true);
			if(t.info[t.idx].gbProb === "1"){
				$(".lenDcvg").removeClass("readonly");
				$(".lenDcvg").prop("readonly" ,false);
				t.retrieveProbRsltDcvgList();
			
			}else if(t.info[t.idx].gbProb === "2"){
				$(".cntCips").removeClass("readonly");
				$(".cntCips").prop("readonly" ,false);

			}else if(t.info[t.idx].gbProb === "3"){
				$(".qtyResi").removeClass("readonly");
				$(".qtyResi").prop("readonly" ,false);
				$(".plcResi").removeClass("readonly");
				$(".plcResi").prop("readonly" ,false);
			}
		});
		//tb,vb선택
		/*
		$(document).off("click","#prob1_list tr");
		$(document).on("click","#prob1_list tr",function(){
			$("#prob1_list tr").css({"background-color":"transparent"});
			$("#prob2_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.tb_idx = $(this).index();
		});
		$(document).off("click","#prob2_list tr");
		$(document).on("click","#prob2_list tr",function(){
			$("#prob1_list tr").css({"background-color":"transparent"});
			$("#prob2_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.vb_idx = $(this).index();
		});
		*/
	}
	//탐측구분 선택
	gbProbNm=()=>{
		this.inputReset();

		if($("#gbProbNm").val() === "1"){
			$(".cntDcvg").removeClass("readonly");
			$(".cntDcvg").prop("readonly" ,false);
			$(".lenDcvg").removeClass("readonly");
			$(".lenDcvg").prop("readonly" ,false);
		
		}else if($("#gbProbNm").val() === "2"){
			$(".cntCips").removeClass("readonly");
			$(".cntCips").prop("readonly" ,false);

		}else if($("#gbProbNm").val() === "3"){
			$(".qtyResi").removeClass("readonly");
			$(".qtyResi").prop("readonly" ,false);
			$(".plcResi").removeClass("readonly");
			$(".plcResi").prop("readonly" ,false);
		}
	}
	//tb,vb
	btnChange=(type)=>{
		$(".tvbtn button").removeClass("active");
		$(".tvbtn button:eq("+type+")").addClass("active");
		$("#prob1_list").css("display","none");
		$("#prob2_list").css("display","none");
		$("#prob"+(type+1)+"_list").css("display","table");
	}
	inputReset=()=>{
		$(".cntDcvg").addClass("readonly");
		$(".cntDcvg").prop("readonly" ,true);
		$(".lenDcvg").addClass("readonly");
		$(".lenDcvg").prop("readonly" ,true);
		$(".cntCips").addClass("readonly");
		$(".cntCips").prop("readonly" ,true);
		$(".qtyResi").addClass("readonly");
		$(".qtyResi").prop("readonly" ,true);
		$(".plcResi").addClass("readonly");
		$(".plcResi").prop("readonly" ,true);
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>피복탐측 상세</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">피복탐측결과 정보
							<button onClick={this.btnRemove} className="btn-right" type="button" >삭제</button>
							<button onClick={()=>this.btnSave()} className="btn-right" type="button" >저장</button>
							<button onClick={()=>this.btnNew()} className="btn-right" type="button" >신규</button>
						</h2>
						<div className="box dig-box">
							<div className="box info">
								<table>
									<colgroup>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
									</colgroup>
									<tbody>
										<tr>
											<th>탐측구분</th>
											<td><select className="gbProb" id="gbProbNm" onChange={this.gbProbNm}><option value="">선택</option></select></td>
											<th>탐측일자</th>
											<td className="form_date">
												<DatePicker
													 locale="ko" 
													id="dtProb"
													className="datepicker dtProb"
													selected={this.state.startDate}
													onChange={this.startDateChange}
													dateFormat="yyyy-MM-dd"
													showYearDropdown
													isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
											</td>
											<th>작업자</th>
											<td><input type="text" className="nmEmp" /></td>
											<th>탐측연장</th>
											<td><input type="text" className="qtyLen" /></td>
										</tr>
										<tr>
											<th>탐측시점</th>
											<td><input type="text" className="plcProbFr" /></td>
											<th>탐측종점</th>
											<td colSpan="5"><input type="text" className="plcProbTo" /></td>
										</tr>
										<tr>
											<th>피복손상개소</th>
											<td><input type="text" className="cntDcvg readonly" readOnly /></td>
											<th>피복손상거리</th>
											<td><input type="text" className="lenDcvg readonly" readOnly /></td>
											<th>CIPS측정개소</th>
											<td colSpan="3"><input type="text" className="cntCips readonly" readOnly /></td>
										</tr>
										<tr>
											<th>토양비저항값</th>
											<td colSpan="3"><input type="text" className="qtyResi readonly" readOnly /></td>
											<th>토양비측정위치</th>
											<td colSpan="3"><input type="text" className="plcResi readonly" readOnly /></td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="box table">
								<table className="propList">
									<colgroup>
										<col width="60"/>
										<col width="100"/>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
										<col width="100"/>
										<col width="100"/>
									</colgroup>
									<thead>
										<tr>
											<th>순번</th>
											<th>탐측구분</th>
											<th>탐측일자</th>
											<th>탐측시점</th>
											<th>탐측종점</th>
											<th>탐측연장</th>
											<th>작업자</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan="7">검색된 내용이 없습니다.</td>
										</tr>
									</tbody>
								</table>
							</div>
							<h2 className="wrap-head"><span>DCVG</span> 피복손상부
								<button className="btn-right" onClick={this.dcvgSave} type="button" >저장</button>
		{/*								<button className="btn-right" onClick={this.dcvgReport} type="button" >보수이력</button>*/}
							</h2>
							<div className="box table">
								<table className="dcvg_list">
									<colgroup>
										<col width="60"/>
										<col width="130"/>
										<col width="*"/>
										<col width="80"/>
										<col width="80"/>
										<col width="80"/>
										<col width="200"/>
										<col width="90"/>
									</colgroup>
									<thead>
										<tr>
											<th>순번</th>
											<th>CODE</th>
											<th>손상 추정부 위치</th>
											<th>관경(A)</th>
											<th>손상(m)</th>
											<th>보수(m)</th>
											<th>탐측결과</th>
											<th>위치등록</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan="8">검색된 내용이 없습니다.</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<h2 className="wrap-head">피복탐측대상 정보</h2>
						<div className="box dig-box">
							<div className="box info">
								<table>
									<colgroup>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
									</colgroup>
								<tbody>
									<tr>
										<th>계획년도</th>
										<td className="yyPln"></td>
										<th>공사ID</th>
										<td className="idConst"></td>
										<th>준공년도</th>
										<td className="yyConst"></td>
										<th>배관연장</th>
										<td className="qtyLen"></td>
									</tr>
									<tr>
										<th>공사명</th>
										<td colSpan="7" className="nmConst"></td>
									</tr>
								</tbody>
								</table>
							</div>
							<div className="tvbtn">
								<button type="button" onClick={() => this.btnChange(0)} className="active">T/B</button>
								<button type="button" onClick={() => this.btnChange(1)}>V/B</button>
							</div>
							<div className="box table" id="prob_list">
								<table id="prob1_list">
									<colgroup>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
									</colgroup>
									<thead>
										<tr>
											<th>관리코드</th>
											<th>시설명</th>
											<th>관경</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan="3">검색된 내용이 없습니다.</td>
										</tr>
									</tbody>
								</table>
								<table id="prob2_list">
									<colgroup>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
									</colgroup>
									<thead>
										<tr>
											<th>관리코드</th>
											<th>시설명</th>
											<th>관경</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan="3">검색된 내용이 없습니다.</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" onClick={() => config.AttachMove(this.props,'retrieveRepairDetail','보수작업')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
		{/*						<button type="button" ><img alt="" src={footer_regist} width="15" height="15" />일지생성</button>*/}
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveProbRsltDetail;