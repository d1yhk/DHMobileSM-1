
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


class retrieveRebuildDetail extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveRebuildDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveRebuildDetail/'+this.props.match.params.idx);
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
				
			}
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}

	componentDidMount() {
	
		$(".footer").css("display","block");
		$(".map").css("display","none");

		config.header.title = "기타시설";
		$(".header_title").html( "기타시설");

		config.detail_file.param="id";
		config.detail_file.folder1="etc";
		config.detail_file.folder2="rebuildController";
		config.detail_file.name="retrieveRebuildDetail";
		this.fetchDetail();
	}
	componentWillMount() {
	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>계획배관 상세정보</h2>
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
									<td className="id" colSpan="3"></td>
								</tr>
								<tr>
									<th>법정동</th>
									<td className="bjdNm"></td>
									<th>상태</th>
									<td className="statusNm"></td>
								</tr>
								<tr>
									<th>주소</th>
									<td className="addr"></td>
									<th>준공일</th>
									<td className="complDate"></td>
								</tr>
								<tr>
									<th>대지면적</th>
									<td className="area"></td>
									<th>시공사</th>
									<td className="constCom"></td>
								</tr>
								<tr>
									<th>연락처</th>
									<td className="constTel"></td>
									<th>구분</th>
									<td className="gubunNm"></td>
								</tr>
								<tr>
									<th>구간명</th>
									<td className="constNm"></td>
									<th>착공일</th>
									<td className="beginDate"></td>
								</tr>
								<tr>
									<th>예상세대수</th>
									<td className="houseCnt"></td>
									<th>시행사</th>
									<td className="agntCom"></td>
								</tr>
								<tr>
									<th>담당자</th>
									<td className="constMngNm"></td>
									<th>비고</th>
									<td className="note"></td>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveRebuild','재개발 건축')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveRebuildDetail;