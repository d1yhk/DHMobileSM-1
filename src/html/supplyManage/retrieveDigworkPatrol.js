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


class retrieveDigworkPatrol extends Component {
  constructor(props) {
    super(props);
		//if(config.back.url[config.back.url.length-1] !== '/retrieveDigworkPatrol/'+this.props.match.params.jupno){
		//	config.back.url.push('/retrieveDigworkPatrol/'+this.props.match.params.jupno);
		//}

		this.dig2 = -1;
		this.dig2_list = [];
		this.link1 = "/retrieveDigworkDetail/"+this.props.match.params.jupno;
		this.link2 = "/retrieveDigworkPatrol/"+this.props.match.params.jupno;
		this.link3 = "/retrieveDigworkAgrmtDoc/"+this.props.match.params.jupno;

		this.checkList = [];
		this.repairlist = [];
  }
    
	fetchDetail = async () => {
		if(this.props.match.params.jupno !== '' ){
				
			$("#dig2_list tbody").html("");
			const common = await Promise.all([ 
				service.retrieveDigworkPatrolList(this.props.match.params.jupno)
			]);

			var result = common[0].data.result;
			var td = '';
			this.dig2_list = result;
			for(var count = 0; count < result.length; count++){
					td = '<tr>';
					td += '<td>' + result[count].seqPatrol + '</td>';
					td += '<td>' + ((result[count].gbDig) ? result[count].gbDig : '') + '</td>';
					td += '<td>' + ((result[count].nmPress) ? result[count].nmPress : '') + '</td>';
					td += '<td>' + ((result[count].remark) ? result[count].remark : '') + '</td>';
					td += '<td>' + ((result[count].contPatrol) ? result[count].contPatrol : '') + '</td>';
					td += '<td>' + ((result[count].dtPatrol) ? result[count].dtPatrol : '') + '</td>';
					td += '<td>' + ((result[count].tmPatrol) ? result[count].tmPatrol : '') + '</td>';
					td += '<td>' + ((result[count].empPatrol) ? result[count].empPatrol : '') + '</td>';
					td += '<td>' + ((result[count].checkYn) ? result[count].checkYn : '') + '</td>';
					td += '</tr>';
					$("#dig2_list tbody").append(td);
			}


			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
					
			config.setWindowHeight();
		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	checkIfno = async () =>{
		const info = await Promise.all([ 
			service.retrieveDigworkCheckInfo(this.props.match.params.jupno,this.dig2_list[this.dig2].seqPatrol,this.dig2_list[this.dig2].gbDig)
		]);
		
		
			if(this.dig2_list[this.dig2].gbDig ==="대규모"){
				if(info[0].data.result!= null){
					$("#box_big_info .dia").val(info[0].data.result.dia);
					$("#box_big_info .pressure").val(info[0].data.result.pressure);
					$("#box_big_info .len").val(info[0].data.result.len);
				}

				var td='';
				var selected1='';
				var selected2='';
				var selected3='';
				this.checkList = info[0].data.checkList;
				var checkl =[];
				for(var i=0; i < this.checkList.length; i++){
					if( checkl[this.checkList[i].itemGrNm] >= 1){
						checkl[this.checkList[i].itemGrNm] += 1;
					}else{
						checkl[this.checkList[i].itemGrNm] = 1;
					}
				}

				var prev='';
				for(var i=0; i < this.checkList.length; i++){
					selected1='';
					selected2='';
					selected3='';
					if(this.checkList[i].checkRslt === '1'){
						selected1 = ' checked';
					}else if(this.checkList[i].checkRslt === '2'){
						selected2 = ' checked';
					}else if(this.checkList[i].checkRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<tr>';
					if(checkl[this.checkList[i].itemGrNm] >=1 && prev != this.checkList[i].itemGrNm){
						td = td + '<td class="text-left" rowspan="'+checkl[this.checkList[i].itemGrNm]+'">'+this.checkList[i].itemGrNm+'</td>';
						prev = this.checkList[i].itemGrNm;
					}

					td = td + '<td class="text-left">'+this.checkList[i].itemNm+'</td>';
					td = td + '<td class="text-left">'+((this.checkList[i].checkStd) ? this.checkList[i].checkStd : '')+'</td>';
					td = td + '<td class="text-left radio">';
					td = td + ' <label><input type="radio" '+selected1+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>적합</span></label>';
					td = td + ' <label><input type="radio" '+selected2+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>부적합</span></label>';
					td = td + ' <label><input type="radio" '+selected3+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((this.checkList[i].note) ? this.checkList[i].note : '')+'" /></td>';
					td = td + '</tr>';
				}
				$("#box_big_list tbody").html(td);

			}else if(this.dig2_list[this.dig2].gbDig ==="소규모"){
				var td='';
				var selected1='';
				var selected2='';
				var selected3='';
				this.checkList = info[0].data.checkList;
				for(var i=0; i < this.checkList.length; i++){
					selected1='';
					selected2='';
					selected3='';
					if(this.checkList[i].checkRslt === '1'){
						selected1 = ' checked';
					}else if(this.checkList[i].checkRslt === '2'){
						selected2 = ' checked';
					}else if(this.checkList[i].checkRslt === '3'){
						selected3 = ' checked';
					}
					td = td + '<tr>';
					td = td + '<td class="text-left">'+this.checkList[i].itemNm+'</td>';
					td = td + '<td class="text-left radio">';
					td = td + ' <label><input type="radio" '+selected1+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>적합</span></label>';
					td = td + ' <label><input type="radio" '+selected2+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>부적합</span></label>';
					td = td + ' <label><input type="radio" '+selected3+' name="type0_'+this.checkList[i].seqPatrol+'_'+i+'"/><strong></strong><span>해당없음</span></label>';
					td = td + '</td>';
					td = td + '<td><input type="text" value="'+((this.checkList[i].note) ? this.checkList[i].note : '')+'" /></td>';
					td = td + '</tr>';
				}
				$("#box_small_list1 tbody").html(td);
				td = '';
				this.repairList = info[0].data.repairList;
				var repair =[];
				for(var i=0; i < this.repairList.length; i++){
					if( repair[this.repairList[i].itemGrNm] >= 1){
						repair[this.repairList[i].itemGrNm] += 1;
					}else{
						repair[this.repairList[i].itemGrNm] = 1;
					}
				}
				var prev='';
				for(var i=0; i < this.repairList.length; i++){
					td = td + '<tr>';
					if(repair[this.repairList[i].itemGrNm] >=1 && prev != this.repairList[i].itemGrNm){
						td = td + '<td class="text-left" rowspan="'+repair[this.repairList[i].itemGrNm]+'">'+this.repairList[i].itemGrNm+'</td>';
						prev = this.repairList[i].itemGrNm;
					}
					td = td + '<td class="text-left">'+this.repairList[i].itemNm+'</td>';
					td = td + '<td><input type="text" value="'+((this.repairList[i].note) ? this.repairList[i].note : '')+'" /></td>';
					td = td + '</tr>';
				}
				
				$("#box_small_list2 tbody").html(td);
				if(info[0].data.result != null){
					for(var k=0; k<info[0].data.result.locState.length; k++ ){
						if(info[0].data.result.locState.substr(k,1) === "1"){
							$("#box_small_info input:eq("+k+")").prop("checked",true);
						}
					}
					if(info[0].data.result.locStateEtc!==''){
						$(".etc").val(info[0].data.result.locStateEtc);
						$(".etc").removeClass("readonly");
						$(".etc").prop("readonly",false);
					}
				}
			}
		
		$(".worker").val( config.user.name );
	}
	
	SaveDp = async () =>{
		var jupno = this.props.match.params.jupno;
		var seqPatrol = this.dig2_list[this.dig2].seqPatrol;
		var gbDig = this.dig2_list[this.dig2].gbDig;
		var gubun = 0;
		var locState="";
		var locStateEtc="";
		var woker="";
		var dia="";
		var pressure="";
		var len="";
		if(gbDig == "소규모"){
			gubun=1;
			$("#box_small_info input[type=checkbox]").each(function(){
				if($(this).prop("checked")=== true){
					locState +='1';
				}else{
					locState +='0';
				}
			});

			locStateEtc = $(".etc").val();
			woker = $(".box_small .worker").val();

			for(var i=0; i < this.checkList.length; i++){
				var bs = $("#box_small_list1 tbody tr:eq("+i+")");
				if(bs.find("input:eq(0)").prop("checked") === true){
					this.checkList[i].checkRslt = 1;
				}else if(bs.find("input:eq(1)").prop("checked") === true){
					this.checkList[i].checkRslt = 2;
				}else if(bs.find("input:eq(2)").prop("checked") === true){
					this.checkList[i].checkRslt = 3;
				}
				this.checkList[i].note = bs.find("input:eq(3)").val();
			}
			
			for(var i=0; i < this.repairList.length; i++){
				var bs = $("#box_small_list2 tbody tr:eq("+i+")");
				this.repairList[i].note = bs.find("input:eq(0)").val();
			}
			
			const save = await Promise.all([ 
				service.saveDigworkCheckInfo(jupno, seqPatrol,gubun, gbDig, locState, locStateEtc, woker,this.checkList,this.repairList)
			]);
			alert(save[0].data.message);

		}else if(gbDig == "대규모"){
			gubun=2;
			woker = $(".box_big .worker").val();
			dia = $(".dia").val();
			pressure = $(".pressure").val();
			len = $(".len").val();
			this.checkList2 = [];
			for(var i=0; i < this.checkList.length; i++){
				var bs = $("#box_big_list tbody tr:eq("+i+")");
				if(bs.find("input:eq(0)").prop("checked") === true){
					this.checkList[i].checkRslt = 1;
				}else if(bs.find("input:eq(1)").prop("checked") === true){
					this.checkList[i].checkRslt = 2;
				}else if(bs.find("input:eq(2)").prop("checked") === true){
					this.checkList[i].checkRslt = 3;
				}
				this.checkList[i].note = bs.find("input:eq(3)").val();
			}
			const save = await Promise.all([ 
				service.saveDigworkCheckInfo2(jupno, seqPatrol,gubun, gbDig,  woker,this.checkList, dia, pressure, len)
			]);
			alert(save[0].data.message);
		}
		
		


	}
	RemoveDp = async () =>{
		if(this.dig2 < 0){
			alert("삭제할 항목을 선택해주세요");
		}else{
			if(window.confirm("정말로 삭제하시겠습니까?")){
				const remove = await Promise.all([ 
					service.deleteDigworkCheckInfo(this.props.match.params.jupno,this.dig2_list[this.dig2].seqPatrol)
				]);

				$("#dig2_list tbody tr:eq("+this.dig2+")").remove();

				$(".box_big").css("display", "none");
				$(".box_small").css("display", "none");
				alert(remove[0].data.message);
			}
		}
	}
	componentDidMount() {
		$(".box_big").css("display", "none");
		$(".box_small").css("display", "none");

		$(".footer").css("display","none");
    $(".map").css("display","none");
        
		config.header.title = "굴착공사";
    $(".header_title").html( "굴착공사");
        
    this.fetchDetail();
		var t = this;
		//테이블 리스트 선택

		$(document).off("click","#dig2_list tbody tr");
		$(document).on("click","#dig2_list tbody tr",function(){
			$("#dig2_list tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.dig2 = $(this).index();

			if (t.dig2_list[t.dig2].gbDig === "대규모") {
					$(".box_big").css("display", "block");
					$(".box_small").css("display", "none");

			} else if (t.dig2_list[t.dig2].gbDig === "소규모") {
					$(".box_big").css("display", "none");
					$(".box_small").css("display", "block");
			}
			t.checkIfno();
		});
	}
	AttachMove2 = () => {
		config.his.back = 'retrieveDigworkPatrol';
		if(this.dig2 < 0){
			alert("항목을 선택해주세요");
		}else{
      config.table.attach1 = "순회일지";
      config.table.attach2 = this.props.match.params.jupno;
      config.table.attach3 = this.dig2_list[this.dig2].seqPatrol;

			this.props.history.push('/Attach/순회일지');
		}
	}
	etc = () => {
		if($(".etccheck").prop("checked") === true){
			$(".etc").prop("readonly",false);
			$(".etc").removeClass("readonly");
		}else{
			$(".etc").prop("readonly",true);
			$(".etc").addClass("readonly");
		}
	}

	userSign2 = async () => {
		var gbFile = 'GIS01_01_01';
		var noFile = this.props.match.params.noFile;
		var cdKey1 = this.props.match.params.jupno;
		var cdKey2 = this.dig2_list[this.dig2].seqPatrol;
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
							<Link to={this.link2}><button type="button" className="active"><span>순회일지</span></button></Link>
							<Link to={this.link3}><button type="button"><span>협의 및 교육</span></button></Link>
						</div>
						<div className="box table">
							<table id="dig2_list">
								<colgroup>
									<col width="80"/>
									<col width="80"/>
									<col width="80"/>
									<col width="*"/>
									<col width="*"/>
									<col width="*"/>
									<col width="*"/>
									<col width="*"/>
									<col width="100"/>
								</colgroup>
								<thead>
									<tr>
										<th>순번</th>
										<th>구분</th>
										<th>압력</th>
										<th>입회장소</th>
										<th>입회결과</th>
										<th>입회일자</th>
										<th>입회자</th>
										<th>점검시간</th>
										<th>순회일지 작성여부</th>
									</tr>
								</thead>
								<tbody>
									<tr><td colSpan="9">검색된 내용이 없습니다.</td></tr>
								</tbody>
							</table>
						</div>

						<div className="box_small">
							<h2 className="wrap-head">굴착공사 순회, 입회 점검일지(소규모)
								<button className="btn-right" type="button" onClick={this.RemoveDp} >삭제</button>
								<button className="btn-right" type="button" onClick={this.SaveDp} >저장</button>
							</h2>

							<div className="box info ">
								<table id="box_small_info">
									<tr>
										<th>현장상태</th>
										<td className="checkbox2 inline2">
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>적합</span>
											</label>
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>시굴</span>
											</label>
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>항타</span>
											</label>
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>방호</span>
											</label>
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>이설</span>
											</label>
											<label>
													<input type="checkbox" value="1"/>
													<strong></strong>
													<span>메우기</span>
											</label>
											<label>
													<input type="checkbox" value="1" className="etccheck" onClick={this.etc}/>
													<strong></strong>
													<span>기타</span>
											</label>
											<input type="text"  className="etc input_text readonly" readOnly />
										</td>
									</tr>
								</table>
							</div>
							<h2 className="wrap-head">소규모 점검내역</h2>
							<div className="box table">
								<table id="box_small_list1">
									<colgroup>
										<col width="250"/>
										<col width="250"/>
										<col width="*"/>
									</colgroup>
									<thead>
										<tr>
											<th>점검항목</th>
											<th>검사결과</th>
											<th>비고</th>
										</tr>
									</thead>
									<tbody>
										<tr><td colSpan="3">검색된 내용이 없습니다.</td></tr>
									</tbody>
								</table>
							</div>
							<h2 className="wrap-head">보수이력</h2>
							<div className="box table">
								<table id="box_small_list2">
									<colgroup>
										<col width="250"/>
										<col width="250"/>
										<col width="*"/>
									</colgroup>
									<thead>
										<tr>
											<th>대분류</th>
											<th>중분류</th>
											<th>내용</th>
										</tr>
									</thead>
									<tbody>
										<tr><td colSpan="6">검색된 내용이 없습니다.</td></tr>
									</tbody>
								</table>
							</div>

							<div className="box info ">
								<table>
									<colgroup>
										<col width="250"/>
										<col width="250"/>
										<col width="*"/>
									</colgroup>
									<tr>
										<th className="important"><span>*</span>PHGIS 입력 : YES, NO</th>
										<th>굴착공사업체 담당자 확인</th>
										<td className="user_search"><input type="text" className="worker"/><button type="button" onClick={()=>this.userSign2()}>서명</button></td>
									</tr>
								</table>
							</div>
						</div>



						<div className="box_big">
							<h2 className="wrap-head">굴착공사 순회, 입회 점검일지(대규모)
								<button className="btn-right" type="button" onClick={this.RemoveDp} >삭제</button>
								<button className="btn-right" type="button" onClick={this.SaveDp} >저장</button>
							</h2>

					    <div className="box info">
						    <table id="box_big_info">
							    <colgroup>
							    	<col width="*"/>
							    	<col width="*"/>
								    <col width="*"/>
								    <col width="*"/>
								    <col width="*"/>
								    <col width="*"/>
						    	</colgroup>
							    <thead>
							    	<tr>
								    	<th>관경(A)</th>
								     	<td><input type="text" className="dia" /></td>
									    <th>압력</th>
								     	<td><input type="text" className="pressure" /></td>
									    <th>노출배관길이(m)</th>
								     	<td><input type="text" className="len" /></td>
								    </tr>
							    </thead>
						    	<tbody>
							    </tbody>
						    </table>
					    </div>
							<h2 className="wrap-head">대규모 점검내역</h2>
					    <div className="box table">
						    <table id="box_big_list">
							    <colgroup>
							    	<col width="150"/>
							    	<col width="300"/>
								    <col width="*"/>
								    <col width="250"/>
								    <col width="*"/>
						    	</colgroup>
							    <thead>
							    	<tr>
								    	<th>점검항목</th>
								     	<th>세부항목</th>
									    <th>점거방법 및 기준</th>
								      <th>검사결과</th>
									    <th>비고</th>
								    </tr>
							    </thead>
						    	<tbody>
										<tr><td colSpan="5">검색된 내용이 없습니다.</td></tr>
							    </tbody>
						    </table>
					    </div>

							<div className="box info ">
								<table>
									<colgroup>
										<col width="250"/>
										<col width="*"/>
									</colgroup>
									<tr>
										<th>굴착공사업체 담당자 확인</th>
										<td className="user_search"><input type="text" className="worker"/><button type="button" onClick={()=>this.userSign2()}>서명</button></td>
									</tr>
								</table>
							</div>
            </div>



	        </div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => this.AttachMove2()}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
        );
	}
}

export default retrieveDigworkPatrol;