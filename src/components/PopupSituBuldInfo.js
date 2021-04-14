/*ppt184 차단분석 차단수용가*/
import React from 'react';

import btn_close from '../image/btn-close.png';
import btn_send from '../image/btn_send.png';
import close from '../image/close.png';

const PopupSituBuldInfo = ({}) => (
	<div className="popup situbuld-form">
		<div className="popup-box table">
			<h2>차단수용가 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
			<div id="popupForm" >

				<div id="popupH1" >
					<table>
						<colgroup>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
							<col width="*"/>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
						</colgroup>
						<thead>
							<tr>
								<th>건물번호</th>
								<th>건물명</th>
								<th>도로명주소</th>
								<th>구주소</th>
								<th>주택구분</th>
								<th>사용세대수</th>
								<th>사용월</th>
								<th>가스사용량</th>
							</tr>
						</thead>
					</table>
				</div>
				<div id="popupC1">
					<table>
						<colgroup>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
							<col width="*"/>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
						</colgroup>
						<tbody>
						</tbody>
					</table>
				</div>
				<div id="popupH2" >
					<table>
						<colgroup>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
							<col width="*"/>
							<col width="100"/>
							<col width="100"/>
							<col width="100"/>
						</colgroup>
						<thead>
							<tr>
								<th>수용가번호</th>
								<th>수용가명</th>
								<th>주택구분</th>
								<th>사용용도</th>
								<th>고객명</th>
								<th>연락처</th>
								<th>가스사용량</th>
							</tr>
						</thead>
					</table>
				</div>
				<div id="popupC2">
					<table>
						<colgroup>
							<col width="100"/>
							<col width="100"/>
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


				<div className="popup_btn">
					<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
				</div>
			</div>
		</div>
	</div>

);
export default PopupSituBuldInfo;