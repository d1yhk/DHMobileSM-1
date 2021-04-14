/* ppt165 자재입고 입고품목 */

import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";
import PopupPartnerInfo from '../../components/PopupPartnerInfo';


import btn_add from '../../image/btn_add.png';
import btnback from '../../image/btn_back.png';
import btn_save from '../../image/btn-save.png';
import btn_remove from '../../image/btn-remove.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveItemInDetailInfo extends Component {
	
	constructor(props) {
		super(props);
		this.current = '';
		this.info_list = [];
		this.result = {};
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemInDetailInfo/'+this.props.match.params.idx){
			config.back.url.push('/retrieveItemInDetailInfo/'+this.props.match.params.idx);
		}
		this.state = {
				startDate: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.parnter_num = -1;
	}

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	//입고 품목추가
	btnAdd = async () => {
		this.props.history.push("/retrieveItemOrdDtlList");
	}

	//입고 품목삭제
	btnRemove = async () => {
		if(window.confirm("삭제 하시겠습니까?")){
			if(this.current >= 0 ){
				const info = await Promise.all([ 
					service.deleteItemInDtl(this.info_list[this.current].noIn,this.info_list[this.current].seqIn)
				]);
				this.info_list.splice(this.current, 1);
				$(".in_detail_info tr:eq("+this.current+")").remove();
				alert(info[0].data.message);

				
			}else{
				alert("리스트를 선택해주세요");
			}
		}
	}
	//입고품목정보 저장
	infoSave = async () => { 

		var today = config.formatDate(new Date(),"");
		if(window.confirm("저장 하시겠습니까?")){
			var j=0;
			var t= this;
			$(".new").each(function(){
				config.item_select[j]['dtIn'] = today;//$(this).find("input:eq(0)").val();
				config.item_select[j]['lnPartner'] = config.item_select[j]['lnPartner'];
				config.item_select[j]['qtyOrd'] = $(this).find("input:eq(3)").html();//config.item_select[j]['qtyOrd'];//$(this).find("input:eq(2)").val();
				config.item_select[j]['gbIn'] = 1;
				config.item_select[j]['noIn'] = $(".noIn").html();
				config.item_select[j]['nmEmpChk'] = $(".nmEmpChk").html();
				config.item_select[j]['noEmpChk'] = t.result.noEmpChk;
				config.item_select[j]['stDecision'] = $(".stDecision").html();
				config.item_select[j]['remark'] = $(".remark").html();
				config.item_select[j]['qtyIn'] = $(this).find("input:eq(4)").html();//config.item_select[j]['qtyRm'];
				config.item_select[j]['amtIn'] = config.item_select[j]['amtOrd'];
				config.item_select[j]['token2']=config.user.token2;
				config.item_select[j]['idUser']=config.user.id;
				j++;
			});
			
			const info = await Promise.all([ 
				service.createItemInDtlList(config.item_select)
			]);
			$(".in_detail_info tbody").html("");
			this.fetchSearch(0);
			config.item_select.length=0;
			alert(info[0].data.message);
		}
	}

	fetchInfo = async () => { 
		const info = await Promise.all([ 
			service.retrieveItemInDetailInfo(this.props.match.params.idx)
		]);

		var result = info[0].data.result;
		this.result = result;
		$.each(result, function(key, value){
			$(".info ."+key).html(value);
		});

		
	}
	
	lists = (result,stype) => { 

		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(result[count]['dtIn']){
				result[count]['dtIn'] = config.formatDate2(result[count]['dtIn'],"-")
			}
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			var td = '<tr>';

				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOrd']) ? result[count]['qtyOrd'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyIn']) ? result[count]['qtyIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcItem']) ? result[count]['prcItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtIn']) ? result[count]['amtIn'] : '')+'</td>'

			td = td + '</tr>';
			$(".in_detail_info tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".in_detail_info tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		try {
			const common = await Promise.all([ 
				service.retrieveItemInDtlList(this.props.match.params.idx)
			]);
			
			var result = common[0].data.result;
			this.info_list = result;
			for(var count = 0; count < result.length; count++){
				if(result[count]['dtIn']){
					result[count]['dtIn'] = config.formatDate2(result[count]['dtIn'],"-")
				}
				var td = '<tr>';

				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOrd']) ? result[count]['qtyOrd'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyIn']) ? result[count]['qtyIn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcItem']) ? result[count]['prcItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtIn']) ? result[count]['amtIn'] : '')+'</td>'

				td = td + '</tr>';
				$(".in_detail_info tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".in_detail_info tbody").html('');
			}
			var table_height = $(window).height() - 520;//(350 === header, footer)
			$(".in_detail_info").height(table_height);

	
		} catch(err){
				$(".message").html("&nbsp;");
				$(".in_detail_info tbody").html('');
		}

	
		var today = config.formatDate(new Date(),"");
		var result = config.item_select;
		for(var count=0; count < result.length; count++){
			
			if(result[count]['dtIn']){
				result[count]['dtIn'] = config.formatDate2(result[count]['dtIn'],"-")
			}
			this.info_list.unshift(result[count]);
			var td = '<tr class="new">';
			td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
			td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
			td = td + '<td>'+((result[count]['qtyOrd']) ? result[count]['qtyOrd'] : '')+'</td>'
			td = td + '<td>'+((result[count]['qtyIn']) ? result[count]['qtyIn'] : result[count]['qtyRm'])+'</td>'
			td = td + '<td>'+((result[count]['prcItem']) ? result[count]['prcItem'] : '')+'</td>'
			td = td + '<td>'+((result[count]['amtIn']) ? result[count]['amtIn'] : '')+'</td>'
			td = td + '</tr>';
			$(".in_detail_info tbody").prepend(td);
		}
		
	}
	
	//입고 품목 수정
	btnModify = async () => {
		if(this.current === ""){
			alert("수정할 입고품목을 선택해주세요");
		}else{
			if(window.confirm("수정 하시겠습니까?")){
				const modify = await Promise.all([ 
					service.modifyItemInDtl(this.info_list[this.current].noIn,this.info_list[this.current].seqIn,$(".modify input:eq(0)").val(),$(".modify input:eq(2)").val(),$(".modify input:eq(3)").val(),this.info_list[this.current].prcItem)
				]);
				alert(modify[0].data.message);
				console.log(modify)
			}			
		}
	}
	onPartner = () => {
		if(this.current>=0){
			$(".partner-form").addClass("modify");
			$(".partner-form").css("display","block");
		}else{
			alert("입고품목리스트를 선택해주세요")
		}
	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		this.fetchInfo();
		this.fetchSearch(1);

		var t = this;
		
		$(document).off("click",".new_input");
		$(document).on("click",".new_input",function(){
			//alert($(this).parent().parent().index());
			//t.parnter_num = $(this).parent().parent().index();
			$(".partner-form").addClass("new");
			$(".partner-form").attr("data-id",$(this).parent().parent().index());
			$(".partner-form").css("display","block");
		});

		//테이블 리스트 선택
		$(document).off("click",".in_detail_info tr");
		$(document).on("click",".in_detail_info tr",function(){
			if($(this).find("input:eq(0)").val() === undefined){
				$(".in_detail_info tr").css({"background-color":"transparent"});
				$(this).css({"background-color":"#eee"});

				t.current = $(this).index();
				
				$(".modify input:eq(0)").val(t.info_list[t.current].dtIn);
				$(".modify input:eq(1)").val(t.info_list[t.current].lnPartner);
				$(".modify input:eq(2)").val(t.info_list[t.current].qtyIn);
			}
		});


	}

	render() { 
		return (
			<div className="contents">
				<PopupPartnerInfo />
				<div className="detail">
					<div className="tab tab1">
						<h2>입고품목</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">입고 상세정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>입고번호</th>
										<td className="noIn"></td>
										<th>입고일자</th>
										<td className="dtIn"></td>
										<th>검수자</th>
										<td className="nmEmpChk"></td>
									</tr>
									<tr>
										<th>확인상태</th>
										<td className="stDecision"></td>
										<th>비고</th>
										<td className="remark" colSpan="3"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">입고품목<button type="button" className="btn_min_save" onClick={this.infoSave}><img src={btn_save} width="16" height="16" alt="" /><span>품목정보저장</span></button></h2>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="auto"/>
											<col width="150"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>공사</th>
												<th>품목</th>
												<th>규격</th>
												<th>발주수량</th>
												<th>입고수량</th>
												<th>입고단가</th>
												<th>입고금액</th>
											</tr>
										</thead>
									</table>
								</div>
								<div className="in_detail_info mw1000">
									<table>
										<colgroup>
											<col width="auto"/>
											<col width="150"/>
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
						<h2 className="wrap-head">입고품목 수정</h2>
						<div className="box table">
							<div className="mw1000 modify">
								<table >
									<colgroup>
										<col width="140"/>
										<col width="auto"/>
										<col width="140"/>
										<col width="auto"/>
										<col width="140"/>
										<col width="auto"/>
									</colgroup>
									<tfoot>
										<tr>
											<th>입고일자</th>
											<td>
												<DatePicker
													locale="ko" 
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
											</td>
											<th>거래처</th>
											<td><input type="text" className="partner_name" onClick={this.onPartner}/>
												<input type="hidden" className="partner_id"/>
											</td>
											<th>입고수량</th>
											<td><input type="text" /></td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" onClick={this.btnRemove}><img alt="" src={btn_remove} width="15" height="15" />입고품목삭제</button>
						<button type="button" onClick={this.btnAdd}><img alt="" src={btn_add} width="15" height="15" />입고품목추가</button>
						<button type="button" onClick={this.btnModify}><img alt="" src={btn_save} width="15" height="15" />입고품목수정</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemInDetailInfo;