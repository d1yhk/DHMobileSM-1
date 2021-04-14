
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';

import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';



class retrieveQuarterInsp extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveQuarterInsp'){
			config.back.url.push('/retrieveQuarterInsp');
		}
		if(config.table_name.file !== "retrieveQuarterInsp"){
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
	}


	lists = (result,stype,search_type) => {
		var td = '';
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
				td = td + '<tr>';
				td = td + '<td>'+((result[count]['rowNum']) ? result[count]['rowNum'] : '')+'</td>';
				td = td + '<td>'+((result[count]['inspGubunNm']) ? result[count]['inspGubunNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdFclt']) ? result[count]['cdFclt'] : '')+'</td>';
				td = td + '<td class="text-left">'+((result[count]['nmFclt']) ? result[count]['nmFclt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtInsp']) ? result[count]['dtInsp'] : '')+'</td>';
				td = td + '<td>'+((result[count]['noEmpInspNm']) ? result[count]['noEmpInspNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdRslt']) ? result[count]['cdRslt'] : '')+'</td>';
				td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_quarter_list tbody").html(td);
		}else{
			$(".grp_quarter_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_quarter_list tbody").html('<tr><td colspan="8">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var idInspType = config.form_search(search_type,'idInspType');
		var nmFclt = config.form_search(search_type,'nmFclt');

		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_quarter_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		if(!idInspType){
			idInspType = 1043;
		}
		try {
			const common = await Promise.all([ 
				//bjdNm, idInspType, nmFclt, dtLawFr, dtLawTo, dtInspPlnFr, dtInspPlnTo, 
				service.retrieveQuarterInspList(idInspType,nmFclt,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_quarter_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_quarter_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_quarter_list tbody").html('<tr><td colspan="8">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');

		}
	}
	fetchDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{

			var cdFclt = config.grpifm.list[config.grpifm.select_no].cdFclt;
			var idInsp = config.grpifm.list[config.grpifm.select_no].idInsp;
			var idInspType = config.grpifm.list[config.grpifm.select_no].idInspType;
			//alert(config.table.cdFclt);
			
			var inspGubunNm = config.grpifm.list[config.grpifm.select_no].inspGubunNm;
			if(inspGubunNm === "MOV작동점검"){
				this.props.history.push('/retrieveQuarterInspDetail/'+cdFclt+"/"+idInsp+"/"+idInspType);
			}else if(inspGubunNm === "곡관부두께측정"){
				this.props.history.push('/retrieveQuarterInspDetail2/'+cdFclt+"/"+idInsp+"/"+idInspType);
			}else if(inspGubunNm === "압력센서점검"){
				this.props.history.push('/retrieveQuarterInspDetail3/'+cdFclt+"/"+idInsp+"/"+idInspType);
			}
		}
	}
	govDetail = () => {
		if(config.detail_file.index === ""){
			alert("리스트를 선택해주세요")
		}else{
			var id = config.grpifm.list[config.grpifm.select_no].id;
			this.props.history.push('/retrieveGovDetail/'+id);
		}
	}


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "정압시설";
		$(".header_title").html( "정압시설");
		config.table_name.file = "retrieveQuarterInsp"

		config.fetchCommon("정압기","점검유형","idInspType","분기점검");

			


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

			$(".grp_quarter_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_quarter_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_quarter_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
				
			setTimeout(function(){
				config.form_search(0,'idInspType');
			},500);
		
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_quarter_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_quarter_list").scrollTop() >= ($(".grp_quarter_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_quarter_list tr");
		$(document).on("click",".grp_quarter_list tr",function(){
			config.grpifm.scroll = $(".grp_quarter_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_quarter_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			var id = config.grpifm.list[config.grpifm.select_no].id;

			config.table.p1="정압기";
			config.table.p2=id;

			config.detail_file.index = id;
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab6">
						<Link to="/retrieveWeeklyInsp"><span>주간점검</span></Link>
						<Link to="/retrieveQuarterInsp" className="active"><span>분기점검</span></Link>
						<Link to="/retrieveAutoPeriodicInsp"><span>자율/정기검사</span></Link>
						<Link to="/retrieveDisassemblyInsp"><span>분해점검</span></Link>
						<Link to="/retrieveRegulatorInsp"><span>공급압력조정기 점검</span></Link>
						<Link to="/retrieveGovInspRslt"><span>점검이력</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form2">
											<label>점검유형</label>
											<select id="idInspType">
											</select>
										</div>
										<div className="form2">
											<label>정압기명</label>
											<input type="text" id="nmFclt" />
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
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="150"/>
											<col width="100"/>
											<col width="200"/>
										</colgroup>
										<thead>
											<tr>
												<th>순번</th>
												<th>점검유형</th>
												<th>시설코드</th>
												<th>시설명</th>
												<th>점검일자</th>
												<th>점검자</th>
												<th>점검결과</th>
												<th>메모</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_quarter_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="150"/>
											<col width="150"/>
											<col width="auto"/>
											<col width="150"/>
											<col width="150"/>
											<col width="100"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>

						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />점검등록</button>
						<button type="button" className="btn_detail" onClick={this.govDetail}><img alt="" src={icon1} width="15" height="15" />시설물정보</button>



					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveQuarterInsp;