
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
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveRepair extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveRepair'){
			config.back.url.push('/retrieveRepair');
		}
		if(config.table_name.file !== "retrieveRepair"){
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
				td = td + '<td>'+((result[count]['nmDong']) ? result[count]['nmDong'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmInspType']) ? result[count]['nmInspType'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmKdFclt']) ? result[count]['nmKdFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['status']) ? result[count]['status'] : '')+'</td>'
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmEmpInsp']) ? result[count]['nmEmpInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['crtDt']) ? result[count]['crtDt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['id']) ? result[count]['id'] : '')+'</td>'
				td = td + '<td>'+((result[count]['idInsp']) ? result[count]['idInsp'] : '')+'</td>'
				td = td + '<td>'+((result[count]['facilId']) ? result[count]['facilId'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_repair_list tbody").html(td);
		}else{
			$(".grp_repair_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_repair_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var cdDong = config.form_search(search_type,'cdDong');
		var idInspType = config.form_search(search_type,'idInspType');
		var status = config.form_search(search_type,'status');
		var kdFclt = config.form_search(search_type,'kdFclt');
		var crtDtFr = config.form_search(search_type,'crtDtFr');
		var crtDtTo = config.form_search(search_type,'crtDtTo');
		var dtInspFr = config.form_search(search_type,'dtInspFr');
		var dtInspTo = config.form_search(search_type,'dtInspTo');



		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_repair_list tbody").html("");
			config.grpifm.list=[];
		}
		try {
			const common = await Promise.all([ 
				service.retrieveRepairList(cdDong,idInspType,status,kdFclt,crtDtFr,crtDtTo,dtInspFr,dtInspTo,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_repair_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_repair_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_repair_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//주관부서
	//retrieveDeptListForDangerWork
	DeptListForDangerWork = async (search_type) => { 	
		const op_list = await Promise.all([ 
			service.retrieveDeptListForDangerWork()
		]);

		var op = op_list[0].data.result;
		for(var count = 0; count < op.length; count++){
			$("#cdDept").append('<option value="'+op[count].cdDept+'">'+op[count].nmDept+'</option>');
		}

	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");
		
		config.table_name.file = 'retrieveRepair';



		config.fetchCommon("보수작업","점검구분","idInspType");
		config.fetchCommon("보수작업","상태","status");
		config.fetchCommon("보수작업","시설종류","kdFclt");

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

			$(".grp_repair_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_repair_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_repair_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_repair_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_repair_list").scrollTop() >= ($(".grp_repair_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_repair_list tr");
		$(document).on("click",".grp_repair_list tr",function(){
			config.grpifm.scroll = $(".grp_repair_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_repair_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			
			var id = config.grpifm.list[config.grpifm.select_no].idInsp;

			config.table.p1=config.grpifm.list[config.grpifm.select_no].nmLocation;
			//if( parseInt(config.grpifm.list[config.grpifm.select_no].facilId) > 0 ){
				config.table.p2=config.grpifm.list[config.grpifm.select_no].facilId;
			//}else{
			//	config.table.p2=config.grpifm.list[config.grpifm.select_no].id;
			//}

			config.detail_file.index = id;
//			alert(config.table.p1+"/"+config.table.p2)

			config.table.attach1="보수작업";
			config.table.attach2=config.grpifm.list[config.grpifm.select_no].idInspType;
			config.table.attach3=config.grpifm.list[config.grpifm.select_no].idInsp;
			config.table.attach4=config.grpifm.list[config.grpifm.select_no].cdFclt;
		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveDangerWork"><span>위험작업</span></Link>
						<Link to="/retrieveRepair" className="active"><span>보수작업</span></Link>
						<Link to="/retrieveProb"><span>피복탐측</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>법정동</label>
											<select id="cdDong">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>구분</label>
											<select id="idInspType">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>진행상태</label>
											<select id="status">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설종류</label>
											<select id="kdFclt">
												<option value="">전체</option>
											</select>
										</div>

										<div className="form4">
											<label>작업예정일</label>
											<DatePicker
												 locale="ko" 
												id="crtDtFr"
												className="datepicker crtDtFr"
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
												id="crtDtTo"
												className="datepicker crtDtTo"
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
											<label>검사일자</label>
											<DatePicker
												 locale="ko" 
												id="dtInspFr"
												className="datepicker dtInspFr"
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
												id="dtInspTo"
												className="datepicker dtInspTo"
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
											<col width="auto"/>
											<col width="80"/>
											<col width="120"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="120"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>법정동</th>
												<th>구분</th>
												<th>시설종류</th>
												<th>시설번호</th>
												<th>진행상태</th>
												<th>주소</th>
												<th>검사일자</th>
												<th>검사자</th>
												<th>등록일</th>
												<th>id(미표시)</th>
												<th>점검번호(미표시)</th>
												<th>시설물ID(미표시)</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_repair_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="120"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="120"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveRepair','보수작업')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveRepairDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveRepair;