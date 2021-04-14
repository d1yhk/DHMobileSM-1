
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


class retrieveMemoDetail extends Component {
    constructor(props) {
        super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveMemoDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveMemoDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

    }


	//저장
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var siNm =$(".siNm_detail").val();
			var bjdNm =$(".bjdNm_detail").val();
			var hjdNm =$(".hjdNm_detail").val();
			var riNm =$(".riNm_detail").val();
			var gubun =$(".gubun_detail").val();
			var ynCivil =$(".ynCivil_detail").val();
			var crtDt =$(".crtDt_detail").val();
			var crtUsr =$(".crtUsr_detail").val();
			var note =$(".note_detail").val();
			var updDt =$(".updDt_detail").val();
			var updUsr =$(".updUsr_detail").val();
			var noteCivil =$(".noteCivil_detail").val();
			var init = '';	
			try {
				const common = await Promise.all([ 
					service.saveMemoInfo(config.detail_file.index, siNm, bjdNm, hjdNm, riNm, gubun, ynCivil, crtDt, crtUsr, note, updDt, updUsr, noteCivil, init)
				]);
				alert(common[0].data.message)
				if(common[0].data.code === "1"){
					//this.props.history.goBack();
				}
			} catch(err){
			}
		}
	}
	//삭제
	btnRemove = async () => { 
		if(window.confirm("삭제 하시겠습니까?")){
			try {
				const common = await Promise.all([ 
					service.deleteMemoInfo(config.detail_file.index)
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
				
				var result = common[0].data.result;

				$.each(result, function(key, value){
					//if(key==="id" || key==="status_detail"){
					//	$("."+key+"_detail").html(value);
					//}else{
						$("."+key+"_detail").val(value);
					//}

				});
				config.setWindowHeight();
			}

			if($(".gubun_detail").val()==="일반"){
				$(".ynCivil_detail").prop("disabled",true);
				$(".ynCivil_detail").addClass("readonly");
				$(".noteCivil_detail").attr("readonly",true);
				$(".noteCivil_detail").addClass("readonly");
			}else{
				$(".ynCivil_detail").prop("disabled",false);
				$(".ynCivil_detail").removeClass("readonly");
				$(".noteCivil_detail").prop("disabled",false);
				$(".noteCivil_detail").removeClass("readonly");
			}

			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
			
			$(".btn_remove").css("display","block");
			$(".btn_save").css("display","block");

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	componentDidMount() {
	
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "기타시설";
		$(".header_title").html( "기타시설");

		config.fetchCommon("메모","구분","gubun_detail");
		config.fetchCommon("공통","유무","ynCivil_detail");
		
		config.detail_file.param="id";
		config.detail_file.folder1="etc";
		config.detail_file.folder2="memoController";
		config.detail_file.name="retrieveMemoDetail";

		this.fetchDetail();

	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>메모 상세정보</h2>
					</div>
					<div className="wrap">
						<div className="box info">

							<div className="div_table">
								<div className="div_tr">
									<label>아이디</label>
									<div className="div_td id_detail"></div>
									<label>법정동</label>
									<div className="div_td" >
										<input type="hidden" className="siNm_detail" />
										<input type="hidden" className="hjdNm_detail" />
										<input type="hidden" className="riNm_detail" />
										<input type="text" className="bjdNm_detail" />
									</div>
								</div>
								<div className="div_tr">
									<label>구분</label>
									<div className="div_td">
										<select id="gubun_detail" className="gubun_detail">
										</select>
									</div>
									<label>처리결과</label>
									<div className="div_td" >
										<select id="ynCivil_detail" className="ynCivil_detail">
										</select>
									</div>
								</div>
								<div className="div_tr">
									<label>최초입력자</label>
									<div className="div_td">
										<input type="hidden" className="crtUsr_detail"   />
										<input type="text" className="crtUsrNm_detail readonly" readOnly  />
									</div>
									<label>최초입력일</label>
									<div className="div_td" >
										<input type="text" id="crtDt_detail" className="readonly crtDt_detail" readOnly/>
									</div>
								</div>
								<div className="div_tr">
									<label>최종수정자</label>
									<div className="div_td">
										<input type="hidden" className="updUsr_detail"   />
										<input type="text" className="updUsrNm_detail readonly" readOnly />
									</div>
									<label>최종수정일</label>
									<div className="div_td" >
											<input type="text" id="updDt_detail" className="readonly updDt_detail" readOnly/>
									</div>
								</div>
								<div className="div_tr note_box">
									<label>메모내용</label>
									<div className="div_td div_row1">
										<textarea className="keyup note_detail"></textarea>
									</div>
								</div>
								<div className="div_tr note_box">
									<label>민원처리내용</label>
									<div className="div_td div_row1">
										<textarea className="keyup noteCivil_detail"></textarea>
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
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveMemo','메모')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
						<button type="button" className="btn_detail" onClick={() => config.fetchDetail(this.props,'retrieveMemoDetail')}><img alt="" src={icon1} width="15" height="15" />상세정보</button>

					</div>
				</footer>
			</div>
		);
	}
}

export default retrieveMemoDetail;


