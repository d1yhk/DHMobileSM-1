/*ppt176 작업일보 리스트*/ 
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";
import PopupConst from '../../components/PopupConst';

import PopupUser from '../../components/PopupUser';
import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';


import footer_warning from '../../image/footer_warning.png';


import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 

  
registerLocale('ko', ko);
class retrieveConstdaily extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		

		if(this.props.match.params.idConst !== undefined && this.props.match.params.nmConst !== undefined && config.back.url[config.back.url.length-1] !== '/retrieveConstdaily/'+this.props.match.params.idConst+"/"+this.props.match.params.nmConst){
			config.back.url.push('/retrieveConstdaily/'+this.props.match.params.idConst+"/"+this.props.match.params.nmConst);
		}else if(config.back.url[config.back.url.length-1] !== '/retrieveConstdaily'){
			config.back.url.push('/retrieveConstdaily');
		}
		if(config.table_name.file !== "retrieveConstdaily"){
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
					td = td + '<td>'+((result[count]['dtConst']) ? result[count]['dtConst'] : '')+'</td>'
					td = td + '<td>'+((result[count]['sumSand']) ? result[count]['sumSand'] : '')+'</td>'
					td = td + '<td>'+((result[count]['sumPipe']) ? result[count]['sumPipe'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmCom']) ? result[count]['nmCom'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmConstMng']) ? result[count]['nmConstMng'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmEmpDir']) ? result[count]['nmEmpDir'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noEmpRepr']) ? result[count]['noEmpRepr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmConstSup']) ? result[count]['nmConstSup'] : '')+'</td>'
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_daily_list tbody").html(td);
		}else{
			$(".grp_daily_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_daily_list tbody").html('<tr><td colspan="9">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var idConst = config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var cdCom = config.form_search(search_type,'cdCom');
		var dtConstFr = config.form_search(search_type,'dtConstFr');
		var dtConstTo = config.form_search(search_type,'dtConstTo');
		var nmEmpDir = config.form_search(search_type,'nmEmpDir');
		var gbReq = config.form_search(search_type,'gbReq');
		if(idConst===''){
			if(this.props.match.params.idConst!==''){
				$("#idConst").val(this.props.match.params.idConst);
				idConst = config.form_search(search_type,'idConst');
				$("#nmConst").val(this.props.match.params.nmConst);
				nmConst = config.form_search(search_type,'nmConst');
			}
		}


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_daily_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveConstdailyList(idConst,nmConst,cdCom,dtConstFr,dtConstTo,nmEmpDir,gbReq,(this.page.page * 100),100)
			]);
						if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_daily_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_daily_list tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_daily_list tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공사관리";
		$(".header_title").html( "공사관리");
		
		config.table_name.file = 'retrieveConstdaily';

		config.fetchStrCode("ERP","CG_Z_00104","cdCom");
		config.fetchStrCode("ERP","CG_S_00040","gbReq");  //파라미터 없음.
		

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

			$(".grp_daily_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_daily_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_daily_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}
		var t = this;

	
		$(".grp_daily_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_daily_list").scrollTop() >= ($(".grp_daily_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_daily_list tr");
		$(document).on("click",".grp_daily_list tr",function(){
			$(".grp_daily_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});


			config.grpifm.scroll = $(".grp_daily_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			var id = config.grpifm.list[config.grpifm.select_no].idConst;
			config.table.p1="작업일보";
			config.table.p2=id;
			config.detail_file.index = id;

			config.table.attach1="작업일보";
			config.table.attach2=id;
			config.table.attach3="";
			config.table.attach4="";
			config.table.attach5=config.grpifm.list[config.grpifm.select_no].dtConst;
			
			//config.table.param3 = config.grpifm.list[config.grpifm.select_no].facilNo;
		});

	}
	fetchDetail = () => {
		this.props.history.push("/retrieveConstMatList/"+config.grpifm.list[config.grpifm.select_no].idConst+"/"+config.grpifm.list[config.grpifm.select_no].dtConst);
	}
	popupConst = () => {
		$(".const-form").css("display","block");
		$(".const-form").removeClass("type0");
		$(".const-form").addClass("type0");
	}
	userInfo = () =>{
		$(".user-form").css("display","block");
	}
	render() { 
		return (
			<div className="contents">
				<PopupUser  />
				<PopupConst  />
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>작업일보</span></a>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>공사ID</label>
											<input type="text" id="idConst" readOnly className="idConst readonly" onClick={()=>this.popupConst()}  />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										<div className="form2">
											<label>공사명</label>
											<input type="text" id="nmConst" readOnly className="nmConst readonly" onClick={()=>this.popupConst()}  />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
										</div>
										<div className="form4">
											<label>시공업체</label>
											<select id="cdCom">
												<option value="">전체</option>
											</select>
										</div>

										<div className="form4">
											<label>공사일자</label>
											<DatePicker
												 locale="ko" 
												id="dtConstFr"
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
												id="dtConstTo"
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
											<label>공사규모</label>
											<select id="gbReq">
												<option value="">전체</option>
											</select>
										</div>
										{/*사용자 정보 팝업*/}
										<div className="form4">
											<label>공사감독</label>
											<input type="text" id="nmEmpDir" className="nmSelect readonly" readOnly onClick={() => this.userInfo()} />
											<button type="button" className="react-datepicker__close-icon btn_clear" aria-label="Close" tabindex="-1"></button>
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
												<th>공사일자</th>
												<th>모래사용량</th>
												<th>연장(m)</th>
												<th>시공업체</th>
												<th>시공관리자</th>
												<th>공사감독</th>
												<th>대리감독</th>
												<th>시공관리자</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_daily_list">
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
						<button type="button" onClick={() => config.AttachMove(this.props,'retrieveConstdaily','작업일보')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveConstdaily;