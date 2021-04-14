/*global jMap*/ 
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import PopupUser from '../../components/PopupUser';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon10 from '../../image/icon10.png';
import icon11 from '../../image/icon11.png';
import close from '../../image/close.png';
import close_x from '../../image/close_x.png';
import close_re from '../../image/close_re.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveAutoPeriodicInspDetail extends Component {
	
  constructor(props) {
    super(props);
		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveAutoPeriodicInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType+"/"+this.props.match.params.inspGubunNm){
			config.back.url.push('/retrieveAutoPeriodicInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType+"/"+this.props.match.params.inspGubunNm);
		}
		config.detail_file.index=this.props.match.params.idx;
		this.infos={};
  }

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	
	//상세정보
	fetchDetail = async () => {
		const info = await Promise.all([ 
			service.retrieveAutoPeriodicInspInfo(this.props.match.params.cdFclt,this.props.match.params.idInsp,this.props.match.params.idInspType)
		]);
		var result = info[0].data.result;

		this.infos = result;
		$.each(result, function(key, value){
			if(key === "cdRslt"){
				$("."+key).val(value);
			}else{
				$("."+key).html(value);
			}
		});
		if(this.infos.dtInsp !== undefined){
			this.setState({startDate : new Date(this.infos.dtInsp)})
		}



		var td = '';
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
			td = td + '<tr>';
			if(checkl[sList[count].kdInspItem] >=1 && prev != sList[count].kdInspItem){
				td = td + '<th rowspan="'+checkl[sList[count].kdInspItem]+'" class="text-center">'+sList[count].kdInspItem+'</th>';
				prev = sList[count].kdInspItem;
			}
			td = td + '<td>'+sList[count].nmInspItem+'</td>';
			td = td + '<td class="radio">';
			td = td + '<input type="hidden" value="'+sList[count].seqSort+'"/>';
			td = td + '<input type="hidden" value="'+sList[count].idInspType+'" />';
			td = td + '<input type="hidden" value="'+sList[count].kdInspItem+'" />';
			td = td + '<input type="hidden" value="'+sList[count].idInsp+'" />';
			td = td + '<input type="hidden" value="'+sList[count].cdCompany+'" />';
			td = td + '<input type="hidden" value="'+sList[count].cdInspItem+'" />';
			td = td + '<input type="hidden" value="'+sList[count].nmInspItem+'" />';
			td = td + '	<label><input type="radio" '+selected1+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>적합</span></label>';
			td = td + '	<label><input type="radio" '+selected2+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>부적합</span></label>';
			td = td + '	<label><input type="radio" '+selected3+' name="type_'+sList[count].seqSort+'"/><strong></strong><span>해당없음</span></label>';
			td = td + '</td>';
			td = td + '<td><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
			td = td + '</tr>';
		}

		$("#safty_list tbody").html(td);
		config.table.p1="정압기";
		config.table.p2=result.id;
	
		config.table.attach1='정압기검사';
		config.table.attach2=result.idInspType;
		config.table.attach3=result.idInsp;
		config.table.attach4=result.cdFclt;

		config.table.change1 = result.id;
		config.table.change2 = "08";
	
		config.setWindowHeight();
	}

	//sacada이벤트
	popupScada = async () => { 
		$(".popup").css("display","block");
		$("#popupContents tbody").html("");
		try {	
			const common = await Promise.all([ 
				service.retrieveScadaEventInfo(this.infos.cdFclt)
			]);
			
			
			
		
			var result = common[0].data.result;
				var td = '<tr>';
				td = td + '<td>'+((result.prs1HbDesc) ? result.prs1HbDesc : '')+'</td>';
				td = td + '<td>'+((result.prs2HbDesc) ? result.prs2HbDesc : '')+'</td>';
				td = td + '<td>'+((result.gasHbDesc) ? result.gasHbDesc : '')+'</td>';
				td = td + '<td>'+((result.ssv1HbDesc) ? result.ssv1HbDesc : '')+'</td>';
				td = td + '<td>'+((result.ssv2HbDesc) ? result.ssv2HbDesc : '')+'</td>';
				td = td + '<td>'+((result.pwrHbDesc) ? result.pwrHbDesc : '')+'</td>';
				td = td + '<td>'+((result.doorHbDesc) ? result.doorHbDesc : '')+'</td>';
				td = td + '<td>'+((result.rtuHbDesc) ? result.rtuHbDesc : '')+'</td>';
				td = td + '<td>'+((result.lineHbDesc) ? result.lineHbDesc : '')+'</td>';
				td = td + '<td>'+((result.dbTime) ? result.dbTime : '')+'</td>';
				td = td + '</tr>';
				$("#popupContents tbody").html(td);

			if(result.length === 0 || !result){
				$("#popupContents tbody").html('<tr><td colspan="10">검색된 내용이 없습니다.</td></tr>');
			}
		} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="10">검색된 내용이 없습니다.</td></tr>');
		}
	}


	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idInsp: $(".idInsp").val(), 
				idInspType: $(".idInspType").val(),
				id: $(".id").val(),
				cdFclt: $(".cdFclt").val(),
				noEmpInspNm: $(".noEmpInspNm").val(), 
				noEmpInsp: $(".noEmpInsp").val(), 
				dtInsp: $(".dtInsp").val(),
				cdRslt: $(".cdRslt").val(),
				contUncorr: $(".contUncorr").val()
			};
			var safetyChkList = [];
			$("#safty_list tbody").find("tr").each(function(){
				var checked = 3;
				if( $(this).find("input:eq(7)").prop("checked") ===true ){
					checked = 1;
				}else if( $(this).find("input:eq(8)").prop("checked") ===true ){
					checked = 2;
				}else if( $(this).find("input:eq(9)").prop("checked") ===true ){
					checked = 3;
				}
				safetyChkList.push({
					cdCompany: $(this).find("input:eq(4)").val(),
					cdInspItem: $(this).find("input:eq(5)").val(),
					cdRslt: checked,
					idInsp: $(this).find("input:eq(3)").val(),
					idInspType: $(this).find("input:eq(1)").val(),
					kdInspItem: $(this).find("input:eq(2)").val(),
					nmInspItem: $(this).find("input:eq(6)").val(),
					seqSort: $(this).find("input:eq(0)").val(),
					remark: $(this).find("input:eq(10)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;


			const save = await Promise.all([service.saveAutoPeriodicInspInfo(data)]);
			
			alert(save[0].data.message);

		}

	}


	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");


		config.fetchCommon("점검","결과","cdRslt");

		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<PopupUser />

				<div className="popup">
					<div className="popup-box table">
						<h2>SCADA 이벤트 <button type="button" className="close_popup"><img src={close} width="20" height="20" alt="" /></button></h2>

						<div id="popupContents" className="martop20" >
							<table>
								<thead>
									<tr>
										<th>1차압력</th>
										<th>2차압력</th>
										<th>가스누설</th>
										<th>SSV1</th>
										<th>SSV2</th>
										<th>정전</th>
										<th>정압기 도어</th>
										<th>RTU 도어</th>
										<th>선로</th>
										<th>조회시간</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
							<div className="popup_btn">
								<button type="button" className="close_popup close_x"><img src={close_x} width="16" height="16" alt="" />닫기</button>
								<button type="button" className="close_re"  onClick={this.popupScada}><img src={close_re} width="16" height="16" alt="" />새로고침</button>
							</div>
						</div>
					</div>
				</div>

				<div className="detail">
					<div className="tab tab1">
						<h2>{this.props.match.params.inspGubunNm}</h2>
					</div>
					<div className="wrap">
						<h2>시설정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>시설명</th>
										<td className="nmFclt"></td>
										<th>주소</th>
										<td className="txAddr"></td>
										<th>시공감리일</th>
										<td className="dtLaw"></td>
									</tr>
									<tr>
										<th>정압기 모델</th>
										<td className="cdModelNm"></td>
										<th>정압기 규격</th>
										<td className="specGovNm"></td>
										<th>RTU 모델</th>
										<td className="typeRtuNm"></td>
									</tr>
								</tbody>
							</table>
						</div>
						
						<h2>정압기 자율검사</h2>
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
										<th>점검자</th>
										<td>
											<input type="hidden" className="noEmpInsp nmSelectId" />
											<input type="text"  className="noEmpInspNm nmSelect readonly" readOnly  onClick={this.userInfo}/>
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
							<input type="hidden" className="id" />
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<table id="safty_list">
								<thead>
									<tr>
										<th className="text-center" style={{width:'150px'}}>항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'250px'}}>검사결과</th>
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
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAutoPeriodicInspDetail',this.props.match.params.inspGubunNm)}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_scada" onClick={this.popupScada} ><img alt="" src={icon11} width="15" height="15" />SCADA이벤트</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveAutoPeriodicInspDetail;