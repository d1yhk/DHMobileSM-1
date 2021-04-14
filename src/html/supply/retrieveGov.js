
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
import icon10 from '../../image/icon10.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveGov extends Component {
	constructor(props) {
		super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveGov'){
			config.back.url.push('/retrieveGov');
		}
		if(config.table_name.file !== "retrieveGov"){
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

		this.back = 0;
		this.state = {
				startDate: null,//new Date(),
				endDate: null//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.page = {change : 0,num: 0, type:0,count:0, page:0,total:0};
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
			td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['facilNo']) ? result[count]['facilNo'] : '')+'</td>';
			td = td + '<td>'+((result[count]['govNm']) ? result[count]['govNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['dtLaw']) ? result[count]['dtLaw'] : '')+'</td>';
			td = td + '<td>'+((result[count]['addr']) ? result[count]['addr'] : '')+'</td>';
			td = td + '<td>'+((result[count]['cntSply']) ? result[count]['cntSply'] : '')+'</td>';
			td = td + '<td>'+((result[count]['kindMdNm']) ? result[count]['kindMdNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['kindDiaNm']) ? result[count]['kindDiaNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['typeRtuNm']) ? result[count]['typeRtuNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['scadaNo']) ? result[count]['scadaNo'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_gov_list2 tbody").html(td);
		}else{
			$(".grp_gov_list2 tbody").append(td);
		}
		if( result.length <= 0 ){
			$(".grp_gov_list2 tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		
		var govnm = config.form_search(search_type,"govnm");
		var typertu = config.form_search(search_type,"typertu");
		var addr = config.form_search(search_type,"addr");
		var kindmd = config.form_search(search_type,"kindmd");
		var dtlawfr = config.form_search(search_type,"dtlawfr");
		var dtlawto = config.form_search(search_type,"dtlawto");//selected={this.state.endDate}

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_gov_list2 tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveGovList(govnm,typertu,addr,kindmd,dtlawfr,dtlawto,(this.page.page * 100),100)
			]);
			
			var result = common[0].data.result;
			this.page.total = (result.length + ((this.page.page) * 100));
			this.lists(result,0,search_type);
			if(this.page.type === 0){
				this.page.num = $(".grp_gov_list2 tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_gov_list2 tbody").html('<tr><td colspan="9">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");

		config.table_name.file = 'retrieveGov';

		config.table.param1="정압기";

		config.inspection.type="정압기";

		config.fetchCommon("ERP","CG_F_00054","typertu");	//RTU모델
		config.fetchCommon("정압기","정압기기종","kindmd");		//정압기모델

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

			$(".grp_gov_list2 tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_gov_list2").scrollTop( config.table_height.height );
			},500);
			this.page.num = $(".grp_gov_list2 tbody").height() / 2;
			this.page.type=1;
			
			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_gov_list2").scroll(function(){
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_gov_list2").scrollTop() >= ($(".grp_gov_list2 tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_gov_list2 tr");
		$(document).on("click",".grp_gov_list2 tr",function(){
			$(".grp_gov_list2 tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			config.grpifm.select_no = $(this).index();
			
			config.table.p1="정압기";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");
			config.table.gil = $(this).find("td:eq(3)").html();

			config.table.attach1="정압기";
			config.table.attach2=$(this).find("td:eq(0)").html();		//facilNo
			config.table.attach3="";

			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
			config.table.param3 = config.grpifm.list[config.grpifm.select_no].facilNo;
		});
	}

//점검이력
retrieveGovInspRslt = () => {
	if(config.grpifm.select_no <  0){
		alert("항목을 선택해주세요");
	}else{
		//config.his.back = "retrieveSpecial";
		this.props.history.push("/retrieveGovInspRslt/"+config.grpifm.list[config.grpifm.select_no].facilNo);
	}
}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrievePipe"><span>배관</span></Link>
						<Link to="/retrieveValve"><span>밸브</span></Link>
						<Link to="/retrieveGov" className="active"><span>정압기</span></Link>
						<Link to="/retrieveSpecial"><span>중점관리대상</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<legend>검색</legend>
									<div className="form-contoll">
										<div className="form4">
											<label>시설명</label>
											<input type="text" id="govnm" />
										</div>
										<div className="form4">
											<label>RTU모델</label>
											<select id="typertu">
												<option value="">전체</option>
											</select>

										</div>
										<div className="form2">
											<label>주소</label>
											<input type="text" id="addr"/>
										</div>

										<div className="form4">
											<label>정압기모델</label>
											<select id="kindmd">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>시공감리일</label>
											<DatePicker
												 locale="ko" 
												id="dtlawfr"
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
										<div className="form4">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="dtlawto"
												className="datepicker"
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

									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="120"/>
											<col width="80"/>
											<col width="*"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="120"/>
										</colgroup>
										<thead>
											<tr>
												<th>관리번호</th>
												<th>시설명</th>
												<th>시공감리일</th>
												<th>주소</th>
												<th>공급세대수</th>
												<th>조정기 모델</th>
												<th>규격</th>
												<th>RTU모델</th>
												<th>SCADA 관리번호</th>
											</tr>
										</thead>

									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_gov_list2">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="120"/>
											<col width="80"/>
											<col width="*"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
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
						<button type="button"  className="btn_record" onClick={() => this.retrieveGovInspRslt()}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGov','정압기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveGovDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGov;

