
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

class retrieveGMInsp extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		this.state = {
			startDate: null,//new Date(),
			endDate: null//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveGMInsp'){
			config.back.url.push('/retrieveGMInsp');
		}
		if(config.table_name.file !== "retrieveGMInsp"){
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
		//console.log(result);
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td data-id="'+result[count]['cdFclt']+'">'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['qtyPress']) ? result[count]['qtyPress'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSply']) ? result[count]['dtSply'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdMakerNm']) ? result[count]['cdMakerNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['grdGmNm']) ? result[count]['grdGmNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSet']) ? result[count]['dtSet'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtChg']) ? result[count]['dtChg'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdMakerVcNm']) ? result[count]['cdMakerVcNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSetVc']) ? result[count]['dtSetVc'] : '')+'</td>';
				td = td + '<input type="hidden" id="" value="'+((result[count]['idInsp']) ? result[count]['idInsp'] : '')+'" />';
				td = td + '<input type="hidden" id="" value="'+((result[count]['idInspType']) ? result[count]['idInspType'] : '')+'" />';
				td = td + '<input type="hidden" id="" value="'+((result[count]['roadAddr']) ? result[count]['roadAddr'] : '')+'" />';
				td = td + '<input type="hidden" id="" value="'+((result[count]['lAddr']) ? result[count]['lAddr'] : '')+'" />';
				td = td + '<input type="hidden" id="" value="'+((result[count]['sAddr']) ? result[count]['sAddr'] : '')+'" />';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_gminsp_list tbody").html(td);
		}else{
			$(".grp_gminsp_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_gminsp_list tbody").html('<tr><td colspan="11">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtInspPlnFr = config.form_search(search_type,'dtInspPlnFr');
		var dtInspPlnTo = config.form_search(search_type,'dtInspPlnTo');
		var nmFclt = config.form_search(search_type,'nmFclt');
		var txAddr = config.form_search(search_type,'txAddr');
		var cdFclt = config.form_search(search_type,'cdFclt');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;

			this.page.total=0;
			$(".grp_gminsp_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([
				//검색 api
				service.retrieveGMInspList(dtInspPlnFr, dtInspPlnTo, nmFclt, txAddr, cdFclt, (this.page.page * 100), 100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_gminsp_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_gminsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_gminsp_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//상세정보
	gmDetail = () => {
		this.props.history.push('/retrieveGMInspInfo/'+config.grpifm.list[config.grpifm.select_no].idInsp+'/'+config.grpifm.list[config.grpifm.select_no].idInspType);
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

        //헤더 타이틀
		config.header.title = "계량기";
		$(".header_title").html( "계량기");
		
		config.table_name.file = 'retrieveGMInsp';


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

			$(".grp_gminsp_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_gminsp_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_gminsp_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}
		var t = this;


	
		$(".grp_gminsp_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_gminsp_list").scrollTop() >= ($(".grp_gminsp_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
        //테이블 리스트 선택
    
		$(document).off("click",".grp_gminsp_list tr");    
		$(document).on("click",".grp_gminsp_list tr",function(){

			config.grpifm.scroll = $(".grp_gminsp_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_gminsp_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
		
			var lAddr = (config.grpifm.list[config.grpifm.select_no].lAddr) ? config.grpifm.list[config.grpifm.select_no].lAddr : '';
			var sAddr = (config.grpifm.list[config.grpifm.select_no].sAddr) ? config.grpifm.list[config.grpifm.select_no].sAddr : '';
			config.table.p1="건물";
			config.table.p2="filter=ROAD_NM:'"+config.grpifm.list[config.grpifm.select_no].roadAddr+"',BULD_MNNM:'"+lAddr+"',BULD_SLNO:'"+sAddr+"'";

      config.detail_file.index = config.grpifm.list[config.grpifm.select_no].idInsp;
            
			config.table.attach1="중대용량";
			config.table.attach2=config.grpifm.list[config.grpifm.select_no].idInspType;
			config.table.attach3=config.grpifm.list[config.grpifm.select_no].idInsp;
			config.table.attach4=config.grpifm.list[config.grpifm.select_no].cdFclt;

		});

	}
	btnSisul = () =>{
		this.props.history.push("/retrieveGMDetail2/"+config.grpifm.list[config.grpifm.select_no].cdFclt)
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab2">
                        {/*링크 추후 확인 필요 */}
						<Link to="/retrieveGM"><span>개량기 정보</span></Link>
						<Link to="/retrieveGMInsp" className="active"><span>중/대용량 계량기 점검</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form5">
											<label>검사계획</label>
                                            <DatePicker
                                                locale="ko" 
                                                id="dtInspPlnFr"
                                                className="datepicker dtlawfr"
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
										<div className="form5">
											<label>~</label>
                                            <DatePicker
                                                locale="ko" 
                                                id="dtInspPlnTo"
                                                className="datepicker dtlawfr"
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
										<div className="form5">
											<label>시설명</label>
											<input type="text" id="nmFclt" />
										</div>
                                        <div className="form5">
											<label>주소</label>
											<input type="text" id="txAddr" />
										</div>
                                        <div className="form5">
											<label>수용가번호</label>
											<input type="text" id="cdFclt" />
                                            <button type="button" value="찾기" />
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
											<col width="200"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="90"/>
											<col width="80"/>
											<col width="90"/>
										</colgroup>
										<thead>
											<tr>
												<th>수용가번호</th>
												<th>수용가명</th>
												<th>주소</th>
												<th>압력</th>
												<th>최초공급일</th>
												<th>GM제조사</th>
												<th>GM등급</th>
												<th>GM설치일자</th>
												<th>GM차기교체일자</th>
												<th>보정기 제조사</th>
												<th>보정기 설치일자</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_gminsp_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="200"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="90"/>
											<col width="80"/>
											<col width="90"/>
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
                        {/* 첨부파일 확인 필요 */}
						<button type="button" className="btn_file" onClick={() => this.gmDetail()}><img alt="" src={icon2} width="15" height="15" />검사등록</button>
						<button type="button" className="btn_detail" onClick={this.btnSisul} ><img alt="" src={icon1} width="15" height="15" />시설물정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveGMInsp;