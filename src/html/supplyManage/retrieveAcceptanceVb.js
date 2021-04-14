
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import btn_save_white from '../../image/btn_save_wthie.png';


class retrieveAcceptanceVb extends Component {
  constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0 };
		if(config.back.url[config.back.url.length-1] !== '/retrieveAcceptanceVb/'+this.props.match.params.idConst){
			config.back.url.push('/retrieveAcceptanceVb/'+this.props.match.params.idConst);
		}
		this.acc = 0;

		this.list1={};
		this.list2={};
		this.list3={};
		this.list4={};
  }
	//최초 한번만
	firstInfo = async () => {
		//관경별 연장(목록)
		const common = await Promise.all([
				service.retrievePipeLenForDiaListWithAcceptanceInfo(this.props.match.params.idConst)
		]);
		
		var result = common[0].data.result;

		var td = '';
		var qtyLen = 0;

		for(var count = 0; count < result.length; count++){
				td = td + '<tr>';
				td = td + '<th>'+((result[count]['cdDia']) ? result[count]['cdDia'] : '')+'</th>';
				td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>';
				td = td + '</tr>';
				qtyLen = qtyLen + result[count]['qtyLen'];
		}
		td = td + '<tr>';
		td = td + '<th>합계</th>';
		td = td + '<td>'+qtyLen+'</td>';
		td = td + '</tr>';
		$("#accptInfo tbody").append(td);

		//시설물, 라인마크 카운트
		const common2 = await Promise.all([
				service.retrieveFacilCntWithAcceptanceInfo(this.props.match.params.idConst)
		]);
		var result2 = common2[0].data.result;
		$.each(result2, function(key, value){
				$("."+key).html(value);
		});
	}
	//상세정보
	subPage = async (pa) => {
		this.acc = pa;
		$(".accept0").css("display","none");
		$(".accept1").css("display","none");
		$(".accept2").css("display","none");
		$(".accept3").css("display","none");
		$("#accept0_con tr").removeClass("sel");
		$("#accept1_con tr").removeClass("sel");
		$("#accept2_con tr").removeClass("sel");
		$("#accept3_con tr").removeClass("sel");

		$(".accept"+pa).css("display","block");

		$(".acceptance .tab a").removeClass("active");
		$(".acceptance .tab a:eq("+pa+")").addClass("active");
		
		//밸브
		if(pa === 0){
			if($("#accept0_con tbody").html()===""){
				//밸브 목록 조회
				const common3 = await Promise.all([
						service.retrieveAcceptanceVbList(this.props.match.params.idConst)
				]);

				var result3 = common3[0].data.result;
				this.list1  =result3;
				var td3 = '';
				for(var count = 0; count < result3.length; count++){
						td3 = td3 + '<tr>';
						td3 = td3 + '<td data-id="'+result3[count]['id']+'">'+((result3[count]['seq']) ? result3[count]['seq'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['facilNo']) ? result3[count]['facilNo'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['dtSet']) ? result3[count]['dtSet'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['makeCom']) ? result3[count]['makeCom'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['pressureNm']) ? result3[count]['pressureNm'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['diaNm']) ? result3[count]['diaNm'] : '')+'</td>';
						td3 = td3 + '<td>'+((result3[count]['valveTypNm']) ? result3[count]['valveTypNm'] : '')+'</td>';
						td3 = td3 + '</tr>';
				}
				if(td3=== ''){
					$("#accept0_con tbody").html('<tr><td colspan="7">검색된 내용이 없습니다.</td></tr>');
				}else{
					$("#accept0_con tbody").html(td3);
				}
			}

		}else if(pa === 1){
			if($("#accept1_con tbody").html()===""){
				//밸브 목록 조회
				const common3 = await Promise.all([
						service.retrieveAcceptanceTbList(this.props.match.params.idConst)
				]);

				var result3 = common3[0].data.result;
				this.list2  =result3;
				var td3 = '';
				for(var count = 0; count < result3.length; count++){
            td3 = td3 + '<tr>';
            td3 = td3 + '<td data-id="'+result3[count]['id']+'">'+((result3[count]['seq']) ? result3[count]['seq'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['facilNo']) ? result3[count]['facilNo'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['facilNm']) ? result3[count]['facilNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['setbmtDt']) ? result3[count]['setbmtDt'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['coConstNm']) ? result3[count]['coConstNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['pressureNm']) ? result3[count]['pressureNm'] : '')+'</td>';
            td3 = td3 + '<td></td>';
            td3 = td3 + '<td>'+((result3[count]['qtyElec']) ? result3[count]['qtyElec'] : '')+'</td>';
            td3 = td3 + '</tr>';
				}
				if(td3=== ''){
					$("#accept1_con tbody").html('<tr><td colspan="8">검색된 내용이 없습니다.</td></tr>');
				}else{
					$("#accept1_con tbody").html(td3);
				}
			}


		}else if(pa === 2){		//중점관리대상
			if($("#accept2_con tbody").html()===""){
				const common3 = await Promise.all([
						service.retrieveAcceptanceSpecialList(this.props.match.params.idConst)
				]);

				var result3 = common3[0].data.result;
				var td3 = '';
				for(var count = 0; count < result3.length; count++){
						td3 = td3 + '<tr>';
            td3 = td3 + '<td data-id="'+result3[count]['facilNo']+'">'+((result3[count]['seq']) ? result3[count]['seq'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['facilNo']) ? result3[count]['facilNo'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['gbFragNm']) ? result3[count]['gbFragNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['specialName']) ? result3[count]['specialName'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['bjdNm']) ? result3[count]['bjdNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['txLoc']) ? result3[count]['txLoc'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['noSector1']) ? result3[count]['noSector1'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['coConstNm']) ? result3[count]['coConstNm'] : '')+'</td>';
						td3 = td3 + '</tr>';
				}
				if(td3=== ''){
					$("#accept2_con tbody").html('<tr><td colspan="8">검색된 내용이 없습니다.</td></tr>');
				}else{
					$("#accept2_con tbody").html(td3);
				}
			}


		}else if(pa === 3){
			if($("#accept3_con tbody").html()===""){
				const common3 = await Promise.all([
						service.retrieveAcceptanceJointList(this.props.match.params.idConst)
				]);
				
				//절연조인트 리스트가 이거만 옴. "result":[{"seq":1,"id":302,"diaNm":"400","bjdNm":"중흥동"}],"code":"1"}
				var result3 = common3[0].data.result;
				var td3 = '';
				for(var count = 0; count < result3.length; count++){
            td3 = td3 + '<tr>';
            td3 = td3 + '<td data-id="'+result3[count]['id']+'">'+((result3[count]['seq']) ? result3[count]['seq'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['facilNo']) ? result3[count]['facilNo'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['gbPipeNm']) ? result3[count]['gbPipeNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['nmJoint']) ? result3[count]['nmJoint'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['diaNm']) ? result3[count]['diaNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['tpInstype']) ? result3[count]['tpInstype'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['txLoc']) ? result3[count]['txLoc'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['idPipeRoadNm']) ? result3[count]['idPipeRoadNm'] : '')+'</td>';
            td3 = td3 + '<td>'+((result3[count]['coConst']) ? result3[count]['coConst'] : '')+'</td>';
            td3 = td3 + '</tr>';
				}
				if(td3=== ''){
					$("#accept3_con tbody").html('<tr><td colspan="9">검색된 내용이 없습니다.</td></tr>');
				}else{
					$("#accept3_con tbody").html(td3);
				}
			}
		}
		config.setWindowHeight();
	}

	btnInfo = () =>{
		this.props.history.push("/retrieveAcceptanceInfoForTakeinsp/"+this.props.match.params.idConst);
	}

	componentDidMount() {
		$("#accept0_con tbody").html("");
		$("#accept1_con tbody").html("");
		$("#accept2_con tbody").html("");
		$("#accept3_con tbody").html("");
		$(".accept0").css("display","block");
		$(".accept1").css("display","none");
		$(".accept2").css("display","none");
		$(".accept3").css("display","none");

		//공통코드 모두 오픈 실행
		config.fetchCommon("ERP","CG_F_00073","tpOpmath");			//tpOpmath
		config.fetchCommon("ERP","CG_U_00024","cdDiaFront");			//cdDiaFront
		config.fetchCommon("ERP","CG_U_00024","cdDiaBack");			//cdDiaBack
		config.fetchCommon("ERP","CG_F_00070","valveKnd");			//valveKnd
		config.fetchCommon("ERP","CG_F_00072","tpVbring");			//tpVbring
		config.fetchCommon("ERP","CG_F_00072","tpHpsize");			//tpHpsize
		config.fetchCommon("ERP","CG_F_00107","oacStat");			//oacStat
		config.fetchCommon("ERP","CG_D_00012","roadClass");			//roadClass
		config.fetchCommon("ERP","CG_D_00012","roadClass2");			//roadClass
		config.fetchCommon("ERP","CG_F_00074","txLoc");			//txLoc
		config.fetchCommon("ERP","CG_F_00074","txLoc2");			//txLoc
		config.fetchCommon("ERP","CG_F_00069","kdVb");			//txLoc
		//erp 없음
		//config.fetchCommon("ERP","CG_F_00074","tpTarget");			//txLoc
		
		
		this.firstInfo();


		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급관리";
    $(".header_title").html( "공급관리");

    this.subPage(0);
		var t = this;
		//테이블 리스트 선택
		$(document).off("click","#accept0_con tr");
		$(document).on("click","#accept0_con tr",function(){
			$("#accept0_con tr").removeClass("sel");
			$(this).addClass("sel");
			//var id = $(this).find("td:eq(0)").attr("data-id");
			var id = $(this).find("td:eq(1)").html();

			if(id !=='' ){
				t.btnSubDetail(0,id);
			}
		});

		$(document).off("click","#accept1_con tr");
		$(document).on("click","#accept1_con tr",function(){
			$("#accept1_con tr").removeClass("sel");
			$(this).addClass("sel");
			//var id = $(this).find("td:eq(0)").attr("data-id");
			var id = $(this).find("td:eq(1)").html();
			if(id !=='' ){
				t.btnSubDetail(1,id);
			}
		});

		$(document).off("click","#accept2_con tr");
		$(document).on("click","#accept2_con tr",function(){
			$("#accept2_con tr").removeClass("sel");
			$(this).addClass("sel");
			var id = $(this).find("td:eq(1)").html();
			if(id !==''  ){
				t.btnSubDetail(2,id);
			}
		});

		$(document).off("click","#accept3_con tr");
		$(document).on("click","#accept3_con tr",function(){
			$("#accept3_con tr").removeClass("sel");
			$(this).addClass("sel");
			//var id = $(this).find("td:eq(0)").attr("data-id");
			var id = $(this).find("td:eq(1)").html();
			if(id !==''  ){
				t.btnSubDetail(3,id);
			}
		});
	}
	
	//{"result":{"id":1515,"facilNo":"VBL0947","nmVb":"신기동 26-9번지 앞 도로","idConst":"20200002","nmConst":"신기동 9통 대로변 주택지역 배관공사","dtSet":"2020-02-21","pressureNm":"저압","valveTypNm":"매몰형","oacStatNm":"OPEN","diaNm":"160","valveKndNm":"볼밸브","cdDiaFrontNm":"40A","cdDiaBackNm":"40A","coConstNm":"(주)동신기업","makeCom":"(주)대연정공","tpHpsizeNm":"800","tpVbringNm":"800","tpOpmathNm":"기어","roadClassNm":"ASP","idPipeRoadNm":"15구역"},"code":"1"}

	//선택한값 상세조회
	btnSubDetail = async(type, id) => {
		if(type === 0 ){
			const view = await Promise.all([
					service.retrieveAcceptanceVbDetail(id)
			]);
			var vv = view[0].data.result;
			$.each(vv, function(key, value){
				if(key==="nmVb" || key==="tpOpmath" || key==="cdDiaFront" || key==="tpVbring" || key==="cdDiaBack" || key==="tpHpsize" || key==="roadClass" || key==="valveKnd" || key==="oacStat" || key==="txLoc"){
					$(".accept0 .accept_table ."+key).val(value);
				}else{
					$(".accept0 .accept_table ."+key).html(value);
				}
			});

		}else if(type === 1){
			const view = await Promise.all([
					service.retrieveAcceptanceTbDetail(id)
			]);
			var vv = view[0].data.result;
			$.each(vv, function(key, value){
				if(key==="facilNm" || key==="roadClass"){
					$(".accept1 .accept_table ."+key).val(value);
				}else{
					$(".accept1 .accept_table ."+key).html(value);
				}
			});
		}else if(type === 2){
			const view = await Promise.all([
					service.retrieveAcceptanceSpecialDetail(id)
			]);
			var vv = view[0].data.result;
			$.each(vv, function(key, value){
				if(key==="facilNo" || key==="idConst" || key==="nmConst" || key==="gbFragNm" || key==="dtSet" || key==="qtyDia" || key==="cdPressNm" || key==="grdMng"){
					$(".accept2 .accept_table ."+key).html(value);
				}else{
					$(".accept2 .accept_table ."+key).val(value);
				}
			});
		}else if(type === 3){
			const view = await Promise.all([
					service.retrieveAcceptanceJointDetail(id)
			]);
			var vv = view[0].data.result;
			$.each(vv, function(key, value){
				if(key==="nmJoint" || key==="tpInstype" || key==="txLoc"){
					$(".accept3 .accept_table ."+key).val(value);
				}else{
					$(".accept3 .accept_table ."+key).html(value);
				}
			});
		}
	}

	btnSave = async () =>{
		if( $("#accept"+this.acc+"_con tr.sel").find("td:eq(0)").html() >= 1){
			if(window.confirm("저장 하시겠습니까?")){
				var data ={};
				let gubun = this.acc;
				$(".acce"+this.acc+"_data").each(function(){
					var key_name = $(this).attr("class").split(" ");
					if( $("."+key_name[1]).val() !== "" ){
						data[key_name[1]] = $(".accept"+gubun+" .accept_table ."+key_name[1]).val();
						
					}else{
						data[key_name[1]] = $(".accept"+gubun+" .accept_table ."+key_name[1]).html();
					}
				});
				const save = await Promise.all([service.modifyAcce(data, this.acc)]);
				alert(save[0].data.message);
			}
		}else{
			alert("항목을 선택해주세요.");
		}
	}

	render() { 
        return (
			<div className="contents">
				<div className="list detail">
					<div className="tab tab1">
						<a href="#:;"><span>인계인수 상세정보</span></a>
					</div>
					<div className="wrap">
            <h2>관경별 연장</h2>
						<div className="box info">
							<table id="accptInfo">
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
							    <tbody>
							    	<tr>
								    	<th>관경</th>
								    	<td>연장</td>
								    </tr>
						    	</tbody>
							</table>
						</div>
            <h2>시설물</h2>
						<div className="box info accep_sisul">
							<table>
								<colgroup>
									<col width="140"/>
									<col width="140"/>
									<col width="140"/>
									<col width="140"/>
									<col width="140"/>
									<col width="140"/>
									<col width="140"/>
									<col width="auto"/>
								</colgroup>
								<tbody>
									<tr>
											<th rowSpan="2">밸브</th>
											<th rowSpan="2">전기방식</th>
											<th colSpan="5">중점관리대상</th>
											<th rowSpan="2">절연조인트</th>
									</tr>
									<tr>
										<th>수취기</th>
										<th>교량</th>
										<th>파이프렉</th>
										<th>하천하월</th>
										<th>노출배관</th>
									</tr>
									<tr>
										<td className="cntVb">&nbsp;</td>
										<td className="cntTb">&nbsp;</td>
										<td className="cntWt">&nbsp;</td>
										<td className="cntBg">&nbsp;</td>
										<td className="cntPl">&nbsp;</td>
										<td className="cntRw">&nbsp;</td>
										<td className="cntOp">&nbsp;</td>
										<td className="cntJj">&nbsp;</td>
									</tr>
								</tbody>
							</table>
						</div>
            <h2>라인마크</h2>
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
								    	<th>직선방향(&lt;-&gt;)</th>
								    	<td className="cntLinemark1"></td>
								    	<th>삼방향(T)</th>
								    	<td className="cntLinemark2"></td>
								    	<th>양방향(90º)</th>
								    	<td className="cntLinemark3"></td>
								    </tr>
							    	<tr>
								    	<th>양방향(45º)</th>
								    	<td className="cntLinemark4"></td>
								    	<th>일방향(-&gt;)</th>
								    	<td className="cntLinemark5"></td>
								    	<th>관말지점(P)</th>
								    	<td className="cntLinemark6"></td>
							    	</tr>
						    	</tbody>
							</table>
						</div>

            <h2>시설물 정보</h2>
						<div className="box table acceptance">
							<div className="tab tab4">
								<a href="#:;" onClick={() => this.subPage(0)} className="active"><span>밸브</span></a>
								<a href="#:;" onClick={() => this.subPage(1)} ><span>전기방식</span></a>
								<a href="#:;" onClick={() => this.subPage(2)} ><span>중점관리대상</span></a>
								<a href="#:;" onClick={() => this.subPage(3)} ><span>절연조인트</span></a>
							</div>
							<div className="accept0">
								<div className="box info ">
									<div id="gridBox">
										<div id="gridHeader" className="why mw1000">
											<table>
												<colgroup>
													<col width="80"/>
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
														<th>관리번호</th>
														<th>설치일자</th>
														<th>제조사</th>
														<th>압력</th>
														<th>밸브크기</th>
														<th>밸브형식</th>
													</tr>
												</thead>
											</table>
										</div>
										<div id="accept0_con" className="mw1000">
											<table>
												<colgroup>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
												</colgroup>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="box info accept_table">
									<table >
										<colgroup>
											<col width="140px"/>
											<col width="*"/>
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
													<th>관리번호</th>
													<td colSpan="2" className="acce0_data facilNo"></td>
													<th>밸브명</th>
													<td colSpan="5"><input type="text" id="nmVb" className="acce0_data nmVb" /></td>
												</tr>
												<tr>
													<th>관리코드</th>
													<td colSpan="2" className="acce0_data idConst"></td>
													<th>구간명</th>
													<td className="acce0_data nmConst" colSpan="5"></td>
												</tr>
												<tr>
													<th>작동방식</th>
													<td colSpan="2"><select id="tpOpmath" className="acce0_data tpOpmath"></select></td>
													<th>설치년도</th>
													<td className="acce0_data dtSet"></td>
													<th>밸브크기</th>
													<td className="acce0_data diaNm"></td>
													<th>압력</th>
													<td className="acce0_data pressureNm"></td>
												</tr>
												<tr>
													<th>퍼지변</th>
													<th>전단</th>
													<td><select id="cdDiaFront" className="acce0_data cdDiaFront"></select></td>
													<th>시공사</th>
													<td className="acce0_data coConst"></td>
													<th>철괴크기</th>
													<td><select id="tpVbring" className="acce0_data tpVbring"></select></td>
													<th>밸브형식</th>
													<td className="acce0_data valveTypNm"></td>
												</tr>
												<tr>
													<th>퍼지변</th>
													<th>후단</th>
													<td><select id="cdDiaBack" className="acce0_data cdDiaBack"></select></td>
													<th>제조사</th>
													<td className="acce0_data makeCom"></td>
													<th>흄관크기</th>
													<td><select id="tpHpsize" className="acce0_data tpHpsize"></select></td>
													<th>포장상태</th>
													<td><select id="roadClass2" className="acce0_data roadClass"></select></td>
												</tr>
												<tr>
													<th colSpan="2">퍼지변 종류</th>
													<td><select id="valveKnd" className="acce0_data valveKnd"></select></td>
													<th>구역</th>
													<td className="acce0_data idPipeRoadNm"></td>
													<th>차단여부</th>
													<td><select id="oacStat" className="acce0_data oacStat"></select></td>
													<th>설치위치</th>
													<td><select id="txLoc" className="acce0_data txLoc"></select></td>
												</tr>
											</tbody>
									</table>
									<button type="button" onClick={this.btnSave}><img alt="" src={btn_save_white} width="15" height="15" />저장</button>
								</div>
							</div>
							<div className="accept1">
								<div className="box table">
									<div id="gridBox">
										<div id="gridHeader" className="why mw1000">
											<table>
												<colgroup>
													<col width="60"/>
													<col width="80"/>
													<col width="auto"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
												</colgroup>
												<thead>
													<tr>
														<th>순번</th>
														<th>관리번호</th>
														<th>전기방식명</th>
														<th>설치일자</th>
														<th>제조사</th>
														<th>압력</th>
														<th>T/B크기</th>
														<th>준공전위</th>
													</tr>
												</thead>
											</table>
										</div>
										<div id="accept1_con" className="mw1000">
											<table>
												<colgroup>
													<col width="60"/>
													<col width="80"/>
													<col width="auto"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
												</colgroup>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="box info accept_table">
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
													<th>관리번호</th>
													<td className="acce1_data facilNo"></td>
													<th>전기방식명</th>
													<td colSpan="3"><input type="text" id="facilNm" className="acce1_data facilNm" name="facilNm"/></td>
													<th>구역</th>
													<td className="acce1_data idPipeRoadNm"></td>
												</tr>
												<tr>
													<th>관리코드</th>
													<td className="acce1_data idConst"></td>
													<th>구간명</th>
													<td colSpan="3" className="acce1_data nmConst"></td>
													<th>압력</th>
													<td className="acce1_data pressureNm"></td>
												</tr>
												<tr>
													<th>설치년도</th>
													<td className="acce1_data setbmtDt"></td>
													<th>방식방법</th>
													<td className="acce1_data corptTypNm"></td>
													<th>관경(A)</th>
													<td className="acce1_data diaNm"></td>
													<th>준공전위</th>
													<td className="acce1_data qtyElec"></td>
												</tr>
												<tr>
													<th>시공사</th>
													<td className="acce1_data coConstNm"></td>
													<th>포장상태</th>
													<td><select id="roadClass" className="acce1_data roadClass"></select></td>
													<th>접합방식</th>
													<td className="acce1_data gbConnNm"></td>
													<th>테스트박스크기</th>
													<td className="acce1_data tbBoxSize"></td>
												</tr>
											</tbody>
									</table>
									<button type="button" onClick={this.btnSave}><img alt="" src={btn_save_white} width="15" height="15" />저장</button>
								</div>
							</div>
							<div className="accept2">
                <div className="box table">
									<div id="gridBox">
										<div id="gridHeader" className="why mw1000">
											<table>
												<colgroup>
													<col width="80"/>
													<col width="80"/>
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
														<th>관리번호</th>
														<th>시설구분</th>
														<th>중점관리대상명</th>
														<th>법정동</th>
														<th>위치</th>
														<th>관로순찰구간</th>
														<th>시공업체</th>
													</tr>
												</thead>
											</table>
										</div>
										<div id="accept2_con" className="mw1000">
											<table>
												<colgroup>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
												</colgroup>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="box info accept_table">
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
													<th>관리번호</th>
													<td className="acce2_data facilNo"></td>
													<th>중점관리대상명</th>
													<td colSpan="5"><input type="text" id="specialName" className="acce2_data specialName" name="specialName"/></td>
												</tr>
												<tr>
													<th>위치</th>
													<td colSpan="7"><input type="text" id="txLoc" className="acce2_data txLoc" name="txLoc"/></td>
												</tr>
												<tr>
													<th>공사ID</th>
													<td className="acce2_data idConst"></td>
													<th>공사명</th>
													<td colSpan="5" className="acce2_data nmConst"></td>
												</tr>
												<tr>
													<th>중점관리대상구분</th>
													<td className="acce2_data gbFragNm"></td>
													<th>설치일자</th>
													<td className="acce2_data dtSet"></td>
													<th>관경</th>
													<td className="acce2_data qtyDia"></td>
													<th>압력</th>
													<td className="acce2_data cdPressNm"></td>
												</tr>
												<tr>
													<th>연장(m)</th>
													<td><input type="text" id="constLength" className="acce2_data constLength" name="constLength"/></td>
													<th>관리등급</th>
													<td colSpan="5" className="acce2_data grdMng"></td>
												</tr>
												<tr>
													<th>밸브종류</th>
													<td><select id="kdVb" className="acce2_data kdVb" name="kdVb"></select></td>
													<th>지지대수량</th>
													<td><input type="text" id="cntStand" className="acce2_data cntStand" name="cntStand"/></td>
													<th>지지대간격</th>
													<td><input type="text" id="widStand" className="acce2_data widStand" name="widStand"/></td>
													<th>보온재관경(A)</th>
													<td><input type="text" id="diaPipe" className="acce2_data diaPipe" name="diaPipe"/></td>
												</tr>
												<tr>
													<th>검토GL심도</th>
													<td><input type="text" id="depthGlTech" className="acce2_data depthGlTech" name="depthGlTech"/></td>
													<th>검토하천심도</th>
													<td><input type="text" id="depthRiverTech" className="acce2_data depthRiverTech" name="depthRiverTech"/></td>
													<th>측정GL심도</th>
													<td><input type="text" id="depthGlMea" className="acce2_data depthGlMea" name="depthGlMea"/></td>
													<th>측정하천심도</th>
													<td><input type="text" id="depthRiverMae" className="acce2_data depthRiverMae" name="depthRiverMae"/></td>
												</tr>
											</tbody>
									</table>
									<button type="button" onClick={this.btnSave}><img alt="" src={btn_save_white} width="15" height="15" />저장</button>
								</div>
							</div>
							<div className="accept3">
                <div className="box table">
									<div id="gridBox">
										<div id="gridHeader" className="why mw1000">
											<table>
												<colgroup>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
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
														<th>관리번호</th>
														<th>배관구분</th>
														<th>절연조인트명</th>
														<th>관경</th>
														<th>설치형식</th>
														<th>설치위치</th>
														<th>관로순찰구간</th>
														<th>시공업체</th>
													</tr>
												</thead>
											</table>
										</div>
										<div id="accept3_con" className="mw1000">
											<table>
												<colgroup>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
													<col width="80"/>
												</colgroup>
												<tbody>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="box info accept_table">
									<table>
										<colgroup>
											<col width="140px"/>
											<col width="*"/>
											<col width="*"/>
											<col width="*"/>
											<col width="*"/>
											<col width="*"/>
										</colgroup>
											<tbody>
												<tr>
													<th>관리번호</th>
													<td className="acce3_data facilNo"></td>
													<th>절연조인트명</th>
													<td colSpan="3"><input type="text" id="nmJoint" className="acce3_data nmJoint" name="nmJoint"/></td>
												</tr>
												<tr>
													<th>공사ID</th>
													<td className="acce3_data idConst"></td>
													<th>공사명</th>
													<td colSpan="3" className="acce3_data nmConst"></td>
												</tr>
												<tr>
													<th>설치일자</th>
													<td className="acce3_data dtSet"></td>
													<th>관경</th>
													<td className="acce3_data diaNm"></td>
													<th>압력</th>
													<td className="acce3_data pressureNm"></td>
												</tr>
												<tr>
													<th>설치형식</th>
													<td><input type="text" id="tpInstype" className="acce3_data tpInstype" name="tpInstype"/></td>
													<th>설치위치</th>
													<td colSpan="3"><input type="text" id="txLoc" className="acce3_data txLoc" name="txLoc"/></td>
												</tr>
											</tbody>
									</table>
									<button type="button" onClick={this.btnSave}><img alt="" src={btn_save_white} width="15" height="15" />저장</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveAcceptanceVb','인수검사')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" onClick={this.btnInfo}><img alt="" src={icon2} width="15" height="15" />검사정보</button>
					</div>
				</footer>
			</div>
            );
	}
}

export default withRouter(retrieveAcceptanceVb);