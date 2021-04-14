
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import PopupCustList from '../../components/PopupCustList';
import PopupBuilding from '../../components/PopupBuilding';



import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';



class retrieveGM extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		
		if(config.back.url[config.back.url.length-1] !== '/retrieveGM'){
			config.back.url.push('/retrieveGM');
		}
		if(config.table_name.file !== "retrieveGM"){
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
				td = td + '<td data-id="'+result[count]['noCust']+'">'+((result[count]['noCust']) ? result[count]['noCust'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmCust']) ? result[count]['nmCust'] : '')+'</td>';
				td = td + '<td>'+((result[count]['grdGmNm']) ? result[count]['grdGmNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['gbGm']) ? result[count]['gbGm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['cdMaker']) ? result[count]['cdMaker'] : '')+'</td>';
				td = td + '<td>'+((result[count]['tyGmNm']) ? result[count]['tyGmNm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['noMachinGm']) ? result[count]['noMachinGm'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSply']) ? result[count]['dtSply'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtSet']) ? result[count]['dtSet'] : '')+'</td>';
				td = td + '<td>'+((result[count]['ynVc']) ? result[count]['ynVc'] : '')+'</td>';
				td = td + '<td>'+((result[count]['amtGmchg']) ? result[count]['amtGmchg'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_gm_list tbody").html(td);
		}else{
			$(".grp_gm_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_gm_list tbody").html('<tr><td colspan="11">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}

	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var noCust = config.form_search(search_type,'noCust');
		var cdBld = config.form_search(search_type,'cdBld');
    var noMachinGm = config.form_search(search_type,'noMachinGm');
		var gmCheck = ($("#gmCheck").prop("checked")===true) ? 'Y' : null;



		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_gm_list tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}
		try {
			const common = await Promise.all([
					//검색 api
					service.retrieveGMList(noCust, cdBld, noMachinGm, gmCheck, (this.page.page * 100), 100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_gm_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}
			}else{
				$(".message").html("&nbsp;");
				$(".grp_gm_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_gm_list tbody").html('<tr><td colspan="11">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	

	CustPopup = () => {
		$(".custlist-form").css("display","block");
	}

	BuildingPopup = () => {
		$(".building-form").css("display","block");

	}
	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

        //헤더 타이틀
		config.header.title = "계량기";
		$(".header_title").html( "계량기");
		
		config.table_name.file = 'retrieveGM';

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

			$(".grp_gm_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_gm_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_gm_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;

	
		$(".grp_gm_list").scroll(function(){
			//console.log(t.page.total +"/"+t.page.page);
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_gm_list").scrollTop() >= ($(".grp_gm_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
        //테이블 리스트 선택

		$(document).off("click",".grp_gm_list tr");
		$(document).on("click",".grp_gm_list tr",function(){
			$(".grp_gm_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			config.grpifm.scroll = $(".grp_gm_list").scrollTop();
			config.grpifm.select_no = $(this).index();
//			
      var noCust = $(this).find("td:eq(0)").attr("data-id");
			config.table.p1="계량기";
			config.table.p2=noCust;
			config.detail_file.index = noCust;

			config.table.attach1="계량기";
      config.table.attach2=noCust;	//noCust
		});
	}
	//민원접수
	sendMinwon = () => {
			$(".nmBld").val($(".popup_buldNm").html());
			$(".nmDong").val("");
			$(".nmHo").val("");
			$(".cust_list tbody").html("");


	}
	render() { 
		return (
			<div className="contents">
				<PopupCustList />
				<PopupBuilding />
				<div className="list">
					<div className="tab tab2">
                        {/*링크 추후 확인 필요 */}
						<Link to="/retrieveGM" className="active"><span>계량기 정보</span></Link>
						<Link to="/retrieveGMInsp"><span>중/대용량 계량기 점검</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4 button input_search">
											<label>수용가번호</label>
											<input type="text" id="noCust" onClick={this.CustPopup}/>
										</div>
										<div className="form4 button input_search">
											<label>건물</label>
											<input type="text" id="cdBld" onClick={this.BuildingPopup}/>
										</div>
										<div className="form4">
											<label>기물번호</label>
											<input type="text" id="noMachinGm" />
										</div>
										<div className="form4 checkbox2">
												<label for="gmCheck"><input type="checkbox" id="gmCheck" value="Y"/><strong></strong><span>계량기번호 중복체크</span></label>
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
											<col width="80"/>
											<col width="80"/>
											<col width="100"/>
											<col width="100"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
										</colgroup>
										<thead>
											<tr>
												<th>수용가번호</th>
												<th>수용가명</th>
												<th>등급</th>
												<th>형식</th>
												<th>제조사</th>
												<th>타입</th>
												<th>기물번호</th>
												<th>최초공급일</th>
												<th>설치일자</th>
												<th>보정기유/무</th>
												<th>GM교체비</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_gm_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="auto"/>
											<col width="80"/>
											<col width="80"/>
											<col width="80"/>
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
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGM','계량기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveGMDetail2')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveGM;