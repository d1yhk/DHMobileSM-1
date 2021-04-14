
import React, { Component } from 'react';
import { Link,withRouter } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrievePipe extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0,total:0};
		if(config.back.url[config.back.url.length-1] !== '/retrievePipe'){
			config.back.url.push('/retrievePipe');
		}
		if(config.table_name.file !== "retrievePipe"){
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
			td = td + '<td data-id="'+result[count]['idConst']+'">'+((result[count]['gbPipeNm']) ? result[count]['gbPipeNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>';
			td = td + '<td className="text-left">'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>';
			td = td + '<td>'+((result[count]['cdDongNm']) ? result[count]['cdDongNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['dtConstTo']) ? result[count]['dtConstTo'] : '')+'</td>';
			td = td + '<td>'+((result[count]['cdComNm']) ? result[count]['cdComNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['kdPipeNm']) ? result[count]['kdPipeNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['cdPressNm']) ? result[count]['cdPressNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>';
			td = td + '<td>'+((result[count]['tbCnt']) ? result[count]['tbCnt'] : '')+'</td>';
			td = td + '<td>'+((result[count]['vbCnt']) ? result[count]['vbCnt'] : '')+'</td>';
			td = td + '<td>'+((result[count]['fragCnt']) ? result[count]['fragCnt'] : '')+'</td>';
			td = td + '<td>'+((result[count]['idPipeRoadNm']) ? result[count]['idPipeRoadNm'] : '')+'</td>';
			td = td + '<td>'+((result[count]['noSector1Nm']) ? result[count]['noSector1Nm'] : '')+'</td>';
			td = td + '</tr>';
		}
		if(search_type === 1){
			$(".grp_pipe_list_1 tbody").html(td);
		}else{
			$(".grp_pipe_list_1 tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_pipe_list_1 tbody").html('<tr><td colspan="14">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}


	//검색 결과 
	fetchSearch = async (search_type) => { 
		var cdDong = config.form_search(search_type,'cdDong');
		var idConst = config.form_search(search_type,'idConst');

		var nmConst = config.form_search(search_type,'nmConst');
		var kdPipe = config.form_search(search_type,'kdPipe');
		var cdPress = config.form_search(search_type,'cdPress');
		var cdMat = config.form_search(search_type,'cdMat');
		var noSector1 = config.form_search(search_type,'noSector1');
		var gbPipe = config.form_search(search_type,'gbPipe');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_pipe_list_1 tbody").html("");
			config.grpifm.list=[];
			config.grpifm.select_no = -1;
			config.detail_file.index = "";
		}

		try {
			const common = await Promise.all([ 
				service.retrievePipeList(cdDong,idConst,nmConst,kdPipe,cdPress,cdMat,noSector1,gbPipe,(this.page.page * 100),100)
			]);



			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_pipe_list_1 tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_pipe_list_1 tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
			$(".message").html("&nbsp;");
			$(".grp_pipe_list_1 tbody").html('<tr><td colspan="14">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");
		
		config.table_name.file = 'retrievePipe';

		config.table.param1="배관";
		
		config.fetchCommon("ERP","CG_F_00068","kdPipe");			//공사구분
		config.fetchCommon("ERP","CG_S_00008","cdPress");				//압력구분
		config.fetchCommon("ERP","CG_F_00009","cdMat");				//배관재질
		config.fetchCommon("ERP","CG_F_00008","noSector1");		//점검구간
		config.fetchCommon("ERP","CG_F_00037","gbPipe");					//배관구분

		$(".message").html("검색중입니다.");
		config.fetchERPDong("");



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
			

			$(".grp_pipe_list_1 tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_pipe_list_1").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_pipe_list_1 tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;
	
		$(".grp_pipe_list_1").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_pipe_list_1").scrollTop() >= ($(".grp_pipe_list_1 tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});

		//테이블 리스트 선택
		$(document).off("click",".grp_pipe_list_1 tr");
		$(document).on("click",".grp_pipe_list_1 tr",function(){
			config.grpifm.scroll = $(".grp_pipe_list_1").scrollTop();
			config.grpifm.select_no = $(this).index();

			$(".grp_pipe_list_1 tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");

			config.table.attach1="배관";
			config.table.attach2=$(this).find("td:eq(1)").html();
			config.table.attach3="";

			config.table.p1="배관";
			config.table.p2="filter=id_const:'"+$(this).find("td:eq(0)").attr("data-id")+"'";
			config.table.gil = $(this).find("td:eq(3)").html();

			config.table.param3 = $(this).find("td:eq(1)").html();
		});

	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab4">
						<Link to="/retrievePipe" className="active"><span>배관</span></Link>
						<Link to="/retrieveValve"><span>밸브</span></Link>
						<Link to="/retrieveGov"><span>정압기</span></Link>
						<Link to="/retrieveSpecial"><span>중점관리대상</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>법정동</label>
											<select id="cdDong" name="bjdnm">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>공사ID</label>
											<input type="text" id="idConst" />
										</div>
										<div className="form4">
											<label>공사명</label>
											<input type="text" id="nmConst" />
										</div>
										<div className="form4">
											<label>공사구분</label>
											<select id="kdPipe">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>압력구분</label>
											<select id="cdPress">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>배관재질</label>
											<select id="cdMat">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>점검구간</label>
											<select id="noSector1">
												<option value="">전체</option>
											</select>
										</div>
										<div className="form4">
											<label>배관구분</label>
											<select id="gbPipe">
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
											<col width="70"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="60"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>배관구분</th>
												<th>공사ID</th>
												<th>공사명</th>
												<th>법정동</th>
												<th>준공일자</th>
												<th>시공업체</th>
												<th>주관/인입</th>
												<th>압력구분</th>
												<th>배관총연장</th>
												<th>전기방식</th>
												<th>밸브</th>
												<th>중점관리대상</th>
												<th>담당구역</th>
												<th>점검구간</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_pipe_list_1">
									<table>
										<colgroup>
											<col width="70"/>
											<col width="80"/>
											<col width="auto"/>
											<col width="60"/>
											<col width="80"/>
											<col width="100"/>
											<col width="80"/>
											<col width="70"/>
											<col width="80"/>
											<col width="70"/>
											<col width="70"/>
											<col width="100"/>
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
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrievePipe','배관')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrievePipeDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}
export default withRouter(retrievePipe);
