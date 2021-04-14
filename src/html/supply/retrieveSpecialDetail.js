
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon10 from '../../image/icon10.png';
class retrieveSpecialDetail extends Component {
  constructor(props) {
      super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveSpecialDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveSpecialDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
  }

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");

		config.table.param1="중점관리대상";
		//config.detail_file.param="id";
		config.detail_file.folder1="supply";
		config.detail_file.folder2="specialController";
		config.detail_file.name="retrieveSpecialDetail";
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

				if(result == null){
					alert("해당시설물의 데이터가 존재하지 않습니다.");
					return
				} else {
					config.table.p1="중점관리시설";
					config.table.p2=result.id;
					//시설종류가 수취기일 경우
					if(result.gbFrag == '5'){
						config.table.p1="수취기";
					}

					config.table.attach1="중점관리대상";
					config.table.attach2=result.idConst;
					config.table.attach3=result.facilNo;

					config.table.param1="중점관리대상";
					config.table.param2=result.gbFrag;	//gbFrag
					config.table.param3=result.facilNo;
					config.detail_file.index = result.id;
				}
			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	render() { 
		return (
			<div className="contents">

				<div className="detail">
					<div className="tab tab1">
						<h2>중점관리대상 상세정보</h2>
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
								<tr>
									<th>ID</th>
									<td colSpan="3" className="id"></td>
								</tr>
								<tr>
									<th>관리번호</th>
									<td className="facilNo"></td>
									<th>시설명</th>
									<td className="specialName"></td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="idConst"></td>
									<th>공사명</th>
									<td className="nmConst"></td>
								</tr>
								<tr>
									<th>설치일자</th>
									<td className="dtSet"></td>
									<th>설치위치</th>
									<td className="txLoc"></td>
								</tr>
								<tr>
									<th>시설구분</th>
									<td className="gbFragNm"></td>
									<th>압력</th>
									<td className="cdPressNm"></td>
								</tr>
								<tr>
									<th>관경</th>
									<td className="qtyDia"></td>
									<th>연장</th>
									<td className="constLength"></td>
								</tr>
								<tr>
									<th>시공업체</th>
									<td className="nmCom"></td>
									<th>제조회사</th>
									<td className=""></td>
								</tr>
								<tr>
									<th>담당구역</th>
									<td className="manageAreaNm"></td>
									<th>점검구간</th>
									<td className="noSector1Nm"></td>
								</tr>
								<tr>
									<th>밸브종류</th>
									<td className="kdVb"></td>
									<th>보온재관경</th>
									<td className="diaPipe"></td>
								</tr>
								<tr>
									<th>지지대수량</th>
									<td className="cntStand"></td>
									<th>지지대간격</th>
									<td className="widStand"></td>
								</tr>
								<tr>
									<th>검토GL심도</th>
									<td className="depthGlTech"></td>
									<th>검토하천심도</th>
									<td className="depthRiverTech"></td>
								</tr>
								<tr>
									<th>측정GL심도</th>
									<td className="depthGlMea"></td>
									<th>측정하천심도</th>
									<td className="depthGlMae"></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,3)}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveSpecialDetail','중점관리시설')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveSpecialDetail;