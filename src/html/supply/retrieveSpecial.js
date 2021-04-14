
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
import icon10 from '../../image/icon10.png';
class retrieveSpecial extends Component {

	constructor(props) {
		super(props)
		this.page = {change : 0,num: 0, type:0,count:0, page:0 ,total:0};

			if(config.back.url[config.back.url.length-1] !== '/retrieveSpecial'){
				config.back.url.push('/retrieveSpecial');
			}
			if(config.table_name.file !== "retrieveSpecial"){
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
			td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['gbFragNm']) ? result[count]['gbFragNm'] : '')+'</td>';
			td = td + '<td data-fa="'+result[count]['gbFrag']+'">'+((result[count]['facilNo']) ? result[count]['facilNo'] : '')+'</td>';
			td = td + '<td>'+((result[count]['specialName']) ? result[count]['specialName'] : '')+'</td>';
			td = td + '<td>'+((result[count]['bjdNm']) ? result[count]['bjdNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['txLoc']) ? result[count]['txLoc'] : '')+'</td>';
			td = td + '<td>'+((result[count]['dtSet']) ? result[count]['dtSet'] : '')+'</td>';
			td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
			td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
			td = td + '<td>'+((result[count]['cdPressNm']) ? result[count]['cdPressNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_special_list tbody").html(td);
		}else{
			$(".grp_special_list tbody").append(td);
		}
		if( result.length <= 0 ){
			$(".grp_special_list tbody").html('<tr><td colspan="10">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

		//검사이력
		RetrieveInspRslt = (type) => {
			if(config.detail_file.index === ""){
				alert("항목을 선택해주세요");
			}else{
				//config.his.back = "retrieveSpecial";
				this.props.history.push("/RetrieveInspRslt/3/"+config.table.param3+"/"+config.table.param2);
			}
		}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var gbFrag = config.form_search(search_type,'gbFrag');
		var facilNo = config.form_search(search_type,'facilNo');
		var specialName = config.form_search(search_type,'specialName');
		var bjdNm = config.form_search(search_type,'bjdNm');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var noSector1 = config.form_search(search_type,'noSector1');
		var cdPress = config.form_search(search_type,'cdPress');
		var kdVb = config.form_search(search_type,'kdVb');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_special_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		
		try {
			const common = await Promise.all([ 
				service.retrieveSpecialList(gbFrag,facilNo,specialName,bjdNm,idConst,nmConst,noSector1,cdPress,kdVb,(this.page.page * 100),100)
			]);
			var result = common[0].data.result;
			this.page.total = (result.length + ((this.page.page) * 100));
			this.lists(result,0,search_type);
	
			if(this.page.type === 0){
				this.page.num = $(".grp_special_list tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_special_list tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");

		config.table_name.file = 'retrieveSpecial';

		config.table.param1="중점관리대상";
		
		config.fetchCommon("ERP","CG_F_00014","gbFrag");
		config.fetchCommon("ERP","CG_F_00008","noSector1");
		config.fetchCommon("ERP","CG_S_00008","cdPress");
		config.fetchCommon("ERP","CG_F_00069","kdVb");



		//config.fetchDong("");
		config.fetchERPDong("");

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

			$(".grp_special_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_special_list").scrollTop( config.table_height.height );
			},500);
			this.page.num = $(".grp_special_list tbody").height() / 2;
			this.page.type=1;
			
			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_special_list").scroll(function(){
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_special_list").scrollTop() >= ($(".grp_special_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_special_list tr");
		$(document).on("click",".grp_special_list tr",function(){
			$(".grp_special_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			config.grpifm.select_no = $(this).index();
			
			config.table.p1="중점관리시설";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");
			config.table.gil = $(this).find("td:eq(3)").html();

			config.table.attach1="중점관리대상";
			config.table.attach2=$(this).find("td:eq(6)").html();		//idConst
			config.table.attach3=$(this).find("td:eq(1)").html();		//facilNo
			
			config.table.param2=$(this).find("td:eq(1)").attr("data-fa");		//gbFrag
			config.table.param3=$(this).find("td:eq(1)").html();						//facilNo
			
			// 상세조회시 id값이 없으면 관리번호를 넘겨줌
			if($(this).find("td:eq(0)").attr("data-id") == "undefined"){
				config.detail_file.index = $(this).find("td:eq(1)").html();
				config.detail_file.param = "facilNo";
			} else {
				config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
				config.detail_file.param = "id";
			}

			//시설종류가 수취기일 경우
			if($(this).find("td:eq(1)").attr("data-fa") == '5'){
				config.table.p1="수취기";
			}
		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrievePipe"><span>배관</span></Link>
						<Link to="/retrieveValve"><span>밸브</span></Link>
						<Link to="/retrieveGov"><span>정압기</span></Link>
						<Link to="/retrieveSpecial" className="active"><span>중점관리대상</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>시설구분</label>
											<select id="gbFrag">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label className="ls2">관리번호</label>
											<input type="text" id="facilNo" />
										</div>
										<div className="form3">
											<label>시설명</label>
											<input type="text" id="specialName" />
										</div>
										<div className="form3">
											<label>법정동</label>
											<select id="cdDong" name="bjdNm">
												<option value="">전체</option>
											</select>
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
											<label>점검구간</label>
											<select id="noSector1">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>압력</label>
											<select id="cdPress">
												<option value="">전체</option>
											</select>
										</div>
										{/*
										<div className="form3">
											<label>밸브형식</label>
											<select id="kdVb">
												<option value="">전체</option>
											</select>
										</div>
										*/}

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
											<col width="80"/>
											<col width="120"/>
											<col width="120"/>
											<col width="80"/>
											<col width="200"/>
											<col width="80"/>
											<col width="70"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>시설구분</th>
												<th>관리번호</th>
												<th>시설명</th>
												<th>법정동</th>
												<th>설치위치</th>
												<th>설치일자</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>압력</th>
												<th>점검구간</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_special_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="120"/>
											<col width="120"/>
											<col width="80"/>
											<col width="200"/>
											<col width="80"/>
											<col width="70"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
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
						<button type="button"  className="btn_record" onClick={() => this.RetrieveInspRslt()}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveSpecial','중점관리대상')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveSpecialDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveSpecial;