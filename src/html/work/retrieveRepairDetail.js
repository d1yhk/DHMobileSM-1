/*global jMap*/
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

import btn_save from '../../image/btn-save.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveRepairDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveRepairDetail/'+this.props.match.params.idInsp){
			config.back.url.push('/retrieveRepairDetail/'+this.props.match.params.idInsp);
		}
		config.detail_file.index=this.props.match.params.idInsp;
		this.state = {
				startDate: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.info = {};
  }
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}
	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){
				const common = await Promise.all([ 
					service.getDetail()
				]);
				
				var result = common[0].data.result;
				this.info = result;
				
				$.each(result, function(key, value){
					if(key === "nmEmpCorr" || key === "noEmpCorr" || key === "dtCorr" || key === "contCorr" ){
						$("."+key).val(value);
					}else{
						$("."+key).html(value);
					}
					if(key === "status" && value !== '미의뢰' ){
						$(".status2").val(value);
					}
				});

				if(result.dtCorr !== undefined){
					this.setState({startDate : new Date(result.dtCorr)})
				}
			}
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	//저장
	btnSave = async () => {
		//alert( config.repair.id  );
		if(config.repair.id > 0 ){
			if(window.confirm("저장 하시겠습니까?")){
				var status = $(".status2").val();
				var noEmpCorr = $(".noEmpCorr").val();
				var dtCorr = $(".dtCorr").val();
				var contCorr = $(".contCorr").val();
				var id = config.repair.id
				var updUsr = config.user.id;
				var idInspType = this.info.idInspType;
				var idInsp = this.info.idInsp;

				const save = await Promise.all([ 
					service.updateRepairResultInfo(status, noEmpCorr, dtCorr, contCorr, id, updUsr, idInspType, idInsp)
				]);
				alert(save[0].data.message);
			}
		}else{
			alert("위치등록을 해주세요");
		}
	}

//위치등록 버튼은 (p1 = 시설물종류:result.nmKdFclt [ex-밸브 || 전기방식] , p2 = 시설물ID:result.facilId)로 이동후 지도에서 위치등록(레이어 입력) 

	areaRegist = () => {

		//$(".contents").css("display","none");
		//$(".map").css("display","block");
		//$(".footer").css("display","block");
		
		$(".header_title").html("지도");
		var p1 = $(".nmKdFclt").html();
		var p2 = this.info.facilId;
		//config.table.p2="filter=ROAD_NM:'"+td0.attr("data-raddr")+"',BULD_MNNM:'"+td0.attr("data-laddr")+"',BULD_SLNO:'"+td0.attr("data-saddr")+"'";
		if(p1!==""){
			jMap.map(p1, p2, function(result) {
				if (result) {          
					if(result.state==="success"){
						jMap.drawFeature('보수');

					}
					if (result.msg) {
						alert(result.msg);
					};
				};
			});
			this.props.history.push('/Map');
		}


	}
	
	bosuSave = async () => {
		//보수 정보 저장
		var id = config.repair.id;
		var siNm = config.repair.si;
		var bjdNm = config.repair.bdong;
		var hjdNm = config.repair.hdong;
		var riNm = config.repair.ri;
		var status = '의뢰';
		var idInspType = this.info.idInspType;
		var idInsp = this.info.idInsp;
		var init = 'Y';
		var crtUsr = config.user.id;


		const save = await Promise.all([ 
			service.updateGisRepairInfo(id,siNm,bjdNm,hjdNm,riNm,status,idInspType,idInsp,init,crtUsr)
		]);
		if(save[0].data.code==="1"){
			alert("보수지도 정보를 저장했습니다.");
			jMap.updateFeature("보수",id);
		}
		config.repair.save = 'no';
	}
	componentDidMount() {
		if(config.repair.save === 'yes'){
			this.bosuSave();
		}

		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");


		config.fetchCommon("보수작업","상태","status","입력");

		config.detail_file.param="idInsp";
		config.detail_file.folder1="work";
		config.detail_file.folder2="repairController";
		config.detail_file.name="retrieveRepairDetail";
		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>보수작업 상세</h2>
					</div>
					<div className="wrap">
						<h2 className="">보수요청 정보</h2>
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
									<th>시설번호</th>
									<td className="cdFclt"></td>
									<th>시설종류</th>
									<td className="nmKdFclt"></td>
									<th>시설명</th>
									<td className="nmFclt"></td>
								</tr>
								<tr>
									<th>상태</th>
									<td className="status"></td>
									<th>법정동</th>
									<td className="nmDong"></td>
									<th>주소</th>
									<td className="txAddr"></td>
								</tr>
								<tr>
									<th>검사구분</th>
									<td className="nmInspType"></td>
									<th>검사명</th>
									<td colSpan="3" className="nmInsp"></td>
								</tr>
								<tr>
									<th>검사일자/시간</th>
									<td><span className="dtInsp"></span><span className="tmInsp"></span></td>
									<th>검사자</th>
									<td colSpan="3" className="nmEmpInsp"></td>
								</tr>
								<tr>
									<th>등록일</th>
									<td className="crtDt"></td>
									<th>등록자</th>
									<td colSpan="3" className="crtUsrNm"></td>
								</tr>
								<tr>
									<th>부적합내용</th>
									<td colSpan="5" className="contUncorr"></td>
								</tr>
							</tbody>
							</table>
						</div>

						<h2 className="">보수결과 정보</h2>
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
									<th>상태</th>
									<td>
										<select className="status2" id="status">
											<option value="">선택</option>
										</select>
									</td>
									<th>입회자</th>
									<td ><input type="text" className="nmEmpCorr" /><input type="hidden" className="noEmpCorr" /></td>
									<th>개선일자</th>
									<td>
											<DatePicker
												 locale="ko" 
												id="dtCorr"
												className="datepicker dtCorr"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
									</td>
								</tr>
								<tr>
									<th>개선조치결과</th>
									<td colSpan="5" className="textarea"><textarea className="contCorr"></textarea></td>
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
						<button type="button" onClick={() => config.AttachMove(this.props,'retrieveRepairDetail','보수작업')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" onClick={this.areaRegist} ><img alt="" src={icon4} width="15" height="15" />위치등록</button>
						<button type="button" onClick={this.btnSave}><img alt="" src={btn_save} width="15" height="15" />저장</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveRepairDetail;