
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
import icon6 from '../../image/icon6.png';
import close from '../../image/close.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveGeneral extends Component {
	constructor(props) {
		super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveGeneral'){
			config.back.url.push('/retrieveGeneral');
		}

		if(config.table_name.file !== "retrieveGeneral"){
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
				startDate: "",
				endDate: ""
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
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
			var sAddr = 0;
			if(result[count]['sAddr']){
				sAddr = result[count]['sAddr'];
			}
			td = td + '<tr>';
				td = td + '<td data-id="'+result[count]['cdFcltBld']+'">'+((result[count]['gbCntrNm']) ? result[count]['gbCntrNm'] : '')+'</td>';
				td = td + '<td data-a1="'+result[count]['roadAddr']+'" data-a2="'+result[count]['lAddr']+'" data-a3="'+sAddr+'">'+((result[count]['stUseNm']) ? result[count]['stUseNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFcltBld']) ? result[count]['cdFcltBld'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmFcltBld']) ? result[count]['nmFcltBld'] : '')+'</td>';
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSply']) ? result[count]['dtSply'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtChgInsp']) ? result[count]['dtChgInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['ynStdpipeNm']) ? result[count]['ynStdpipeNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdPressNm']) ? result[count]['cdPressNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cntHsTot']) ? result[count]['cntHsTot'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cntHs']) ? result[count]['cntHs'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdCom']) ? result[count]['cdCom'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmGov']) ? result[count]['nmGov'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_general_list tbody").html(td);
		}else{
			$(".grp_general_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_general_list tbody").html('<tr><td colspan="14">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var startDate = config.form_search(search_type,'startDate');
		var endDate = config.form_search(search_type,'endDate');
		var txAddr = config.form_search(search_type,'txAddr');
		var gbCntr = config.form_search(search_type,'gbCntr');
		var ynStdpipe = config.form_search(search_type,'ynStdpipe');
		var stUse = config.form_search(search_type,'stUse');
		var nmFcltBld = config.form_search(search_type,'nmFcltBld');

		//검색 초기화
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_general_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveGeneralList(startDate,endDate,txAddr,gbCntr,ynStdpipe,stUse,nmFcltBld,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_general_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_general_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_general_list tbody").html('<tr><td colspan="13">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');


		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");;
		config.table_name.file = 'retrieveGeneral';



		config.fetchCommon("ERP","CG_S_00005","gbCntr");
		config.fetchCommon("ERP","CG_Z_00018","ynStdpipe");
		config.fetchCommon("ERP","CG_U_00039","stUse");

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

			$(".grp_general_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_general_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_general_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_general_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_general_list").scrollTop() >= ($(".grp_general_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		
		//테이블 리스트 선택
		$(document).off("click",".grp_general_list tr");
		$(document).on("click",".grp_general_list tr",function(){
			config.grpifm.scroll = $(".grp_general_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_general_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="건물";
			config.table.p2="filter=road_nm:'"+$(this).find("td:eq(1)").attr("data-a1")+"',buld_mnnm:'"+$(this).find("td:eq(1)").attr("data-a2")+"',buld_slno:'"+$(this).find("td:eq(1)").attr("data-a3")+"'";

			config.table.attach1="사용시설1";
			config.table.attach2=$(this).find("td:eq(0)").attr("data-id");		//cdFcltBld
/*
공동주택 : kdFclt-07 고정 
특정사용시설 : kdFclt-06 고정 
일반사용시설 : kdFclt-08 고정 
단독정압기 : kdFclt-03 고정 
압력조정기 : kdFclt-04 고정 
*/
			config.table.change1 = $(this).find("td:eq(0)").attr("data-id");
			config.table.change2 = "08";
			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

		});
	}

	//변경이력
	changeList = async () => { 
		
		$("#popupContents tbody").html("");
		if( config.grpifm.select_no  >= 0){
			try {
				const common = await Promise.all([ 
					service.retrieveChangeList()
				]);
				
				$(".popup-spec").css("display","block");
				var result = common[0].data.result;
				for(var count = 0; count < result.length; count++){
					var td = '<tr>';
					td = td + '<td>'+((result[count]['seqChg']) ? result[count]['seqChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtChg']) ? result[count]['dtChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['fcltChg']) ? result[count]['fcltChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['modelChg']) ? result[count]['modelChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['rsnChg']) ? result[count]['rsnChg'] : '')+'</td>';
					td = td + '</tr>';
					$("#popupContents tbody").append(td);
				}
				if( result.length <= 0 ){
					$("#popupContents tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
				}
			} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
			}
		}else{
			alert("리스트를 선택해주세요");
		}
	}

	render() { 
		return (
			<div className="contents">
				<div className="popup popup-spec">
					<div className="popup-box table">
						<h2>변경이력 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div id="popupHeader" >
							<table>
								<thead>
									<tr>
										<th>순번</th>
										<th>변경일자</th>
										<th>시설구분</th>
										<th>변경설비</th>
										<th>모델명</th>
										<th>시공업체</th>
										<th>변경사유</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents" >
							<table>
								<colgroup>
									<col width="60"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="auto"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div className="list">
					<div className="tab tab5">
						<Link to="/retrieveCommunal"><span>공동주택</span></Link>
						<Link to="/retrieveSpecific"><span>특정사용시설</span></Link>
						<Link to="/retrieveGeneral" className="active"><span>일반사용시설</span></Link>
						<Link to="/retrieveGovernor"><span>단독정압기</span></Link>
						<Link to="/retrieveRegulator"><span>압력조정기</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>가스공급일</label>
											<DatePicker
												 locale="ko" 
												id="startDate"
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
												id="endDate"
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
										<div className="form2">
											<label>주소</label>
											<input type="text" id="txAddr"/>
										</div>

										<div className="form4">
											<label>공급유형</label>
											<select id="gbCntr" name="gbCntr">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>입상만 시공</label>
											<select id="ynStdpipe" name="ynStdpipe">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>사용여부</label>
											<select id="stUse" name="stUse">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시설명</label>
											<input type="text" id="nmFcltBld" name="nmFcltBld"/>
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
											<col width="60"/>
											<col width="60"/>
											<col width="60"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="60"/>
											<col width="60"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>공급유형</th>
												<th>사용여부</th>
												<th>관리번호</th>
												<th>시설명</th>
												<th>주소</th>
												<th>최초공급전<br/>검사일</th>
												<th>신규<br/>공급일자</th>
												<th>증설/변경<br/>공급일자</th>
												<th>입상만시공<br/>유/무</th>
												<th>압력</th>
												<th>총세대수</th>
												<th>사용세대수</th>
												<th>시공업체</th>
												<th>공급정압기</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_general_list">
									<table>
										<colgroup>
											<col width="60"/>
											<col width="60"/>
											<col width="60"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="60"/>
											<col width="60"/>
											<col width="80"/>
											<col width="100"/>
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
						<button type="button" className="btn_change" onClick={this.changeList}><img alt="" src={icon6} width="15" height="15" />변경이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGeneral','일반사용시설')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveGeneralDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGeneral;