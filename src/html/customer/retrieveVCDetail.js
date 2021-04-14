
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';





class retrieveVCDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveVCDetail2/'+this.props.match.params.idx){
			config.back.url.push('/retrieveVCDetail2/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;

		 this.link1 = "/retrieveGMDetail2/"+this.props.match.params.idx
		 this.link2 = "/retrieveVCDetail2/"+this.props.match.params.idx
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
					$("."+key).html(value);
                });

            }
            
			$(".contents .list").css("display","none");
			$(".contents .detail").css("display","block");
			$(".btn_detail").css("display","none");
            config.setWindowHeight();
            
		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
    
	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "계량기";
		$(".header_title").html( "계량기");

		config.detail_file.param="noCust";
		config.detail_file.folder1="customer";
		config.detail_file.folder2="gmController";
		config.detail_file.name="retrieveVCDetail";
		this.fetchDetail();
    }
    
	render() { 
		return (
			<div className="contents">
				<div className="detail">

					<div className="tab tab1">
						<h2>보정기 상세정보</h2>
					</div>
					<div className="wrap">
						<div className="box sub-tab tab2">
							<Link  to={this.link1}><button type="button"><span>계량기 상세정보</span></button></Link>
							<Link  to={this.link2}><button type="button" className="active"><span>보정기 상세정보</span></button></Link>
						</div>
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
									<th>수용가번호</th>
									<td className="noCust"></td>
									<th>수용가명</th>
									<td className="nmCust"></td>
								</tr>
								<tr>
									<th>보정기 모델</th>
									<td className="cdVcmodel"></td>
									<th>보정기 기물번호</th>
									<td className="noMachinVc"></td>
								</tr>
								<tr>
									<th>제조사</th>
									<td className="cdMakerVc"></td>
									<th>제조년월</th>
									<td className="dtMadeVc"></td>
								</tr>
								<tr>
									<th>A/S 업체</th>
									<td className="cdAsCo"></td>
									<th>설치일자</th>
									<td className="dtSetVc"></td>
								</tr>
								<tr>
									<th>배터리 규격</th>
									<td className="specBat"></td>
									<th>배터리 교체주기</th>
									<td className="cdCycleBat"></td>
								</tr>
								<tr>
									<th>배터리 교체일</th>
									<td className="dtBatchg"></td>
									<th className="important"><span>*</span>배터리 교체 예정일</th>
									<td className="dtBatchgPre important"></td>
								</tr>
								<tr>
									<th>초기 보정지침</th>
									<td className="idxInitVc"></td>
									<th>초기 비보정지침</th>
									<td className="idxUninitVc"></td>
								</tr>
								<tr>
									<th>정기검사</th>
									<td className="dtInsp"></td>
									<th>보정기 봉인번호</th>
									<td className="noSealVc"></td>
								</tr>
								<tr>
									<th>소유구분</th>
									<td className="gbOwner"></td>
									<th>보정기 압력</th>
									<td className="qtyPressVc"></td>
								</tr>
							</tbody>
							</table>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGMDetail','계량기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
		{/*
						<button type="button" ><img alt="" src={icon10} width="15" height="15" />온압보정장치 확인서</button>
						<button type="button" ><img alt="" src={icon4} width="15" height="15" />계기손료</button>
						<button type="button" ><img alt="" src={icon5} width="15" height="15" />변경정보 등록</button>*/}
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveVCDetail;