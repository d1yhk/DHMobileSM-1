
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

class retrieveAptInsp extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		this.cdFclt = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveAptInsp'){
			config.back.url.push('/retrieveAptInsp');
		}

		if(config.table_name.file !== "retrieveAptInsp"){
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
			startDate: '',
			endDate: ''
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
				td = td + '<td data-id="'+result[count]['idInsp']+'" data-idtype="'+result[count]['idInspType']+'" data-raddr="'+result[count]['roadAddr']+'" data-laddr="'+result[count]['lAddr']+'" data-saddr="'+((result[count]['sAddr']) ? result[count]['sAddr'] : '' )+'">'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtFstInsp']) ? result[count]['dtFstInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cntDong']) ? result[count]['cntDong'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cntHsTot']) ? result[count]['cntHsTot'] : '')+'</td>';
				td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>';
				td = td + '<td>'+((result[count]['qtyVol']) ? result[count]['qtyVol'] : '')+'</td>';
				td = td + '<td>'+((result[count]['clsInsp']) ? result[count]['clsInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInspPln']) ? result[count]['dtInspPln'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_aptinsp_list tbody").html(td);
		}else{
			$(".grp_aptinsp_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_aptinsp_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var inspGubun = config.form_search(search_type,'inspGubun');
		var dtInspPlnFr = config.form_search(search_type,'dtInspPlnFr');
		var dtInspPlnTo = config.form_search(search_type,'dtInspPlnTo');
		var nmFclt = config.form_search(search_type,'nmFclt');
		var txAddr = config.form_search(search_type,'txAddr');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_aptinsp_list tbody").html("");
			config.grpifm.list=[];
		}
		
		try {
			const common = await Promise.all([ 
				//bjdNm, idInspType, nmFclt, dtLawFr, dtLawTo, dtInspPlnFr, dtInspPlnTo, 
				service.retrieveAptInspList(inspGubun, dtInspPlnFr, dtInspPlnTo, nmFclt, txAddr, (this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_aptinsp_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_aptinsp_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_aptinsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "사용시설";
		$(".header_title").html( "사용시설");
		config.table_name.file = 'retrieveAptInsp';


		config.fetchCommon("사용시설","검사구분","inspGubun","공동주택");

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

			$(".grp_aptinsp_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_aptinsp_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_aptinsp_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_aptinsp_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_aptinsp_list").scrollTop() >= ($(".grp_aptinsp_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_aptinsp_list tr");
		$(document).on("click",".grp_aptinsp_list tr",function(){
			config.grpifm.scroll = $(".grp_aptinsp_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_aptinsp_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			//위치,길안내
	var lAddr = "";
			if(config.grpifm.list[config.grpifm.select_no].lAddr){
				lAddr = ",BULD_MNNM:'"+config.grpifm.list[config.grpifm.select_no].lAddr+"'";
			}
			var sAddr = "";
			if(config.grpifm.list[config.grpifm.select_no].sAddr){
				sAddr = ",BULD_SLNO:'"+config.grpifm.list[config.grpifm.select_no].sAddr+"'";
			}

			config.table.p1="건물";
			config.table.p2="filter=ROAD_NM:'"+config.grpifm.list[config.grpifm.select_no].roadAddr+"'"+lAddr+sAddr;

			//첨부파일 
			config.table.attach1=$(this).find("td:eq(0)").attr("data-idtype")
			config.table.attach2=$(this).find("td:eq(0)").attr("data-id")
			config.table.attach3=$(this).find("td:eq(1)").html();		//facilNo

			//상세
			config.detail_file.index = $(this).find("td:eq(1)").html() ; //td0.attr("data-id");

			//검사이력/등록
			config.table.param1 = $(this).find("td:eq(1)").html();
			config.table.param2 = config.grpifm.list[config.grpifm.select_no].idInsp;
			config.table.param3 = config.grpifm.list[config.grpifm.select_no].idInspType;

			

		});

	}

	//시설물로 이동
	fetchSisul = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			//alert(config.table.cdFclt);
			config.detail_file.param="cdFcltBld";
		
			this.props.history.push('/retrieveCommunalDetail/'+config.grpifm.list[config.grpifm.select_no].cdFclt);

		}
	}
	fetchDetail = () => {
		if(config.grpifm.select_no < 0){
			alert("항목을 선택해주세요");
		}else{
			var cdFclt = config.grpifm.list[config.grpifm.select_no].cdFclt;
			var idInsp = config.grpifm.list[config.grpifm.select_no].idInsp;
			var idInspType = config.grpifm.list[config.grpifm.select_no].idInspType;

			if($(".grp_aptinsp_list  tr:eq("+config.grpifm.select_no+")").find("td:eq(0)").html() === '공동주택자율검사'){
				this.props.history.push('/retrieveAptInspDetailFree/'+cdFclt+'/'+idInsp+'/'+idInspType);
			}else{
				this.props.history.push('/retrieveAptInspDetail/'+cdFclt+'/'+idInsp+'/'+idInspType);
			}
		}


	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrieveAptInsp" className="active"><span>공동주택</span></Link>
						<Link to="/retrieveSpecificInsp2"><span>특정사용시설</span></Link>
						<Link to="/retrieveRegulatorInsp2"><span>압력조정기</span></Link>
						<Link to="/retrieveUseInspRslt"><span>검사이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사구분</label>
											<select id="inspGubun">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>검사계획년월</label>
											<DatePicker
												 locale="ko" 
												id="dtInspPlnFr"
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
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="dtInspPlnTo"
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
										<div className="form3">
											<label>시설명</label>
											<input type="text" id="nmFclt" />
										</div>
										<div className="form6">
											<label>시설명</label>
											<input type="text" id="txAddr" />
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
											<col width="100"/>
											<col width="80"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="120"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>검사구분</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>완성검사일</th>
												<th>동수</th>
												<th>총세대수</th>
												<th>사용자공급관(m)</th>
												<th>체적</th>
												<th>검사세부항목</th>
												<th>검사계획월</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_aptinsp_list">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="80"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="120"/>
											<col width="70"/>
											<col width="80"/>
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

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />검사등록</button>
						<button type="button" className="btn_detail" onClick={this.fetchSisul}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveAptInsp;