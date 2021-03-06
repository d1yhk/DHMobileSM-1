/*global jMap, jmobile, token, lat_grp, lng_grp, ph_grp, gps_grp*/ 
import React, { Component } from 'react';
import { Link,Redirect,withRouter  } from 'react-router-dom';
import PropTypes from 'prop-types';
import PopupSituBuldInfo from './PopupSituBuldInfo';
import PopupBuildingSearch2 from './PopupBuildingSearch2';

import menu from '../image/menu.png';
import logo from '../image/logo.png';
import menu_logo from '../image/menu_logo.png';
import menu_close from '../image/menu_close.png';
import menu_icon00 from '../image/menu_icon00.png';
import menu_icon01 from '../image/menu_icon01.png';
import menu_icon02 from '../image/menu_icon02.png';
import menu_icon03 from '../image/menu_icon03.png';
import menu_icon04 from '../image/menu_icon04.png';
import menu_icon05 from '../image/menu_icon05.png';
import menu_icon06 from '../image/menu_icon06.png';
import menu_icon07 from '../image/menu_icon07.png';
import menu_icon08 from '../image/menu_icon08.png';
import menu_icon09 from '../image/menu_icon09.png';
import map_gps from '../image/map_gps.png';
import icon4 from '../image/icon4.png';
import map_address_search_btn from '../image/map_address_search_btn.png';
import map_r01 from '../image/map-r01.png';
import map_l00 from '../image/map-l00.png';
import map_r02 from '../image/map-r02.png';
import map_l02 from '../image/map-l02.png';
import map_l01 from '../image/map-l01.png';
import map_l03 from '../image/map-l03.png';
import map_r03 from '../image/map-r03.png';
import map_r04 from '../image/map-r04.png';
import map_r05 from '../image/map-r05.png';
import map_r07_1 from '../image/map-r07-1.png';
import map_r07 from '../image/map-r07.png';
import map_r08_1 from '../image/map-r08-1.png';
import map_r08 from '../image/map-r08.png';
import map_r09_1 from '../image/map-r09-1.png';
import map_r09 from '../image/map-r09.png';
import map_r10 from '../image/map-r10.png';
import input_save from '../image/input_save.png';
import close from '../image/close.png';
import close_x from '../image/close_x.png';

import map_skyview from '../image/map_skyview.png';
import map_map from '../image/map_map.png';
import map_cadastral from '../image/map_cadastral.png';

import * as service from '../services/posts';
import * as config from './config';
import $ from "jquery";

class Header extends Component {
	constructor(props) {
		super(props);
		//this.goBack = this.goBack.bind(this); 
		
		this.gps_info = [];
		config.user.id  = this.props.loginInfo.currentUserId;
		config.user.name  = this.props.loginInfo.currentUser;
		config.user.token2  = this.props.loginInfo.currentToken2;

		this.w1 = [];
		this.w2 = [];
		this.w3 = [];
		//console.log(this.props.loginInfo.currentUserId);
		//console.log(this.props.loginInfo.currentUser);
		this.input_type = -1;

		this.trnsCyc = 30000;
		this.catCyc = 5000;
		this.trunCyc = this.trnsCyc / this.catCyc;
		this.gps='';
		this.sectorNm = 0;
	}
	Logout = () => {
		window.location.href="/DHMobileSM/?version=" + $(".app_version").val();
	}
	//????????? gps?????? ?????? ??????
	saveGpsLogInfo = async () => { 
		//alert(JSON.stringify(this.gps_info));

		const sgli = await Promise.all([ 
			service.saveGpsLogInfo(this.gps_info)
		]);
		
		//alert(JSON.stringify(sgli));

		if(sgli[0].data.code === "1"){
			this.trnsCyc = parseInt(sgli[0].data.result.trnsCyc) * 1000;
			this.catCyc = parseInt(sgli[0].data.result.catCyc) * 1000;
			this.trunCyc = this.trnsCyc / this.catCyc;

			this.newGrpLoginfo(0);
		}
		this.gps_info = [];
	}
	//?????? 1??????,2??????...
	newGrpLoginfo = (type) => {
		var t = this;
		var second = 0;
		clearInterval(gps_grp);
		if(type === 0){
			gps_grp = setInterval(function(){
				//if(ph_grp!='' && lat_grp!='' && lng_grp!=''){
					t.gps_info.push({
						phnNum:ph_grp,
						sectorNm:t.sectorNm,
						driver1:config.user.id,
						patrol:1,
						logSts:1,
						dblX:lat_grp,
						dblY:lng_grp,
						receiveDate:(config.formatDate(new Date(),"")+config.formatTime(new Date(),""))
					})
					second++;
					//console.log(ph_grp+"/"+second + "/" +t.trunCyc + "/" +t.trnsCyc + "/" +t.catCyc);
					//alert(t.sectorNm +" : " + ph_grp+", "+lat_grp + ", " +lng_grp);
					if(second >= t.trunCyc){
						t.saveGpsLogInfo();
						second = 0;
					}
				//}
				
			},t.catCyc);
		}
	}
	//?????? ??????
	fetchMenuList = async () => { 
		const common = await Promise.all([ 
			service.menuList()
		]);
		try {
			var results = common[0].data.result;
			
			var level1 = '';
			var menus = [];
			for(var count=0; count < results.length; count++){
				
				if(results[count].menuLvl === 1){
					if(!menus[results[count].menuNo]){
						level1 = results[count].menuNo;
						menus[results[count].menuNo] = [];
					}
					menus[results[count].menuNo].push( results[count] );
				}
				
				if(results[count].menuLvl === 2){
					if(!menus[results[count].upMenuNo][results[count].menuNo]){
						menus[results[count].upMenuNo][results[count].menuNo] = [];
					}
					menus[results[count].upMenuNo][results[count].menuNo].push( results[count] );
				}
				
				if(results[count].menuLvl === 3){
					if(!menus[level1][results[count].upMenuNo][results[count].menuNo]){
						menus[level1][results[count].upMenuNo][results[count].menuNo] = [];
					}
					menus[level1][results[count].upMenuNo][results[count].menuNo].push( results[count] );

				}
			}
//			console.log("??????");
//			console.log( menus);
		} catch(err){

		}
	}
	
	//????????? ??????
	btnLayerSet = async () => { 
		var set_js_layers='';
		var set_do_layers='';
		var cnt = 0;
		$("li.layer_mini").each(function(){
			if($(this).find("input").prop("checked") === true){
				if(cnt === 0){
					set_js_layers = $(this).find("input").val();
					set_do_layers = $(this).attr("data-cd");
				}else{
					set_js_layers += ","+$(this).find("input").val();
					set_do_layers += ","+$(this).attr("data-cd");
				}
				cnt++;
			}
		});
		
		
		try {
			const common = await Promise.all([ 
				service.setUserLayers(set_do_layers)
			]);
			if(common[0].data.code < 0){
				alert(common[0].data.message);
			}else{
				jMap.setLayers(set_js_layers,set_js_layers,true);
			}
		} catch(err){
			alert("??????????????? ???????????????");
		}
	}
	//????????? ?????????
	btnLayerReset = async () => { 
		try {
			const layer_reset = await Promise.all([ 
				service.resetLayerForSystem()
			]);
			
			jMap.refreshMap();
		} catch(err){
			
		}

		$(".map_layer_list ul").html("");
			if($(".map_layer_list ul").html()===""){
			var results = config.map_layer.list;
			var layer_html = '';
			var lay = [];
			if(results.length > 0){
				for(var count = 0; count < results.length; count++){
					if(!lay[results[count].class1]){
						lay[results[count].class1] = [];
					}
					if(!lay[results[count].class1][results[count].class2]){
						lay[results[count].class1][results[count].class2] = [];
					}
					lay[results[count].class1][results[count].class2].push( results[count] );
				}
				
			
			
				//if(lay.length > 0){
					Object.keys(lay).forEach(function (key) {
						var cnt = Object.keys(lay[key]).length;
						var cnt0 = 0;
						Object.keys(lay[key]).forEach(function (key2) {
							var cnt1 = Object.keys(lay[key][key2]).length;
							var cnt2 = 0;
							Object.keys(lay[key][key2]).forEach(function (key3) {
								if(lay[key][key2][key3].initUseYn==='Y'){
									cnt2++;
								}
							});
							if(cnt1 === cnt2){
								cnt0++;
							}
						});
						var checked_main='';
						if(cnt === cnt0){
							checked_main = ' checked';
						}

						layer_html += '<li class="layer_main"><button></button><label><input type="checkbox"'+checked_main+' class="check_main" value="'+key+'"/><strong></strong><span>'+key+'</span></label><ul class="layer_sub">';
						Object.keys(lay[key]).forEach(function (key2) {
							
							var cnt1 = Object.keys(lay[key][key2]).length;
							var cnt2 = 0;
							Object.keys(lay[key][key2]).forEach(function (key3) {
								if(lay[key][key2][key3].initUseYn==='Y'){
									cnt2++;
								}
							});
							var checked_sub='';
							if(cnt1 === cnt2){
								checked_sub=' checked';
							}
							layer_html += '<li class="layer_sub"><button></button><label><input type="checkbox"'+checked_sub+' class="check_sub" value="'+key2+'"/><strong></strong><span>'+key2+'</span></label><ul class="layer_mini">';
							Object.keys(lay[key][key2]).forEach(function (key3) {
								var checked = '';
								if(lay[key][key2][key3].initUseYn==='Y'){
									checked = ' checked';
								}
								layer_html += '<li class="layer_mini" data-id="'+lay[key][key2][key3].seq+'" data-cd="'+lay[key][key2][key3].layerCd+'"><label><input type="checkbox"'+checked+' class="check_mini" value="'+lay[key][key2][key3].layerNm+'"/><strong></strong><img alt="" src="'+service.url+'/images/layer/'+lay[key][key2][key3].layerImg+'" width="17" height="17" /><span>'+lay[key][key2][key3].layerNm+'</span></label></li>';
							});
							layer_html += '</ul>';
						});
						
						layer_html += '</ul>';
					});
				//}
				$(".map_layer_list ul").html(layer_html);
			}
		}
	}
	
