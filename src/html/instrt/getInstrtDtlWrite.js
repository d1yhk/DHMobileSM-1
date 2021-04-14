
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon10 from '../../image/icon10.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class getInstrtDtlWrite extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/getInstrtDtlWrite/'+this.props.match.params.pushSeq+'/'+this.props.match.params.mgrIdUser){
			config.back.url.push('/getInstrtDtlWrite/'+this.props.match.params.pushSeq+'/'+this.props.match.params.mgrIdUser);
		}
		config.detail_file.index=this.props.match.params.pushSeq;
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
	
			const common = await Promise.all([ 
				service.getInstrtDtl(this.props.match.params.pushSeq, this.props.match.params.mgrIdUser)
			]);
			
			var result = common[0].data.result;

			$.each(result, function(key, value){
				if(key === "actDt" || key === "actText"){
					$("."+key).val(value);
				}else{
					$("."+key).html(value);
				}
			});
			if(result.actDt !== undefined){
				this.setState({startDate : new Date(result.actDt)})
			}
	
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}


	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "상황조치";
		$(".header_title").html( "상황조치");

		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>지시이력 상세</h2>
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
									<th>지시일련번호</th>
									<td className="pushSeq"></td>
									<th>담당자</th>
									<td className="mrgIdUserNm "></td>
								</tr>
								<tr>
									<th>지시제목</th>
									<td className="intTitle"></td>
									<th>상태</th>
									<td className="intActStateNm"></td>
								</tr>
								<tr>
									<th className="h200px">지시내용</th>
									<td className="h200px intText"></td>
									<th className="h200px">처리내용</th>
									<td className="h200px"><textarea className="actText"></textarea></td>
								</tr>
								<tr>
									<th>지시일</th>
									<td className="intDt"></td>
									<th>처리일</th>
									<td className="actDt">
											<DatePicker
												 locale="ko" 
												id="actDt"
												className="datepicker actDt"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
									</td>
								</tr>
							</tbody>
							</table>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default getInstrtDtlWrite;