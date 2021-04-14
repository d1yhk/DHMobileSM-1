
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrievePlanpipe extends Component {
  constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePlanpipe'){
			config.back.url.push('/retrievePlanpipe');
		}
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.table_name.file !== "retrieveMemo"){
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
					td = td + '<td>'+((result[count]['noConstpln']) ? result[count]['noConstpln'] : '')+'</td>';
					td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['statusNm']) ? result[count]['statusNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_planpipe_list tbody").html(td);
		}else{
			$(".grp_planpipe_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_planpipe_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 
	fetchSearch = async (search_type) => { 
		var bjdNm = config.form_search(search_type,'bjdNm');
		var noConstpln = config.form_search(search_type,'noConstpln');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var status = config.form_search(search_type,'status');

		//검색 초기화
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_planpipe_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([ 
				service.retrievePlanpipeList(bjdNm,noConstpln,idConst,nmConst,status,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_planpipe_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_planpipe_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_planpipe_list tbody").html('<tr><td colspan="5">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	componentDidMount() {

		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "기타시설";
		$(".header_title").html( "기타시설");

		config.table_name.file = 'retrievePlanpipe';


		config.fetchCommon("계획배관","상태","status");

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

			$(".grp_planpipe_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_planpipe_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_planpipe_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}
		var t = this;

		$(".grp_planpipe_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_planpipe_list").scrollTop() >= ($(".grp_planpipe_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_planpipe_list tr");
		$(document).on("click",".grp_planpipe_list tr",function(){

			config.grpifm.scroll = $(".grp_planpipe_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_planpipe_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="계획배관";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");


			config.table.change1 = $(this).find("td:eq(0)").attr("data-id");
			config.table.change2 = "06";
			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrieveMemo"><span>메모</span></Link>
						<Link to="/retrievePlanpipe" className="active" ><span>계획배관</span></Link>
						<Link to="/retrieveEdit" ><span>수정의뢰</span></Link>
						<Link to="/retrieveRebuild"><span>재개발건축</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>법정동</label>
											<select id="bjdNm" name="bjdNm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>공사계획년원</label>
											<input type="text" id="noConstpln" />
										</div>
										<div className="form3">
											<label>공사ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form3">
											<label>공사명</label>
											<input type="text" id="nmConst" />
										</div>
										<div className="form3">
											<label>상태</label>
											<select id="status" name="status">
												<option value="" >전체</option>
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
								<div id="gridHeader" className="whymw1000">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="150"/>
										</colgroup>
										<thead>
											<tr>
												<th>법정동</th>
												<th>공사계획년원</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>상태</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_planpipe_list">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
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
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrievePlanpipeDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePlanpipe;