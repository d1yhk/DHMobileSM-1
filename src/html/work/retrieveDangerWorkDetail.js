
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import btn_save from '../../image/btn-save.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveDangerWorkDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveDangerWorkDetail/'+this.props.match.params.idWork){
			config.back.url.push('/retrieveDangerWorkDetail/'+this.props.match.params.idWork);
		}
		config.detail_file.index=this.props.match.params.idWork;
		this.state = {
				startDate: null
		};
		this.startDateChange = this.startDateChange.bind(this);
  }
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}
	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){

				const common = await Promise.all([ 
					service.getDetail()
				]);
				
				var result = common[0].data.result;

				$.each(result, function(key, value){
					if(key === "contWork" || key === "dtWork" || key === "status" ){
						$("."+key).val(value);
					}else{
						$("."+key).html(value);
					}
				});
				if(result.dtWork !== undefined){
					this.setState({startDate : new Date(result.dtWork)})
				}

			}
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}

	//안전교육
	btnSafe = async () => {
		this.props.history.push('/retrieveDangerWorkEdu/'+this.props.match.params.idWork);
	}
	//저장
	btnSave = async () => {
		if(window.confirm("저장 하시겠습니까?")){
			var dtWork = $(".dtWork").val();
			var contWork = $(".contWork").val();
			var status = $(".status").val();
			var idWork = this.props.match.params.idWork;

			const save = await Promise.all([ 
				service.updateDangerWork(dtWork, contWork, idWork, status)
			]);
			alert(save[0].data.message);
		}
	}
	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");

		config.detail_file.param="idWork";
		config.detail_file.folder1="work";
		config.detail_file.folder2="dangerWorkController";
		config.detail_file.name="retrieveDangerWorkDetail";

		config.fetchCommon("위험작업","상태","status");
		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>위험작업 상세</h2>
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
									<th>위험작업번호</th>
									<td className="idWork"></td>
									<th>법정동</th>
									<td className="bjdNm"></td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="idConst"></td>
									<th>작업구분</th>
									<td className="nmGbWork"></td>
								</tr>
								<tr>
									<th>공사명</th>
									<td colSpan="3" className="nmConst"></td>
								</tr>
								<tr>
									<th>작업명</th>
									<td className="nmWork"></td>
									<th>작업상태</th>
									<td>
										<select className="status" id="status"></select>
									</td>
								</tr>
								<tr>
									<th>시공업체</th>
									<td className="nmCoCons"></td>
									<th>작업요청일</th>
									<td className="dtWorkReq"></td>
								</tr>
								<tr>
									<th>작업요청자</th>
									<td className="nmEmpReq"></td>
									<th>작업예정일</th>
									<td className="dtWorkRsv"></td>
								</tr>
								<tr>
									<th>주관부서</th>
									<td className="nmDept"></td>
									<th>협조부서</th>
									<td className="nmDeptAdj"></td>
								</tr>
								<tr>
									<th>공사감독</th>
									<td className="nmNoEmpDir"></td>
									<th>작업일자</th>
									<td>
											<DatePicker
												 locale="ko" 
												id="dtWork"
												className="datepicker dtWork"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
									</td>
								</tr>
								<tr>
									<th>작업내용</th>
									<td colSpan="3" className="textarea"><textarea className="contWork"></textarea></td>
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
						<button type="button" onClick={this.btnSafe} ><img alt="" src={icon4} width="15" height="15" />안전교육</button>
						<button type="button" onClick={this.btnSave}><img alt="" src={btn_save} width="15" height="15" />저장</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveDangerWorkDetail','밸브')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveDangerWorkDetail;