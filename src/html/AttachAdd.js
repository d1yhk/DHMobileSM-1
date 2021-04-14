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

class AttachAdd extends Component {
    constructor(props) {
      super(props);
			this.page = {change : 0,num: 0, type:0,count:0, page:0,total:0 };
			
			if(config.back.url[config.back.url.length-1] !== '/AttachAdd/'+this.props.match.params.title){
				config.back.url.push('/AttachAdd/'+this.props.match.params.title);
			}
			this.select_idx = -1;
			this.option_list = [];
			this.option_info = {};
    }



	retrieveFileGroup = async () => { 

		const gb = await Promise.all([service.retrieveFileGroup()]);
		
		var result = gb[0].data.result;
		this.option_list = result;
		for(var i =0; i < result.length; i++){
			$(".gbFile").append('<option value="'+i+'" >['+result[i].gubun+'] '+result[i].nmFile+'</option>');
		}

	}

	

	componentDidMount() {
		config.header.title = "첨부파일 등록";
		this.retrieveFileGroup();
		$(".map").css("display","none");
		$(".footer").css("display","none");
	}


	btnPicResgist = () =>{
		if(window.confirm("저장 하시겠습니까?")){
			var sel = $(".gbFile").val();

		/*
			테스트
			gbFile: "SFR35_VB";
			cdKey1: "19870001"
			cdKey2: "VBH0003"
			*/
			

			var form = $('#FILE_FORM')[0];
			var formData = new FormData(form);
			formData.append("gbFile", this.option_list[sel].gbFile);
			formData.append("cdKey1", this.option_list[sel].cdKey1);
			formData.append("cdKey2", this.option_list[sel].cdKey2);
			//formData.append("cdKey3", "");
			//formData.append("cdKey4", "");
			//formData.append("noDocu", "");
			formData.append("remark", $(".attach_memo").val());
			formData.append("tfilenm", $(".selfile")[0].files[0]);
			
			var t =this;
			$.ajax({
				url: service.url+'/file/upload.do',
				processData: false,
				contentType: false,
				data: formData,
				type: 'POST',
				success: function(result){
					t.option_info = result;
					t.btnAttachImage();
					alert(result.message);
				}
			});
		}
	}



	btnAttachImage = async () => { 
		try {
			
			const common = await Promise.all([ 
				service.fileDownloadImage(this.option_info)
			]);
			
			var tail = common[0].data.result.imgsrc.split(".");
			
			if ( tail[tail.length - 1] ==="png" || tail[tail.length - 1] ==="jpg" ){
				$(".attach_file").html('<img src="'+service.host + common[0].data.result.imgsrc+'" />')
			}else{
				$(".attach_file").html(common[0].data.result.gbNmFile +"<br/>"+common[0].data.result.filename);
			}


				
		} catch(err){
		}
	}

	render() { 
		const { params } = this.props.match;

		return (
			<div className="contents">
				<div className="list">
					<div className="tab tab1">
						<h2>{params.title} 첨부파일 등록</h2>
					</div>
					<div className="wrap">
						<div className="box2 table attach_add">
							<div id="gridBox2">
								<div id="gridHeader2">
									<form id="ajaxform" action="/saveFileTest.do" method="post" enctype="multipart/form-data">
									<table>
										<colgroup>
											<col width="80"/>
											<col width="200"/>
										</colgroup>
										<tbody>
											<tr>
												<th>구분</th>
												<td>
													<select className="gbFile">
														<option value="">선택</option>
													</select>
												</td>
											</tr>
											<tr>
												<th>사진</th>
												<td><input type="file"  className="selfile" name="tfilenm"/></td>
											</tr>
											<tr>
												<th>비고</th>
												<td className="memo"><textarea className="attach_memo"></textarea></td>
											</tr>
										</tbody>
									</table>
									</form>
								</div>
							</div>
							<div className="attach_file addfile">
								
							</div>
						</div>
					</div>
				</div>

				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button"  onClick={this.btnPicResgist}  ><img alt="" src={icon4} width="15" height="15" />저장</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default withRouter(AttachAdd);