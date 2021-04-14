
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupUser from '../../components/PopupUser';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

import pic_governor from '../../image/pic_governor.png';



import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveQuarterInspDetail1 extends Component {
	
  constructor(props) {
    super(props);
		

		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveQuarterInspDetail2/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveQuarterInspDetail2/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
		}
		config.detail_file.index=this.props.match.params.idx;
		
		this.safetyListReData = [];
  }

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	
	//상세정보
	fetchDetail = async () => {
		const info = await Promise.all([ 
			service.retrieveQuarterInspInfo(this.props.match.params.cdFclt,this.props.match.params.idInsp,this.props.match.params.idInspType)
		]);
			var result = info[0].data.result;
		$.each(result, function(key, value){
			if(key==="cdRslt"){
				$("."+key).val(value);
			}else{
				if(typeof $("."+key).val() !== undefined){
					$("."+key).val(value);
				}
				if(typeof $("."+key).html() !== undefined){
					$("."+key).html(value);
				}
			}
		});

		if(result.dtInsp !== undefined){
			this.setState({startDate : new Date(result.dtInsp)})
		}
		if(result.noEmpInsp === undefined){
			$(".noEmpInsp").val(config.user.id);
			$(".noEmpInspNm").val(config.user.name);
		}
		
		var td = '';
		var selected1='';
		var selected2='';
		var selected3='';

		var safety_list = info[0].data.safetyChkList;
		this.safetyListReData = safety_list;
		var safetyListRe = [];
		var checkl =[];
		for(var i=0; i < safety_list.length; i++){
			if( checkl[safety_list[i].kdInspItem] >= 1){
				checkl[safety_list[i].kdInspItem] += 1;
			}else{
				checkl[safety_list[i].kdInspItem] = 1;
			}
		}
		var prev='';

		for(var count = 0; count < safety_list.length; count++){
			td = td + '<tr>';
			if(checkl[safety_list[count].kdInspItem] >=1 && prev != safety_list[count].kdInspItem){
				td = td + '<td rowspan="'+checkl[safety_list[count].kdInspItem]+'" class="text-center">'+safety_list[count].kdInspItem+'</td>';
				prev = safety_list[count].kdInspItem;
			}
			td = td + '<td>'+safety_list[count].nmInspItem+'</td>';
			td = td + '<td><input type="text" value="'+((safety_list[count].qtyRslt1) ? safety_list[count].qtyRslt1 : '')+'" /></td>';
			td = td + '<td><input type="text" value="'+((safety_list[count].qtyRslt2) ? safety_list[count].qtyRslt2 : '')+'" /></td>';
			td = td + '<td><input type="text" value="'+((safety_list[count].qtyRslt3) ? safety_list[count].qtyRslt3 : '')+'" /></td>';
			td = td + '<td><input type="text" readonly class="readonly" value="'+((safety_list[count].avg) ? safety_list[count].avg : '')+'" /><input type="hidden" value="'+((safety_list[count].seqSort) ? safety_list[count].seqSort : '')+'" /></td>';
			td = td + '</tr>';
		}
		$("#safty_list tbody").html(td);

			config.table.p1="정압기";
			config.table.p2=result.id;
		
		config.setWindowHeight();
	}

	btnSave = async () => {
		if(window.confirm("저장 하시겠습니까?")){
	//	console.log(this.safetyListReData);

			var data = {};
			data['idInspType']= this.props.match.params.idInspType;
			if(this.props.match.params.idInsp ==="undefined"){
				data['idInsp']= "";
			}else{
				data['idInsp']= this.props.match.params.idInsp;
			}
			data['nmFclt']= $(".nmFclt").html();
			data['cdFclt']= this.props.match.params.cdFclt;
			data['dtInsp']= $(".dtInsp").val();
			data['noEmpInsp']= $(".noEmpInsp").val();
			data['noEmpInspNm']= $(".noEmpInspNm").val();
			data['cdRslt']= $(".cdRslt").val();
			data['remark']= $(".remark").val();
			
			var t = this;
			var tt1=0;
			$("#safty_list tbody").find("tr").each(function(){
				var id0 = $(this).find("input:eq(4)").val();
				t.safetyListReData[(id0-1)]['qtyRslt1'] = $(this).find("input:eq(0)").val();
				t.safetyListReData[(id0-1)]['qtyRslt2'] = $(this).find("input:eq(1)").val();
				t.safetyListReData[(id0-1)]['qtyRslt3'] = $(this).find("input:eq(2)").val();
				t.safetyListReData[(id0-1)]['avg'] = $(this).find("input:eq(3)").val();

			});
			data['safetyChkList'] = this.safetyListReData;
			const save = await Promise.all([service.saveQuarterInspInfo(data)]);
			alert(save[0].data.message);
			this.fetchDetail();
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");
		
		config.fetchCommon("점검","결과","cdRslt");

		config.table.param1="";
		config.table.param2="";
		config.table.param3="";
		config.table.attach1="";
		config.table.attach2="";
		config.table.attach3="";
		config.table.attach4="";
		this.fetchDetail();
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser />
				<div className="detail">
					<div className="tab tab1">
						<h2>분기점검</h2>
					</div>
					<div className="wrap">
						<h2>곡관부 두께측정</h2>
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
										<th>시설명</th>
										<td className="nmFclt"></td>
										<th>전 점검일</th>
										<td className="preDtInsp"></td>
									</tr>
								</tbody>
							</table>
						</div>
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
										<th>점검일자</th>
										<td className="form_date">
											<DatePicker
												 locale="ko" 
												id="dtInsp"
												className="datepicker dtInsp"
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
										<th>점검자</th>
										<td>
											<input type="hidden" className="noEmpInsp nmSelectId" />
											<input type="text"  className="noEmpInspNm nmSelect readonly" readOnly  onClick={this.userInfo}/>
										</td>
									</tr>
									<tr>
										<th>점검결과</th>
										<td><select id="cdRslt" className="cdRslt"></select></td>
										<th>메모</th>
										<td><input type="text" className="remark"/></td>
									</tr>
								</tbody>
							</table>
							<input type="hidden" className="idInsp" />
							<input type="hidden" className="idInspType" />
							<input type="hidden" className="id" />
							<input type="hidden" className="cdFclt" />
						</div>
						<h2>안전점검표</h2>
						<div className="box info">
							<div className="row_box2">
								<div className="row50">
									<img src={pic_governor} width="100%"/>
								</div>
								<div className="row50">
									<table id="safty_list">
										<thead>
											<tr>
												<th className="text-center">항목유형</th>
												<th className="text-center">점검항목명</th>
												<th className="text-center">결과값1</th>
												<th className="text-center">결과값2</th>
												<th className="text-center">결과값3</th>
												<th className="text-center">평균값</th>
											</tr>
										</thead>
										<tbody>

										</tbody>
									</table>
								</div>
								<div className="clearBoth"></div>
							</div>
						</div>


					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>




					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveQuarterInspDetail1;