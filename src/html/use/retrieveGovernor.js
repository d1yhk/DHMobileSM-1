
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
import icon6 from '../../image/icon6.png';
import close from '../../image/close.png';
import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);


class retrieveGovernor extends Component {
	constructor(props) {
		super(props)
		if(config.back.url[config.back.url.length-1] !== '/retrieveGovernor'){
			config.back.url.push('/retrieveGovernor');
		}
		if(config.table_name.file !== "retrieveGovernor"){
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
				startDate: null,
				endDate: null,
				startDate2: null,
				endDate2: null
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange2 = this.endDateChange2.bind(this);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };

	}
	startDateChange(date) {
			this.setState({
					startDate: date
			});

	//if( date.getTime() > this.state.endDate.getTime()){
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
				td = td + '<td data-id="'+result[count]['id']+'">'+((result[count]['pgovNo']) ? result[count]['pgovNo'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmGov']) ? result[count]['nmGov'] : '')+'</td>';
				td = td + '<td>'+((result[count]['txAddr']) ? result[count]['txAddr'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtLaw']) ? result[count]['dtLaw'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cntSply']>=0) ? result[count]['cntSply'] : '')+'</td>';
				td = td + '<td>'+((result[count]['coConstNm']) ? result[count]['coConstNm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_governor_list tbody").html(td);
		}else{
			$(".grp_governor_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_governor_list tbody").html('<tr><td colspan="9">?????? ????????? ????????????.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//?????? ?????? ?????????
	fetchSearch = async (search_type) => { 	
		var dtLawFr = config.form_search(search_type,'dtLawFr');
		var dtLawTo = config.form_search(search_type,'dtLawTo');
		var dtInspFr = config.form_search(search_type,'dtInspFr');
		var dtInspTo = config.form_search(search_type,'dtInspTo');
		var nmGov = config.form_search(search_type,'nmGov');
		var txAddr = config.form_search(search_type,'txAddr');
		

		//?????? ?????????
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
				this.page.total=0;
			$(".grp_governor_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveGovernorList(dtLawFr,dtLawTo,dtInspFr,dtInspTo,nmGov,txAddr,(this.page.page * 100),100)
			]);

			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_governor_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_governor_list tbody").html('<tr><td colspan="14">?????? ???????????????. ??????????????? ???????????????.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_governor_list tbody").html('<tr><td colspan="7">?????? ???????????????. ??????????????? ???????????????.</td></tr>');


		}
	}

	componentDidMount() {

		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "????????????";
		$(".header_title").html( "????????????");;
		config.table_name.file = 'retrieveGovernor';

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

			$(".grp_governor_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_governor_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_governor_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_governor_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_governor_list").scrollTop() >= ($(".grp_governor_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		
		//????????? ????????? ??????
		$(document).off("click",".grp_governor_list tr");
		$(document).on("click",".grp_governor_list tr",function(){
			config.grpifm.scroll = $(".grp_governor_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_governor_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="??????????????????";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");

			config.table.param1="";
			config.table.param2="";
			config.table.param3="";

			config.table.attach1="????????????2";
			config.table.attach2=$(this).find("td:eq(0)").html();		//pgovNo
			config.table.attach3=$(this).find("td:eq(0)").html();		//pgovNo
			
/*
???????????? : kdFclt-07 ?????? 
?????????????????? : kdFclt-06 ?????? 
?????????????????? : kdFclt-08 ?????? 
??????????????? : kdFclt-03 ?????? 
??????????????? : kdFclt-04 ?????? 
*/
			config.table.change1 = $(this).find("td:eq(0)").html(); //"DHSP0013"; //
			config.table.change2 = "03";

			config.detail_file.index = $(this).find("td:eq(0)").html();

		});


	}
	//????????????
	changeList = async () => { 
		$("#popupContents tbody").html("");
		if( config.grpifm.select_no  >= 0){
			try {
				const common = await Promise.all([ 
					service.retrieveChangeList()
				]);
				
				$(".popup-spec").css("display","block");
				var result = common[0].data.result;
				for(var count = 0; count < result.length; count++){
					var td ='<tr>';
					td = td + '<td>'+((result[count]['seqChg']) ? result[count]['seqChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['dtChg']) ? result[count]['dtChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['kdFcltNm']) ? result[count]['kdFcltNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['fcltChg']) ? result[count]['fcltChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['modelChg']) ? result[count]['modelChg'] : '')+'</td>';
					td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
					td = td + '<td>'+((result[count]['rsnChg']) ? result[count]['rsnChg'] : '')+'</td>';
					td = td + '</tr>';
					$("#popupContents tbody").append(td);
				}
				if( result.length <= 0 ){
					$("#popupContents tbody").html('<tr><td colspan="7">?????? ????????? ????????????.</td></tr>');
				}
			} catch(err){
				$("#popupContents tbody").html('<tr><td colspan="7">?????? ????????? ????????????.</td></tr>');
			}
		}else{
			alert("???????????? ??????????????????");
		}
	}
	componentWillMount() {
	}
	render() { 
		return (
			<div className="contents">

				<div className="popup popup-spec">
					<div className="popup-box table">
						<h2>???????????? <button type="button" className="close_popup"><img alt="" src={close} width="20" height="20" /></button></h2>
						<div id="popupHeader" >
							<table>
								<thead>
									<tr>
										<th>??????</th>
										<th>????????????</th>
										<th>????????????</th>
										<th>????????????</th>
										<th>?????????</th>
										<th>????????????</th>
										<th>????????????</th>
									</tr>
								</thead>
							</table>
						</div>
						<div id="popupContents" >
							<table>
								<colgroup>
									<col width="60"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="120"/>
									<col width="auto"/>
								</colgroup>
								<tbody>
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="list">
					<div className="tab tab5">
						<Link to="/retrieveCommunal"><span>????????????</span></Link>
						<Link to="/retrieveSpecific"><span>??????????????????</span></Link>
						<Link to="/retrieveGeneral"><span>??????????????????</span></Link>
						<Link to="/retrieveGovernor" className="active"><span>???????????????</span></Link>
						<Link to="/retrieveRegulator"><span>???????????????</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>???????????????</label>
											<DatePicker
												 locale="ko" 
												id="dtLawFr"
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
												id="dtLawTo"
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
											<label>???????????????</label>
											<DatePicker
												 locale="ko" 
												id="dtInspFr"
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
												id="dtInspTo"
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
										<div className="form2">
											<label>?????????</label>
											<input type="text" id="nmGov"/>
										</div>

										<div className="form2">
											<label>??????</label>
											<input type="text" id="txAddr"/>
										</div>


									</div>
									<button type="button" className="btn-search"  onClick={() => this.fetchSearch(1)}>??????</button>
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
											<col width="150"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>????????????</th>
												<th>?????????</th>
												<th>??????</th>
												<th>???????????????</th>
												<th>???????????????</th>
												<th>???????????????</th>
												<th>????????????</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_governor_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
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
						<button type="button" className="btn_change" onClick={this.changeList}><img alt="" src={icon6} width="15" height="15" />????????????</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGovernor','???????????????')}><img alt="" src={icon2} width="15" height="15" />????????????</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveGovernorDetail')}><img alt="" src={icon1} width="15" height="15" />????????????</button>


					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveGovernor;