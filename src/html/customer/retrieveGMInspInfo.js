
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import PopupUser from '../../components/PopupUser';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveGMInspInfo extends Component {
	
  constructor(props) {
    super(props);
		this.state = {
			dtInsp: new Date()
		};
		this.dtInspChange = this.dtInspChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveGMInspInfo/'+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveGMInspInfo/'+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
		}
		config.detail_file.index=this.props.match.params.idx;
		this.infos={};
  }

	dtInspChange(date) {
		this.setState({
			dtInsp: date
		});
	}
	
	//상세정보
	fetchDetail = async () => {
		const info = await Promise.all([ 
			service.retrieveGMInspInfo(this.props.match.params.idInsp,this.props.match.params.idInspType)
		]);
		
		var result = info[0].data.result;

		this.infos = result;
		$.each(result, function(key, value){
			if(key === 'cdRslt'){
				$(".cdRslt").val(value);
			}else{
				if(typeof $("."+key).val() !== undefined){
					$("."+key).val(value);
				}
				if(typeof $("."+key).html() !== undefined){
					$("."+key).html(value);
				}
			}
		});
		if(this.infos.dtInsp !== undefined){
			this.setState({dtInsp : new Date(this.infos.dtInsp)})
		}

		if(result.noEmpInsp === undefined){
			$(".noEmpInsp").val(config.user.id);
			$(".noEmpInspNm").val(config.user.name);
		}

		var td1 = '';
		var td2 = '';
		var td3 = '';
		var td1Count = 0;
		var td2Count = 0;
		var td3Count = 0;
		var td1Last = 0;
		var td2Last = 0;
		var td3Last = 0;

		var sList = info[0].data.safetyChkList;
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

			if(sList[count].cdRslt === '1'){
				selected1 = ' checked';
			}else if(sList[count].cdRslt === '2'){
				selected2 = ' checked';
			}else if(sList[count].cdRslt === '3'){
				selected3 = ' checked';
			}
			if(sList[count].kdInspItem === '계량기') {
				td1 = td1 + '<tr>';
				if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
					td1 = td1 + '<th rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
					prev = sList[count].kdInspItem;
				}
				var chk = '';
				if(sList[count].nmInspItem === "계량오차값"){
					chk = ' readonly';
				}
				var clas='';
				if(sList[count].nmInspItem === "계량값" || sList[count].nmInspItem === "비보정값"){
					clas=' autoclick';
				}
				td1 = td1 + '<td>'+sList[count].nmInspItem+'</td>';
				td1 = td1 + '<td class="radio">';
				td1 = td1 + '<input type="hidden" value="'+sList[count].seqSort+'"/>';
				td1 = td1 + '<input type="hidden" value="'+sList[count].idInspType+'" />';
				td1 = td1 + '<input type="hidden" value="'+sList[count].idInsp+'" />';
				td1 = td1 + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
				td1 = td1 + '	<label><input type="radio" '+selected1+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
				td1 = td1 + '	<label><input type="radio" '+selected2+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
				td1 = td1 + '	<label><input type="radio" '+selected3+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
				td1 = td1 + '</td>';
				td1 = td1 + '<td><input type="text" value="'+(sList[count].qtyRslt1 ? sList[count].qtyRslt1 : '')+'" class="aa'+chk+clas+'" '+chk+' /></td>';
				td1 = td1 + '<td><input type="text" value="'+(sList[count].remark ? sList[count].remark : '')+'" /><input type="hidden" value="'+sList[count].cdInspItem+'" /></td>';
				td1 = td1 + '</tr>';
			} else if (sList[count].kdInspItem === '보정기'){
				td2 = td2 + '<tr>';
				if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
					td2 = td2 + '<th rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
					prev = sList[count].kdInspItem;
				}
				var chk = '';
				if(sList[count].nmInspItem === "계량오차값"){
					chk = 'readonly';
				}
				var clas='';
				if(sList[count].nmInspItem === "계량값" || sList[count].nmInspItem === "비보정값"){
					clas=' autoclick';
				}
				td2 = td2 + '<td>'+sList[count].nmInspItem+'</td>';
				td2 = td2 + '<td class="radio">';
				td2 = td2 + '<input type="hidden" value="'+sList[count].seqSort+'"/>';
				td2 = td2 + '<input type="hidden" value="'+sList[count].idInspType+'" />';
				td2 = td2 + '<input type="hidden" value="'+sList[count].idInsp+'" />';
				td2 = td2 + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
				td2 = td2 + '	<label><input type="radio" '+selected1+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
				td2 = td2 + '	<label><input type="radio" '+selected2+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
				td2 = td2 + '	<label><input type="radio" '+selected3+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
				td2 = td2 + '</td>';
				td2 = td2 + '<td><input type="text" value="'+(sList[count].qtyRslt1 ? sList[count].qtyRslt1 : '')+'" class="aa'+chk+clas+'" '+chk+' /></td>';
				td2 = td2 + '<td><input type="text" value="'+(sList[count].remark ? sList[count].remark : '')+'" /><input type="hidden" value="'+sList[count].cdInspItem+'" /></td>';
				td2 = td2 + '</tr>';
			} else {
				td3 = td3 + '<tr>';
				if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
					td3 = td3 + '<th rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
					prev = sList[count].kdInspItem;
				}
				var chk = '';
				if(sList[count].nmInspItem === "계량오차값"){
					chk = 'readonly';
				}
				var clas='';
				if(sList[count].nmInspItem === "계량값" || sList[count].nmInspItem === "비보정값"){
					clas=' autoclick';
				}

				td3 = td3 + '<td>'+sList[count].nmInspItem+'</td>';
				td3 = td3 + '<td class="radio">';
				td3 = td3 + '<input type="hidden" value="'+sList[count].seqSort+'"/>';
				td3 = td3 + '<input type="hidden" value="'+sList[count].idInspType+'" />';
				td3 = td3 + '<input type="hidden" value="'+sList[count].idInsp+'" />';
				td3 = td3 + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
				td3 = td3 + '	<label><input type="radio" '+selected1+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
				td3 = td3 + '	<label><input type="radio" '+selected2+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
				td3 = td3 + '	<label><input type="radio" '+selected3+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
				td3 = td3 + '</td>';
				td3 = td3 + '<td><input type="text" value="'+(sList[count].qtyRslt1 ? sList[count].qtyRslt1 : '')+'" class="aa'+chk+clas+'" '+chk+' /></td>';
				td3 = td3 + '<td><input type="text" value="'+(sList[count].remark ? sList[count].remark : '')+'" /><input type="hidden" value="'+sList[count].cdInspItem+'" /></td>';
				td3 = td3 + '</tr>';
			}
			
		}

		$("#safty_list tbody").append(td1);
		$("#safty_list tbody").append(td2);
		$("#safty_list tbody").append(td3);
	
		config.setWindowHeight();
	}


	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idInspType: this.props.match.params.idInspType,
				idInsp: this.props.match.params.idInsp, 
				dtInsp: $(".dtInsp").val(),

				noEmpInspNm: $(".noEmpInspNm").val(), 
				noEmpInsp :  $(".noEmpInsp").val(), 
				cdRslt: $(".cdRslt").val(),
				contUncorr: $(".contUncorr").val()
			};
			var safetyChkList = [];
			$("#safty_list tbody").find("tr").each(function(){
				var checked = 3;
				if( $(this).find("input:eq(4)").prop("checked") ===true ){
					checked = 1;
				}else if( $(this).find("input:eq(5)").prop("checked") ===true ){
					checked = 2;
				}else if( $(this).find("input:eq(6)").prop("checked") ===true ){
					checked = 3;
				}
				safetyChkList.push({
					seqSort: $(this).find("input:eq(0)").val(),
					idInspType: $(this).find("input:eq(1)").val(),
					idInsp: $(this).find("input:eq(2)").val(),
					cdCompany: $(this).find("input:eq(3)").val(),
					kdInspItem: $(this).find("td:eq(0)").html(),
					nmInspItem: $(this).find("td:eq(1)").html(),
					cdRslt: checked,
					qtyRslt1: $(this).find("input:eq(7)").val(),
					remark: $(this).find("input:eq(8)").val(),
					cdInspItem: $(this).find("input:eq(9)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;


			const save = await Promise.all([service.saveGMInspInfo(data)]);
			alert(save[0].data.message);
		}

	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "계량기";
		$(".header_title").html( "계량기");

		this.fetchDetail();
		config.fetchCommon("점검","결과","cdRslt");
		

		$(document).off("click","#safty_list tbody tr input[type=radio]");
		$(document).on("click","#safty_list tbody tr input[type=radio]",function(){
			var cdRsltCheck= 0;
			$("#safty_list tbody tr").each(function(){
				if( $(this).find("input[type=radio]:eq(1)").prop("checked") === true){
					cdRsltCheck = 1;
					return false;
				}
				if( $(this).find("input[type=radio]:eq(2)").prop("checked") === true){
					cdRsltCheck = 2;
					return false;
				}
			});
			if(cdRsltCheck === 0){
				$(".cdRslt").val(1);
			}else if(cdRsltCheck === 1){
				$(".cdRslt").val(2);
			}else{
				//$(".cdRslt").val(2);
			}

		});

		$(document).off("keyup",".autoclick");
		$(document).on("keyup",".autoclick",function(){
			var auto = parseFloat($("#safty_list").find(".autoclick:eq(0)").val()) - parseFloat($("#safty_list").find(".autoclick:eq(1)").val())
			$("#safty_list").find(".readonly").val(auto)
		});
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser />
          <div className="detail">
					<div className="tab tab1">
						<h2 className="wrap-head">계량기 상세정보</h2>
					</div>
					<div className="wrap">
						<h2>시설정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="100px"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
                    <th>기본정보</th>
										<th>시설명</th>
										<td className="nmFclt"></td>
										<th>사용압력</th>
										<td className="qtyPress"></td>
										<th>최초공급일</th>
										<td className="dtSply"></td>
									</tr>
									<tr>
                    <th rowSpan="3">계량기</th>
										<th>GM모델</th>
										<td className="cdModelNm"></td>
										<th>GM제조사</th>
										<td colSpan="3" className="cdMakerNm"></td>
									</tr>
									<tr>
										<th>GM등급</th>
										<td className="grdGmNm"></td>
										<th>GM형식</th>
										<td className="gbGmNm"></td>
										<th>GM설치일자</th>
										<td className="dtSet"></td>
									</tr>
									<tr>
										<th>GM차기교체일자</th>
										<td className="dtChg"></td>
										<th>GM기물번호</th>
										<td className="noMachinGm"></td>
										<th>gm급유여부</th>
										<td className="YnOilNm"></td>
									</tr>
									<tr>
										<th rowspan="2">보정기</th>
										<th>보정기 기물번호</th>
										<td className="noMachinVc"></td>
										<th>보정기 제조사</th>
										<td className="cdMakerVcNm"></td>
										<th>보정기 모델</th>
										<td className="cdVcmodelNm"></td>
									</tr>
									<tr>
										<th>보정기 설치일자</th>
										<td className="dtSetVc"></td>
										<th>보정기 봉인번호</th>
										<td className="noSealVc"></td>
										<th>바이패스 봉인번호</th>
										<td className="noSealBypass"></td>
									</tr>
								</tbody>
							</table>
						</div>
						
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>점검일자</th>
										<td>
											<DatePicker
												 locale="ko" 
												id="dtInsp"
												className="datepicker dtInsp"
												selected={this.state.dtInsp}
												onChange={this.dtInspChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
										<th>점검자</th>
										<td className="">
											<input type="hidden" className="noEmpInsp nmSelect" />
											<input type="text" className="noEmpInspNm nmSelectName readonly" readOnly onClick={this.userInfo}/>
										</td>
									</tr>
									<tr>
										<th>점검결과</th>
										<td><select id="cdRslt" className="cdRslt"></select></td>
										<th>부적합내용</th>
										<td><input type="text" className="contUncorr"/></td>
									</tr>
								</tbody>
							</table>
							<input type="hidden" className="idInsp" />
							<input type="hidden" className="idInspType" />
							<input type="hidden" className="cdFclt" />
							<input type="hidden" className="roadAddr" />
							<input type="hidden" className="lAddr" />
							<input type="hidden" className="sAddr" />
						</div>

						<h2>안전점검표</h2>
						<div className="box info">
							<table id="safty_list">
								<colgroup>
									<col width="100"/>
									<col width="*"/>
									<col width="250"/>
									<col width="100"/>
									<col width="100"/>
								</colgroup>
								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center">검사결과</th>
										<th className="text-center">측정값</th>
										<th className="text-center">비고</th>
									</tr>
								</thead>
								<tbody>

								</tbody>
							</table>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGMInspInfo','중／대용랼 계량기 점검')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveGMInspInfo;