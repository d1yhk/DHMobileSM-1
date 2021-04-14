import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';



class retrievePreInspDetail2 extends Component {
	constructor(props) {
		super(props);

		if(config.back.url[config.back.url.length-1] !== '/retrievePreInspDetail2/'+this.props.match.params.idPreinsp+'/'+this.props.match.params.cdBld){
				config.back.url.push('/retrievePreInspDetail2/'+this.props.match.params.idPreinsp+'/'+this.props.match.params.cdBld);
		}
		config.detail_file.index=this.props.match.params.idx;
		this.info={}
		this.clist={}
		this.clist_idx=-1;
	}

  //정보
	fetchDetail = async () => { 
		const contents = await Promise.all([ 
			service.retrievePreInspDetail2(this.props.match.params.idPreinsp)
		]);
		this.info = contents[0].data.result;
		$(".nmGbCntr").html(contents[0].data.result.nmGbCntr);
		$(".nmGbFclt").html(contents[0].data.result.nmGbFclt);
		$(".nmFcltBld").html(contents[0].data.result.nmFcltBld);
		$(".stPreinspNm").html(contents[0].data.result.stPreinspNm);
		$(".txAddr").html(contents[0].data.result.txAddr);
		$(".cntHsTot").html(contents[0].data.result.cntHsTot);
		$(".cntReq").html(contents[0].data.result.cntReq);

		$(".grp_inspcustlist tbody").html('<tr><td colspan="16">검색된 내용이 없습니다.</td></tr>');
		const contents2 = await Promise.all([ 
			service.retrievePreInspCustList(this.props.match.params.cdBld)
		]);
		if(contents2[0] != null){
			$(".grp_inspcustlist tbody").html('');
			this.clist = contents2[0].data.result
			for(var count = 0; count < this.clist.length; count++){
				var td = '<tr class="clist">';
				td = td + '<td>'+(count+1)+'</td>';
				td = td + '<td>'+((this.clist[count]['noCust']) ? this.clist[count]['noCust'] : '')+'</td>';
				td = td + '<td data-prev="'+((this.clist[count]['dongHs']) ? this.clist[count]['dongHs'] : '')+'">'+((this.clist[count]['dongHs']) ? this.clist[count]['dongHs'] : '')+'</td>';
				td = td + '<td data-prev="'+((this.clist[count]['hoHs']) ? this.clist[count]['hoHs'] : '')+'">'+((this.clist[count]['hoHs']) ? this.clist[count]['hoHs'] : '')+'</td>';
				td = td + '<td data-prev="'+((this.clist[count]['nmCust']) ? this.clist[count]['nmCust'] : '')+'">'+((this.clist[count]['nmCust']) ? this.clist[count]['nmCust'] : '')+'</td>';
				td = td + '<td data-prev="'+((this.clist[count]['gbHsNm']) ? this.clist[count]['gbHsNm'] : '')+'">'+((this.clist[count]['gbHsNm']) ? this.clist[count]['gbHsNm'] : '')+'</td>';
				td = td + '<td data-prev="'+((this.clist[count]['nmUse']) ? this.clist[count]['nmUse'] : '')+'">'+((this.clist[count]['nmUse']) ? this.clist[count]['nmUse'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['grdGmNm']) ? this.clist[count]['grdGmNm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['nmMakerVc']) ? this.clist[count]['nmMakerVc'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['gbGmNm']) ? this.clist[count]['gbGmNm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['tyGmNm']) ? this.clist[count]['tyGmNm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['yhGmNm']) ? this.clist[count]['yhGmNm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['dtMadeVc']) ? this.clist[count]['dtMadeVc'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['plcGmNm']) ? this.clist[count]['plcGmNm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['noMachinGm']) ? this.clist[count]['noMachinGm'] : '')+'</td>';
				td = td + '<td>'+((this.clist[count]['ynExist']) ? this.clist[count]['ynExist'] : '')+'</td>';
				td = td + '</tr>';
				$(".grp_inspcustlist tbody").append(td);
			}
			if(this.clist.length <= 0){
				$(".grp_inspcustlist tbody").html('<tr><td colspan="16">검색된 내용이 없습니다.</td></tr>');
			}
		}
	}

	//적용
	onApply=()=>{
		var t = this;
		var cnt = -1;
		var chk = -1;
		this.clist_idx = 0;
		$(".grp_inspcustlist tr").each(function(){
			chk++;
			if($(this).attr("class").indexOf("active") >= 0 ){
				cnt++;
				t.clist_idx = chk;
			}
		});
		
		if(cnt != 0){
			alert("수용가 정보 리스트를 한개만 선택해주세요.");
		}else{
			if(this.clist_idx >= 0){
				
				if($(".cinfo .name").val() == ""){
					$(".cinfo .name").focus();
					alert("수용가명을 작성하세요");
					return;
				}
				var curr = $(".grp_inspcustlist tr:eq("+this.clist_idx+")");

				curr.find("td:eq(4)").html($(".cinfo .name").val() + ' ' +$(".cinfo .dong").val() + (($(".cinfo .dong").val()!='') ? '동' : '') + ' ' +$(".cinfo .ho").val()+ (($(".cinfo .ho").val()!='') ? '호' : ''));
				curr.find("td:eq(2)").html($(".cinfo .dong").val());
				curr.find("td:eq(3)").html($(".cinfo .ho").val());
				if($(".cinfo .gbHsNm").val() != ''){
					curr.find("td:eq(5)").html($(".cinfo .gbHsNm option:checked").text());
				}
				if($(".cinfo .nmUse").val() != ''){
					curr.find("td:eq(6)").html($(".cinfo .nmUse option:checked").text());
				}
			}else{
				alert("수용가 정보 리스트를 선택하세요");
			}
		}
	}
	//일괄적용
	onApplyAll=()=>{
		var t = this;
		var cnt = -1;
		var chk = -1;
		$(".grp_inspcustlist tr").each(function(){
			chk++;
			if($(this).attr("class").indexOf("active") >= 0 ){
				cnt++;
			}
		});
		
		if(cnt < 0 ){
			alert("수용가 정보 리스트를 한개 이상 선택해주세요.");
		}else{
			var ca = -1;
			$(".grp_inspcustlist tr").each(function(){
				ca++;
				if($(this).attr("class").indexOf("active") >= 0 ){
					var curr = $(".grp_inspcustlist tr:eq("+ca+")");
					curr.find("td:eq(4)").html($(".cinfo .name").val() + ' ' + curr.find("td:eq(2)").html() + ((curr.find("td:eq(2)").html()!='') ? '동' : '') + ' ' + curr.find("td:eq(3)").html()+ ((curr.find("td:eq(3)").html()!='') ? '호' : ''));

					if($(".cinfo .gbHsNm").val() != ''){
						curr.find("td:eq(5)").html($(".cinfo .gbHsNm option:checked").text());
					}
					if($(".cinfo .nmUse").val() != ''){
						curr.find("td:eq(6)").html($(".cinfo .nmUse option:checked").text());
					}
				}
			});
		}
	}
	
	//초기화
	onReset=()=>{
		$(".cinfo .name").val("");
		$(".cinfo .dong").val("");
		$(".cinfo .ho").val("");
		$(".cinfo .gbHsNm").val("");
		$(".cinfo .nmUse").val("");

		$(".grp_inspcustlist tr").each(function(){
			$(this).find("td:eq(2)").html($(this).find("td:eq(2)").attr("data-prev"));
			$(this).find("td:eq(3)").html($(this).find("td:eq(3)").attr("data-prev"));
			$(this).find("td:eq(4)").html($(this).find("td:eq(4)").attr("data-prev"));
			$(this).find("td:eq(5)").html($(this).find("td:eq(5)").attr("data-prev"));
			$(this).find("td:eq(6)").html($(this).find("td:eq(6)").attr("data-prev"));
			$(this).css({"background-color":"#fff"});
			$(this).removeClass("active");
		});
	}


	onSave = async ()=>{
		var t = this;
		var custList = [];
		$(".grp_inspcustlist tr").each(function(){
			if($(this).attr("class").indexOf("active") >= 0){
				var noCust = $(this).find("td:eq(1)").html();
				var dongHs = $(this).find("td:eq(2)").html();
				var hoHs = $(this).find("td:eq(3)").html();
				var nmCust = $(this).find("td:eq(4)").html();
				var gbHsNm = $(this).find("td:eq(5)").html();
				var nmUse = $(this).find("td:eq(6)").html();

				custList.push({noCust:noCust,dongHs:dongHs,hoHs:hoHs,nmCust:nmCust,gbHsNm:gbHsNm,nmUse:nmUse});
			}
		});

		console.log(custList);

		const save = await Promise.all([ 
			service.savePreInspCustInfo(custList)
		]);
		alert(save[0].data.message);
	}


	//계량기 정보 조회
	gmDetail=()=>{
		var t = this;
		var cnt = -1;
		var chk = -1;
		
		var noCust='';
		var nmCust='';
		var grdGmNm='0';
		var ynExist='';
		var nmUse='';
		$(".grp_inspcustlist tr").each(function(){
			chk++;
			if($(this).attr("class").indexOf("active") >= 0 ){				
				noCust = $(this).find("td:eq(1)").html();
				nmCust = $(this).find("td:eq(4)").html();
				//바코드 등급 공백일경우 처리
				if($(this).find("td:eq(7)").html() != ''){
					grdGmNm = $(this).find("td:eq(7)").html();
				}

				ynExist = $(this).find("td:eq(15)").html();
				nmUse = $(this).find("td:eq(6)").html();
				cnt++;
			}
		});

		if(cnt == 0){
			this.props.history.push('/retrievePreInspGmDetail/'+noCust+'/'+nmCust+'/'+grdGmNm+'/'+ynExist+'/'+nmUse);
		}else{
			alert("수용가정보 목록을 하나만 선택하세요");
		}
	}
	componentDidMount() {
		config.fetchCommon("ERP", "CG_S_00001", "gbHsNm");
		config.fetchCommon("ERP", "CG_B_00091", "nmUse");
		this.fetchDetail();
		var t = this;
		$(document).off("click",".grp_inspcustlist tr");
		$(document).on("click",".grp_inspcustlist tr",function(){
			t.clist_idx = $(this).index();
			
			if($(this).attr("class").indexOf("active") >= 0 ){
				$(this).removeClass("active");
				$(this).css({"background-color":"#fff"});
			}else{
				$(this).addClass("active");
				$(this).css({"background-color":"#eee"});
			}


			//수용가 정보 항목 추가해야함.
		});
	}

	render() {
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>수용가 정보</h2>
					</div>
					<div className="wrap">
						<h2>기본정보</h2>
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
										<th>공급유형</th>
										<td className="nmGbCntr"></td>
										<th>시설구분</th>
										<td className="nmGbFclt"></td>
										<th>시설명</th>
										<td className="nmFcltBld"></td>
										<th>상태</th>
										<td className="stPreinspNm"></td>
									</tr>
									<tr>
										<th>주소</th>
										<td colSpan="3" className="txAddr"></td>
										<th>총세대수</th>
										<td className="cntHsTot"></td>
										<th>신청세대수</th>
										<td className="cntReq"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">수용가 정보<button type="button" className="btn-right" onClick={this.onSave}>저장</button></h2>
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll cinfo">
										<div className="form5">
											<label>수용가명</label>
                      <input type="text" className="name" />
										</div>
										<div className="form5_2">
											<label>동</label>
                      <input type="text" className="dong"  />
										</div>
										<div className="form5_2">
											<label>호</label>
                      <input type="text" className="ho"  />
										</div>
										<div className="form5_2">
											<label>주택구분</label>
                      <select id="gbHsNm" className="gbHsNm">
												<option value="">선택</option>
											</select>
										</div>
										<div className="form5_2">
											<label>용도</label>
                      <select id="nmUse" className="nmUse">
												<option value="">선택</option>
											</select>
										</div>
										<div className="form_button">
											<button type="button" onClick={this.onApply}>적용</button>
											<button type="button" onClick={this.onApplyAll}>일괄적용</button>
											<button type="button" onClick={this.onReset}>초기화</button>
										</div>
									</div>
								</fieldset>
							</form>
						</div>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="40"/>
											<col width="60"/>
											<col width="100"/>
											<col width="50"/>
											<col width="*"/>
											<col width="70"/>
											<col width="60"/>
											<col width="60"/>
											<col width="70"/>
											<col width="60"/>
											<col width="60"/>
											<col width="60"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>순번</th>
												<th>수용가번호</th>
												<th>동</th>
												<th>호</th>
												<th>수용가명</th>
												<th>주택구분</th>
												<th>용도</th>
												<th>등급</th>
												<th>제조사</th>
												<th>형식</th>
												<th>타입</th>
												<th>유형</th>
												<th>제조년월</th>
												<th>설치위치</th>
												<th>기물번호</th>
												<th>계량기<br/>등록여부</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="grp_inspcustlist mw1000">
									<table>
										<colgroup>
											<col width="40"/>
											<col width="60"/>
											<col width="100"/>
											<col width="50"/>
											<col width="*"/>
											<col width="70"/>
											<col width="60"/>
											<col width="60"/>
											<col width="70"/>
											<col width="60"/>
											<col width="60"/>
											<col width="60"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>

						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map" onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => this.gmDetail()} ><img alt="" src={icon2} width="15" height="15" />계량기 정보</button>
						{/*<button type="button" className="btn_save" ><img alt="" src={icon2} width="15" height="15" />연소기 정보</button>*/}
					</div>
				</footer>
			</div>
		)
	}
	
}

export default retrievePreInspDetail2;