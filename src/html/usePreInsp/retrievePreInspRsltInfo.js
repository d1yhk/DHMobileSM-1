/*global hwindow*/
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

class retrievePreInspRsltInfo extends Component {

	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePreInspRsltInfo/'+this.props.match.params.idPreinsp+'/'+this.props.match.params.idCntr){
				config.back.url.push('/retrievePreInspRsltInfo/'+this.props.match.params.idPreinsp+'/'+this.props.match.params.idCntr);
		}
		//config.detail_file.index=this.props.match.params.idx;
		this.state = {
				dtInspDate: new Date()
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
			service.retrievePreInspRsltInfo(this.props.match.params.idPreinsp, this.props.match.params.idCntr)
		]);
		
		var result = common[0].data.result;
		this.info = result;
		$.each(result, function(key, value){
			if(key === "nmFcltBld" || key === "gbCntrNm" || key === "gbFcltNm"){
				$("."+key).html(value);
			}
		});

		if(result.noEmpInsp === undefined){
			$(".noEmpInsp").val(config.user.id);
			$(".noEmpInspNm").val(config.user.name);
		}
		if(result.dtInsp !== undefined){
			this.setState({dtInspDate : new Date(result.dtInsp)})
		}


		var safetyChkList = common[0].data.safetyChkList;
		
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
			td3= td3 + '<tr>';
			if(checkl[safetyChkList[count].kdInspItem] >=1 && prev != safetyChkList[count].kdInspItem){
				td3 = td3 + '<th rowspan="'+checkl[safetyChkList[count].kdInspItem]+'">'+safetyChkList[count].kdInspItem+'</th>';
				prev = safetyChkList[count].kdInspItem;
			}
			td3 += '<td>' + safetyChkList[count].nmInspItem + '</td>';
			td3 += '<td class="radio"><label><input type="radio" '+selected1+' name="type2_'+count+'"/><strong></strong><span>적합</span></label>';
			td3 += '<label><input type="radio" '+selected1+' name="type2_'+count+'"/><strong></strong><span>부적합</span></label>';
			td3 += '<label><input type="radio" '+selected1+' name="type2_'+count+'"/><strong></strong><span>해당없음</span></label></td>';
			td3 += '<td><input type="text" value="'+((safetyChkList[count].remark) ? safetyChkList[count].remark : '')+'" />';
			td3 += '<input type="hidden" value="'+((safetyChkList[count].seqSort) ? safetyChkList[count].seqSort : '')+'" />';
			td3 += '<input type="hidden" value="'+((safetyChkList[count].idCntr) ? safetyChkList[count].idCntr : '')+'" />';
			td3 += '<input type="hidden" value="'+((safetyChkList[count].cdCompany) ? safetyChkList[count].cdCompany : '')+'" />';
			td3 += '<input type="hidden" value="'+((safetyChkList[count].cdInspItem) ? safetyChkList[count].cdInspItem : '')+'" />';
			td3 += '</td>';
			td3 += '</tr>';
				
		}
		$("#safty_list tbody").append(td3);

		config.setWindowHeight();
	}

	componentDidMount() {
		config.fetchCommon("점검", "결과", "cdRslt");
		$(".footer").css("display","none");
		$(".map").css("display","none");
	
		config.header.title = "공급전검사 결과등록";
		$(".header_title").html( "공급전검사 결과등록");
		
		this.fetchDetail();
	}
	userSign = async () => {
		var gbFile = 'GIS_ENTRANT_01';
		var noFile = (this.info.noFile !== null) ? this.info.noFile : '';
		var cdKey1 = this.props.match.params.idPreinsp;
		var cdKey2 = 3;
		var cdKey3 = '';
		var cdKey4 = '';
		try {
			const imgs = await Promise.all([service.downloadSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4)]);
			var img = (service.url + imgs[0].data.result.imgsrc);

			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,img);
		} catch(err){
			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,"");
		}

	}


	btnSave = async () =>{
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idPreinsp: this.props.match.params.idPreinsp,
				idCntr: this.props.match.params.idCntr, 
				dtInsp: $(".dtInsp").val(),
				noEmpInspNm: $(".noEmpInspNm").val(), 
				noEmpInsp : $(".noEmpInsp").val(), 
				nmEntr: $(".nmEntr").val(),
				cdRslt: $(".cdRslt").val(),
				txNg: $(".txNg").val()
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
					idCntr: $(this).find("input:eq(5)").val(),
					cdCompany: $(this).find("input:eq(6)").val(),
					cdInspItem: $(this).find("input:eq(7)").val(),
					kdInspItem: $(this).find("th:eq(0)").html(),
					nmInspItem: $(this).find("td:eq(0)").html(),
					cdRslt: checked,
					remark: $(this).find("input:eq(3)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;


			const save = await Promise.all([service.saveRegulatorInspInfo(data)]);
			
			alert(save[0].data.message);
		}
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
						<h2>공급전검사 검사결과</h2>
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
								</colgroup>
								<tbody>
									<tr>
										<th>시설명</th>
										<td className="nmFcltBld"></td>
										<th>공급유형</th>
										<td className="gbCntrNm"></td>
										<th>시설구분</th>
										<td className="gbFcltNm"></td>
									</tr>
								</tbody>
							</table>
						</div>
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
										<th>점검일자</th>
										<td className="close21">
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
										<td >
											<input type="hidden" className="noEmpInsp nmSelect" />
											<input type="text" className="noEmpInspNm nmSelectName readonly" readOnly onClick={this.userInfo}/>
										</td>
										<th>시공업체</th>
										<td className="user_search">
												<input type="text" className="nmEntr" />
												<button type="button" onClick={this.userSign}>서명</button>
										</td>
									</tr>
									<tr>
										<th>점검결과</th>
										<td><select className="cdRslt" id="cdRslt"></select></td>
										<th>부적합내용</th>
										<td colSpan="3"><input type="text" className="txNg" /></td>
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

						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrievePreInspRsltInfo','공급전검사 결과')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePreInspRsltInfo;