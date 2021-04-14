import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import * as config from '../components/config';
import $ from "jquery";

class PopupPartnerInfo extends Component {
	
	constructor(props) {
		super(props);
		this.page_partner = {change : 0,num: 0, type:0,count:0, page:0 };
		this.select_user=0;
		this.constr = [];

	}
	ConstSearch = async (search_type) => {
		var fgPartner = $('#poup_fgPartner').val();
		var cdCon = $('#poup_cdCon').val();
		var lnPartner = $('#poup_lnPartner').val();

		if(search_type===1){
			$(".message_popup").html("검색중입니다.");
			this.page_partner.page = 0;
			this.page_partner.num = 0;
			this.page_partner.count = 0;
			this.page_partner.change = 0;
			this.page_partner.type=0;
			$(".popup_partner_list tbody").html("");
		}
		const user_list = await Promise.all([ 
			service.retrievePartnerInfoList(fgPartner,cdCon,lnPartner,(this.page_partner.page * 100),100)
		]);
		var result = user_list[0].data.result;
		$(".message_popup").html("총 "+(result.length * (1+this.page_partner.page)) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			this.constr.push(result[count]);
			var td = '<tr>';
			td = td + '<td>'+((result[count]['cdPartner']) ? result[count]['cdPartner'] : '')+'</td>'
			td = td + '<td>'+((result[count]['fgPartnerNm']) ? result[count]['fgPartnerNm'] : '')+'</td>'
			td = td + '<td>'+((result[count]['lnPartner']) ? result[count]['lnPartner'] : '')+'</td>'
			td = td + '<td>'+((result[count]['noCompany']) ? result[count]['noCompany'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmCeo']) ? result[count]['nmCeo'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmCon']) ? result[count]['nmCon'] : '')+'</td>'
			td = td + '</tr>';
			$(".popup_partner_list tbody").append(td);
		}
		this.page_partner.change = 0;
		this.page_partner.count = result.length;
	}

	SelectConst = () => {
		if(this.select_user >= 0){
			var sel = $(".popup_partner_list tr:eq("+this.select_user+")");
			//$(".idConst").val(sel.find("td:eq(0)").html());
			//$(".nmConst").val(sel.find("td:eq(1)").html());
			if($(".partner-form").attr("class").indexOf("modify")>=0){
				$(".partner_name").val(this.constr[this.select_user].lnPartner);	//거래처명
				$(".partner_id").val(this.constr[this.select_user].cdPartner);		//거래처코드
			}
			if($(".partner-form").attr("class").indexOf("new")>=0){
				var idx = $(".partner-form").attr("data-id")
				$(".new:eq("+idx+")").find(".new_input").val(this.constr[this.select_user].lnPartner);
				$(".new:eq("+idx+")").find(".new_id").val(this.constr[this.select_user].cdPartner);
			}

			$(".partner-form").removeClass("modify");
			$(".partner-form").removeClass("new");
			$(".partner-form").css("display","none");
		}else{
			alert("선택할 항목을 선택하세요");
		}
	}
	
	formOption = async () => {

		config.fetchCommon("ERP","MA-B000001","poup_fgPartner");
		config.fetchCommon("ERP","MA-B000073","poup_cdCon");
	}
	closeConst = () => {
		
		$(".partner-form").removeClass("modify");
		$(".partner-form").removeClass("new");
		$(".partner-form").css("display","none");
	}
	componentDidMount() {
		this.ConstSearch(1);
		this.formOption();


		var t = this;
		var first = 0;
		$(".popup_partner_list").scroll(function(){
			if(first === 0 ){
				t.page_partner.num = $(".popup_partner_list table").height() / 2;
			}
			first = 1;
			if(t.page_partner.count >= 100){
				if($(".popup_partner_list").scrollTop() >= ($(".popup_partner_list tbody").height() - t.page_partner.num)){
					if(t.page_partner.change === 0){
						t.page_partner.change = 1;
						t.page_partner.page++;
						t.ConstSearch(0);
					}
				}
			}
		});

		$(document).on("click",".popup_partner_list tr",function(){
			$(".popup_partner_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.select_user = $(this).index();
		});

	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup partner-form">
				<div className="popup-box table">
					<h2>수용가번호 조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box search2">
						<form>
							<fieldset>
								<div className="form-contoll">
									<div className="form2">
										<label>거래처구분</label>
										<select id="poup_fgPartner">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form2">
										<label>휴폐업구분</label>
										<select id="poup_cdCon">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form1">
										<label>거래처명</label>
										<input type="text" id="poup_lnPartner"  />
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
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<thead>
								<tr>
									<th>거래처코드</th>
									<th>거래처구분</th>
									<th>거래처명</th>
									<th>사업자등록번호</th>
									<th>대표자명</th>
									<th>휴폐업구분</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents2" className="popup_partner_list">
						<table>
							<colgroup>
								<col width="100"/>
								<col width="100"/>
								<col width="100"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<tbody>
							</tbody>
						</table>
					</div>
					<div className="popup_btn _02">
						<button type="button" onClick={this.closeConst} className="close_popup close_x"><img src={btn_close} width="17" height="16"/>닫기</button>
						<button type="button" onClick={this.SelectConst} className="btn_mail"><img src={btn_select} width="19" height="16"/>선택</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupPartnerInfo;