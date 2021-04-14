
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupUser from '../../components/PopupUser';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveQuarterInspDetail extends Component {
	
  constructor(props) {
    super(props);
		

		this.state = {
			startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		if(config.back.url[config.back.url.length-1] !== '/retrieveQuarterInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType){
			config.back.url.push('/retrieveQuarterInspDetail/'+this.props.match.params.cdFclt+"/"+this.props.match.params.idInsp+"/"+this.props.match.params.idInspType);
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
		if(info[0].data.code === "1"){
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
			
			config.table.p1="정압기";
			config.table.p2=result.id;
			var safety_list = info[0].data.safetyChkList;
			this.safetyListReData = safety_list;
			var safetyListRe = [];
			for(var count = 0; count < safety_list.length; count++){
				if(!safetyListRe[safety_list[count].kdInspItem]){
					safetyListRe[safety_list[count].kdInspItem] = [];
				}
				safetyListRe[safety_list[count].kdInspItem].push( safety_list[count] );
			}
			var td = '';
			var selected1='';
			var selected2='';
			var selected3='';
			Object.keys(safetyListRe).forEach(function (key) {
	//		for(var j=0; j < safetyListRe.length; j++){
				var sl = safetyListRe[key];
				td = td + '<tr>';
				td = td + '<td rowspan="2">'+sl[0].kdInspItem+'</td>';

				td = td + '<td>'+sl[0].nmInspItem+'</td>';
				td = td + '<td><input type="text" value="'+(sl[0].qtyRslt1 ? sl[0].qtyRslt1 : '')+'" /></td>';
				td = td + '<td><input type="text" value="'+(sl[0].remark ? sl[0].remark : '')+'" />';
				td = td + '<input type="hidden" value="'+sl[0].seqSort+'" />';
				td = td + '</td>';

				td = td + '<td>'+sl[2].nmInspItem+'</td>';
				td = td + '<td><input type="text" value="'+(sl[2].qtyRslt1 ? sl[2].qtyRslt1 : '')+'" /></td>';
				td = td + '<td><input type="text" value="'+(sl[2].remark ? sl[2].remark : '')+'" />';
				td = td + '<input type="hidden" value="'+sl[2].seqSort+'" />';
				td = td + '</td>';
				td = td + '</tr>';

				td = td + '<tr>';
				td = td + '<td>'+sl[1].nmInspItem+'</td>';
				td = td + '<td><input type="text" value="'+(sl[1].qtyRslt1 ? sl[1].qtyRslt1 : '')+'" /></td>';
				td = td + '<td><input type="text" value="'+(sl[1].remark ? sl[1].remark : '')+'" />';
				td = td + '<input type="hidden" value="'+sl[1].seqSort+'" />';

				td = td + '<td>'+sl[3].nmInspItem+'</td>';
				td = td + '<td><input type="text" value="'+(sl[3].qtyRslt1 ? sl[3].qtyRslt1 : '')+'" /></td>';
				td = td + '<td><input type="text" value="'+(sl[3].remark ? sl[3].remark : '')+'" />';
				td = td + '<input type="hidden" value="'+sl[3].seqSort+'" />';
				td = td + '</td>';
				td = td + '</tr>';
			});
			$("#safty_list tbody").html(td);

		}
		config.setWindowHeight();
	}

	btnSave = async () => {
		if(window.confirm("저장 하시겠습니까?")){
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
			
			//console.log(this.safetyListReData[1]['qtyRslt1']);
			var t = this;
			var tt1=0;
			var tt2=2;
			$("#safty_list tbody").find("tr").each(function(){
				var id0 = $(this).find("input:eq(2)").val();
				t.safetyListReData[(id0-1)]['qtyRslt1'] = $(this).find("input:eq(0)").val();
				t.safetyListReData[(id0-1)]['remark'] = $(this).find("input:eq(1)").val();

				var id1 = $(this).find("input:eq(5)").val();
				t.safetyListReData[(id1-1)]['qtyRslt1'] = $(this).find("input:eq(3)").val();
				t.safetyListReData[(id1-1)]['remark'] = $(this).find("input:eq(4)").val();

			});
			data['safetyChkList'] = this.safetyListReData;
			
			
			const save = await Promise.all([service.saveQuarterInspInfo(data)]);
			alert(save[0].data.message);
		}
	}

	userInfo = () =>{
		$(".user-form").css("display","block");
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

	render() { 
		return (
			<div className="contents">
				<PopupUser />
				<div className="detail">
					<div className="tab tab1">
						<h2>분기점검</h2>
					</div>
					<div className="wrap">
						<h2>정압기 MOV작동점검</h2>
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
										<td >
											<input type="hidden" className="noEmpInsp nmSelectId" />
											<input type="text" className="noEmpInspNm nmSelect readonly" readOnly  onClick={this.userInfo}/>
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
							<table id="safty_list" className="quarter_list">

								<thead>
									<tr>
										<th className="text-center">항목유형</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center">측정값(%)</th>
										<th className="text-center">비고</th>
										<th className="text-center">점검항목명</th>
										<th className="text-center">측정값(%)</th>
										<th className="text-center">비고</th>
									</tr>
								</thead>
								<tbody>

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
						<button type="button" className="btn_file" onClick={() => this.btnSave()}><img alt="" src={icon2} width="15" height="15" />저장</button>




					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveQuarterInspDetail;