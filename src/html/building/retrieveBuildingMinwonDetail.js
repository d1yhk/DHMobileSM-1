
import React, { Component } from 'react';

import * as config from '../../components/config';
import * as service from '../../services/posts';
import $ from "jquery";
import PopupBuildingSearch2 from '../../components/PopupBuildingSearch2';

import btnback from '../../image/btn_back.png';
import footer_search from '../../image/footer_search.png';
import btn_minwon_cancel from '../../image/btn_minwon_cancel.png';
import btn_minwon_save from '../../image/btn_minwon_save.png';

import DatePicker, { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko'; 
registerLocale('ko', ko);

class retrieveBuildingMinwonDetail extends Component {
  constructor(props) {
    super(props);
		if(this.props.match.params.noCust !== undefined){
			if(config.back.url[config.back.url.length-1] !== '/retrieveBuildingMinwonDetail/'+this.props.match.params.noCust+'/'+this.props.match.params.noCivil+'/'+this.props.match.params.buildId){
				config.back.url.push('/retrieveBuildingMinwonDetail/'+this.props.match.params.noCust+'/'+this.props.match.params.noCivil+'/'+this.props.match.params.buildId);
			}
		}else{
			if(this.props.match.params.buildNm !== undefined){
				if(config.back.url[config.back.url.length-1] !== '/retrieveBuildingMinwonDetail/'+this.props.match.params.buildNm){
					config.back.url.push('/retrieveBuildingMinwonDetail/'+this.props.match.params.buildNm);
				}
			}else{
				if(config.back.url[config.back.url.length-1] !== '/retrieveBuildingMinwonDetail'){
					config.back.url.push('/retrieveBuildingMinwonDetail');
				}
			}
			config.detail_file.index=0;
		}
		this.state = {
				startDate: new Date(),
				endDate: null,
				startDate2:new Date()
		};
		this.startDateChange = this.startDateChange.bind(this);
		this.startDateChange2 = this.startDateChange2.bind(this);
		this.endDateChange = this.endDateChange.bind(this);
		this.custList = [];
		this.info = {};
		this.cust = {};

		this.basic_idx = -1;
		this.contract_idx = -1;
		this.basic_list = [];
		this.contract_list = [];
  }
	startDateChange(date) {
			this.setState({
					startDate: date
			});
	}

	startDateChange2(date) {
			this.setState({
					startDate2: date
			});
	}
	endDateChange(date) {
			this.setState({
					endDate: date
			});
	}
	//?????? ????????? clear
	buildingMinwonCustClear = async () => { 
		$(".nmBld").val("");
		$(".nmDong").val("");
		$(".nmHo").val("");
	}
	//?????? ????????? ??????
	buildingMinwonCustList = async () => { 
		//if(this.props.match.params.buildId > 0){
			if( this.props.match.params.noCivil > 0 ){
				alert("????????? ?????? ????????? ???????????????.");
			}else{
				var nmBld = $(".nmBld").val();
				var nmDong = $(".nmDong").val();
				var nmHo = $(".nmHo").val();
				if(nmBld ===""){
					alert("???????????? ??????????????????");
				}else{
					const cust_list = await Promise.all([ 
						service.retrieveBuildingMinwonCustList2(nmBld,nmDong,nmHo)
					]);
					var cust = cust_list[0].data.result;
					this.custList = cust;
					var td = '';
					for(var count = 0; count < cust.length; count++){
						td += '<tr>';
						td += '<td>'+cust[count].noCust+'</td>';
						td += '<td>'+((cust[count].noInhbt) ? cust[count].noInhbt : '')+'</td>';
						td += '<td>'+((cust[count].nmInhbt) ? cust[count].nmInhbt : '')+'</td>';
						td += '<td>'+cust[count].addr+'</td>';
						td += '</tr>';
					}
					$(".cust_list tbody").html(td);
				}
			}
		//}else{
		//	alert("GIS??? ??????????????? ?????? ??? ????????????.");
		//}
	}
	


	//????????? ????????? ????????? ?????? gis?????????
	retrieveBuildingCustGisList2 = async () => { 
			const gis_select = await Promise.all([ 
				service.retrieveBuildingCustGisList2(this.cust.cdBld)
			]);
			$(".gisList").html("<option value=''>??????</option>");
			var gisl=gis_select[0].data.result;
			for(var count = 0; count < gisl.length; count++){
				$(".gisList").append('<option value="'+gisl[count].buildId+'" data-cdZone="'+gisl[count].cdZone+'" data-cdDong="'+gisl[count].cdDong+'">'+gisl[count].buldNm+'</option>');
			}
	}
	//????????????
	fetchDetail = async () => { 
		//?????? ?????? ??????
		var civilYn;

		if( this.props.match.params.noCust != undefined ){
		}else{
			civilYn='Y';
		}

		const civil_code = await Promise.all([ 
			service.retrieveCivilCode(civilYn)
		]);
		var civil=civil_code[0].data.result;
		for(var count = 0; count < civil.length; count++){
			$("#cdCivilAcpt").append('<option value="'+civil[count].lcode+'">'+civil[count].lvalue+'</option>');
		}

		//gis??? ??????
		if(this.props.match.params.buildId > 0){
			const gis_select = await Promise.all([ 
				service.retrieveBuildingCustGisList(this.props.match.params.buildId)
			]);
			$(".gisList").html("");
			var gisl=gis_select[0].data.result;
			var selected = '';
			for(var count = 0; count < gisl.length; count++){
				selected = '';
				if(this.props.match.params.buildId === gisl[count].buildId){
					selected = 'selected';
				}
				$(".gisList").append('<option value="'+gisl[count].buildId+'" '+selected+' data-cdZone="'+gisl[count].cdZone+'" data-cdDong="'+gisl[count].cdDong+'">'+gisl[count].buldNm+'</option>');
			}
		}
		
		//????????? ?????? (????????? ??????)
		if( this.props.match.params.noCivil > 0){
			//?????? ??????
			const detail = await Promise.all([ 
				service.retrieveCivilDetailInfo(this.props.match.params.noCust,this.props.match.params.noCivil,this.props.match.params.buildId)
			]);
			this.info = detail[0].data.result;
			//console.log(this.info);
			$.each(detail[0].data.result, function(key, value){
				if(key === "cdCivilAcpt"){
					$("#cdCivilAcpt").val(value)
				}else{
					if($("."+key).html() !== undefined ){
						$("."+key).html(value);
					}
					if($("."+key).val() !== undefined ){
						$("."+key).val(value);
					}
				}
			});

			if(this.info.dtReq !== undefined){
				this.setState({startDate : new Date(this.info.dtReq)})
			}
			if( this.info.nmStCivil ==="??????" && this.props.match.params.noCust !='' ){
				if(this.props.match.params.buildId != ''){

					$(".noEmpHndl").html(config.user.name);
					$(".cdCivilAcpt").addClass("readonly");
					$(".cdCivilAcpt").prop("readonly",true);
					$(".contHndl").removeClass("readonly");
					$(".contHndl").prop("readonly",false);
					//$(".dtReq").html(config.formatDate(new Date(),'-'))
					$(".dtHndl").html('')
					$(".tmHndl").html('')
				}else{
					$(".noEmpHndl").html(config.user.name);
					$(".contHndl").addClass("readonly");
					$(".contHndl").prop("readonly",true);
					$(".dtHndl").html('')
					$(".tmHndl").html('')
				}
			}else{
				$(".minwon_btn button").css("display","none");
				$(".dtReq").addClass("readonly");
				$(".dtReq").next().remove();
				$(".dtReq").removeClass("datepicker");
				$(".dtReq").prop("readonly",true);


				$(".time1").addClass("readonly");
				$(".time1").prop("disabled",true);
				$(".cdCivilAcpt").addClass("readonly");
				$(".cdCivilAcpt").prop("disabled",true);

				$(".contCivilAct").addClass("readonly");
				$(".contCivilAct").prop("readonly",true);
			}
			//setTimeout(function(){
				
			//},500);
			//?????? ????????? ??????
			const cust_list = await Promise.all([ 
				service.retrieveBuildingMinwonCustList(this.props.match.params.noCust)
			]);
			var cust = cust_list[0].data.result;
			this.custList = cust;
			var td = '';
			for(var count = 0; count < cust.length; count++){
				td += '<tr>';
				td += '<td>'+cust[count].noCust+'</td>';
				td += '<td>'+((cust[count].noInhbt) ? cust[count].noInhbt : '')+'</td>';
				td += '<td>'+((cust[count].nmInhbt) ? cust[count].nmInhbt : '')+'</td>';
				td += '<td>'+cust[count].addr+'</td>';
				td += '</tr>';
			}
			$(".cust_list tbody").html(td);
		}else{
			/*
			$(".nmInhbt").removeClass("readonly");
			$(".noTel1").removeClass("readonly");
			$(".contHndl").removeClass("readonly");
			$(".nmInhbt").prop("readonly",false);
			$(".noTel1").prop("readonly",false);
			$(".contHndl").prop("readonly",false);
			*/
		}

		config.setWindowHeight();
	}

	//?????? ??????/??????
	minwonSave = async () => { 

		if( this.info.nmStCivil ==="??????" ){
			var dtReq = $(".dtReq").val();
			var tmReq = $(".time1").val();
			var contCivilAct = $(".contCivilAct").val();
			var contHndl = $(".contHndl").val();
			var noEmpHndl = config.user.id;
			var noCust = this.props.match.params.noCust;
			var noCivil = this.props.match.params.noCivil;
			var buildId = this.props.match.params.buildId;
			if(retrieveBuildingMinwonDetail === 0){
				buildId = '';
			}
			const detail = await Promise.all([ 
				service.modifyCivil(dtReq,tmReq,contCivilAct,contHndl,noEmpHndl,noCust,noCivil,buildId)
			]);
			alert(detail[0].data.message);


		}else{
			if(this.props.match.params.noCivil > 0){
				alert("????????? ????????? ???????????????.");
			}else{
				if($(".gisList").val() === ""){
					alert("GIS????????? ??????????????????");
				}else if($(".noCust").html()===""){
					alert("??????????????? ???????????? ??????????????????.");
				}else if($(".cdCivilAcpt").val()===""){
					alert("??????????????? ??????????????????.");
				
				}else{
					if(window.confirm("?????? ???????????????????")){
						var dtReq = $(".dtReq").val();
						var tmReq = $(".time1").val();
						var contCivilAct = $(".contCivilAct").val();
						//???????????? ???????????? ??????????????? ????????? ???.
						var cdCivilAcpt = $(".cdCivilAcpt").val();
						var contHndl = $(".contHndl").val();
						var noEmpHndl = config.user.id;
						var noInhbt = this.cust.noInhbt;
						var noInhbtAt = this.cust.noInhbtAt;
						var noCust = this.cust.noCust;
						var cdZone = $(".gisList option:selected").attr("data-cdZone");
						var cdDong = $(".gisList option:selected").attr("data-cdDong");
						var addr = this.cust.addr;
						var noTel1 = $(".noTel1").val();
						var buildId = $(".gisList").val();
						var nmRprt= $(".nmInhbt").val();
						var noEmpAcpt= config.user.id;
						var noEmpPln= config.user.id;
						var cdCivilHndl= $(".cdCivilAcpt").val();

						const save = await Promise.all([ 
							service.createCivil(dtReq,tmReq,contCivilAct,cdCivilAcpt,contHndl,noEmpHndl,noInhbt,noInhbtAt,noCust,cdZone,cdDong,addr,noTel1,buildId,nmRprt,noEmpAcpt,noEmpPln,cdCivilHndl)
						]);
						alert(save[0].data.message);
						config.table_name.file = "";
					}
				}
			}
		}
	}
	minwonCancel = async () => { 
		if( this.info.nmStCivil ==="??????" ){
			if(window.confirm("?????? ???????????????????")){
				const cancel = await Promise.all([ 
					service.modifyCivilCencle(this.props.match.params.noCivil)
				]);
				alert(cancel[0].data.message);
			}
		}else{
			alert("????????? ????????? ???????????????.");
		}
	}

	
	//?????? ??????
	buildingSearch = async () => { 
		
		if( this.props.match.params.buildId <= 0 ){
			alert("GIS????????? ???????????? GIS??????????????? ????????????.");
		}else{
			if( $(".gisList").val() === ""){
				alert("GIS????????? ??????????????????.");
			}else{
				var idx = $(".gisList").val();
				$(".sub_contents1").css("display","block");
				$(".sub_contents2").css("display","none");
				$(".minwon .building-search-form").css("display","block");
				
				const basic = await Promise.all([ 
					service.retrieveBuildingDetailInfo(idx)
				]);
				var bas = basic[0].data.result;
				
				$.each(bas, function(key, value){
					$(".popup_"+key).html(value);
				});

				$("#popupContents_building tbody").html("");
				const info_list = await Promise.all([ 
					service.retrieveBuildingCustList(idx)
				]);
				var result = info_list[0].data.result;
				this.basic_list = result;
				for(var count = 0; count < result.length; count++){
					var td = '<tr>';
					td = td + '<td>'+((result[count]['noCust']) ? result[count]['noCust'] : '')+'</td>'
					td = td + '<td>'+((result[count]['nmInhbt']) ? result[count]['nmInhbt'] : '')+'</td>'
					td = td + '<td>'+((result[count]['roadAddr']) ? result[count]['roadAddr'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noTel1']) ? result[count]['noTel1'] : '')+'</td>'
					td = td + '<td>'+((result[count]['noMobil1']) ? result[count]['noMobil1'] : '')+'</td>'
					td = td + '<td>'+((result[count]['minwonCnt']) ? result[count]['minwonCnt'] : '')+'</td>'
					td = td + '</tr>';
					$("#popupContents_building tbody").append(td);
				}
				//?????? ???????????? ?????? 
				$("#popupContents_building2 tbody").html("");
				const contract_list = await Promise.all([ 
					service.retrieveBuildingContractList(idx)
				]);
				var contract = contract_list[0].data.result;
				this.contract_list = contract;
				for(var count = 0; count < contract.length; count++){
					var td = '<tr>';
					td = td + '<td>'+((contract[count]['idConst']) ? contract[count]['idConst'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['idCntr']) ? contract[count]['idCntr'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['dtCntr']) ? contract[count]['dtCntr'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['nmCntr']) ? contract[count]['nmCntr'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['nmPrd']) ? contract[count]['nmPrd'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['nmGbCntr']) ? contract[count]['nmGbCntr'] : '')+'</td>'
					td = td + '<td>'+((contract[count]['addrSply']) ? contract[count]['addrSply'] : '')+'</td>'
					td = td + '</tr>';
					$("#popupContents_building2 tbody").append(td);
				}
				if(contract.length <= 0 ){
					$("#popupContents_building2 tbody").html('<tr><td colSpan="7">????????? ????????? ????????????.</td></tr>');
				}


			}
		}
	}
	//????????????
	sendMinwon = () => {
		//if($(".sub_contents1").css("display")==="block"){
			//console.log(this.basic_list[this.basic_idx]);
			$(".nmBld").val($(".minwon .popup_buldNm").html());
			$(".nmDong").val("");
			$(".nmHo").val("");
			$(".cust_list tbody").html("");

			$(".popup").css("display","none");

		///}else if($(".sub_contents2").css("display")==="block"){
		//	console.log(this.contract_list[this.contract_idx]);
		//	$(".nmBld").val("");
		//	$(".nmDong").val("");
		//	$(".nmHo").val("");
		//}
	}
	contractInfo = async (idCntr) => { 

		//????????????
		const contract_detail = await Promise.all([ 
			service.retrieveContractDetail(idCntr)
		]);
		$.each(contract_detail[0].data.result, function(key, value){
			if($(".popup_cotract_info .popup_"+key).html() !== undefined ){
				$(".popup_cotract_info .popup_"+key).html(value);
			}
		});
		//???????????? ?????????
		const contract_list = await Promise.all([ 
			service.retrieveContractUseList(idCntr)
		]);
		var clist = contract_list[0].data.result;
		var td = '';
		for(var count = 0; count < clist.length; count++){
			td += '<tr>';
			td = td + '<td>'+((clist[count]['noGmgrd']) ? clist[count]['noGmgrd'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['nmCdUse']) ? clist[count]['nmCdUse'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['nmGrdGm']) ? clist[count]['nmGrdGm'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['cntGm']) ? clist[count]['cntGm'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['amtFaci']) ? clist[count]['amtFaci'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['nmGbCntr']) ? clist[count]['nmGbCntr'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['qtyCntr']) ? clist[count]['qtyCntr'] : '')+'</td>'
			td = td + '<td>'+((clist[count]['remark']) ? clist[count]['remark'] : '')+'</td>'
			td += '</tr>';
		}
		$("#popupContents_building3 tbody").html(td);
	}

	componentDidMount() {
		if( this.props.match.params.buildNm !== undefined ){
			$(".nmBld").val(this.props.match.params.buildNm)
		}
		//????????? ??????????????? ??????
		$(".footer").css("display","none");
		$(".map").css("display","none");

		config.header.title = "????????????";
		$(".header_title").html( "????????????");

		this.fetchDetail();
		var t=this;
		

		$(document).off("click","#popupContents_building tbody tr");
		$(document).on("click","#popupContents_building tbody tr",function(){
			$("#popupContents_building tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.basic_idx = $(this).index();
		});

		$(document).off("click","#popupContents_building2 tbody tr");
		$(document).on("click","#popupContents_building2 tbody tr",function(){
			$("#popupContents_building2 tbody tr").css({"background-color":"transparent"});
			$(this).css({"background-color":"#eee"});
			t.contract_idx = $(this).index();
			
			//????????????, ???????????? ??????
			t.contractInfo(t.contract_list[t.contract_idx].idCntr);


		});


		$("#popupContents_building2 tbody").html("");
		$(document).off("click",".cust_list tbody tr");


		if( this.props.match.params.noCust === undefined ){
			$(document).on("click",".cust_list tbody tr",function(){

				$(".cust_list tbody tr").css({"background-color":"transparent"});
				$(this).css({"background-color":"#eee"});
				

				if(t.custList[0] !== undefined){
					t.cust = t.custList[$(this).index()];
					console.log(t.cust);
					

					if(t.cust.noCust !== undefined){
						$(".noCust").html(t.cust.noCust);
					}
					if(t.cust.noInhbt !== undefined){
						$(".noInhbt").html(t.cust.noInhbt);
					}
					if(t.cust.nmInhbt !== undefined){
						$(".nmInhbt").val(t.cust.nmInhbt);
					}
					if(t.cust.noTel1 !== undefined){
						$(".noTel1").val(t.cust.noTel1);
					}
					t.retrieveBuildingCustGisList2();
				}
			
			});

		}


	}

	render() { 
		return (
			<div className="contents keyboard minwon">
				<PopupBuildingSearch2 onClick={this.sendMinwon} />
				<div className="detail">
					<div className="tab tab1">
						<h2>????????????</h2>
					</div>
					<div className="wrap">
						<h2 className="wrap-head">????????????</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140"/>
									<col width="*"/>
									<col width="140"/>
									<col width="*"/>
									<col width="190"/>
								</colgroup>
								<tbody>
									<tr>
										<th>?????????</th>
										<td><input type="text" className="nmBld" /></td>
										<th>????????? ???,???</th>
										<td className="min_apt">
											<input type="text" className="nmDong" /><span>???</span>
											<input type="text" className="nmHo" /><span>???</span>
										</td>
										<td>
											<button type="button" className="btn_min_clear" onClick={this.buildingMinwonCustClear}>CLEAR</button>
											<button type="button" className="btn_min_search" onClick={this.buildingMinwonCustList}>??????</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="box table">
							<div id="gridBox">
								<div id="gridHeader" className="why mw1000">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="auto"/>
										</colgroup>
										<thead>
											<tr>
												<th>???????????????</th>
												<th>????????????</th>
												<th>?????????</th>
												<th>??????</th>
											</tr>
										</thead>
									</table>
								</div>
								<div className="cust_list mw1000">
									<table>
										<colgroup>
											<col width="100"/>
											<col width="100"/>
											<col width="100"/>
											<col width="auto"/>
										</colgroup>
										<tbody>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<h2 className="wrap-head minwon_gis">GIS??????
							{(this.props.match.params.buildId > 0 || this.props.match.params.noCivil === undefined)?<select className="gisList"><option value="">??????</option></select>:''}
							<div className="minwon_btn">
								<button type="button" onClick={this.minwonSave}><img src={btn_minwon_save} width="16" height="16"  alt=""/><span>??????</span></button>
								<button type="button" onClick={this.minwonCancel}><img src={btn_minwon_cancel} width="15" height="15"  alt=""/><span>??????</span></button>
							</div>
						</h2>
						<div className="box info">
							<table>
								<colgroup>
									<col width="140"/>
									<col width="*"/>
									<col width="140"/>
									<col width="*"/>
									<col width="140"/>
									<col width="*"/>
									<col width="140"/>
									<col width="*"/>
								</colgroup>
								<tbody>
									<tr>
										<th>????????? ??????</th>
										<td className="noCust"></td>
										<th>?????? ??????</th>
										<td className="noInhbt"></td>
										<th>?????????</th>
										<td ><input type="text" className="nmInhbt readonly" readOnly /></td>
										<th>?????????</th>
										<td ><input type="text" className="noTel1 readonly" readOnly /></td>
									</tr>
									<tr>
										<th>?????? ??????</th>
										<td colSpan="3" className="minwon_date form_date">
											{this.props.match.params.noCust !='' && this.info.nmStCivil ==="??????" ?
											<input type="text" className="dtReq minwon_dtreq keyup" />
											: 
											<DatePicker
												locale="ko" 
												id="dtReq"
												className="datepicker dtReq keyup"
												selected={this.state.startDate}
												onChange={this.startDateChange}
												dateFormat="yyyy-MM-dd"
												showYearDropdown
												isClearable
												showMonthDropdown
												dropdownMode="select"
												popperModifiers={{preventOverflow: { enabled: true, }, }}
											/> }

												<select className="time1">
													<option value="1000">10:00 ~ 11:00</option>
													<option value="1100">11:00 ~ 12:00</option>
													<option value="1200">12:00 ~ 13:00</option>
													<option value="1300">13:00 ~ 14:00</option>
													<option value="1400">14:00 ~ 15:00</option>
													<option value="1500">15:00 ~ 16:00</option>???
													<option value="1600">16:00 ~ 17:00</option>
													<option value="1700">17:00 ~ 18:00</option>
													<option value="1800">18:00 ~ 19:00</option>
													<option value="1900">19:00 ~ 20:00</option>
													<option value="2000">20:00 ~ 21:00</option>
													<option value="2100">21:00 ~ 22:00</option>
													<option value="2200">22:00 ~ 23:00</option>
													<option value="2300">23:00 ~ 00:00</option>
													<option value="0000">00:00 ~ 01:00</option>
												</select>
										</td>
										<th>?????? ??????</th>
										<td colSpan="3">
											<select id="cdCivilAcpt" className="cdCivilAcpt">
												<option value="">??????</option>
											</select>
										</td>
									</tr>
									<tr>
										<th>?????? ??????</th>
										<td colSpan="7"><input type="text" className="contCivilAct keyup" /></td>
									</tr>
									<tr>
										<th>?????? ??????</th>
										<td colSpan="3"  className="nmStCivil"></td>
										<th>?????????</th> 
										<td colSpan="3" className="nmEmpHndl"></td>
									</tr>
									<tr>
										<th>?????? ??????</th>
										<td colSpan="3" ><input type="text" className="contHndl readonly keyup" readOnly/> </td>
										<th>?????? ??????</th>
										<td colSpan="3"><span className="dtHndl"></span>&nbsp;<span className="tmHndl"></span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

				</div>
				<footer>
					<div className="footer_contents">
						<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />????????????</button>
						<button type="button"  onClick={() => this.buildingSearch()}><img alt="" src={footer_search} width="15" height="15" />????????????</button>
					</div>
				</footer>
	

			</div>
		);
	}
}


export default retrieveBuildingMinwonDetail;