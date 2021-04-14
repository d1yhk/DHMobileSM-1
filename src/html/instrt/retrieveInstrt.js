/*ppt187 상황조치 지시처리관리 */
import React, { Component } from 'react';
import { Link } from "react-router-dom";

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon10 from '../../image/icon10.png';




import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveInstrt extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveInstrt'){
			config.back.url.push('/retrieveInstrt');
		}
		if(config.table_name.file !== "retrieveInstrt"){
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
				endDate: null,//new Date()
				startDate2: null,//new Date(),
				endDate2: null//new Date()
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
				td = td + '<td>'+((result[count]['pushSeq']) ? result[count]['pushSeq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['intTitle']) ? result[count]['intTitle'] : '')+'</td>'
				td = td + '<td>'+((result[count]['intActStateNm']) ? result[count]['intActStateNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['mrgIdUser']) ? result[count]['mrgIdUser'] : '')+'</td>'
				td = td + '<td>'+((result[count]['mrgIdUserNm']) ? result[count]['mrgIdUserNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['intDt']) ? result[count]['intDt'] : '')+'</td>'
				td = td + '<td>'+((result[count]['actDt']) ? result[count]['actDt'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_instrt_list tbody").html(td);
		}else{
			$(".grp_instrt_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_instrt_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var fromIntDt = config.form_search(search_type,'fromIntDt');
		var toIntDt = config.form_search(search_type,'toIntDt');
		var fromActDt = config.form_search(search_type,'fromActDt');
		var toActDt = config.form_search(search_type,'toActDt');
		var intActState = config.form_search(search_type,'intActState');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_instrt_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveInstrt(fromIntDt,toIntDt,fromActDt,toActDt,intActState,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_instrt_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_instrt_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_instrt_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//상세정보
	fetchDetail = async () => { 
		this.props.history.push('/getInstrtDtl/'+config.grpifm.list[config.grpifm.select_no].pushSeq+"/"+config.grpifm.list[config.grpifm.select_no].mrgIdUser);
	}

	//조치처리
	infoDetail = async () => { 
		if(config.grpifm.list[config.grpifm.select_no].intActStateNm==="지시"){
			this.props.history.push('/getInstrtDtlWrite/'+config.grpifm.list[config.grpifm.select_no].pushSeq+"/"+config.grpifm.list[config.grpifm.select_no].mrgIdUser);
		}else if(config.grpifm.list[config.grpifm.select_no].intActStateNm==="처리"){
			alert("처리 완료된 지시입니다.");
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "상황조치";
		$(".header_title").html( "상황조치");
		
		config.table_name.file = 'retrievePushSendInfo';

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

			$(".grp_instrt_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_instrt_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_instrt_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_instrt_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_instrt_list").scrollTop() >= ($(".grp_instrt_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_instrt_list tr");
		$(document).on("click",".grp_instrt_list tr",function(){
			config.grpifm.scroll = $(".grp_instrt_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_instrt_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			

		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>지시처리관리</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>지시일</label>
											<DatePicker
												 locale="ko" 
												id="fromIntDt"
												className="datepicker fromIntDt"
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
												id="toIntDt"
												className="datepicker toIntDt"
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
											<label>처리일</label>
											<DatePicker
												 locale="ko" 
												id="fromActDt"
												className="datepicker fromActDt"
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
												id="toActDt"
												className="datepicker toActDt"
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
											<label>전송상태</label>
											<select id="intActState">
												<option value="">전체</option>
												<option value="N">지시</option>
												<option value="Y">처리</option>
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
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>지시일련번호</th>
												<th>제목</th>
												<th>상태</th>
												<th>담당자</th>
												<th>지시일</th>
												<th>처리일</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_instrt_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
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
						<button type="button"  className="btn_record" onClick={this.infoDetail}><img alt="" src={icon10} width="15" height="15" />조치처리</button>
						<button type="button" className="btn_detail" onClick={this.fetchDetail}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveInstrt;