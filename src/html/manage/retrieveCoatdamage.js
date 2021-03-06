
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';


import DatePicker, { registerLocale } from "react-datepicker";

import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

registerLocale('ko', ko);


class retrieveCoatdamage extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveCoatdamage'){
			config.back.url.push('/retrieveCoatdamage');
		}

		if(config.table_name.file !== "retrieveCoatdamage"){
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
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		config.detail_file.index = "";
		this.state = {
				startDate: null,//new Date(),
				endDate: null,
				startDate2: null,
				endDate2: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange2 = this.endDateChange2.bind(this);
	}
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	//if(date.getTime() > this.state.endDate.getTime()){
	//	this.endDateChange(date);
	//}
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}
	startDateChange2(date) {
			this.setState({
					startDate2: date
			});
	//if(date.getTime() > this.state.endDate2.getTime()){
	//	this.endDateChange2(date);
	//}
	}
	endDateChange2(date) {
			this.setState({
					endDate2: date
			});
	}
	lists = (result,stype,search_type) => {
		var td = ''; 	
		$(".message").html("??? "+(this.page.total) +"??? ?????????????????????.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
					td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['bjdNm']) ? result[count]['bjdNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['yyPln']) ? result[count]['yyPln'] : '')+'</td>';
					td = td + '<td>'+((result[count]['probDt']) ? result[count]['probDt'] : '')+'</td>';
					td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>';
					td = td + '<td>'+((result[count]['location']) ? result[count]['location'] : '')+'</td>';
					td = td + '<td>'+((result[count]['cntDcvg']) ? result[count]['cntDcvg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['lenDcvg']) ? result[count]['lenDcvg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['damageLen']) ? result[count]['damageLen'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_coastamage_list tbody").html(td);
		}else{
			$(".grp_coastamage_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_coastamage_list tbody").html('<tr><td colspan="10">?????? ????????? ????????????.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//?????? ?????? 
	fetchSearch = async (search_type) => { 
		var bjdNm = config.form_search(search_type,'bjdNm');
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var yyPlnFr = config.form_search(search_type,'yyPlnFr');
		var yyPlnTo = config.form_search(search_type,'yyPlnTo');
		var probDtFr = config.form_search(search_type,'probDtFr');
		var probDtTo = config.form_search(search_type,'probDtTo');
		var location = config.form_search(search_type,'location');

		//?????? ?????????
		if(search_type===1){
			$(".message").html("??????????????????.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_coastamage_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([ 
				service.retrieveCoatdamageList(bjdNm,idConst,nmConst,yyPlnFr,yyPlnTo,probDtFr,probDtTo,location,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_coastamage_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_coastamage_list tbody").html('<tr><td colspan="10">?????? ???????????????. ??????????????? ???????????????.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_coastamage_list tbody").html('<tr><td colspan="10">?????? ???????????????. ??????????????? ???????????????.</td></tr>');

		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "????????????";
		$(".header_title").html( "????????????");
		config.table_name.file = 'retrieveCoatdamage';
		

		$(".message").html("??????????????????.");
		config.fetchDong("");

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

			$(".grp_coastamage_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_coastamage_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_coastamage_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

		$(".grp_coastamage_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_coastamage_list").scrollTop() >= ($(".grp_coastamage_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//????????? ????????? ??????
		$(document).off("click",".grp_coastamage_list tr");
		$(document).on("click",".grp_coastamage_list tr",function(){
			config.grpifm.scroll = $(".grp_coastamage_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_coastamage_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="???????????????";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");


			config.table.attach1="???????????????";
			config.table.attach2=$(this).find("td:eq(5)").html();		//idConst
			config.table.attach3=$(this).find("td:eq(1)").html();		//facilNo

			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

		});
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveCoatdamage" className="active"><span>???????????????</span></Link>
						<Link to="/retrieveSoilresist" ><span>???????????????</span></Link>
						<Link to="/retrievePunch" ><span>?????????</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>?????????</label>
											<select id="bjdNm" name="bjdNm">
												<option value="">??????</option>
											</select>
										</div>
										<div className="form4">
											<label>??????ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form4">
											<label>?????????</label>
											<input type="text" id="nmConst" />
										</div>
			
										<div className="form4">
											<label>????????????</label>
											<input type="text" id="location" />
										</div>
										<div className="form4">
											<label>????????????</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnFr"
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
										<div className="form4">
											<label>~</label>
											<DatePicker
												 locale="ko" 
												id="yyPlnTo"
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
										<div className="form4">
											<label>?????????</label>
											<DatePicker
												 locale="ko" 
												id="probDtFr"
												className="datepicker"
												selected={this.state.startDate2}
												onChange={this.startDateChange2}
												dateFormat="yyyy-MM-dd"
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
												id="probDtTo"
												className="datepicker"
												selected={this.state.endDate2}
												onChange={this.endDateChange2}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/>
										</div>


									</div>
									<button type="button" className="btn-search" onClick={() => this.fetchSearch(1)}>??????</button>
								</fieldset>
							</form>
						</div>
						<p className="message"></p>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="mw1000 why">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="250"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>?????????</th>
												<th>??????ID</th>
												<th>?????????</th>
												<th>????????????</th>
												<th>?????????</th>
												<th>????????????</th>
												<th>????????????</th>
												<th>????????????</th>
												<th>????????????</th>
												<th>????????????</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_coastamage_list" >
									<table>
										<colgroup>
											<col width="80"/>
											<col width="80"/>
											<col width="250"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
											<col width="auto"/>
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
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />????????????</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />?????????</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />????????????</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveCoatdamage','???????????????')}><img alt="" src={icon2} width="15" height="15" />????????????</button>
						<button type="button" className="btn_detail" onClick={() => config.Ready()}><img alt="" src={icon1} width="15" height="15" />????????????</button>

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveCoatdamage;