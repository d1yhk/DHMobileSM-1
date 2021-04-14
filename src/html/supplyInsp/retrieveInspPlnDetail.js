
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupUserMulti from '../../components/PopupUserMulti';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon7 from '../../image/icon7.png';

import icon10 from '../../image/icon10.png';
import close_x from '../../image/close_x.png';
import close from '../../image/close.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveInspPlnDetail extends Component {
  constructor(props) {
    super(props);

		if(config.back.url[config.back.url.length-1] !== '/retrieveInspPlnDetail/'+this.props.match.params.kdFclt+'/'+this.props.match.params.idInsp+'/'+this.props.match.params.idInspType){
			config.back.url.push('/retrieveInspPlnDetail/'+this.props.match.params.kdFclt+'/'+this.props.match.params.idInsp+'/'+this.props.match.params.idInspType);
		}

		this.title = "";
		if(this.props.match.params.kdFclt === "31"){
			this.title= "밸브";
		}else if(this.props.match.params.kdFclt === "32"){
			this.title= "전기방식";
		}else if(this.props.match.params.kdFclt === "33"){
			this.title= "중점관리대상";
		}

		this.result = {};
		this.state = {
				dtInspDate: new Date(),
				startDate: '',//new Date(),
				endDate: ''//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.dtInspDateChange = this.dtInspDateChange.bind(this);
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
	dtInspDateChange(date) {
			this.setState({
					dtInspDate: date
			});
	}


	//시설물로 이동
	fetchSisul = () => {
		if(this.props.match.params.kdFclt === ""){
			alert("리스트를 선택해주세요")
		}else{
			if( this.title === "밸브"){
				this.props.history.push('/retrieveValveDetail/'+config.detail_file.index);
			}else if( this.title === "전기방식"){
				this.props.history.push('/retrieveTbDetail/'+config.detail_file.index);
			}else if( this.title === "중점관리대상"){
				this.props.history.push('/retrieveSpecialDetail/'+this.result.cdFclt );
			}
		}
	}
	//첨부파일 이동
	AttachMove = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			this.props.history.push('/Attach/검사대상 '+this.title);
		}
	}
	//상세정보
	fetchDetail = async () => {
		//console.log(config);
		//if(config.detail_file.index !== '' ){
			const common = await Promise.all([ 
				service.retrieveSupplyInspInfo2(this.props.match.params.kdFclt,this.props.match.params.idInsp,this.props.match.params.idInspType)
			]);
			
			

			var result = common[0].data.result;
			console.log(result);
			this.result = result;
			$.each(result, function(key, value){
				if(key==="noEmpInspNm" || key==="noEmpInsp" || key==="dtInsp" || key ==="cdRslt" || key ==="remark" || key ==="idInsp" || key ==="idInspType" || key ==="id"){
					$("."+key).val(value);
				}else{
					$("."+key).html(value);
					
				}
			});
			
			if(result.dtInsp !== null && result.dtInsp !== undefined){
				this.setState({dtInspDate : new Date(result.dtInsp)})
			}


			$(".types").css("display","none");
			$(".type_title span").css("display","none");
			
			if(this.title === "밸브"){
				$(".type0").css("display","table");
				$(".type_title span:eq(0)").css("display","block");

				var td = '';
				var tf = '';
				var sList = common[0].data.safetyChkList;
				var selected1='';
				var selected2='';
				var selected3='';
				var checkl =[];
				for(var i=0; i < sList.length; i++){
					if( checkl[sList[i].kdInspItem] >= 1){
						checkl[sList[i].kdInspItem] += 1;
					}else{
						checkl[sList[i].kdInspItem] = 1;
					}
				}
				var prev='';
				for(var count = 0; count < sList.length; count++){
					selected1='';
					selected2='';
					selected3='';

					td = td + '<tr>';
					if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
						td = td + '<th class="text-center" rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
						prev = sList[count].kdInspItem;
					}

					if(sList[count].cdRslt === '1'){
						selected1 = ' checked';
					}else if(sList[count].cdRslt === '2'){
						selected2 = ' checked';
					}else if(sList[count].cdRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<td>'+sList[count].nmInspItem+'</td>';
					td = td + '<td class="radio">';
					td = td + '<input type="hidden" value="'+sList[count].seqSort+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInspType+'" />';
					td = td + '<input type="hidden" value="'+sList[count].kdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInsp+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].nmInspItem+'" />';
					td = td + '	<label><input type="radio" '+selected1+' name="type0_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
					td = td + '	<label><input type="radio" '+selected2+' name="type0_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
					td = td + '	<label><input type="radio" '+selected3+' name="type0_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
					td = td + '</tr>';
				}
				tf += '<tr>';
				tf += '<th class="text-center">점검내용</th>';
				tf += '<td colSpan="3"><textarea class="note">'+((result!==null) ? ((result.contUncorr!==undefined) ? result.contUncorr : '') : '')+'</textarea></td>';
				tf += '</tr>';
				$(".type0 tbody").html(td);
				$(".type0 tfoot").html(tf);
				config.table.attach1="공급시설검사(밸브)";
				
			}else if(this.title === "전기방식"){
				$(".type1").css("display","table");
				$(".type_title span:eq(1)").css("display","block");
				
				var td = '';
				var tf = '';
				var sList = common[0].data.safetyChkList;
				var selected1='';
				var selected2='';
				var selected3='';
				var checkl =[];
				for(var i=0; i < sList.length; i++){
					if( checkl[sList[i].kdInspItem] >= 1){
						checkl[sList[i].kdInspItem] += 1;
					}else{
						checkl[sList[i].kdInspItem] = 1;
					}
				}
				var prev='';
				for(var count = 0; count < sList.length; count++){
					selected1='';
					selected2='';
					selected3='';
					td = td + '<tr>';
					if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
						td = td + '<th class="text-center" rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
						prev = sList[count].kdInspItem;
					}


					if(sList[count].cdRslt === '1'){
						selected1 = ' checked';
					}else if(sList[count].cdRslt === '2'){
						selected2 = ' checked';
					}else if(sList[count].cdRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<td>'+sList[count].nmInspItem+'</td>';
					td = td + '<td class="radio">';
					td = td + '<input type="hidden" value="'+sList[count].seqSort+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInspType+'" />';
					td = td + '<input type="hidden" value="'+sList[count].kdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInsp+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].nmInspItem+'" />';
					td = td + '	<label><input type="radio" '+selected1+' name="type1_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
					td = td + '	<label><input type="radio" '+selected2+' name="type1_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
					td = td + '	<label><input type="radio" '+selected3+' name="type1_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((sList[count].qtyRslt1) ? sList[count].qtyRslt1 : '')+'" /></td>';
					td = td + '<td><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
					td = td + '</tr>';
				}
				tf += '<tr>';
				tf += '<th class="text-center">점검내용</th>';
				tf += '<td colSpan="4"><textarea class="note">'+((result!==null) ? ((result.contUncorr!==undefined) ? result.contUncorr : '') : '')+'</textarea></td>';
				tf += '</tr>';
				$(".type1 tbody").html(td);
				$(".type1 tfoot").html(tf);
				config.table.attach1="공급시설검사(TB)";

			}else if(this.title === "중점관리대상"){
				$(".type2").css("display","table");
				$(".type_title span:eq(2)").css("display","block");

				var td = '';
				var tf = '';
				var sList = common[0].data.safetyChkList;
				var selected1='';
				var selected2='';
				var selected3='';
				var checkl =[];
				for(var i=0; i < sList.length; i++){
					if( checkl[sList[i].kdInspItem] >= 1){
						checkl[sList[i].kdInspItem] += 1;
					}else{
						checkl[sList[i].kdInspItem] = 1;
					}
				}
				var prev='';
				for(var count = 0; count < sList.length; count++){
					selected1='';
					selected2='';
					selected3='';
					td = td + '<tr>';
					if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
						td = td + '<th class="text-center" rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
						prev = sList[count].kdInspItem;
					}


					if(sList[count].cdRslt === '1'){
						selected1 = ' checked';
					}else if(sList[count].cdRslt === '2'){
						selected2 = ' checked';
					}else if(sList[count].cdRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<td>'+sList[count].nmInspItem+'</td>';
					td = td + '<td class="radio">';
					td = td + '<input type="hidden" value="'+sList[count].seqSort+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInspType+'" />';
					td = td + '<input type="hidden" value="'+sList[count].kdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].idInsp+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
					td = td + '<input type="hidden" value="'+sList[count].cdInspItem+'" />';
					td = td + '<input type="hidden" value="'+sList[count].nmInspItem+'" />';
					td = td + '	<label><input type="radio" '+selected1+' name="type2_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
					td = td + '	<label><input type="radio" '+selected2+' name="type2_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
					td = td + '	<label><input type="radio" '+selected3+' name="type2_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
					td = td + '</tr>';
				}
				tf += '<tr>';
				tf += '<th class="text-center">점검내용</th>';
				tf += '<td colSpan="3"><textarea class="note">'+((result!==null) ? ((result.contUncorr!==undefined) ? result.contUncorr : '') : '')+'</textarea></td>';
				tf += '</tr>';
				$(".type2 tbody").html(td);
				$(".type2 tfoot").html(tf);
				config.table.attach1="공급시설검사(중점)";
			}



			if(result!==null){
				config.table.p1=this.title;
				config.table.p2=result.id;
				// 수취기일경우 위치이동 변경
				if(result.gbFragNm === "수취기"){
					config.table.p1 = "수취기";
				}
	//			config.grpifm.select_no = types;
				
				config.table.attach2=result.idInspType;
				config.table.attach3=result.idInsp;
				config.table.attach4=result.cdFclt;

				config.table.change1 = result.id;
				config.table.change2 = "08";

				config.detail_file.index = result.id;
			}
			config.setWindowHeight();
		//}else{
		//	alert("리스트를 선택해주세요");
		//	this.props.history.goBack();
		//}
	}

/*
	componentDidUpdate(){
		//$("#inspGubun option").attr("selected","false");
		if(parseInt(this.props.match.params.idx) > 0 ){
			config.detail_file.index = this.props.match.params.idx;
			//this.componentDidMount();
		}
	}
	*/

	componentDidMount() {
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

		$(".map").css("display","none");
		$(".footer").css("display","none");
		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");;

		
		config.detail_file.param="id";
		config.detail_file.folder1="protect";
		config.detail_file.folder2="location";
		config.detail_file.name="retrieveSupplyInspInfo";

		config.fetchCommon("점검","결과","cdRslt");
		config.fetchCommon("전기방식","점검구분","gubun_popup");
		this.fetchDetail();

		var checked = 0;
		$(document).off("click",".radio input");
		$(document).on("click",".radio input",function(){
			checked = 0;
			$(".radio input").each(function(){
				if($(this).prop("checked") === true){
					if($(this).parent().find("span").html() === "부적합"){
						checked = 1;
					}
				}
			});
			if(checked === 1){
				$("#cdRslt").val(2);
			}
			if(checked === 0){
				$("#cdRslt").val(1);
			}
		});
	}

	//저장
	/*
	 저장 :  URL - /supplyInsp/inspPlnController/saveInspInfo.do
	필수 저장값 – 점검일자, 점검자 입력하지 않았을 경우 해당 항목 입력하라는 메시지 창 보여줌
	* 저장 parameter 
	 점검일자: dtInsp
	 점검자ID: noEmpInsp (Ex-10052, 10051, 10045)    
	 점검자명: noEmpInspNm(Ex–정현석, 김광빈, 김현석)
	 검사결과: cdRslt(ex- 1)
	 특이사항: remark
	 점검내용: contUncorr
	 안전점검표 : safetyChkList

	*/
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {idInsp: $(".idInsp").val(), idInsp: $(".idInsp").val(), idInspType: $(".idInspType").val(), id: $(".id").val(), cdFclt: $(".cdFclt").val(), dtInsp: $(".dtInsp").val(), noEmpInsp: $(".nmSelectId").val(), noEmpInspNm: $(".noEmpInspNm").val(), cdRslt: $(".cdRslt").val(), remark: $(".remark").val(), contUncorr: $(".note").val() };
			var safetyChkList = [];
			if(this.title==="밸브"){
				//{seqSort:'1',idInspType:'1031',kdInspItem:'밸브박스점검내역',idInsp:'20200000068528',cdCompany:'10000',cdInspItem:'103101',nmInspItem:'방수상태',cdRslt:'2',remark:'',idInsert:'test'}
				$(".type0 tbody").find("tr").each(function(){

					var checked = 3;
					if( $(this).find("input:eq(7)").prop("checked") ===true ){
						checked = 1;
					}else if( $(this).find("input:eq(8)").prop("checked") ===true ){
						checked = 2;
					}else if( $(this).find("input:eq(9)").prop("checked") ===true ){
						checked = 3;
					}
					safetyChkList.push({
						seqSort:$(this).find("input:eq(0)").val(),
						idInspType:$(this).find("input:eq(1)").val(),
						kdInspItem:$(this).find("input:eq(2)").val(),
						idInsp:$(this).find("input:eq(3)").val(),
						cdCompany:$(this).find("input:eq(4)").val(),
						cdInspItem:$(this).find("input:eq(5)").val(),
						nmInspItem:$(this).find("input:eq(6)").val(),
						cdRslt:checked,
						remark:$(this).find("input:eq(10)").val(),
						idInsert:""
					});
				});

			}else if(this.title==="전기방식"){
				//{seqSort:’1’,idInspType:’1032’,kdInspItem:'전기방식 점검내역',idInsp:'20200000034098',cdCompany:'10000',cdInspItem:'103201',nmInspItem:'매몰여부',cdRslt:'1,qtyRslt1:'0.004',remark:''}
				$(".type1 tbody").find("tr").each(function(){
					var checked = 3;
					if( $(this).find("input:eq(7)").prop("checked") ===true ){
						checked = 1;
					}else if( $(this).find("input:eq(8)").prop("checked") ===true ){
						checked = 2;
					}else if( $(this).find("input:eq(9)").prop("checked") ===true ){
						checked = 3;
					}
					safetyChkList.push({
						seqSort:$(this).find("input:eq(0)").val(),
						idInspType:$(this).find("input:eq(1)").val(),
						kdInspItem:$(this).find("input:eq(2)").val(),
						idInsp:$(this).find("input:eq(3)").val(),
						cdCompany:$(this).find("input:eq(4)").val(),
						cdInspItem:$(this).find("input:eq(5)").val(),
						nmInspItem:$(this).find("input:eq(6)").val(),
						cdRslt:checked,
						qtyRslt1:$(this).find("input:eq(10)").val(),
						remark:$(this).find("input:eq(11)").val(),
						idInsert:""
					});
				});

			}else if(this.title==="중점관리대상"){
				//{seqSort:'1',idInspType:'1031',kdInspItem:'밸브박스점검내역',idInsp:'20200000068528',cdCompany:'10000',cdInspItem:'103101',nmInspItem:'방수상태',cdRslt:'2',remark:'',idInsert:'test'}
				$(".type2 tbody").find("tr").each(function(){
					var checked = 3;
					if( $(this).find("input:eq(7)").prop("checked") ===true ){
						checked = 1;
					}else if( $(this).find("input:eq(8)").prop("checked") ===true ){
						checked = 2;
					}else if( $(this).find("input:eq(9)").prop("checked") ===true ){
						checked = 3;
					}
					safetyChkList.push({
						seqSort:$(this).find("input:eq(0)").val(),
						idInspType:$(this).find("input:eq(1)").val(),
						kdInspItem:$(this).find("input:eq(2)").val(),
						idInsp:$(this).find("input:eq(3)").val(),
						cdCompany:$(this).find("input:eq(4)").val(),
						cdInspItem:$(this).find("input:eq(5)").val(),
						nmInspItem:$(this).find("input:eq(6)").val(),
						cdRslt:checked,
						remark:$(this).find("input:eq(10)").val(),
						idInsert:""
					});
				});
			}

			data['safetyChkList'] = safetyChkList;
			//console.log(data);
			const save = await Promise.all([service.saveInspInfo(data)]);
			
			alert(save[0].data.message);
		}
		//if(save[0].data.code==
	}


	//과년도 전위값
	prevYear = async () => { 
		$(".popup-year").css("display","block");
		$("#popupContents tbody").html("");

		//console.log(this.result);
//		alert(this.result.facilNo);
		try {	
			//facilNo,idInspType,yyPlnFr,yyPlnTo
			const common = await Promise.all([ 
				service.retrievePastTb(this.result.facilNo , $("#gubun_popup").val(), $("#yyPlnFr_poup").val(), $("#yyPlnTo_popup").val())
			]);
			
		
			$("#popupContents tbody").html("");
			var result = common[0].data.result;

			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['noTb']) ? result[count]['noTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmTb']) ? result[count]['nmTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmInspType']) ? result[count]['nmInspType'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq4']) ? result[count]['seq4'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq5']) ? result[count]['seq5'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq6']) ? result[count]['seq6'] : '')+'</td>';
				td = td + '</tr>';
				$("#popupContents tbody").append(td);
			}
			if(result.length === 0 || !result){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');
			}
		} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');

		}
	}
	userInfo = () =>{
		$(".user-form").css("display","block");
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

				<div className="popup popup-year">
					<div className="popup-box table">
						<h2>과년도 전위값 <button type="button" className="close_popup"><img src={close} width="20" height="20" alt="" /></button></h2>
						<div className="box search2">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사구분</label>
											<select id="gubun_popup" name="gubun_popup">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>점검년도</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnFr_poup"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnTo_popup"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={this.prevYear} >검색</button>
								</fieldset>
							</form>
						</div>
						<div id="popupContents" className="martop20" >
							<table>
								<thead>
									<tr>
										<th>TB코드</th>
										<th>시설명</th>
										<th>검사구분</th>
										<th>측정일자</th>
										<th>통합전위</th>
										<th>배관전위</th>
										<th>MG전위</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
							<div className="popup_btn">
								<button type="button" className="close_popup close_x"><img src={close_x} width="16" height="16" alt="" />닫기</button>
							</div>
						</div>
					</div>
				</div>
				<PopupUserMulti />
				<div className="detail">
					<div className="tab tab1">
						<h2>검사대상 {this.title} </h2>
					</div>
					<div className="wrap info-write">
						<h2 className="wrap-head">기본정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>시설코드</th>
										<td className="cdFclt"></td>
										<th>시설명</th>
										<td className="nmFclt"></td>
										<th>법정동</th>
										<td className="cdDongNm"></td>
									</tr>
									<tr>
										<th>형식</th>
										<td className="tpVftypeNm"></td>
										<th className="type_title"><span>순찰담당구역</span><span>관로순찰구간</span><span>관로순찰구간</span></th>
										<td className="idPipeRoadNm"></td>
										<th>배관구분</th>
										<td className="gbPipeNm"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2>점검정보</h2>
						<div className="box info">
							<input type="hidden" className="idInsp" />
							<input type="hidden" className="idInspType" />
							<input type="hidden" className="id" />
							<table>
								<colgroup>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>점검일자</th>
										<td className="form_date">
												<DatePicker
												 locale="ko" 
												id="dtInsp"
												className="datepicker dtInsp"
												selected={this.state.dtInspDate}
												onChange={this.dtInspDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
										<th>점검자</th>
										<td>
											<input type="text" className="noEmpInspNm nmSelectName readonly" readOnly onClick={this.userInfo}/>
											<input type="hidden" className="noEmpInsp nmSelectId "/>
										</td>
										<th>검사결과</th>
										<td ><select className="cdRslt" id="cdRslt"></select></td>
									</tr>
									<tr>
										<th>검사구분</th>
										<td className="inspGubunNm"></td>
										<th>특이사항</th>
										<td colSpan="3"><input type="text" className="remark" /></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<table className="types type0">
								<colgroup>
									<col width="150"/>
									<col width="300"/>
									<col width="350"/>
									<col width="*"/>
								</colgroup>
								<thead>
								<tr>
									<th className="text-center">항목유형</th>
									<th className="text-center">점검항목명</th>
									<th className="text-center" style={{width:'80px'}}>검사결과</th>
									<th className="text-center">비고</th>
								</tr>				
								</thead>
								<tbody></tbody>
								<tfoot></tfoot>
							</table>
							<table className="types type1">
								<colgroup>
									<col width="150"/>
									<col width="300"/>
									<col width="300"/>
									<col width="200"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'250px'}}>검사결과</th>
										<th className="text-center" style={{width:'80px'}}>측정값</th>
										<th className="text-center">비고</th>
									</tr>
								</thead>
								<tbody></tbody>
								<tfoot></tfoot>
							</table>
							<table className="types type2">
								<colgroup>
									<col width="150"/>
									<col width="300"/>
									<col width="350"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'80px'}}>검사결과</th>
										<th className="text-center">비고</th>
									</tr>
								</thead>
								<tbody></tbody>
								<tfoot></tfoot>
							</table>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						
						<button type="button" className="btn_save" onClick={this.btnSave}  ><img alt="" src={icon7} width="15" height="15" />저장</button>

						<button type="button" className="btn_file" onClick={() => this.AttachMove()}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
		{(this.title==="전기방식") ? <button type="button" className="btn_year" onClick={this.prevYear}  ><img alt="" src={icon7} width="15" height="15" />과년도 전위값</button> : ''}
		{/*<button type="button" className="btn_detail" onClick={this.fetchSisul}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>*/}

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveInspPlnDetail;