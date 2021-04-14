
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

class retrieveAcceptanceInfoForTakeinsp extends Component {

	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveAcceptanceInfoForTakeinsp/'+this.props.match.params.idConst){
				config.back.url.push('/retrieveAcceptanceInfoForTakeinsp/'+this.props.match.params.idConst);
		}
		config.detail_file.index=this.props.match.params.idConst;
		this.state = {
				dtInspDate: null
		};
		this.dtInspDateChange = this.dtInspDateChange.bind(this);

		this.info={}
	}

	dtInspDateChange(date) {
		this.setState({
			dtInspDate: date
		});
	}

	fetchDetail = async () => {
		const common = await Promise.all([ 
			service.retrieveAcceptanceInfoForTakeinsp(this.props.match.params.idConst)
		]);
		
		var result = common[0].data.result;
		this.info = result;
		$.each(result, function(key, value){
			if(key === "dtTakeinsp" || key === "cdRsltTakeinsp" || key === "noEmpTakeinsp" || key === "nmEmpTakeinsp" || key === "noEmp2Takeinsp" || key === "nmEmp2Takeinsp" || key === "txTakeinsp"){
				if(key === "dtTakeinsp" && value === ""){

				}else{
					$("."+key).val(value);
				}
			}else{
				$("."+key).html(value);
			}

		});

		if(result.dtTakeinsp !== undefined){
			this.setState({dtInspDate : new Date(result.dtTakeinsp)})
		}

		if(result.nmEmpTakeinsp === undefined){
			$(".noEmpTakeinsp").val(config.user.id);
			$(".nmEmpTakeinsp").val(config.user.name);
		}
		if(result.nmEmp2Takeinsp === undefined){
			$(".noEmp2Takeinsp").val(config.user.id);
			$(".nmEmp2Takeinsp").val(config.user.name);
		}


		var safetyChkList = common[0].data.safetyChkList;
		
		//console.log(safetyChkList);
		var td3 = '';

		var checkl =[];
		for(var i=0; i < safetyChkList.length; i++){
			if( checkl[safetyChkList[i].kdInspItem] >= 1){
				checkl[safetyChkList[i].kdInspItem] += 1;
			}else{
				checkl[safetyChkList[i].kdInspItem] = 1;
			}
		}
		var prev='';

		for(var count = 0; count < safetyChkList.length; count++){
				var selected1 = '';
				var selected2 = '';
				var selected3 = '';

				if(safetyChkList[count].cdRslt === '1'){
						selected1 = ' checked';
				}else if(safetyChkList[count].cdRslt === '2'){
						selected2 = ' checked';
				}else if(safetyChkList[count].cdRslt === '3'){
						selected3 = ' checked';
				}
				if(selected1 === '' && selected2 === '' && selected3 === ''){
					selected1 = ' checked';
				}
				td3 = td3 + '<tr>';
				if(checkl[safetyChkList[count].kdInspItem] >=1 && prev != safetyChkList[count].kdInspItem){
					td3 = td3 + '<th rowspan="'+checkl[safetyChkList[count].kdInspItem]+'">'+safetyChkList[count].kdInspItem+'</th>';
					prev = safetyChkList[count].kdInspItem;
				}

				td3 += '<td>' + safetyChkList[count].nmInspItem + '</td>';
				td3 += '<td class="radio"><label><input type="radio" '+selected1+' name="type2_'+safetyChkList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
				td3 += '<label><input type="radio" '+selected2+' name="type2_'+safetyChkList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
				td3 += '<label><input type="radio" '+selected3+' name="type2_'+safetyChkList[count].seqSort+'"/><strong></strong><span>해당없음</span></label></td>';
				td3 += '<td><input type="text" value="'+((safetyChkList[count].remark) ? safetyChkList[count].remark : '')+'" />';
				td3 += '<input type="hidden" value="'+((safetyChkList[count].seqSort) ? safetyChkList[count].seqSort : '')+'" />';
				td3 += '<input type="hidden" value="'+((safetyChkList[count].idConst) ? safetyChkList[count].idConst : '')+'" />';
				td3 += '<input type="hidden" value="'+((safetyChkList[count].cdCompany) ? safetyChkList[count].cdCompany : '')+'" />';
				td3 += '<input type="hidden" value="'+((safetyChkList[count].cdInspItem) ? safetyChkList[count].cdInspItem : '')+'" /><input type="hidden" value="'+((safetyChkList[count].kdInspItem) ? safetyChkList[count].kdInspItem : '')+'" />';
				td3 += '</td>';
				td3 += '</tr>';
		}

		$("#safty_list tbody").append(td3);

		config.setWindowHeight();
	}

	componentDidMount() {
		//config.fetchCommon("점검", "결과", "cdRslt");
		$(".footer").css("display","none");
		$(".map").css("display","none");
	
		config.header.title = "공급관리";
		$(".header_title").html( "공급관리");
		config.fetchCommon("점검","결과","cdRsltTakeinsp");
		
		this.fetchDetail();
		
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
				$(".cdRsltTakeinsp").val(1);
			}else if(cdRsltCheck === 1){
				$(".cdRsltTakeinsp").val(2);
			}else{
				//$(".cdRsltTakeinsp").val(2);
			}
		});
	}



	btnSave = async () =>{
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idConst: this.props.match.params.idConst,
				dtTakeinsp: $(".dtTakeinsp ").val(),
				noEmpTakeinsp: $(".noEmpTakeinsp").val(), 
				nmEmpTakeinsp : $(".nmEmpTakeinsp").val(), 
				noEmp2Takeinsp: $(".noEmp2Takeinsp ").val(),
				nmEmp2Takeinsp: $(".nmEmp2Takeinsp ").val(),
				cdRsltTakeinsp: $(".cdRsltTakeinsp").val(),
				txTakeinsp: $(".txTakeinsp").val()
			};
			var safetyChkList = [];
			$("#safty_list tbody").find("tr").each(function(){
				var checked = 3;
				if( $(this).find("input:eq(0)").prop("checked") ===true ){
					checked = 1;
				}else if( $(this).find("input:eq(1)").prop("checked") ===true ){
					checked = 2;
				}else if( $(this).find("input:eq(2)").prop("checked") ===true ){
					checked = 3;
				}
				safetyChkList.push({
					seqSort: $(this).find("input:eq(4)").val(),
					idConst: $(this).find("input:eq(5)").val(),
					cdCompany: $(this).find("input:eq(6)").val(),
					cdInspItem: $(this).find("input:eq(7)").val(),
					kdInspItem: $(this).find("input:eq(8)").html(),
					nmInspItem: $(this).find("td:eq(0)").html(),
					cdRslt: checked,
					remark: $(this).find("input:eq(3)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;

			const save = await Promise.all([service.saveAcceptanceInfoForTakeinsp(data)]);
			
			alert(save[0].data.message);
		}
	}

	userInfo = (type) =>{
		$(".user-form").css("display","block");
		$(".user-form").addClass("user_type"+type);
	}
  render() {
		return (
			<div className="contents">
				<PopupUser />
				<div className="detail">
					<div className="tab tab1">
						<h2>인수검사 검사정보</h2>
					</div>
					<div className="wrap">
						<h2>수용가 기본정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>공사ID</th>
										<td colSpan="3" className="idConst"></td>
										<th>공사명</th>
										<td colSpan="3" className="nmConst"></td>
									</tr>
									<tr>
										<th>공사시점</th>
										<td colSpan="3" className="plcConstFr"></td>
										<th>공사종점</th>
										<td colSpan="3" className="plcConstTo"></td>
									</tr>
									<tr>
										<th>공사시작일</th>
										<td className="dtConstFr"></td>
										<th>공사종료일</th>
										<td className="dtConstTo"></td>
										<th>시공업체</th>
										<td className="nmCom"></td>
										<th>시공관리자</th>
										<td className="nmConstMng"></td>
									</tr>
									<tr>
										<th>인계일</th>
										<td className="dtTakeFr"></td>
										<th>인계자</th>
										<td className="nmEmpGive"></td>
										<th>인수일</th>
										<td colSpan="3" className="dtTakeTo"></td>
									</tr>
									<tr>
										<th>인수검사일</th>
										<td className="form_date">
											<DatePicker
												 locale="ko" 
												id="dtTakeinsp"
												className="datepicker dtTakeinsp"
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
										<th>인수결과</th>
										<td><select className="cdRsltTakeinsp" id="cdRsltTakeinsp"></select></td>
										<th>검사자(정)</th>
										<td>
											<input type="hidden" className="noEmpTakeinsp nmSelect" />
											<input type="text" className="nmEmpTakeinsp readonly" readOnly onClick={() => this.userInfo(0)}/>
										</td>
										<th>검사사(부)</th>
										<td>
											<input type="hidden" className="noEmp2Takeinsp nmSelect" />
											<input type="text" className="nmEmp2Takeinsp   readonly" readOnly onClick={() => this.userInfo(1)}/>
										</td>
									</tr>
									<tr>
										<th>부적합내용</th>
										<td colSpan="7" ><input type="text" className="txTakeinsp"/></td>
									</tr>
									<tr>
										<th>조치통보일</th>
										<td className="dtNotcCorr"></td>
										<th>재검일</th>
										<td className="dtTakeinsp2"></td>
										<th>재검사자</th>
										<td className="nmEmpInsp2"></td>
										<th>재검결과</th>
										<td className="nmRsltTake2"></td>
									</tr>

								</tbody>
							</table>
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<table id="safty_list">
								<colgroup>
									<col width="180"/>
									<col width="*"/>
									<col width="250"/>
									<col width="250"/>
								</colgroup>
								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center">검사결과</th>
										<th className="text-center">메모</th>
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

						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAcceptanceInfoForTakeinsp','인수검사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveAcceptanceInfoForTakeinsp;