/*global hwindow*/
/*사용시설 특정사용시설*/
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import * as config from '../components/config';
import * as service from '../services/posts';
import $ from "jquery";

import btnback from '../image/btn_back.png';
import icon4 from '../image/icon4.png';
import icon7 from '../image/icon7.png';

//import PDFViewer from 'pdf-viewer-reactjs'

class Attach extends Component {
    constructor(props) {
      super(props);
			this.page = {change : 0,num: 0, type:0,count:0, page:0,total:0 };
			if(config.back.url[config.back.url.length-1] !== '/Attach/'+this.props.match.params.title){
				config.back.url.push('/Attach/'+this.props.match.params.title);
			}
			this.select_idx = -1;
			this.result = [];
			this.imgsrc = "";
    }


	//검색 결과 리스트
	fetchSearch = async (search_type) => { 	
/*


     *공통파일구분 gubun
     *파일구분    gbFile
     *첨부파일키1 cdKey1
      첨부파일키2 cdKey2
      첨부파일키3 cdKey3
      첨부파일키4 cdKey4

      파일번호    noFile
      문서번호    noDocu
      파일순번    seqFile
*/	

		//검색 초기화
		if(search_type===1){
			this.page.page = 0;
			this.page.num = 0;
			this.page.count = 0;
			this.page.change = 0;
			this.page.type=0;
			this.page.total=0;
			$(".attach_list tbody").html("");
		}

		//console.log("page :"+this.page.page);

		try {
			const common = await Promise.all([ 
				service.retrieveFiles((this.page.page * 100),100)
			]);
			
			console.log(common);
			var result = common[0].data.result;
			this.result = result;

			var cnt = (this.page.page * 100);
			for(var count = 0; count < result.length; count++){

				var td = '<tr>';
				td = td + "<td >"+(cnt+1)+"</td>";
				td = td + '<td>'+((result[count]['gbFile']) ? result[count]['gbFile'] : '')+'</td>';
				td = td + '<td>'+((result[count]['filename']) ? result[count]['filename'] : '')+'</td>';
				td = td + '<td>'+((result[count]['dtsInsert']) ? result[count]['dtsInsert'].substr(0,10) : '')+'</td>';
				td = td + '</tr>';
				$(".attach_list tbody").append(td);
				cnt++;
			}
			if( result.length <= 0 ){
				$(".attach_list tbody").html('<tr><td colspan="4">검색 결과가 없습니다.</td></tr>');
			}
			this.page.count = result.length;
			this.page.change = 0;
			if(this.page.type === 0){
				this.page.num = $(".attach_list tbody").height() / 2;
				this.page.type=1;

				var wrap_height = $(window).height() - 173 ;
				$(".wrap").height(wrap_height);
				
				var table_height = $(window).height() - 255;
				$(".attach_list").height(table_height);
			}
			
		} catch(err){
			$(".message").html("&nbsp;");
			$(".attach_list tbody").html('<tr><td colspan="4">검색 오류입니다. 관리자에게 문의하세요.</td></tr>');


		}
	}
/*
*공통파일구분 gubun
*파일구분    gbFile
*첨부파일키1 cdKey1
첨부파일키2 cdKey2
첨부파일키3 cdKey3
첨부파일키4 cdKey4

파일번호    noFile
문서번호    noDocu
파일순번    seqFile
*/

	componentDidMount() {
		this.retrieveFileGroup();
		config.header.title = "첨부파일";
		
		$(".map").css("display","none");
		$(".footer").css("display","none");
		this.fetchSearch(0);
		var t = this;

		$(".attach_list").scroll(function(){
			if(t.page.count >= 100){
				if($(".attach_list").scrollTop() >= ($(".attach_list tbody").height() - t.page.num)){
					if(t.page.change === 0){
						t.page.change = 1;
						t.page.page++;
						t.fetchSearch(0);
					}
				}
			}
		});
		
		//테이블 리스트 선택
		$(document).off("click",".attach_list tr");
		$(document).on("click",".attach_list tr",function(){
			$(".attach_list tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			
			//config.table.p1="건물";
			//config.table.p2="filter=roadNm:'"+$(this).find("td:eq(1)").attr("data-a1")+"',buldMnnm:'"+$(this).find("td:eq(1)").attr("data-a2")+"',buldSlno:'"+$(this).find("td:eq(1)").attr("data-a3")+"'";

			//config.detail_file.index = $(this).find("td:eq(0)").attr("data-id");
			t.select_idx = $(this).index();
			t.btnAttachImage();


			/*
			var param = "";
			var data= t.result[t.select_idx];
			for (var key in data) {
					param += '&'+key+"="+data[key];
			}
			$(".test").attr("href",service.url + "/file/download3.do?1=1"+param);
			*/

			

			
		});

	}


	btnAttachImage = async () => { 
		try {
			
			const common = await Promise.all([ 
				service.fileDownloadImage(this.result[this.select_idx])
			]);
			
			console.log(common);
			var tail = common[0].data.result.imgsrc.split(".");
			
			if ( tail[tail.length - 1] ==="png" || tail[tail.length - 1] ==="jpg" ){
				$(".attach_file").html('<img src="'+service.host + common[0].data.result.imgsrc+'" />')
			}else{
				$(".attach_file").html(common[0].data.result.filename);
			}
			
			this.imgsrc =common[0].data.result.imgsrc;

				
		} catch(err){
		}
	}

	//첨부파일 다운로드
	btnAttachDown = async () => { 

		if(this.select_idx >= 0 ){
			var data= this.result[this.select_idx];


			var form = document.createElement("form");
			form.target = "_self";			//_blank  Map
			form.method = "POST";

			form.action = service.url + "/file/download3.do";

			form.style.display = "none";
			var param = '';
			var new_link = service.host;
			for (var key in data) {
					var input = document.createElement("input");
					input.type = "hidden";
					input.name = key;
					input.value = data[key];

					param += "&"+key+"="+encodeURIComponent(data[key]);
			}
			document.body.appendChild(form);
			//form.submit();
			//document.body.removeChild(form);
			
			//window.location.href= service.host +this.imgsrc;
			//return;

			//window.location.href=service.url + "/file/download3.do?1="+this.imgsrc;
			window.location.href=service.url + "/file/download3.do?1=1"+param+"&url="+service.host +this.imgsrc;
			//window.open(service.url + "/file/download3.do?1=1"+param, "", "status=0,title=0,height=600,width=800,scrollbars=1");

			return;
		}else{
			alert("항목을 선택해주세요");
		}

/*
		$.ajax({
				url:'http://ibc.iptime.org:8080/DHMobileSM/file/download3.do', // 요청 할 주소
				async:true,// false 일 경우 동기 요청으로 변경
				processData: false,
				type:'POST', // GET, PUT
				data: data,// 전송할 데이터
				dataType:'html',// xml, json, script, html
				beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
				success:function(jqXHR) {},// 요청 완료 시
				error:function(jqXHR) {},// 요청 실패.
				complete:function(jqXHR) {}// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
		});

		return;
		try {
			console.log("클릭");
			const common = await Promise.all([ 
				service.fileDownload(this.result[config.table.current])
			]);
			console.log(common);
		} catch(err){
		}
*/

	}


	retrieveFileGroup = async () => { 

		const gb = await Promise.all([service.retrieveFileGroup()]);
		
		var result = gb[0].data.result;
		this.option_list = result;


	}


	btnPicResgist = () =>{
		hwindow.Android.Attach(config.user.id,config.user.token2);
		//this.props.history.push('/AttachAdd/'+this.props.match.params.title);
	}
	componentWillMount() {
		
	}
	render() { 
		const { params } = this.props.match;

		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<h2>{params.title} 첨부파일</h2>
					</div>
					<div className="wrap">
						<div className="box2 table">
							<div id="gridBox2">
								<div id="gridHeader2" className="att_table">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<thead>
											<tr>
												<th>순번</th>
												<th>구분</th>
												<th>파일명</th>
												<th>등록일</th>
											</tr>
										</thead>
									</table>
								</div>
								<div id="gridContainer2" className="attach_list">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
							<div className="attach_file">

							</div>
						</div>
					</div>
				</div>

				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
		{/*<button type="button" className="btn_attach_remove" ><img alt="" src={icon7} width="15" height="15" />삭제</button>*/}
						<button type="button" className="btn_attach_regist" onClick={this.btnPicResgist}  ><img alt="" src={icon4} width="15" height="15" />사진등록</button>
						<button type="button" className="btn_attach_down" onClick={this.btnAttachDown} ><img alt="" src={icon7} width="15" height="15" />다운로드</button>
					{/*<a href="" className="test" target="_self"><img alt="" src={icon7} width="15" height="15" />다운로드2</a>*/}
					</div>
				</footer>
			</div>
		);
	}
}

export default withRouter(Attach);