	//????????????
	fetchCommon = async (feature,type,id) => { 
		const common = await Promise.all([service.getCommon(feature,type)]);
		var result = common[0].data.result;
		for(var count = 0; count < result.length; count++){                
			$("#"+id).append($("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
		if(id==="ynCivil_memo"){
			$("#"+id).val("N");
		}
	}

	//???????????? ??????
	btnMapAddress = async () => {
		
		$(".map_address_list ul").html('<li>??????????????????.</li>');
		var data = {flag : config.map_address.text};
		if(config.map_address.text === 'build'){
			data['bjdNm'] = $("#map_bjdNm").val();
			data['buldNm'] = $("#map_buldNm").val();
		}else if(config.map_address.text === 'addr'){
			data['bjdNm'] = $("#map_bjdNm").val();
			data['riNm'] = $("#map_riNm").val();
			if($("#map_lnbrMnnm").val()!==''){
				data['lnbrMnnm'] = $("#map_lnbrMnnm").val();
			}
			if($("#map_lnbrSlno").val()!==''){
				data['lnbrSlno'] = $("#map_lnbrSlno").val();
			}
		}else if(config.map_address.text === 'roadAddr'){
			data['bjdNm'] = $("#map_bjdNm").val();
			data['roadNm'] = $("#map_roadNm").val();
			if($("#map_buldMnnm").val()!==''){
				data['buldMnnm'] = $("#map_buldMnnm").val();
			}
			if($("#map_suldSlno").val()!==''){
				data['suldSlno'] = $("#map_suldSlno").val();
			}
		}else if(config.map_address.text === 'facil'){
			data['facilGubun'] = $("#map_facilGubun").val();
			data['facilNo'] = $("#map_facilNo").val();
			data['facilNm'] = $("#map_facilNm").val();

			if(data['facilNo'] === "" && data['facilNm']===""){
				alert("????????????/ID ?????? ??????/??????/??????????????? ???????????????.");
				return;
			}

		}else if(config.map_address.text === 'const'){
			data['idConst'] = $("#map_idConst").val();
			data['nmConst'] = $("#map_nmConst").val();

			if(data['idConst'] === "" && data['nmConst']===""){
				alert("??????ID ?????? ???????????? ???????????????.");
				return;
			}

		}else if(config.map_address.text === 'cust'){
			data['noCust'] = $("#map_noCust").val();
			data['nmCust'] = $("#map_nmCust").val();

			if(data['noCust'] === "" && data['nmCust'] === ""){
				alert("??????????????? ?????? ??????????????? ???????????????.");
				return;
			}
		}
		
		$(".map_address_list ul").html('<li>??????????????????.</li>');
		const common = await Promise.all([ 
			service.retrieveLocation(data)
		]);
			
			
		try {
			var result = common[0].data.result;
			//bjdNm: "?????????" fullAddr: "????????? ????????? " fullTitle: "GBR-0001-????????????2???" id: 1 riNm: " " rn: 1 siNm: "?????????" 
			$(".map_address_list ul").html('');
			if(result.length > 0 ){
				for(var count = 0; count < result.length; count++){
					if(result[count].fullTitle){
						$(".map_address_list ul").append('<li data-id="'+result[count].id+'"><span>'+(count+1)+'</span><h3>'+result[count].fullTitle+'</h3><p>'+result[count].fullAddr+'</p></li>');
					}else{
						$(".map_address_list ul").append('<li data-id="'+result[count].id+'"><span>'+(count+1)+'</span><h3>'+result[count].fullAddr+'</h3></li>');
					}
				}
			}else{
				$(".map_address_list ul").html('<li>????????? ????????? ????????????.</li>');
			}
		} catch(err){
			$(".map_address_list ul").html('<li>????????? ????????? ????????????.</li>');
		}
	}
	
	//???????????? ?????????
	mapAddressNavi = () => {
		
		
		
		jMap.getCoordinate(config.map_navi.p1, config.map_navi.p2, function(result) {
			if (result) {
				if (result.state === "success"){
					
					window.Android.kakaoNavi(config.map_navi.name, result.lat,result.lng);
				}else{
					alert(result.msg);
				}
			//????????? ??????
			}else if (result.msg){
				alert(result.msg);
			};    	
		});
	}
	//???????????? ?????????
	mapSpaceNavi = () => {
		
		
		
		jMap.getCoordinate(config.map_navi.p1, config.map_navi.p2, function(result) {
			if (result) {
				if (result.state === "success"){
					
					window.Android.kakaoNavi(config.map_navi.name, result.lat,result.lng);
				}else{
					alert(result.msg);
				}
			//????????? ??????
			}else if (result.msg){
				alert(result.msg);
			};    	
		});
	}

	//????????????
	btnMapSpace = async () => {
		$("#space_container tbody").html('<tr><td colspan="2">??????????????????.</td></tr>');
		var p1=1;
		if($(".btn-area").attr("class").indexOf("active") >= 0 ){
			p1=1;
		}else if($(".btn-area-circle").attr("class").indexOf("active") >= 0 ){
			p1=2;
		}
		var get_area = jMap.getArea(p1);
		
		if(get_area !== null){
			var geo1='';
			var geo2='';
			if(get_area.indexOf("|")>=0){
				var geo = get_area.split("|");
				geo1 = geo[0];
				geo2 = geo[1];
			}else{
				geo1 = get_area;
				geo2 = '';
			}
			
			
			const common = await Promise.all([ 
				service.retrieveSpatialSearch(p1,$("#facil_space").val(),geo2,geo1)
			]);
			
			if(common[0].data.code === "1"){
				var result = common[0].data.result;
				$("#space_container tbody").html('');
				if(result.length > 0 ){
					for(var count = 0; count < result.length; count++){
						if(result[count].facilNo){
							$("#space_container tbody").append('<tr><td data-id="'+result[count].id+'" data-p="'+result[count].pgubun+'">'+result[count].facilNo+'</td><td>'+result[count].facilNm+'</td></tr>');
						}
					}
				}else{
					$("#space_container tbody").html('<tr><td colspan="2">????????? ????????? ????????????.</td></tr>');
				}
			}else{
				alert(common[0].data.message);
				$("#space_container tbody").html('<tr><td colspan="2">????????? ????????? ????????????.</td></tr>');
			}
		}else{
			alert("??????/????????? ??????????????????");
		}
	}

	popupSave2 = (type) =>{
		var tt=this;
		var type_text2='memo';
		if(type === 0){
			type_text2='memo';
		}else if(type === 1){
			type_text2='edit';
		}else if(type === 2){
			type_text2='punch';
		}
		jMap.addNewFeature(function (result) {
				
				if (result) {
					if (result.state === "success") {
						
						//$(".input_"+type_text2).css("display","block");

						$(".riNm_"+type_text2).val(result.ri);
						$(".bjdNm_"+type_text2).val(result.bdong);
						$(".hjdNm_"+type_text2).val(result.hdong);
						$(".siNm_"+type_text2).val(result.si);
						$(".id_"+type_text2).val(result.id);
						//setTimeout(function(){
							tt.popupSave(type);
						//},500);
						//bdong: "?????????"hdong: "?????????"id: "101"jibun: "186-4"ri: ""si: "?????????"state: "success"
					}	     
					else if (result.msg) {
						alert(result.msg);
					}
				};
		});
	}

	//?????? ?????? ??????
	popupSave = async (type) => {
		//??????
		if(type === 0){
			var riNm_memo =$(".riNm_memo").val();
			var id_memo =$(".id_memo").val();
			var siNm_memo =$(".siNm_memo").val();
			var bjdNm_memo =$(".bjdNm_memo").val();
			var hjdNm_memo =$(".hjdNm_memo").val();
			var gubun_memo =$("#gubun_memo").val();
			var ynCivil_memo =$("#ynCivil_memo").val();
			var crtUsr_memo =$(".crtUsr_memo").val();
			var crtDt_memo =$(".crtDt_memo").val();
			var updUsr_memo =$(".updUsr_memo").val();
			var updDt_memo =$(".updDt_memo").val();
			var note_memo =$(".note_memo").val();
			var noteCivil_memo =$(".noteCivil_memo").val();
			var init_memo = 'Y'; //?????? ??????
			
			try {

				const memo = await Promise.all([ 
					service.saveMemoInfo(id_memo, siNm_memo, bjdNm_memo, hjdNm_memo, riNm_memo, gubun_memo, ynCivil_memo, crtDt_memo, crtUsr_memo, note_memo, updDt_memo, updUsr_memo,  noteCivil_memo, init_memo)
				]);

				if(memo[0].data.code==="1"){
					jMap.updateFeature("??????",id_memo);
				}
				$(".map_popup").css("display","none");
				alert(memo[0].data.message);
			} catch(err){
				alert("?????? ?????? ??????????????? ???????????????");
			}
		}else if(type === 1){
			var id_edit =$(".id_edit").val();
			var siNm_edit =$(".siNm_edit").val();
			var bjdNm_edit =$(".bjdNm_edit").val();
			var hjdNm_edit =$(".hjdNm_edit").val();
			var reqDt_edit =$(".reqDt_edit").val();
			var reqUsr_edit =$(".reqUsr_edit").val();
			var status_edit =$(".status_edit").val();
			var note_edit =$(".note_edit").val();
			var edtDt_edit =$(".edtDt_edit").val();
			var edtUsr_edit =$(".edtUsr_edit").val();
			var edtNote_edit =$(".edtNote_edit").val();
			var init_edit = 'Y';

			try {
				const edit = await Promise.all([ 
					service.saveEditReqInfo(id_edit, siNm_edit, bjdNm_edit, hjdNm_edit, reqDt_edit, reqUsr_edit, status_edit, note_edit, edtDt_edit, edtUsr_edit, edtNote_edit, init_edit)
				]);
				if(edit[0].data.code==="1"){
					jMap.updateFeature("????????????",id_edit);
				}
				$(".map_popup").css("display","none");
				alert(edit[0].data.message);
			} catch(err){
				alert("?????? ?????? ??????????????? ???????????????");
			}
		}else if(type === 2){		//?????????
			var id_punch =$(".id_punch").val();
			var siNm_punch =$(".siNm_punch").val();
			var bjdNm_punch =$(".bjdNm_punch").val();
			var riNm_punch =$(".riNm_punch").val();
			var constDate_punch =$(".constDate_punch").val();
			var constNm_punch =$(".constNm_punch").val();
			var coating_punch =$(".coatingNm_punch").val();
			var dust_punch =$(".dustNm_punch").val();
			var corrosion_punch =$(".corrosionNm_punch").val();
			var pipeThick_punch =$(".pipeThick_punch").val();
			var note_punch =$(".note_punch").val();
			var crtDt_punch =$(".crtDt_punch").val();
			var crtUsr_punch =$(".crtUsrNm_punch").val();
			var updDt_punch =$(".updDt_punch").val();
			var updUsr_punch =$(".updUsrNm_punch").val();
			var init_punch = 'Y';

			try {
				const punch = await Promise.all([ 
					service.savePunchInfo(id_punch, init_punch, siNm_punch, bjdNm_punch, riNm_punch, constDate_punch, constNm_punch, coating_punch, dust_punch, corrosion_punch, pipeThick_punch, note_punch, crtDt_punch, crtUsr_punch, updDt_punch, updUsr_punch)
				]);
				if(punch[0].data.code==="1"){
					jMap.updateFeature("?????????",id_punch);
				}
				$(".map_popup").css("display","none");
				alert(punch[0].data.message);
			} catch(err){
				alert("?????? ?????? ??????????????? ???????????????");
			}
		}

		jMap.refreshMap();
    jMap.drawFeature_cancel();
		$(".map-left-btn").css("display","none");
		$(".btn-input").removeClass("active");
		$(".btn-input-memo").removeClass("active");
		$(".btn-input-punch").removeClass("active");
		$(".btn-input-edit").removeClass("active");

	}
	//?????? ??????
	popupClose = () => {
		jMap.drawFeature_cancel();
		//alert(this.input_type);
		if(this.input_type  === "0"){
//			jMap.cancelFeature('??????',$(".id_memo").val());
		}else if(this.input_type  === "1"){
//			jMap.cancelFeature('????????????',$(".id_edit").val());
		}else if(this.input_type  === "2"){
//			jMap.cancelFeature('?????????'$(".id_punch").val());
		}
		
		$(".map_popup").css("display","none");
	}
	popupClose2 = () => {
		$(".select-info").css("display","none");
	}
	shouldComponentUpdate() {
    return false;
  }
	componentWillReceiveProps(){
		
		//alert("1"+config.user.id);
		if(config.user.id === ""){
			this.props.history.push('/login');
			//location.href="/login";
		}
		if($(".map").css("display") === "block"){

		}
	}

	tokenSave = async () => { 
		const tokens = await Promise.all([ 
			service.token_save(config.user.id, token)
		]);
		if(tokens[0].data.code==="1"){
//			alert("???????????? ????????? : "+config.user.id +", ??????: "+ token);
		}
	}
	
	//???????????? ?????? ?????? ??????
	EditStatusChange(){
		if($(".status_edit").val() === '??????'){
			$(".edtUsr_edit").prop("readonly",true);
			$(".edtDt_edit").prop("readonly",true);
			$(".edtNote_edit").prop("readonly",true);
			$(".edtUsr_edit").addClass("readonly");
			$(".edtDt_edit").addClass("readonly");
			$(".edtNote_edit").addClass("readonly");

		}else if($(".status_edit").val() === '??????'){
			$(".edtUsr_edit").prop("readonly",false);
			$(".edtDt_edit").prop("readonly",false);
			$(".edtNote_edit").prop("readonly",false);
			$(".edtUsr_edit").removeClass("readonly");
			$(".edtDt_edit").removeClass("readonly");
			$(".edtNote_edit").removeClass("readonly");
		}
	}
	componentDidMount() {
		if(token !==''){
			if(config.user.id!==''){
				this.tokenSave();
			}
		}

		//console.log("??????");
		//console.log(this.props.loginInfo.currentUserId);

		var t = this;

		if(this.props.loginInfo.currentUserId!==""){

			$(".header_title").html("??????");
			//alert(config.user.id);
			
			
			$(".top p").html(this.props.loginInfo.currentUser);
			setTimeout(
					function() {
						$(document).ready(function() { fnOnLoad(t.props.loginInfo.currentUserId); });
						$(document).on("beforeunload", function() { fnOnBeforeUnLoad(); });
						
					}
					.bind(this),
					1000
			);
		}
		this.fetchMenuList();

		$(function(){
			$(document).off("click",".btn_clear");
			$(document).on("click",".btn_clear",function(){
				$(this).prev().val("");
			});
		
			$(".menu-open").click(function(){
				//?????? ??????2020-12-07chs
				$(".submenu").hide();
				$(".minimenu").hide();
				$("nav button").removeClass("active");

				$(".menu").animate({
					left:'0'
				},"fast",function(){});
				$(".mask").css("display","block");
			});
			$(".menu-close").click(function(){
				$(".mask").css("display","none");
				$(".menu").animate({
					left:'-320px'
				},"fast",function(){
					
				});
			});
			$("nav a").click(function(){
				//$("nav .minimenu li a").removeClass("active");
				//$(this).find("a").addClass("active");

				if( $(this).attr("href") !== "/Map" ){
					config.inspection.type="";
					$(".map").css("display","none");
					$(".footer").css("display","none");
					$(".mbap_box").css("display","none");
					$(".mask").css("display","none");
					$(".btn_scada").css("display","none");
					$(".btn_record").css("display","block");

					$(".footer_contents").css("display","block");
					$(".contents").css("display","block");
					$(".contents .list").css("display","block");
				}
				$(".menu").animate({
					left:'-320px'
				},"fast",function(){});

				if( $(this).parent().parent().find(".active").html()=== undefined ){
					config.back.url = [];
				}
				$("nav a.active").removeClass("active");
				$(this).addClass("active");
		
					
				
				
				//?????? ????????? ???????????? ???????????????...
				//config.back.url = [];


			});

			$(".menu_scroll").click(function(){
				//setTimeout(function(){
					$(".menu").animate({
						scrollTop: ($(".menu").height())
					},300);
				//},300);
			});
			$(".mainmenu").click(function(){
				$(".mainmenu").removeClass("active");
				$(".submenu button").removeClass("active");

				if($(this).next().is(":hidden")){
					$(".submenu").hide();
					$(".minimenu").hide();

					$(this).addClass("active");
				}else{
					$(this).removeClass("active");
					$(this).next().find(".minimenu").hide();
					$(this).next().find("button").removeClass("active");
				}
				$(this).next().slideToggle();

			});
			$(".submenu button").click(function(){
				$(".submenu button").removeClass("active");

				if($(this).parent().attr("class").indexOf("nodown") >=0){
					config.inspection.type="";
					$(".map").css("display","none");
					$(".footer").css("display","none");
					$(".mbap_box").css("display","none");
					$(".mask").css("display","none");
					$(".btn_scada").css("display","none");
					$(".btn_record").css("display","block");

					$(".footer_contents").css("display","block");
					$(".contents").css("display","block");
					$(".contents .list").css("display","block");
					$(".menu").animate({
						left:'-320px'
					},"fast",function(){});
					
				}else{
					if($(this).next().is(":hidden")){
						$(".minimenu").hide();

						$(this).addClass("active");
					}else{
						$(this).removeClass("active");
					}
					$(this).next().slideToggle();
				}
			});

			$(".btn_map_close").click(function(){
				$(".mbap_box").css("display","none");
				jMap.setTrace(false);
			});
			$(".btn_map").click(function(){
				$(".mask").css("display","none");
				$(".menu").animate({
					left:'-320px'
				},"fast",function(){
					
				});
				$(".map").css("display","block");
				$(".footer").css("display","block");
				$(".footer_contents").css("display","none");
				$(".contents").css("display","none");
			});
			//???????????? ???
			$(".btn_address_type button").click(function(){

				$(".btn_address_type button").removeClass("active");
				$(this).addClass("active");

				$(".building").css("display","none");
				$(".ri").css("display","none");
				$(".gil").css("display","none");
				$(".map_address_list ul").html("");

				$(".address_search").css("display","none");

				$(".map_address_list").removeClass("change");
				if($(this).index() === 1){
					config.map_address.text = "addr";
					$(".juso").css("display","block");
					$(".ri").css("display","inline");
					$(".burn").css("display","block");
					$(".map_address_list").addClass("change");

				}else if($(this).index() === 2){
					config.map_address.text = "roadAddr";
					$(".juso").css("display","block");
					$(".gil").css("display","inline");
					$(".burn2").css("display","block");
					$(".map_address_list").addClass("change");

				}else if($(this).index() === 3){
					config.map_address.text = "facil";
					$(".sisul").css("display","block");
					$(".sisul2").css("display","block");
					$(".map_address_list").addClass("change");

				}else if($(this).index() === 4){
					config.map_address.text = "const";
					$(".construct").css("display","block");

				}else if($(this).index() === 5){
					config.map_address.text = "cust";
					$(".cust").css("display","block");

				}else{
					config.map_address.text = "build";
					$(".juso").css("display","block");
					$(".building").css("display","inline");
				}
			});

			//???????????? ????????? ???????????? readonly
			/*
			$(document).off("change","#map_facilGubun");
			$(document).on("change","#map_facilGubun",function(){
				if($(this).val() === "??????"){
					$("#map_facilNm").prop("readonly",true);
					$("#map_facilNm").addClass("readonly");
				}else{
					$("#map_facilNm").prop("readonly",false);
					$("#map_facilNm").removeClass("readonly");
				}
			})
			*/
			//??????????????? ????????? ?????? ??????
			$(document).off("click",".map_address_list li");
			$(document).on("click",".map_address_list li",function(){
				$(".map_address_list li").removeClass("active");
				$(this).addClass("active");

				var p1= "??????";
				var p2= $(this).attr("data-id");
				if(config.map_address.text==='addr'){
					p1= "??????";
				}else if(config.map_address.text==='roadAddr'){
					p1= "???????????????";
				}else if(config.map_address.text==='facil'){
					p1= $("#map_facilGubun").val();
				}else if(config.map_address.text==='const'){
					p1= "????????????";
					p2="filter=ID_CONST:'"+$(this).attr("data-id")+"'";
				}else if(config.map_address.text==='cust'){
					p1= "??????";
				}
				
				config.map_navi.p1 = p1;
				config.map_navi.p2 = p2;
				config.map_navi.name = $(this).find("p").html();
				
				
				jMap.map(p1, p2, function(result) {
					if (result) {          
						if(result.state==="success"){

						}
						if (result.msg) {
							alert(result.msg);
						};
					};
				});
			});
			
			//???????????? ????????? ??????
			$(document).off("click","#space_container td");
			$(document).on("click","#space_container td",function(){
				$("#space_container td").removeClass("active");
				$(this).parent().find("td").addClass("active");
				
				config.map_navi.p1 = $(this).parent().find("td:eq(0)").attr("data-p");
				config.map_navi.p2 = $(this).parent().find("td:eq(0)").attr("data-id");
				config.map_navi.name = $(this).find("td:eq(1)").html();
			});
			//$(document).on("mousedown","#mapview", function(e){

				//?????? ??????
			$(".btn-gps").click(function(){

				if($(".btn-gps-box").css("display")=="none"){
					//?????? ???????????????
					if($(".btn-gps").find("strong").css("display") =="block"){
						t.newGrpLoginfo(1);
		        window.Android.stopArea2();
						$(".btn-gps-box").css("display","none");
						$(".btn-gps").removeClass("active");

						$(".btn-gps").find("strong").css("display","none");
						$(".btn-gps-box button").removeClass("active");
					}else{
						window.Android.startArea2();
						$(".btn-gps-box").css("display","block");
						$(".btn-gps").addClass("active");
					}
				}else{

						t.newGrpLoginfo(1);
		        window.Android.stopArea2();
					
					$(".btn-gps-box").css("display","none");
					$(".btn-gps").removeClass("active");
				}
			});
		
			//?????? ?????? 1~4??????
			$(".btn-gps-box button").click(function(){
				t.sectorNm = $(this).index() + 1;
				t.newGrpLoginfo(1);
				$(".btn-gps").find("strong").css("display","none");
				$(".btn-gps-box").css("display","none");
				$(".btn-gps").removeClass("active");

				if( $(this).attr("class").indexOf("active") >= 0 ){
					$(this).removeClass("active");
				}else{
					$(".btn-gps-box button").removeClass("active");
					$(this).addClass("active");
					t.newGrpLoginfo(0);
					$(".btn-gps").find("strong").css("display","block");
				}
			});

			 //?????? ??????
			$(".btn-input-memo").click(function(){
				$(".btn-input-modify").removeClass("active");
				$(".btn-input-memo").removeClass("active");
				$(".btn-input-punch").removeClass("active");
				t.input_type = -1;
				if($(this).attr("class").indexOf("active") >= 0){
					jMap.drawFeature_cancel();
					$(this).removeClass("active");
				}else{
					t.input_type = 0;
					jMap.drawFeature('??????');
					$(this).addClass("active");
				}
			});
			//?????? ????????????
			$(".btn-input-modify").click(function(){
				$(".btn-input-modify").removeClass("active");
				$(".btn-input-memo").removeClass("active");
				$(".btn-input-punch").removeClass("active");

				t.input_type = -1;
				if($(this).attr("class").indexOf("active") >= 0){
					jMap.drawFeature_cancel();
					$(this).removeClass("active");
				}else{
					t.input_type = 1;
					jMap.drawFeature('????????????');
					$(this).addClass("active");
				}
			});
			//?????? ?????????
			$(".btn-input-punch").click(function(){
				$(".btn-input-modify").removeClass("active");
				$(".btn-input-memo").removeClass("active");
				$(".btn-input-punch").removeClass("active");

				t.input_type = -1;
				if($(this).attr("class").indexOf("active") >= 0){
					jMap.drawFeature_cancel();
					$(this).removeClass("active");
				}else{
					t.input_type = 2;
					jMap.drawFeature('?????????');
					$(this).addClass("active");
				}
			});
			$(document).off("click",".close_popup");
			$(document).on("click",".close_popup",function(){
				$(".popup").css("display","none");
			});
			
			$(document).off("click",".map_danger_tab button");
			$(document).on("click",".map_danger_tab button",function(){
				$(".map_danger_tab button").removeClass("active");
				$(this).addClass("active");
				$(".map_danger_list").css("display","none");
				$(".map_danger_list"+$(this).index()).css("display","block");
			});
			//???????????? ???????????? ??????
			$(document).off("click",".btn_map_danger1");
			$(document).on("click",".btn_map_danger1",function(){
				jMap.setAccident();
				$(".btn_map_danger2").css("display","block");
			});

			//???????????? ???????????? ?????? ??????
			$(document).off("click",".btn_map_danger2");
			$(document).on("click",".btn_map_danger2",function(){
				$(".btn_map_danger3").html("?????????");
				$(".btn_map_danger3").css("display","block");
				
				jMap.trace(function (result) {
					            
					if (result) {
							if (result.state == "success") {
								$(".btn_map_danger3").html("?????????????????????");
								$(".map_danger_sub").css("display","block");
								t.warningList();
							}
							else if (result.msg) {
								alert(result.msg);
							}
					};
				});
			});

			//????????? open close start
			$(document).off("click","li.layer_main button");
			$(document).on("click","li.layer_main button",function(){
				if($(this).parent().find("ul.layer_sub").css("display") === "none"){
					$(this).parent().find("ul.layer_sub").css("display","block");
					$(this).addClass("active");
				}else{
					$(this).parent().find("ul.layer_sub").css("display","none");
					$(this).removeClass("active");
				}
			});
			$(document).off("click","li.layer_sub button");
			$(document).on("click","li.layer_sub button",function(){
				if($(this).parent().find("ul.layer_mini").css("display") === "none"){
					$(this).parent().find("ul.layer_mini").css("display","block");
					$(this).addClass("active");
				}else{
					$(this).parent().find("ul.layer_mini").css("display","none");
					$(this).removeClass("active");
				}
			});

			$(document).off("click",".check_main");
			$(document).on("click",".check_main",function(){
				if($(this).prop("checked") === true){
					$(this).parent().parent().find("input").prop("checked",true);
				}else{
					$(this).parent().parent().find("input").prop("checked",false);
				}

				//console.log("?????????");
				//console.log(names);
				//jMap.setLayers(names);
			});
			$(document).off("click",".check_sub");
			$(document).on("click",".check_sub",function(){
				if($(this).prop("checked") === true){
					$(this).parent().parent().find("input").prop("checked",true);
				}else{
					$(this).parent().parent().find("input").prop("checked",false);
				}
				//jMap.setLayers(p1) :
			});
		//????????? open close end
		
			//?????? ?????? ????????? ????????? 
			$(document).off("click",".select-info li");
			$(document).on("click",".select-info li",function(){
				var co1 = $(this).find("strong").html();
				var co2 = $(this).find("span").html();
				if(co1==="??????"){
					t.props.history.push("/retrievePipeDetail/"+co2+"/map");
				}else if(co1==="??????"){
					t.props.history.push("/retrieveValveDetail/"+co2);
				}else if(co1==="?????????"){
					t.props.history.push("/retrieveGovDetail/"+co2);
				}else if(co1==="??????????????????"){
					t.props.history.push("/retrieveSpecialDetail/"+co2);
				}else{
					t.buildingSearch(co2);
				}
			});


			//?????? ??????
			jmobile.on("tap","#mapview",function(e){
				jMap.tap(e, function (result) {						
					
					
					if (result) {
						//??????
						var sResult;
						if (result.job === "singleselect" || result.job === "multiselect") {
							if (result.state === "singleobject" || result.state === "multiobject") {
								if (result.state === "multiobject") {  
									//????????????
									if (jMap.gbOverlapSelect) {  
										//???????????? ??????
										alert("?????? : " + result.data);
										//"????????????>>????????????: ?????????????????? ????????????"
									}
									else {
										//???????????? ??????


										
										var arrSplit = result.data.split('/');
										var arrSplit2 = arrSplit[0].split(',');       //??????????????? ??????
										jMap.selectObject(arrSplit2[0], arrSplit2[1]);
										sResult = jMap.getSelectedObject();  //???????????? ??????
										
										//????????? ??????
										//console.log("a");
										//console.log(arrSplit);
										if( $(".btn-info").attr("class").indexOf("active") >= 0 ){
											if(arrSplit2[0]==="??????"){
												t.props.history.push("/retrievePipeDetail/"+arrSplit2[1]+"/map");
											}else if(arrSplit2[0]==="??????"){
												t.props.history.push("/retrieveValveDetail/"+arrSplit2[1]);
											}else if(arrSplit2[0]==="?????????"){
												t.props.history.push("/retrieveGovDetail/"+arrSplit2[1]);
											}else if(arrSplit2[0]==="??????????????????"){
												t.props.history.push("/retrieveSpecialDetail/"+arrSplit2[1]);
											}else{
												//alert("1. ??????????????????." +arrSplit2[0]);
												t.buildingSearch(arrSplit2[1]);
											}
										}else{
											var li='';
											for(var k=0; k < arrSplit.length; k++){
												var ss = arrSplit[k].split(",");
												li = li + '<li>[<strong>'+ss[0]+'</strong>]<span>'+ss[1]+'</span></li>'
											}
											$(".select-info ul").html(li);
											$(".select-info").css('display',"block");
											$(".select-info").css('left',e.clientX+"px");
											$(".select-info").css('top',e.clientY+"px");
										}
										//alert("??????2 : " + sResult);
										
										/*
										if(co1[0]==="??????"){
											t.props.history.push("/retrievePipeDetail/"+co1[1]+"/map");
										}else if(co1[0]==="??????"){
											t.props.history.push("/retrieveValveDetail/"+co1[1]);
										}else if(co1[0]==="?????????"){
											t.props.history.push("/retrieveGovDetail/"+co1[1]);
										}else if(co1[0]==="??????????????????"){
											t.props.history.push("/retrieveSpecialDetail/"+co1[1]);
										}else{
											alert("??????????????????.");
										}
										*/
										//?????????????????? ????????????
									}
								}
								else {  
									//????????????
									

									var arrSplit = result.data.split('/');
									var arrSplit2 = arrSplit[0].split(',');       //??????????????? ??????
									jMap.selectObject(arrSplit2[0], arrSplit2[1]);
									sResult = jMap.getSelectedObject();  //???????????? ??????

										//console.log("a");
									//	console.log(arrSplit);
									//????????? ??????
									if( $(".btn-info").attr("class").indexOf("active") >= 0 ){
										if(arrSplit2[0]==="??????"){
											t.props.history.push("/retrievePipeDetail/"+arrSplit2[1]+"/map");
										}else if(arrSplit2[0]==="??????"){
											t.props.history.push("/retrieveValveDetail/"+arrSplit2[1]);
										}else if(arrSplit2[0]==="?????????"){
											t.props.history.push("/retrieveGovDetail/"+arrSplit2[1]);
										}else if(arrSplit2[0]==="??????????????????"){
											t.props.history.push("/retrieveSpecialDetail/"+arrSplit2[1]);
										}else if(arrSplit2[0]==="????????????"){
											t.props.history.push("/retrieveEditDetail/"+arrSplit2[1]);
										}else{
											// ???????????? ?????? ?????? ?????????.
											t.buildingSearch(arrSplit2[1]);
											//$(".building-search-form").css("display","block");
											//alert("2. ??????????????????." +arrSplit2[0]);
										}
									}else{
										var li='';
										for(var k=0; k < arrSplit.length; k++){
											var ss = arrSplit[k].split(",");
											li = li + '<li>[<strong>'+ss[0]+'</strong>]<span>'+ss[1]+'</span></li>'
										}
										$(".select-info ul").html(li);
										$(".select-info").css('display',"block");
										$(".select-info").css('left',e.clientX+"px");
										$(".select-info").css('top',e.clientY+"px");
									}
/*
									$(".select-info ul").html("");
									$(".select-info").css('display',"none");

									if(arrSplit2[0]==="??????"){
										t.props.history.push("/retrievePipeDetail/"+arrSplit2[1]+"/map");
									}else if(arrSplit2[0]==="??????"){
										t.props.history.push("/retrieveValveDetail/"+arrSplit2[1]);
									}else if(arrSplit2[0]==="?????????"){
										t.props.history.push("/retrieveGovDetail/"+arrSplit2[1]);
									}else if(arrSplit2[0]==="??????????????????"){
										t.props.history.push("/retrieveSpecialDetail/"+arrSplit2[1]);
									}else{
										alert("??????????????????.");
									}
									*/
									//?????????????????? ????????????
								}
							};
						};
					};
				});
			});
			jmobile.on("taphold","#mapview",function(e){
				var result = jMap.tapHold(e);

				if (result) {	
					if (result.state === "success"){
						var type_text= '';
						
						if( t.input_type === 0 ){
							type_text = 'memo';
							if(!$("#gubun_memo").html()){
								t.fetchCommon("??????","??????","gubun_memo");	
							}
							if(!$("#ynCivil_memo").html()){
								t.fetchCommon("??????","??????","ynCivil_memo");	
							}
						}else if( t.input_type === 1 ){
							type_text = 'edit';
							if(!$("#status_edit").html()){
								t.fetchCommon("????????????","??????","status_edit");	
							}
						}else if( t.input_type === 2 ){

							type_text = 'punch';
							if(!$("#coating_punch").html()){
								t.fetchCommon("?????????","????????????","coating_punch");	
							}
							if(!$("#dust_punch").html()){
								t.fetchCommon("?????????","????????????","dust_punch");	
							}
							if(!$("#corrosion_punch").html()){
								t.fetchCommon("?????????","????????????","corrosion_punch");	
							}
						}else{
							//?????????????????? ??? ?????? ??? ???????????? ?????? 
							if( config.detail_file.name==="retrieveRepairDetail"){
								
								jMap.addNewFeature(function (result) {
										
										if (result) {
											if (result.state === "success") {
												
												//$(".map").css("display","none");
												//$(".footer").css("display","none");
												//$(".contents").css("display","block");
												config.repair.id = result.id;
												config.repair.bdong = result.bdong;
												config.repair.hdong = result.hdong;
												config.repair.jibun = result.jibun;
												config.repair.ri = result.ri;
												config.repair.si = result.si;
												config.repair.save = 'yes';
												
												//???????????? ??????
												//t.bosuSave(result);

												t.props.history.push('/retrieveRepairDetail/'+config.detail_file.index);
											}	     
											else if (result.msg) {
												alert(result.msg);
											}
										};
								});
								
							}
						}


						$(".input_"+type_text).css("display","block");


						
						
						//?????????????????? ????????????
					}else if (result.msg){
						alert(result.msg);
					}
				};
			});
		});
		
		$(document).off("click","#popupC1 tr");
		$(document).on("click","#popupC1 tr",function(){
			t.BuldDtlInfo($(this).find("td:eq(0)").html());
		});
	}


//??????????????? ????????? ?????? ???????????????
BuldDtlInfo = async (cdBld) => { 
	const dtl_info = await Promise.all([ 
		service.retrieveBuldDtlInfo(cdBld)
	]);
	var td = '';
	var dtl = dtl_info[0].data.result;
	for(var i=0; i< dtl.length; i++){
		td += '<tr>';
		td = td + '<td>'+((dtl[i]['cdBld']) ? dtl[i]['cdBld'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['noCust']) ? dtl[i]['noCust'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['nmCust']) ? dtl[i]['nmCust'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['bldMng']) ? dtl[i]['bldMng'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['mnSysdef']) ? dtl[i]['mnSysdef'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['nmInhbt']) ? dtl[i]['nmInhbt'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['noMobil']) ? dtl[i]['noMobil'] : '')+'</td>'
		td = td + '<td>'+((dtl[i]['qtyUseFn']) ? dtl[i]['qtyUseFn'] : '')+'</td>'
		td += '</tr>';
	}
	$(".#popupC2").html(td);
}

//??????????????? ????????? 
SituBuldInfo = async () => { 
	$(".situbuld-form").css("display","block");

	const build_info = await Promise.all([ 
		service.retrieveSituBuldInfo()
	]);
	var td = '';
	var build = build_info[0].data.result;
	for(var i=0; i< build.length; i++){
		td += '<tr>';
		td = td + '<td>'+((build[i]['cdBld']) ? build[i]['cdBld'] : '')+'</td>'
		td = td + '<td>'+((build[i]['nmBld']) ? build[i]['nmBld'] : '')+'</td>'
		td = td + '<td>'+((build[i]['roadAddr']) ? build[i]['roadAddr'] : '')+'</td>'
		td = td + '<td>'+((build[i]['lLot']) ? build[i]['lLot'] : '')+'</td>'
		td = td + '<td>'+((build[i]['bldMng']) ? build[i]['bldMng'] : '')+'</td>'
		td = td + '<td>'+((build[i]['useCnt']) ? build[i]['useCnt'] : '')+'</td>'
		td += '</tr>';
	}
	$(".#popupC1").html(td);
	
}

//???????????????
warningList = async () => { 

	const warning1= await Promise.all([ 
		service.retrieveStopValve()
	]);
	const warning2= await Promise.all([ 
		service.retrieveAreaStopValve()
	]);
	const warning3= await Promise.all([ 
		service.retrieveSituBuldDtlInfo()
	]);
	
	var td = '';
	this.w1 = warning1[0].data.result;
	for(var i=0; i<this.w1.length; i++){
		td += '<li>'+this.w1[i].content1+'</li>';
	}
	$(".map_danger_wrap0:eq(0)").html(td);

	td = '';
	this.w2 = warning2[0].data.result;
	for(var i=0; i<this.w2.length; i++){
		td += '<li>'+this.w2[i].content1+'</li>';
	}
	$(".map_danger_wrap0:eq(1)").html(td);

	td = '';
	this.w3 = warning3[0].data.result;
	for(var i=0; i<this.w3.length; i++){
		td += '<li>'+this.w3[i].nmCust+'</li>';
	}
	$(".map_danger_wrap1").html(td);

}

//???????????? ??????
	//?????? ??????
	buildingSearch = async (id) => { 
		
			var idx = id;
			$(".sub_contents1").css("display","block");
			$(".sub_contents2").css("display","none");
			$(".header .building-search-form").css("display","block");
			//$(".minwon_add").css("display","none");
			
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

	//???????????? ??????
	sendMinwon = () =>{
		this.props.history.push("/retrieveBuildingMinwonDetail/"+$(".header .popup_buldNm").html());
		//$(".nmBld").val($(".popup_buldNm").html());
		$(".popup").css("display","none");
	}

    render() {
      const loginButton = (
          <li>
              <Link to="/login">
                  <i className="material-icons">vpn_key</i>
              </Link>
          </li>
      );
			/*
      const logoutButton = (
          <li>
              <a onClick={this.props.onLogout}>
                  <i className="material-icons">lock_open</i>
              </a>
          </li>
      );
			*/
      return (
			<div className="header">
				<div className="mask"></div>
				<PopupBuildingSearch2 onClick={this.sendMinwon} />
				<header>
					<div className="top">
						<button type="button" className="menu-open"><img alt="" src={menu} width="24" /></button>
						<span><img alt="" src={logo} width="95" /></span>
						<h1 className="header_title">{config.header.title}</h1>
						<p>{config.user.name}</p>
					</div>
					<nav className="menu">
						<dl>
							<dt><img alt="" src={menu_logo} width="170" height="21" /><button type="button" className="menu-close"><img alt="" src={menu_close} width="24" height="24" /></button></dt>
							<dd>
								<Link to="/Map"><button type="button" className="mainmenu noimage btn_map"><img alt="" src={menu_icon00} width="25" height="25" />????????????</button></Link>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon01} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrievePipe"><span>??</span>??????</Link></li>
											<li><Link to="/retrieveValve"><span>??</span>??????</Link></li>
											<li><Link to="/retrieveGov"><span>??</span>?????????</Link></li>
											<li><Link to="/retrieveSpecial"><span>??</span>??????????????????</Link></li>
										</ul>
									</li>
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveCommunal"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveSpecific"><span>??</span>??????????????????</Link></li>
											<li><Link to="/retrieveGeneral"><span>??</span>??????????????????</Link></li>
											<li><Link to="/retrieveGovernor"><span>??</span>???????????????</Link></li>
											<li><Link to="/retrieveRegulator"><span>??</span>???????????????</Link></li>
										</ul>
									</li>
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveTb"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveRectifier"><span>??</span>??????????????????</Link></li>
											<li><Link to="/retrieveJoin"><span>??</span>???????????????</Link></li>
										</ul>
									</li>
									
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveCoatdamage"><span>??</span>???????????????</Link></li>
											<li><Link to="/retrieveSoilresist"><span>??</span>???????????????</Link></li>
											<li><Link to="/retrievePunch"><span>??</span>?????????</Link></li>
										</ul>
									</li>
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveMemo"><span>??</span>??????</Link></li>
											<li><Link to="/retrievePlanpipe"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveEdit"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveRebuild"><span>??</span>???????????????</Link></li>
										</ul>
									</li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon02} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveInspPln/0"><span>??</span>???????????? ????????????</Link></li>
											<li><Link to="/retrieveInspPln/1"><span>??</span>???????????? ????????????</Link></li>
											<li><Link to="/retrieveInspPln/2"><span>??</span>???????????? ????????????</Link></li>
											<li><Link to="/retrieveInspRslt"><span>??</span>????????????</Link></li>
										</ul>
									</li>

									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveWeeklyInsp"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveQuarterInsp"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveAutoPeriodicInsp"><span>??</span>??????/????????????</Link></li>
											<li><Link to="/retrieveDisassemblyInsp"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveRegulatorInsp"><span>??</span>????????????????????? ??????</Link></li>
											<li><Link to="/retrieveGovInspRslt"><span>??</span>????????????</Link></li>
										</ul>
									</li>
									
									<li className="down">
										<button type="button"><span>-</span>????????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveAptInsp"><span>??</span>????????????</Link></li>
											<li><Link to="/retrieveSpecificInsp2"><span>??</span>??????????????????</Link></li>
											<li><Link to="/retrieveRegulatorInsp2"><span>??</span>???????????????</Link></li>
											<li><Link to="/retrieveUseInspRslt"><span>??</span>????????????</Link></li>
										</ul>
									</li>
									<li className="nodown"><button type="button"><Link to="/retrievePreInsp"><span>-</span>???????????????</Link></button></li>
			{/*<li className="nodown"><button type="button"><Link to="/"><span>-</span>?????????????????????(ppt????????? ??????)</Link></button></li>*/}
								</ul>
							</dd>

							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon03} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrieveAcceptance"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveDigwork"><span>-</span>????????????</Link></button></li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon04} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrieveDangerWork"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveRepair"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveProb"><span>-</span>????????????</Link></button></li>
								</ul>
							</dd>	
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon05} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrieveContract"><span>-</span>????????????</Link></button></li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon06} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrieveItem"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveItemIn"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveItemOut"><span>-</span>???????????? </Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveItemOutInDtl"><span>-</span>???????????? </Link></button></li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon07} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrieveConst"><span>-</span>??????????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveConstdaily"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveConstItem"><span>-</span>????????? ??????????????????</Link></button></li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu"><img alt="" src={menu_icon08} width="25" height="25" />????????????</button>
								<ul className="submenu">
									<li className="nodown"><button type="button"><Link to="/retrievePushUser"><span>-</span>????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrievePushSendInfo"><span>-</span>??????????????????</Link></button></li>
									<li className="nodown"><button type="button"><Link to="/retrieveInstrt"><span>-</span>??????????????????</Link></button></li>
								</ul>
							</dd>
							<dd>
								<button type="button" className="mainmenu menu_scroll"><img alt="" src={menu_icon09} width="25" height="25" />????????????</button>
								<ul className="submenu">
								
			{/*									<li className="nodown"><button type="button"><Link to="/Attach/Test"><span>-</span>????????? ?????? ??????</Link></button></li>*/}
									<li className="down">
										<button type="button" className="menu_scroll"><span>-</span>?????????</button>
										<ul className="minimenu">
											<li><Link to="/retrieveGM"><span>??</span>????????? ??????</Link></li>
											<li><Link to="/retrieveGMInsp"><span>??</span>???/????????? ????????? ??????</Link></li>
										</ul>
									</li>
									
									<li className="nodown"><button type="button"><Link to="/retrieveBuildingMinwon"><span>-</span>??????????????????</Link></button></li>
								</ul>
							</dd>
						</dl>

						<div className="btn_logout">
							<button type="button" onClick={this.Logout}>????????????</button>
						</div>
					</nav>
				</header>

				<PopupSituBuldInfo />
				{/*?????? ??????*/}
				<div className="map_popup input_memo">
					<div className="popup-box table">
						<h2>?????? ??????<button type="button" className="close_popup" onClick={this.popupClose}><img src={close} width="20" height="20" alt="" /></button></h2>

						<div className="popupContents popupInput" >

							<div className="box ">
								<div className="div_table">
									<form autoComplete="off" className="form_memo">
										<input type="hidden" className="riNm_memo" />
										<input type="hidden" className="hjdNm_memo" readOnly/>
										<div className="div_tr">
											<label>ID</label>
											<div className="div_td div_row1"><input type="text" className="id_memo readonly" readOnly/></div>
										</div>
										<div className="div_tr">
											<label>?????????</label>
											<div className="div_td">
												<input type="text" className="siNm_memo readonly" readOnly />
											</div>
											<label>?????????</label>
											<div className="div_td" >
												<input type="text" className="bjdNm_memo readonly" readOnly/>
											</div>
										</div>
										<div className="div_tr">
											<label>??????</label>
											<div className="div_td" >
												<select className="gubun_memo" id="gubun_memo"></select>
											</div>
											<label>???????????? ??????</label>
											<div className="div_td" >
												<select className="ynCivil_memo" id="ynCivil_memo"></select>
											</div>
										</div>
										<div className="div_tr">
											<label>???????????????</label>
											<div className="div_td">
												<input type="hidden" className="crtUsr_memo" value={config.user.id}/>
												<input type="text" className="crtUsrNm_memo readonly" readOnly value={config.user.name}/>
											</div>
											<label>???????????????</label>
											<div className="div_td" >
													<input type="text" className="readonly crtDt_memo" readOnly />
											</div>
										</div>
										<div className="div_tr">
											<label>???????????????</label>
											<div className="div_td">
												<input type="hidden" className="updUsr_memo" value={config.user.id} />
												<input type="text" className="updUsrNm_memo readonly" readOnly value={config.user.name}/>
											</div>
											<label>???????????????</label>
											<div className="div_td" >
												<input type="text" className="updDt_memo readonly" readOnly/>
											</div>
										</div>
										<div className="div_tr note_box">
											<label>????????????</label>
											<div className="div_td div_row1">
												<textarea className="note_memo keyup" maxlenght="200"></textarea>
											</div>
										</div>
										<div className="div_tr note_box">
											<label>????????????</label>
											<div className="div_td div_row1">
												<textarea className="noteCivil_memo keyup" maxlenght="300"></textarea>
											</div>
										</div>
										<div className="div_tr"></div>
									</form>

								</div>
							</div>

							<div className="popup_btn">
								<button type="button" className="close_popup close_x" onClick={this.popupClose}><img src={close_x} width="16" height="16" alt="" />??????</button>
								<button type="button" className="close_re btn_memo_save" onClick={() => this.popupSave2(0)}><img src={input_save} width="16" height="16" alt="" />??????</button>
							</div>
						</div>
					</div>
				</div>
				{/*???????????? ??????*/}
				<div className="map_popup input_edit">
					<div className="popup-box table">
						<h2>???????????? ??????<button type="button" className="close_popup" onClick={this.popupClose}><img src={close} width="20" height="20" alt="" /></button></h2>
						<div className="popupContents popupInput" >
							<div className="box ">
								<div className="div_table">
									<div className="div_tr">
										<label>ID</label>
										<div className="div_td div_row1"><input type="text" className="id_edit readonly" readOnly/></div>
									</div>
									<div className="div_tr">
										<label>?????????</label>
										<div className="div_td">
											<input type="text" className="siNm_edit readonly" readOnly/>
											<input type="hidden" className="hjdNm_edit" />
											<input type="hidden" className="riNm_edit" />
										</div>
										<label>?????????</label>
										<div className="div_td" >
											<input type="text" className="bjdNm_edit readonly" readOnly/>
										</div>
									</div>
									<div className="div_tr">
										<label>?????????</label>
										<div className="div_td">
											<input type="text" className="reqUsr_edit readonly" readOnly value={config.user.id}  />
										</div>
										<label>?????????</label>
										<div className="div_td" >
												<input type="text" className="reqDt_edit readonly" readOnly/>
										</div>
									</div>
									<div className="div_tr">
										<label>??????</label>
										<div className="div_td div_row1">
												<select id="status_edit" className="status_edit" onChange={this.EditStatusChange}></select>
										</div>
									</div>
									<div className="div_tr note_box">
										<label>????????????</label>
										<div className="div_td div_row1">
											<textarea className="note_edit"></textarea>
										</div>
									</div>
									<div className="div_tr">
										<label>?????????</label>
										<div className="div_td">
											<input type="text" className="edtUsr_edit keyup readonly" readOnly value={config.user.id} />
										</div>
										<label>?????????</label>
										<div className="div_td" >
											<input type="text" className="edtDt_edit keyup readonly" readOnly />
										</div>
									</div>
									<div className="div_tr note_box">
										<label>????????????</label>
										<div className="div_td div_row1">
											<textarea className="edtNote_edit readonly keyup" readOnly></textarea>
										</div>
									</div>
									<div className="div_tr"></div>

								</div>
							</div>

							<div className="popup_btn">
								<button type="button" className="close_popup close_x" onClick={this.popupClose}><img src={close_x} width="16" height="16" alt="" />??????</button>
								<button type="button" className="close_re btn_memo_save" onClick={() => this.popupSave2(1)}><img src={input_save} width="16" height="16" alt="" />??????</button>
							</div>
						</div>
					</div>
				</div>
				{/*????????? ??????*/}
				<div className="map_popup input_punch">
					<div className="popup-box table">
						<h2>????????? ??????<button type="button" className="close_popup" onClick={this.popupClose}><img src={close} width="20" height="20" alt="" /></button></h2>
						<div className="popupContents popupInput detail" >
							<div className="box ">
								<table className="punchleft">
									<colgroup>
										<col width="140px"/>
										<col width="*"/>
										<col width="140px"/>
										<col width="*"/>
									</colgroup>
									<tbody>
									<tr>
										<th>ID
											<input type="hidden" className="hjdNm_punch" /></th>
										<td colSpan="3" ><input type="text" className="id_punch readonly" readOnly/></td>
									</tr>
									<tr>
										<th>?????????</th>
										<td><input type="text" className="siNm_punch readonly" readOnly/></td>
										<th>?????????</th>
										<td><input type="text" className="bjdNm_punch readonly" readOnly /></td>
									</tr>
									<tr>
										<th>?????????</th>
										<td><input type="text" className="constDate_punch readonly" readOnly/></td>
										<th>???</th>
										<td><input type="text" className="riNm_punch readonly" readOnly/></td>
									</tr>
									<tr>
										<th>?????????</th>
										<td colSpan="3"><input type="text" className="constNm_punch" /></td>
									</tr>
									<tr>
										<th>????????????</th>
										<td>
											<select id="coating_punch"  className="coatingNm_punch">
											</select>
										</td>
										<th>????????????</th>
										<td>
											<select id="dust_punch"  className="dustNm_punch">
											</select>
										</td>
									</tr>
									<tr>
										<th>????????????</th>
										<td>
											<select id="corrosion_punch"  className="corrosionNm_punch">
											</select>
										</td>
										<th>????????????</th>
										<td><input type="text" className="pipeThick_punch" /></td>
									</tr>
									<tr>
										<th>??????</th>
										<td colSpan="3" className="note_box"><textarea className="keyup note_punch"></textarea></td>
									</tr>
									<tr>
										<th>??????????????????</th>
										<td><input type="text" className="keyup crtDt_punch readonly" readOnly /></td>
										<th>???????????????</th>
										<td><input type="text" className="keyup crtUsrNm_punch readonly" readOnly value={config.user.name}/></td>
									</tr>
									<tr>
										<th>??????????????????</th>
										<td><input type="text" className="keyup updDt_punch readonly" readOnly/></td>
										<th>???????????????</th>
										<td><input type="text" className="keyup updUsrNm_punch readonly" readOnly value={config.user.name}/></td>
									</tr>
									</tbody>
								</table>
							</div>

							<div className="popup_btn">
								<button type="button" className="close_popup close_x" onClick={this.popupClose}><img src={close_x} width="16" height="16" alt="" />??????</button>
								<button type="button" className="close_re btn_memo_save" onClick={() => this.popupSave2(2)}><img src={input_save} width="16" height="16" alt="" />??????</button>
							</div>
						</div>
					</div>
				</div>
				{/*?????????*/}
				<div className="mbap_box map_layer">
					<h2><span>?????????</span><button type="button" className="btn_map_close"><img alt="" src={menu_close} width="24" height="24" /></button></h2>
					<div className="map_layer_list">
						<ul className="layer_main"></ul>
					</div>
					<div className="layer_bottom">
						<button type="button" onClick={this.btnLayerReset}>?????????</button>
						<button type="button" onClick={this.btnLayerSet}>??????</button>
					</div>
				</div>
				{/*????????????*/}
				<div className="mbap_box map_address">
					<h2><span>????????????</span><button type="button" className="btn_map_close"><img alt="" src={menu_close} width="24" height="24" /></button></h2>
					<div>
						<div className="btn_address_type">
							<button type="button" className="active">??????<span>&nbsp;</span></button>
							<button type="button">??????<span>&nbsp;</span></button>
							<button type="button">?????????<span>&nbsp;</span></button>
							<button type="button">?????????<span>&nbsp;</span></button>
							<button type="button">????????????<span>&nbsp;</span></button>
							<button type="button">?????????</button>
						</div>
					</div>
					<div className="address_types">
						<div className="juso address_search">
							<div className="address50">
								<select id="map_bjdNm"></select>
							</div>
							<div className="address50 dong_types">
								<input type="text" placeholder="?????????" className="building" id="map_buldNm"/>
								<select className="ri" id="map_riNm"></select>
								<input type="text" placeholder="?????????"  className="gil" id="map_roadNm"/>
							</div>
						</div>
						<div className="burn address_search">
							<div className="address40">
								<input type="text"  id="map_lnbrMnnm" placeholder="??????"/>
							</div>
							<span className="address10">-</span>
							<div className="address40">
								<input type="text"  id="map_lnbrSlno" placeholder="??????"/>
							</div>
						</div>
						<div className="burn2 address_search">
							<div className="address40">
								<input type="text"  id="map_buldMnnm" placeholder="????????????"/>
							</div>
							<span className="address10">-</span>
							<div className="address40">
								<input type="text"  id="map_suldSlno" placeholder="????????????"/>
							</div>
						</div>
						<div className="sisul address_search">
							<div className="address100">
								<select id="map_facilGubun">
									<option value="??????">??????</option>
									<option value="??????">??????</option>
									<option value="????????????">????????????</option>
									<option value="??????????????????">??????????????????</option>
									<option value="?????????">?????????</option>
								</select>
							</div>
						</div>
						<div className="sisul2 address_search">
							<div className="address50">
								<input type="text" placeholder="????????????/ID" id="map_facilNo" />
							</div>
							<div className="address50">
								<input type="text" placeholder="??????/??????/????????????" id="map_facilNm" />
							</div>
						</div>
						<div className="construct address_search">
							<div className="address50">
								<input type="text" placeholder="??????ID" id="map_idConst" />
							</div>
							<div className="address50">
								<input type="text" placeholder="?????????" id="map_nmConst" />
							</div>
						</div>
						<div className="cust address_search">
							<div className="address50">
								<input type="text" placeholder="???????????????" id="map_noCust" />
							</div>
							<div className="address50">
								<input type="text" placeholder="????????????" id="map_nmCust" />
							</div>
						</div>
						<div className="address_btn">
							<button type="button" onClick={this.btnMapAddress}><img alt="" src={map_address_search_btn} width="15" height="15" />??????</button>
						</div>

						<div className="map_address_list">
							<ul>
								{/*
								<li>
									<span>1</span>
									<h3>??????????????? ????????? ?????????38??? 14(??????5???)</h3>
									<p>??????????????? ????????? ??????5??? 314-23</p>
								</li>
								*/}
							</ul>
						</div>

					</div>
					<div className="layer_bottom">
						<button type="button" onClick={this.mapAddressNavi}><img alt=""  src={icon4} width="15" height="15" />?????????</button>
					</div>
				</div>
				{/*????????????*/}
				<div className="mbap_box map_space">
					<h2><span>????????????</span><button type="button" className="btn_map_close"><img alt="" src={menu_close} width="24" height="24" /></button></h2>
					<div className="map_space_form">
	
						<div className="map_space_search">
							<label>????????????</label>
							<select id="facil_space">
							</select>
						</div>
						<div className="map_space_btn">
							<button type="button" onClick={this.btnMapSpace}><img alt="" src={map_address_search_btn} width="15" height="15" />??????</button>
						</div>
						<div className="map_space_contents">
							<div className="map_space_list">
								<div id="space_box">
									<div id="space_header">
										<table>
											<colgroup>
												<col width="90"/>
												<col width="300"/>
											</colgroup>
											<thead>
												<tr>
													<th>????????????</th>
													<th>??????</th>
												</tr>
											</thead>
										</table>
									</div>
									<div id="space_container">
										<table>
											<colgroup>
												<col width="91"/>
												<col width="300"/>
											</colgroup>
											<tbody>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="layer_bottom">
						<button type="button" onClick={this.mapSpaceNavi}><img alt="" src={icon4} width="15" height="15" />?????????</button>
					</div>
				</div>

				{/*????????????*/}
				<div className="mbap_box map_danger">
					<h2><span>????????????</span><button type="button" className="btn_map_close"><img alt="" src={menu_close} width="24" height="24" /></button></h2>
					<div className="map_danger_form">
						<button type="button" className="btn_map_danger1" >??????????????????</button>
						<button type="button" className="btn_map_danger3" onClick={this.SituBuldInfo} >?????????????????????</button>
						<button type="button" className="btn_map_danger2" >????????????</button>
						<div className="map_danger_sub">
							<div className="map_danger_tab">
								<button type="button" className="active">????????????</button>
								<button type="button">???????????????</button>
							</div>
							<div className="map_danger_list map_danger_list0">
								<h4>???????????????</h4>
								<div className="map_danger_wrap0">
									<ul>
										<li>???????????????1</li>
									</ul>
								</div>
								<h4>?????????????????????</h4>
								<div className="map_danger_wrap0">
									<ul>
										<li>?????????????????????1</li>
									</ul>
								</div>
							</div>
							<div className="map_danger_list map_danger_list1">
								<h3>??? ??????????????? <strong><span>0</span>??????</strong></h3>
								<h4>???????????????</h4>
								<div className="map_danger_wrap1">
									<ul>
										<li>?????????????????????1</li>
									</ul>
								</div>
							</div>

						</div>
					</div>
				</div>


				<div id="aa">?????? ?????????</div>
				<div className="map">
					{/*?????? ?????? ????????? ?????????*/}
					<div className="select-info">
						<h2>??????<button type="button" className="close_popup" onClick={this.popupClose2}><img src={close} width="15" height="15" alt="" /></button></h2>
						<div className="select-info-box">
							<ul></ul>
						</div>
					</div>

					<div id="dvMap" >
						<div id="map"></div>
						<div id="openMap"></div>
						<div id="roadView"></div>
					</div>
					<div className="grp-map-ui">
						<div className="map-top">
							<button type="button" className="btn-cadastral"><img src={map_cadastral} width="21" height="21" alt="" /><span>?????????</span></button>
							<div>
								<button type="button" className="btn-skyview"><img src={map_skyview} width="21" height="21" alt="" /><span>????????????</span></button>
								<button type="button" className="btn-map active"><img src={map_map} width="21" height="21" alt="" /><span>??????</span></button>
							</div>
						</div>
						<div className="map-right">
							<div className="map-btn">
								<button type="button" className="btn-portal"><img src={map_r01} width="21" height="21" alt="" /><span>?????????</span></button>
								
								<button type="button" className="btn-my-drive"><img src={map_l00} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-my-area"><img src={map_r02} width="21" height="21" alt="" /><span>??????</span></button>
								<div className="map-left-btn">
									<button type="button" className="btn-input-memo"><img src={map_l02} width="15" height="15" alt="" /><span>??????</span></button>
									<button type="button" className="btn-input-modify" ><img src={map_l01} width="15" height="15" alt="" /><span>????????????</span></button>
									<button type="button" className="btn-input-punch" ><img src={map_l03} width="15" height="15" alt="" /><span>?????????</span></button>
								</div>
								<button type="button" className="btn-input"><img src={map_r03} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-zoom-in"><img src={map_r04} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-zoom-out"><img src={map_r05} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-marea"><img src={map_r07_1} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-mdistance"><img src={map_r07} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-area-circle"><img src={map_r08_1} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-area"><img src={map_r08} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-select"><img src={map_r09_1} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-info"><img src={map_r09} width="21" height="21" alt="" /><span>??????</span></button>
								<button type="button" className="btn-reflash"><img src={map_r10} width="21" height="21" alt="" /><span>?????????</span></button>
							</div>
							<div className="map-btn">
								<div className="btn-gps-box">
									<button type="button" className="gpx01">1??????</button>
									<button type="button" className="gpx02">2??????</button>
									<button type="button" className="gpx03">3??????</button>
									<button type="button" className="gpx04">4??????</button>	
								</div>
								<button type="button" className="btn-gps"><img src={map_gps} width="21" height="21" alt="" /><strong></strong><span>??????</span></button>
							</div>
						</div>
					</div>
				</div>

			</div>

      );
    }
}
 
Header.propTypes = {
    isLoggedIn: PropTypes.bool,
    onLogout: PropTypes.func
};
 
Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => { console.error("logout function not defined");}
};

function fnOnLoad(userid) {
	if(userid===""){
		//window.location.href="/";
	}
//	console.log("????????????");
//	console.log(userid);
	//??? ??????
	var eleMap = document.getElementById('dvMap');
	var viewerWidth = window.innerWidth;
	var viewerHeight = window.innerHeight-111;

	$("#dvMap").css("width",viewerWidth + "px");
	$("#dvMap").css("height",viewerHeight + "px");

	$("#aa").html("-1 : " + viewerWidth+"/"+viewerHeight);

	jMap.setUser(userid);                          //?????????id ??????
	jMap.setMapviewSize(viewerWidth, viewerHeight, 0 ,56);  //??? ????????? ??????

	jMap.map(null, null, function(result) {                            //??? ??????
		if (result.state === "success") {

		};
	});
	$(".grp-map-ui").css("display","block");
}
function fnOnBeforeUnLoad() {
	jMap.saveMapEnv();
}
export default withRouter(Header);
 
