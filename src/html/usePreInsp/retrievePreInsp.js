
import React, { Component } from 'react';

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

class retrievePreInsp extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		this.state = {
				startDate: null,//new Date(),
				endDate: null,//new Date()
				status: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
        
		if(config.back.url[config.back.url.length-1] !== '/retrievePreInsp'){
			config.back.url.push('/retrievePreInsp');
		}
		if(config.table_name.file !== "retrievePreInsp"){
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
				td = td + '<td>'+((result[count]['nmGbCntr']) ? result[count]['nmGbCntr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmGbFclt']) ? result[count]['nmGbFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFcltBld']) ? result[count]['cdFcltBld'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmFcltBld']) ? result[count]['nmFcltBld'] : '')+'</td>';
				td = td + '<td>'+((result[count]['addrSply']) ? result[count]['addrSply'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmCom']) ? result[count]['nmCom'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmMng']) ? result[count]['nmMng'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['tmInsp']) ? result[count]['tmInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmEmpInsp']) ? result[count]['nmEmpInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmStPreinsp']) ? result[count]['nmStPreinsp'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_preinsp_list tbody").html(td);
		}else{
			$(".grp_preinsp_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_preinsp_list tbody").html('<tr><td colspan="11">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtInspFr = config.form_search(search_type,'dtInspFr');
		var dtInspTo = config.form_search(search_type,'dtInspTo');
		var gbFclt = config.form_search(search_type,'gbFclt');
		var stPreInsp = config.form_search(search_type,'stPreInsp');
		var addrSply = config.form_search(search_type,'addrSply');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_preinsp_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([
                //검색 api
                service.retrievePreInspList(dtInspFr, dtInspTo, gbFclt, stPreInsp, addrSply, (this.page.page * 100), 100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_preinsp_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_preinsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_preinsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	//수용가 정보 조회
	fetchDetail2 = () => { 
		if(config.grpifm.select_no >= 0 ){
			if(config.grpifm.list[config.grpifm.select_no].cdBld > 0 ){
				this.props.history.push('/retrievePreInspDetail2/'+config.grpifm.list[config.grpifm.select_no].idPreinsp+"/"+config.grpifm.list[config.grpifm.select_no].cdBld);
			}else{
				alert("건물번호가 없습니다.");
			}
		}else{
			alert("항목을 선택하세요");
		}
	}

	//상세정보
	fetchRegist = () => { 
		if(config.grpifm.select_no >= 0 ){
			this.props.history.push('/retrievePreInspRsltInfo/'+config.grpifm.list[config.grpifm.select_no].idPreinsp+"/"+config.grpifm.list[config.grpifm.select_no].idCntr);
		}else{
			alert("항목을 선택하세요");
		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

        //헤더 타이틀
		config.header.title = "공급전검사";
		$(".header_title").html( "공급전검사");
		
		config.table_name.file = 'retrievePreInsp';

		config.fetchCommon("ERP", "CG_U_00005", "gbFclt");
		config.fetchCommon("ERP", "CG_U_00045", "stPreInsp");
        
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

			$(".grp_preinsp_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_preinsp_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_preinsp_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_preinsp_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_preinsp_list").scrollTop() >= ($(".grp_preinsp_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
        //테이블 리스트 선택
        
		$(document).off("click",".grp_preinsp_list tr");
		$(document).on("click",".grp_preinsp_list tr",function(){
			config.grpifm.scroll = $(".grp_preinsp_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_preinsp_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			var idPreinsp = config.grpifm.list[config.grpifm.select_no].idPreinsp;

      config.detail_file.index = idPreinsp;

			var lAddr = (config.grpifm.list[config.grpifm.select_no].lAddr) ? config.grpifm.list[config.grpifm.select_no].lAddr : '';
			var sAddr = (config.grpifm.list[config.grpifm.select_no].sAddr) ? config.grpifm.list[config.grpifm.select_no].sAddr : '';
			config.table.p1="건물";
			config.table.p2="filter=ROAD_NM:'"+config.grpifm.list[config.grpifm.select_no].roadAddr+"',BULD_MNNM:'"+lAddr+"',BULD_SLNO:'"+sAddr+"'";
            
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
							<h2>공급전검사 결과등록</h2>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사일자</label>
                                            <DatePicker
                                                locale="ko" 
                                                id="dtInspFr"
                                                className="datepicker dtlawfr"
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
										<div className="form3">
											<label>~</label>
                                            <DatePicker
                                                locale="ko" 
                                                id="dtInspTo"
                                                className="datepicker dtlawfr"
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
										<div className="form3">
											<label>시설구분</label>
											<select id="gbFclt" name="gbFclt">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>상태</label>
											<select id="stPreInsp" name="stPreInsp">
												<option value="">전체</option>
											</select>
										</div>
                                        <div className="form6">
											<label>주소</label>
											<input type="text" id="addrSply" />
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
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>공급유형</th>
												<th>시설구분</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>주소</th>
												<th>시공사</th>
												<th>시공관리자</th>
												<th>검사일자</th>
												<th>검사시간</th>
												<th>검사원</th>
												<th>상태</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_preinsp_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
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
						<button type="button" className="btn_file" onClick={() => this.fetchDetail2()}><img alt="" src={icon1} width="15" height="15" />수용가 정보</button>
						<button type="button" className="btn_file" onClick={() => this.fetchRegist()}><img alt="" src={icon2} width="15" height="15" />검사결과</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrievePreInspDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrievePreInsp;