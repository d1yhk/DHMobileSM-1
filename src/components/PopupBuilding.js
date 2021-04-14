import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";

class PopupBuilding extends Component {
	
	constructor(props) {
		super(props);
		this.page_building = {change : 0,num: 0, type:0,count:0, page:0 };
		this.select_build=0;
		this.constr = [];

	}
	BuildingSearch = async (search_type) => {
		var cdDong = $('#build_cdDong').val();
		var lotFrom = $('#build_lotFrom').val();
		var lotto = $('#build_lotto').val();
		var nmBld = $('#build_nmBld').val();
		var roadAddr = $('#build_roadAddr').val();
		var addrL = $('#build_addrL').val();
		var addrS = $('#build_addrS').val();
		var cdCompany = 10000;

		if(search_type===1){
			$(".message_building").html("검색중입니다.");
			this.page_building.page = 0;
			this.page_building.num = 0;
			this.page_building.count = 0;
			this.page_building.change = 0;
			this.page_building.type=0;
			$(".popup_building tbody").html("");
		}

		try {
			const user_list = await Promise.all([ 
				service.retrieveBuildingCodeList(cdCompany,cdDong,lotFrom,lotto,nmBld,roadAddr,addrL,addrS,(this.page_building.page * 100),100)
			]);
			//if(user_list.data.code > 0){
				var result = user_list[0].data.result;
				$(".message_building").html("총 "+(result.length + ((this.page_building.page) * 100)) +"건 검색되었습니다.");
				for(var count = 0; count < result.length; count++){
					this.constr.push(result[count]);
					var td = '<tr>';
					td = td + '<td data-cdBld="'+result[count]['cdBld']+'">'+((result[count]['cdDongNm']) ? result[count]['cdDongNm'] : '')+'</td>'
					td = td + '<td>'+((result[count]['lot']) ? result[count]['lot'] : '')+'</td>'
					td = td + '<td>'+((result[count]['addr1']) ? result[count]['addr1'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmBld']) ? result[count]['nmBld'] : '')+'</td>'
					td = td + '</tr>';
					$(".popup_building tbody").append(td);
				}

				this.page_building.change = 0;
				this.page_building.count = result.length;
				if( result.length <= 0 ){
					$(".popup_building tbody").html('<tr><td colspan="3">검색 결과가 없습니다.</td></tr>');
				}
			//}else{
			//	$(".message").html("&nbsp;");
			//	$(".popup_building tbody").html('<tr><td colspan="3">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			//}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".popup_building tbody").html('<tr><td colspan="3">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	SelectBuilding = () => {
		var sel = $(".popup_building tr:eq("+this.select_build+")");
		$("#cdBld").val(sel.find("td:eq(0)").attr("data-cdBld"));
		//$(".idConst").val(sel.find("td:eq(0)").html());
		//$(".nmConst").val(sel.find("td:eq(1)").html());
		$(".popup").css("display","none");
	}
	
	formOption = async () => {
		const common = await Promise.all([service.retrieveErpDong()]);
		var result = common[0].data.result;
		for(var count = 0; count < result.length; count++){                
			$("#build_cdDong").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
	closeConst = () => {
		$(".building-form").css("display","none");
	}
	componentDidMount() {
		this.formOption();
		this.BuildingSearch(1);

				
		var t = this;
		var first = 0;
		$(".popup_building").scroll(function(){
			if(first === 0 ){
				t.page_building.num = $(".popup_building table").height() / 2;
			}
			first = 1;
			if(t.page_building.count >= 100){
				if( $(".popup_building").scrollTop() >= ($(".popup_building table").height() - t.page_building.num)){
					if(t.page_building.change === 0){
						t.page_building.change = 1;
						t.page_building.page++;
						t.BuildingSearch(0);
					}
				}
			}
		});

		$(document).on("click",".popup_building tr",function(){
			$(".popup_building tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.select_build = $(this).index();
		});

	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup building-form">
				<div className="popup-box table">
					<h2>건물코드 조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box search2">
						<form>
							<fieldset>
								<div className="form-contoll">
									<div className="form4">
										<label>법정동</label>
										<select id="build_cdDong">
											<option value="">전체</option>
										</select>
									</div>
									<div className="form4">
										<label>지번</label>
										<input type="text" id="build_lotFrom"  />
									</div>
									<div className="form4">
										<label>-</label>
										<input type="text" id="build_lotTo"  />
									</div>
									<div className="form4">
										<label>건물명</label>
										<input type="text" id="build_nmBld"  />
									</div>

									<div className="form4">
										<label>도로명</label>
										<input type="text" id="build_roadAddr"  />
									</div>
									<div className="form4">
										<label>건물번호</label>
										<input type="text" id="build_addrL"  />
									</div>
									<div className="form4">
										<label>-</label>
										<input type="text" id="build_addrS"  />
									</div>


								</div>
								<button type="button" className="btn-search" onClick={() => this.BuildingSearch(1)}  >검색</button>
							</fieldset>
						</form>
					</div>
					<p className="message_building">검색을 해주세요.</p>
					<div id="popupHeader2" >
						<table>
							<colgroup>
								<col width="100"/>
								<col width="100"/>
								<col width="*"/>
								<col width="*"/>
							</colgroup>
							<thead>
								<tr>
									<th>법정동</th>
									<th>번지</th>
									<th>도로명 주소</th>
									<th>건물명</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents3" className="popup_building">
						<table>
							<colgroup>
								<col width="100"/>
								<col width="100"/>
								<col width="*"/>
								<col width="*"/>
							</colgroup>
							<tbody>
							</tbody>
						</table>
					</div>
					<div className="popup_btn _02">
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16"/>닫기</button>
						<button type="button" onClick={this.SelectBuilding} className="btn_mail"><img src={btn_select} width="19" height="16"/>선택</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupBuilding;