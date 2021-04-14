
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';
import icon7 from '../../image/icon7.png';



class retrievePunchDetail extends Component {
    constructor(props) {
        super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePunchDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrievePunchDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
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
					if(key === "id"){
						$("."+key).html(value);
					}else{
						$("."+key).val(value);
					}
				});
				
			}
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	
	//저장
	btnSave = async () => { 
		if(window.confirm("저장 하시겠습니까?")){
			var siNm =$(".siNm").val();
			var bjdNm =$(".bjdNm").val();
			var riNm =$(".riNm").val();
			var constDate =$(".constDate").val();
			var constNm =$(".constNm").val();
			var coating =$(".coatingNm").val();
			var dust =$(".dustNm").val();
			var corrosion =$(".corrosionNm").val();
			var pipeThick =$(".pipeThick").val();
			var note =$(".note").val();
			var crtDt =$(".crtDt").val();
			var crtUsr =$(".crtUsrNm").val();
			var updDt =$(".updDt").val();
			var updUsr =$(".updUsrNm").val();
			var init = '';	
			if(config.table.index !=='' ){//최초 등록
				init = 'Y';
			}

			try {
				const common = await Promise.all([ 
					service.savePunchInfo(config.detail_file.index, init, siNm, bjdNm, riNm, constDate, constNm, coating, dust, corrosion, pipeThick, note, crtDt, crtUsr, updDt, updUsr)
				]);
				if(common[0].data.code === "1"){
					this.props.history.goBack();
				}

				alert(common[0].data.message)
				
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
					service.deletePunchInfo(config.detail_file.index)
				]);
				alert(common[0].data.message);
				if(common[0].data.code === "1"){
					this.props.history.goBack();
				}


			} catch(err){
				alert("삭제 실패했습니다. 관리자에게 문의하세요");
			}
		}
	}


	componentDidMount() {
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "관리시설";
		$(".header_title").html( "관리시설");


		config.fetchCommon("천공칩","코팅상태","coating_detail");
		config.fetchCommon("천공칩","분진여부","dust_detail");
		config.fetchCommon("천공칩","부식상태","corrosion_detail");

		config.table.name="배관";
		config.detail_file.param="id";
		config.detail_file.folder1="manage";
		config.detail_file.folder2="punchController";
		config.detail_file.name="retrievePunchDetail";
		this.fetchDetail();

	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>천공칩 상세정보</h2>
					</div>

					<div className="wrap">
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
								<tr>
									<th>ID</th>
									<td colSpan="3" className="id"></td>
								</tr>
								<tr>
									<th>시군구</th>
									<td><input type="text" className="siNm readonly" readOnly/></td>
									<th>법정동</th>
									<td><input type="text" className="bjdNm readonly" readOnly /></td>
								</tr>
								<tr>
									<th>작업일</th>
									<td><input type="text" className="constDate readonly" readOnly/></td>
									<th>리</th>
									<td><input type="text" className="riNm readonly" readOnly/></td>
								</tr>
								<tr>
									<th>작업명</th>
									<td colSpan="3"><input type="text" className="constNm" /></td>
								</tr>
								<tr>
									<th>코팅상태</th>
									<td>
										<select id="coating_detail"  className="coatingNm">
										</select>
									</td>
									<th>분진여부</th>
									<td>
										<select id="dust_detail"  className="dustNm">
										</select>
									</td>
								</tr>
								<tr>
									<th>부식상태</th>
									<td>
										<select id="corrosion_detail"  className="corrosionNm">
										</select>
									</td>
									<th>배관두께</th>
									<td><input type="text" className="pipeThick" /></td>
								</tr>
								<tr>
									<th>의견</th>
									<td colSpan="3" className="note_box"><textarea className="note"></textarea></td>
								</tr>
								<tr>
									<th>최초입력일시</th>
									<td><input type="text" className="crtDt readonly" readOnly /></td>
									<th>최초입력자</th>
									<td><input type="text" className="crtUsrNm readonly" readOnly/></td>
								</tr>
								<tr>
									<th>최종수정일시</th>
									<td><input type="text" className="updDt readonly" readOnly/></td>
									<th>최종수정자</th>
									<td><input type="text" className="updUsrNm readonly" readOnly/></td>
								</tr>
								</tbody>
							</table>
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
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePunchDetail;