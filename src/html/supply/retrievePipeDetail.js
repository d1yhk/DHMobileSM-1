
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";


import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';
import icon4 from '../../image/icon4.png';
import icon5 from '../../image/icon5.png';

class retrievePipeDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrievePipeDetail/'+this.props.match.params.idx){
			if( this.props.match.params.type === "map" ){
				config.back.url.push('/retrievePipeDetail/'+this.props.match.params.idx+"/map");
			}else{
				config.back.url.push('/retrievePipeDetail/'+this.props.match.params.idx);
			}
		}
  }


	//상세정보
	fetchDetail = async () => { 
			//console.log(this.props.match.params);
			if( this.props.match.params.type === "map" ){
				config.detail_file.param="id";
			}else{
				config.detail_file.param="idConst";
			}
			const common = await Promise.all([ 
				service.getDetail()
			]);
			
			var result = common[0].data.result;
		

			$.each(result, function(key, value){
				$("."+key).html(value);
			});
			
			const pipe = await Promise.all([ 
				service.retrievePipeDiaLenDetail(result.idConst)
			]);
			var result2 = pipe[0].data.result;
			
			var a1='';
			var a2='';
			for(var count = 0; count < result2.length; count++){
				a1 += '<td>'+result2[count].cdDia+'</td>';
				a2 += '<td>'+result2[count].diaQtyLen+'</td>';
			}
			var aa='';
			if(a1!==''){
				aa += '<tr><th>관경</th>'+a1+'</tr>';
				aa += '<tr><th>연장</th>'+a2+'</tr>';
			}
			$("#PipeDiaLenDetail").html(aa);

			/* 지도에서 온경우 */
			config.table.attach1="배관";
			config.table.attach2=result.idConst;
			config.table.attach3="";

			config.table.p1="배관";
			config.table.p2="filter=id_const:'"+result.idConst+"'";
			config.table.gil = result.cdDongNm;

			config.table.param3 = result.idConst;

			config.setWindowHeight();
	}


	fetchBack = () => { 
		this.props.history.goBack();
	}

	componentDidMount() {
		console.log(this.props.history);
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "공급시설";
		$(".header_title").html( "공급시설");
		
		
		
		if( this.props.match.params.type === "map" ){
			config.detail_file.param="id";
		}else{
			config.detail_file.param="idConst";
		}

		config.detail_file.index=this.props.match.params.idx;
		
		config.detail_file.folder1="supply";
		config.detail_file.folder2="pipeController";
		config.detail_file.name="retrievePipeDetail";

		this.fetchDetail();
	}
	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>배관 상세정보</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">배관 기본정보</h2>
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
									<th>공사ID</th>
									<td className="idConst"></td>
									<th>공사명</th>
									<td className="nmConst"></td>
								</tr>
								<tr>
									<th>주배관ID</th>
									<td className="idConstMain"></td>
									<th>주배관명</th>
									<td className="nmConstMain"></td>
								</tr>
							</tbody>
							</table>
						</div>

						<h2>배관 상세정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
							<tbody>
								<tr>
									<th>배관구분</th>
									<td className="gbPipeNm"></td>
									<th>주관/인입</th>
									<td className="kdPipeNm"></td>
									<th>법정동</th>
									<td className="cdDongNm"></td>
								</tr>
								<tr>
									<th>재질</th>
									<td className="cdMatNm"></td>
									<th>시공업체</th>
									<td className="cdComNm"></td>
									<th>배관연장(m)</th>
									<td className="qtyLen"></td>
								</tr>
								<tr>
									<th>준공년도</th>
									<td className="dtConst"></td>
									<th>착공일</th>
									<td className="dtConstTo"></td>
									<th>준공일</th>
									<td className="dtConstFr"></td>
								</tr>
								<tr>
									<th>담당구역</th>
									<td className="idPipeRoadNm"></td>
									<th>점검3구간</th>
									<td className="noSector1Nm"></td>
									<th>점검4구간</th>
									<td className="noSector2Nm"></td>
								</tr>
								<tr>
									<th>더블배관연장</th>
									<td className="qtyLenDb"></td>
									<th>전기방식방법</th>
									<td className="corptTypNm"></td>
									<th>전위원격감시</th>
									<td className="govNm"></td>
								</tr>
								<tr>
									<th>밸브</th>
									<td className="vbCnt"></td>
									<th>전기방식</th>
									<td className="tbCnt"></td>
									<th>중점관리대상</th>
									<td className="fragCnt"></td>
								</tr>
								<tr>
									<th>교량배관</th>
									<td className="bpipeCnt"></td>
									<th>파이프렉</th>
									<td className="pipeReckCnt"></td>
									<th>하천하월</th>
									<td className="riverCnt"></td>
								</tr>
								<tr>
									<th>노출배관</th>
									<td className="expoCnt"></td>
									<th>수취기</th>
									<td className="waterCnt"></td>
									<th>절연조인트</th>
									<td className="jointCnt"></td>
								</tr>
							</tbody>
							</table>
						</div>

						<h2>관경별 연장</h2>
						<div className="box info">
							<table id="PipeDiaLenDetail">
							</table>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_navi" onClick={() => config.navigation()}><img alt="" src={icon5} width="15" height="15" />길안내</button>
						<button type="button" className="btn_map"  onClick={() => config.areaMove(this.props)} ><img alt="" src={icon4} width="15" height="15" />위치이동</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrievePipeDetail','배관')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
			</div>
		);
	}
}

export default retrievePipeDetail;
