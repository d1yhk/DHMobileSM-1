
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrieveJoinDetail extends Component {
    constructor(props) {
      super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveJoinDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveJoinDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
    }

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");
		config.header.title = "방식시설";
		$(".header_title").html( "방식시설");

		
		config.detail_file.param="id";
		config.detail_file.folder1="protect";
		config.detail_file.folder2="jointController";
		config.detail_file.name="retrieveJointDetail";


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
						<h2>절연조인트 상세정보</h2>
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
									<td className="id"></td>
									<th>공사ID</th>
									<td className="idConst"></td>
								</tr>
								<tr>
									<th>절연조인트번호</th>
									<td className="facilNo"></td>
									<th>절연조인트명</th>
									<td className="nmJoint"></td>
								</tr>
								<tr>
									<th>배관구분</th>
									<td className="gbPipeNm"></td>
									<th>법정동</th>
									<td className="bjdNm"></td>
								</tr>
								<tr>
									<th>관경</th>
									<td className="diaNm"></td>
									<th>압력</th>
									<td className="pressureNm"></td>
								</tr>
								<tr>
									<th>설치일자</th>
									<td className="dtSet"></td>
									<th>시공업체</th>
									<td className="coConst"></td>
								</tr>
								<tr>
									<th>설치형식</th>
									<td className="tpInstype"></td>
									<th>설치위치</th>
									<td className="txLoc"></td>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveJoin','절연조인트')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
	
			</div>
		);
	}
}

export default retrieveJoinDetail;