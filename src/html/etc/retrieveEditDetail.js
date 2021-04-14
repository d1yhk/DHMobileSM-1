
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';
import icon1 from '../../image/icon1.png';
import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon7 from '../../image/icon7.png';

class retrieveEditDetail extends Component {
	constructor(props) {
		super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveEditDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveEditDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

	}


	
	//저장
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var siNm =$(".siNm_detail").val();
			var bjdNm =$(".bjdNm_detail").val();
			var hjdNm =$(".hjdNm_detail").val();
			var reqDt =$(".reqDt_detail").val();
			var reqUsr =$(".reqUsr_detail").val();
			//var reqUsr =$(".reqUsrNm_detail").val();
			var status =$(".status_detail").val();
			var note =$(".note_detail").val();
			var edtDt =$(".edtDt_detail").val();
			var edtUsr =$(".edtUsr_detail").val();
			//var edtUsr =$(".edtUsrNm_detail").val();
			var edtNote =$(".edtNote_detail").val();
			var init = '';	
			if(config.table.index !=='' ){//최초 등록
				init = 'Y';
			}

			try {
				const common = await Promise.all([ 
					service.saveEditReqInfo(config.detail_file.index, siNm, bjdNm, hjdNm, reqDt, reqUsr, status, note, edtDt, edtUsr, edtNote, init)
				]);
				alert(common[0].data.message)
				if(common[0].data.code === "1"){
					//this.props.history.goBack();
				}

				/*
				var td_list = $("#gridContainer tr:eq("+config.grpifm.select_no+")");
				td_list.find("td:eq(0)").html(bjdNm);
				td_list.find("td:eq(1)").html(note);
				td_list.find("td:eq(2)").html(status);
				td_list.find("td:eq(3)").html(edtUsr);
				td_list.find("td:eq(4)").html(edtDt);
				*/
			} catch(err){
			}
		}

	}
	//삭제
	btnRemove = async () => { 
		if(window.confirm("삭제 하시겠습니까?")){
			try {
				const common = await Promise.all([ 
					service.deleteEditReqInfo(config.detail_file.index)
				]);
				alert(common[0].data.message);
				if(common[0].data.code === "1"){
					config.back.url.pop();
					var burl = config.back.url[config.back.url.length-1];
					this.props.history.push("/retrieveMemo");
				}
			} catch(err){
				alert("삭제 실패했습니다. 관리자에게 문의하세요");
			}
		}
	}

	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){
			if(config.detail_file.name!==''){

				const common = await Promise.all([ 
					service.getDetail()
				]);
				
				if(!common[0].data.result){
					alert("검색된 내용이 없습니다.");
					config.back.url.pop();
					var burl = config.back.url[config.back.url.length-1];
					this.props.history.push("/Map");
					return;
				}else{
					var result = common[0].data.result;

					$.each(result, function(key, value){
						$("."+key+"_detail").val(value);
					});

					if(result.status === '접수'){
						$(".edtUsrNm_detail").prop("readonly",true);
						$(".edtDt_detail").prop("readonly",true);
						$(".edtNote_detail").prop("readonly",true);
						$(".edtUsrNm_detail").addClass("readonly");
						$(".edtDt_detail").addClass("readonly");
						$(".edtNote_detail").addClass("readonly");
					}else if(result.status === '완료'){
						$(".edtUsrNm_detail").prop("readonly",false);
						$(".edtDt_detail").prop("readonly",false);
						$(".edtNote_detail").prop("readonly",false);
						$(".edtUsrNm_detail").removeClass("readonly");
						$(".edtDt_detail").removeClass("readonly");
						$(".edtNote_detail").removeClass("readonly");
					}
				}
			}
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}

	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "기타시설";
		$(".header_title").html( "기타시설");

		config.detail_file.param="id";
		config.detail_file.folder1="etc";
		config.detail_file.folder2="editController";
		config.detail_file.name="retrieveEditDetail";
		config.fetchCommon("수정의뢰","상태","status_detail");
		this.fetchDetail();
	}
	componentWillMount() {
	}
	StatusChange(){
		if($(".status_detail").val() === '접수'){
			$(".edtUsrNm_detail").prop("readonly",true);
			$(".edtDt_detail").prop("readonly",true);
			$(".edtNote_detail").prop("readonly",true);
			$(".edtUsrNm_detail").addClass("readonly");
			$(".edtDt_detail").addClass("readonly");
			$(".edtNote_detail").addClass("readonly");

		}else if($(".status_detail").val() === '완료'){
			$(".edtUsrNm_detail").prop("readonly",false);
			$(".edtDt_detail").prop("readonly",false);
			$(".edtNote_detail").prop("readonly",false);
			$(".edtUsrNm_detail").removeClass("readonly");
			$(".edtDt_detail").removeClass("readonly");
			$(".edtNote_detail").removeClass("readonly");
		}

	}
	render() { 
		return (
			<div className="contents">

				<div className="detail">
					<div className="tab tab1">
						<h2>수정의뢰 상세정보</h2>
					</div>
					<div className="wrap">

						<div className="box info">
							<div className="div_table">
								<div className="div_tr">
									<label>ID</label>
									<div className="div_td div_row1"><input type="text" className="id_detail readonly" readOnly /></div>
								</div>
								<div className="div_tr">
									<label>시군구</label>
									<div className="div_td">
										<input type="text" className="siNm_detail" />
										<input type="hidden" className="hjdNm_detail" />
									</div>
									<label>법정동</label>
									<div className="div_td" >
										<input type="text" className="bjdNm_detail" />
									</div>
								</div>
								<div className="div_tr">
									<label>의뢰자</label>
									<div className="div_td">
										<input type="hidden" className="reqUsr_detail"  />
										<input type="text" className="reqUsrNm_detail readonly" readOnly />
									</div>
									<label>의뢰일자</label>
									<div className="div_td" >
										<input type="text" id="reqDt_detail" className="reqDt_detail readonly" readOnly  />
									</div>
								</div>
								<div className="div_tr">
									<label>상태</label>
									<div className="div_td div_row1">
											<select id="status_detail" className="status_detail" onChange={this.StatusChange}>
											</select>
									</div>
								</div>
								<div className="div_tr note_box">
									<label>의뢰내용</label>
									<div className="div_td div_row1">
										<textarea className="note_detail"></textarea>
									</div>
								</div>
								<div className="div_tr">
									<label>처리자</label>
									<div className="div_td">
										<input type="hidden" className="edtUsr_detail"  />
										<input type="text" className="keyup edtUsrNm_detail readonly" readOnly/>
									</div>
									<label>처리일자</label>
									<div className="div_td" >
										<input type="text" id="edtDt_detail" className="keyup edtDt_detail readonly" readOnly  />

									</div>
								</div>
								<div className="div_tr note_box">
									<label>처리내용</label>
									<div className="div_td div_row1">
										<textarea className="edtNote_detail keyup readonly" readOnly></textarea>
									</div>
								</div>
								<div className="div_tr"></div>

							</div>
						</div>

					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_remove" onClick={this.btnRemove}  ><img alt="" src={icon7} width="15" height="15" />삭제</button>
						<button type="button" className="btn_save" onClick={this.btnSave}  ><img alt="" src={icon7} width="15" height="15" />저장</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveEdit','수정의뢰')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveEditDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveEditDetail;