/*ppt160 영업관리*/ 
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';




import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveContract extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveContract'){
			config.back.url.push('/retrieveContract');
		}
		if(config.table_name.file !== "retrieveContract"){
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
					td = td + '<td>'+((result[count]['idCntr']) ? result[count]['idCntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtCntr']) ? result[count]['dtCntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmPrd']) ? result[count]['nmPrd'] : '')+'</td>'
					td = td + '<td>'+((result[count]['addrSply']) ? result[count]['addrSply'] : '')+'</td>'
					td = td + '<td>'+((result[count]['cntAppcust']) ? result[count]['cntAppcust'] : '')+'</td>'
					td = td + '<td>'+((result[count]['gbCntr']) ? result[count]['gbCntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtFaci']) ? result[count]['amtFaci'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtInco']) ? result[count]['amtInco'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtCons']) ? result[count]['amtCons'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtTot']) ? result[count]['amtTot'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtIncome']) ? result[count]['amtIncome'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtIncome']) ? result[count]['dtIncome'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmIncome']) ? result[count]['nmIncome'] : '')+'</td>'
					td = td + '<td>'+((result[count]['coConst']) ? result[count]['coConst'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmPartnerIn']) ? result[count]['nmPartnerIn'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_contract_list tbody").html(td);
		}else{
			$(".grp_contract_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_contract_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var nmPrd = config.form_search(search_type,'nmPrd');
		var addrSply = config.form_search(search_type,'addrSply');
		var dtCntrFr = config.form_search(search_type,'dtCntrFr');
		var dtCntrTo = config.form_search(search_type,'dtCntrTo');
		var gbCntr = config.form_search(search_type,'gbCntr');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;

			this.page.total=0;
			$(".grp_contract_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveContractList(nmPrd,addrSply,dtCntrFr,dtCntrTo,gbCntr,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_contract_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_contract_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_contract_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//상세정보
	fetchDetail = async () => { 
		this.props.history.push('/retrieveValveDetail/'+config.detail_file.index);
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "영업관리";
		$(".header_title").html( "영업관리");
		
		config.table_name.file = 'retrieveContract';

		config.fetchStrCode("ERP","CG_S_00005","gbCntr");			//계약유형

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

			$(".grp_contract_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_contract_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_contract_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_contract_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_contract_list").scrollTop() >= ($(".grp_contract_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_contract_list tr");
		$(document).on("click",".grp_contract_list tr",function(){
			config.grpifm.scroll = $(".grp_contract_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_contract_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			
			var id = config.grpifm.list[config.grpifm.select_no].idCntr;
			config.table.attach1="공급계약";
			config.table.attach2=id;
			config.detail_file.index = id;
		});

	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>공급계약</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>계약자</label>
											<input type="text" id="nmPrd" />
										</div>
										<div className="form6">
											<label>주소</label>
											<input type="text" id="addrSply" />
										</div>
										<div className="form3">
											<label>계약일자</label>
											<DatePicker
												 locale="ko" 
												id="dtCntrFr"
												className="datepicker dtCntrFr"
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
												id="dtCntrTo"
												className="datepicker dtCntrTo"
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
											<label>계약유형</label>
											<select id="gbCntr">
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
											<col width="70"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>계약번호</th>
												<th>계약일자</th>
												<th>계약자</th>
												<th>주소(사용처)</th>
												<th>계약세대수</th>
												<th>계약유형</th>
												<th>시설분담금<br/>(투자/수입정보)</th>
												<th>인입부담금<br/>(투자/수입정보)</th>
												<th>공사부담금<br/>(투자/수입정보)</th>
												<th>계</th>
												<th>납부금액</th>
												<th>납부일자</th>
												<th>납부자명</th>
												<th>면제대상</th>
												<th>내관업체</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_contract_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="70"/>
											<col width="100"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveContract','공급계약')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveContractDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveContract;