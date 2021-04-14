/*ppt191 건물조회 팝업*/
import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';

import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";

class PopupBuildingSearch extends Component {
	
	constructor(props) {
		super(props);
		this.select_user=0;
		this.constr = [];
		//this.idx = this.props.match.params.idx;
	}

	ConstSearch = async () => {
		const basic = await Promise.all([ 
			service.retrieveBuildingDetailInfo(this.idx)
		]);
		var bas = basic[0].data.result;
		$.each(bas, function(key, value){
			$(".popup_"+key).html(value);
		});

		$("#popupContents_building tbody").html("");
		const info_list = await Promise.all([ 
			service.retrieveBuildingCustList(this.idx)
		]);
		var result = info_list[0].data.result;
		for(var count = 0; count < result.length; count++){
			var td = '<tr>';
			td = td + '<td>'+((result[count]['noCust']) ? result[count]['noCust'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmInhbt']) ? result[count]['nmInhbt'] : '')+'</td>'
			td = td + '<td>'+((result[count]['roadAddr']) ? result[count]['roadAddr'] : '')+'</td>'
			td = td + '<td>'+((result[count]['noTel1']) ? result[count]['noTel1'] : '')+'</td>'
			td = td + '<td>'+((result[count]['noMobil1']) ? result[count]['noMobil1'] : '')+'</td>'
			td = td + '<td>'+((result[count]['minwonCnt']) ? result[count]['minwonCnt'] : '')+'</td>'
			td = td + '</tr>';
			$("#popupContents_building tbody").append(td);
		}

		//상단 공급계약 목록 
		$("#popupContents_building2 tbody").html("");
		const contract_list = await Promise.all([ 
			service.retrieveBuildingContractList(this.idx)
		]);
		var contract = contract_list[0].data.result;
		for(var count1 = 0; count1 < contract.length; count1++){
			var td = '<tr>';
			td = td + '<td>'+((contract[count]['idConst']) ? contract[count]['idConst'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['idCntr']) ? contract[count]['idCntr'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['dtCntr']) ? contract[count]['dtCntr'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['nmCntr']) ? contract[count]['nmCntr'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['nmPrd']) ? contract[count]['nmPrd'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['nmGbCntr']) ? contract[count]['nmGbCntr'] : '')+'</td>'
			td = td + '<td>'+((contract[count]['addrSply']) ? contract[count]['addrSply'] : '')+'</td>'
			td = td + '</tr>';
			$("#popupContents_building2 tbody").append(td);
		}
	}

	contractDetail = async (idCntr) => {
		//계약일반정보
		const contract_detail = await Promise.all([ 
			service.retrieveContractDetail(idCntr)
		]);
		var contract = contract_detail[0].data.result;
		$.each(contract, function(key, value){
			$(".popup_"+key).html(value);
		});

		//계약정보
		$("#popupContents_building3 tbody").html("");
		const contract_uselist = await Promise.all([ 
			service.retrieveContractUseList(idCntr)
		]);
		var contract_use = contract_uselist[0].data.result;
		for(var count = 0; count < contract_use.length; count++){
			var td = '<tr>';
			td = td + '<td>'+(count+1)+'</td>'
			td = td + '<td>'+((contract_use[count]['noGmgrd']) ? contract_use[count]['noGmgrd'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['nmCdUse']) ? contract_use[count]['nmCdUse'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['nmGrdGm']) ? contract_use[count]['nmGrdGm'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['cntGm']) ? contract_use[count]['cntGm'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['amtFaci']) ? contract_use[count]['amtFaci'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['nmGbCntr']) ? contract_use[count]['nmGbCntr'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['qtyCntr']) ? contract_use[count]['qtyCntr'] : '')+'</td>'
			td = td + '<td>'+((contract_use[count]['remark']) ? contract_use[count]['remark'] : '')+'</td>'
			td = td + '</tr>';
			$("#popupContents_building3 tbody").append(td);
		}
	}

	closeConst = () => {
		$(".building-search-form").css("display","none");
	}

	subContents = async (sub_index) => { 	
		$(".sub_contents1").css("display","none");
		$(".sub_contents2").css("display","none");
		$(".sub_contents"+sub_index).css("display","block");
		$(".sub-tab button").removeClass("active");
		$(".sub-tab button:eq("+(sub_index-1)+")").addClass("active");

	}
	componentDidMount() {
		//$(".building-search-form").css("display","block");
		$(".sub_contents2").css("display","none");
		//this.ConstSearch();
		var t= this;
		$(document).on("click","#popupContents_building2 tr",function(){

			t.contractDetail($(this).find("td:eq(1)").html());
		});
	}

	render() { 
		return (
			<div className="popup building-search-form">
				<div className="popup-box table">
					<h2>건물조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box sub-tab tab2">
						<button type="button" onClick={() => this.subContents(1)} className="active"><span>기본정보</span></button>
						<button type="button" onClick={() => this.subContents(2)}><span>계약정보</span></button>
					</div>
					<div className="sub_contents1">
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>지번주소</th>
										<td className="popup_hjdAddrNm"></td>
										<th>도로명주소</th>
										<td className="popup_hjdAddrNm"></td>
									</tr>
									<tr>
										<th>건물명</th>
										<td className="popup_buldNm"></td>
										<th>운영상태</th>
										<td className="popup_status"></td>
									</tr>
									<tr>
										<th>법정동</th>
										<td className="popup_bjdNm"></td>
										<th>행정동</th>
										<td className="popup_hjdNm"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h3 className="popup_title">수용가정보</h3>
						<div id="popupHeader_building" >
							<table>
								<colgroup>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
								</colgroup>
								<thead>
									<tr>
										<th>수용가번호</th>
										<th>고객명</th>
										<th>주소</th>
										<th>전화번호</th>
										<th>휴대폰전화</th>
										<th>민원수</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents_building">
							<table>
								<colgroup>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
					<div className="sub_contents2">
						<div id="popupHeader_building2" >
							<table>
								<colgroup>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
								</colgroup>
								<thead>
									<tr>
										<th>수용가번호</th>
										<th>고객명</th>
										<th>주소</th>
										<th>전화번호</th>
										<th>휴대폰전화</th>
										<th>민원수</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents_building2">
							<table>
								<colgroup>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>

						<h3 className="popup_title">계약정보</h3>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>전자문서번호</th>
										<td className="popup_noElecdocu"></td>
										<th>계약명</th>
										<td className="popup_nmCntr"></td>
										<th>계약유형</th>
										<td className="popup_nmGbCntr"></td>
										<th>계약자</th>
										<td className="popup_nmPrd"></td>
									</tr>
									<tr>
										<th>공사명</th>
										<td colSpan="3" className="popup_nmConst"></td>
										<th>공사구분</th>
										<td className="popup_nmGbCons"></td>
										<th>내관업체</th>
										<td className="popup_nmPartnerIn"></td>
									</tr>
									<tr>
										<th>주택구분</th>
										<td className="popup_nmGbHs"></td>
										<th>건물</th>
										<td className="popup_nmBld"></td>
										<th>담당자</th>
										<td className="popup_nmEmpSale"></td>
										<th>전화번호</th>
										<td className="popup_addrCntr"></td>
									</tr>
									<tr>
										<th>주택구분</th>
										<td colSpan="7" className="popup_noElecdocu"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h3 className="popup_title">계약용도</h3>

						<div id="popupHeader_building3" >
							<table>
								<colgroup>
									<col width="50"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th>순번</th>
										<th>계약용도</th>
										<th>계량기등급</th>
										<th>계량기수량</th>
										<th>시설분담금</th>
										<th>계약구분</th>
										<th>시간당사용량</th>
										<th>비고</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents_building3">
							<table>
								<colgroup>
									<col width="50"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
					<div className="popup_btn _building">
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupBuildingSearch;