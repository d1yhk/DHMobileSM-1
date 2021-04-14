/* ppt166 자재입고 입고품목 */

import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import btn_select from '../../image/btn_select.png';



import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveItemOutreqDtlList extends Component {
	constructor(props) {
		super(props);
		this.addType = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOutreqDtlList/'+this.props.match.params.noOut){
			config.back.url.push('/retrieveItemOutreqDtlList/'+this.props.match.params.noOut);
		}
		config.item_select.lenght=0;
		this.item_list = [];

		this.state = {
				startDate: new Date(),
				endDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
	}

	startDateChange(date) {
		this.setState({
			startDate: date
		});
		this.itemOrdNmOrdList(date,this.state.endDate);
	}

	endDateChange(date) {
		this.setState({
			endDate: date
		});
		this.itemOrdNmOrdList(this.state.startDate,date);
	}

	itemOrdNmOrdList = async (date1,date2) => { 
		var dtOutreqFr = config.formatDate(date1,"");
		var dtOutreqTo = config.formatDate(date2,"");

		const nord_list = await Promise.all([ 
			service.retrieveItemOutreqNmList(dtOutreqFr,dtOutreqTo)
		]);
		$("#noOutreq").html('<option value="">선택</option>');
		var nord = nord_list[0].data.result;

		if(nord.length >= 0 ){
			for(var count = 0; count < nord.length; count++){
				$("#noOutreq").append('<option value="'+nord[count].noOutreq+'">'+nord[count].nmConst+'</option>');
			}
		}
	}


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		/*
		var dtOutreqFr = config.form_search(search_type,'dtOutreqFr');
		var dtOutreqTo = config.form_search(search_type,'dtOutreqTo');
		var noOutreq = config.form_search(search_type,'noOutreq');
		*/
		
		var dtOutreqFr =  $("#dtOutreqFr").val();
		var dtOutreqTo =  $("#dtOutreqTo").val();
		var noOutreq =  $("#noOutreq").val();


		if(noOutreq === ""){
			alert("발중요청정보를 선택해주세요");
			return;
		}
		$(".out_dt_list tbody").html("");
		try {
			const common = await Promise.all([ 
				service.retrieveItemOutreqDtlList(dtOutreqFr,dtOutreqTo,noOutreq,this.props.match.params.noOut)
			]);
			var result = common[0].data.result;
			this.item_list = result;
			
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td class="checkbox2 _td2"><label><input type="checkbox"><strong></strong></label></td>'
				td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmDept']) ? result[count]['nmDept'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noOutreq']) ? result[count]['noOutreq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOutreq']) ? result[count]['qtyOutreq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyRem']) ? result[count]['qtyRem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['idInsert']) ? result[count]['idInsert'] : '')+'</td>'
				$(".out_dt_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".out_dt_list tbody").html('<tr><td colspan="12">검색 결과가 없습니다.</td></tr>');
			}
			config.setWindowHeight();
		} catch(err){
				$(".message").html("&nbsp;");
				$(".out_dt_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	allCheck = () => {
		if($(".check_all").prop("checked") === true){
			$(".out_dt_list tbody tr input").prop("checked",true);
		}else{
			$(".out_dt_list tbody tr input").prop("checked",false);
		}
	}
	componentDidMount() {
		$(".check_all").prop("checked",false);
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		//this.fetchSearch(1);
		this.itemOrdNmOrdList(this.state.startDate,this.state.endDate);

	}

	//선택완료

	btnSelect = async () => { 
		config.item_select.length = 0;
		for(var count = 0; count < this.item_list.length; count++ ){
			if( $(".out_dt_list tr:eq("+count+")").find("input").prop("checked") === true ) {
				config.item_select.push(this.item_list[count]);
			}
		}

		
		
		config.btnBack(this.props)
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>출고 품목</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>요청일자</label>
											<DatePicker
												locale="ko" 
												id="dtOutreqFr"
												className="datepicker"
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
												id="dtOutreqTo"
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
										<div className="form2">
											<label>출고요청정보</label>
											<select id="noOutreq">
												<option value="">선택</option>
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
											<col width="50"/>
											<col width="70"/>
											<col width="120"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th className="checkbox2"><label><input type="checkbox" onClick={this.allCheck} className="check_all"/><strong></strong></label></th>
												<th>출고일자</th>
												<th>출고부서</th>
												<th>출고요청번호</th>
												<th>공사</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>출고요청수량</th>
												<th>재고수량</th>
												<th>출고수량</th>
												<th>등록자</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="out_dt_list mw1000">
									<table>
										<colgroup>
											<col width="50"/>
											<col width="70"/>
											<col width="120"/>
											<col width="120"/>
											<col width="auto"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
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
						<button type="button" onClick={this.btnSelect}><img alt="" src={btn_select} width="15" height="15" />선택완료</button>
							

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemOutreqDtlList;