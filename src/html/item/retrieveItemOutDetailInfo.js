/* ppt169 자재출고 출고품목 */
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";



import btnback from '../../image/btn_back.png';
import btn_save from '../../image/btn-save.png';
import btn_remove from '../../image/btn-remove.png';
import btn_add from '../../image/btn_add.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveItemOutDetailInfo extends Component {
	
	constructor(props) {
		super(props);
		this.current = -1;
		this.info_list = [];
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOutDetailInfo/'+this.props.match.params.idx){
			config.back.url.push('/retrieveItemOutDetailInfo/'+this.props.match.params.idx);
		}
		this.state = {
				startDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
	}

	startDateChange(date) {
		this.setState({
			startDate: date
		});
	}
	//출고 품목추가
	btnAdd = async () => {
		this.props.history.push("/retrieveItemOutreqDtlList/"+this.props.match.params.idx);
	}

	//입고 품목삭제
	btnRemove = async () => {
		if(this.current >= 0 ){
			if(window.confirm("삭제 하시겠습니까?")){
				const info = await Promise.all([ 
					service.deleteItemOutDtl(this.info_list[this.current].seqOut,this.info_list[this.current].gbOut,this.info_list[this.current].noOut)
				]);
				console.log(info[0]);
				if(info[0].data.code === "1"){
					this.info_list.splice(this.current, 1);
					$(".out_detail_info tr:eq("+this.current+")").remove();
					this.current = -1;
				}
				alert(info[0].data.message);
			}
		}else{
			alert("리스트를 선택해주세요");
		}
	}


	//출고품목정보 저장
	infoSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var j=0;
			var t= this;
			$(".new").each(function(){
				config.item_select[j]['dtIn'] = $(this).find("input:eq(0)").val();
				config.item_select[j]['lnPartner'] = $(this).find("input:eq(1)").val();
				config.item_select[j]['qtyOrd'] = $(this).find("input:eq(2)").val();
				j++;
			});
			//뭘 어떻게 저장하라는 거지?
			const info = await Promise.all([ 
				service.createItemOutDtlList(config.item_select)
			]);
			alert(info[0].data.message);
		}
	}


	fetchInfo = async () => { 

		const info = await Promise.all([ 
			service.retrieveItemOutDetailInfo(this.props.match.params.idx)
		]);

		var result = info[0].data.result;

		$.each(result, function(key, value){
			$(".info ."+key).html(value);
		});
		//console.log(info);
	}

	lists = (result,stype,search_type) => {
		var td = ''; 	
		//$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['seqOut']) ? result[count]['seqOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbOut']) ? result[count]['gbOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcOut']) ? result[count]['prcOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtOut']) ? result[count]['amtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".out_detail_info tbody").html(td);
		}else{
			$(".out_detail_info tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".out_detail_info tbody").html('<tr><td colspan="10">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		try {
			const common = await Promise.all([ 
				service.retrieveItemOutDtlList(this.props.match.params.idx)
			]);
			var result = common[0].data.result;
			this.info_list = result;
			for(var count = 0; count < result.length; count++){
				td = td + '<tr>';
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['seqOut']) ? result[count]['seqOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbOut']) ? result[count]['gbOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcOut']) ? result[count]['prcOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtOut']) ? result[count]['amtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
				td = td + '</tr>';
				$(".out_detail_info tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".out_detail_info tbody").html('<tr><td colspan="10">검색 결과가 없습니다.</td></tr>');
			}
			var table_height = $(window).height() - 420;//(350 === header, footer)
			$(".out_detail_info").height(table_height);

	
		} catch(err){
				$(".message").html("&nbsp;");
				$(".out_detail_info tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}

	
		
		var result = config.item_select;
		
		if($(".out_detail_info tbody td:eq(0)").html()=="검색 결과가 없습니다."){
			$(".out_detail_info tbody").html("");
		}
		for(var count=0; count < result.length; count++){
			//this.info_list.unshift(result[count]);
			var td = '<tr class="new">';
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['seqOut']) ? result[count]['seqOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbOut']) ? result[count]['gbOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcOut']) ? result[count]['prcOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtOut']) ? result[count]['amtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noIn']) ? result[count]['noIn'] : '')+'</td>'
			td = td + '</tr>';
			$(".out_detail_info tbody").prepend(td);
		}
	}
	
	//입고 품목 수정
	btnModify = async () => {
		if(this.current === ""){
			alert("수정할 출고품목을 선택해주세요");
		}else{
			/*
			const modify = await Promise.all([ 
				service.modifyItemInDtl(this.info_list[this.current].noIn,this.info_list[this.current].seqIn,$(".modify input:eq(0)").val(),$(".modify input:eq(1)").val(),$(".modify input:eq(2)").val())
			]);
			alert(modify[0].data.message);
			console.log(modify)
				*/
		
		}
	}


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");

		this.fetchInfo();
		this.fetchSearch(1);
		
		var t = this;
		//테이블 리스트 선택
		$(document).off("click",".out_detail_info tr");
		$(document).on("click",".out_detail_info tr",function(){
			$(".out_detail_info tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			t.current = $(this).index();
			
			/*
			$(".modify input:eq(0)").val(t.info_list[t.current].qtyOut);
			$(".modify input:eq(1)").val(t.info_list[t.current].prcOut);
			$(".modify input:eq(2)").val(t.info_list[t.current].amtOut);
			$(".modify input:eq(3)").val(t.info_list[t.current].remark);
			*/

		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>출고품목</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">출고 상세정보</h2>
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
										<th>출고번호</th>
										<td className="noOut"></td>
										<th>출고일자</th>
										<td className="gbOut"></td>
										<th>출고구분</th>
										<td className="dtOut"></td>
										<th>확인상태</th>
										<td className="stDecision"></td>
									</tr>
									<tr>
										<th>공사ID</th>
										<td className="idConst"></td>
										<th>공사명</th>
										<td className="nmConst" colSpan="5"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">출고품목<button type="button" className="btn_min_save" onClick={this.infoSave}><img src={btn_save} width="16" height="16" alt="" />품목정보저장</button></h2>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="auto"/>
											<col width="80"/>
											<col width="70"/>
											<col width="150"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>공사</th>
												<th>출고일련번호</th>
												<th>출고구분</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>출고수량</th>
												<th>출고단가</th>
												<th>출고금액</th>
												<th>입고번호</th>
											</tr>
										</thead>
									</table>
								</div>
								<div className="out_detail_info mw1000" >
									<table>
										<colgroup>
											<col width="auto"/>
											<col width="80"/>
											<col width="70"/>
											<col width="150"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						{/*
						<h2 className="wrap-head">출고품목 수정</h2>
						<div className="box table">
							<div className="mw1000 modify">
								<table >
									<colgroup>
										<col width="140"/>
										<col width="auto"/>
										<col width="140"/>
										<col width="auto"/>
										<col width="140"/>
										<col width="auto"/>
										<col width="140"/>
										<col width="auto"/>
									</colgroup>
									<tfoot>
										<tr>
											<th>출고수량</th>
											<td><input type="text" /></td>
											<th>출고단가</th>
											<td><input type="text" /></td>
											<th>출고금액</th>
											<td><input type="text" /></td>
											<th>비고</th>
											<td><input type="text" /></td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
						*/}
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" onClick={this.btnRemove}><img alt="" src={btn_remove} width="15" height="15" />출고품목삭제</button>
						<button type="button" onClick={this.btnAdd}><img alt="" src={btn_add} width="15" height="15" />출고품목추가</button>
		{/*<button type="button" onClick={this.btnModify}><img alt="" src={btn_save} width="15" height="15" />출고품목수정</button>*/}

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemOutDetailInfo;