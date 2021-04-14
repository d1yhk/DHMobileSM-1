
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



class retrieveProb extends Component {
	
	constructor(props) {
		super(props);
		this.page = {change : 0,num: 0, type:0,count:0, page:0, total:0 };
		this.sub ={t1:0,t2:0,t3:0,t4:0,t5:0,t6:0,t7:0,t8:0}
		if(config.back.url[config.back.url.length-1] !== '/retrieveProb'){
			config.back.url.push('/retrieveProb');
		}
		if(config.table_name.file !== "retrieveProb"){
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
		//console.log(result);
		var td = ''; 	
		$(".message").html("총 "+(this.page.total) +"건 검색되었습니다.");
		for(var count = 0; count < result.length; count++){
			if(stype === 0 ){
				config.grpifm.list.push(result[count]);
			}
			td = td + '<tr>';
				td = td + '<td>'+((result[count]['idConst']) ? result[count]['idConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['nmConst']) ? result[count]['nmConst'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntTb']) ? result[count]['cntTb'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntVb']) ? result[count]['cntVb'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntBpipe']) ? result[count]['cntBpipe'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntRiver']) ? result[count]['cntRiver'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntExpo']) ? result[count]['cntExpo'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntWater']) ? result[count]['cntWater'] : '')+'</td>'
				td = td + '<td>'+((result[count]['cntPipeReck']) ? result[count]['cntPipeReck'] : '')+'</td>'
				td = td + '<td>'+((result[count]['qtyLen']) ? result[count]['qtyLen'] : '')+'</td>'
			td = td + '</tr>';
			this.sub.t1 += ((result[count]['cntTb']) ? result[count]['cntTb'] : 0);
			this.sub.t2 += ((result[count]['cntVb']) ? result[count]['cntVb'] : 0);
			this.sub.t3 += ((result[count]['cntBpipe']) ? result[count]['cntBpipe'] : 0);
			this.sub.t4 += ((result[count]['cntRiver']) ? result[count]['cntRiver'] : 0);
			this.sub.t5 += ((result[count]['cntExpo']) ? result[count]['cntExpo'] : 0);
			this.sub.t6 += ((result[count]['cntWater']) ? result[count]['cntWater'] : 0);
			this.sub.t7 += ((result[count]['cntPipeReck']) ? result[count]['cntPipeReck'] : 0);
			this.sub.t8 += ((result[count]['qtyLen']) ? result[count]['qtyLen'] : 0);
		}
		td += '<tr><th colspan="2">합계</th><th>'+this.sub.t1+'</th><th>'+this.sub.t2+'</th><th>'+this.sub.t3+'</th><th>'+this.sub.t4+'</th><th>'+this.sub.t5+'</th><th>'+this.sub.t6+'</th><th>'+this.sub.t7+'</th><th>'+this.sub.t8.toFixed(2)+'</th></tr>';
		if(search_type === 1){
			$(".grp_prob_list tbody").html(td);
		}else{
			$(".grp_prob_list tbody").append(td);
		}
			
		if( result.length <= 0 ){
			$(".grp_prob_list tbody").html('<tr><td colspan="10">검색 결과가 없습니다.</td></tr>');
		}
		this.page.count = result.length;
		this.page.change = 0;
	}
	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
		var idConst =config.form_search(search_type,'idConst');
		var nmConst = config.form_search(search_type,'nmConst');
		var yyPln = config.form_search(search_type,'yyPln');


		//검색 초기화
		if(search_type===1){
			$(".message").html("검색중입니다.");
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".grp_prob_list tbody").html("");
			config.grpifm.list=[];
		}

		try {
			const common = await Promise.all([ 
				service.retrieveProbList(idConst,nmConst,yyPln,(this.page.page * 100),100)
			]);
			if(common[0].data.code > 0){
				var result = common[0].data.result;
				this.page.total = (result.length + ((this.page.page) * 100));
				this.lists(result,0,search_type);

				if(this.page.type === 0){
					this.page.num = $(".grp_prob_list tbody").height() / 2;
					this.page.type=1;
					config.setWindowHeight();
				}


			}else{
				$(".message").html("&nbsp;");
				$(".grp_prob_list tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
			}
		} catch(err){
				$(".message").html("&nbsp;");
				$(".grp_prob_list tbody").html('<tr><td colspan="10">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}
	
	fetchDetail = () => {
		if(config.grpifm.select_no !== ''){
			this.props.history.push("/retrieveProbRsltDetail/"+config.grpifm.list[config.grpifm.select_no].idConst+"/"+config.grpifm.list[config.grpifm.select_no].yyPln);
		}else{
			alert("항목을 선택하세요");
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "작업관리";
		$(".header_title").html( "작업관리");
		
		config.table_name.file = 'retrieveProb';

		var d = new Date();
		var n = d.getFullYear();
		var selected='';
		for(var i=n-5; i <= n+5; i++){
			selected='';
			if(i === n){
				selected = ' selected';
			}
			$("#yyPln").append('<option value="'+i+'" '+selected+'>'+i+'</option>');
		}
		


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

			$(".grp_prob_list tr:eq("+config.grpifm.select_no+")").css({"background-color":"#eee"});
			setTimeout(function(){
				$(".grp_prob_list").scrollTop( config.grpifm.scroll);
			},500);

			this.page.num = $(".grp_prob_list tbody").height() / 2;
			this.page.type=1;
			this.page.page = Math.ceil(result.length / 100) - 1;

			config.setWindowHeight();

		}else{
			this.fetchSearch(1);
		}

		var t = this;


		$(".grp_prob_list").scroll(function(){
			
			if((t.page.total - (100 * t.page.page)) >= 100){
				if($(".grp_prob_list").scrollTop() >= ($(".grp_prob_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		//테이블 리스트 선택
		$(document).off("click",".grp_prob_list tr");
		$(document).on("click",".grp_prob_list tr",function(){
			config.grpifm.scroll = $(".grp_prob_list").scrollTop();
			config.grpifm.select_no = $(this).index();
			$(".grp_prob_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});

			
			var id = config.grpifm.list[config.grpifm.select_no].idConst;
			config.table.p1="배관";
			config.table.p2=id;
			config.detail_file.index = id;

			config.table.attach1="피복탐측";
			config.table.attach2=id;
			
		});



	}

	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab3">
						<Link to="/retrieveDangerWork"><span>위험작업</span></Link>
						<Link to="/retrieveRepair" ><span>보수작업</span></Link>
						<Link to="/retrieveProb" className="active"><span>피복탐측</span></Link>
					</div>
					<div className="wrap">
						<div className="box search">
							<form>
								<fieldset>
									<div className="form-contoll">
										<div className="form4">
											<label>탐측년도</label>
											<select id="yyPln" name="yyPln"></select>
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
											<col width="70"/>
											<col width="70"/>
										</colgroup>
										<thead>
											<tr>
												<th>공사ID</th>
												<th>공사명</th>
												<th>TB</th>
												<th>VB</th>
												<th>교량배관</th>
												<th>하천하월</th>
												<th>노출배관</th>
												<th>수취기</th>
												<th>파이프렉</th>
												<th>배관연장</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer" className="mw1000 grp_prob_list">
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveProb','피복탐측')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => this.fetchDetail()}><img alt="" src={icon1} width="15" height="15" />탐측결과</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveProb;