
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

class retrieveUseInspRsltDetail extends Component {
	
  constructor(props) {
    super(props);
		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveUseInspRsltDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveUseInspRsltDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
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
			service.retrieveCorrRsltInfo(this.props.match.params.cdFclt,this.props.match.params.idInsp,this.props.match.params.idInspType)
		]);
		var result = info[0].data.result;
		this.infos = result;
		
		
		$.each(result, function(key, value){
			if(key==="cdRslt" || key==="contCorr" || key==="noEmpCorr" || key==="noEmpCorrNm"){
				$("."+key).val(value);
			}else{
				if(typeof $("."+key).val() !== undefined){
					$("."+key).val(value);
				}
				if(typeof $("."+key).html() !== undefined){
					$("."+key).html(value);
				}
			}
		});
		if(result.noEmpCorrNm === undefined){
			$(".noEmpCorr").val(config.user.id);
			$(".noEmpCorrNm").val(config.user.name);
		}
		console.log(result);
		if(result.dtCorr !== undefined){
			this.setState({startDate : new Date(result.dtCorr)})
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
				td = td + '<th rowspan="'+checkl[sList[count].kdInspItem]+'">'+sList[count].kdInspItem+'</th>';
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
			if(this.props.match.params.idInspType==="2050"){
				td = td + '<td><input type="text" value="'+((sList[count].qtyRslt1) ? sList[count].qtyRslt1 : '')+'" /></td>';
				td = td + '<td><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
			}else{
				td = td + '<td><input type="hidden" /><input type="text" value="'+((sList[count].remark) ? sList[count].remark : '')+'" /></td>';
			}
			td = td + '</tr>';
		}

		$("#safty_list tbody").html(td);

		var lAddr = "";
		if(result.lAddr){
			lAddr = ",BULD_MNNM:'"+result.lAddr+"'";
		}
		var sAddr = "";
		if(result.sAddr){
			sAddr = ",BULD_SLNO:'"+result.sAddr+"'";
		}

		config.table.p1="건물";
		config.table.p2="filter=ROAD_NM:'"+result.roadAddr+"'"+lAddr+sAddr;

		
		config.table.attach1='개선조치결과';
		config.table.attach2=result.idInspType;
		config.table.attach3=result.idInsp;
		config.table.attach4=result.cdFclt;

		config.table.change1 = result.id;
		config.table.change2 = "08";
	
		config.setWindowHeight();
	}


	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data = {
				idInsp: this.props.match.params.idInsp, 
				idInspType: this.props.match.params.idInspType,
				cdFclt: this.infos.cdFclt,
				dtCorr: $("#ruird .dtCorr").val(), 
				noEmpCorr: $("#ruird .noEmpCorr").val(), 
				noEmpCorrNm: $("#ruird .noEmpCorrNm").val(), 
				contCorr: $("#ruird .contCorr").val(),
				remark: $("#ruird .remark").val(),
				entrant: $("#ruird .entrant").val(),
			};
			var safetyChkList = [];
			$("#ruird #safty_list tbody").find("tr").each(function(){
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
					kdInspItem: $(this).find("input:eq(2)").html(),
					nmInspItem: $(this).find("input:eq(6)").html(),
					seqSort: $(this).find("input:eq(0)").val(),
					qtyRslt1: $(this).find("input:eq(10)").val(),
					remark: $(this).find("input:eq(11)").val()
				});
			});
			data['safetyChkList'] = safetyChkList;


			const save = await Promise.all([service.saveCorrRsltInfo(data)]);
			
			alert(save[0].data.message);
		}

	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");


		config.fetchCommon("점검","결과","cdRslt");
		config.fetchCommon("개선조치","결과","contCorr");

		this.fetchDetail();
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}

	userSign1 = async () => {
		var gbFile = 'GIS_ENTRANT_01';
		var noFile = (this.infos.noFile !== null) ? this.infos.noFile : '';
		var cdKey1 = this.props.match.params.idInsp;
		var cdKey2 = 2;
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
		
		let html1 ;
		let html2 ;
		if(this.props.match.params.idInspType==="2050"){
			html1= <col width="200"/>;
			html2= <th className="text-center" style={{width:'80px'}}>측정값</th>;
		}

		return (
			<div className="contents" id="ruird">
				<PopupUser />
				<div className="detail">
					<div className="tab tab1">
						<h2>개선조치 결과등록</h2>
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
								</colgroup>
								<tbody>
									<tr>
										<th>시설구분</th>
										<td className="gbFcltNm"></td>
										<th>검사구분</th>
										<td className="inspGubunNm"></td>
									</tr>
									<tr>
										<th>시설명</th>
										<td className="cdFclt"></td>
										<th>검사일자</th>
										<td className="dtInsp"></td>
									</tr>
									<tr>
										<th>검사자</th>
										<td className="noEmpInspNm"></td>
										<th>부적합내용</th>
										<td className="contUncorr"></td>
									</tr>
								</tbody>
							</table>
						</div>
						
						<h2>개선조치 결과등록</h2>
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
										<th>개선일자</th>
										<td>
											<DatePicker
												 locale="ko" 
												id="dtCorr"
												className="datepicker dtCorr"
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
										<th>재검사자</th>
										<td>
											<input type="hidden" className="noEmpCorr nmSelectId"/>
											<input type="text" className="noEmpCorrNm nmSelect readonly" readOnly onClick={this.userInfo}/>
										</td>
									</tr>
									<tr>
										<th>개선조치 결과</th>
										<td><select id="contCorr" className="contCorr"></select></td>
										<th>입회자</th>
										<td className="user_search">
											<input type="text" className="entrant" />
											<button type="button" onClick={()=>this.userSign1(1)}>서명</button>
										</td>
									</tr>
									<tr>
										<th>메모</th>
										<td colSpan="3"><input type="text" className="remark"/></td>
									</tr>
								</tbody>
							</table>
							<input type="hidden" className="noEmpInsp" />
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
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center" style={{width:'250px'}}>검사결과</th>
										{html2}
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
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAutoPeriodicInspDetail','정압기 자율검사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveUseInspRsltDetail;