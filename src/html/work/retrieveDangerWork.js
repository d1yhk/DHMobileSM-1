
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

class retrieveDangerWork extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveDangerWork'){
			config.back.url.push('/retrieveDangerWork');
		}
		if(config.table_name.file !== "retrieveDangerWork"){
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
				startDate: null,//new Date(),
				endDate: null//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);

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
	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['status']) ? result[count]['status'] : '')+'</td>'
				td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbWork']) ? result[count]['gbWork'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmGbWork']) ? result[count]['nmGbWork'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmWork']) ? result[count]['nmWork'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtWorkReq']) ? result[count]['dtWorkReq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmCoConst']) ? result[count]['nmCoConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmEmpReq']) ? result[count]['nmEmpReq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtWorkRsv']) ? result[count]['dtWorkRsv'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmDept']) ? result[count]['nmDept'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_dangerwork_list tbody").html(td);
		}else{
			$(".grp_dangerwork_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_dangerwork_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var status = config.form_search(search_type,'status');
		var gbWork = config.form_search(search_type,'gbWork');
		var cdDept = config.form_search(search_type,'cdDept');
		var dtWorkRsvFr = config.form_search(search_type,'dtWorkRsvFr');
		var dtWorkRsvTo = config.form_search(search_type,'dtWorkRsvTo');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_dangerwork_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveDangerWorkList(idConst,nmConst,status,gbWork,cdDept,dtWorkRsvFr,dtWorkRsvTo,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_dangerwork_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_dangerwork_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_dangerwork_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
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
		
		config.table_name.file = 'retrieveDangerWork';

		config.fetchCommon("위험작업","상태","status");
		config.fetchCommon("ERP","CG_F_00081","gbWork");
		this.DeptListForDangerWork();

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

			$(".grp_dangerwork_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_dangerwork_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_dangerwork_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_dangerwork_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_dangerwork_list").scrollTop() >= ($(".grp_dangerwork_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_dangerwork_list tr");
		$(document).on("click",".grp_dangerwork_list tr",function(){
			config.grpifm.scroll = $(".grp_dangerwork_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_dangerwork_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			
			var id = config.grpifm.list[config.grpifm.select_no].idWork;
			config.table.p1="위험작업";
			config.table.p2=config.grpifm.list[config.grpifm.select_no].id;
			config.detail_file.index = id;

			config.table.attach1="위험작업";
			config.table.attach2=id;
		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveDangerWork" className="active"><span>위험작업</span></Link>
						<Link to="/retrieveRepair" ><span>보수작업</span></Link>
						<Link to="/retrieveProb"><span>피복탐측</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>공사ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form4">
											<label>공사명</label>
											<input type="text" id="nmConst" />
										</div>
										<div className="form4">
											<label>작업상태</label>
											<select id="status">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>작업구분</label>
											<select id="gbWork">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>주관부서</label>
											<select id="cdDept">
												<option value="">전체</option>
											</select>
										</div>

										<div className="form4">
											<label>작업예정일</label>
											<DatePicker
												 locale="ko" 
												id="dtWorkRsvFr"
												className="datepicker dtWorkRsvFr"
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
												id="dtWorkRsvTo"
												className="datepicker dtWorkRsvTo"
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
											<col width="auto"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>작업상태</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>작업구분코드</th>
												<th>작업구분명</th>
												<th>작업명</th>
												<th>작성일자</th>
												<th>시공업체</th>
												<th>작업요청자</th>
												<th>작업예정일</th>
												<th>주관부서</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_dangerwork_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="200"/>
											<col width="80"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="80"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveDangerWork','위험작업')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveDangerWorkDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveDangerWork;