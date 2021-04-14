/*global hwindow*/
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";
import btnback from '../../image/btn_back.png';
import btn_save from '../../image/btn-save.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveDangerWorkEdu extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveDangerWorkEdu/'+this.props.match.params.idWork){
			config.back.url.push('/retrieveDangerWorkEdu/'+this.props.match.params.idWork);
		}
		config.detail_file.index=this.props.match.params.idWork;
		this.state = {
				startDate: null
		};
		this.infos = {};
		this.startDateChange = this.startDateChange.bind(this);
  }
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}
	//상세정보
	fetchDetail = async () => { 
		const common1 = await Promise.all([ 
			service.retrieveDangerWorkEdu(this.props.match.params.idWork)
		]);
		
		this.infos = common1[0].data.result[0];
		$.each(common1[0].data.result[0], function(key, value){
			if(key==="dtEduM" || key==="dtEduH" || key==="dtEduD" || key==="plcEdu" ){
				$("."+key).val(value);
			}
			if( key==="gbWork" ){
				$(".checkbox2 input").each(function(){
					if($(this).val() === value){
						$(this).prop("checked", true);
					}
				});
			}
		});
		if(result!==undefined){
			if(result.dtEduD !== undefined){
				this.setState({startDate : new Date(result.dtEduD)})
			}
		}

		const common2 = await Promise.all([ 
			service.retrieveDangerWorkEduList(this.props.match.params.idWork)
		]);
		
		var i=0; 
		var td = '';
		var result = common2[0].data.result;
		for(i=0; i < result.length; i++){
			td += '<tr>';
			td += '<td data-seq="'+result[i].seq+'" data-nofile="'+((result[i].noFile) ? result[i].noFile : '')+'"><input type="text" value="'+result[i].position+'"  /></td>';
			td += '<td><input type="text" value="'+result[i].nmWorker+'" /></td>';
			td += '<td class="user_search"><button type="button" class="user_sign">서명</button></td>';
			td += '<td>'+result[i].seq+'</td>';
			td += '<td><input type="text" value="'+((result[i].nmFacil) ? result[i].nmFacil : '')+'" /></td>';
			td += '<td><input type="text" value="'+((result[i].status) ? result[i].status : '')+'" /></td>';
			td += '<td><input type="text" value="'+((result[i].bigo) ? result[i].bigo : '')+'" /></td>';
			td += '</tr>';
		}

		td += '<tr>';
		td += '<td data-seq="'+(i+1)+'" data-nofile=""><input type="text" /></td>';
		td += '<td><input type="text"  /></td>';
		td += '<td class="user_search"><button type="button" class="user_sign">서명</button></td>';
		td += '<td>'+(i+1)+'</td>';
		td += '<td><input type="text" /></td>';
		td += '<td><input type="text" /></td>';
		td += '<td><input type="text" /></td>';
		td += '</tr>';

		$(".edulist tbody").html(td);

		config.setWindowHeight();
	}

	//저장
	btnSave = async () => {
		var idWork = this.props.match.params.idWork;
		var dtEduD = $("#dtEduD").val();
		var dtEduH = $("#dtEduH").val();
		var dtEduM = $("#dtEduM").val();
		var plcEdu = $("#plcEdu").val();
		if(dtEduD === ""){
			alert("교육날짜를 선택하세요");
			return;
		}
		if(plcEdu === ""){
			alert("교육장소를 작성하세요");
			return;
		}

		if(window.confirm("저장 하시겠습니까?")){
			var gbWork = 10;
			var eduList = [];
			$(".edulist tbody tr").each(function(){
				if($(this).find("input:eq(1)").val()!==''){
					eduList.push( {seq:$(this).find("td:eq(3)").html(),position:$(this).find("input:eq(0)").val(),nmWorker:$(this).find("input:eq(1)").val(),nmFacil:$(this).find("input:eq(2)").val(),status:$(this).find("input:eq(3)").val(),bigo:$(this).find("input:eq(4)").val()} );
				}
			});
			var data = {idWork:idWork,dtEduD:dtEduD,dtEduH:dtEduH,dtEduM:dtEduM,plcEdu:plcEdu,gbWork:gbWork,eduList:eduList}
			const save = await Promise.all([ 
				service.createDangerWorkEdu(data)
			]);
			alert(save[0].data.message);
		}
	}

	userSign = async (nofile,seq) => {
		var gbFile = 'GIS_EDU_01';
		var noFile = nofile;
		var cdKey1 = this.props.match.params.idWork;
		var cdKey2 = seq;
		var cdKey3 = '';
		var cdKey4 = '';
		try {
			const imgs = await Promise.all([service.downloadSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4)]);
			var img = (service.url + imgs[0].data.result.imgsrc);

			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,img);
		} catch(err){
			window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,"");
		}

	}

	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");

		this.fetchDetail();

		$("#dtEduM").html("");
		var j= "0"
		for(var i = 0; i < 60; i++){
			if(i < 10){
				j = "0"+i;
			}else{
				j= i;
			}
			$("#dtEduM").append('<option value="'+j+'">'+j+'분</option>');
		}

		var t = this;
		$(document).off("click",".user_sign");
		$(document).on("click",".user_sign",function(){
			t.userSign($(this).parent().parent().find("td:eq(0)").attr("data-nofile"),$(this).parent().parent().find("td:eq(0)").attr("data-seq"))
			//hwindow.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2);
		});
		
	}
	EduAdd = () =>{
		var cl = $(".edulist tbody tr").last().clone();
		var cn = parseInt(cl.find("td:eq(3)").html()) + 1;
		cl.find("td:eq(3)").html(cn);
		$(".edulist tbody").append(cl);
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>위험작업전 안전교육 실시 기록부</h2>
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
										<th>교육일시</th>
										<td className="work_date">
											<DatePicker
												 locale="ko" 
												id="dtEduD"
												className="datepicker dtEduD"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
											<select id="dtEduH" style={{marginLeft:'15px'}}>
												<option value="06">06시</option>
												<option value="07">07시</option>
												<option value="08">08시</option>
												<option value="09">09시</option>
												<option value="10">10시</option>
												<option value="11">11시</option>
												<option value="12">12시</option>
												<option value="13">13시</option>
												<option value="14">14시</option>
												<option value="15">15시</option>
												<option value="16">16시</option>
												<option value="17">17시</option>
												<option value="18">18시</option>
												<option value="19">19시</option>
												<option value="20">20시</option>
											</select>
											<select id="dtEduM">
											</select>
										</td>
										<th>교육장소</th>
										<td><input type="text" className="plcEdu" id="plcEdu"/></td>
									</tr>
									<tr>
										<th>위험직업 구분</th>
										<td colSpan="3" className="checkbox2 inline2">
											<label><input type="radio" name="gbWork" value="10" /><strong></strong><span>연결작업</span></label>
											<label><input type="radio" name="gbWork" value="20" /><strong></strong><span>천공작업</span></label>
											<label><input type="radio" name="gbWork" value="30" /><strong></strong><span>퍼지작업</span></label>
											<label><input type="radio" name="gbWork" value="40" /><strong></strong><span>화기작업</span></label>
											<label><input type="radio" name="gbWork" value="50" /><strong></strong><span>보수작업</span></label>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box table edulist">

							<table >
								<colgroup>
									<col width="120"/>
									<col width="120"/>
									<col width="80"/>
									<col width="80"/>
									<col width="auto"/>
									<col width="100"/>
									<col width="200"/>
								</colgroup>
								<thead>
									<tr>
										<th colSpan="3" className="edu_add">작업수행자<button type="button" onClick={this.EduAdd}>추가</button></th>
										<th colSpan="4" className="edu_add">필요장비 및 공구 준비사항<button type="button"  onClick={this.EduAdd}>추가</button></th>
									</tr>
									<tr>
										<th>직책</th>
										<th>성명</th>
										<th><button type="button">버튼</button></th>
										<th>No</th>
										<th>장비(공구명)</th>
										<th>상태</th>
										<th>비고</th>
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
						<button type="button" onClick={this.btnSave}><img alt="" src={btn_save} width="15" height="15" />저장</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveDangerWorkEdu;