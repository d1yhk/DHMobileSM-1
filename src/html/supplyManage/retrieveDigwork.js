
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";


import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveDigwork extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

		if(config.back.url[config.back.url.length-1] !== '/retrieveDigwork'){
			config.back.url.push('/retrieveDigwork');
		}

		if(config.table_name.file !== "retrieveDigwork"){
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

		if(config.table.page > 0 ){
			this.page.page = config.table.page;
		}
		this.results = [];

		this.state = {
			startDate: null,
			endDate: null,
			startDate2: null,
			endDate2: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange2 = this.endDateChange2.bind(this);
	}

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}
	startDateChange2(date) {
		this.setState({
			startDate2: date
		});
	}
	endDateChange2(date) {
			this.setState({
					endDate2: date
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
					td = td + '<td data-id="'+result[count]['jupno']+'">'+((result[count]['stado']) ? result[count]['stado'] : '')+'</td>';
					td = td + '<td>'+((result[count]['jupno']) ? result[count]['jupno'] : '')+'</td>';
					td = td + '<td>'+((result[count]['locnm']) ? result[count]['locnm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['stateNm']) ? result[count]['stateNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['fstdt']) ? result[count]['fstdt'] : '')+'</td>';
					td = td + '<td>'+((result[count]['locguNm']) ? result[count]['locguNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['staStoDt']) ? result[count]['staStoDt'] : '')+'</td>';
					td = td + '<td>'+((result[count]['stEocsNm']) ? result[count]['stEocsNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_digwork_list tbody").html(td);
		}else{
			$(".grp_digwork_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_digwork_list tbody").html('<tr><td colspan="8">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var bjdnm = config.form_search(search_type,'cdDong');
		var jupno = config.form_search(search_type,'jupno');
		var locnm = config.form_search(search_type,'locnm');
		var state = config.form_search(search_type,'state');
		var fstdtFr = config.form_search(search_type,'fstdtFr');
		var fstdtTo = config.form_search(search_type,'fstdtTo');
		var stEocs = config.form_search(search_type,'stEocs');
		var stadt = config.form_search(search_type,'stadt');
		var stodt = config.form_search(search_type,'stodt');
		var locgu = config.form_search(search_type,'locgu');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_digwork_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveDigworkList(bjdnm, jupno, locnm, state, fstdtFr, fstdtTo, stEocs, stadt, stodt, locgu,(this.page.page * 100),100)
			]);

			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_digwork_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}

			}else{
				$(".message").html("&nbsp;");
				$(".grp_digwork_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_digwork_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
    }
    
    fetchDetail() {
			
			var jupno = config.grpifm.list[config.grpifm.select_no].jupno;
      this.props.history.push('/retrieveDigworkDetail/'+jupno);
    }

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "굴착공사";
		$(".header_title").html( "굴착공사");
		config.table_name.file = 'retrieveDigwork';

		config.table.attach1="굴착공사";


        config.fetchCommon("ERP","CG_F_00078","state");			//EOCS상태
		config.fetchCommon("ERP","CG_F_00083","stEocs");	    //공사상태
		config.fetchCommon("ERP","CG_F_00080","locgu");			//공사종류

		$(".message").html("검색중입니다.");
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

			$(".grp_digwork_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_digwork_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_digwork_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_digwork_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_digwork_list").scrollTop() >= ($(".grp_digwork_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_digwork_list tr");
		$(document).on("click",".grp_digwork_list tr",function(){
			config.grpifm.scroll = $(".grp_digwork_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_digwork_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

      config.table.p1 = '굴착공사';
      config.table.p2 = config.grpifm.list[config.grpifm.select_no].jupno;
      config.table.attach1 = '굴착공사';
      config.table.attach2 = config.grpifm.list[config.grpifm.select_no].jupno;
      
			config.detail_file.index = config.grpifm.list[config.grpifm.select_no].jupno;
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>굴착공사</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>법정동</label>
											<select id="cdDong" name="bjdnm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>EOCS접수번호</label>
											<input type="text" id="jupno" />
										</div>
										<div className="form2">
											<label>굴착공사명</label>
											<input type="text" id="locnm" />
										</div>
										<div className="form4">
											<label>EOCS상태</label>
											<select id="state">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>굴착접수일</label>
												<DatePicker
													 locale="ko" 
													id="fstdtFr"
													className="datepicker"
													selected={this.state.startDate2}
													onChange={this.startDateChange2}
													dateFormat="yyyyMMdd"
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
													id="fstdtTo"
													className="datepicker"
													selected={this.state.endDate2}
													onChange={this.endDateChange2}
													dateFormat="yyyyMMdd"
													showYearDropdown
													isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>

										</div>
										<div className="form4">
											<label>공사상태</label>
											<select id="stEocs">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>공사예정일</label>
												<DatePicker
													 locale="ko" 
													id="stodt"
													className="datepicker"
													selected={this.state.startDate}
													onChange={this.startDateChange}
													dateFormat="yyyyMMdd"
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
													id="stodt"
													className="datepicker"
													selected={this.state.endDate}
													onChange={this.endDateChange}
													dateFormat="yyyyMMdd"
													showYearDropdown
													isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
										</div>
										<div className="form4">
											<label>공사종류</label>
											<select id="locgu">
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
											<col width="100"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="150"/>
											<col width="80"/>
											<col width="170"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>법정동</th>
												<th>EOCS접수번호</th>
												<th>굴착공사명</th>
												<th>EOCS상태</th>
												<th>굴착접수일</th>
												<th>공사종류</th>
												<th>공사예정일</th>
												<th>공사상태</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_digwork_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="150"/>
											<col width="80"/>
											<col width="170"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveDigwork','굴착공사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => this.fetchDetail(this.props,'retrieveDigworkDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default withRouter(retrieveDigwork);
