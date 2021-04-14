import React from 'react';

import btn_close from '../image/btn-close.png';
import btn_send from '../image/btn_send.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";

function closeConst(){
	$(".building-search-form").css("display","none");
	$(".sub-tab button").removeClass("active");
	$(".sub-tab button:eq(0)").addClass("active");
}

function subContents1(){ 	
	$(".sub_contents1").css("display","block");
	$(".sub_contents2").css("display","none");
	$(".sub-tab button").removeClass("active");
	$(".sub-tab button:eq(0)").addClass("active");
}
function subContents2(){ 	
	$(".sub_contents1").css("display","none");
	$(".sub_contents2").css("display","block");
	$(".sub-tab button").removeClass("active");
	$(".sub-tab button:eq(1)").addClass("active");
}

const PopupBuildingSearch2 = ({onClick}) => (
			<div className="popup building-search-form">
				<div className="popup-box table">
					<h2>건물조회<button type="button" onClick={closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div className="box sub-tab tab2">
						<button type="button" onClick={subContents1} className="active"><span>기본정보</span></button>
						<button type="button" onClick={subContents2} ><span>계약정보</span></button>
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
									<col width="100"/>
									<col width="100"/>
									<col width="100"/>
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
						<div id="popupContents_building" >
							<table>
								<colgroup>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
									<col width="100"/>
									<col width="100"/>
									<col width="100"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
					<div className="sub_contents2">
						<div id="popupHeader_building2"   >
							<table>
								<colgroup>
									<col width="70"/>
									<col width="100"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="70"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th>공사ID</th>
										<th>계약번호</th>
										<th>계약일자</th>
										<th>계약명</th>
										<th>계약자</th>
										<th>계약유형</th>
										<th>주소</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents_building2">
							<table>
								<colgroup>
									<col width="70"/>
									<col width="100"/>
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

						<h3 className="popup_title">계약정보</h3>
						<div className="box info">
							<table className="popup_cotract_info">
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
										<td className="popup_noTel"></td>
									</tr>
									<tr>
										<th>주소</th>
										<td colSpan="7" className="popup_addrCntr"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h3 className="popup_title">계약용도</h3>

						<div id="popupHeader_building3"   >
							<table>
								<colgroup>
									<col width="50"/>
									<col width="100"/>
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
						<div id="popupContents_building3"  >
							<table>
								<colgroup>
									<col width="50"/>
									<col width="100"/>
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
						<button type="button" className="close_popup close_x" onClick={closeConst}><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
						<button type="button" className="minwon_add" onClick={onClick} ><img src={btn_send} width="17" height="16" alt=""/>민원접수</button>
					</div>
				</div>
			</div>
);
export default PopupBuildingSearch2;