import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import * as config from '../components/config';
import $ from "jquery";

class PopupCustList extends Component {
	
	constructor(props) {
		super(props);
		this.page_cust = {change : 0,num: 0, type:0,count:0, page:0 };
		this.select_cust=0;
		this.constr = [];

	}
	ConstSearch = async (search_type) => {
		var cdDong = $('#poup_cdDong').val();
		var lotFrom = $('#poup_lotFrom').val();
		var lotTo = $('#poup_lotTo').val();
		var cdZone = $('#poup_cdZone').val();
		var roadAddr = $('#poup_roadAddr').val();
		var addrL = $('#poup_addrL').val();
		var addrS = $('#poup_addrS').val();
		var nmCust = $('#poup_nmCust').val();
		var nmBld = $('#poup_nmBld').val();
		var dongHs = $('#poup_dongHs').val();
		var hoHs = $('#poup_hoHs').val();
		var syseqno = $('#poup_syseqno').val();
		var cdCompany  = 10000;

		if(search_type===1){
			$(".message_popup").html("검색중입니다.");
			this.page_cust.page = 0;
			this.page_cust.num = 0;
			this.page_cust.count = 0;
			this.page_cust.change = 0;
			this.page_cust.type=0;
			$(".popup_custlist tbody").html("");
		}
		try {
			const user_list = await Promise.all([ 
				service.retrieveCustList(cdCompany,cdDong,lotFrom,lotTo,cdZone,roadAddr,addrL,addrS,nmCust,nmBld,dongHs,hoHs,syseqno,(this.page_cust.page * 100),100)
			]);
			//if(user_list.data.code > 0){
				var result = user_list[0].data.result;
				this.page_cust.count = result.length;
				$(".message_popup").html("총 "+(result.length * (1+this.page_cust.page)) +"건 검색되었습니다.");
				for(var count = 0; count < result.length; count++){
					this.constr.push(result[count]);
					var td = '<tr>';
					td = td + '<td>'+((result[count]['noCust']) ? result[count]['noCust'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmCust']) ? result[count]['nmCust'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmDong']) ? result[count]['nmDong'] : '')+'</td>'
					td = td + '<td>'+((result[count]['sLot']) ? result[count]['sLot'] : '')+'</td>'
					td = td + '<td>'+((result[count]['addr1']) ? result[count]['addr1'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmBld']) ? result[count]['nmBld'] : '')+'</td>'
					td = td + '<td>'+((result[count]['addr2']) ? result[count]['addr2'] : '')+'</td>'
					td = td + '<td>'+((result[count]['stCustNm']) ? result[count]['stCustNm'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noUsecntr']) ? result[count]['noUsecntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noMachinGm']) ? result[count]['noMachinGm'] : '')+'</td>'
					td = td + '</tr>';
					$(".popup_custlist tbody").append(td);
				}
				
				this.page_cust.change = 0;
				if( result.length <= 0 ){
					$(".popup_custlist tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
				}
			//}else{
			//	$(".message").html("&nbsp;");
			//	$(".popup_custlist tbody").html('<tr><td colspan="9">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			//}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".popup_custlist tbody").html('<tr><td colspan="9">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}

	}

	SelectConst = () => {
		var sel = $(".popup_custlist tr:eq("+this.select_cust+")");
		if(typeof $("#noCust").val()!==undefined){
			$("#noCust").val(sel.find("td:eq(0)").html());
		}
		if(typeof $(".idConst").val()!==undefined){
			$(".idConst").val(sel.find("td:eq(0)").html());
			$(".nmConst").val(sel.find("td:eq(1)").html());
		}


		$(".popup").css("display","none");
	}
	
	formOption = async () => {
		const common = await Promise.all([service.retrieveErpDong()]);
		var result = common[0].data.result;
		for(var count = 0; count < result.length; count++){                
			$("#poup_cdDong").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}

		config.fetchCommon("ERP","CG_Z_00101","poup_cdZone");
	}
	closeConst = () => {
		$(".popup").css("display","none");
	}
	componentDidMount() {
		this.formOption();
		this.ConstSearch(1);
		var first = 0;
		var t = this;
		$(".popup_custlist").scroll(function(){

			if(first === 0 ){
				t.page_cust.num = $(".popup_custlist table").height() / 2;
			}
			first = 1;
			if(t.page_cust.count >= 100){
				if( $(".popup_custlist").scrollTop() >= ($(".popup_custlist table").height() - t.page_cust.num)){
					if(t.page_cust.change === 0){
						t.page_cust.change = 1;
						t.page_cust.page++;
						t.ConstSearch(0);
					}
				}
			}
		});

		$(document).on("click",".popup_custlist tr",function(){
			$(".popup_custlist tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.select_cust = $(this).index();
		});

	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup custlist-form">
				<div className="popup-box table">
					<h2>수용가번호 조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box search2">
						<form>
							<fieldset>
								<div className="form-contoll">
									<div className="form4">
										<label>법정동</label>
										<select id="poup_cdDong">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form4">
										<label>지번</label>
										<input type="text" id="poup_lotFrom"  />
									</div>
									<div className="form4">
										<label>-</label>
										<input type="text" id="poup_lotTo"  />
									</div>
									<div className="form4">
										<label>지역관리소</label>
										<select id="poup_cdZone">
											<option value="">전체</option>
										</select>
									</div>

									<div className="form4">
										<label>도로명</label>
										<input type="text" id="poup_roadAddr"  />
									</div>
									<div className="form4">
										<label>건물번호</label>
										<input type="text" id="poup_addrL"  />
									</div>
									<div className="form4">
										<label>-</label>
										<input type="text" id="poup_addrS"  />
									</div>
									<div className="form4">
										<label>고객명/상호</label>
										<input type="text" id="poup_nmCust"  />
									</div>

									<div className="form4">
										<label>건물명</label>
										<input type="text" id="poup_nmBld"  />
									</div>
									<div className="form4">
										<label>동</label>
										<input type="text" id="poup_dongHs"  />
									</div>
									<div className="form4">
										<label>호</label>
										<input type="text" id="poup_hoHs"  />
									</div>
									<div className="form4">
										<label>구고객번호</label>
										<input type="text" id="poup_syseqno"  />
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
								<col width="100"/>
								<col width="100"/>
								<col width="*"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<thead>
								<tr>
									<th>수용가<br/>번호</th>
									<th>고객명<br/>/수용가명</th>
									<th>법정동</th>
									<th>번지</th>
									<th>도로명 주소</th>
									<th>건물명</th>
									<th>동/호</th>
									<th>상태</th>
									<th>고객등록<br/>계약번호</th>
									<th>계량기<br/>번호</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents2" className="popup_custlist">
						<table>
							<colgroup>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="*"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<tbody>
							</tbody>
						</table>
					</div>
					<div className="popup_btn _02">
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16"/>닫기</button>
						<button type="button" onClick={this.SelectConst} className="btn_mail"><img src={btn_select} width="19" height="16"/>선택</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupCustList;