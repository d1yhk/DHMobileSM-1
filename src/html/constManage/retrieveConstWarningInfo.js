/*global hwindow*/
import React, { Component } from 'react';

import * as config from '../../components/config';
import PopupEmail from '../../components/PopupEmail';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import footer_email from '../../image/footer_email.png';
import btn_save from '../../image/btn-save.png';
import btn_remove from '../../image/btn-remove.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

  
registerLocale('ko', ko);

class retrieveConstWarningInfo extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveConstWarningInfo/'+this.props.match.params.idx){
			config.back.url.push('/retrieveConstWarningInfo/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
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
			const common = await Promise.all([ service.getDetail() ]);
			
			var result = common[0].data.result;
			
			config.table_details.info = result;
			
			//console.log(config.table_details.info);
			$.each(result, function(key, value){
				if(typeof $("."+key).val() !== undefined){
					$("."+key).val(value);
				}
				if(typeof $("."+key).html() !== undefined){
					$("."+key).html(value);
				}
			});
			config.setWindowHeight();

			if(config.table_details.info.dtIssue !== undefined){
				this.setState({startDate : new Date(config.table_details.info.dtIssue)})
			}
		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	btnSave = async () => { 
		var data = {
			idConst: config.table_details.info.idConst,
			warningNo: config.table_details.info.warningNo,
			//warningSeq: config.table_details.info.warningSeq,
			cdCom: config.table_details.info.cdCom,
			noEmpDir: config.table_details.info.noEmpDir,
			dtIssue: $("#dtIssue").val(),
			nmReceive:  $("#nmReceive").val(),
			idIssue:  $("#idIssue").val(),
			nmMan:  $(".nmMan").html(),
			nmSend:  $("#nmSend").val()

		}
		var parameter2 = [];
		var kk=1;
		var cRslt = '';
		$(".checkbox2 input").each(function(){
			cRslt = '';
			if($(this).prop("checked") === true){
				cRslt = '1';
			}
			parameter2.push({
				checkCode: 'WMC00'+kk,
				checkRslt: cRslt,
				note: ''
			});
			kk++;
		});

		data['checkList'] = parameter2;
		const save = await Promise.all([service.createConstWarning(data)]);
		if(save[0].data.code==="1"){
			$(".none1").removeClass("none");
			$(".none2").addClass("none");

			$("#nmReceive").addClass("readonly");
			$("#nmReceive").prop("readonly",true);

			$("#dtIssue").css("display","none");
			$("#dtIssue").parent().append('<input type="text" class="readonly date-view" readonly value="'+($("#dtIssue").val())+'" />');

			$(".checkbox2 input").each(function(){
				$(this).click(function(){
					return false;
				})
			});
		}
		alert(save[0].data.message);
	}
	btnRemove = async () => { 
		const save = await Promise.all([service.deleteConstWarning(config.table_details.info.idConst,config.table_details.info.warningSeq)]);
		if(save[0].data.code==="1"){
			$(".none1").addClass("none");
			$(".none2").removeClass("none");

			$("#nmReceive").removeClass("readonly");
			$("#nmReceive").prop("readonly",false);

			$("#dtIssue").css("display","block");
			$("#dtIssue").parent().find(".date-view").remove();

			$(".checkbox2 input").each(function(){
				$(this).off("click");
			});
		}

		alert(save[0].data.message);

	}
	btnEmail = () => { 
		$(".popup").css("display","none");
		$(".email-form").css("display","block");
	}
	userEmail = async () => { 
		const user = await Promise.all([service.retrieveMailUserInfo({idUser:config.user.id})]);
		
		
		console.log(user);
		if(user[0].data.result != null){
			$(".mailReceive").val( user[0].data.result.mailAddress );
			$("#nmSend").val( user[0].data.result.mailAddress );
		}
	}
	sendEmail = async () => { 
		var data = {
			idConst:config.table_details.info.idConst,
			warningSeq:config.table_details.info.warningSeq,
			idUser:config.user.id,
			mailReceive:$(".email-form .userEmail").val(),
			warningTitle:$(".email-form .warningTitle").val(),
			note:$(".email-form .note").val()
		};
		const save = await Promise.all([service.createConstWarningMail(data)]);
//		console.log("메일");
//		console.log(save);
		alert(save[0].data.message);
	}
	componentDidMount() {
		



		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공사관리";
		$(".header_title").html( "공사관리");

		config.detail_file.param="idConst";
		config.detail_file.folder1="constManage";
		config.detail_file.folder2="ConstController";
		config.detail_file.name="retrieveConstWarningInfo";
		this.fetchDetail();
		this.userEmail();
	}

	userSign1 = async (type) => {
		//alert(0);
		//var gbFile = 'GIS_SIGN_01';
		//var cdKey1 = '20200051';
		//var cdKey2 = 'DHGAS-20210022';


		var gbFile = 'GIS_SIGN_0'+type;
		var noFile = '';
		var cdKey1 = config.table_details.info.idConst;
		var cdKey2 = config.table_details.info.warningSeq;
		var cdKey3 = '';
		var cdKey4 = '';

		try {
			const imgs = await Promise.all([service.downloadSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4)]);
//			console.log(imgs);

			var img = (service.url + imgs[0].data.result.imgsrc);
			//alert(img);

			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,img);
		} catch(err){
			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,"");
		}
	}

	render() { 
		return (
			<div className="contents">
				<PopupEmail onClick={this.sendEmail} />
				<div className="detail">
					<div className="tab tab1">
						<h2>주의장 발급</h2>
					</div>
					<div className="wrap">
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
							<tbody>
								<tr>
									<th>NO</th>
									<td colSpan="3" className="idConst"></td>
									<th>수신</th>
									<td ><input type="text" id="nmSend" className="readonly" readOnly/></td>
								</tr>
								<tr>
									<th>공사명</th>
									<td colSpan="3" className="nmConst"></td>
									<th>공사기간</th>
									<td className="two-date"><span className="dtDigFr"></span><span>~</span><span className="dtDigTo"></span></td>
								</tr>
								<tr>
									<th>시공업체</th>
									<td className="nmCom"></td>
									<th>현장소장</th>
									<td className="nmMan"></td>
									<th>공사감독</th>
									<td className="nmEmpDir"></td>
								</tr>
								<tr>
									<th>발급일자</th>
									<td className="form_date">
											<DatePicker
												 locale="ko" 
												id="dtIssue"
												className="datepicker"
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
									<th>접수자</th>
									<td className="user_search"><input type="text" id="nmReceive"/><button type="button" onClick={()=>this.userSign1(1)}>서명</button></td>
									<th>발급자</th>
									<td className="user_search"><input type="text" id="idIssue" className="readonly" readOnly value={config.user.name}/><button type="button" onClick={()=>this.userSign1(2)}>서명</button></td>
								</tr>
								<tr>
									<th>위반사항</th>
									<td colSpan="5" className="checkbox2">
										<label><input type="checkbox" value="1" /><strong></strong><span>정당한 사유없이 착공지연 및 회사의 지시사항을 불 이행 시</span></label>
										<label><input type="checkbox" value="1" /><strong></strong><span>공사의 진척사항 등 공사관련 제출서류가 지연될 경우</span></label>
										<label><input type="checkbox" value="1" /><strong></strong><span>현장에서 음주 및 도박 행위 시</span></label>
										<label><input type="checkbox" value="1" /><strong></strong><span>공사현장에서 1주일이상 입원치료를 요하는 사고가 발생한 경우</span></label>
										<label><input type="checkbox" value="1" /><strong></strong><span>행정기관으로부터 시정명령을 받았을 때</span></label>
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
						<button type="button" onClick={() => this.btnRemove()} className="none1 none" ><img alt="" src={btn_remove} width="15" height="15" />삭제</button>
						<button type="button" onClick={() => this.btnSave()} className="none2" ><img alt="" src={btn_save} width="15" height="15" />저장</button>
						<button type="button" onClick={() => this.btnEmail()} className="none1 none"><img alt="" src={footer_email} width="15" height="15" />이메일발송</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveConstWarningInfo;