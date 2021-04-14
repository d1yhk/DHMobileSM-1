/*ppt44 천공칩 상세정보,입력,저장*/
import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';

import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";

class PopupPunch extends Component {
	
	constructor(props) {
		super(props);
		this.select_user=0;
		this.constr = [];
		this.idx = this.props.match.params.idx;
	}

	ConstSearch = async () => {
		const basic = await Promise.all([ 
			service.retrieveBuildingDetailInfo(this.idx)
		]);
		var bas = basic[0].data.result;
		$.each(bas, function(key, value){
			$(".popup_"+key).html(value);
		});

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

	}

	closeConst = () => {
		$(".punch-form").css("display","none");
	}

	componentDidMount() {
		$(".punch-form").css("display","block");
		this.ConstSearch();
	}
	render() { 
		return (
			<div className="popup punch-form">
				<div className="popup-box table">
					<h2>천공칩 정보<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div>
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
									<th>ID</th>
									<td colSpan="3" className="popup_id"></td>
								</tr>
								<tr>
									<th>시군구</th>
									<td><input type="text" className="popup_siNm readonly" readOnly/></td>
									<th>법정동</th>
									<td><input type="text" className="popup_bjdNm readonly" readOnly /></td>
								</tr>
								<tr>
									<th>작업일</th>
									<td><input type="text" className="popup_constDate readonly" readOnly/></td>
									<th>리</th>
									<td><input type="text" className="popup_riNm readonly" readOnly/></td>
								</tr>
								<tr>
									<th>작업명</th>
									<td colSpan="3"><input type="text" className="popup_constNm" /></td>
								</tr>
								<tr>
									<th>코팅상태</th>
									<td>
										<select id="coating_detail"  className="popup_coatingNm">
										</select>
									</td>
									<th>분진여부</th>
									<td>
										<select id="dust_detail"  className="popup_dustNm">
										</select>
									</td>
								</tr>
								<tr>
									<th>부식상태</th>
									<td>
										<select id="corrosion_detail"  className="popup_corrosionNm">
										</select>
									</td>
									<th>배관두께</th>
									<td><input type="text" className="popup_pipeThick" /></td>
								</tr>
								<tr>
									<th>의견</th>
									<td colSpan="3" className="note_box"><textarea className="popup_note"></textarea></td>
								</tr>
								<tr>
									<th>최초입력일시</th>
									<td><input type="text" className="popup_crtDt readonly" readOnly /></td>
									<th>최초입력자</th>
									<td><input type="text" className="popup_crtUsrNm readonly" readOnly/></td>
								</tr>
								<tr>
									<th>최종수정일시</th>
									<td><input type="text" className="popup_updDt readonly" readOnly/></td>
									<th>최종수정자</th>
									<td><input type="text" className="popup_updUsrNm readonly" readOnly/></td>
								</tr>
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
export default PopupPunch;