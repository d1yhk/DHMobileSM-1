import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class PopupConst extends Component {
	
	constructor(props) {
		super(props);
		this.page_build = {change : 0,num: 0, type:0,count:0, page:0 };
		this.select_user=0;
		this.constr = [];

		this.state = {
				popupDate1: "",
				popupDate2: ""
		};
		this.popupDateChange1 = this.popupDateChange1.bind(this);
		this.popupDateChange2 = this.popupDateChange2.bind(this);
	}
	popupDateChange1(date) {
		this.setState({
			popupDate1: date
		});
	}
	popupDateChange2(date) {
		this.setState({
			popupDate2: date
		});
	}
	ConstSearch = async (search_type) => {
		var idConst = $("#poup_idConst").val();
		var nmConst = $("#poup_nmConst").val();
		var cdComNm = $("#poup_cdCom").val();
		var dtDigFr = $("#poup_dtDigFr").val();
		var dtDigTo = $("#poup_dtDigTo").val();

		if(search_type===1){
			$(".message_popup").html("검색중입니다.");
			this.page_build.page = 0;
			this.page_build.num = 0;
			this.page_build.count = 0;
			this.page_build.change = 0;
			this.page_build.type=0;
			$(".popup_constlist tbody").html("");
		}
		const user_list = await Promise.all([ 
			service.retrieveConstInfoList(idConst ,nmConst ,cdComNm,dtDigFr,dtDigTo,(this.page_build.page * 100),100)
		]);
		
		var result = user_list[0].data.result;
		$(".message_popup").html("총 "+(result.length * (1+this.page_build.page)) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			this.constr.push(result[count]);
			var td = '<tr>';
			td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
			td = td + '<td>'+((result[count]['cdComNm']) ? result[count]['cdComNm'] : '')+'</td>'
			td = td + '<td>'+((result[count]['dtDigFr']) ? result[count]['dtDigFr'] : '')+'</td>'
			td = td + '<td>'+((result[count]['dtDigTo']) ? result[count]['dtDigTo'] : '')+'</td>'
			td = td + '</tr>';
			$(".popup_constlist tbody").append(td);
		}
		this.page_build.count = result.length;
		this.page_build.change = 0;
		if( result.length <= 0 ){
			$(".popup_constlist tbody").html('<tr><td colspan="5">검색 결과가 없습니다.</td></tr>');
		}

	}

	SelectConst = () => {
		var sel = $(".popup_constlist tr:eq("+this.select_user+")");
		
		if($(".const-form").attr("class").indexOf("type0") >= 0 ){
			$(".idConst").val(sel.find("td:eq(0)").html());
			$(".nmConst").val(sel.find("td:eq(1)").html());
		}else if($(".const-form").attr("class").indexOf("type1") >= 0 ){
			$(".item_idConst").val(sel.find("td:eq(0)").html());
			$(".item_nmConst").val(sel.find("td:eq(1)").html());
		}else if($(".const-form").attr("class").indexOf("type2") >= 0 ){
			$(".idConst").val(sel.find("td:eq(0)").html());
			$(".nmConst").val(sel.find("td:eq(1)").html());
		}


		$(".const-form").css("display","none");
	}
	
	formOption = async () => {
		const retrieveConstComList = await Promise.all([ 
			service.retrieveConstComList()
		]);
		for(var count = 0; count < retrieveConstComList[0].data.result.length; count++){
			$("#poup_cdCom").append(("<option value=\""+retrieveConstComList[0].data.result[count].lcode+"\">"+retrieveConstComList[0].data.result[count].lvalue+"</option>"));
		}

	}
	closeConst = () => {
		$(".const-form").css("display","none");
	}
	componentDidMount() {
		this.formOption();
		this.ConstSearch(1);
		var first = 0;
		var t = this;
		$(".popup_constlist").scroll(function(){
			if(first === 0 ){
				t.page_build.num = $(".popup_constlist table").height() / 2;
			}
			first = 1;
			if(t.page_build.count >= 100){

				if($(".popup_constlist").scrollTop() >= ($(".popup_constlist tbody").height() - t.page_build.num)){
					if(t.page_build.change === 0){
						t.page_build.change = 1;
						t.page_build.page++;
						t.ConstSearch(0);
					}
				}
			}
		});

		$(document).off("click",".popup_constlist tr");
		$(document).on("click",".popup_constlist tr",function(){
			$(".popup_constlist tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.select_user = $(this).index();
		});

	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup const-form">
				<div className="popup-box table">
					<h2>공사정보 조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box search2">
						<form>
							<fieldset>
								<div className="form-contoll">
									<div className="form3">
										<label>공사ID</label>
										<input type="text" id="poup_idConst" />
									</div>
									<div className="form6">
										<label>공사명</label>
										<input type="text" id="poup_nmConst"  />
									</div>
									<div className="form3">
										<label>시공업체</label>
										<select id="poup_cdCom">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form3">
										<label>공사일자</label>
										<DatePicker
											locale="ko" 
											id="poup_dtDigFr"
											className="datepicker poup_dtDigFr"
											selected={this.state.popupDate1}
											onChange={this.popupDateChange1}
											dateFormat="yyyyMMdd"
											showYearDropdown
											showMonthDropdown
											dropdownMode="select"
											popperModifiers={{preventOverflow: { enabled: true, }, }}
										/>
									</div>
									<div className="form3">
										<label>~</label>
										<DatePicker
											locale="ko" 
											id="poup_dtDigTo"
											className="datepicker poup_dtDigTo"
											selected={this.state.popupDate2}
											onChange={this.popupDateChange2}
											dateFormat="yyyyMMdd"
											showYearDropdown
											showMonthDropdown
											dropdownMode="select"
											popperModifiers={{preventOverflow: { enabled: true, }, }}
										/>
									</div>
								</div>
								<button type="button" className="btn-search" onClick={() => this.ConstSearch(1)}  >검색</button>
							</fieldset>
						</form>
					</div>
					<p className="message_popup">검색을 해주세요.</p>
					<div id="popupHeader2" >
						<table>
							<colgroup>
								<col width="100"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<thead>
								<tr>
									<th>공사ID</th>
									<th>공사명</th>
									<th>시공업체</th>
									<th>공사시작일</th>
									<th>공사종료일</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents2" className="popup_constlist">
						<table>
							<colgroup>
								<col width="100"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<tbody>
							</tbody>
						</table>
					</div>
					<div className="popup_btn _02">
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
						<button type="button" onClick={this.SelectConst} className="btn_mail"><img src={btn_select} width="19" height="16" alt=""/>선택</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupConst;