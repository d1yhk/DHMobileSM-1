
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';



import icon10 from '../../image/icon10.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrievePushSendInfo extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrievePushSendInfo'){
			config.back.url.push('/retrievePushSendInfo');
		}
		if(config.table_name.file !== "retrievePushSendInfo"){
			config.detail_file.index = "";

			config.grpifm.select_no=-1;
			config.grpifm.search={};
			config.grpifm.list=[];
			config.grpifm.form = [];
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
				td = td + '<td>'+((result[count]['pushSeq']) ? result[count]['pushSeq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['contentTitle']) ? result[count]['contentTitle'] : '')+'</td>'
				td = td + '<td>'+((result[count]['mrgIdUser']) ? result[count]['mrgIdUser'] : '')+'</td>'
				td = td + '<td>'+((result[count]['mrgIdUserNm']) ? result[count]['mrgIdUserNm'] : '')+'</td>'
				td = td + '<td>'+((result[count]['responseCode']) ? result[count]['responseCode'] : '')+'</td>'
				td = td + '<td>'+((result[count]['crtDt']) ? result[count]['crtDt'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_pushsend_list tbody").html(td);
		}else{
			$(".grp_pushsend_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_pushsend_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var pushSeq = config.form_search(search_type,'pushSeq');
		var responseCode = config.form_search(search_type,'responseCode');
		var mrgIdUser = config.form_search(search_type,'mrgIdUser');
		var fromCrtDt = config.form_search(search_type,'fromCrtDt');
		var toCrtDt = config.form_search(search_type,'toCrtDt');



		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_pushsend_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrievePushSendInfo(pushSeq,responseCode,mrgIdUser,fromCrtDt,toCrtDt,(this.page.page * 100),100)
			]);
			
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_pushsend_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_pushsend_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_pushsend_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//상세정보
	fetchDetail = async () => { 
		this.props.history.push('/getInstrtDtl/'+config.grpifm.list[config.grpifm.select_no].pushSeq+"/"+config.grpifm.list[config.grpifm.select_no].mrgIdUser);
	}

	//전송상태코드
	retrieveResponseCode = async () => { 
		const option = await Promise.all([ 
			service.retrieveResponseCode()
		]);
		var result = option[0].data.result
		for(var count = 0; count < result.length; count++){
			$("#responseCode").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "상황조치";
		$(".header_title").html( "상황조치");
		
		config.table_name.file = 'retrievePushSendInfo';

		this.retrieveResponseCode();

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

			$(".grp_pushsend_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_pushsend_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_pushsend_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_pushsend_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_pushsend_list").scrollTop() >= ($(".grp_pushsend_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_pushsend_list tr");
		$(document).on("click",".grp_pushsend_list tr",function(){
			config.grpifm.scroll = $(".grp_pushsend_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_pushsend_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			

		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>지시이력목록</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>지시일련번호</label>
											<input type="text" id="pushSeq" />
										</div>
										<div className="form3">
											<label>전송상태</label>
											<select id="responseCode">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>담당자ID</label>
											<input type="text" id="mrgIdUser" />
										</div>
										<div className="form3">
											<label>지시일</label>
											<DatePicker
												 locale="ko" 
												id="fromCrtDt"
												className="datepicker fromCrtDt"
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
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="toCrtDt"
												className="datepicker toCrtDt"
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
											<col width="150"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="150"/>
										</colgroup>
										<thead>
											<tr>
												<th>일련번호</th>
												<th>제목</th>
												<th>담당자ID</th>
												<th>담당자명</th>
												<th>전송상태</th>
												<th>지시일</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_pushsend_list">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
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
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,0)}><img alt="" src={icon10} width="15" height="15" />지시전달</button>
						<button type="button" className="btn_detail" onClick={this.fetchDetail}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrievePushSendInfo;