/*ppt 179 공사관리 현장별 자재사용내역 ~ ppt 181까지 */
/* 뒤로가기 확인 해야함 상위의 개념으로 해야함. */
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import btn_request from '../../image/btn_request.png';

class retrieveConstItemMatList extends Component {
	
	constructor(props) {
		super(props);
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveConstItemMatList/'+this.props.match.params.idx){
			config.back.url.push('/retrieveConstItemMatList/'+this.props.match.params.idx);
		}
		
		config.detail_file.index  = this.props.match.params.idx;
		config.detail_file.param = "idConst";
	}

	//출고요청 //구매요청
	btnRequest = async (idn) => {
		///constManage/ConstController/createConstOutreq.do
		//parameter – 사용자부서 코드(cdDept), 사용자ID(noEmp), 공사ID(idConst), 품목코드(cdItem), 요청수량(qtyOutreq), 비고(remark)
		
		var noEmp = config.user.id;
		var idConst = this.props.match.params.idx;
		var cdItem = $("#cdItem"+idn).val();
		var qtyOutreq = $("#qtyOutreq"+idn).val();
		var remark = $("#remark"+idn).val();
		//출고
		if(idn===2){
			const save = await Promise.all([ 
				service.createConstOutreq(noEmp,idConst,cdItem,qtyOutreq,remark)
			]);
			alert(save[0].data.message);
			this.subContents(2,1);
		//구매
		}else if(idn===3){
			const save = await Promise.all([ 
				service.createConstOrdreq(noEmp,idConst,cdItem,qtyOutreq,remark)
			]);
			alert(save[0].data.message);
			this.subContents(3,1);
		}

		$("#cdItem"+idn).val("");
		$("#qtyOutreq"+idn).val("");
		$("#remark"+idn).val("");

		$("#nmItem"+idn+" option:eq(0)").attr("selected", "selected");
		$("#specItem"+idn+" option:eq(0)").attr("selected", "selected");
		$("#change"+idn+" option:eq(0)").attr("selected", "selected");
		
		$("#specItem"+idn).attr("disabled", "disabled");
		$("#change"+idn).attr("disabled", "disabled");
		$("#specItem"+idn).addClass("readonly");
		$("#change"+idn).addClass("readonly");



	}
	//품목 검색
	fetchNmItem = async (e) => {
			const items1 = await Promise.all([ 
				service.retrieveItemNmList(e.target.value)
			]);
			var items1_list = items1[0].data.result;
			$("."+e.target.id).html('<option value="">선택</option>');
			for(var count = 0; count < items1_list.length; count++){
				$("."+e.target.id).append('<option value="'+items1_list[count]['nmItem']+'">'+items1_list[count]['nmItem']+'</option>');
			}
			$("."+e.target.id).removeClass("readonly");
			$("."+e.target.id).prop("disabled",false);

	}
	//규격 검색
	fetchSpecItem = async (e) => {

			const items1 = await Promise.all([ 
				service.retrieveItemInfoSpecList(e.target.value)
			]);
			var items1_list = items1[0].data.result;
			$("."+e.target.id).html('<option value="">선택</option>');
			for(var count = 0; count < items1_list.length; count++){
				$("."+e.target.id).append('<option value="'+items1_list[count]['specItem']+'">'+items1_list[count]['specItem']+'</option>');
			}
			$("."+e.target.id).removeClass("readonly");
			$("."+e.target.id).prop("disabled",false);
	}

	//현재고수량 검색 여기부터 
	fetchItemChangeInfo = async (e) => {
			var idn = e.target.id.replace("change","");
			var nmItem = $(".nmItem"+idn).val();

			const items1 = await Promise.all([ 
				service.retrieveItemChangeInfo(nmItem,e.target.value)
			]);
			var items1_data = items1[0].data.result;
			$("#cdItem"+idn).val( items1_data.cdItem );

			$("#cdUnit"+idn).val( items1_data.cdUnit );
			if(typeof $("#qtyRemReal"+idn).val() !== undefined){
				$("#qtyRemReal"+idn).val( items1_data.qtyRemReal );
			}

	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	

	
		try {
			const common = await Promise.all([ 
				service.retrieveConstItemMatList(this.props.match.params.idx)
			]);
			var result = common[0].data.result;
			//config.table_details.info = result;

			for(var count = 0; count < result.length; count++){
				var td = '<tr>';
				td = td + '<td>'+((result[count]['cdItem']) ? result[count]['cdItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtPrc']) ? result[count]['amtPrc'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyConst']) ? result[count]['qtyConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtConst']) ? result[count]['amtConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyMat']) ? result[count]['qtyMat'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyJungsan']) ? result[count]['qtyJungsan'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOutReturn']) ? result[count]['qtyOutReturn'] : '')+'</td>'
				td = td + '<td>'+((result[count]['lessQty']) ? result[count]['lessQty'] : '')+'</td>'
				td = td + '</tr>';
				$(".tab-contents1 .grp_itemmat_list tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".tab-contents1 .grp_itemmat_list tbody").html('<tr><td colspan="12">검색 결과가 없습니다.</td></tr>');
			}

			var table_height = $(window).height() - 310;//(350 === header, footer)
			$(".grp_itemmat_list").height(table_height);



		} catch(err){
				$(".message").html("&nbsp;");
				$(".tab-contents1 .grp_itemmat_list tbody").html('<tr><td colspan="12">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}


	subContents = async (sub_index,reload) => { 	
		$(".tab-contents1").css("display","none");
		$(".tab-contents2").css("display","none");
		$(".tab-contents3").css("display","none");
		
		$(".sub-tab .a01").removeClass("active");
		$(".sub-tab .a02").removeClass("active");
		$(".sub-tab .a03").removeClass("active");
		$(".sub-tab .a0"+sub_index).addClass("active");
	

			$(".tab-contents"+sub_index).css("display","block");
			if(sub_index === 2){
				if(reload === 1){
					$(".grp_itemmat_list2 tbody").html('');
				}
				if($(".grp_itemmat_list2 tbody").html()===''){
					config.detail_file.name="retrieveOutreqDtlList";
					const common = await Promise.all([ 
						service.getDetail(config.detail_file.folder1, config.detail_file.folder2, config.detail_file.name, config.table.index)
					]);
					var result = common[0].data.result;

					for(var count = 0; count < result.length; count++){
						var td = '<tr>';
						td = td + '<td>'+(count+1)+'</td>'
						td = td + '<td>'+((result[count]['noOutreq']) ? result[count]['noOutreq'] : '')+'</td>'
						td = td + '<td>'+((result[count]['dtOutreq']) ? result[count]['dtOutreq'] : '')+'</td>'
						td = td + '<td>'+((result[count]['nmKor']) ? result[count]['nmKor'] : '')+'</td>'
						td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
						td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
						td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
						td = td + '<td>'+((result[count]['qtyOrdreq']) ? result[count]['qtyOrdreq'] : '')+'</td>'
						td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
						td = td + '<td>'+((result[count]['qtyExtra']) ? result[count]['qtyExtra'] : '')+'</td>'
						td = td + '<td>'+((result[count]['qtyOutreq']) ? result[count]['qtyOutreq'] : '')+'</td>'
						td = td + '</tr>';
						$(".grp_itemmat_list2 tbody").append(td);
					}

					var table_height = $(window).height() - 490;//(350 === header, footer)
					$(".grp_itemmat_list2").height(table_height);
				}


			}else if(sub_index === 3){
				if(reload === 1){
					$(".grp_itemmat_list3 tbody").html('');
				}
				if($(".grp_itemmat_list3 tbody").html()===''){
					config.detail_file.name="retrieveOrdreqDtlList";
					const common = await Promise.all([ 
						service.getDetail(config.detail_file.folder1, config.detail_file.folder2, config.detail_file.name, config.table.index)
					]);
					var result = common[0].data.result;
					
					//console.log(result);

					for(var count = 0; count < result.length; count++){
						var td = '<tr>';
						td = td + '<td>'+(count+1)+'</td>'
						td = td + '<td>'+((result[count]['noOrdreq']) ? result[count]['noOrdreq'] : '')+'</td>'
						td = td + '<td>'+((result[count]['dtOrdreq']) ? result[count]['dtOrdreq'] : '')+'</td>'
						td = td + '<td>'+((result[count]['nmKor']) ? result[count]['nmKor'] : '')+'</td>'
						td = td + '<td>'+((result[count]['nmDept']) ? result[count]['nmDept'] : '')+'</td>'
						td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
						td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
						td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
						td = td + '<td>'+((result[count]['qtyOrdreq']) ? result[count]['qtyOrdreq'] : '')+'</td>'
						td = td + '</tr>';
						$(".grp_itemmat_list3 tbody").append(td);
					}

					var table_height = $(window).height() - 490;//(350 === header, footer)
					$(".grp_itemmat_list3").height(table_height);
				}

			}else{
			
				config.detail_file.name="retrieveConstItemMatList";
				//
			}

	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공사관리";
		$(".header_title").html( "공사관리");
		
		config.fetchStrCode2("ERP","CG_Z_00005","divItem");

		config.detail_file.folder1="constManage";
		config.detail_file.folder2="ConstController";
		config.detail_file.name="retrieveConstItemMatList";

		this.fetchSearch(1);
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab3">
						<h2>현장별 자재사용내역</h2>
					</div>
					<div className="wrap">
						<div className="box sub-tab tab3">
							<button type="button" onClick={() => this.subContents(1,0)} className="a01 active"><span>자재사용내역</span></button>
							<button type="button" onClick={() => this.subContents(2,0)} className="a02"><span>출고요청</span></button>
							<button type="button" onClick={() => this.subContents(3,0)} className="a03"><span>구매요청</span></button>
						</div>
						<div className="tab-contents1">
							<div className="box table">
								<div id="gridBox">
									<div id="gridHeader" className="why mw1000">
										<table>
											<colgroup>
												<col width="80"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="80"/>
												<col width="100"/>
												<col width="80"/>
												<col width="70"/>
												<col width="70"/>
												<col width="100"/>
												<col width="70"/>
												<col width="70"/>
												<col width="70"/>
											</colgroup>
											<thead>
												<tr>
													<th>품목코드</th>
													<th>품목</th>
													<th>규격</th>
													<th>단위</th>
													<th>단가</th>
													<th>소요수량</th>
													<th>소요금액</th>
													<th>출고수량</th>
													<th>사용수량</th>
													<th>정산수량</th>
													<th>반입수량</th>
													<th>공손수량</th>
												</tr>
											</thead>
										</table>
									</div>
									<div id="gridContainer" className="mw1000 grp_itemmat_list">
										<table>
											<colgroup>
												<col width="80"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="80"/>
												<col width="100"/>
												<col width="80"/>
												<col width="70"/>
												<col width="70"/>
												<col width="100"/>
												<col width="70"/>
												<col width="70"/>
												<col width="70"/>
											</colgroup>
											<tbody>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className="tab-contents2">
							<h2 className="wrap-head">출고요청<button type="button" className="btn-right" onClick={() => this.btnRequest(2)}><img src={btn_request} height="17" height="16"  alt="" /><span>출고요청</span></button></h2>
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
											<th>품목분류</th>
											<td><select className="divItem" id="nmItem2" onChange={this.fetchNmItem}><option value="">선택</option></select></td>
											<th>품목</th>
											<td><select className="nmItem nmItem2 readonly" disabled id="specItem2" onChange={this.fetchSpecItem}><option value="">선택</option></select></td>
											<th>규격</th>
											<td><select className="specItem specItem2 readonly" disabled id="change2" onChange={this.fetchItemChangeInfo}><option value="">선택</option></select></td>
											<th>단위</th>
											<td><input type="text" className="readonly cdUnit" id="cdUnit2"  readOnly /></td>
										</tr>
										<tr>
											<th>현재고수량</th>
											<td><input type="text" className="readonly qtyRemReal" id="qtyRemReal2" readOnly /></td>
											<th>요청수량</th>
											<td><input type="text" className="qtyOutreq"  id="qtyOutreq2" /></td>
											<th>비고</th>
											<td colSpan="3"><input type="text" className="remark" id="remark2" /><input type="hidden" id="cdItem2" /></td>
										</tr>
									</tbody>
								</table>
							</div>
							
							<h2 className="wrap-head">출고요청내역</h2>
							<div className="box table">
								<div id="gridBox">
									<div id="gridHeader_2" className="why mw1000">
										<table>
											<colgroup>
												<col width="50"/>
												<col width="100"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="100"/>
												<col width="100"/>
												<col width="80"/>
												<col width="80"/>
												<col width="80"/>
												<col width="80"/>
												<col width="80"/>
											</colgroup>
											<thead>
												<tr>
													<th>번호</th>
													<th>출고요청번호</th>
													<th>요청일자</th>
													<th>요청자</th>
													<th>품목</th>
													<th>규격</th>
													<th>단위</th>
													<th>구매요청수량</th>
													<th>출고수량</th>
													<th>현재고수량</th>
													<th>출고요청수량</th>
												</tr>
											</thead>
										</table>
									</div>
									<div id="gridContainer_2" className="mw1000 grp_itemmat_list2">
										<table>
											<colgroup>
												<col width="50"/>
												<col width="100"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="100"/>
												<col width="100"/>
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
						</div>
						<div className="tab-contents3">
							<h2 className="wrap-head">구매요청<button type="button" className="btn-right" onClick={() => this.btnRequest(3)}><img src={btn_request} height="17" height="16" /><span>구매요청</span></button></h2>
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
											<th>품목분류</th>
											<td><select className="divItem" id="nmItem3" onChange={this.fetchNmItem}><option value="">선택</option></select></td>
											<th>품목</th>
											<td><select className="nmItem nmItem3 readonly" disabled id="specItem3"  onChange={this.fetchSpecItem}><option value="">선택</option></select></td>
											<th>규격</th>
											<td><select className="specItem specItem3 readonly" disabled id="change3" onChange={this.fetchItemChangeInfo}><option value="">선택</option></select></td>
											<th>단위</th>
											<td><input type="text" className="readonly cdUnit" id="cdUnit3"  readOnly /></td>
										</tr>
										<tr>
											<th>요청수량</th>
											<td><input type="text" className="qtyOutreq" id="qtyOutreq3"  /></td>
											<th>비고</th>
											<td colSpan="5"><input type="text" className="remark" id="remark3" /><input type="hidden" id="cdItem3" /></td>
										</tr>
									</tbody>
								</table>
							</div>
							<h2 className="wrap-head">구매요청내역</h2>
							<div className="box table">
								<div id="gridBox">
									<div id="gridHeader_3" className="why mw1000">
										<table>
											<colgroup>
												<col width="50"/>
												<col width="100"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="100"/>
												<col width="100"/>
												<col width="80"/>
												<col width="80"/>
												<col width="80"/>
											</colgroup>
											<thead>
												<tr>
												<th>번호</th>
												<th>구매요청번호</th>
												<th>요청일자</th>
												<th>요청자</th>
												<th>부서</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>구매요청수량</th>
												</tr>
											</thead>
										</table>
									</div>
									<div id="gridContainer_3" className="mw1000 grp_itemmat_list3">
										<table>
											<colgroup>
												<col width="50"/>
												<col width="100"/>
												<col width="auto"/>
												<col width="80"/>
												<col width="100"/>
												<col width="100"/>
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
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveConstItemMatList;