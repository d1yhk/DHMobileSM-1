
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

class retrieveEdit extends Component {
	constructor(props) {
	super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveEdit'){
			config.back.url.push('/retrieveEdit');
		}

		if(config.table_name.file !== "retrieveEdit"){
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
            edtDt: new Date(),
            reqDt: new Date()
        };
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
        this.reqDtChange = this.reqDtChange.bind(this);
        this.edtDtChange = this.edtDtChange.bind(this);
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
    reqDtChange(date) {
        this.setState({
            reqDt: date
        });
    }
    edtDtChange(date) {
        this.setState({
            edtDt: date
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
					td = td + '<td>'+((result[count]['note']) ? result[count]['note'] : '')+'</td>';
					td = td + '<td>'+((result[count]['statusNm']) ? result[count]['statusNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['edtUsrNm']) ? result[count]['edtUsrNm'] : '')+'</td>';
					td = td + '<td>'+((result[count]['edtDt']) ? result[count]['edtDt'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_edit_list tbody").html(td);
		}else{
			$(".grp_edit_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_edit_list tbody").html('<tr><td colspan="9">?????? ????????? ????????????.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//?????? ?????? 
	fetchSearch = async (search_type) => { 
		var bjdNm = config.form_search(search_type,'bjdNm');
		var status = config.form_search(search_type,'status');
		var edtUsr = config.form_search(search_type,'edtUsr');
		var edtDtFr = config.form_search(search_type,'edtDtFr');
		var edtDtTo = config.form_search(search_type,'edtDtTo');

		//?????? ?????????
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_edit_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrieveEditList(bjdNm,status,edtUsr,edtDtFr,edtDtTo,(this.page.page * 100),100)
			]);
			
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_edit_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_edit_list tbody").html('<tr><td colspan="14">?????? ???????????????. ??????????????? ???????????????.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_edit_list tbody").html('<tr><td colspan="5">?????? ???????????????. ??????????????? ???????????????.</td></tr>');

		}
	}
	


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "????????????";
		$(".header_title").html( "????????????");
		
		config.table_name.file = 'retrieveEdit';

		config.table.param1="????????????";

		config.fetchCommon("????????????","??????","status");

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

			$(".grp_edit_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_edit_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_edit_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}
		var t = this;


	
		$(".grp_edit_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_edit_list").scrollTop() >= ($(".grp_edit_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});;
		//????????? ????????? ??????
		
		$(document).off("click",".grp_edit_list tr");
		$(document).on("click",".grp_edit_list tr",function(){

			config.grpifm.scroll = $(".grp_edit_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_edit_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			config.table.p1="????????????";
			config.table.p2=$(this).find("td:eq(0)").attr("data-id");

			config.table.attach1="????????????";
			config.table.attach2=$(this).find("td:eq(0)").attr("data-id");

			config.table.change1 = $(this).find("td:eq(0)").attr("data-id");
			config.table.change2 = "06";
			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

			//?????? ????????? ????????? index ?????? ??????
			
			

		});
	}
	componentWillMount() {
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrieveMemo"><span>??????</span></Link>
						<Link to="/retrievePlanpipe" ><span>????????????</span></Link>
						<Link to="/retrieveEdit" className="active" ><span>????????????</span></Link>
						<Link to="/retrieveRebuild"><span>???????????????</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form3">
											<label>?????????</label>
											<select id="bjdNm" name="bjdNm">
												<option value="">??????</option>
											</select>
										</div>
										<div className="form3">
											<label>??????</label>
											<select id="status" name="status">
												<option value="">??????</option>
											</select>
										</div>
										<div className="form3">
											<label>?????????</label>
											<input type="text" id="edtUsr" />
										</div>
			
										<div className="form3">
											<label>????????????</label>
											<DatePicker
												 locale="ko" 
												id="edtDtFr"
												className="datepicker"
												onChange={this.startDateChange}
												selected={this.state.startDate}
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
												id="edtDtTo"
												className="datepicker"
												onChange={this.endDateChange}
												selected={this.state.endDate}
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
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="auto"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>?????????</th>
												<th>????????????</th>
												<th>??????</th>
												<th>?????????</th>
												<th>????????????</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_edit_list">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="auto"/>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveEdit','????????????')}><img alt="" src={icon2} width="15" height="15" />????????????</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveEditDetail')}><img alt="" src={icon1} width="15" height="15" />????????????</button>


					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveEdit;