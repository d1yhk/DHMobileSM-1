import React from 'react';

import btn_close from '../image/btn-close.png';
import btn_send from '../image/btn_send.png';
import close from '../image/close.png';

const PopupEmail = ({ onClick }) => (
	<div className="popup email-form">
		<div className="popup-box table">
			<h2>주의장 이메일발송 <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
			<div id="popupForm" >
				<table>
					<colgroup>
						<col width="130"/>
						<col width="250"/>
					</colgroup>
					<tbody>
						<tr>
							<th>제목</th>
							<td><input type="text" className="warningTitle"/></td>
						</tr>
						<tr>
							<th>받는이</th>
							<td><input type="text"  className="userEmail"/></td>
						</tr>
						<tr>
							<th>수신인</th>
							<td><input type="text" readOnly className="readonly mailReceive" /></td>
						</tr>
						<tr>
							<th>내용</th>
							<td className="memo"><textarea className="note"></textarea></td>
						</tr>
					</tbody>
				</table>
				<div className="popup_btn">
					<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
					<button type="button" onClick={onClick}  className="btn_mail"><img src={btn_send} width="19" height="16" alt=""/>발송</button>
				</div>
			</div>
		</div>
	</div>

);
export default PopupEmail;