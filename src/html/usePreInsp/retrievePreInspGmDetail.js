import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import btn_carmera from '../../image/btn_carmera.png';
import btn_save from '../../image/btn-save.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrievePreInspGmDetail extends Component {
	constructor(props) {
		super(props);
		console.log(this.props.match.params);
		if(config.back.url[config.back.url.length-1] !== '/retrievePreInspGmDetail/'+this.props.match.params.noCust+'/'+this.props.match.params.nmCust+'/'+this.props.match.params.grdGmNm+'/'+this.props.match.params.ynExist+'/'+this.props.match.params.nmUse){
			config.back.url.push('/retrievePreInspGmDetail/'+this.props.match.params.noCust+'/'+this.props.match.params.nmCust+'/'+this.props.match.params.grdGmNm+'/'+this.props.match.params.ynExist+'/'+this.props.match.params.nmUse);
		}
		this.state = {
				startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.infos={};
	}

	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}

  //정보
	fetchDetail = async () => { 
		if( this.props.match.params.ynExist ==='Y'){
			const contents = await Promise.all([ 
				service.retrievePreInspGmDetail(this.props.match.params.noCust,this.props.match.params.nmCust,this.props.match.params.grdGmNm,this.props.match.params.ynExist,this.props.match.params.nmUse)
			]);
			this.infos=contents[0].data.result;
			console.log(this.infos);
			
			$(".grdGm").val(this.infos.grdGm);
			this.onRate();
			$(".cdMakerVc").val(this.infos.cdMakerVc);
			$(".gbGm").val(this.infos.gbGm);
			$(".tyGm").val(this.infos.tyGm);
			$(".yhGm").val(this.infos.yhGm);
			$(".yyMade").val(this.infos.yyMade);
			//this.setState({startDate:new Date(this.infos.yyMade)});
			$(".plcGm").val(this.infos.plcGm);
			$(".noMachinGm").val(this.infos.noMachinGm);
			
			if(this.infos.imgPath !==''){
				$(".barcode_img img").attr("src", this.infos.imgPath);
			}
			
		}
		

	}
	onSave = async () => { 
		var noCust = this.props.match.params.noCust;
		var nmGm = this.props.match.params.nmCust;
		var nmUse = this.props.match.params.nmUse;
		var grdGm = $(".grdGm").val();
		var cdMoel = $(".cdMoel").val();
		var cdMakerVc = $(".cdMakerVc").val();
		var gbGm = $(".gbGm").val();
		var tyGm = $(".tyGm").val();
		var yhGm = $(".yhGm").val();
		var yyMade = $(".yyMade").val();
		var plcGm = $(".plcGm").val();
		var cdModel = $(".cdModel").val();
		var noMachinGm = $(".noMachinGm").val();
		const save = await Promise.all([ 
			service.savePreInspGmInfo(noCust,nmGm,nmUse,grdGm,cdMoel,cdMakerVc,gbGm,tyGm,yhGm,yyMade,plcGm,cdModel,noMachinGm)
		]);
		alert(save[0].data.message);

		console.log(save);
		
	}
	onRate = () => { 
		//var cdModel = {"3":"020","4":"030","6":"040","10":"050","16":"060","25":"070","40":"074","65":"076","100":"080","160":"084","250":"086","400":"088","650":"110","1000":"120","1600":"130","2500":"140","4000":"160"};
		var grd = $(".grdGm option:selected").attr("data-filter");
		
		$(".cdModel option").attr("selected", false);
		// 등급값에 따른 모델변경
		switch(grd){
			case "1" : $(".cdModel").val("020");
					  break;
			case "2" : $(".cdModel").val("030");
					  break;
			case "3" : $(".cdModel").val("040");
					  break;
			case "4" : $(".cdModel").val("050");
					  break;
			case "5" : $(".cdModel").val("060");
					  break;
			default  : $(".cdModel").val("");
					  break;
			}
		//$(".cdModel option:eq("+(grd-1)+")").attr("selected", true);
	}

	fetchCommon = async (feature,type,id,filter) => { 
		if(config.grpifm.form[feature+'_'+type+"_"+filter] !== undefined && config.grpifm.form[feature+'_'+type+"_"+filter].length > 0 ){
			var result = config.grpifm.form[feature+'_'+type+"_"+filter];
			var selected = '';
			for(var count = 0; count < result.length; count++){
				selected = '';
				if(config.grpifm.search[id] === result[count].lcode){
					selected = ' selected';
				}
				$("#"+id).append(("<option value=\""+result[count].lcode+"\" "+selected+" data-filter=\""+result[count].filter+"\">"+result[count].lvalue+"</option>"));
			}
		}else{
			const common = await Promise.all([service.getCommon(feature,type,filter)]);
			var result = common[0].data.result;
			config.grpifm.form[feature+'_'+type+"_"+filter] = result;
			for(var count = 0; count < result.length; count++){
				$("#"+id).append(("<option value=\""+result[count].lcode+"\" data-filter=\""+result[count].filter+"\">"+result[count].lvalue+"</option>"));
			}
		}
	}

	componentDidMount() {
		this.fetchCommon("바코드", "등급", "grdGm");
		this.fetchCommon("ERP", "CG_C_00105", "cdModel");
		this.fetchCommon("바코드", "제조사", "cdMakerVc");
		this.fetchCommon("ERP", "CG_C_00009", "gbGm");
		this.fetchCommon("바코드", "타입", "tyGm");
		this.fetchCommon("바코드", "유형", "yhGm");
		this.fetchCommon("ERP", "CG_C_00025", "plcGm");
		
		setTimeout(function(){
			$(".plcGm").val("2");
		},500);
		this.fetchDetail();
	}
	onBarcode= () => { 
		window.Android.onBarcode($(".barcode_nocust").val(),config.user.id,config.user.token2)
	}
	render() {
		return (
			<div className="contents">
				<input type="hidden" value={this.props.match.params.noCust} className="barcode_nocust" />
				<div className="detail">
					<div className="tab tab1">
						<h2>바코드/사진등록</h2>
					</div>
					<div className="wrap">
						<div className="barcode">
							<div className="w50p">
								<h2>바코드 등록 <span>{(this.props.match.params.ynExist=='Y') ? this.props.match.params.nmCust+' - '+this.props.match.params.grdGmNm : this.props.match.params.nmCust}</span>
									<button type="button" className="onBarcode" onClick={this.onBarcode}><img src={btn_carmera} width="15" height="15" />촬영</button>
								</h2>
								<div className="barcode_img">
									<img src="" width="100%" alt="no image"/>
								</div>
							</div>
							<div className="w50p">
								<h2>바코드 정보<button type="button" onClick={this.onSave}><img src={btn_save} width="15" height="15" />저장</button></h2>
								<div className="table info">
									<table>
										<colgroup>
											<col width="90px"/>
											<col width="*"/>
											<col width="90px"/>
											<col width="*"/>
										</colgroup>
										<tr>
											<th>등급</th>
											<td>
												<select className="grdGm" id="grdGm" onChange={this.onRate}></select>
											</td>
											<th>모델</th>
											<td>
												<select className="cdModel" id="cdModel"></select>
											</td>
										</tr>
										<tr>
											<th>제조사</th>
											<td>
												<select className="cdMakerVc" id="cdMakerVc"></select>
											</td>
											<th>형식</th>
											<td>
												<select className="gbGm" id="gbGm"></select>
											</td>
										</tr>
										<tr>
											<th>타입</th>
											<td>
												<select className="tyGm" id="tyGm"></select>
											</td>
											<th>유형</th>
											<td>
												<select className="yhGm" id="yhGm"></select>
											</td>
										</tr>
										<tr>
											<th>제조년도</th>
											<td>
												<DatePicker
													 locale="ko" 
													id="yyMade"
													className="datepicker yyMade"
													selected={this.state.startDate}
													onChange={this.startDateChange}
													//showMonthYearPicker
													showYearPicker
													dateFormat="yyyy"
													yearItemNumber={9}
												/>
											</td>
											<th>설치위치</th>
											<td>
												<select className="plcGm" id="plcGm"></select>
											</td>
										</tr>
										<tr>
											<th>기물번호</th>
											<td colSpan="3">
												<input type="text" className="barcodeNum noMachinGm"/>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>

					</div>
				</footer>
			</div>
		)
	}
	
}

export default retrievePreInspGmDetail;