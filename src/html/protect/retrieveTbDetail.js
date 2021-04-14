
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon7 from '../../image/icon7.png';
import icon10 from '../../image/icon10.png';
import close_x from '../../image/close_x.png';
import close from '../../image/close.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveTbDetail extends Component {
    constructor(props) {
      super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveTbDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveTbDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

			this.state = {
					startDate: '',//new Date(),
					endDate: ''//new Date()
			};
			this.startDateChange = this.startDateChange.bind(this);
			this.endDateChange = this.endDateChange.bind(this);

    }
    startDateChange(date) {
        this.setState({
            startDate: date
        });
    }
    endDateChange(date) {
        this.setState({
            endDate: date
        });
    }
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");
		config.header.title = "방식시설";
		$(".header_title").html( "방식시설");
		config.fetchCommon("전기방식","점검구분","gubun_popup");

		
		config.detail_file.param="id";
		config.detail_file.folder1="protect";
		config.detail_file.folder2="tbController";
		config.detail_file.name="retrieveTbDetail";
		this.fetchDetail();
	}
	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){
				try {	
					const common = await Promise.all([ 
						service.getDetail()
					]);
					
					
					
					var result = common[0].data.result;
					

					$.each(result, function(key, value){
						$("."+key).html(value);
					});

					config.table.p1="TESTBOX";
					config.table.p2=result.id;//$(this).find("td:eq(0)").attr("data-id");


					config.table.attach1="전기방식";
					config.table.attach2=result.idConst;//$(this).find("td:eq(5)").html();		//idConst
					config.table.attach3=result.facilNo;//$(this).find("td:eq(1)").html();		//facilNo

					config.table.param1 ="전기방식";
					config.table.param3=result.facilNo;						//facilNo

					config.detail_file.index =result.id;
					config.setWindowHeight();
				} catch(err){
					//this.props.history.goBack();

				}
			}


		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	//과년도 전위값
	prevYear = async () => { 
		$(".popup-year").css("display","block");
		$("#popupContents tbody").html("");

		
		try {	
			const common = await Promise.all([ 
				service.retrievePastTb(config.table.attach3 , $("#gubun_popup").val(), $("#yyPlnFr_poup").val(), $("#yyPlnTo_popup").val())
			]);
			
		
			$("#popupContents tbody").html("");
			var result = common[0].data.result;

			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['noTb']) ? result[count]['noTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmTb']) ? result[count]['nmTb'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmInspType']) ? result[count]['nmInspType'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq4']) ? result[count]['seq4'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq5']) ? result[count]['seq5'] : '')+'</td>';
				td = td + '<td>'+((result[count]['seq6']) ? result[count]['seq6'] : '')+'</td>';
				td = td + '</tr>';
				$("#popupContents tbody").append(td);
			}
			if(result.length === 0 || !result){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');
			}
		} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');

		}
	}
	render() { 
		return (
			<div className="contents">

				<div className="popup popup-year">
					<div className="popup-box table">
						<h2>과년도 전위값 <button type="button" className="close_popup"><img src={close} width="20" height="20" alt="" /></button></h2>
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>검사구분</label>
											<select id="gubun_popup" name="gubun_popup">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form3">
											<label>점검년도</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnFr_poup"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnTo_popup"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy"
												showYearPicker
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={this.prevYear} >검색</button>
								</fieldset>
							</form>
						</div>
						<div id="popupContents" className="martop20" >
							<table>
								<thead>
									<tr>
										<th>TB코드</th>
										<th>시설명</th>
										<th>검사구분</th>
										<th>측정일자</th>
										<th>통합전위</th>
										<th>배관전위</th>
										<th>MG전위</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
							<div className="popup_btn">
								<button type="button" className="close_popup close_x"><img src={close_x} width="16" height="16" alt="" />닫기</button>
							</div>
						</div>
					</div>
				</div>

				<div className="detail">
					<div className="tab tab1">
						<h2>전기방식 상세정보</h2>
					</div>
					<div className="wrap">
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
									<td colSpan="3" className="id"></td>
								</tr>
								<tr>
									<th>관리번호</th>
									<td className="facilNo"></td>
									<th>시설명</th>
									<td className="facilNm"></td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="facilNm"></td>
									<th>공사명</th>
									<td className="nmConst"></td>
								</tr>
								<tr>
									<th>설치일자</th>
									<td className="setbmtDt"></td>
									<th>압력</th>
									<td className="pressureNm"></td>
								</tr>
								<tr>
									<th>방식방법</th>
									<td className="corptTypNm"></td>
									<th>보호관여부</th>
									<td className="ynProtectNm"></td>
								</tr>
								<tr>
									<th>배관관경</th>
									<td className="diaNm"></td>
									<th></th>
									<td className=""></td>
								</tr>
								<tr>
									<th>준공전위(mA)</th>
									<td className="qtyElec"></td>
									<th>접합방식</th>
									<td className="gbConnNm"></td>
								</tr>
								<tr>
									<th>도로구분(포장상태)</th>
									<td className="roadClassNm"></td>
									<th>시공업체</th>
									<td className="coConstNm"></td>
								</tr>
								<tr>
									<th>점검구간</th>
									<td className="noSector1Nm"></td>
									<th>담당구역</th>
									<td className="idPipeRoadNm"></td>
								</tr>
							</tbody>
							</table>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button"  className="btn_record" onClick={() => config.RetrieveInspRslt(this.props,2)}><img alt="" src={icon10} width="15" height="15" />검사이력</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveTb','절연조인트')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_year" onClick={this.prevYear}  ><img alt="" src={icon7} width="15" height="15" />과년도 전위값</button>


					</div>
				</footer>
	
			</div>
		);
	}
}

export default retrieveTbDetail;