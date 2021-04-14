
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";

import btnback from '../../image/btn_back.png';

import icon2 from '../../image/icon2.png';


class retrieveContractDetail extends Component {
  constructor(props) {
    super(props);
		if(config.back.url[config.back.url.length-1] !== '/retrieveContractDetail/'+this.props.match.params.idx){
			config.back.url.push('/retrieveContractDetail/'+this.props.match.params.idx);
		}
		config.detail_file.index=this.props.match.params.idx;
  }
	//상세정보
	fetchDetail = async () => { 
		if(config.detail_file.index !== '' ){

			const common1 = await Promise.all([ 
				service.getDetail()
			]);
			
			var result1 = common1[0].data.result;
			$.each(result1, function(key, value){
				$("."+key).html(value);
			});

			config.table.attach1="공급계약";
			config.table.attach2=result1.idCntr;

			const common = await Promise.all([ 
				service.retrieveContractUseList(this.props.match.params.idx)
			]);
			var result = common[0].data.result;
			
			for(var count = 0; count < result.length; count++){
				config.grpifm.list.push(result[count]);
				var td = '<tr>';
					td = td + '<td>'+((result[count]['noGmgrd']) ? result[count]['noGmgrd'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmCdUse']) ? result[count]['nmCdUse'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmGrdGm']) ? result[count]['nmGrdGm'] : '')+'</td>'
					td = td + '<td>'+((result[count]['cntGm']) ? result[count]['cntGm'] : '')+'</td>'
					td = td + '<td>'+((result[count]['amtFaci']) ? result[count]['amtFaci'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmGbCntr']) ? result[count]['nmGbCntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['qtyCntr']) ? result[count]['qtyCntr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['remark']) ? result[count]['remark'] : '')+'</td>'
				td = td + '</tr>';
				$(".gridTable tbody").append(td);
			}
			if(result.length <= 0){
				$(".gridTable tbody").html('<tr><td colspan="8">검색된 내용이 없습니다.</td></tr>');
			}
			
			config.setWindowHeight();

		}else{
			alert(" 리스트를 선택해주세요");
		}
	}
	btnBack2 = () =>{
		this.props.history.goBack();
	}

	componentDidMount() {
		//배관은 검사이력이 없음
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "영업관리";
		$(".header_title").html( "영업관리");

		config.detail_file.param="idCntr";
		config.detail_file.folder1="sales";
		config.detail_file.folder2="contractController";
		config.detail_file.name="retrieveContractDetail";
		this.fetchDetail();
	}

	render() { 
		return (
			<div className="contents">
				<div className="detail">
					<div className="tab tab1">
						<h2>공급계약현황</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">계약일반정보</h2>
						<div className="box info">

							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>전자문서번호</th>
										<td className="noElecdocu"></td>
										<th>계약명</th>
										<td className="nmCntr"></td>
										<th>계약유형</th>
										<td className="nmGbCntr"></td>
										<th>계약자</th>
										<td className="nmPrd"></td>
									</tr>
									<tr>
										<th>공사명</th>
										<td className="nmConst" colSpan="3"></td>
										<th>공사구분</th>
										<td className="nmGbCons"></td>
										<th>내관업체</th>
										<td className="nmPartnerIn"></td>
									</tr>
									<tr>
										<th>주택구분</th>
										<td className="nmGbHs"></td>
										<th>건물</th>
										<td className="nmBld"></td>
										<th>담당자</th>
										<td className="nmEmpSale"></td>
										<th>전화번호</th>
										<td className="noTel"></td>
									</tr>
									<tr>
										<th>주소</th>
										<td className="addrCntr" colSpan="7"></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">투자/수입정보</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
									<col width="140px"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>계약세대수</th>
										<td className="cntAppcust"></td>
										<th>관경</th>
										<td className="qtyDia"></td>
										<th>연장</th>
										<td className="qtyLen"></td>
										<th>도로종류</th>
										<td className="nmKdRoad"></td>
									</tr>
									<tr>
										<th>시설분담금</th>
										<td className="amtFaci"></td>
										<th>인입부담금</th>
										<td className="amtInco"></td>
										<th>배관공사부담금</th>
										<td className="amtCons"></td>
										<th>합계</th>
										<td className="sum1"></td>
									</tr>
									<tr>
										<th>가상계좌번호</th>
										<td className="noSuppaccSale"></td>
										<th>입금완료여부</th>
										<td className="ynIncom"></td>
										<th>인입부담금면제금액</th>
										<td className="amtIncoFree"></td>
										<th>경로당부담금면제금액</th>
										<td className="amtIncoFree"></td>
									</tr>
									<tr>
										<th>보증구분</th>
										<td className="nmtyWarr"></td>
										<th>보험시작일</th>
										<td className="dtWarrFr"></td>
										<th>보험종료일</th>
										<td className="dtWarrTo"></td>
										<th>&nbsp;</th>
										<td>&nbsp;</td>
									</tr>
								</tbody>
							</table>
						</div>
						<h2 className="wrap-head">계약정보</h2>
						<div className="box table">
							<div className="gridTable">
								<table>
									<colgroup>
										<col width="80"/>
										<col width="70"/>
										<col width="100"/>
										<col width="auto"/>
										<col width="70"/>
										<col width="70"/>
										<col width="100"/>
										<col width="100"/>
									</colgroup>
									<thead>
										<tr>
											<th>순번</th>
											<th>계약용도</th>
											<th>계량기등급</th>
											<th>계량기수량</th>
											<th>시설분담금</th>
											<th>계약구분</th>
											<th>시간당사용량</th>
											<th>비고</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
						<button type="button" className="btn_file" onClick={() => config.AttachMove(this.props,'retrieveContract','공급계약')}><img alt="" src={icon2} width="15" height="15" />첨부파일</button>
					</div>
				</footer>
	

			</div>
		);
	}
}

export default retrieveContractDetail;