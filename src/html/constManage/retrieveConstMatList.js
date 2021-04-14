/*ppt 177 공사관리 작업일보 작업일보상세정보 */
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import icon2 from '../../image/icon2.png';
import btnback from '../../image/btn_back.png';

class retrieveConstMatList extends Component {
	
	constructor(props) {
		super(props);
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveConstMatList/'+this.props.match.params.idx+'/'+this.props.match.params.type){
			config.back.url.push('/retrieveConstMatList/'+this.props.match.params.idx+'/'+this.props.match.params.type);
		}
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	


		try {
			const common = await Promise.all([ 
				service.retrieveConstMatList(this.props.match.params.idx,this.props.match.params.type)
			]);
			var result = common[0].data.result;
			config.table_details.info = result;

			$(".message").html("총 "+(result.length ) +"건 검색되었습니다.");
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyMat']) ? result[count]['qtyMat'] : '')+'</td>'
				td = td + '<td>'+((result[count]['lenChg']) ? result[count]['lenChg'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtySum']) ? result[count]['qtySum'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntBranch']) ? result[count]['cntBranch'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntButt']) ? result[count]['cntButt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntEf']) ? result[count]['cntEf'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntConn']) ? result[count]['cntConn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntRt']) ? result[count]['cntRt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntMt']) ? result[count]['cntMt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntPic']) ? result[count]['cntPic'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntChg']) ? result[count]['cntChg'] : '')+'</td>'
				td = td + '<td>'+((result[count]['txPlc']) ? result[count]['txPlc'] : '')+'</td>'
				td = td + '</tr>';
				$(".item_mat_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".item_mat_list tbody").html('<tr><td colspan="15">검색 결과가 없습니다.</td></tr>');
			}

			var table_height = $(window).height() - 270;//(350 === header, footer)
			$(".item_mat_list").height(table_height);

	
		} catch(err){
				$(".message").html("&nbsp;");
				$(".item_mat_list tbody").html('<tr><td colspan="15">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공사관리";
		$(".header_title").html( "공사관리");

		this.fetchSearch(1);
	
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>작업일보</h2>
					</div>
					<div className="wrap">
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>품목명</th>
												<th>규격</th>
												<th>단위</th>
												<th>수량</th>
												<th>환산길이</th>
												<th>계</th>
												<th>분기개소</th>
												<th>BUTT융착</th>
												<th>EF융착</th>
												<th>융접개소</th>
												<th>RT개소</th>
												<th>MT개소</th>
												<th>촬영매수</th>
												<th>수정매수</th>
												<th>설치위치</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="item_mat_list mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>

						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveConstItemMatList','작업일보')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveConstMatList;