import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";


class PopupUser extends Component {
	
	constructor(props) {
		super(props);
		this.page_user = {change : 0,num: 0, type:0,count:0, page:0 };
		this.select_user=0;
		this.users = [];
	}

	UserSearch = async (search_type) => {
		var noEmp = $("#noEmp").val();
		var nmKor = $("#nmKor").val();
		var nmDept = $("#nmDept").val();
		var nmDutyRank = $("#nmDutyRank").val();

		if(search_type===1){
			$(".message_popup").html("검색중입니다.");
			this.page_user.page = 0;
			this.page_user.num = 0;
			this.page_user.count = 0;
			this.page_user.change = 0;
			this.page_user.type=0;
			$(".popup_partner_list tbody").html("");
		}

		const user_list = await Promise.all([ 
			service.retrieveUserInfoList(noEmp,nmKor,nmDept,nmDutyRank,(this.page_user.page * 100),100)
		]);
		$(".popup_user tbody").html("");
		var result = user_list[0].data.result;
		for(var count = 0; count < result.length; count++){
			this.users.push(result[count]);
			var td = '<tr>';
			td = td + '<td>'+((result[count]['noEmp']) ? result[count]['noEmp'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmDept']) ? result[count]['nmDept'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmKor']) ? result[count]['nmKor'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmDutyRank']) ? result[count]['nmDutyRank'] : '')+'</td>'
			td = td + '</tr>';
			$(".popup_user tbody").append(td);
		}

		this.page_user.change = 0;
		this.page_user.count = result.length;
	}

	SelectUser = () => {
		var sel = $(".popup_user tr:eq("+this.select_user+")");
		if($(".nmSelect").val() !== undefined){
			$(".nmSelect").val(sel.find("td:eq(2)").html());
			$(".nmSelectId").val(sel.find("td:eq(0)").html());
		}

		if($(".nmSelectName").val() !== undefined){
			$(".nmSelectName").val(sel.find("td:eq(2)").html());
		}
		
		if($(".user-form").attr("class").indexOf("user_type0") >= 0){
			$(".noEmpTakeinsp").val(sel.find("td:eq(0)").html());
			$(".nmEmpTakeinsp").val(sel.find("td:eq(2)").html());
		}
		if($(".user-form").attr("class").indexOf("user_type1") >= 0){
			$(".noEmp2Takeinsp").val(sel.find("td:eq(0)").html());
			$(".nmEmp2Takeinsp").val(sel.find("td:eq(2)").html());
		}
		$(".popup").css("display","none");


	}
	
	formOption = async () => {
		var data={cdCompany :10000}
		const retrieveDeptList = await Promise.all([ 
			service.retrieveDeptList(data)
		]);
		for(var count = 0; count < retrieveDeptList[0].data.result.length; count++){
			$("#nmDept").append(("<option value=\""+retrieveDeptList[0].data.result[count].lcode+"\">"+retrieveDeptList[0].data.result[count].lvalue+"</option>"));
		}

		const retrieveRankList = await Promise.all([ 
			service.retrieveRankList(data)
		]);
		for(var count = 0; count < retrieveRankList[0].data.result.length; count++){
			$("#nmDutyRank").append(("<option value=\""+retrieveRankList[0].data.result[count].lcode+"\">"+retrieveRankList[0].data.result[count].lvalue+"</option>"));
		}

	
	}
	componentDidMount() {
	
		this.formOption();
		this.UserSearch(1);

				
		var t = this;
		var first = 0;
		$(".popup_user").scroll(function(){
			if(first === 0 ){
				t.page_user.num = $(".popup_user table").height() / 2;
			}
			first = 1;
			if(t.page_user.count >= 100){
				if( $(".popup_user").scrollTop() >= ($(".popup_user table").height() - t.page_user.num)){
					if(t.page_user.change === 0){
						t.page_user.change = 1;
						t.page_user.page++;
						t.UserSearch(0);
					}
				}
			}
		});


		$(document).off("click",".popup_user tr");
		$(document).on("click",".popup_user tr",function(){
			$(".popup_user tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.select_user = $(this).index();
		});


	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup user-form">
				<div className="popup-box table">
					<h2>사용자정보 조회<button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box search2">
						<form>
							<fieldset>
								<div className="form-contoll">
									<div className="form2">
										<label>사원번호</label>
										<input type="text" id="noEmp" />
									</div>
									<div className="form2">
										<label>이름</label>
										<input type="text" id="nmKor"  />
									</div>
									<div className="form2">
										<label>부서</label>
										<select id="nmDept">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form2">
										<label>전체</label>
										<select id="nmDutyRank">
											<option value="">전체</option>
										</select>
									</div>
								</div>
								<button type="button" className="btn-search" onClick={this.UserSearch} >검색</button>
							</fieldset>
						</form>
					</div>
					<p className="message_popup"></p>
					<div id="popupHeader2" >
						<table>
							<colgroup>
								<col width="100"/>
								<col width="*"/>
								<col width="100"/>
								<col width="100"/>
							</colgroup>
							<thead>
								<tr>
									<th>사원번호</th>
									<th>부서</th>
									<th>이름</th>
									<th>직급</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents2" className="popup_user">
						<table>
							<colgroup>
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
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
						<button type="button" onClick={this.SelectUser} className="btn_mail"><img src={btn_select} width="19" height="16" alt=""/>선택</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupUser;