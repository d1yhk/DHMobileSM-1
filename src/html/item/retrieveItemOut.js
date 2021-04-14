/*ppt167 자재관리 자재출고*/ 
import React, { Component } from 'react';
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import PopupConst from '../../components/PopupConst';
import btnback from '../../image/btn_back.png';
import btn_save from '../../image/btn-save.png';
import close from '../../image/close.png';
import btn_close from '../../image/btn-close.png';
import icon2 from '../../image/icon2.png';
import btn_remove from '../../image/btn-remove.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveItemOut extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOut'){
			config.back.url.push('/retrieveItemOut');
		}
		if(config.table_name.file !== "retrieveItemOut"){
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
				popupDate: null
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

	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['stDecision']) ? result[count]['stDecision'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noOut']) ? result[count]['noOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".out_list tbody").html(td);
		}else{
			$(".out_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".out_list tbody").html('<tr><td colspan="5">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtOutFr = config.form_search(search_type,'dtOutFr');;
		var dtOutTo = config.form_search(search_type,'dtOutTo');;
		var noOut = config.form_search(search_type,'noOut');;
		var idConst = config.form_search(search_type,'idConst');;
		var nmConst = config.form_search(search_type,'nmConst');;

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".out_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no=-1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveItemOutList(dtOutFr,dtOutTo,noOut,idConst,nmConst,(this.page.page * 100),100)
			]);

			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".out_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}
			}else{
				$(".message").html("&nbsp;");
				$(".out_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".out_list tbody").html('<tr><td colspan="6">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		config.table_name.file = "retrieveItemOut"
		
		
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
				td = td + '<td>'+((result[count]['stDecision']) ? result[count]['stDecision'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noOut']) ? result[count]['noOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '</tr>';
				$(".out_list tbody").append(td);
			}

			$(".out_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".out_list").scrollTop( config.table_height.height );
			},500);

			this.page.count = result.length;
			this.page.change = 0;

			this.page.num = $(".out_list tbody").height() / 2;
			this.page.type=1;

			this.page.page = Math.ceil(result.length / 100) - 1;
			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".out_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".out_list").scrollTop() >= ($(".out_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".out_list tr");
		$(document).on("click",".out_list tr",function(){
			config.grpifm.scroll = $(".out_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".out_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});


			
			var id = config.grpifm.list[config.grpifm.select_no].noOut;

			config.table.attach1="자재출고";
			config.table.attach2=id;
			config.detail_file.index = id;

		});
	}

	//저장
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var noOut = $("#item_noOut").val();
			var gbOut = 10;//$("item_gbOut").val();
			var dtOut = $("#item_dtOut").val();
			//var idConst = $("#item_idConst").val();
			/*
			if(idConst === ""){
				alert("공사정보를 조회/선택하세요");
				return;
			}
			*/
			if(dtOut === ""){
				alert("출고일자를 선택하세요");
				return;
			}

			const save = await Promise.all([ 
				service.createItemOut(noOut,gbOut,dtOut)
			]);
			alert(save[0].data.message);
			if(save[0].data.code === "1"){
				this.fetchSearch(1);
				$(".popup").css("display","none");
			}
		}
	}
	btnAdd = (type) =>{
		$(".email-form").css("display","block");
		//$(".email-form")
	}

	btnRemove = async () =>{
		if(config.grpifm.select_no >= 0 && config.grpifm.list[config.grpifm.select_no].noOut !=''){
			if(window.confirm("삭제 하시겠습니까?")){
				const remove = await Promise.all([ 
					service.deleteItemOut(config.grpifm.list[config.grpifm.select_no].noOut)
				]);
				
				alert(remove[0].data.message);
				this.fetchSearch(1);
				//if(remove[0].data.code==="1"){
				//$(".out_list tr:eq("+config.grpifm.select_no+")").remove();


				//}
			}
		}else{
			alert("항목을 선택해주세요.");
		}

	}
	popupConst = (type) => {
		$(".const-form").css("display","block");
		$(".const-form").removeClass("type0");
		$(".const-form").removeClass("type1");
		$(".const-form").addClass("type"+type);
	}

	render() { 
		return (
			<div className="contents">
				<div className="popup email-form">
					<div className="popup-box table">
						<h2>자재 출고 추가 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div className="popupContents" >
							<div id="popupForm">
								<div className="div_table div_email">
									<form autoComplete="off" className="form_memo">
										<div className="div_tr">
											<label>출고번호</label>
											<div className="div_td div_row1"><input type="text" className="item_noOut readonly" readOnly/></div>
										</div>
										<div className="div_tr">
											<label>출고구분</label>
											<div className="div_td div_row1"><input type="text" value="출고" className="item_gbOut readonly" readOnly/></div>
										</div>
										<div className="div_tr">
											<label>출고일자</label>
											<div className="div_td div_row1">
												<DatePicker
													locale="ko" 
													id="item_dtOut"
													className="datepicker dtOut"
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
		{/*
										<div className="div_tr">
											<label>공사ID</label>
											<div className="div_td div_row1"><input type="text" id="item_idConst" className="item_idConst readonly" onClick={()=>this.popupConst(1)} readOnly/></div>
										</div>
										<div className="div_tr">
											<label>공사명</label>
											<div className="div_td div_row1"><input type="text" id="item_nmConst" className="item_nmConst readonly" readOnly/></div>
										</div>
													*/}
									</form>
								</div>
								<div className="popup_btn">
									<button type="button" className="close_popup close_x"><img alt="" src={btn_close} width="17" height="16"/>닫기</button>
									<button type="button" onClick={this.btnSave}  className="btn_mail"><img alt="" src={btn_save} width="19" height="16"/>저장</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<PopupConst  />
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>자재 출고</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>출고일자</label>
											<DatePicker
												 locale="ko" 
												id="dtOutFr"
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
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="dtOutTo"
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
										<div className="form3">
											<label>출고번호</label>
											<input type="text" id="noOut" />
										</div>
										<div className="form3">
											<label>공사ID</label>
											<input type="text" id="idConst" readOnly className="idConst readonly" onClick={()=>this.popupConst(0)}/>
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										<div className="form6">
											<label>공사명</label>
											<input type="text" id="nmConst" readOnly className="nmConst readonly" />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
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
											<col width="100"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
										</colgroup>
										<thead>
											<tr>
												<th>확인상태</th>
												<th>출고번호</th>
												<th>출고일자</th>
												<th>공사ID</th>
												<th>공사명</th>
											</tr>
										</thead>
									</table>
								</div>
								<div className="out_list mw100p">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveItemOut','자재출고')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

						<button type="button" onClick={() => config.fetchDetail(this.props,'retrieveItemOutDetailInfo')}><img alt="" src={icon2} width="15" height="15" />출고품목조회</button>

						<button type="button" onClick={this.btnRemove} ><img alt="" src={btn_remove} width="15" height="15" />자재출고삭제</button>
						<button type="button" onClick={() => this.btnAdd(0)} ><img alt="" src={icon2} width="15" height="15" />자재출고추가</button>




					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemOut;