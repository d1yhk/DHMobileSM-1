/*ppt 178 공사관리 현장별 자재사용내역 */
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";
import PopupConst from '../../components/PopupConst';

import PopupUser from '../../components/PopupUser';
import btnback from '../../image/btn_back.png';

import footer_timelist from '../../image/footer_timelist.png';




import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);

class retrieveConstItem extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveConstItem'){
			config.back.url.push('/retrieveConstItem');
		}
		if(config.table_name.file !== "retrieveConstItem"){
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
				startDate: null,//new Date(),
				endDate: null//new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
	}
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}
	endDateChange(date) {
			this.setState({
					endDate: date
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
					td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtDigFr']) ? result[count]['dtDigFr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['dtDigTo']) ? result[count]['dtDigTo'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtDesmat']) ? result[count]['amtDesmat'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtConstmat']) ? result[count]['amtConstmat'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtCha']) ? result[count]['amtCha'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmCom']) ? result[count]['nmCom'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noEmpDir']) ? result[count]['noEmpDir'] : '')+'</td>'
					td = td + '<td>'+((result[count]['rsnLossMat']) ? result[count]['rsnLossMat'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_item_list tbody").html(td);
		}else{
			$(".grp_item_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_item_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var nmEmpDir = config.form_search(search_type,'nmEmpDir');
		var ymConstPlnFr = config.form_search(search_type,'ymConstPlnFr');
		var ymConstPlnTo = config.form_search(search_type,'ymConstPlnTo');
		var cdCom = config.form_search(search_type,'cdCom');



		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_item_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveConstItemList(idConst,nmConst,nmEmpDir,ymConstPlnFr,ymConstPlnTo,cdCom,(this.page.page * 100),100)
			]);
						if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_item_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_item_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_item_list tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	userInfo = () =>{
		$(".popup").css("display","block");
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공사관리";
		$(".header_title").html( "공사관리");
		
		config.table_name.file = 'retrieveConstItem';


		config.fetchStrCode("ERP","CG_Z_00104","cdCom");
		

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

			$(".grp_item_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_item_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_item_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_item_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_item_list").scrollTop() >= ($(".grp_item_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_item_list tr");
		$(document).on("click",".grp_item_list tr",function(){
			$(".grp_item_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});


			config.grpifm.scroll = $(".grp_item_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			var id = config.grpifm.list[config.grpifm.select_no].idConst;

			config.detail_file.index = id;

		});

	}

	popupConst = () => {
		$(".const-form").css("display","block");
		$(".const-form").removeClass("type0");
		$(".const-form").addClass("type0");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser  />
				<PopupConst  />
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>현장별 자재사용내역</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>공사ID</label>
											<input type="text" id="idConst" readOnly className="idConst readonly" onClick={()=>this.popupConst()} />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										<div className="form3">
											<label>공사명</label>
											<input type="text" id="nmConst" readOnly className="nmConst readonly" onClick={()=>this.popupConst()} />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										{/*사용자 정보 팝업*/}
										<div className="form3">
											<label>공사감독</label>
											<input type="text" id="nmEmpDir" className="nmSelect readonly" readOnly onClick={() => this.userInfo()} />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>

										<div className="form3">
											<label>준공완료일</label>
											<DatePicker
												 locale="ko" 
												id="ymConstPlnFr"
												className="datepicker"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form3">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="ymConstPlnTo"
												className="datepicker"
												selected={this.state.endDate}
												onChange={this.endDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>
										<div className="form3">
											<label>시공업체</label>
											<select id="cdCom">
												<option value="">전체</option>
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
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>공사ID</th>
												<th>공사명</th>
												<th>공사시작</th>
												<th>공사종료</th>
												<th>계획금액</th>
												<th>소요금액</th>
												<th>증감</th>
												<th>시공업체</th>
												<th>공사감독</th>
												<th>공손사유</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_item_list">
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
						<button type="button" className="btn_file" onClick={() => config.fetchDetail(this.props,'retrieveConstItemMatList')} ><img alt="" src={footer_timelist} width="15" height="15" />자재사용내역</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveConstItem;