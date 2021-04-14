
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

class retrieveDisassemblyInspInfo extends Component {
  constructor(props) {
    super(props);
		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);

		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveDisassemblyInspInfo/'+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveDisassemblyInspInfo/'+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
		}
		//config.detail_file.index=this.props.match.params.idx;
		this.result={};
  }

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	//상세정보
	fetchDetail = async () => { 
		//if(config.detail_file.index !== '' ){

			const common = await Promise.all([ 
				service.retrieveDisassemblyInspInfo(this.props.match.params.idInsp,this.props.match.params.idInspType)
			]);
			
			
			
			var result = common[0].data.result;
			this.result = result;

			$.each(result, function(key, value){
				if(key === 'cdRslt' || key === 'contReg' || key === 'contFilter'){
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
			if(this.result.dtInsp !== undefined){
				this.setState({startDate : new Date(this.result.dtInsp)})
			}



			if(this.props.match.params.idInspType === "1041"){
				config.table.p1="정압기";
			}else{
				config.table.p1="사용자정압기";
			}
			config.table.p2=result.id;

			config.setWindowHeight();

		//}else{
		//	alert(" 리스트를 선택해주세요");
		//}
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			this.result['contReg'] = $(".contReg").val();
			this.result['contFilter'] = $(".contFilter").val();
			this.result['noEmpInspNm'] = $(".noEmpInspNm").val();
			this.result['noEmpInsp'] = $(".noEmpInsp").val();
			this.result['dtInsp'] = $(".dtInsp").val();
			this.result['cdRslt'] = $(".cdRslt").val();
			this.result['contUncorr'] = $(".contUncorr").val();

			const save = await Promise.all([service.saveDisassemblyInspInfo(this.result)]);
			
			alert(save[0].data.message);
		}
	}
	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");
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

	render() { 
		return (
			<div className="contents">
				<PopupUser />

				<div className="detail">
					<div className="tab tab1">
						<h2>정압기 분해점검</h2>
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
										<th>시설명</th>
										<td className="nmFclt"></td>
										<th>주소</th>
										<td className="txAddr"></td>
									</tr>
									<tr>
										<th>시공감리일</th>
										<td className="dtLaw"></td>
										<th>조정기 모델</th>
										<td className="cdModelNm"></td>
									</tr>
									<tr>
										<th>필터모델</th>
										<td className="modelFilterNm"></td>
										<th>전 분해점검일</th>
										<td className="preDtInsp"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2>분해점검 결과 등록</h2>
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
										<th>조정기</th>
										<td><select id="contReg" className="contReg">
											<option value="1">적합</option>
											<option value="2">부적합</option>
										</select></td>
										<th>필터</th>
										<td><select id="contFilter" className="contFilter">
											<option value="1">적합</option>
											<option value="2">부적합</option>
										</select></td>
										<th>점검자</th>
										<td >
											<input type="hidden" className="noEmpInsp nmSelectId" />
											<input type="text"  className="noEmpInspNm nmSelect readonly" readOnly  onClick={this.userInfo}/>
										</td>
									</tr>

									<tr>
										<th>점검일자</th>
										<td className="form_date">
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
										<th>점검결과</th>
										<td><select id="cdRslt" className="cdRslt"></select></td>
										<th>분해점검 내용</th>
										<td><input type="text" className="contUncorr"/></td>
									</tr>
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
						<button type="button" className="btn_file" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
						<button type="button" ><img alt="" src={icon2} width="15" height="15" />점검사진</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveDisassemblyInspInfo;