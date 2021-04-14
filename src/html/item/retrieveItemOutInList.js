/* ppt172 자재입고 자재반입 상세 반입 대상 품목*/

import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';








class retrieveItemOutInList extends Component {
	constructor(props) {
		super(props);
		this.addType = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOutInList/'+this.props.match.params.idx){
			config.back.url.push('/retrieveItemOutInList/'+this.props.match.params.idx);
		}

		config.item_select.lenght=0;
		this.item_list = [];
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	

		try {
			const common = await Promise.all([ 
				service.retrieveItemOutInList(this.props.match.params.idx)
			]);
			var result = common[0].data.result;
			this.item_list = result;
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
					td = td + '<td class="checkbox2 _td2"><label><input type="checkbox"><strong></strong></label></td>'
					td = td + '<td>'+((result[count]['noOut']) ? result[count]['noOut'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
					td = td + '<td>'+((result[count]['NmDept']) ? result[count]['NmDept'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
					td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
					td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
					td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
					td = td + '</tr>';

				$(".outin_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".outin_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
			}
			config.setWindowHeight();
		} catch(err){
				$(".message").html("&nbsp;");
				$(".outin_list tbody").html('<tr><td colspan="9">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	componentDidMount() {
		$(".check_all").prop("checked",false);
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		this.fetchSearch(1);


	}

	//선택완료
	btnSelect = async () => { 
		config.item_select.length = 0;
		for(var count = 0; count < this.item_list.length; count++ ){
			if( $(".outin_list tr:eq("+count+")").find("input").prop("checked") === true ) {
				config.item_select.push(this.item_list[count]);
			}
		}
		console.log(config.item_select);
		config.btnBack(this.props)
	}

	allCheck = () => {
		if($(".check_all").prop("checked") === true){
			$(".outin_list tbody tr input").prop("checked",true);
		}else{

			$(".outin_list tbody tr input").prop("checked",false);
		}
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>반입 대상품목</span></a>
					</div>
					<div className="wrap">
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="50"/>
											<col width="120"/>
											<col width="120"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="120"/>
											<col width="120"/>
											<col width="70"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th className="checkbox2"><label><input type="checkbox" onClick={this.allCheck} className="check_all"/><strong></strong></label></th>
												<th>출고번호</th>
												<th>출고일자</th>
												<th>출고부서</th>
												<th>공사</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>출고수량</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="outin_list mw1000">
									<table>
										<colgroup>
											<col width="50"/>
											<col width="120"/>
											<col width="120"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="120"/>
											<col width="120"/>
											<col width="70"/>
											<col width="100"/>
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
						<button type="button" onClick={this.btnSelect}><img alt="" src={icon2} width="15" height="15" />선택완료</button>
							

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemOutInList;