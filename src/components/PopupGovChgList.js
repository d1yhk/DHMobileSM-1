import React, { Component } from 'react';
import btn_close from '../image/btn-close.png';
import btn_select from '../image/btn_select.png';
import close from '../image/close.png';
import * as service from '../services/posts';
import $ from "jquery";

class PopupGovChgList extends Component {
	
	constructor(props) {
		super(props);
		this.select_user=0;
		this.constr = [];

	}
	ConstSearch = async (search_type) => {
		var cdFclt = this.props.match.params.facilNo;
		var cdCompany = 10000;
		$("#popupContents2 tbody").html("");
		const user_list = await Promise.all([ 
			service.retrieveGovChgList(cdFclt,cdCompany)
		]);
		var result = user_list[0].data.result;
		for(var count = 0; count < result.length; count++){
			this.constr.push(result[count]);
			var td = '<tr>';
			td = td + '<td>'+(count+1)+'</td>'
			td = td + '<td>'+((result[count]['seqChg']) ? result[count]['seqChg'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>'
			td = td + '<td>'+((result[count]['dtChg']) ? result[count]['dtChg'] : '')+'</td>'
			td = td + '<td>'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>'
			td = td + '<td>'+((result[count]['fcltChg']) ? result[count]['fcltChg'] : '')+'</td>'
			td = td + '<td>'+((result[count]['modelChg']) ? result[count]['modelChg'] : '')+'</td>'
			td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
			td = td + '<td>'+((result[count]['rsnChg']) ? result[count]['rsnChg'] : '')+'</td>'
			td = td + '</tr>';
			$("#popupContents2 tbody").append(td);
		}
	}

	closeConst = () => {
		$(".gov-form").css("display","none");
	}
	componentDidMount() {

	}
//const PopupUser = () => (
	render() { 
		return (
			<div className="popup gov-form">
				<div className="popup-box table">
					<h2>정압기 변경이력조회<button type="button" onClick={this.closeConst}><img alt="" src={close} width="20" height="20" /></button></h2>
					<div id="popupHeader2" >
						<table>
							<colgroup>
								<col width="50"/>
								<col width="70"/>
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
									<th>시설명</th>
									<th>변경일자</th>
									<th>시설구분</th>
									<th>변경설비</th>
									<th>모델명</th>
									<th>시공업체</th>
									<th>변경사유</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="popupContents2">
						<table>
							<colgroup>
								<col width="50"/>
								<col width="70"/>
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
					<div className="popup_btn _02">
						<button type="button" className="close_popup close_x"><img src={btn_close} width="17" height="16"/>닫기</button>
					</div>
				</div>
			</div>
		);
	}
}
export default PopupGovChgList;