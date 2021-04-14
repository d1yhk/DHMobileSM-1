
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);


class retrievePunch extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePunch'){
			config.back.url.push('/retrievePunch');
		}

		if(config.table_name.file !== "retrievePunch"){
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
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		config.detail_file.index = "";
		this.state = {
				startDate: null,//new Date(),
				endDate: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
	}
	startDateChange(date) {
		this.setState({
				startDate: date
		});
	//if(date.getTime() > this.state.endDate.getTime()){
	//	this.endDateChange(date);
	//}
	}
	endDateChange(date) {
		this.setState({
				endDate: date
		});
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
					td = td + '<td>'+((result[count]['constDate']) ? result[count]['constDate'] : '')+'</td>';
					td = td + '<td>'+((result[count]['constNm']) ? result[count]['constNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['coatingNm']) ? result[count]['coatingNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dustNm']) ? result[count]['dustNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['corrosionNm']) ? result[count]['corrosionNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['pipeThick']) ? result[count]['pipeThick'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_punch_list tbody").html(td);
		}else{
			$(".grp_punch_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_punch_list tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var bjdNm = config.form_search(search_type,'bjdNm');
		var constNm = config.form_search(search_type,'constNm');
		var constDateFr = config.form_search(search_type,'constDateFr');
		var constDateTo = config.form_search(search_type,'constDateTo');
		var coating = config.form_search(search_type,'coating');
		var dust = config.form_search(search_type,'dust');
		var corrosion = config.form_search(search_type,'corrosion');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;

			this.page.total=0;
			$(".grp_punch_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([ 
				service.retrievePunchList(bjdNm,constNm,constDateFr,constDateTo,coating,dust,corrosion,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_punch_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_punch_list tbody").html('<tr><td colspan="7">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_punch_list tbody").html('<tr><td colspan="7">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "관리시설";
		$(".header_title").html( "관리시설");
		config.table_name.file = 'retrievePunch';


		config.fetchCommon("천공칩","코팅상태","coating");
		config.fetchCommon("천공칩","분진여부","dust");
		config.fetchCommon("천공칩","부식상태","corrosion");

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

			$(".grp_punch_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_punch_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_punch_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_punch_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_punch_list").scrollTop() >= ($(".grp_punch_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_punch_list tr");
		$(document).on("click",".grp_punch_list tr",function(){
			config.grpifm.scroll = $(".grp_punch_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_punch_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="천공칩";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");
			

			config.table.attach1="천공칩";
			config.table.attach2=$(this).find("td:eq(0)").attr("data-id");	//idConst
			config.table.attach3="";

			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

		});
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveCoatdamage"><span>피복손상부</span></Link>
						<Link to="/retrieveSoilresist" ><span>토양비저항</span></Link>
						<Link to="/retrievePunch" className="active"><span>천공칩</span></Link>
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
											<label>작업명</label>
											<input type="text" id="constNm" />
										</div>
										<div className="form4">
											<label>작업일</label>
											<DatePicker
												 locale="ko" 
												id="constDateFr"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form4">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="constDateTo"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form4">
											<label>코팅상태</label>
											<select id="coating" name="coating">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>분진여부</label>
											<select id="dust" name="dust">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>부식상태</label>
											<select id="corrosion" name="corrosion">
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
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>법정동</th>
												<th>작업일</th>
												<th>작업명</th>
												<th>코팅상태</th>
												<th>분진여부</th>
												<th>부식상태</th>
												<th>배관두께</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_punch_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
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
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrievePunchDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePunch;