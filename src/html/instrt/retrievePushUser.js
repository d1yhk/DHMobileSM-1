/*ppt185 상황조치 지시전달*/
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
import icon10 from '../../image/icon10.png';


class retrievePushUser extends Component {
	
	constructor(props) {
		super(props);
		
		if(config.back.url[config.back.url.length-1] !== '/retrievePushUser'){
			config.back.url.push('/retrievePushUser');
		}
		if(config.table_name.file !== "retrievePushUser"){
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


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	

		$(".push_user_contents tbody").html("");
		config.grpifm.list = [];

		try {
			const common = await Promise.all([ 
				service.retrievePushUser()
			]);
			
			var result = common[0].data.result;
			
			for(var count = 0; count < result.length; count++){
				config.grpifm.list.push(result[count]);
				var td = '<tr class="nn">';
				td = td + '<td >'+((result[count]['idUser']) ? result[count]['idUser'] : '')+'</td>';
				td = td + '<td>'+((result[count]['nmUser']) ? result[count]['nmUser'] : '')+'</td>';
				td = td + '</tr>';
				$(".push_user_contents tbody").append(td);
			}
			
			if( result.length <= 0 ){
				$(".push_user_contents tbody").html('<tr><td colspan="2">검색 결과가 없습니다.</td></tr>');
			}

			
			var table_height = $(window).height() - 200;
			$(".push_table").height(table_height);

			var wrap_height = $(window).height() - 160 ;
			$(".wrap").height(wrap_height);

		} catch(err){
				$(".message").html("&nbsp;");
				$(".push_user_contents tbody").html('<tr><td colspan="2">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "상황조치";
		$(".header_title").html( "상황조치");
		config.table_name.file = 'retrievePushUser';

		this.fetchSearch(1);

		var t = this;

		//테이블 리스트 선택 
		//중복 이벤트 방지
		$(document).off("click",".push_user_contents tr");
		var selcnt = 0;
		$(document).on("click",".push_user_contents tr",function(){
			if( $(this).attr("class").indexOf("active") >= 0 ){
				$(this).css({"background-color":"#fff"});
				$(this).removeClass("active");
				selcnt--;

			}else{
				$(this).css({"background-color":"#eee"});
				$(this).addClass("active");
				selcnt++;

			}
			$(".push_user_footer span").html(selcnt);
		});
	}
	PushReset = () =>{
		$(".ptitle").val("");
		$(".pcontents").val("");
	}
	PushSend = async () => {
		var check=0;
		var data= [];
		var i=0;
		$(".push_user_contents tr").each(function(){
			if( $(this).attr("class").indexOf("active") >= 0 ){
				data.push({tuser:config.grpifm.list[i].idUser,ttoken:config.grpifm.list[i].token,contentTile:$(".ptitle").val(),contentText:$(".pcontents").val()});
				check=1;
			}
			i++;
		});

		if(check===1){
			
			//console.log(data);
			if(window.confirm("전송 하시겠습니까?")){
				const save = await Promise.all([ 
					service.pushSend(data)
				]);
				alert(save[0].data.message);
			}
		}else{
			alert("전송할 사용자를 선택해주세요.");
		}

		
	}
	render() { 
		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<a href="#:;"><span>지시전달</span></a>
					</div>
					<div className="wrap">
						<div className="box table push_table">
							<div className="push_list">
								<div className="push_user_header mw300">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
										</colgroup>
										<thead>
											<tr>
												<th>사용자ID</th>
												<th>사용자명</th>
											</tr>
										</thead>
									</table>
								</div>
								<div className="push_user_contents mw300">
									<table>
										<colgroup>
											<col width="150"/>
											<col width="150"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
								<div className="push_user_footer mw300">
									<span>0</span>명 선택
								</div>
							</div>
							<div className="push_memo">
								<div className="memo_title">
									<label>지시제목</label>
									<input type="text" className="ptitle" />
								</div>
								<div className="memo_contents">
									<label>지시내용</label>
									<textarea className="pcontents"></textarea>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_file" onClick={this.PushSend}><img alt="" src={icon2} width="15" height="15" />전송</button>
						<button type="button" className="btn_detail" onClick={this.PushReset}><img alt="" src={icon1} width="15" height="15" />초기화</button>

					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrievePushUser;