
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


class retrieveValve extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0,total:0};
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveValve'){
			config.back.url.push('/retrieveValve');
		}
		if(config.table_name.file !== "retrieveValve"){
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
			td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['gbPipeNm']) ? result[count]['gbPipeNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['facilNo']) ? result[count]['facilNo'] : '')+'</td>';
			td = td + '<td>'+((result[count]['nmVb']) ? result[count]['nmVb'] : '')+'</td>';
			td = td + '<td>'+((result[count]['bjdNm']) ? result[count]['bjdNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['dtSet']) ? result[count]['dtSet'] : '')+'</td>';
			td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
			td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
			td = td + '<td>'+((result[count]['valveTypNm']) ? result[count]['valveTypNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['pressureNm']) ? result[count]['pressureNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['diaNm']) ? result[count]['diaNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['roadClassNm']) ? result[count]['roadClassNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_valve_list tbody").html(td);
		}else{
			$(".grp_valve_list tbody").append(td);
		}
		if( result.length <= 0 ){
			$(".grp_valve_list tbody").html('<tr><td colspan="12">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var gbPipe = config.form_search(search_type,'gbPipe');
		var facilNo = config.form_search(search_type,'facilNo');
		var nmVb = config.form_search(search_type,'nmVb');
		var bjdNm = config.form_search(search_type,'bjdNm');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var noSector1 = config.form_search(search_type,'noSector1');
		var pressure = config.form_search(search_type,'pressure');
		var valveTyp = config.form_search(search_type,'valveTyp');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_valve_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveValveList(gbPipe,facilNo,nmVb,bjdNm,idConst,nmConst,noSector1,pressure,valveTyp,(this.page.page * 100),100)
			]);
			var result = common[0].data.result;
			this.page.total = (result.length + ((this.page.page) * 100));

			this.lists(result,0,search_type);

			if(this.page.type === 0){
				this.page.num = $(".grp_valve_list tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_valve_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//상세정보
	fetchDetail = async () => { 
		this.props.history.push('/retrieveValveDetail/'+config.detail_file.index);
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");
		
		config.table_name.file = 'retrieveValve';


		config.fetchCommon("ERP","CG_F_00037","gbPipe");			//공사구분
		config.fetchCommon("공통","압력구분","pressure");				//압력구분
		config.fetchCommon("ERP","CG_F_00008","noSector1");		//점검구간
		config.fetchCommon("밸브","밸브유형","valveTyp");					//배관구분
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

			$(".grp_valve_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_valve_list").scrollTop( config.table_height.height );
			},500);
			this.page.num = $(".grp_valve_list tbody").height() / 2;
			this.page.type=1;
			
			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_valve_list").scroll(function(){
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_valve_list").scrollTop() >= ($(".grp_valve_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_valve_list tr");
		$(document).on("click",".grp_valve_list tr",function(){
			config.grpifm.scroll = $(".grp_valve_list").scrollTop();
			$(".grp_valve_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			config.grpifm.select_no = $(this).index();
			var id = config.grpifm.list[config.grpifm.select_no].id;
			config.table.p1="밸브";
			config.table.p2=id;
			config.table.gil = $(this).find("td:eq(3)").html();
			config.detail_file.index = id;

			config.table.attach1="밸브";
			config.table.attach2=config.grpifm.list[config.grpifm.select_no].idConst;	//idConst
			config.table.attach3=config.grpifm.list[config.grpifm.select_no].facilNo;	//facilNo
			
			config.table.param3 = config.grpifm.list[config.grpifm.select_no].facilNo;
		});
	}






	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrievePipe"><span>배관</span></Link>
						<Link to="/retrieveValve" className="active"><span>밸브</span></Link>
						<Link to="/retrieveGov"><span>정압기</span></Link>
						<Link to="/retrieveSpecial"><span>중점관리대상</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>법정동</label>
											<select id="bjdNm">
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
											<label>압력구분</label>
											<select id="pressure">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>밸브형식</label>
											<select id="valveTyp">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>배관구분</label>
											<select id="gbPipe">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>관리번호</label>
											<input type="text" id="facilNo" />
										</div>
										<div className="form3">
											<label>시설명</label>
											<input type="text" id="nmVb" />
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
											<col width="80"/>
											<col width="80"/>
											<col width="200"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>배관구분</th>
												<th>관리번호</th>
												<th>시설명</th>
												<th>법정동</th>
												<th>설치일자</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>밸브형식</th>
												<th>압력구분</th>
												<th>관경</th>
												<th>점검구간</th>
												<th>도로구분</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_valve_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="200"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,1)}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveValve','밸브')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveValveDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveValve;