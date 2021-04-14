
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon10 from '../../image/icon10.png';


class getInstrtDtl extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/getInstrtDtl/'+this.props.match.params.pushSeq+'/'+this.props.match.params.mgrIdUser){
			config.back.url.push('/getInstrtDtl/'+this.props.match.params.pushSeq+'/'+this.props.match.params.mgrIdUser);
		}
		config.detail_file.index=this.props.match.params.pushSeq;
  }
	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
	
			const common = await Promise.all([ 
				service.getInstrtDtl(this.props.match.params.pushSeq, this.props.match.params.mgrIdUser)
			]);
			
			var result = common[0].data.result;

			$.each(result, function(key, value){
				$("."+key).html(value);
			});
	
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}


	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "상황조치";
		$(".header_title").html( "상황조치");

		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>지시이력 상세</h2>
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
									<th>지시일련번호</th>
									<td className="pushSeq"></td>
									<th>담당자</th>
									<td className="mrgIdUserNm "></td>
								</tr>
								<tr>
									<th>지시제목</th>
									<td className="intTitle"></td>
									<th>상태</th>
									<td className="intActStateNm"></td>
								</tr>
								<tr>
									<th className="h200px">지시내용</th>
									<td className="h200px intText vTop" ></td>
									<th className="h200px">처리내용</th>
									<td className="h200px actText vTop"></td>
								</tr>
								<tr>
									<th>지시일</th>
									<td className="intDt"></td>
									<th>처리일</th>
									<td className="actDt"></td>
								</tr>
							</tbody>
							</table>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default getInstrtDtl;