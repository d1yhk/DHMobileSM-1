
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrieveJoin extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

		if(config.back.url[config.back.url.length-1] !== '/retrieveJoin'){
			config.back.url.push('/retrieveJoin');
		}

		if(config.table_name.file !== "retrieveJoin"){
			config.detail_file.index = "";

			config.grpifm.select_no=-1;
			config.grpifm.search={};
			config.grpifm.list=[];
			config.grpifm.form = [];
			config.table.param1="";
			config.table.param2="";
			config.table.param3="";
			config.table.attach1="";
			config.table.attach2="";
			config.table.attach3="";
			config.table.attach4="";
			config.table.attach5="";
		}
	}

	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
					td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['bjdNm']) ? result[count]['bjdNm'] : '')+'</td>';
					td = td + '<td data-fn="'+result[count]['facilNo']+'">'+((result[count]['statusNm']) ? result[count]['statusNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['pressureNm']) ? result[count]['pressureNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['materialNm']) ? result[count]['materialNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['diaNm']) ? result[count]['diaNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_join_list tbody").html(td);
		}else{
			$(".grp_join_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_join_list tbody").html('<tr><td colspan="5">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var bjdNm = config.form_search(search_type,'bjdNm');
		var status = config.form_search(search_type,'status');
		var pressure = config.form_search(search_type,'pressure');
		var material = config.form_search(search_type,'material');
		var dia = config.form_search(search_type,'dia');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_join_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
/*
bjdNm: "국동"
diaNm: "50"
id: 322
materialNm: "PLP"
pressureNm: "중압"
rowNum: 2
statusNm: "공급"
totalcount: 10
	*/
		try {
			const common = await Promise.all([
				service.retrieveJointList(bjdNm,status,pressure,material,dia,(this.page.page * 100),100)
			]);
			
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_join_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_join_list tbody").html('<tr><td colspan="5">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_join_list tbody").html('<tr><td colspan="5">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");
		config.header.title = "방식시설";
		$(".header_title").html( "방식시설");

		config.table_name.file = 'retrieveJoin';

		

		config.fetchCommon("공통","운영상태","status");
		config.fetchCommon("공통","압력구분","pressure");
		config.fetchCommon("공통","배관재질","material");
		config.fetchCommon("배관","관경","dia");
		//다름 다시 봐야함.
		//this.fetchCommon("배관","관경","status");

		$(".message").html("검색중입니다.");
		config.fetchDong("");
		if(config.grpifm.list.length > 0 ){
			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
				}
			});
			let result = config.grpifm.list;
			this.page.total = (result.length);
			this.lists(result,1,0);

			$(".grp_join_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_join_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_join_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_join_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_join_list").scrollTop() >= ($(".grp_join_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_join_list tr");
		$(document).on("click",".grp_join_list tr",function(){
			config.grpifm.scroll = $(".grp_join_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_join_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="절연조인트";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");


			config.table.attach1="절연조인트";
			config.table.attach2=$(this).find("td:eq(0)").attr("data-id");		//idConst
			config.table.attach3=$(this).find("td:eq(0)").attr("data-fn");		//facilNo


			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveTb"><span>전기방식</span></Link>
						<Link to="/retrieveRectifier"><span>외부전원장치</span></Link>
						<Link to="/retrieveJoin" className="active"><span>절연조인트</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>법정동</label>
											<select id="bjdNm" name="bjdNm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>운영상태</label>
											<select id="status" name="status">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>압력구분</label>
											<select id="pressure" name="pressure">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>배관구분</label>
											<select id="material" name="material">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>관경</label>
											<select id="dia" name="dia">
												<option value="">전체</option>
											</select>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="150"/>
										</colgroup>
										<thead>
											<tr>
												<th>법정동</th>
												<th>운영상태</th>
												<th>압력구분</th>
												<th>배관재질</th>
												<th>관경</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_join_list">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="150"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveJoin','절연조인트')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveJoinDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	
			</div>
		);
	}
}

export default retrieveJoin;