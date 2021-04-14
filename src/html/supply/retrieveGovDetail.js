
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import close from '../../image/close.png';
import close_x from '../../image/close_x.png';
import close_re from '../../image/close_re.png';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon11 from '../../image/icon11.png';
import icon10 from '../../image/icon10.png';


class retrieveGovDetail extends Component {
    constructor(props) {
        super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveGovDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveGovDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
    }

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");

		config.inspection.type="정압기";

		config.detail_file.param="id";
		config.detail_file.folder1="supply";
		config.detail_file.folder2="govController";
		config.detail_file.name="retrieveGovDetail";

		this.fetchDetail();
		$(".sub-tab .b1").addClass("active");

	}

	subContents = async (sub_index) => { 	
		$(".tab-contents1").css("display","none");
		$(".tab-contents2").css("display","none");
		$(".tab-contents3").css("display","none");
		
		$(".sub-tab .b1").removeClass("active");
		$(".sub-tab .b2").removeClass("active");
		$(".sub-tab .b3").removeClass("active");

		if($(".tab-contents"+sub_index).find(".id").html()===''){
			
			if(sub_index === 2){
				$(".sub-tab .b2").addClass("active");
				config.detail_file.name="retrieveGovRtuDetail";
				//
			}else if(sub_index === 3){
				$(".sub-tab .b3").addClass("active");
				config.detail_file.name="retrieveGovTaxDetail";
				//
			}else{
				$(".sub-tab .b1").addClass("active");
				config.detail_file.name="retrieveGovDetail";
				//
			}

			const common = await Promise.all([ 
				service.getDetail(config.detail_file.folder1, config.detail_file.folder2, config.detail_file.name, config.table.index)
			]);
			var result = common[0].data.result;

			$.each(result, function(key, value){
				$(".tab-contents"+sub_index).find("."+key).html(value);
			});

		}

		$(".tab-contents"+sub_index).css("display","block");
		config.setWindowHeight();
	}

	//sacada이벤트
	popupScada = async () => { 
		$(".popup").css("display","block");
		$("#popupContents tbody").html("");
		try {	
			const common = await Promise.all([ 
				service.retrieveScadaEventInfo(config.table.attach2)
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

			/*
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['prs1HbDesc']) ? result[count]['prs1HbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['prs2HbDesc']) ? result[count]['prs2HbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['gasHbDesc']) ? result[count]['gasHbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['ssv1HbDesc']) ? result[count]['ssv1HbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['ssv2HbDesc']) ? result[count]['ssv2HbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['pwrHbDesc']) ? result[count]['pwrHbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['doorHbDesc']) ? result[count]['doorHbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['rtuHbDesc']) ? result[count]['rtuHbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['lineHbDesc']) ? result[count]['lineHbDesc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dbTime']) ? result[count]['dbTime'] : '')+'</td>';
				td = td + '</tr>';
				$("#popupContents").append(td);
			}*/
			if(result.length === 0 || !result){
				$("#popupContents tbody").html('<tr><td colspan="10">검색된 내용이 없습니다.</td></tr>');
			}
		} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="10">검색된 내용이 없습니다.</td></tr>');
		}
	}

	//상세정보
	fetchDetail = async () => { 

		$(".tab-contents1").css("display","block");
		$(".tab-contents2").css("display","none");
		$(".tab-contents3").css("display","none");

		$(".tab-contents1").find(".id").html("");
		$(".tab-contents2").find(".id").html("");
		$(".tab-contents3").find(".id").html("");

		//$(".sub-tab button").removeClass("active");
		//$(".sub-tab button:eq(0)").addClass("active");


		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){

				const common = await Promise.all([ 
					service.getDetail()
				]);
				
				
				
				var result = common[0].data.result;

				$.each(result, function(key, value){
					$(".tab-contents1").find("."+key).html(value);
				});
			
				config.table.p1="정압기";
				config.table.p2=result.id;

				config.table.attach1="정압기";
				config.table.attach2=result.facilNo;		//facilNo
				config.table.attach3="";

				config.table.param1="정압기";
				//config.table.param2=result.facilNo;	//gbFrag
				config.table.param3=result.facilNo;

				config.detail_file.index =result.id;
			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			config.setWindowHeight();
		}else{
			alert(" 리스트를 선택해주세요");
		}
	}

	//점검이력
	retrieveGovInspRslt = () => {
		
		if(config.table.param3 !== undefined){
			this.props.history.push("/retrieveGovInspRslt/"+config.table.param3);
		}else{
			alert("항목을 선택해주세요");
		}
	}
	render() { 
		return (
			<div className="contents">
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
						<h2>정압기 상세정보</h2>
					</div>
					<div className="wrap">
						<div className="box sub-tab tab3">
							<button type="button" onClick={() => this.subContents(1)} className="b1"><span>정압기 상세정보</span></button>
							<button type="button" onClick={() => this.subContents(2)} className="b2"><span>RTU 상세정보</span></button>
							<button type="button" onClick={() => this.subContents(3)} className="b3"><span>점용료 상세정보</span></button>
						</div>
						<div className="box info tab-contents1">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>ID</th>
										<td colSpan="3" className="id"></td>
									</tr>
									<tr>
										<th>관리번호</th>
										<td className="facilNo"></td>
										<th>시설명</th>
										<td className="govNm"></td>
									</tr>
									<tr>
										<th>시공감리일</th>
										<td className="dtLaw"></td>
										<th>주소</th>
										<td className="addr"></td>
									</tr>
									<tr>
										<th>공급세대수</th>
										<td className="cntSply"></td>
										<th>조정기 모델</th>
										<td className="kindMdNm"></td>
									</tr>
									<tr>
										<th>조정기 규격</th>
										<td className="kindDiaNm"></td>
										<th>제조사</th>
										<td className="makeCom"></td>
									</tr>
									<tr>
										<th>중압 관경</th>
										<td className="cdDiaHNm"></td>
										<th>저압 관경</th>
										<td className="cdDiaLNm"></td>
									</tr>
									<tr>
										<th>필터1</th>
										<td className="typeFilter1Nm"></td>
										<th>차압계1</th>
										<td className="gagePress1Nm"></td>
									</tr>
									<tr>
										<th>SSV1</th>
										<td className="typeSsv1Nm"></td>
										<th>조정기1</th>
										<td className="typeReg1Nm"></td>
									</tr>
									<tr>
										<th>소음기1</th>
										<td className="typeSound1Nm"></td>
										<th>필터2</th>
										<td className="typeFilter2Nm"></td>
									</tr>
									<tr>
										<th>차압계2</th>
										<td className="gagePress2Nm"></td>
										<th>SSV2</th>
										<td className="typeSsv2Nm"></td>
									</tr>
									<tr>
										<th>조정기2</th>
										<td className="typeReg2Nm"></td>
										<th>소음기2</th>
										<td className="typeSound2Nm"></td>
									</tr>
									<tr>
										<th>안전밸브</th>
										<td className="vbSafeNm"></td>
										<th>벤트</th>
										<td className="typeVentNm"></td>
									</tr>
									<tr>
										<th>압력기록계</th>
										<td className="regPressNm"></td>
										<th>바이패스</th>
										<td className="ynBypassNm"></td>
									</tr>
									<tr>
										<th>구조물형식</th>
										<td className="govRoomNm"></td>
										<th>환기구</th>
										<td className="typeWind1"></td>
									</tr>
									<tr>
										<th>강제배기구</th>
										<td className="typeWind2Nm"></td>
										<th>경계책</th>
										<td className="fenceYnNm"></td>
									</tr>
									<tr>
										<th>시공업체</th>
										<td className="coConstNm"></td>
										<th>점검요일</th>
										<td className="cycleDayNm"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box info tab-contents2">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>ID</th>
										<td colSpan="3" className="id"></td>
									</tr>
									<tr>
										<th>관리번호</th>
										<td className="facilNo"></td>
										<th>시설명</th>
										<td className="govNm"></td>
									</tr>
									<tr>
										<th>시공감리일</th>
										<td className="dtLaw"></td>
										<th>주소</th>
										<td className="addr"></td>
									</tr>
									<tr>
										<th>RTU</th>
										<td className="typeRtuNm"></td>
										<th>외부함</th>
										<td className="boxRtuNm"></td>
									</tr>
									<tr>
										<th>UPS</th>
										<td className="typeUpsNm"></td>
										<th>가스경보기</th>
										<td className="typeAlarmNm"></td>
									</tr>
									<tr>
										<th>SSV센서</th>
										<td className="typeSsvNm"></td>
										<th>RTU도어</th>
										<td className="doorRtuNm"></td>
									</tr>
									<tr>
										<th>차단기</th>
										<td className="typeStopNm"></td>
										<th>서지보호기</th>
										<td className="typeSurgeNm"></td>
									</tr>
									<tr>
										<th>환기팬</th>
										<td className="fanGovNm"></td>
										<th>모뎀</th>
										<td className="typeModemNm"></td>
									</tr>
									<tr>
										<th>IP</th>
										<td className="addrIp"></td>
										<th>전기계량기</th>
										<td className="plcElec"></td>

									</tr>
									<tr>
										<th>전기료 납부처</th>
										<td className="ofElec"></td>
										<th>도어센서</th>
										<td className="doorSenceNm"></td>

									</tr>
									<tr>
										<th>정크션박스</th>
										<td className="boxJunkNm"></td>
										<th>압력계(H)</th>
										<td className="cdHPressNm"></td>

									</tr>
									<tr>
										<th>압력계(L)</th>
										<td className="cdLPressNm"></td>
										<th>방폭등</th>
										<td className="lampGovNm"></td>

									</tr>
									<tr>
										<th>방폭스위치</th>
										<td className="switchGovNm"></td>
										<th></th>
										<td></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box info tab-contents3">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>ID</th>
										<td colSpan="3" className="id"></td>
									</tr>
									<tr>
										<th>관리번호</th>
										<td className="facilNo"></td>
										<th>시설명</th>
										<td className="govNm"></td>
									</tr>
									<tr>
										<th>시공감리일</th>
										<td className="dtLaw"></td>
										<th>주소</th>
										<td className="addr"></td>
									</tr>
									<tr>
										<th>가로</th>
										<td className="sizeWidth"></td>
										<th>세로</th>
										<td className="sizeHeigt"></td>
									</tr>
									<tr>
										<th>면적</th>
										<td className="areaGov"></td>
										<th>천장높이</th>
										<td className="levelRoof"></td>
									</tr>
									<tr>
										<th>건물높이</th>
										<td className="levelBld"></td>
										<th>점용시작일</th>
										<td className="dtOcpyFr"></td>
									</tr>
									<tr>
										<th>점용종료일</th>
										<td className="dtOcpyFr"></td>
										<th>적용요율</th>
										<td className="ratOcpy"></td>
									</tr>
									<tr>
										<th>점용료</th>
										<td className="amtOcpy"></td>
										<th>납부일자</th>
										<td className="dtPay"></td>
									</tr>
									<tr>
										<th>납부형태</th>
										<td className="gbPayOcpy"></td>
										<th>납부처</th>
										<td className="ofPayOcpy"></td>
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
						<button type="button"  className="btn_record" onClick={() => this.retrieveGovInspRslt()}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGovDetail','정압기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_scada" onClick={this.popupScada} ><img alt="" src={icon11} width="15" height="15" />SCADA이벤트</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGovDetail;

