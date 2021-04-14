
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';


class retrieveGMDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveGMDetail2/'+this.props.match.params.idx){
			config.back.url.push('/retrieveGMDetail2/'+this.props.match.params.idx);
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
				//console.log("상세정보");
				//console.log(common);
                var result = common[0].data.result;
                
				$.each(result, function(key, value){
					$("."+key).html(value);
                });
                $.each(result, function(key, value){
					$("."+key).val(value);
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

		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "계량기";
        $(".header_title").html( "계량기");

		config.detail_file.param="noCust";
		config.detail_file.folder1="customer";
		config.detail_file.folder2="gmController";
		config.detail_file.name="retrieveGMDetail";
		this.fetchDetail();
    }
    
	render() { 
		return (
			<div className="contents">
				<div className="detail">

					<div className="tab tab1">
						<h2>계량기 상세정보</h2>
					</div>
					<div className="wrap">
						<div className="box sub-tab tab2">
							<Link  to={this.link1}><button type="button"  className="active"><span>계량기 상세정보</span></button></Link>
							<Link  to={this.link2}><button type="button" ><span>보정기 상세정보</span></button></Link>
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
									<td className="nmGm"></td>
								</tr>
								<tr>
									<th>상태</th>
									<td className="stGmNm"></td>
									<th>주소</th>
									<td className="txPlc"></td>
								</tr>
								<tr>
									<th>설치위치</th>
									<td className="plcGmNm"></td>
									<th>설치위치정보</th>
									<td className="txtGmplc"></td>
								</tr>
								<tr>
									<th>주택구분</th>
									<td className="gbFclt"></td>
									<th>공급상태</th>
									<td className="tpSply"></td>
								</tr>
								<tr>
									<th>온압보정여부</th>
									<td className="ynRevNm"></td>
									<th>압력 보정개수</th>
									<td className="spRev"></td>
								</tr>
								<tr>
									<th>교체비</th>
									<td className="amtGmchg"></td>
									<th></th>
									<td className=""></td>
								</tr>
							</tbody>
							</table>
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
									<th>모델</th>
									<td><input type="text" class="cdModelNm"/></td>
									<th>등급</th>
									<td><input type="text" class="grdGmNm"/></td>
								</tr>
								<tr>
									<th>형식</th>
									<td><input type="text" class="gbGmNm"/></td>
									<th>유형</th>
									<td><input type="text" class="yhGmNm"/></td>
								</tr>
								<tr>
									<th>타입</th>
									<td><input type="text" class="tyGmNm"/></td>
									<th>통신방식</th>
									<td><input type="text" class="gbComm"/></td>
								</tr>
								<tr>
									<th>제조사</th>
									<td><input type="text" class="cdMakerNm"/></td>
									<th>기물번호</th>
									<td><input type="text" class="noMachinGm"/></td>
								</tr>
								<tr>
									<th>제조년도</th>
									<td><input type="text" class="yyMade"/></td>
									<th>유효기간 만기월</th>
									<td><input type="text" class="ymExpi"/></td>
								</tr>
								<tr>
									<th>신품/검정품</th>
									<td><input type="text" class="ynNewNm"/></td>
									<th>검정주기</th>
									<td><input type="text" class="cdCycleNm"/></td>
								</tr>
								<tr>
									<th>유니언규격</th>
									<td><input type="text" class="specUnion"/></td>
									<th>압력</th>
									<td><input type="text" class="qtyPress"/></td>
								</tr>
								<tr>
									<th>급유여부</th>
									<td><input type="text" class="ynOilNm"/></td>
									<th>기타 봉인번호</th>
									<td><input type="text" class="noSealEtc"/></td>
								</tr>
								<tr>
									<th>바이패스</th>
									<td><input type="text" class="ynBypassNm"/></td>
									<th>바이패스 봉인번호</th>
									<td><input type="text" class="noSealBypass"/></td>
								</tr>
								<tr>
									<th>설치일자</th>
									<td><input type="text" class="dtSet"/></td>
									<th>초기지침</th>
									<td><input type="text" class="idxInit"/></td>
								</tr>
							</tbody>
							</table>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
                        {/*첨부파일 추가 필요*/}
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveGMDetail','계량기')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
									{/*
						<button type="button" ><img alt="" src={icon10} width="15" height="15" />온압보정장치 확인서</button>
						<button type="button" ><img alt="" src={icon4} width="15" height="15" />계기손료</button>
						<button type="button" ><img alt="" src={icon5} width="15" height="15" />변경정보 등록</button>
						*/}
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveGMDetail;