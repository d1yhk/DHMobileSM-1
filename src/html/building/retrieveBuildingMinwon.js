/*ppt 182 고객관리 현장민원접수 */

import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import PopupUser from '../../components/PopupUser';
import btnback from '../../image/btn_back.png';

import footer_timelist from '../../image/footer_timelist.png';
import footer_document from '../../image/footer_document.png';

import icon4 from '../../image/icon4.png';

import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveBuildingMinwon extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveBuildingMinwon'){
			config.back.url.push('/retrieveBuildingMinwon');
		}
		if(config.table_name.file !== "retrieveBuildingMinwon"){
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
					td = td + '<td>'+((result[count]['civilCom']) ? result[count]['civilCom'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtAcpt']) ? result[count]['dtAcpt'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmCivil']) ? result[count]['nmCivil'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noCust']) ? result[count]['noCust'] : '')+'</td>'
					td = td + '<td>'+((result[count]['addr']) ? result[count]['addr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmRprt']) ? result[count]['nmRprt'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmRprt']) ? result[count]['nmRprt'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmStCivil']) ? result[count]['nmStCivil'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtHndl']) ? result[count]['dtHndl'] : '')+'</td>'
			td = td + '</tr>';
		}
			
		if(search_type === 1){
			$(".grp_minwon_list tbody").html(td);
		}else{
			$(".grp_minwon_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_minwon_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	btnNew = () => {
		this.props.history.push("/retrieveBuildingMinwonDetail");
	}
	btnDetail = () => {
		if(config.grpifm.select_no>=0){
			var noCust = config.grpifm.list[config.grpifm.select_no].noCust;
			var noCivil = config.grpifm.list[config.grpifm.select_no].noCivil;
			var buildId = 0;
			if(config.grpifm.list[config.grpifm.select_no].buildId !== undefined){
				buildId = config.grpifm.list[config.grpifm.select_no].buildId;
			}

			this.props.history.push("/retrieveBuildingMinwonDetail/"+noCust+"/"+noCivil+"/"+buildId);
		}else{
			alert("민원 항목을 선택해주세요");
		}
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var civilCom = config.form_search(search_type,'civilCom');
		var cdCivilAcpt = config.form_search(search_type,'cdCivilAcpt');
		var dtAcptFr = config.form_search(search_type,'dtAcptFr');
		var dtAcptTo = config.form_search(search_type,'dtAcptTo');
		var noEmpAcpt = config.form_search(search_type,'noEmpAcpt');
		var addr = config.form_search(search_type,'addr');
		var dtHndlFr = config.form_search(search_type,'dtHndlFr');
		var dtHndlTo = config.form_search(search_type,'dtHndlTo');
		var stCivil = config.form_search(search_type,'stCivil');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_minwon_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveBuildingMinwonList(civilCom,cdCivilAcpt,dtAcptFr,dtAcptTo,noEmpAcpt,addr,dtHndlFr,dtHndlTo,stCivil,(this.page.page * 100),100)
			]);
			
			var result = common[0].data.result;
			this.page.total = (result.length + ((this.page.page) * 100));
			this.lists(result,0,search_type);
			if(this.page.type === 0){
				this.page.num = $(".grp_minwon_list tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_minwon_list tbody").html('<tr><td colspan="9">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	retrieveCivilCode = async () => {
			const list = await Promise.all([ 
				service.retrieveCivilCode()
			]);
			var result = list[0].data.result;
			for(var count = 0; count < result.length; count++){
				$("#cdCivilAcpt").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
			}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "고객관리";
		$(".header_title").html( "고객관리");
		
		config.table_name.file = 'retrieveBuildingMinwon';


		config.fetchStrCode("ERP","CG_C_00006","stCivil");
		this.retrieveCivilCode();


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

			$(".grp_minwon_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_minwon_list").scrollTop( config.table_height.height );
			},500);

			this.page.num = $(".grp_minwon_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_minwon_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_minwon_list").scrollTop() >= ($(".grp_minwon_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		
		$(document).off("click",".grp_minwon_list tr");
		$(document).on("click",".grp_minwon_list tr",function(){
			config.grpifm.scroll = $(".grp_minwon_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_minwon_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			var id = config.grpifm.list[config.grpifm.select_no].buildId;
			config.table.p1="건물";
			config.table.p2=id;
			config.detail_file.index = id;
		});

	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser />
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>현장민원접수</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>GIS등록여부</label>
											<select id="civilCom">
												<option value="">전체</option>
												<option value="GIS">Y</option>
												<option value="ERP">N</option>
											</select>
										</div>
										<div className="form4">
											<label>민원코드</label>
											<select id="cdCivilAcpt">
												<option value="">전체</option>
											</select>
										</div>

										<div className="form4">
											<label>접수일자</label>
											<DatePicker
												 locale="ko" 
												id="dtAcptFr"
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
												id="dtAcptTo"
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
											<label>접수자</label>
											<input type="text" id="noEmpAcpt" className="nmSelect readonly" readOnly onClick={() => this.userInfo()}/>
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										<div className="form4">
											<label>주소</label>
											<input type="text" id="addr" />
										</div>

										<div className="form4">
											<label>처리일자</label>
											<DatePicker
												 locale="ko" 
												id="dtHndlFr"
												className="datepicker"
												selected={this.state.startDate2}
												onChange={this.startDateChange2}
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
												id="dtHndlTo"
												className="datepicker"
												selected={this.state.endDate2}
												onChange={this.endDateChange2}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>


										<div className="form4">
											<label>처리상태</label>
											<select id="stCivil">
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
											<col width="120"/>
											<col width="120"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="120"/>
										</colgroup>
										<thead>
											<tr>
												<th>GIS등록여부</th>
												<th>접수일시</th>
												<th>민원코드</th>
												<th>수용가번호</th>
												<th>주소</th>
												<th>고객명</th>
												<th>접수자</th>
												<th>처리상태</th>
												<th>처리일시</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_minwon_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="120"/>
											<col width="120"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="120"/>
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
						<button type="button" className="btn_file"  onClick={() => this.btnDetail()}  ><img alt="" src={footer_document} width="15" height="15" />민원</button>
						<button type="button" className="btn_file"  onClick={() => this.btnNew()}  ><img alt="" src={footer_timelist} width="15" height="15" />접수</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveBuildingMinwon;