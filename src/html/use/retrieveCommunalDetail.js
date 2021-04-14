
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrieveCommunalDetail extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveCommunalDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveCommunalDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");;
	
		config.detail_file.param="cdFcltBld";
		config.detail_file.folder1="use";
		config.detail_file.folder2="useFacilityController";
		config.detail_file.name="retrieveCommunalDetail";
		this.fetchDetail();
	}

	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){

				const common = await Promise.all([ 
					service.getDetail()
				]);
				
				var result = common[0].data.result;
				$.each(result, function(key, value){
					$("."+key).html(value);
				});

				var lAddr = "0";
				if(result.lAddr){
					lAddr = ",BULD_MNNM:'"+result.lAddr+"'";
				}
				var sAddr = "0";
				if(result.sAddr){
					sAddr = result.sAddr
				}
				config.table.p1="건물";
				config.table.p2="filter=ROAD_NM:'"+result.roadAddr+"',BULD_MNNM:'"+lAddr+"',BULD_SLNO:'"+sAddr+"'";
				config.setWindowHeight();
			}

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>공동주택 상세정보</h2>
					</div>
					<div className="wrap">
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
									<th>ID</th>
									<td colSpan="3" className="id"></td>
								</tr>
								<tr>
									<th>관리번호</th>
									<td className="cdFcltBld"></td>
									<th>시설명</th>
									<td className="nmFcltBld"></td>
								</tr>
								<tr>
									<th>시설구분</th>
									<td className="gbFcltNm"></td>
									<th>주소</th>
									<td className="txAddr"></td>
								</tr>
								<tr>
									<th>공급유형</th>
									<td className="gbCntrNm"></td>
									<th>사용여부</th>
									<td className="stUseNm"></td>
								</tr>
								<tr>
									<th>건물번호</th>
									<td className="cdBld"></td>
									<th>주택구분</th>
									<td className="gbHsNm"></td>
								</tr>
								<tr>
									<th>시공업체</th>
									<td className="cdCom"></td>
									<th>사업자번호</th>
									<td className="noCompany"></td>
								</tr>
								<tr>
									<th>시공관리자</th>
									<td className="nmConstMng"></td>
									<th>가스자격증</th>
									<td className="licenseConstNm"></td>
								</tr>
								<tr>
									<th>압력</th>
									<td className="cdPressNm"></td>
									<th>총세대수</th>
									<td className="cntHsTot"></td>
								</tr>
								<tr>
									<th>사용세대수</th>
									<td className="cntHs"></td>
									<th>공사기간</th>
									<td className="dtConst"></td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="idConst"></td>
									<th>공사명</th>
									<td className="nmConst"></td>
								</tr>
								<tr>
									<th>완성검사일</th>
									<td className="dtFstInsp"></td>
									<th>변경검사일</th>
									<td className="dtChgInsp"></td>
								</tr>
								<tr>
									<th>가스공급일</th>
									<td className="dtSply"></td>
									<th>공급정압기번호</th>
									<td className="noGov" ></td>
								</tr>
								<tr>
									<th>공급정압기명</th>
									<td className="nmGov"></td>
									<th>동수</th>
									<td className="cntDong"></td>
								</tr>
								<tr>
									<th>밸브</th>
									<td className="cntVb"></td>
									<th>T/B</th>
									<td className="cntTb"></td>
								</tr>
								<tr>
									<th>수취기</th>
									<td className="cntWater"></td>
									<th>사용자공급관</th>
									<td className="qtyLen"></td>
								</tr>
								<tr>
									<th>내관</th>
									<td className="qtyLenIn"></td>
									<th>총길이</th>
									<td className="qtyLenTot"></td>
								</tr>
								<tr>
									<th>기밀시험 대상</th>
									<td className="grGastightNm"></td>
									<th>체적</th>
									<td className="qtyVol"></td>
								</tr>
								<tr>
									<th className="important"><span>*</span>최종 기밀검사일</th>
									<td className="important dtGastight"></td>
									<th>정기검사 대상</th>
									<td className="ynReginspNm"></td>
								</tr>
								<tr>
									<th >관리소장</th>
									<td className="nmMng"></td>
									<th>연락처</th>
									<td className="noTelMng"></td>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveCommunal','공동주택')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveCommunalDetail;