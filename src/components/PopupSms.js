import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import btn_send from '../image/btn_send.png';
import $ from "jquery";


class PopupSms extends Component {
	
	constructor(props) {
		super(props);

	}

	

	componentDidMount() {


	}
//const PopupUser = () => (
	render() { 
		return (

				<div className="popup email-form sms-form">
					<div className="popup-box table">
						<h2>개선권고서 SMS발송<button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div className="popupContents" >
							<div id="popupForm">
								<div className="div_table div_email _03">
									<form autoComplete="off" className="form_memo">

										<div className="div_tr">
											<label>연락처</label>
											<div className="div_td div_row1"><input type="number" className="sms_number"/></div>
										</div>
										<div className="div_tr h130">
											<label>내용</label>
											<div className="div_td div_row1"><textarea className="sms_message"></textarea></div>
										</div>
									</form>
								</div>
								<div className="popup_btn">
									<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16" alt=""/>닫기</button>
									<button type="button" className="btn_mail smsSend"><img src={btn_send} width="19" height="16" alt=""/>발송</button>
								</div>
							</div>
						</div>
					</div>
				</div>
		);
	}
}
export default PopupSms;