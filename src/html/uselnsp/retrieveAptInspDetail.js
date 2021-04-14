
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupUser from '../../components/PopupUser';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveAptInspDetail extends Component {
  constructor(props) {
    super(props);
		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveAptInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveAptInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
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
			this.infos = result
			$.each(result, function(key, value){
				if(key==="cdRslt" || key==="dtInsp" || key==="contUncorr" ){
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
			var checkl =[];
			for(var i=0; i < safety_list.length; i++){
				if( checkl[safety_list[i].kdInspItem] >= 1){
					checkl[safety_list[i].kdInspItem] += 1;
				}else{
					checkl[safety_list[i].kdInspItem] = 1;
				}
			}
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
					td = td + ' <label><input type="radio" '+selected1+' name="type0_'+safety_list[i].seqSort+'"/><strong></strong><span>적합</span></label>';
					td = td + ' <label><input type="radio" '+selected2+' name="type0_'+safety_list[i].seqSort+'"/><strong></strong><span>부적합</span></label>';
					td = td + ' <label><input type="radio" '+selected3+' name="type0_'+safety_list[i].seqSort+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((safety_list[i].qtyRslt1) ? safety_list[i].qtyRslt1 : '')+'" /></td>';
					td = td + '<td><input type="text" value="'+((safety_list[i].remark) ? safety_list[i].remark : '')+'" /></td>';
					td = td + '</tr>';
			}
			$("#safty_list tbody").html(td);

			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idInsp: $(".idInsp").val(), 
				idInspType: $(".idInspType").val(),
				dtInsp: $(".dtInsp").val(),
				noEmpInsp : $(".noEmpInsp").val(),							//Ex-10052, 10051, 10045
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
					seqSort: $(this).find("input:eq(0)").val(),
					qtyRslt1: $(this).find("input:eq(8)").val(),
					remark: $(this).find("input:eq(9)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;


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

		this.fetchDetail();
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
						<h2>공동주택 정기검사 검사등록</h2>
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
										<th>동수</th>
										<td className="cntDont"></td>
									</tr>
									<tr>
										<th>완성검사일</th>
										<td className="dtFstInsp"></td>
										<th>총세대수</th>
										<td className="cntHsTot"></td>
										<th>밸브</th>
										<td className="cntVb"></td>
									</tr>
									<tr>
										<th>T/B</th>
										<td className="cntTb"></td>
										<th>수취기</th>
										<td className="cntWater"></td>
										<th>사용자 공급관</th>
										<td className="qtyLen"></td>
									</tr>
									<tr>
										<th>체적</th>
										<td className="qtyVol"></td>
										<th>최종기밀검사일</th>
										<td className="dtGastight"></td>
										<th>가스공급일</th>
										<td className="dtSply"></td>
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
										<th>검사자</th>
										<td className="">
											<input type="hidden" className="noEmpInsp nmSelect" />
											<input type="text" className="noEmpInspNm nmSelectName readonly" readOnly onClick={this.userInfo}/>
										</td>
										<th>점검결과</th>
										<td><select id="cdRslt" className="cdRslt"></select></td>
									</tr>
									<tr>
										<th>부적합내용</th>
										<td colSpan="5"><input type="text" className="contUncorr"/></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<table id="safty_list">
								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'250px'}}>검사결과</th>
										<th className="text-center" style={{width:'80px'}}>측정값</th>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAptInspDetail','공동주택 정기검사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_file" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveAptInspDetail;