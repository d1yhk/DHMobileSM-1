/*global hwindow*/
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
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

class retrieveDigworkAgrmtDoc extends Component {
  constructor(props) {
    super(props);
		//if(config.back.url[config.back.url.length-1] !== '/retrieveDigworkAgrmtDoc/'+this.props.match.params.jupno){
		//	config.back.url.push('/retrieveDigworkAgrmtDoc/'+this.props.match.params.jupno);
		//}
		
		this.state = {
			agrmtDtDate: null,
			//agrmtStdtDate: new Date(),
			//agrmtEndttDate: new Date(),
			agrmtStdtDate: null,
			agrmtEndttDate: null,
			eduDt: null
		};
		this.agrmtDtDateChange = this.agrmtDtDateChange.bind(this);
		this.agrmtStdtDateChange = this.agrmtStdtDateChange.bind(this);
		this.agrmtEndttDateChange = this.agrmtEndttDateChange.bind(this);
		this.eduDtChange = this.eduDtChange.bind(this);

		this.link1 = "/retrieveDigworkDetail/"+this.props.match.params.jupno;
		this.link2 = "/retrieveDigworkPatrol/"+this.props.match.params.jupno;
		this.link3 = "/retrieveDigworkAgrmtDoc/"+this.props.match.params.jupno

		this.dlist1 = -1;
		this.dlist1_list = [];
		this.dlist2 = -1;
		this.dlist2_list = [];
		this.dlist3 = -1;
		this.dlist3_list = [];
		this.dlist4 = -1;
		this.dlist4_list = [];
		
  }
	agrmtDtDateChange(date) { this.setState({ agrmtDtDate: date }); }
	agrmtStdtDateChange(date) { this.setState({ agrmtStdtDate: date }); }
	agrmtEndttDateChange(date) { this.setState({ agrmtEndttDate: date }); }
	eduDtChange(date) { this.setState({ eduDt: date }); }

	//모두 저장
	btnAllSave = async () => { 
		if(this.dlist1 >=0){
			if(window.confirm("모두 저장하시겠습니까?")){
				var jupno = this.props.match.params.jupno;
				var seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt;
				var chngAct = $(".chngAct").val();
				var agrmtCn = $(".agrmtCn").val();
				var etcCn = $(".etcCn").val();
				var workerComp = $("#etc_info .workerComp").val();
				var worker = $("#etc_info .worker").val();
				//var workerComp = $(".workerComp").val();
				//var worker = $(".worker").val();
				var agrmtUserId = config.user.id

				const save = await Promise.all([ 
					service.updateDigworkAgrmtDocSubInf(jupno,seqAgrmt,chngAct,agrmtCn,etcCn,workerComp,worker,agrmtUserId)
				]);
				alert(save[0].data.message);
			}
		}else{
			alert("협의 및 교육 항목을 선택해주세요.");
		}

	}
	//상세정보
	fetchDetail = async () => { 

		if(this.props.match.params.jupno !== '' ){
			const common = await Promise.all([ 
				service.retrieveDigworkAgrmtDocList(this.props.match.params.jupno)
			]);
			
			var result = common[0].data.result;

			this.dlist1_list = result;
			//console.log(result);
			var td = '';
			if(result != null){
			for(var count = 0; count < result.length; count++){
					td += '<tr>';
					td += '<td>' +  result[count].seqAgrmt  + '</td>';
					td += '<td>' + result[count].agrmtDt + '</td>';
					td += '<td>' + (result[count].agrmtNm ? result[count].agrmtNm : '') + '</td>';
					td += '<td class="text-left">' + (result[count].agrmtPlanDt ? result[count].agrmtPlanDt : '') + '</td>';
					td += '<td class="text-left">' + (result[count].note ? result[count].note : '') + '</td>';
					td += '</tr>';
			}
			if(td!==''){
				$("#dlist1_list tbody").html(td);
			}
			}
		}else{
			alert(" 리스트를 선택해주세요");
    }
    config.setWindowHeight();
	}
	
	btnNew1 = ()=>{
		$("#dlist1_list tbody tr").css({"background-color":"transparent"});
		$("#dlist1_info .agrmtDt").val("");
		$("#dlist1_info .agrmtStdt").val("");
		$("#dlist1_info .agrmtEndtt").val("");
		$("#dlist1_info .note").val("");
		$("#dlist1_info .agrmtNm").val("");
		this.dlist1 = -1;
	}
	//협의 및 교육 정보 저장
	btnSave1 = async(type)=>{
		//if(this.dlist1 < 0 ){
		//	alert("저장할 항목을 선택해주세요");
		//	return;
		//}
		if(window.confirm("저장 하시겠습니까?")){
			var jupno = this.props.match.params.jupno
			var seqAgrmt;
			var agrmtDt = $("#dlist1_info .agrmtDt").val();
			var agrmtStdt = $("#dlist1_info .agrmtStdt").val();
			var agrmtEndtt = $("#dlist1_info .agrmtEndtt").val();
			var note = $("#dlist1_info .note").val();
			var agrmtNm = $("#dlist1_info .agrmtNm").val();
			//if( type === 1 ){
				//if( this.dlist1 >= 0){
			if(this.dlist1 >= 0 ){
				seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt;
			}
				//}else{
				//	alert("수정할 항목을 선택해주세요");
				//	return;
				//}
			//}
			const save = await Promise.all([ 
				service.saveDigworkAgrmtDocInfo(jupno,seqAgrmt,agrmtDt,agrmtStdt,agrmtEndtt,note,agrmtNm)
			]);
			alert(save[0].data.message);
			this.fetchDetail();// 재조회

			this.btnNew1();	// 초기화
		}
	}
	btnRemove1 = async()=>{
		if(window.confirm("삭제 하시겠습니까?")){
			if( this.dlist1 >= 0){
				const save = await Promise.all([ 
					service.deleteDigworkAgrmtDocInfo(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt)
				]);
				alert(save[0].data.message);
				this.fetchDetail();	// 재조회

				this.btnNew1();	// 초기화
			}else{
				alert("삭제항목을 선택해주세요");
				return;
			}
		}
	}
	//리스트 선택시 다음 내용 리스트
	DigworkPipeList = async()=>{
		if( this.dlist1 >= 0){
			//1.타공사에 의해 도시가스 배관.....리스트
			$("#dlist2_list tbody").html('<tr><td colSpan="7">검색된 내용이 없습니다.</td></tr>');
			const list = await Promise.all([ 
				service.retrieveDigworkPipeList(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt)
			]);
			var result = list[0].data.result;
			this.dlist2_list = result;
			var td = '';

			for(var count = 0; count < result.length; count++){
					td += '<tr>';
					td += '<td>' +  result[count].seqPipe  + '</td>';
					td += '<td>' + result[count].facGubun + '</td>';
					td += '<td>' + (result[count].nmPressure ? result[count].nmPressure : '') + '</td>';
					td += '<td>' + (result[count].nmMaterial ? result[count].nmMaterial : '') + '</td>';
					td += '<td>' + (result[count].nmDia ? result[count].nmDia : '') + '</td>';
					td += '<td>' + (result[count].len ? result[count].len : '') + '</td>';
					td += '<td>' + (result[count].note ? result[count].note : '') + '</td>';
					td += '</tr>';
			}
			if(td!==''){
				$("#dlist2_list tbody").html(td);
			}

		}
	}
	
	DigworkPipeList2 = async()=>{
		//2,3,5항목 내용 2.공사계획 변경에....3,5 항목 같이
		const subinfo = await Promise.all([ 
			service.retrieveDigworkAgrmtDocInfo(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt)
		]);
		if(subinfo[0].data.code === "1"){
			var sub = subinfo[0].data.result;
			$(".chngAct").val(sub.chngAct);
			$(".agrmtCn").val(sub.agrmtCn);
			$(".etcCn").val(sub.etcCn);
			$("#etc_info .workerComp").val(sub.workerComp);
			$("#etc_info .worker").val(sub.worker);
			$("#etc_info .agrmtUserNm").val(sub.agrmtUserNm);
			

			//현장교육 내용
			$(".eduDt").val(sub.eduDt);
			var eduTm = sub.eduTm.split(":");
			$(".time1").val(eduTm[0]);
			$(".time2").val(eduTm[1]);
			if(sub.eduTcUserId !== undefined){
				$(".eduTcUserNm").val(sub.eduTcUserNm);
				$(".eduTcUserId").val(sub.eduTcUserId);
			}else{
				$(".eduTcUserNm").val(config.user.name);
				$(".eduTcUserId").val(config.user.id);
			}
			//하단 시공업체명/도시가스 직위 성명
			$(".eduWorkerComp").val(sub.eduWorkerComp);
			$(".eduWorkerPst").val(sub.eduWorkerPst);
			$(".eduWorker").val(sub.eduWorker);
			$(".cfUserPst").val(sub.cfUserPst);
			if(sub.eduTcUserId !== undefined){
				$(".cfUserNm").val(sub.cfUserNm);
				$(".cfUserId").val(sub.cfUserId);
			}else{
				$(".cfUserNm").val(config.user.name);
				$(".cfUserId").val(config.user.id);
			}
		}else{
			//alert(subinfo[0].data.message);
		}
	}
	DigworkPipeList3 = async()=>{
		//4번 가스공급시설의 안전조치방법
		const list2 = await Promise.all([ 
			service.retrieveDigworkSafetyActList(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt)
		]);
		var result2 = list2[0].data.result;
		this.dlist3_list = result2;
		var td2 = '';
		for(var count = 0; count < result2.length; count++){
				td2 += '<tr>';
				td2 += '<td>' +  result2[count].seqSafetyAct  + '</td>';
				td2 += '<td>' + (result2[count].reloc ? result2[count].reloc : '') + '</td>';
				td2 += '<td>' + (result2[count].tmpPipe ? result2[count].tmpPipe : '') + '</td>';
				td2 += '<td>' + (result2[count].rest ? result2[count].rest : '') + '</td>';
				td2 += '<td>' + (result2[count].stop ? result2[count].stop : '') + '</td>';
				td2 += '<td>' + (result2[count].kndChng ? result2[count].kndChng : '') + '</td>';
				td2 += '<td>' + (result2[count].etcAct ? result2[count].etcAct : '') + '</td>';
				td2 += '<td>' + (result2[count].worker ? result2[count].worker : '') + '</td>';
				td2 += '</tr>';
		}
		if(td2!==''){
			$("#dlist3_list tbody").html(td2);
		}
	}
	DigworkPipeList4 = async()=>{
		//교육 수강자
		const list3 = await Promise.all([ 
			service.retrieveDigworkEduAttenderList(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt)
		]);
		var result3 = list3[0].data.result;
		this.dlist4_list = result3;
		var td3 = '';
		for(var count = 0; count < result3.length; count++){
				td3 += '<tr>';
				td3 += '<td>' + result3[count].seqAttender + '</td>';
				td3 += '<td>' + (result3[count].attenderPst ? result3[count].attenderPst : '') + '</td>';
				td3 += '<td>' + (result3[count].attender ? result3[count].attender : '') + '</td>';
				td3 += '<td>' + (result3[count].signYn ? result3[count].signYn : '') + '</td>';
				td3 += '<td>' + (result3[count].note ? result3[count].note : '') + '</td>';
				td3 += '</tr>';
		}
		if(td3!==''){
			$("#dlist4_list tbody").html(td3);
		}
	
	}
	//1.타공사에 의해...
	btnSave2 = async(type)=>{
		if(this.dlist1 < 0){
			alert("협의정보 항목을 선택해주세요.");
			return;
		}
		if(window.confirm("저장 하시겠습니까?")){
			var jupno = this.props.match.params.jupno;
			var seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt;
			var seqPipe;
			var facGubun = $("#dlist2_info .facGubun").val();
			var pressure = $("#dlist2_info .pressure").val();
			var material = $("#dlist2_info .material").val();
			var dia = $("#dlist2_info .dia").val();
			var len = $("#dlist2_info .len").val();
			var note = $("#dlist2_info .note").val();

			if(this.dlist2 >= 0){
				seqPipe = this.dlist2_list[this.dlist2].seqPipe;
			}
			const save = await Promise.all([ 
				service.saveDigworkPipe(jupno,seqAgrmt,seqPipe,facGubun,pressure,material,dia,len,note)
			]);
			alert(save[0].data.message);
			this.DigworkPipeList();
		}
	}
	btnRemove2 = async()=>{
		if(window.confirm("삭제 하시겠습니까?")){
			if( this.dlist2 >= 0){
				const save = await Promise.all([ 
					service.deleteDigworkPipe(this.props.match.params.jupno,this.dlist2_list[this.dlist2].seqAgrmt,this.dlist2_list[this.dlist2].seqPipe)
				]);
				alert(save[0].data.message);
				if(save[0].data.code==="1"){
					this.DigworkPipeList();
				}
			}else{
				alert("삭제항목을 선택해주세요");
				return;
			}
		}
	}

	btnNew2 = ()=>{
		$("#dlist2_list tr").css({"background-color":"transparent"});
		$("#dlist2_info .facGubun").val("");
		$("#dlist2_info .note").val("");
		$("#dlist2_info .pressure").val("");
		$("#dlist2_info .material").val("");
		$("#dlist2_info .dia").val("");
		$("#dlist2_info .len").val("");
		this.dlist2 = -1;
	}

	//4.가스공급시설의 안전조치방법
	btnSave3 = async(type)=>{
		if(window.confirm("저장 하시겠습니까?")){
			var jupno = this.props.match.params.jupno
			var seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt
			var seqSafetyAct;
			var reloc = $("#dlist3_info .reloc").val();
			var tmpPipe = $("#dlist3_info .tmpPipe").val();
			var rest = $("#dlist3_info .rest").val();
			var stop = $("#dlist3_info .stop").val();
			var kndChng = $("#dlist3_info .kndChng").val();
			var etcAct = $("#dlist3_info .etcAct").val();
			var worker = $("#dlist3_info .worker").val();

			if(this.dlist3 >= 0){
				seqSafetyAct = this.dlist3_list[this.dlist3].seqSafetyAct;
			}
			const save = await Promise.all([ 
				service.saveDigworkSafetyAct(jupno,seqAgrmt,seqSafetyAct,reloc,tmpPipe,rest,stop,kndChng,etcAct,worker)
			]);
			alert(save[0].data.message);
			this.DigworkPipeList3();
			this.btnNew3();	// 초기화
		}
	}
	btnRemove3 = async()=>{
		if(window.confirm("삭제 하시겠습니까?")){
			if( this.dlist3 >= 0){
				const save = await Promise.all([ 
					service.deleteDigworkSafetyAct(this.props.match.params.jupno,this.dlist3_list[this.dlist3].seqAgrmt,this.dlist3_list[this.dlist3].seqSafetyAct)
				]);
				alert(save[0].data.message);
				if(save[0].data.code==="1"){
					this.DigworkPipeList3();
					this.btnNew3();	// 초기화
				}
			}else{
				alert("삭제항목을 선택해주세요");
				return;
			}
		}
	}
	btnNew3 = ()=>{
		$("#dlist3_list tr").css({"background-color":"transparent"});
		$("#dlist3_info .reloc").val("");
		$("#dlist3_info .tmpPipe").val("");
		$("#dlist3_info .rest").val("");
		$("#dlist3_info .stop").val("");
		$("#dlist3_info .kndChng").val("");
		$("#dlist3_info .etcAct").val("");
		$("#dlist3_info .worker").val("");
		this.dlist3 = -1;
	}
	
	//현장교육 저장
	EduInfo = async()=>{
		if(window.confirm("저장 하시겠습니까?")){
			var jupno = this.props.match.params.jupno;
			var seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt;
			var eduDt = $(".eduDt").val();
			var eduTm =  $(".time1").val()+":"+ $(".time2").val();
			var eduTcUserId = $(".eduTcUserId").val();
			var cfUserPst  = $(".cfUserPst").val();
			var cfUserId  = $(".cfUserId").val();
			var eduWorkerComp  = $(".eduWorkerComp").val();
			var eduWorkerPst  = $(".eduWorkerPst").val();
			var eduWorker  = $(".eduWorker").val();

			const save = await Promise.all([ 
				service.updateDigworkAgrmtDocEduInfo(jupno,seqAgrmt,eduDt,eduTm,eduTcUserId,cfUserPst,cfUserId,eduWorkerComp,eduWorkerPst,eduWorker)
			]);
			alert(save[0].data.message);
			// 초기화
		}

	}
	//교육 수강자
	btnSave4 = async(type)=>{
		if(window.confirm("저장 하시겠습니까?")){
			var jupno = this.props.match.params.jupno
			var seqAgrmt = this.dlist1_list[this.dlist1].seqAgrmt
			var seqAttender;
			var attenderPst  = $("#dlist4_info .attenderPst").val();
			var attender  = $("#dlist4_info .attender").val();
			var note  = $("#dlist4_info .note").val();

			if(this.dlist4 >= 0){
				seqAttender = this.dlist4_list[this.dlist4].seqAttender;
			}
			const save = await Promise.all([ 
				service.saveDigworkEduAttender(jupno,seqAgrmt,seqAttender,attenderPst,attender,note)
			]);
			alert(save[0].data.message);
			this.DigworkPipeList4();
			this.btnNew4();	// 초기화
		}
	}
	btnRemove4 = async()=>{
		if(window.confirm("삭제 하시겠습니까?")){
			if( this.dlist4 >= 0){
				const save = await Promise.all([ 
					service.deleteDigworkEduAttender(this.props.match.params.jupno,this.dlist1_list[this.dlist1].seqAgrmt,this.dlist4_list[this.dlist4].seqAttender)
				]);
				alert(save[0].data.message);
				if(save[0].data.code==="1"){
					this.DigworkPipeList4();
					this.btnNew4();	// 초기화
				}
			}else{
				alert("삭제항목을 선택해주세요");
				return;
			}
		}
	}
	btnNew4 = ()=>{
		$("#dlist4_list tr").css({"background-color":"transparent"});
		$("#dlist4_info .attenderPst").val("");
		$("#dlist4_info .attender").val("");
		$("#dlist4_info .note").val("");
		this.dlist4 = -1;
	}


	userSign = async (type1,type2) => {
		//console.log('GIS01_0'+type1+'_0'+type2);
		//console.log(this.props.match.params.jupno);
		//console.log(this.dlist1_list[this.dlist1].seqPatrol);
		
		if(this.dlist1 >= 0 ){
			var gbFile = 'GIS01_0'+type1+'_0'+type2;
			var noFile = '';
			var cdKey1 = this.props.match.params.jupno;;
			var cdKey2 = this.dlist1_list[this.dlist1].seqAgrmt;
			var cdKey3 = '';
			var cdKey4 = '';

			try {
				const imgs = await Promise.all([service.downloadSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4)]);
				var img = (service.url + imgs[0].data.result.imgsrc);

				window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,img);
			} catch(err){
				window.Android.DrawSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4,config.user.id,config.user.token2,"");
			}
		}else{
			alert("항목을 선택해주세요");
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");


		config.fetchCommon("ERP","CG_S_00008","pressure");
		config.fetchCommon("ERP","CG_F_00009","material");
		config.fetchCommon("ERP","CG_U_00024","dia");

		config.header.title = "굴착공사";
    $(".header_title").html( "굴착공사");
		
		this.fetchDetail();
		var t =this;
		$(document).off("click","#dlist1_list tbody tr");
		$(document).on("click","#dlist1_list tbody tr",function(){
			$("#dlist1_list tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			t.dlist1 = $(this).index();
			t.DigworkPipeList();
			t.DigworkPipeList2();
			t.DigworkPipeList3();
			t.DigworkPipeList4();
			var dd = $(this).find("td:eq(3)").html().split("~");
			$("#dlist1_info .agrmtDt").val($(this).find("td:eq(1)").html());
			$("#dlist1_info .agrmtStdt").val(dd[0]);
			$("#dlist1_info .agrmtEndtt").val(dd[1]);
			$("#dlist1_info .note").val($(this).find("td:eq(4)").html());
			$("#dlist1_info .agrmtNm").val($(this).find("td:eq(2)").html());
		});
		//1.타공사에 의해 도시가스...
		$(document).off("click","#dlist2_list tbody tr");
		$(document).on("click","#dlist2_list tbody tr",function(){
			$("#dlist2_list tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			t.dlist2 = $(this).index();
			console.log(t.dlist2_list[t.dlist2]);
			$("#dlist2_info .facGubun").val(t.dlist2_list[t.dlist2].facGubun);
			$("#dlist2_info .note").val(t.dlist2_list[t.dlist2].note);
			$("#dlist2_info .pressure").val(t.dlist2_list[t.dlist2].pressure);
			$("#dlist2_info .material").val(t.dlist2_list[t.dlist2].material);
			$("#dlist2_info .dia").val(t.dlist2_list[t.dlist2].dia);
			$("#dlist2_info .len").val(t.dlist2_list[t.dlist2].len);
		});
		//4.가스공급시설의 안전조치방법
		$(document).off("click","#dlist3_list tbody tr");
		$(document).on("click","#dlist3_list tbody tr",function(){
			$("#dlist3_list tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.dlist3 = $(this).index();

			$("#dlist3_info .reloc").val($(this).find("td:eq(1)").html());
			$("#dlist3_info .tmpPipe").val($(this).find("td:eq(2)").html());
			$("#dlist3_info .rest").val($(this).find("td:eq(3)").html());
			$("#dlist3_info .stop").val($(this).find("td:eq(4)").html());
			$("#dlist3_info .kndChng").val($(this).find("td:eq(5)").html());
			$("#dlist3_info .etcAct").val($(this).find("td:eq(6)").html());
			$("#dlist3_info .worker").val($(this).find("td:eq(7)").html());
		});
		//교육 수강자
		$(document).off("click","#dlist4_list tbody tr");
		$(document).on("click","#dlist4_list tbody tr",function(){
			$("#dlist4_list tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.dlist4 = $(this).index();

			$("#dlist4_info .attenderPst").val($(this).find("td:eq(1)").html());
			$("#dlist4_info .attender").val($(this).find("td:eq(2)").html());
			$("#dlist4_info .note").val($(this).find("td:eq(4)").html());
		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>굴착공사현황</h2>
					</div>
					<div className="wrap">
						<div className="box sub-tab tab3">
							<Link to={this.link1}><button type="button"><span>굴착공사현황</span></button></Link>
							<Link to={this.link2}><button type="button"><span>순회일지</span></button></Link>
							<Link to={this.link3}><button type="button" className="active"><span>협의 및 교육</span></button></Link>
						</div>
						<div className="box table">
							<table id="dlist1_list">
								<colgroup>
									<col width="80"/>
									<col width="100"/>
									<col width="150"/>
									<col width="170"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th>순번</th>
										<th>협의일자</th>
										<th>협의자</th>
										<th>협의기간</th>
										<th>비고</th>
									</tr>
								</thead>
								<tbody>
									<tr><td colSpan="6">검색된 내용이 없습니다.</td></tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">협의 및 교육 정보
							<button onClick={this.btnRemove1} className="btn-right" type="button" >삭제</button>
							<button onClick={()=>this.btnSave1(1)} className="btn-right" type="button" >저장</button>
						<button onClick={()=>this.btnNew1()} className="btn-right" type="button" >신규</button>
						</h2>
						<div className="box info">
							<table id="dlist1_info">
								<colgroup>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>협의날짜</th>
										<td className="small-date">
											<div className="date-box">
												<DatePicker
													 locale="ko" 
													id="agrmtDt"
													className="agrmtDt datepicker"
													selected={this.state.agrmtDtDate}
													onChange={this.agrmtDtDateChange}
													dateFormat="yyyy-MM-dd"
													showYearDropdown
isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
											</div>
                    					</td>
										<th>협의자</th>
										<td><input type="text" className="agrmtNm" /></td>
									</tr>
									<tr>
										<th>협의기간</th>
										<td className="small-date" colSpan="3">
											<div className="date-box">
												<DatePicker
													locale="ko" 
													id="agrmtStdt"
													className="agrmtStdt datepicker"
													selected={this.state.agrmtStdtDate}
													onChange={this.agrmtStdtDateChange}
													dateFormat="yyyy-MM-dd"
													showYearDropdown
isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
											</div>
                      						<span>~</span>
											<div className="date-box">
												<DatePicker
													locale="ko" 
													id="agrmtEndtt"
													className="agrmtEndtt datepicker "
													selected={this.state.agrmtEndttDate}
													onChange={this.agrmtEndttDateChange}
													dateFormat="yyyy-MM-dd"
													showYearDropdown
													isClearable
													showMonthDropdown
													dropdownMode="select"
													popperModifiers={{preventOverflow: { enabled: true, }, }}
												/>
											</div>
                    </td>
									</tr>
									<tr>
										<th>비고</th>
										<td colSpan="3"><input type="text" className="note" /></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box dig-box">
							<div className="wrap-head wrap-head2"><button onClick={()=>this.btnAllSave()} className="btn-right" type="button" >모두 저장</button></div>
							<h2 className="wrap-head"	>1.타공사에 의해 도시가스배관이 노출되거나 위해가 우려되는 가스공급시설의 범위
							<button onClick={this.btnRemove2} className="btn-right" type="button" >삭제</button>
							<button onClick={()=>this.btnSave2(1)} className="btn-right" type="button" >저장</button>
							<button onClick={()=>this.btnNew2()} className="btn-right" type="button" >신규</button>
							</h2>

							<div className="box info">
								<table id="dlist2_info">
									<colgroup>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
										<col width="*"/>
										<col width="100"/>
										<col width="*"/>
									</colgroup>
									<tbody>
										<tr>
											<th>가스공급시설</th>
											<td><input type="text" className="facGubun"/></td>
											<th>비고</th>
											<td colSpan="5"><input type="text" className="note" /></td>
										</tr>
										<tr>
											<th>압력</th>
											<td><select id="pressure" className="pressure"><option value="">선택해주세요</option></select></td>
											<th>재질</th>
											<td><select id="material" className="material"><option value="">선택해주세요</option></select></td>
											<th>관경(A)</th>
											<td><select id="dia" className="dia"><option value="">선택해주세요</option></select></td>
											<th>연장(m)</th>
											<td><input type="text" className="len"/></td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="box table">
								<table id="dlist2_list">
									<colgroup>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
									</colgroup>
									<thead>
										<tr>
											<th>번호</th>
											<th>가스공급시설</th>
											<th>압력</th>
											<th>재질</th>
											<th>관경</th>
											<th>연장</th>
											<th>비고</th>
										</tr>
									</thead>
									<tbody>
										<tr><td colSpan="7">검색된 내용이 없습니다.</td></tr>
									</tbody>
								</table>
							</div>
							<h2 className="wrap-head">2.공사계획 변경에 따른 조치사항</h2>
							<div className="box info memo">
								<div className="dig_memo"><textarea className="chngAct"></textarea></div>
							</div>
							<h2>3.공사 시공시 준수사항에 대한 협의내용</h2>
							<div className="box info">
								<div className="dig_memo"><textarea className="agrmtCn"></textarea></div>
							</div>
							<h2 className="wrap-head">4.가스공급시설의 안전조치방법
							<button onClick={this.btnRemove3} className="btn-right" type="button" >삭제</button>
							<button onClick={()=>this.btnSave3(1)} className="btn-right" type="button" >저장</button>
							<button onClick={()=>this.btnNew3()} className="btn-right" type="button" >신규</button></h2>

							<div className="box info">
								<table id="dlist3_info">
									<colgroup>
										<col width="140"/>
										<col width="*"/>
									</colgroup>
									<tbody>
										<tr>
											<th>이설</th>
											<td><input type="text" className="reloc"/></td>
											<th>가배관</th>
											<td><input type="text" className="tmpPipe" /></td>
											<th>복구</th>
											<td><input type="text" className="rest" /></td>
											<th>일시정지</th>
											<td><input type="text" className="stop" /></td>
										</tr>
										<tr>
											<th>관종변경</th>
											<td><input type="text" className="kndChng" /></td>
											<th>기타방호방법</th>
											<td><input type="text" className="etcAct" /></td>
											<th>방호시공자</th>
											<td colSpan="3"><input type="text" className="worker" /></td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="box table">
								<table id="dlist3_list">
									<colgroup>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
									</colgroup>
									<thead>
										<tr>
											<th>번호</th>
											<th>이설</th>
											<th>가배관</th>
											<th>복구</th>
											<th>일시정지</th>
											<th>관종변경</th>
											<th>기타방호방법</th>
											<th>방호시공자</th>
										</tr>
									</thead>
									<tbody>
										<tr><td colSpan="9">검색된 내용이 없습니다.</td></tr>
									</tbody>
								</table>
							</div>
							<h2 className="wrap-head">5. 기타 필요사항</h2>

							<div className="box info">
								<div className="dig_memo"><textarea className="etcCn"></textarea></div>
							</div>
							<div className="box info">
								<table id="etc_info">
									<colgroup>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
										<col width="*"/>
									</colgroup>
									<tbody>
										<tr>
											<th>굴착업체명</th>
											<td><input type="text" className="workerComp"/></td>
											<th>굴착담당자</th>
											<td className="user_search"><input type="text" className="worker"/><button type="button" onClick={()=>this.userSign(2,2)}>서명</button></td>
											<th>도시가스담당자</th>
											<td className="user_search"><input type="text" className="agrmtUserNm" defaultValue={config.user.name} readOnly /><button type="button" onClick={()=>this.userSign(2,1)}>서명</button></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<h2 className="wrap-head">현장교육
							<button className="btn-right" type="button" onClick={this.EduInfo} >저장</button>
						</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>교육일시</th>
										<td className="date1 form_date">
											<DatePicker
													 locale="ko" 
													id="eduDt"
													className="datepicker eduDt"
													selected={this.state.eduDt}
													onChange={this.eduDtChange}
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
													<option value='05'>05분</option>
													<option value='10'>10분</option>
													<option value='15'>15분</option>
													<option value='20'>20분</option>
													<option value='25'>25분</option>
													<option value='30'>30분</option>
													<option value='35'>35분</option>
													<option value='40'>40분</option>
													<option value='45'>45분</option>
													<option value='50'>50분</option>
													<option value='55'>55분</option>
												</select>
                    </td>
										<th>교육강사</th>
										<td><input type="text" className="eduTcUserNm" readOnly /><input type="hidden" className="eduTcUserId" /></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">교육 수강자
							<button onClick={this.btnRemove4} className="btn-right" type="button" >삭제</button>
							<button onClick={()=>this.btnSave4(1)} className="btn-right" type="button" >저장</button>
							<button onClick={()=>this.btnNew4()} className="btn-right" type="button" >신규</button>
						</h2>
						<div className="box info">
							<table id="dlist4_info">
								<colgroup>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>직위</th>
										<td><input type="text" className="attenderPst"/></td>
										<th>성명</th>
										<td className="user_search"><input type="text" className="attender" /><button type="button" onClick={()=>this.userSign(3,3)}>서명</button></td>
										<th>비고</th>
										<td><input type="text" className="note" /></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box table">
							<table id="dlist4_list">
								<colgroup>
									<col width="100"/>
									<col width="100"/>
									<col width="100"/>
									<col width="100"/>
									<col width="*"/>
								</colgroup>
								<thead>
									<tr>
										<th>번호</th>
										<th>직위</th>
										<th>성명</th>
										<th>서명여부</th>
										<th>비고</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td colSpan="6">검색된 내용이 없습니다.</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box info">
							<table>
								<colgroup>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
									<col width="100"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>시공업체명</th>
										<td><input type="text" className="eduWorkerComp"/></td>
										<th>직위</th>
										<td><input type="text" className="eduWorkerPst"/></td>
										<th>성명</th>
										<td className="user_search"><input type="text" className="eduWorker"/><button type="button" onClick={()=>this.userSign(3,2)}>서명</button></td>
									</tr>
									<tr>
										<th>도시가스</th>
										<td>대화 도시가스(주) <input type="hidden" className="cfUserId"/></td>
										<th>직위</th>
										<td><input type="text" className="cfUserPst"/></td>
										<th>성명</th>
										<td className="user_search"><input type="text" className="cfUserNm" readOnly /><button type="button" onClick={()=>this.userSign(3,1)}>서명</button></td>
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

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveDigworkAgrmtDoc;