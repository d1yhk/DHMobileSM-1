
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



class retrieveGovernorDetail extends Component {
    constructor(props) {
			super(props)

		if(!this.props.match.params.title){
			if(config.back.url[config.back.url.length-1] !== '/retrieveGovernorDetail/'+this.props.match.params.idx){
				config.back.url.push('/retrieveGovernorDetail/'+this.props.match.params.idx);
			}
		}else{
			if(config.back.url[config.back.url.length-1] !== '/retrieveGovernorDetail/'+this.props.match.params.idx+'/'+this.props.match.params.title){
				config.back.url.push('/retrieveGovernorDetail/'+this.props.match.params.idx+'/'+this.props.match.params.title);
			}
		}
		config.detail_file.index=this.props.match.params.idx;

    }



	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");;

		config.detail_file.param="id";
		config.detail_file.folder1="use";
		config.detail_file.folder2="governorController";
		config.detail_file.name="retrieveGovernorDetail";
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
					
				config.table.p1="사용자정압기";
				config.table.p2=result.id;

				config.table.change1 = result.pgovNo;
				config.table.change2 = "03";
					
			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			config.setWindowHeight();
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
						<h2>{this.props.match.params.title!==undefined ? this.props.match.params.title : '단독정압기'} 상세정보</h2>
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
										<th>관리번호</th>
										<td className="pgovNo"></td>
										<th>시설명</th>
										<td className="nmGov"></td>
									</tr>
									<tr>
										<th>공사ID</th>
										<td className="idConst"></td>
										<th>공사명</th>
										<td className="nmConst"></td>
									</tr>
									<tr>
										<th className="important"><span>*</span>시설구분</th>
										<td className="gbFclt important"></td>
										<th>주소</th>
										<td className="txAddr"></td>
									</tr>
									<tr>
										<th>완성검사일</th>
										<td className="dtLaw"></td>
										<th>가스공급일</th>
										<td className="dtSply"></td>
									</tr>
									<tr>
										<th>분해점검일</th>
										<td className="dtInsp"></td>
										<th>위치</th>
										<td className="plcGov"></td>
									</tr>
									<tr>
										<th>시공업체</th>
										<td className="coConstNm"></td>
										<th>제조사</th>
										<td className="coMade"></td>
									</tr>
									<tr>
										<th className="important"><span>*</span>모델</th>
										<td className="cdModel important"></td>
										<th className="important"><span>*</span>공급세대수</th>
										<td className="cntSply important"></td>
									</tr>
									<tr>
										<th>사용압력</th>
										<td className="pressUse"></td>
										<th>예비라인압력</th>
										<td className="pressPre"></td>
									</tr>
									<tr>
										<th>SSV모델</th>
										<td className="modelSsv"></td>
										<th>SSV1 설정압력</th>
										<td className="pressSsv1"></td>
									</tr>
									<tr>
										<th>SSV2 설정압력</th>
										<td className="pressSsv2"></td>
										<th>안전밸브 설정압력</th>
										<td className="pressVb"></td>
									</tr>
									<tr>
										<th>필터모델</th>
										<td className="modelFilter"></td>
										<th>용량</th>
										<td className="qtyGov"></td>
									</tr>
									<tr>
										<th>공급라인</th>
										<td className="lineSply"></td>
										<th>보호대</th>
										<td className="cntProtect"></td>
									</tr>
									<tr>
										<th>사용상태</th>
										<td className="stUse"></td>
										<th>형식</th>
										<td className="cdForm"></td>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGovernor','단독정압기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGovernorDetail;