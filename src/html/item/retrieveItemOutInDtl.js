/*ppt171 자재반입 */
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import btn_save from '../../image/btn-save.png';
import icon2 from '../../image/icon2.png';
import btn_select from '../../image/btn_select.png';





import btn_remove from '../../image/btn-remove.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveItemOutInDtl extends Component {
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0 ,total:0};
		this.addType = 0;
		if(config.back.url[config.back.url.length-1] !== '/retrieveItemOutInDtl'){
			config.back.url.push('/retrieveItemOutInDtl');
		}
		if(config.table_name.file !== "retrieveItemOutInDtl"){
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
				startDate: new Date(),
				endDate: new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.option='';
	}

	startDateChange(date) {
		this.setState({
			startDate: date
		});
		
		this.itemOrdNmOrdList(date,this.state.endDate);
	}

	startDateChange2(date) {
		this.setState({
			startDate: date
		});
	}

	endDateChange(date) {
		this.setState({
			endDate: date
		});

		this.itemOrdNmOrdList(this.state.startDate,date);
	}
	endDateChange2(date) {
		this.setState({
			endDate: date
		});
	}
	btnRemove = async () => { 
//		console.log(config.grpifm.list);
		
		if(config.grpifm.select_no >= 0 ){

			if(config.grpifm.list[config.grpifm.select_no].gbOut === "20"){
				if(window.confirm("정말로 삭제하시겠습니까?")){
					const remove = await Promise.all([ 
						service.deleteItemOutInDtl(config.grpifm.list[config.grpifm.select_no].seqOut,config.grpifm.list[config.grpifm.select_no].noOut,20)
					]);
					alert(remove[0].data.message);
					if(remove[0].data.code === "1"){
						$(".outin_dt_list tbody tr:eq("+config.grpifm.select_no+")").remove();
					}
				}
			}else{
				alert("출고구분 20만 삭제 가능합니다.");
			}
		}else{
			alert("삭제할 항목을 선택해주세요");
		}
	}
	itemOrdNmOrdList = async (date1,date2) => { 

		config.detail_file.index = "";
		config.table.attach1="";

		var dtOrdFr = config.formatDate(date1,"");
		var dtOrdTo = config.formatDate(date2,"");

		const nord_list = await Promise.all([ 
			service.retrieveItemOutNmList(dtOrdFr,dtOrdTo)
		]);
		$("#noOut").html('<option value="">선택</option>');
		var nord = nord_list[0].data.result;
		config.grpifm.nord_list = nord;
		for(var count = 0; count < nord.length; count++){
			$("#noOut").append('<option value="'+nord[count].noOut+'">'+nord[count].nmConst+'</option>');
		}

	}

	lists = (result,stype,search_type) => {
		var td = ''; 	
//		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");

		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}

				td =  td + '<tr class="done">';
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['seqOut']) ? result[count]['seqOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbOut']) ? result[count]['gbOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['NmDept']) ? result[count]['NmDept'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noOutreq']) ? result[count]['noOutreq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyOut']) ? result[count]['qtyOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbReitem']) ? result[count]['gbReitem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['prcOut']) ? result[count]['prcOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['amtOut']) ? result[count]['amtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".outin_dt_list tbody").html(td);
		}else{
			$(".outin_dt_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".outin_dt_list tbody").html('<tr><td colspan="14">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var dtOrdFr = config.form_search(search_type,'dtOrdFr');
		var dtOrdTo = config.form_search(search_type,'dtOrdTo');
		var noOut = config.form_search(search_type,'noOut');
		if(noOut === ""){
			alert("출고정보를 선택해주세요");
			return;
		}
		
		//검색 초기화
		if(search_type===1){
//			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".outin_dt_list tbody").html("");
			config.grpifm.list=[];

			config.grpifm.select_no = -1;
		}

		try {
			const common = await Promise.all([ 
				service.retrieveItemOutInDtlList(dtOrdFr,dtOrdTo,noOut)
			]);
			var result = common[0].data.result;
			this.page.total = (result.length + ((this.page.page) * 100));
			this.lists(result,0,search_type);
	
			if(this.page.type === 0){
				this.page.num = $(".outin_dt_list tbody").height() / 2;
				this.page.type=1;
				config.setWindowHeight();
			}
		} catch(err){
//				$(".message").html("&nbsp;");
				$(".outin_dt_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	//입고품목정보 저장
	infoSave = async () => { 
//d. 품목정보저장 /item/itemController/createItemOutInDtlList.do
//parameter – 수정된 ROW 전체, 출고 상세정보, 출고구분(gbOut - 20)

		if(window.confirm("저장 하시겠습니까?")){
			var j=0;
			var t= this;
			$(".new").each(function(){
				console.log(config.item_select[j]);
				config.item_select[j]['qtyOut'] = $(this).find("input:eq(0)").val();
				config.item_select[j]['gbReitem'] = $(this).find("select:eq(0)").val();
				config.item_select[j]['prcOut'] = $(this).find("input:eq(1)").val();
				config.item_select[j]['remark'] = $(this).find("input:eq(2)").val();

				config.item_select[j]['token2']=config.user.token2;
				config.item_select[j]['idUser']=config.user.id;
				j++;
			});
			//console.log("a");
			//console.log(config.item_select);
			const info = await Promise.all([ 
				service.createItemOutInDtlList(config.item_select)
			]);

			if(info[0].data.code === "1"){
				$(".in_detail_info tbody").html("");
				config.item_select.length=0;
				this.fetchSearch(1);
			}
			alert(info[0].data.message);
		}
	}
	CG_M_00010 = async () => { 
		const common = await Promise.all([ service.getStrCode("ERP","CG_M_00010")]);
		console.log(common);
		var result = common[0].data.result;
		for(var count = 0; count < result.length; count++){
			this.option += (("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
		

		$(".outin_dt_list").find("select").html('<option value="">선택</option>'+this.option);
	}

	componentDidMount() {

		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "자재관리";
		$(".header_title").html( "자재관리");
		config.table_name.file = "retrieveItemOutInDtl"
		var t= this;

		this.CG_M_00010();
		//erp CG_M_00010

		if(config.grpifm.list.length > 0 ){

			$("#noOut").html('<option value="">선택</option>');
			for(var count = 0; count < config.grpifm.nord_list.length; count++){
				$("#noOut").append('<option value="'+config.grpifm.nord_list[count].noOut+'">'+config.grpifm.nord_list[count].nmConst+'</option>');
			}

			var gs = config.grpifm.search;
			$.each(gs, function(key, value){
				if(value!==""){
					$("#"+key).val(value);
					if(key === "dtOrdFr"){
						var y = value.substr(0,4),
						m = value.substr(4,2) - 1,
						d = value.substr(6,2);
						t.startDateChange2( new Date(y,m,d) )
					}
					if(key === "dtOrdTo"){
						var y = value.substr(0,4),
						m = value.substr(4,2) - 1,
						d = value.substr(6,2);
						t.endDateChange2( new Date(y,m,d) )
					}
				}
			});
			
			let result = config.grpifm.list;
			this.page.total = (result.length);
			this.lists(result,1,0);

			$(".outin_dt_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".outin_dt_list").scrollTop( config.table_height.height );
				$("#noOut").val(gs.noOut);
			},500);
			this.page.num = $(".outin_dt_list tbody").height() / 2;
			this.page.type=1;
			
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{

		}


		//this.fetchSearch(0);

		var result = config.item_select;
		for(var count=0; count < result.length; count++){
			var read = '';
			//if(result[count]['qtyOut'] < 0){
			//	read = ' readonly';
			//}
			var td = '<tr class="new">';
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['seqOut']) ? result[count]['seqOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['gbOut']) ? result[count]['gbOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['dtOut']) ? result[count]['dtOut'] : '')+'</td>'
				td = td + '<td>'+((result[count]['NmDept']) ? result[count]['NmDept'] : '')+'</td>'
				td = td + '<td>'+((result[count]['noOutreq']) ? result[count]['noOutreq'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmItem']) ? result[count]['nmItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['specItem']) ? result[count]['specItem'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cdUnit']) ? result[count]['cdUnit'] : '')+'</td>'
				td = td + '<td><input type="text" value="'+((result[count]['qtyOut']) ? -result[count]['qtyOut'] : '0')+'" data-qty="'+((result[count]['qtyOut']) ? -result[count]['qtyOut'] : '0')+'" class="input-wrap oncalcu'+read+'" '+read+' /></td>'
				td = td + '<td><select class="select-wrap"></select></td>'
				td = td + '<td><input type="text" value="'+((result[count]['prcOut']) ? result[count]['prcOut'] : '0')+'" class="input-wrap oncalcu'+read+'" '+read+'/></td>'
				td = td + '<td class="cal">'+((result[count]['amtOut']) ? -result[count]['amtOut'] : '')+'</td>'
				td = td + '<td><input type="text" value="'+((result[count]['remark']) ? result[count]['remark'] : '')+'" class="input-wrap" /></td>'
			td = td + '</tr>';
			$(".outin_dt_list tbody").prepend(td);
		}



		//테이블 리스트 선택
		$(document).off("keyup",".oncalcu");
		$(document).on("keyup",".oncalcu",function(){
			var pa = $(this).parent().parent();
			pa.find(".cal").html(parseInt(pa.find("input:eq(0)").val()) * parseInt(pa.find("input:eq(1)").val())) 
		});

		//테이블 리스트 선택
		$(document).off("click",".outin_dt_list tr");
		$(document).on("click",".outin_dt_list tr",function(){
			config.grpifm.scroll = $(".outin_dt_list").scrollTop();
			if($(this).attr("class").indexOf("done") >= 0 ){
				config.grpifm.select_no = $(this).index();
				$(".outin_dt_list tr").css({"background-color":"transparent"});
				$(this).css({"background-color":"#eee"});
				
				var id = config.grpifm.list[config.grpifm.select_no].noIn;

				//config.table.attach2=config.grpifm.list[config.grpifm.select_no].noOut;
				config.detail_file.index = id;
			}
		});
	}
	fetchDetail=()=>{
		if($("#noOut").val() == ""){
			alert("출고정보를 선택해주세요");
		}else{
			this.props.history.push("/retrieveItemOutInList/"+$("#noOut").val());
		}
	}
	noOutChange = ()=>{
		config.table.attach1="자재반입";
		config.table.attach2 = $("#noOut").val();
	}
	
	render() { 

		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;" ><span>자재 반입</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>출고일자</label>
											<DatePicker
												locale="ko" 
												id="dtOrdFr"
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
											<label>~</label>
											<DatePicker
												locale="ko" 
												id="dtOrdTo"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyyMMdd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form2">
											<label>출고정보</label>
											<select id="noOut" onChange={this.noOutChange}>
												<option value="">선택</option>
											</select>
										</div>

									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>검색</button>
								</fieldset>
							</form>
						</div>
						
						<h2 className="wrap-head">출고/반입 품목<button type="button" className="btn_min_save" onClick={this.infoSave}><img src={btn_save} width="16" height="16" alt="" /><span>품목정보저장</span></button></h2>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why">
									<table>
										<colgroup>
											<col width="200"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="200"/>
										</colgroup>
										<thead>
											<tr>
												<th>공사</th>
												<th>출고일련번호</th>
												<th>출고구분</th>
												<th>출고일자</th>
												<th>출고부서</th>
												<th>출고요청번호</th>
												<th>품목</th>
												<th>규격</th>
												<th>단위</th>
												<th>출고수량</th>
												<th>반입품목구분</th>
												<th>출고단가</th>
												<th>출고금액</th>
												<th>비고</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="outin_dt_list">
									<table>
										<colgroup>
											<col width="200"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="120"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
											<col width="200"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMoveSelect(this.props,'retrieveItemOutInList','자재반입')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>

						<button type="button" onClick={this.btnRemove} ><img alt="" src={btn_remove} width="15" height="15" />반입품목삭제</button>
						<button type="button" onClick={() => this.fetchDetail()} ><img alt="" src={btn_select} width="15" height="15" />반입품목선택</button>

							

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveItemOutInDtl;