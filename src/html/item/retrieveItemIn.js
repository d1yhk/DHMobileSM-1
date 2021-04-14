/*ppt163 자재입고*/ 
import React, { Component } from 'react';
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import PopupUser from '../../components/PopupUser';
import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import btn_close from '../../image/btn-close.png';
import btn_send from '../../image/btn_send.png';
import footer_send from '../../image/footer_send.png';
import footer_search from '../../image/footer_search.png';
import close from '../../image/close.png';
import footer_regist from '../../image/footer_regist.png';
import btn_remove from '../../image/btn-remove.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveItemIn extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		this.addType = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemIn'){
			config.back.url.push('/retrieveItemIn');
		}
		if(config.table_name.file !== "retrieveItemIn"){
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
		config.item_select.length=0;

		this.state = {
				startDate: null,
				endDate: null,
				popupDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.popupDateChange = this.popupDateChange.bind(this);

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
	popupDateChange(date) {
		this.setState({
			popupDate: date
		});
	}

	lists = (result,stype) => { 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			var td = '<tr>';
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtIn']) ? result[count]['dtIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmEmpChk']) ? result[count]['nmEmpChk'] : '')+'</td>'
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>'
			td = td + '</tr>';
			$(".in_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".in_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtInFr = config.form_search(search_type,'dtInFr');
		var dtInTo = config.form_search(search_type,'dtInTo');
		var noIn = config.form_search(search_type,'noIn');
		var nmEmpChk = config.form_search(search_type,'nmEmpChk');
		var nmEmp = config.form_search(search_type,'nmEmp');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".in_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no=-1;
			config.detail_file.index = "";

		}

		try {
			const common = await Promise.all([ 
				service.retrieveItemInList(dtInFr,dtInTo,noIn,nmEmpChk,nmEmp,(this.page.page * 100),100)
			]);
			
			var result = common[0].data.result;
			
			$(".message").html("총 "+(result.length * (1+this.page.page)) +"건 검색되었습니다.");
			for(var count = 0; count < result.length; count++){
				config.grpifm.list.push(result[count]);
				var td = '<tr>';
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtIn']) ? result[count]['dtIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmEmpChk']) ? result[count]['nmEmpChk'] : '')+'</td>'
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>'
				$(".in_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".in_list tbody").html('<tr><td colspan="4">검색 결과가 없습니다.</td></tr>');
			}
			this.page.count = result.length;
			this.page.change = 0;
			if(this.page.type === 0){
				this.page.num = $(".in_list tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".in_list tbody").html('<tr><td colspan="4">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		config.table_name.file = "retrieveItemIn"

		if(config.grpifm.list.length > 0 ){
			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
				}
			});
			let result = config.grpifm.list;
			$(".message").html("총 "+(result.length) +"건 검색되었습니다.");
			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtIn']) ? result[count]['dtIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmEmpChk']) ? result[count]['nmEmpChk'] : '')+'</td>'
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>'
				td = td + '</tr>';
				$(".in_list tbody").append(td);
			}

			$(".in_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".in_list").scrollTop( config.table_height.height );
			},500);

			this.page.count = result.length;
			this.page.change = 0;

			this.page.num = $(".in_list tbody").height() / 2;
			this.page.type=1;

			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".in_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".in_list").scrollTop() >= ($(".in_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".in_list tr");
		$(document).on("click",".in_list tr",function(){
			
			config.grpifm.scroll = $(".in_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".in_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			var id = config.grpifm.list[config.grpifm.select_no].noIn;

			config.table.attach1="자재입고";
			config.table.attach2=id;
			config.detail_file.index = id;

		});
	}

	//저장
	btnSave = async () => { 
		var dtIn = $("#item_dtln").val();
		var noEmpChk = config.user.id;
		var remark = $("#item_remark").val()
			
		//수정
		if( this.addType === 1 && config.grpifm.select_no >= 0 ){
			if(window.confirm("수정 하시겠습니까?")){
				var noIn = config.grpifm.list[config.grpifm.select_no].noIn;
				const modify = await Promise.all([ 
					service.modifyItemIn(noIn,dtIn,noEmpChk,remark)
				]);
				alert(modify[0].data.message);
				if(modify[0].data.code === "1"){
					this.fetchSearch(1);
					$(".popup").css("display","none");
				}
			}
		//저장
		}else{
			if(window.confirm("저장 하시겠습니까?")){
				const save = await Promise.all([ 
					service.createItemIn(dtIn,noEmpChk,remark)
				]);
				alert(save[0].data.message);
				if(save[0].data.code === "1"){
					this.fetchSearch(1);
					$(".popup").css("display","none");
				}
			}
		}


	}
	btnAdd = (type) =>{
		this.addType = type;
		
		if(type === 1){
			if(config.grpifm.select_no < 0){
				alert("항목을 선택해주세요.");
			}else{
				$(".email-form").css("display","block");
				$("#item_dtln").val($(".in_list tr:eq("+config.grpifm.select_no+")").find("td:eq(1)").html());
				$("#item_remark").val($(".in_list tr:eq("+config.grpifm.select_no+")").find("td:eq(3)").html());
			}
		}else{
			$(".email-form").css("display","block");
			$("#item_dtln").val(config.formatDate(new Date(),''));
			$("#item_remark").val("");
		}
	}

	btnRemove = async () =>{
		if(config.grpifm.select_no >= 0 ){
			if(window.confirm("삭제 하시겠습니까?")){
				await Promise.all([ 
					service.deleteItemIn(config.grpifm.list[config.grpifm.select_no].noIn)
				]);
				this.fetchSearch(1);
			}
			//alert(remove[0].data.message);
			//if(remove[0].data.code==="1"){
			//$(".in_list tr:eq("+config.grpifm.select_no+")").remove();
			//}
		}else{
			alert("항목을 선택해주세요.");
		}
	}
	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser  />
				<div className="popup email-form">
					<div className="popup-box table">
						<h2>자재 입고 추가 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div className="popupContents" >
							<div id="popupForm">
								<div className="div_table div_email _02">
									<form autoComplete="off" className="form_memo">
										<div className="div_tr">
											<label>입고일자</label>
											<div className="div_td div_row1">
												<DatePicker
													locale="ko" 
													id="item_dtln"
													className="datepicker"
													selected={this.state.popupDate}
													onChange={this.popupDateChange}
													dateFormat="yyyyMMdd"
													showYearDropdown
													isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
											</div>
										</div>
										<div className="div_tr">
											<label>검수자</label>
											<div className="div_td div_row1"><input type="text" readOnly className="readonly"/>	</div>
										</div>
										<div className="div_tr h130">
											<label>비고</label>
											<div className="div_td div_row1"><textarea className="note" id="item_remark"></textarea></div>
										</div>
									</form>
								</div>
								<div className="popup_btn">
									<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
									<button type="button" onClick={this.btnSave}  className="btn_mail"><img src={btn_send} width="19" height="16" alt=""/>저장</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>자재 입고</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>입고일자</label>
											<DatePicker
												locale="ko" 
												id="dtInFr"
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
												id="dtInTo"
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
										<div className="form4">
											<label>입고번호</label>
											<input type="text" id="noIn" />
										</div>
										<div className="form4">
											<label>검수자</label>
											<input type="text" id="nmEmpChk" className="nmSelect readonly" readOnly onClick={() => this.userInfo()} />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
											<input type="hidden" id="nmEmp" className="nmSelectId" />
										</div>

									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw100p">
									<table>
										<colgroup>
											<col width="120"/>
											<col width="100"/>
											<col width="100"/>
											<col width="auto"/>
										</colgroup>
										<thead>
											<tr>
												<th>입고번호</th>
												<th>입고일자</th>
												<th>검수자</th>
												<th>비고</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="in_list mw100p">
									<table>
										<colgroup>
											<col width="120"/>
											<col width="100"/>
											<col width="100"/>
											<col width="auto"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveItemIn','자재입고')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

						<button type="button" onClick={() => config.fetchDetail(this.props,'retrieveItemInDetailInfo')}><img alt="" src={footer_search} width="15" height="15" />입고품목조회</button>

						<button type="button" onClick={this.btnRemove} ><img alt="" src={btn_remove} width="15" height="15" />자재입고삭제</button>
						<button type="button" onClick={() => this.btnAdd(0)} ><img alt="" src={footer_regist} width="15" height="15" />자재입고추가</button>
		{/*						<button type="button" onClick={() => this.btnAdd(1)} ><img alt="" src={footer_send} width="15" height="15" />자재입고정보</button>*/}
							

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemIn;