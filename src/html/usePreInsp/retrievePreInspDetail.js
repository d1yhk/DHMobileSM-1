
import React, { Component } from 'react';

import * as config from '../../components/config';
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


class retrievePreInspDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//dtInspDate: new Date(),
			//dtSplyDate: new Date(),
			//dtChgInspDate: new Date()
		};
		this.dtInspDateChange = this.dtInspDateChange.bind(this);
		this.dtSplyDateChange = this.dtSplyDateChange.bind(this);
		this.dtChgInspDateChange = this.dtChgInspDateChange.bind(this);

		if(config.back.url[config.back.url.length-1] !== '/retrievePreInspDetail/'+this.props.match.params.idx){
				config.back.url.push('/retrievePreInspDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
		this.info={}
	}

	dtInspDateChange(date) { this.setState({ dtInspDate: date }); }
	dtSplyDateChange(date) { this.setState({ dtSplyDate: date }); }
	dtChgInspDateChange(date) { this.setState({ dtChgInspDate: date }); }

    //상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			
			const common = await Promise.all([ 
				service.getDetail()
			]);
				
			
			
			
			var result = common[0].data.result;
			this.info = result;
			var t= this;
			$.each(result, function(key, value){
				$("."+key).html(value);
			});

			if(result.dtInsp !== undefined){
				this.setState({dtInspDate : new Date(result.dtInsp)})
			}
			if(result.dtSply !== undefined){
				this.setState({dtSplyDate : new Date(result.dtSply)})
			}
			if(result.dtChgInsp !== undefined){
				this.setState({dtChgInspDate : new Date(result.dtChgInsp)})
			}

			$(".detailName").html(this.info.nmGbFclt+' 시설정보');
			if (this.info.nmGbFclt === '공동주택') {
				$("#preInspDetail1").css("display", "block");
				const common2 = await Promise.all([ 
					service.retrievePreInspDetail("retrieveAptWithPreInsp", this.info.cdFcltBld)
				]);
				let result = common2[0].data.result;
				$.each(result, function(key, value){
					if(key === "noGov" ||  key === "dtSply" || key === "dtChgInsp" || key === "nmMng" || key === "noTelMng" || key === "grGastight" || key === "ynReginsp"){
						console.log("1" + key+" : " +value)
						$("#preInspDetail1 ."+key).val(value);
					}else{
						$("#preInspDetail1 ."+key).html(value);
					}
				});

			} else if (this.info.nmGbFclt === '특정사용시설') {
				$("#preInspDetail2").css("display", "block");
				const common2 = await Promise.all([ 
					service.retrievePreInspDetail("retrieveSpecialFacilWithPreInsp", this.info.cdFcltBld)
				]);
				let result = common2[0].data.result;
				$.each(result, function(key, value){
					if(key === "noGov" ||  key === "dtSply" || key === "dtChgInsp" || key === "mmInsp" || key === "nmSafe" || key === "noTelSafe" || key === "ynSafe" || key === "ynMultiuse"){
						$("#preInspDetail2 ."+key).val(value);
					}else{
						$("#preInspDetail2 ."+key).html(value);
					}
				});

			} else if (this.info.nmGbFclt === '일반사용시설') {
				$("#preInspDetail3").css("display", "block");

				const common2 = await Promise.all([ 
					service.retrievePreInspDetail("retrieveUseFacilWithPreInsp", this.info.cdFcltBld)
				]);
				let result = common2[0].data.result;
				$.each(result, function(key, value){
					if(key === "noGov" || key === "dtInsp" || key === "dtSply" || key === "dtChgInsp"){
						if(key === "dtInsp"){
							t.setState({ dtInspDate: new Date(value) })
						}else if(key === "dtSply"){
							t.setState({ dtSplyDate: new Date(value) })
						}else if(key === "dtChgInsp"){
							t.setState({ dtChgInspDate: new Date(value) })
						}else{
							$("#preInspDetail3 ."+key).val(value);
						}
					}else{
						$("#preInspDetail3 ."+key).html(value);
					}
				});

			}


			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			config.setWindowHeight();
            
		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
  btnSave = async () =>{
		if(window.confirm("저장 하시겠습니까?")){
			var data = {};
			if (this.info.nmGbFclt === '공동주택') {
				var cdFcltBld = this.info.cdFcltBld;
				var noGov = $("#preInspDetail1 .noGov").val();
				var dtSply = $("#preInspDetail1 .dtSply").val();
				var dtChgInsp = $("#preInspDetail1 .dtChgInsp").val();
				var nmMng = $("#preInspDetail1 .nmMng").val();
				var noTelMng = $("#preInspDetail1 .noTelMng").val();
				var grGastight = $("#preInspDetail1 .grGastight").val();
				var ynReginsp = $("#preInspDetail1 .ynReginsp").val();
				
				data = {noGov:noGov,dtSply:dtSply,dtChgInsp:dtChgInsp,nmMng:nmMng,noTelMng:noTelMng,grGastight:grGastight,ynReginsp:ynReginsp,cdFcltBld:cdFcltBld}


			}else if(this.info.nmGbFclt === '특정사용시설'){
				var cdFcltBld = this.info.cdFcltBld;
				var noGov = $("#preInspDetail2 .noGov").val();
				var dtSply = $("#preInspDetail2 .dtSply").val();
				var dtChgInsp = $("#preInspDetail2 .dtChgInsp").val();
				var mmInsp  = $("#preInspDetail2 .mmInsp").val();
				var nmSafe = $("#preInspDetail2 .nmSafe").val();
				var noTelSafe = $("#preInspDetail2 .noTelSafe").val();
				var ynSafe = $("#preInspDetail2 .ynSafe").val();
				var ynMultiuse = $("#preInspDetail2 .ynMultiuse").val();
				
				data = {noGov:noGov,dtSply:dtSply,dtChgInsp:dtChgInsp,mmInsp:mmInsp,nmSafe:nmSafe,noTelSafe:noTelSafe,ynSafe:ynSafe,ynMultiuse:ynMultiuse,cdFcltBld:cdFcltBld}


			}else if(this.info.nmGbFclt === '일반사용시설'){
				var cdFcltBld = this.info.cdFcltBld;
				var noGov = $("#preInspDetail3 .noGov").val();
				var dtSply = $("#preInspDetail3 .dtSply").val();
				var dtChgInsp = $("#preInspDetail3 .dtChgInsp").val();
				var dtInsp  = $("#preInspDetail3 .dtInsp").val();
				
				data = {noGov:noGov,dtSply:dtSply,dtChgInsp:dtChgInsp,dtInsp:dtInsp,cdFcltBld:cdFcltBld}
			}
			const save = await Promise.all([ 
				service.updateUseFacilInfoWithPreInsp( data)
			]);
			alert(save[0].data.message);
		}

	}

	optionGovListWithPreInsp = async () =>{
			const option = await Promise.all([ 
				service.retrieveGovListWithPreInsp()
			]);
			var re = option[0].data.result;
			for(var i=0; i <re.length; i++){
				$(".noGov").append('<option value="'+re[i].lcode+'">'+re[i].lvalue+'</option>');
			}

			this.fetchDetail();
	}



	componentDidMount() {
		$("#preInspDetail1").css("display", "none");
		$("#preInspDetail2").css("display", "none");
		$("#preInspDetail3").css("display", "none");
		this.optionGovListWithPreInsp();
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급전검사";
		$(".header_title").html( "공급전검사");
		
		config.fetchCommon("ERP","CG_U_00049","grGastight");
		config.fetchCommon("ERP","CG_Z_00018","ynReginsp");

		config.fetchCommon("ERP","CG_U_00035","mmInsp");
		config.fetchCommon("ERP","CG_Z_00018","ynSafe");
		config.fetchCommon("ERP","CG_Z_00018","ynMultiuse");

		config.detail_file.param="idPreinsp";
		config.detail_file.folder1 = "usePreInsp";
		config.detail_file.folder2 = "preInspController";
		config.detail_file.name = "retrievePreInspDetail";
		
		
    }

    render() {
        return (
            <div className="contents">
				<div className="detail">
				    <div className="tab tab1">
						<h2>공급전검사 상세정보</h2>
					</div>
					<div className="wrap">
                        <h2>기본정보</h2>
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
									<th>시설코드</th>
									<td className="cdFcltBld"></td>
									<th>시설명</th>
									<td className="nmFcltBld"></td>
									<th>시설구분</th>
									<td className="nmGbFclt"></td>
								</tr>
								<tr>
									<th>사용여부</th>
									<td className="nmStUse"></td>
									<th>공급유형</th>
									<td className="nmGbCntr"></td>
									<th>주택구분</th>
									<td className="nmGbHs"></td>
								</tr>
								<tr>
									<th>주소</th>
									<td className="txAddr"></td>
									<th>건물번호</th>
									<td className="cdBld"></td>
									<th>시공업체</th>
									<td className="nmCom"></td>
								</tr>
								<tr>
									<th>사업자번호</th>
									<td className="noCompany"></td>
									<th>시공관리자</th>
									<td className="nmConstMng"></td>
									<th>가스자격증</th>
									<td className="licenseConst"></td>
								</tr>
								<tr>
									<th>압력</th>
									<td className="nmPress"></td>
									<th>총세대수</th>
									<td className="cntHsTot"></td>
									<th>사용세대수</th>
									<td className="cntHs"></td>
								</tr>
								<tr>
									<th>공시기간(시점)</th>
									<td className="dtConstFr"></td>
									<th>공사기간(종점)</th>
									<td className="dtConstTo"></td>
									<th>공사ID</th>
									<td className="idConst"></td>
								</tr>
								<tr>
									<th>용도</th>
									<td className="txUse"></td>
									<th>완성검사일</th>
									<td className="dtFstInsp"></td>
									<th>월사용예정량</th>
									<td className="qtyUse"></td>
								</tr>
								<tr>
									<th>입상밸브수량</th>
									<td className="cntStdpipe"></td>
									<th>보호대수량</th>
									<td className="cntProtect"></td>
									<th></th>
									<td></td>
								</tr>
							</tbody>
							</table>
						</div>

              <div className="box info">
							{/* 공동주택 */}
							<table id="preInspDetail1" style={{ opacity: this.props.opacity1 }}>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
							  	    <tr>
								        <th>동수</th>
								        <td className="cntDong"></td>
								        <th>밸브</th>
                        <td className="cntVb"></td>
							    	    <th>T/B</th>
							    	    <td className="cntTb"></td>
							    	    <th>수취기</th>
							    	    <td className="cntWater"></td>
									</tr>

									<tr>
								        <th>사용자공급관</th>
								        <td className="qtyLen"></td>
								        <th>내관</th>
								        <td className="qtyLenIn"></td>
								        <th>총길이</th>
								        <td className="qtyLenTot"></td>
								        <th>체적</th>
								        <td className="qtyVol"></td>
								    </tr>
	
								    <tr>
							            <th>공급정압기</th>
									    <td><select  className="noGov"><option value="">선택</option></select></td>
									    <th>가스공급일</th>
									    <td>
											<DatePicker
												 locale="ko" 
												id="dtSply"
												className="datepicker dtSply"
												selected={this.state.dtSplyDate}
												onChange={this.dtSplyDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
							            <th>변경검사일</th>
							            <td>
											<DatePicker
												 locale="ko" 
												id="dtChgInsp"
												className="datepicker dtChgInsp"
												selected={this.state.dtChgInspDate}
												onChange={this.dtChgInspDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
											<th>관리소장</th>
											<td><input type="text" className="nmMng"/></td>
								    </tr>
										<tr>
											<th>연락처</th>
											<td><input type="text" className="noTelMng"/></td>
											<th>기밀검사 대상</th>
											<td><select id="grGastight" className="grGastight"><option value="">선택</option></select></td>
											<th>정기검사 대상</th>
											<td><select id="ynReginsp" className="ynReginsp"><option value="">선택</option></select></td>
											<th></th>
											<td></td>
									</tr>
							  </tbody>
							</table>
							{/* 특정사용시설 */}
							<table id="preInspDetail2" style={{ opacity: this.props.opacity2 }}>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
							  	    <tr>
								        <th>공급형태</th>
								        <td className="nmTpSply" ></td>
								        <th>시설분류</th>
			                            <td className="nmCls"></td>
							    	    <th>업종분류</th>
							    	    <td className="nmBizFclt"></td>
							    	    <th>T/B</th>
							    	    <td className="cntTb"></td>
									</tr>
									
									<tr>
								        <th>공급정압기</th>
								        <td><select id="noGov" className="noGov"><option value="">선택</option></select></td>
								        <th>가스공급일</th>
			                  <td>
											<DatePicker
												 locale="ko" 
												id="dtSply"
												className="datepicker dtSply"
												selected={this.state.dtSplyDate}
												onChange={this.dtSplyDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
							    	    <th>변경검사일</th>
							    	    <td>
											<DatePicker
												 locale="ko" 
												id="dtChgInsp"
												className="datepicker dtChgInsp"
												selected={this.state.dtChgInspDate}
												onChange={this.dtChgInspDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
							    	    <th>자동차단장치</th>
							    	    <td className="cntAutostop"></td>
									</tr>
									
									<tr>
								        <th>검지부</th>
								        <td className="cntSearch"></td>
								        <th>검지부 위치</th>
			                  <td className="plcSearch"></td>
							    	    <th>제어부</th>
							    	    <td className="cntControl"></td>
							    	    <th>제어부 위치</th>
							    	    <td className="plcControl"></td>
									</tr>
									
									<tr>
								        <th>차단부</th>
								        <td className="cntStop"></td>
								        <th>차단부 위치치</th>
			                  <td className="plcStop"></td>
							    	    <th>안전점검월</th>
							    	    <td><select id="mmInsp" className="mmInsp"><option value="">선택</option></select></td>
							    	    <th>안전관리자 성명</th>
							    	    <td><input type="text" className="nmSafe"/></td>
									</tr>
									
									<tr>
								        <th>연락처</th>
								        <td><input type="text" className="noTelSafe"/></td>
								        <th>안전관리자 선임여부</th>
			                            <td><select id="ynSafe" className="ynSafe"><option value="">선택</option></select></td>
							    	    <th>다중이용시설 여부</th>
							    	    <td><select id="ynMultiuse" className="ynMultiuse"><option value="">선택</option></select></td>
							    	    <th></th>
							    	    <td></td>
									</tr>
							    </tbody>
							</table>
							{/* 일반사용시설 */}
							<table id="preInspDetail3" style={{ opacity: this.props.opacity3 }}>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
							  	    <tr>
								        <th>퍼지번 유/무</th>
								        <td className="ynPurge"></td>
								        <th>입상만시공 유/무</th>
			                  <td className="ynStdpipeNm"></td>
							    	    <th>은폐배관 위치</th>
							    	    <td className="plcCovpipe"></td>
							    	    <th>은폐배관 점검형태</th>
							    	    <td className="typeCovpipeNm"></td>
									</tr>

									<tr>
								        <th>휴즈콕크</th>
								        <td className="cntFusecock"></td>
								        <th>황동볼밸브</th>
								        <td className="cntBallvb"></td>
								        <th>공급정압기</th>
								        <td><select id="noGov" className="noGov"><option value="">선택</option></select></td>
								        <th>최초공급전검사일</th>
								        <td>
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
								    </tr>
	
								    <tr>
							            <th>신규 가스공급일</th>
									    <td>
											<DatePicker
												 locale="ko" 
												id="dtSply"
												className="datepicker dtSply"
												selected={this.state.dtSplyDate}
												onChange={this.dtSplyDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
									    <th>변경/증설 공급일</th>
									    <td>
											<DatePicker
												 locale="ko" 
												id="dtChgInsp"
												className="datepicker dtChgInsp"
												selected={this.state.dtChgInspDate}
												onChange={this.dtChgInspDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</td>
							            <th>검지부</th>
							            <td className="cntSearch"></td>
							            <th>검지부 위치</th>
							            <td className="plcSearch"></td>
								    </tr>
	
							        <tr>
													<th>제어부</th>
							            <td className="cntControl"></td>
							            <th>제어부 위치</th>
							            <td className="plcControl"></td>
													<th>차단부</th>
							            <td className="cntStop"></td>
							            <th>차단부 위치</th>
							            <td className="plcStop"></td>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrievePreInspDetail','공급전검사 결과등록')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_save" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>
					</div>
				</footer>

			</div>
        )
    }

}

export default retrievePreInspDetail;