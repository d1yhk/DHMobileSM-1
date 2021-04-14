/*global hwindow*/
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupUser from '../../components/PopupUser';
import PopupSms from '../../components/PopupSms';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

import footer_email from '../../image/footer_email.png';
import footer_send from '../../image/footer_send.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveAptInspDetailFree extends Component {
  constructor(props) {
    super(props);
		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveAptInspDetailFree/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveAptInspDetailFree/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
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
		if(config.detail_file.index !== '' ){

			const common = await Promise.all([ 
				service.retrieveAptInspInfo(this.props.match.params.cdFclt, this.props.match.params.idInsp, this.props.match.params.idInspType)
			]);
			
			
			
			var result = common[0].data.result;
			this.infos = result;

			$.each(result, function(key, value){
				if(key==="cdRslt" || key==="dtInsp" || key==="contUncorr" || key==="entrant" || key==="idInsp" || key==="idInspType" || key==="cdFclt" || key==="roadAddr" || key==="lAddr" || key==="sAddr" || key==="tbInspType"){
					$("."+key).val(value);
				}else{
					$("."+key).html(value);
				}
			});
			if(result.dtInsp !== undefined){
				this.setState({startDate : new Date(result.dtInsp)})
			}

			if(result.noEmpInsp === undefined){
				$(".noEmpInsp").val(config.user.id);
				$(".noEmpInspNm").val(config.user.name);
			}
			var td = "";
			var selected1='';
			var selected2='';
			var selected3='';
			var safety_list = common[0].data.safetyChkList;
			console.log(safety_list);
			var checkl =[];
			for(var i=0; i < safety_list.length; i++){
				if( checkl[safety_list[i].kdInspItem] >= 1){
					checkl[safety_list[i].kdInspItem] += 1;
				}else{
					checkl[safety_list[i].kdInspItem] = 1;
				}
			}

			console.log(checkl);
			var prev='';
			for(var i = 0; i < safety_list.length; i++){
					selected1='';
					selected2='';
					selected3='';
					if(safety_list[i].cdRslt === '1'){
						selected1 = ' checked';
					}else if(safety_list[i].cdRslt === '2'){
						selected2 = ' checked';
					}else if(safety_list[i].cdRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<tr>';
					if(checkl[safety_list[i].kdInspItem] >=1 && prev != safety_list[i].kdInspItem){
						td = td + '<th rowspan="'+checkl[safety_list[i].kdInspItem]+'">'+safety_list[i].kdInspItem+'</th>';
						prev = safety_list[i].kdInspItem;
					}
					td = td + '<td>'+safety_list[i].nmInspItem+'</td>';
					td = td + '<td class="radio">';
					td = td + ' <input type="hidden" value="'+safety_list[i].seqSort+'" />';
					td = td + ' <input type="hidden" value="'+safety_list[i].idInspType+'" />';
					td = td + ' <input type="hidden" value="'+safety_list[i].idInsp+'" />';
					td = td + ' <input type="hidden" value="'+safety_list[i].cdCompany+'" />';
					td = td + ' <input type="hidden" value="'+safety_list[i].cdInspItem+'" />';
					td = td + ' <label><input type="radio" '+selected1+' name="type0_'+i+'"/><strong></strong><span>적합</span></label>';
					td = td + ' <label><input type="radio" '+selected2+' name="type0_'+i+'"/><strong></strong><span>부적합</span></label>';
					td = td + ' <label><input type="radio" '+selected3+' name="type0_'+i+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((safety_list[i].remark) ? safety_list[i].remark : '')+'" /></td>';
					td = td + '</tr>';
			}
			$("#safty_list tbody").html(td);

			td = "";
			var tb_list = common[0].data.tbSafetyChkList;
			for(var j = 0; j < tb_list.length; j++){
					selected1='';
					selected2='';
					selected3='';
					if(tb_list[j].cdRslt === '1'){
						selected1 = ' checked';
					}else if(tb_list[j].cdRslt === '2'){
						selected2 = ' checked';
					}else if(tb_list[j].cdRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<tr>';
					td = td + '<td data-id="'+tb_list[j].idInsp+'" data-idtype="'+tb_list[j].tbIdInspType+'">'+tb_list[j].seqSort+'</td>';
					td = td + '<td>'+tb_list[j].noUtil+'</td>';
					td = td + '<td>'+tb_list[j].nmUtil+'</td>';
					td = td + '<td>'+((tb_list[j].txPlc) ? tb_list[j].txPlc : '')+'</td>';
					td = td + '<td class="radio">';
					td = td + ' <input type="hidden" value="'+tb_list[j].avgVal+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].dtLst+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].lstVal+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].tbSeqSort+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].tbCdInspItem+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].sumVal+'" />';
					td = td + ' <input type="hidden" value="'+tb_list[j].cntVal+'" />';
					td = td + ' <label><input type="radio" '+selected1+' name="type1_'+j+'"/><strong></strong><span>적합</span></label>';
					td = td + ' <label><input type="radio" '+selected2+' name="type1_'+j+'"/><strong></strong><span>부적합</span></label>';
					td = td + ' <label><input type="radio" '+selected3+' name="type1_'+j+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((tb_list[j].qtyRslt1) ? tb_list[j].qtyRslt1 : '')+'" /></td>';
					td = td + '<td><input type="text" value="'+((tb_list[j].remark) ? tb_list[j].remark : '')+'" /></td>';
					td = td + '</tr>';
			}
			$("#tb_list tbody").html(td);

		


			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idInsp: this.infos.idInsp,//$(".idInsp").val(), 
				idInspType: this.infos.idInspType,//$(".idInspType").val(),
				dtInsp: $(".dtInsp").val(),
				noEmpInsp : $(".noEmpInsp").val(), 
				noEmpInspNm: $(".noEmpInspNm").val(), 
				cdRslt: $(".cdRslt").val(),
				contUncorr: $(".contUncorr").val(),
				entrant: $(".entrant").val()
			};
			var safetyChkList = [];
			$("#safty_list tbody").find("tr").each(function(){
				var checked = 3;
				if( $(this).find("input:eq(5)").prop("checked") ===true ){
					checked = 1;
				}else if( $(this).find("input:eq(6)").prop("checked") ===true ){
					checked = 2;
				}else if( $(this).find("input:eq(7)").prop("checked") ===true ){
					checked = 3;
				}
				safetyChkList.push({
					cdCompany: $(this).find("input:eq(3)").val(),
					cdInspItem: $(this).find("input:eq(4)").val(),
					cdRslt: checked,
					idInsp: $(this).find("input:eq(2)").val(),
					idInspType: $(this).find("input:eq(1)").val(),
					kdInspItem: $(this).find("td:eq(0)").html(),
					nmInspItem: $(this).find("td:eq(1)").html(),
					seqSort: $(this).find("input:eq(0)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;

			var tbSafetyChkList = [];
			$("#tb_list tbody").find("tr").each(function(){
				var checked = 3;
				if( $(this).find("input:eq(8)").prop("checked") ===true ){
					checked = 1;
				}else if( $(this).find("input:eq(9)").prop("checked") ===true ){
					checked = 2;
				}else if( $(this).find("input:eq(10)").prop("checked") ===true ){
					checked = 3;
				}
				tbSafetyChkList.push({
					avgVal: $(this).find("input:eq(0)").val(),
					cdRslt: checked,
					cntVal: $(this).find("input:eq(6)").val(),
					idInsp: $(this).find("td:eq(0)").attr("data-id"),
					lstVal: $(this).find("input:eq(2)").val(),
					nmUtil: $(this).find("td:eq(2)").html(),
					noUtil: $(this).find("td:eq(1)").html(),
					qtyRslt1: $(this).find("input:eq(10)").val(),
					seqSort: $(this).find("td:eq(0)").html(),
					sumVal: $(this).find("input:eq(5)").val(),
					tbCdInspItem: $(this).find("input:eq(4)").val(),
					tbIdInspType: $(this).find("td:eq(0)").attr("data-idtype"),
					tbSeqSort: $(this).find("input:eq(3)").val()
				});
			});
			data['tbSafetyChkList'] = tbSafetyChkList;

			const save = await Promise.all([service.saveAptInspInfo(data)]);
			
			alert(save[0].data.message);
		}

	}
	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");
		
		config.fetchCommon("점검","결과","cdRslt");
		
		$(document).off("click","#tb_list tr");
		$(document).on("click","#tb_list tr",function(){
			$("#tb_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			$("#tb_five td:eq(0)").html($(this).find("input:eq(0)").val());
			$("#tb_five td:eq(1)").html($(this).find("input:eq(0)").val());
			$("#tb_five td:eq(2)").html($(this).find("input:eq(0)").val());
		});
		this.fetchDetail();
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	sendSms = () =>{
		//smsSend
		$(".sms-form").css("display","block");
	}

	userSign = async () => {
		var gbFile = 'GIS_ENTRANT_01';
		var noFile = (this.infos.noFile !== null) ? this.infos.noFile : '';
		var cdKey1 = this.infos.idInsp;
		var cdKey2 = 1;
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
	render() { 
		return (
			<div className="contents">
				<PopupUser />
				<PopupSms />
				<div className="detail">
					<div className="tab tab1">
						<h2>공동주택자율검사 검사등록</h2>
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
										<th>동수</th>
										<td className="cntDont"></td>
										<th>총세대수</th>
										<td className="cntHsTot"></td>
									</tr>
									<tr>
										<th>밸브</th>
										<td className="cntVb"></td>
										<th>T/B</th>
										<td className="cntTb"></td>
										<th>수취기</th>
										<td className="cntWater"></td>
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
										<td >
											<input type="hidden" className="noEmpInsp nmSelectId"/>
											<input type="text" className="noEmpInspNm nmSelect readonly"  readOnly onClick={this.userInfo}/>
										</td>
										<th>검사결과</th>
										<td><select id="cdRslt" className="cdRslt"></select></td>
									</tr>
									<tr>
										<th>부적합내용</th>
										<td colSpan="3"><input type="text" className="contUncorr"/></td>
										<th>입회자</th>
										<td className="user_search"><input type="text" className="entrant"/><button type="button" onClick={this.userSign}>서명</button></td>
									</tr>
								</tbody>
							</table>
							<input type="hidden" className="idInsp" />
							<input type="hidden" className="idInspType" />
							<input type="hidden" className="cdFclt" />
							<input type="hidden" className="roadAddr" />
							<input type="hidden" className="lAddr" />
							<input type="hidden" className="sAddr" />
							<input type="hidden" className="tbInspType" />
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<table id="safty_list">
								<thead>
									<tr>
										<th className="text-center" style={{width:'120px'}}>항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'250px'}}>검사결과</th>
										<th className="text-center">메모</th>
									</tr>
								</thead>
								<tbody>

								</tbody>
							</table>
						</div>
			
						<h2>전기방식 점검표</h2>
						<div className="box info">
							<table id="tb_five">
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
										<th>5년 평균 전위측정값</th>
										<td></td>
										<th>전검사일</th>
										<td></td>
										<th>측정값</th>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box info">
							<table id="tb_list">
								<colgroup>
									<col width="40px"/>
									<col width="80px"/>
									<col width="80px"/>
									<col width="80px"/>
									<col width="200px"/>
									<col width="100px"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th>순번</th>
										<th>TB코드</th>
										<th>TB시설명</th>
										<th>위치</th>
										<th>검사결과</th>
										<th>측정값</th>
										<th>비고</th>
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

		{/*<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,0)}><img alt="" src={footer_send} width="15" height="15" />개선권고서 발송</button>*/}
						<button type="button" className="btn_map"  onClick={() => this.sendSms()} ><img alt="" src={footer_email} width="15" height="15" />개선권고서 발송</button>

						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAptInspDetailFree','공동주택 자율검사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

						<button type="button" className="btn_file" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveAptInspDetailFree;