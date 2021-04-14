/*global jMap*/
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import PopupConst from '../../components/PopupConst';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveDigworkDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveDigworkDetail/'+this.props.match.params.jupno){
			config.back.url.push('/retrieveDigworkDetail/'+this.props.match.params.jupno);
		}
		this.state = {
				dtPatrol: new Date()
		};
		this.dtPatrolChange = this.dtPatrolChange.bind(this);
		this.dig1 = -1;
		this.dig1_list = [];
		this.link1 = "/retrieveDigworkDetail/"+this.props.match.params.jupno
		this.link2 = "/retrieveDigworkPatrol/"+this.props.match.params.jupno
		this.link3 = "/retrieveDigworkAgrmtDoc/"+this.props.match.params.jupno

		this.info = {};
  }
	dtPatrolChange(date) {
			this.setState({
					dtPatrol: date
			});
	}
	//상세정보
	fetchDetail = async () => { 

		if(this.props.match.params.jupno !== '' ){
			const common = await Promise.all([ 
				service.retrieveDigworkDetail(this.props.match.params.jupno)
			]);
				
			
			
			var result = common[0].data.result;
			this.info = result;

			$.each(result, function(key, value){
				if(key === "rsltPatrol" || key === "stEocs" || key === "ynPatrol2" || key === "idConst" || key === "nmConst" || key === "cdPress" || key === "ynNoNotice" ){
					$("."+key).val(value);
				}else if(key === "gbCosnt"){
					$(".gbConst").val(value);
				}else{
					$("."+key).html(value);
				}


				
				
      });
			if(result.ynPatrol === 'N' || result.ynPatrol === undefined){
				$("#DigworkLocation input").val("");
				$("#DigworkLocation input").prop("readonly",true);
				$("#DigworkLocation input").addClass("readonly");

				$("#DigworkLocation select").addClass("readonly");
				$("#DigworkLocation select").prop("disabled",true);
				$("#DigworkLocation select:eq(0)").removeClass("readonly");
				$("#DigworkLocation select:eq(0)").prop("disabled",false);
				$("#DigworkLocation select:eq(1)").removeClass("readonly");
				$("#DigworkLocation select:eq(1)").prop("disabled",false);
				//$("#DigworkLocation select:eq(2)").removeClass("readonly");
				//$("#DigworkLocation select:eq(2)").prop("disabled",false);
			}
			this.retrieveDigworkPatrolList();
			
      config.table.attach1 = "굴착공사";
			config.table.attach3 = "";
		}else{
			alert(" 리스트를 선택해주세요");
    }


	}

	retrieveDigworkPatrolList = async () => {
		$("#dig1_list tbody").html('');
		const common2 = await Promise.all([ 
			service.retrieveDigworkPatrolList(this.props.match.params.jupno)
		]);
		
		var result2 = common2[0].data.result;
		this.dig1_list = result2;
		for(var count = 0; count < result2.length; count++){
				var td = '<tr>';
				td += '<td>' + result2[count].seqPatrol + '</td>';
				td += '<td>' + result2[count].remark + '</td>';
				td += '<td>' + result2[count].contPatrol + '</td>';
				td += '<td>' + result2[count].dtPatrol + '</td>';
				td += '<td>' + result2[count].tmPatrol + '</td>';
				td += '<td>' + result2[count].empPatrol + '</td>';
				td += '</tr>';
				$("#dig1_list tbody").append(td);
		}
		if(result2.length <= 0 ){
				$("#dig1_list tbody").html('<tr><td colSpan="6">검색 정보가 없습니다.</td></tr>');
		}

	}
	//상세정보
	saveDigworkLocation = async () => {
		const common2 = await Promise.all([ 
			service.retrieveDigworkPatrolList(this.props.match.params.jupno)
		]);
	}

	componentDidMount() {
		config.fetchCommon("ERP","CG_F_00083","stEocs");			//공사상태
		config.fetchCommon("ERP","CG_Z_00000","ynPatrol");			//입회여부
		config.fetchCommon("ERP","CG_S_00008","cdPress");			//압력구분
		config.fetchCommon("ERP","CG_S_00040","gbConst");			//공사구분
		//config.fetchCommon("ERP","CG_F_00073","ynNoNotice");			//무단굴착여부

		config.fetchCommon("ERP","CG_F_00102","rsltPatrol");			//입회결과
		//입회결과 : 공통코드(feature:ERP, gubun:CG_F_00102) 
		//config.setWindowHeight();
		config.setWindowHeightForGrid();
		

		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "굴착공사";
    $(".header_title").html( "굴착공사");
    this.fetchDetail();
		
		$(document).off("change",".ynPatrol2");
		$(document).on("change",".ynPatrol2",function(){
			$("#DigworkLocation input").prop("readonly",false);
			$("#DigworkLocation input").removeClass("readonly");
			$("#DigworkLocation select").removeClass("readonly");
			$("#DigworkLocation select").prop("disabled",false);

			if($(this).val() === 'N' || $(this).val() === ''){
				$("#DigworkLocation input").val("");
				$("#DigworkLocation input").prop("readonly",true);
				$("#DigworkLocation input").addClass("readonly");

				$("#DigworkLocation select:eq(2)").val("");
				$("#DigworkLocation select:eq(3)").val("");
				$("#DigworkLocation select:eq(4)").val("");
				$("#DigworkLocation select:eq(5)").val("");
				$("#DigworkLocation select").addClass("readonly");
				$("#DigworkLocation select").prop("disabled",true);
				$("#DigworkLocation select:eq(0)").removeClass("readonly");
				$("#DigworkLocation select:eq(0)").prop("disabled",false);
				$("#DigworkLocation select:eq(1)").removeClass("readonly");
				$("#DigworkLocation select:eq(1)").prop("disabled",false);
			}
		});
		
		var t = this;
		$(document).off("click","#dig1_list tbody tr");
		$(document).on("click","#dig1_list tbody tr",function(){
			$("#dig1_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.dig1 = $(this).index();
			$(".remark").val($(this).find("td:eq(1)").html());
			$(".contPatrol").val($(this).find("td:eq(2)").html());
			$(".dtPatrol").val($(this).find("td:eq(3)").html());

			var times = $(this).find("td:eq(4)").html().trim().split("~")
			var times1 = times[0].trim().split(":");
			var times2 = times[1].trim().split(":");
			$(".time1").val(times1[0]);
			$(".time2").val(times1[1]);
			$(".time3").val(times2[0]);
			$(".time4").val(times2[1]);

			$(".empPatrol").val($(this).find("td:eq(5)").html());
		})
	}
	//굴착현장 정보 저장
	btnSave1 = async () =>{
		if(window.confirm("저장 하시겠습니까?")){
			var jupno=this.props.match.params.jupno;
			var idConst=$(".idConst").val();
			var idConst=$(".idConst").val();
			var ynPatrol=$(".ynPatrol2").val();
			var cdPress=$(".cdPress").val();
			var rsltPatrol=$(".rsltPatrol").val();
			var gbConst=$(".gbConst").val();
			var ynNoNotice=$(".ynNoNotice").val();
			var stEocs=$(".stEocs").val();
			

			const save1 = await Promise.all([ 
				service.updateDigworkLocationInfo(jupno,idConst, ynPatrol, cdPress, rsltPatrol, gbConst, ynNoNotice, stEocs)
			]);
			alert(save1[0].data.message);

			console.log(this.info.id);
			jMap.updateFeature("굴착공사", this.info.id);
			
		}
	}

	
	//입회정보 신규
	btnNew = () => {
		$("#dig1_list tr").css({"background-color":"transparent"});
		$(".remark").val("");
		$(".contPatrol").val("");
		$(".dtPatrol").val("");
		$(".work_time").val("");
		$(".time1").val("01");
		$(".time2").val("00");
		$(".time3").val("01");
		$(".time4").val("00");
		//$(".empPatrol").val(config.user.name);
		$(".empPatrol").val("");
		this.dig1 = -1;
	}

	//입회정보 정보 저장/수정
	btnSave2 = async (type) =>{
		if(window.confirm("저장 하시겠습니까?")){
			var jupno=this.props.match.params.jupno;
			var dtPatrol=$(".dtPatrol").val();
			var tmPatrol=$(".time1").val()+":"+$(".time2").val()+" ~ "+$(".time3").val()+":"+$(".time4").val();
			var contPatrol=$(".contPatrol").val();
			var remark=$(".remark").val();
			var empPatrol=$(".empPatrol").val();
			var seqPatrol;
			//선택 되었을 경우
			if(this.dig1 >= 0){
				seqPatrol =this.dig1_list[this.dig1].seqPatrol;
			}

			const save2 = await Promise.all([ 
				service.saveDigworkPatrol(seqPatrol,jupno,dtPatrol,tmPatrol,contPatrol,remark,empPatrol)
			]);
			alert(save2[0].data.message);
			this.retrieveDigworkPatrolList();
		}

	}
	//입회정보 정보 삭제
	btnRemove2 = async () =>{
		if(this.dig1 >= 0 ){
			if(window.confirm("정말로 삭제하시겠습니까?")){
				var seqPatrol =this.dig1_list[this.dig1].seqPatrol;
				var jupno=this.props.match.params.jupno;
				const save2 = await Promise.all([ 
					service.deleteDigworkPatrol(seqPatrol,jupno)
				]);
				alert(save2[0].data.message);
				if(save2[0].data.code === "1"){
					$("#dig1_list tbody tr:eq("+this.dig1+")").remove();
				}
			}
		}else{
			alert("삭제할 항목을 선택해주세요");
		}

	}
	popupConst = (type) => {
		$(".const-form").css("display","block");
		$(".const-form").addClass("type"+type);
	}
	render() { 
		return (
			<div className="contents">
				<PopupConst  />

				<div className="detail">
					<div className="tab tab1">
						<h2>굴착공사현황</h2>
					</div>
					<div className="box sub-tab tab3">
						<Link to={this.link1}><button type="button" className="active"><span>굴착공사현황</span></button></Link>
						<Link to={this.link2}><button type="button"><span>순회일지</span></button></Link>
						<Link to={this.link3}><button type="button"><span>협의 및 교육</span></button></Link>
					</div>
					<div className="wrap">
				    <h2>EOCS 정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
							<tbody>
								<tr>
									<th>EOCS번호</th>
									<td className="jupno"></td>
									<th>EOCS상태</th>
									<td className="stateNm"></td>
									<th>작업종류</th>
									<td className="jobguNm"></td>
									<th>공사종류</th>
									<td className="locguNm"></td>
								</tr>
								<tr>
									<th>배관유무</th>
									<td className="pipyn"></td>
									<th>입회여부</th>
									<td className="ynPatrol"></td>
									<th>미입회사유</th>
									<td colSpan="3" className="gita"></td>
								</tr>
								<tr>
									<th>시작예정일</th>
									<td className="stadt"></td>
									<th>종료예정일</th>
									<td colSpan="5" className="stodt"></td>
								</tr>
								<tr>
									<th>공사시작위치</th>
									<td colSpan="3" className="staad"></td>
									<th>공사종료위치</th>
									<td className="stoad"></td>
								</tr>
								<tr>
									<th>접수일자</th>
									<td className="fstdt"></td>
									<th>굴착길이</th>
									<td className="locmt"></td>
									<th>굴착폭</th>
									<td colSpan="3" className="locwid"></td>
								</tr>
								<tr>
									<th>시행사</th>
									<td colSpan="3" className="sihnm"></td>
									<th>굴착업체</th>
									<td colSpan="3" className="comnm"></td>
								</tr>
								<tr>
									<th>굴착담당자</th>
									<td className="depnm"></td>
									<th>담당자연락처</th>
									<td className="dtel"></td>
									<th>굴착신청자</th>
									<td className="sinnm"></td>
									<th>신청자연락처</th>
									<td className="smob"></td>
								</tr>
							</tbody>
							</table>
						</div>
			    		<h2>EOCS 처리 정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="250px"/>
									<col width="140px"/>
									<col width="250px"/>
								</colgroup>
								<tbody>
									<tr>
										<th>배관유무</th>
										<td className="pipyn"></td>
										<th>전산처리자</th>
										<td><span className="pernm"></span><span className="pmob"></span></td>
										<th>현장처리자</th>
										<td><span className="worknm"></span><span className="wmob"></span></td>
									</tr>
									<tr>
										<th>표시회합</th>
										<td className="jobpr"></td>
										<th>전산처리자</th>
										<td><span className="pernm2"></span><span className="p2mob"></span></td>
										<th>현장처리자</th>
										<td colSpan="3"><span className="worknm2"></span><span className="w2mob"></span></td>
									</tr>
									<tr>
										<th>회합표시완료</th>
										<td className="gita"></td>
										<th>표시/회합일시</th>
										<td className="jobprdt"></td>
										<td colSpan="2"></td>
									</tr>
								</tbody>
							</table>
						</div>
				    	<h2 className="wrap-head">굴착현장 정보
								<button type="button" className="btn-right" onClick={this.btnSave1}>저장</button>
							</h2>
                        
						<div id="DigworkLocation" className="box info">
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
									<th>공사상태</th>
                  					<td><select id="stEocs" className="stEocs"></select></td>
									<th>입회여부</th>
									<td colSpan="3" >
										<select id="ynPatrol" className="ynPatrol2"><option value="">선택</option></select>
									</td>
								</tr>
								<tr>
									<th>공사ID</th>
									<td className="input_search">
											<input type="text" className="idConst" onClick={()=>this.popupConst(2)}/>
									</td>
									<th>공사명</th>
									<td colSpan="3" >
                                        <input type="text" className="nmConst" />
                                    </td>
								</tr>
								<tr>
									<th>압력구분</th>
                                    <td><select id="cdPress" className="cdPress"><option value="">선택</option></select></td>
									<th>입회결과</th>
									<td colSpan="3" ><select id="rsltPatrol"  className="rsltPatrol" ><option value="">선택</option></select></td>
								</tr>
								<tr>
									<th>공사구분</th>
									<td><select id="gbConst" className="gbConst"><option value="">선택</option></select></td>
									<th>무단굴착여부</th>
									<td colSpan="3" ><select id="ynNoNotice" className="ynNoNotice"><option value="">선택</option><option value="Y">Y</option><option value="N">N</option></select></td>
								</tr>
							</tbody>
							</table>
						</div>
				    <h2  className="wrap-head">입회정보
							<button type="button" className="btn-right" onClick={this.btnRemove2}>삭제</button>
							<button type="button" className="btn-right" onClick={()=>this.btnSave2(1)}>저장</button>
							<button type="button" className="btn-right" onClick={()=>this.btnNew()}>신규</button>
						</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="120px"/>
									<col width="*"/>
									<col width="120px"/>
									<col width="*"/>
								</colgroup>
							<tbody>
								<tr>
									<th>입회장소</th>
                  <td><input type="text" className="remark" /></td>
									<th>입회내용</th>
                  <td><input type="text" className="contPatrol" /></td>
								</tr>
								<tr>
									<th>입회일시</th>
                  <td className="work_date form_date _03">
                    <DatePicker
												locale="ko" 
												id="dtPatrol"
												className="datepicker dtPatrol"
												selected={this.state.dtPatrol}
												onChange={this.dtPatrolChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"

												popperModifiers={{preventOverflow: { enabled: true, }, }}
										/>

												<select className="time1">
													<option value="01">01시</option>
													<option value="02">02시</option>
													<option value="03">03시</option>
													<option value="04">04시</option>
													<option value="05">05시</option>
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
													<option value="21">21시</option>
													<option value="22">22시</option>
													<option value="23">23시</option>
												</select>
												<select className="time2">
													<option value='00'>00분</option>
													<option value='01'>01분</option>
													<option value='02'>02분</option>
													<option value='03'>03분</option>
													<option value='04'>04분</option>
													<option value='05'>05분</option>
													<option value='06'>06분</option>
													<option value='07'>07분</option>
													<option value='08'>08분</option>
													<option value='09'>09분</option>
													<option value='10'>10분</option>
													<option value='11'>11분</option>
													<option value='12'>12분</option>
													<option value='13'>13분</option>
													<option value='14'>14분</option>
													<option value='15'>15분</option>
													<option value='16'>16분</option>
													<option value='17'>17분</option>
													<option value='18'>18분</option>
													<option value='19'>19분</option>
													<option value='20'>20분</option>
													<option value='21'>21분</option>
													<option value='22'>22분</option>
													<option value='23'>23분</option>
													<option value='24'>24분</option>
													<option value='25'>25분</option>
													<option value='26'>26분</option>
													<option value='27'>27분</option>
													<option value='28'>28분</option>
													<option value='29'>29분</option>
													<option value='30'>30분</option>
													<option value='31'>31분</option>
													<option value='32'>32분</option>
													<option value='33'>33분</option>
													<option value='34'>34분</option>
													<option value='35'>35분</option>
													<option value='36'>36분</option>
													<option value='37'>37분</option>
													<option value='38'>38분</option>
													<option value='39'>39분</option>
													<option value='40'>40분</option>
													<option value='41'>41분</option>
													<option value='42'>42분</option>
													<option value='43'>43분</option>
													<option value='44'>44분</option>
													<option value='45'>45분</option>
													<option value='46'>46분</option>
													<option value='47'>47분</option>
													<option value='48'>48분</option>
													<option value='49'>49분</option>
													<option value='50'>50분</option>
													<option value='51'>51분</option>
													<option value='52'>52분</option>
													<option value='53'>53분</option>
													<option value='54'>54분</option>
													<option value='55'>55분</option>
													<option value='56'>56분</option>
													<option value='57'>57분</option>
													<option value='58'>58분</option>
													<option value='59'>59분</option>
												</select>
												<span className="pado">~</span>
												<select className="time3">
													<option value="01">01시</option>
													<option value="02">02시</option>
													<option value="03">03시</option>
													<option value="04">04시</option>
													<option value="05">05시</option>
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
													<option value="21">21시</option>
													<option value="22">22시</option>
													<option value="23">23시</option>
												</select>
												<select className="time4">
													<option value='00'>00분</option>
													<option value='01'>01분</option>
													<option value='02'>02분</option>
													<option value='03'>03분</option>
													<option value='04'>04분</option>
													<option value='05'>05분</option>
													<option value='06'>06분</option>
													<option value='07'>07분</option>
													<option value='08'>08분</option>
													<option value='09'>09분</option>
													<option value='10'>10분</option>
													<option value='11'>11분</option>
													<option value='12'>12분</option>
													<option value='13'>13분</option>
													<option value='14'>14분</option>
													<option value='15'>15분</option>
													<option value='16'>16분</option>
													<option value='17'>17분</option>
													<option value='18'>18분</option>
													<option value='19'>19분</option>
													<option value='20'>20분</option>
													<option value='21'>21분</option>
													<option value='22'>22분</option>
													<option value='23'>23분</option>
													<option value='24'>24분</option>
													<option value='25'>25분</option>
													<option value='26'>26분</option>
													<option value='27'>27분</option>
													<option value='28'>28분</option>
													<option value='29'>29분</option>
													<option value='30'>30분</option>
													<option value='31'>31분</option>
													<option value='32'>32분</option>
													<option value='33'>33분</option>
													<option value='34'>34분</option>
													<option value='35'>35분</option>
													<option value='36'>36분</option>
													<option value='37'>37분</option>
													<option value='38'>38분</option>
													<option value='39'>39분</option>
													<option value='40'>40분</option>
													<option value='41'>41분</option>
													<option value='42'>42분</option>
													<option value='43'>43분</option>
													<option value='44'>44분</option>
													<option value='45'>45분</option>
													<option value='46'>46분</option>
													<option value='47'>47분</option>
													<option value='48'>48분</option>
													<option value='49'>49분</option>
													<option value='50'>50분</option>
													<option value='51'>51분</option>
													<option value='52'>52분</option>
													<option value='53'>53분</option>
													<option value='54'>54분</option>
													<option value='55'>55분</option>
													<option value='56'>56분</option>
													<option value='57'>57분</option>
													<option value='58'>58분</option>
													<option value='59'>59분</option>
												</select>

                  </td>
									<th>입회자</th>
                  					<td><input type="text" className="empPatrol" /></td>
								</tr>
							</tbody>
							</table>
						</div>
						<div className="box info table">
							<table id="dig1_list">
								<colgroup>
									<col width="80"/>
									<col width="80"/>
									<col width="80"/>
									<col width="80"/>
									<col width="80"/>
									<col width="80"/>
								</colgroup>
								<thead>
									<tr>
										<th>순번</th>
										<th>입회장소</th>
										<th>입회내용</th>
									  	<th>입회일자</th>
										<th>점검시간</th>
										<th>입회자</th>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveDigworkDetail','굴착공사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
		{/*
						<button type="button" ><img alt="" src={icon2} width="15" height="15" />저장</button>
						<button type="button" ><img alt="" src={icon2} width="15" height="15" />메일발송</button>
						<button type="button" ><img alt="" src={icon2} width="15" height="15" />구간입력</button>
											*/}
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveDigworkDetail;