
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


class retrieveItem extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveItem'){
			config.back.url.push('/retrieveItem');
		}
		if(config.table_name.file !== "retrieveItem"){
			config.detail_file.index = "";

			config.grpifm.select_no=-1;
			config.grpifm.search={};
			config.grpifm.list=[];
			config.grpifm.form = [];
			config.table.param1="";
			config.table.param2="";
			config.table.param3="";
			config.table.attach1="";
			config.table.attach2="";
			config.table.attach3="";
			config.table.attach4="";
			config.table.attach5="";
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

	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['cdItem']) ? result[count]['cdItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyRemReal']) ? result[count]['qtyRemReal'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtPrc']) ? result[count]['amtPrc'] : '')+'</td>'
				td = td + '<td>'+((result[count]['allAmtPrc']) ? result[count]['allAmtPrc'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtySafe']) ? result[count]['qtySafe'] : '')+'</td>'
				td = td + '<td><input type="text" value="'+((result[count]['qtyReal']) ? result[count]['qtyReal'] : '0')+'" data-value="'+((result[count]['qtyReal']) ? result[count]['qtyReal'] : '0')+'" class="list_input"/></td>'
				td = td + '<td>'+((result[count]['dtReal']) ? result[count]['dtReal'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyRe']) ? result[count]['qtyRe'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_item_list2 tbody").html(td);
		}else{
			$(".grp_item_list2 tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_item_list2 tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtItem = config.form_search(search_type,'dtItem');
		var cdItem = config.form_search(search_type,'cdItem');
		var ynQtySafe = config.form_search(search_type,'ynQtySafe');
		var YnQtyRemReal = config.form_search(search_type,'YnQtyRemReal');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_item_list2 tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveItemList(dtItem,cdItem,ynQtySafe,YnQtyRemReal,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_item_list2 tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}

			}else{
				$(".message").html("&nbsp;");
				$(".grp_item_list2 tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_item_list2 tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	//실사저장
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var data=[];
			var saver=0;
			$(".grp_item_list2 tr").each(function(){
				if( $(this).find("input").val() !== $(this).find("input").attr("data-value") ){
					data.push({cdItem:$(this).find("td:eq(0)").html(),qtyReal:$(this).find("input").val()});
					saver=1;
				}
			});
			
			if(saver === 1){
				const save = await Promise.all([ 
					service.modifyItemListReal(data)
				]);
				alert(save[0].data.message);
			}else{
				alert("수정된 내역이 없습니다.");
			}
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		config.table_name.file = "retrieveItem"

		config.fetchStrCode("ERP","CG_Z_00005","cdItem");
		
		if(config.grpifm.list.length > 0 ){
			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
				}
			});
			let result = config.grpifm.list;
			this.page.total = (result.length);
			this.lists(result,1,0);

			$(".grp_item_list2 tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_item_list2").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_item_list2 tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}
		var t = this;
	
		$(".grp_item_list2").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_item_list2").scrollTop() >= ($(".grp_item_list2 tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_item_list2 tr");
		$(document).on("click",".grp_item_list2 tr",function(){
			config.grpifm.scroll = $(".grp_item_list2").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_item_list2 tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			var id = config.grpifm.list[config.grpifm.select_no].cdItem;
		});
	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>자재 현황</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>기준일자</label>
											<DatePicker
												 locale="ko" 
												id="dtItem"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form4">
											<label>품목분류</label>
											<select id="cdItem">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>안전재고</label>
											<select id="ynQtySafe">
												<option value="">선택</option>
												<option value="Y">Y</option>
												<option value="N">N</option>
											</select>
										</div>
										<div className="form4">
											<label>수량유무</label>
											<select id="YnQtyRemReal">
												<option value="">선택</option>
												<option value="Y">Y</option>
												<option value="N">N</option>
											</select>
										</div>
									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>품목코드</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>현재고수량</th>
												<th>단가</th>
												<th>금액</th>
												<th>안전재고수량</th>
												<th>실사수량</th>
												<th>실사일자</th>
												<th>증감</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_item_list2">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="120"/>
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
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" onClick={() => this.btnSave()} ><img alt="" src={btn_save} width="17" height="16" />실사저장</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItem;