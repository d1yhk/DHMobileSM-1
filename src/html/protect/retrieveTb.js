
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
import icon7 from '../../image/icon7.png';
import icon10 from '../../image/icon10.png';
import close_x from '../../image/close_x.png';
import close from '../../image/close.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveTb extends Component {
	constructor(props) {
		super(props)
			if(config.back.url[config.back.url.length-1] !== '/retrieveTb'){
				config.back.url.push('/retrieveTb');
			}

		this.state = {
				startDate: '',//new Date(),
				endDate: ''//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

		if(config.table_name.file !== "retrieveTb"){
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
					td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['gbPipeNm']) ? result[count]['gbPipeNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['facilNo']) ? result[count]['facilNo'] : '')+'</td>';
					td = td + '<td>'+((result[count]['facilNm']) ? result[count]['facilNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['bjdNm']) ? result[count]['bjdNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['setbmtDt']) ? result[count]['setbmtDt'] : '')+'</td>';
					td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['corptTypNm']) ? result[count]['corptTypNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['pressureNm']) ? result[count]['pressureNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['diaNm']) ? result[count]['diaNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['roadClassNm']) ? result[count]['roadClassNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_tb_list tbody").html(td);
		}else{
			$(".grp_tb_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_tb_list tbody").html('<tr><td colspan="12">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 
	fetchSearch = async (search_type) => { 
		var gbPipe = config.form_search(search_type,'gbPipe');
		var facilNo = config.form_search(search_type,'facilNo');
		var facilNm = config.form_search(search_type,'facilNm');
		var bjdNm = config.form_search(search_type,'bjdNm');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var noSector1 = config.form_search(search_type,'noSector1');
		var pressure = config.form_search(search_type,'pressure');
		var ynProtect = config.form_search(search_type,'ynProtect');

		//검색 초기화
		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_tb_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([ 
				service.retrieveTbList(gbPipe,facilNo,facilNm,bjdNm,idConst,nmConst,noSector1,pressure,ynProtect,(this.page.page * 100),100)
			]);
			
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_tb_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}
			}else{
				$(".message").html("&nbsp;");
				$(".grp_tb_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_tb_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");
		config.header.title = "방식시설";
		$(".header_title").html( "방식시설");
		config.table_name.file = 'retrieveTb';

		config.table.param1="전기방식";

		$(".map").css("display","none");
		config.fetchCommon("ERP","CG_F_00037","gbPipe");
		config.fetchCommon("ERP","CG_F_00008","noSector1");
		config.fetchCommon("공통","압력구분","pressure");
		config.fetchCommon("ERP","HR_ET00007","ynProtect");
		config.fetchCommon("전기방식","점검구분","gubun_popup");
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

			$(".grp_tb_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_tb_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_tb_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_tb_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_tb_list").scrollTop() >= ($(".grp_tb_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_tb_list tr");
		$(document).on("click",".grp_tb_list tr",function(){
			config.grpifm.scroll = $(".grp_tb_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_tb_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="TESTBOX";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");


			config.table.attach1="전기방식";
			config.table.attach2=$(this).find("td:eq(5)").html();		//idConst
			config.table.attach3=$(this).find("td:eq(1)").html();		//facilNo


			config.table.param3=$(this).find("td:eq(1)").html();						//facilNo
			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
		});


	}
	//과년도 전위값
	prevYear = async () => { 
		$(".popup-year").css("display","block");
		$("#popupContents tbody").html("");

		
		try {	
			const common = await Promise.all([ 
				service.retrievePastTb(config.table.attach3 , $("#gubun_popup").val(), $("#yyPlnFr_poup").val(), $("#yyPlnTo_popup").val())
			]);
			
		
			$("#popupContents tbody").html("");
			var result = common[0].data.result;

			for(var count = 0; count < result.length; count++){
				var td =  '<tr>';
				td = td + '<td>'+((result[count]['noTb']) ? result[count]['noTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmTb']) ? result[count]['nmTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmInspType']) ? result[count]['nmInspType'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq4']) ? result[count]['seq4'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq5']) ? result[count]['seq5'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq6']) ? result[count]['seq6'] : '')+'</td>';
				td = td + '</tr>';
				$("#popupContents tbody").append(td);
			}
			if(result.length === 0 || !result){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');
			}
		} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');

		}
	}
	render() { 
		return (
			<div className="contents">

				<div className="popup popup-year">
					<div className="popup-box table">
						<h2>과년도 전위값 <button type="button" className="close_popup"><img src={close} width="20" height="20" alt="" /></button></h2>
						<div className="box search2">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사구분</label>
											<select id="gubun_popup" name="gubun_popup">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>점검년도</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnFr_poup"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnTo_popup"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={this.prevYear} >검색</button>
								</fieldset>
							</form>
						</div>
						<div id="popupContents" className="martop20" >
							<table>
								<thead>
									<tr>
										<th>TB코드</th>
										<th>시설명</th>
										<th>검사구분</th>
										<th>측정일자</th>
										<th>통합전위</th>
										<th>배관전위</th>
										<th>MG전위</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
							<div className="popup_btn">
								<button type="button" className="close_popup close_x"><img src={close_x} width="16" height="16" alt="" />닫기</button>
							</div>
						</div>
					</div>
				</div>

				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveTb" className="active"><span>전기방식</span></Link>
						<Link to="/retrieveRectifier"><span>외부전원장치</span></Link>
						<Link to="/retrieveJoin"><span>절연조인트</span></Link>
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
											<label>공사ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form3">
											<label>공사명</label>
											<input type="text" id="nmConst" />
										</div>
										<div className="form3">
											<label>배관구분</label>
											<select id="gbPipe">
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
											<label>관리번호</label>
											<input type="text" id="facilNo" />
										</div>
										<div className="form3">
											<label>시설명</label>
											<input type="text" id="facilNm" />
										</div>
										<div className="form3">
											<label>점검구간</label>
											<select id="noSector1">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>보호관여부</label>
											<select id="ynProtect">
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
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="200"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="80"/>
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
												<th>방식방법</th>
												<th>압력</th>
												<th>관경</th>
												<th>점검구간</th>
												<th>도로구분</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_tb_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="200"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveTb','절연조인트')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,2)}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveTbDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
						<button type="button" className="btn_year" onClick={this.prevYear}  ><img alt="" src={icon7} width="15" height="15" />과년도 전위값</button>

					</div>
				</footer>
	
			</div>
		);
	}
}

export default retrieveTb;