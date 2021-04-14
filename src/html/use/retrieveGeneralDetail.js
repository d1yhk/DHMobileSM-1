
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon6 from '../../image/icon6.png';
import close from '../../image/close.png';


class retrieveGeneralDetail extends Component {
    constructor(props) {
        super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveGeneralDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveGeneralDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

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
				

				config.table.attach1="사용시설1";
				config.table.attach2= result.cdFcltBld;
				config.table.change1 = result.cdFcltBld;
				config.table.change2 = "08";
				config.setWindowHeight();
			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}

	//변경이력
	changeList = async () => { 
		$("#popupContents tbody").html("");
		if(config.detail_file.index!==''){
			try {
				const common = await Promise.all([ 
					service.retrieveChangeList()
				]);
				
				$(".popup-spec").css("display","block");
				var result = common[0].data.result;
				for(var count = 0; count < result.length; count++){
					var td = '<tr>';
					td = td + '<td>'+((result[count]['seqChg']) ? result[count]['seqChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtChg']) ? result[count]['dtChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['fcltChg']) ? result[count]['fcltChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['modelChg']) ? result[count]['modelChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['rsnChg']) ? result[count]['rsnChg'] : '')+'</td>';
					td = td + '</tr>';
					$("#popupContents tbody").append(td);
				}
				if( result.length <= 0 ){
					$("#popupContents tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
				}
			} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
			}
		}else{
			alert("리스트를 선택해주세요");
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");;

		config.detail_file.param="cdFcltBld";
		config.detail_file.folder1="use";
		config.detail_file.folder2="useFacilityController";
		config.detail_file.name="retrieveGeneralDetail";


		this.fetchDetail();
		

	}
	componentWillMount() {
	}
	render() { 
		return (
			<div className="contents">
				<div className="popup popup-spec">
					<div className="popup-box table">
						<h2>변경이력 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div id="popupHeader" >
							<table>
								<thead>
									<tr>
										<th>순번</th>
										<th>변경일자</th>
										<th>시설구분</th>
										<th>변경설비</th>
										<th>모델명</th>
										<th>시공업체</th>
										<th>변경사유</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents" >
							<table>
								<colgroup>
									<col width="60"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="auto"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="detail">
					<div className="tab tab1">
						<h2>일반사용시설 상세정보</h2>
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
									<th className="important"><span>*</span>공급유형</th>
									<td className="important gbCntrNm"></td>
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
									<th>용도</th>
									<td className="txUse"></td>
									<th>입상밸브 수량</th>
									<td className="stValveCnt"></td>
								</tr>
								<tr>
									<th>보호대 수량</th>
									<td className="cntProtect"></td>
									<th>퍼지변 유/무</th>
									<td className="ynPurge"></td>
								</tr>
								<tr>
									<th>입상만 시공 유/무</th>
									<td className="ynStdpipeNm"></td>
									<th>은폐배관 위치</th>
									<td className="plcCovpipe"></td>
								</tr>
								<tr>
									<th>은폐배관 점검형태</th>
									<td className="typeCovpipeNm"></td>
									<th>휴즈콕크</th>
									<td className="cntFusecock"></td>
								</tr>
								<tr>
									<th>황동볼밸브</th>
									<td className="ballValve"></td>
									<th>공급정압기</th>
									<td>
										<span className="noGov"></span>
										<span className="nmGov"></span>
									</td>
								</tr>
								<tr>
									<th className="important"><span>*</span>최초 공급전검사일</th>
									<td className="important dtInsp"></td>
									<th className="important"><span>*</span>신규 공급일</th>
									<td className="important dtSply"></td>
								</tr>
								<tr>
									<th className="important"><span>*</span>변경/증설 공급일</th>
									<td className="important dtChgInsp"></td>
									<th>검지부</th>
									<td className="cntSearch"></td>
								</tr>
								<tr>
									<th>제어부</th>
									<td className="cntControl"></td>
									<th>차단부</th>
									<td className="cntStop"></td>
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
						<button type="button" className="btn_change" onClick={this.changeList}><img alt="" src={icon6} width="15" height="15" />변경이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveCommunalDetail','공동주택')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGeneralDetail;