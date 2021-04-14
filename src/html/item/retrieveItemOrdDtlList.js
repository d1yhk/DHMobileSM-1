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


class retrieveItemOrdDtlList extends Component {
	constructor(props) {
		super(props);
		this.addType = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOrdDtlList'){
			config.back.url.push('/retrieveItemOrdDtlList');
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
		var dtOrdFr = config.formatDate(date1,"");
		var dtOrdTo = config.formatDate(date2,"");
		

		const nord_list = await Promise.all([ 
			service.retrieveItemOrdNmOrdList(dtOrdFr,dtOrdTo)
		]);
		$("#noOrd").html('<option value="">선택</option>');
		var nord = nord_list[0].data.result;
		for(var count = 0; count < nord.length; count++){
			$("#noOrd").append('<option value="'+nord[count].noOrd+'">'+nord[count].nmOrd+'</option>');
		}
	}

	//검색 결과 리스트
	fetchSearch = async () => {
		var noOrd = $("#noOrd").val();
		if(noOrd === ""){
			alert("발중요청정보를 선택해주세요");
			return;
		}
		var dtOrdFr = $("#dtOrdFr").val();
		var dtOrdTo = $("#dtOrdTo").val();

		

		$(".ord_dt_list tbody").html("");
		try {
			const common = await Promise.all([ 
				service.retrieveItemOrdDtlList(dtOrdFr,dtOrdTo,noOrd)
			]);
			var result = common[0].data.result;
			this.item_list = result;
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td class="checkbox2 _td2"><label><input type="checkbox"><strong></strong></label></td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOrd']) ? result[count]['qtyOrd'] : '')+'</td>'
				td = td + '<td>'+((result[count]['plcDelv']) ? result[count]['plcDelv'] : '')+'</td>'
				td = td + '<td>'+((result[count]['lnPartner']) ? result[count]['lnPartner'] : '')+'</td>'

				$(".ord_dt_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".ord_dt_list tbody").html('<tr><td colspan="7">검색 결과가 없습니다.</td></tr>');
			}
			config.setWindowHeight();
		} catch(err){
				$(".message").html("&nbsp;");
				$(".ord_dt_list tbody").html('<tr><td colspan="7">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	allCheck = () => {
		if($(".check_all").prop("checked") === true){
			$(".ord_dt_list tbody tr input").prop("checked",true);
		}else{

			$(".ord_dt_list tbody tr input").prop("checked",false);
		}
	}

	componentDidMount() {
		$(".check_all").prop("checked",false);
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		//this.fetchSearch();
		this.itemOrdNmOrdList(this.state.startDate,this.state.endDate);

	}
	
	
	//선택완료

	btnSelect = async () => { 
		config.item_select.length = 0;
		for(var count = 0; count < this.item_list.length; count++ ){
			if( $(".ord_dt_list tr:eq("+count+")").find("input").prop("checked") === true ) {
				config.item_select.push(this.item_list[count]);
			}
		}
		//console.log(config.item_select);
		config.btnBack(this.props)
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>입고 품목 추가</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>발주일자</label>
											<DatePicker
												locale="ko" 
												id="dtOrdFr"
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
												id="dtOrdTo"
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
											<label>발주요청정보</label>
											<select id="noOrd">
												<option value="">선택</option>
											</select>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch()}>검색</button>
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
											<col width="200"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="auto"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th className="checkbox2"><label><input type="checkbox" onClick={this.allCheck} className="check_all"/><strong></strong></label></th>
												<th>공사명</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>발주수량</th>
												<th>납품장소</th>
												<th>거래처</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="ord_dt_list mw1000">
									<table>
										<colgroup>
											<col width="50"/>
											<col width="200"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="auto"/>
											<col width="100"/>
										</colgroup>
										<tbody>
											<tr><td colspan="8">검색을 해주세요.</td></tr>
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

export default retrieveItemOrdDtlList;