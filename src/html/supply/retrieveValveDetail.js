
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon10 from '../../image/icon10.png';


class retrieveValveDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveValveDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveValveDetail/'+this.props.match.params.idx);
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


				config.table.p1="밸브";
				config.table.p2=result.id

				config.table.attach1="밸브";
				config.table.attach2= result.idConst
				config.table.attach3= result.facilNo;

				config.detail_file.index = result.id;
				config.table.param3 = result.facilNo;

			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	btnBack2 = () =>{
		this.props.history.goBack();
	}

	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");

		config.detail_file.param="id";
		config.detail_file.folder1="supply";
		config.detail_file.folder2="valveController";
		config.detail_file.name="retrieveValveDetail";
		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>밸브 상세정보</h2>
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
									<td className="facilNo"></td>
									<th>시설명</th>
									<td className="nmVb"></td>
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
									<th>압력</th>
									<td className="pressureNm"></td>
								</tr>
								<tr>
									<th>밸브유형</th>
									<td className="valveTypNm"></td>
									<th>개폐상태</th>
									<td className="oacStatNm"></td>
								</tr>
								<tr>
									<th>밸브크기(관경)</th>
									<td className="diaNm"></td>
									<th>퍼지변종류</th>
									<td className="valveKndNm"></td>
								</tr>
								<tr>
									<th>전단</th>
									<td className="cdDiaFrontNm"></td>
									<th>후단</th>
									<td className="cdDiaBackNm"></td>
								</tr>
								<tr>
									<th>시공업체</th>
									<td className="coConstNm"></td>
									<th>제조회사</th>
									<td className="makeCom"></td>
								</tr>
								<tr>
									<th>흄관크기</th>
									<td className="tpHpsizeNm"></td>
									<th>철괴링</th>
									<td className="boxSizeNm"></td>
								</tr>
								<tr>
									<th>작동방식</th>
									<td className="tpOpmathNm"></td>
									<th>도로구분(포장상태)</th>
									<td className="roadClassNm"></td>
								</tr>
								<tr>
									<th>담당구역</th>
									<td className="idPipeRoadNm"></td>
									<th>점검구간</th>
									<td className="noSector1Nm"></td>
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
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,1)}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveValve','밸브')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveValveDetail;