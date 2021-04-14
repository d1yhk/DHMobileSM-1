
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';

import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrievePlanpipeDetail extends Component {
    constructor(props) {
        super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePlanpipeDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrievePlanpipeDetail/'+this.props.match.params.idx);
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
				config.setWindowHeight();
			}


		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	componentDidMount() {

		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "기타시설";
		$(".header_title").html( "기타시설");

		config.detail_file.param="id";
		config.detail_file.folder1="etc";
		config.detail_file.folder2="planpipeController";
		config.detail_file.name="retrievePlanpipeDetail";
		this.fetchDetail();

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
									<td className="id"></td>
									<th>공사계획년원</th>
									<td className="noConstpln"></td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="idConst"></td>
									<th>공사명</th>
									<td className="nmConst"></td>
								</tr>
								<tr>
									<th>법정동</th>
									<td className="bjdNm"></td>
									<th>상태</th>
									<td className="status"></td>
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
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePlanpipeDetail;