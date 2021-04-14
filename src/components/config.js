/*global jMap*/
import $ from "jquery";
import * as service from '../services/posts';




export const user = {id:"",name:"",token2:""}
export const table = {page:0,current:"",index:0,detail:[],list:"",filter:"",param1:"",param2:"",param3:"",p1:"",p2:"",attach1:"",attach2:"",attach3:"",attach4:"",attach5:"",change1:"",change2:"",gil:""}//인덱스,상세 메인 파라미터,검사이력param2,검사이력param3
export const detail_file = {idx:"",name:"",folder1:"",folder2:"",param:"",index:""}//(검사이력param1,상세이동시 폴더1, 상세이동시 폴더2,상세 파라미터,상세 인덱스)
export const view = {page:"list",prev_page:""}
export const back_url = ['/Map'];
export const map_address = {text:"build"}
export const inspection = {type:""}
export const header = {title:"지도"}
export const map_layer={list:""};
export const his={back:""};
export const report = {param1:"",param2:"",param3:"",param4:""} //검사이력 검사대상 정보 
//일단 여기다 처리
export const login = {session:""}
export const table_lists = [];
export const table_details = {info:""};
export const  table_name = {file:"",file2:"",file3:""};
export const  table_height = {height:"0"};
export const forminfo = [];
export const item_select = [];
//지도 위치 검색 클릭
export const map_navi = {name:"",p1:"",p2:""}
//보수작업 상세에서 아이디값
export const repair = {id:0,bdong:"",hdong:"",jibun:"",ri:"",si:"",save:"no"}

//재정리
//폼,리스트
export const grpifm = {form:[],search:{},list:[],contents:[],scroll:0,select_no:-1,nord_list:[]};
export const back = {url:[]};

//검사이력, 주간전검 정압시설 및 다른 리스트 폼,리스트
export const grpifm_insp = {form:[],search:[],list:[],contents:[],scroll:0,select_no:-1,index:-1};
//정압시설 점검이력 
export const grpifm_rslt = {form:[],search:[],list:[],contents:[],scroll:0,select_no:-1,index:-1};

//피복탐측상세 dcvg피복손상부 데이타
export const grpifm_rprd = {idx:-1}

//높이 조절
export function setWindowHeight(){
	$(function(){

		if(typeof $("#gridContainer").html() !== 'undefined'){
			var table_height = $(window).height() - $(".search").height() - $(".message").height() - $(".tab").height() - 280;//(350 === header, footer)
			$("#gridContainer").height(table_height);
		}
		
		//if($(".keyboard").html() === 'undefined'){
			var wrap_height = $(window).height() - 160 ;
			$(".wrap").height(wrap_height);
		//}

	});
}

//높이 조절
export function setWindowHeightForGrid(){
	$(function(){

		if(typeof $("#gridContainer").html() !== 'undefined'){
			var table_height = $(window).height() - $(".search").height() - $(".message").height() - $(".tab").height() - 280;//(350 === header, footer)
			$("#gridContainer").height(table_height);
		}
		
		//if($(".keyboard").html() === 'undefined'){
			var wrap_height = $(window).height() - 240 ;
			$(".wrap").height(wrap_height);
		//}

	});
}

//준비중
export const Ready = () =>{
	alert('준비중입니다.');
}
//통합으로 쓸 내용들
//상세정보
export const fetchDetail = async (e,detail) => { 
	if(detail_file.index === ""){
		alert("항목을 선택해주세요");
	}else{
		if(detail_file.index === "undefined"){
			alert("아이디가 없습니다.");
		}else{
			e.history.push('/'+detail+'/'+detail_file.index);
		}
	}
}

//첨부파일
export const AttachMove = (e,linkurl, title) => {
	his.back = linkurl;
	if(detail_file.index === ""){
		alert("항목을 선택해주세요");
	}else{
		e.history.push('/Attach/'+title);
	}
}
export const AttachMoveSelect = (e,linkurl, title) => {
	his.back = linkurl;
	if(table.attach1 === ""){
		alert("항목을 선택해주세요");
	}else{
		e.history.push('/Attach/'+title);
	}
}

//위치 이동
export const areaMove = (e,type) => {
	if(type===1){
		if(grpifm_insp.index === ""){
			alert("항목을 선택해주세요");
			return;
		}
	}else{
		if(detail_file.index === ""){
			alert("항목을 선택해주세요");
			return;
		}
	}
	if(table.p1 === undefined){
		alert("1.위치 정보가 없습니다");
		return;
	}
	if(table.p2==="" || table.p2 === undefined){
		alert("2.위치 정보가 없습니다");
		return;
	}
//alert(table.p1+"//"+table.p2);
	
	$(".contents").css("display","none");
	$(".map").css("display","block");
	$(".footer").css("display","block");
	$(".header_title").html("지도");
	if(table.p1!=="" || table.p1 !== undefined){
		var p1 = table.p1;
		var p2 = table.p2;

		//console.log("위치이동");
		//console.log("p1: "+p1+", p2: "+p2);
		jMap.map(p1, p2, function(result) {
			if (result) {          
				if(result.state==="success"){

				}
				if (result.msg) {
					alert(result.msg);
				};
			};
		});
		e.history.push('/Map');
	}else{
		alert("3.위치 정보가 없습니다");
	}

}

//길안내
export const navigation = (type) => {
	if(type===1){
		if(grpifm_insp.index === ""){
			alert("항목을 선택해주세요");
			return;
		}
	}else{
		if(detail_file.index === ""){
			alert("항목을 선택해주세요");
			return;
		}
	}
		var p1= table.p1;
		var p2= table.p2;

		
		

		jMap.getCoordinate(p1, p2, function(result) {
			if (result) {
				if (result.state === "success"){
					//console.log(result.lng+"/"+result.lat);
					if(table.gil==='' || table.gil==='null' || table.gil==='undefined'){
						table.gil = '길찾기';
					}
					window.Android.kakaoNavi(table.gil, result.lat,result.lng);
				}else{
					alert(result.msg);
				}
			//좌표값 사용
			}else if (result.msg){
				alert(result.msg);
			};    	
		});
	
}
//검사이력
export const RetrieveInspRslt = (e,type) => {
	if(detail_file.index === ""){
		alert("항목을 선택해주세요");
	}else{
		//config.his.back = "retrieveSpecial";
		e.history.push("/RetrieveInspRslt/"+type+"/"+table.param3);
	}
}

//뒤로가기
export const btnBack = (e) => {
	//e.history.goBack();
	//return;

	back.url.pop();
	var burl = back.url[back.url.length-1];
/*
		console.log("뒤로가기");
		console.log(back);
		console.log(back.url.length);
		console.log(burl);
*/		
	if(back.url.length <= 0){
		$(".contents").css("display","none");
		$(".map").css("display","block");
		$(".footer").css("display","block");
		//back.url = ['/'];
		e.history.push("/Map");

	}else{
		$(".contents").css("display","block");
		$(".map").css("display","none");
		$(".footer").css("display","none");

		if(burl !== e.history.location.pathname){
			e.history.push(burl);
		}

	}

}

//검색 함수
export function form_search(search_type,txt){
	var var_name;

	if(!grpifm.search[txt]){
		var_name = $("#"+txt).val();
		grpifm.search[txt] = var_name;
	}else{
		//스크롤 이면
		if(search_type === 0){
			var_name = grpifm.search[txt];
		//신규 검색이면
		}else{
			var_name = $("#"+txt).val();
			grpifm.search[txt] = var_name;
		}
	}
	return var_name;
}

//공통함수
export var common_list={};
export const fetchCommon = async (feature,type,id,filter) => { 
	if(grpifm.form[feature+'_'+type+"_"+filter] !== undefined && grpifm.form[feature+'_'+type+"_"+filter].length > 0 ){
		var result = grpifm.form[feature+'_'+type+"_"+filter];
		var selected = '';
		for(var count = 0; count < result.length; count++){
			selected = '';
			if(grpifm.search[id] === result[count].lcode){
				selected = ' selected';
			}
			$("#"+id).append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
		}
	}else{
		const common = await Promise.all([service.getCommon(feature,type,filter)]);
		var result = common[0].data.result;
		grpifm.form[feature+'_'+type+"_"+filter] = result;
		for(var count = 0; count < result.length; count++){
			$("#"+id).append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
}

export const fetchStrCode = async (feature,type,id,filter) => { 
	if(grpifm.form[feature+'_'+type+"_"+filter] !== undefined && grpifm.form[feature+'_'+type+"_"+filter].length > 0 ){
		var result = grpifm.form[feature+'_'+type+"_"+filter];
		var selected = '';
		for(var count = 0; count < result.length; count++){
			selected = '';
			if(grpifm.search[id] === result[count].lcode){
				selected = ' selected';
			}
			$("#"+id).append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
		}
	}else{
		const common = await Promise.all([service.getStrCode(feature,type,filter)]);
		var result = common[0].data.result;
		grpifm.form[feature+'_'+type+"_"+filter] = result;
		for(var count = 0; count < result.length; count++){
			$("#"+id).append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
}

export const fetchStrCode2 = async (feature,type,id,filter) => { 
	if(grpifm.form[feature+'_'+type+"_"+filter] !== undefined && grpifm.form[feature+'_'+type+"_"+filter].length > 0 ){
		var result = grpifm.form[feature+'_'+type+"_"+filter];
		var selected = '';
		for(var count = 0; count < result.length; count++){
			selected = '';
			if(grpifm.search[id] === result[count].lcode){
				selected = ' selected';
			}
			$("."+id).append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
		}

	}else{
		const common = await Promise.all([service.getStrCode(feature,type,filter)]);
		var result = common[0].data.result;
		grpifm.form[feature+'_'+type+"_"+filter] = result;
		for(var count = 0; count < result.length; count++){
			$("."+id).append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
}
	//읍면동
export const fetchERPDong = async (bjdnm) => { 
	if(grpifm.form['cdDong'] !== undefined){
		var result = grpifm.form['cdDong'];
		var selected = '';
		for(var count = 0; count < result.length; count++){
			selected = '';
			if(grpifm.search['cdDong']  === result[count].lcode){
				selected = ' selected';
			}
			$("#cdDong").append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
		}
	}else{
		const common = await Promise.all([service.retrieveErpDong(bjdnm)]);
		var result = common[0].data.result;
		grpifm.form['cdDong'] = result;
		for(var count = 0; count < result.length; count++){                
			$("#cdDong").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
}


//읍면동
export var dong_list=[];
export const fetchDong = async (bjdnm) => {

	if(grpifm.form['bjdNm'] !== undefined ){
		var result = grpifm.form['bjdNm'];
		var selected = '';
		for(var count = 0; count < result.length; count++){
			selected = '';
			if(grpifm.search['bjdNm']  === result[count].lcode){
				selected = ' selected';
			}
			$("#bjdNm").append(("<option value=\""+result[count].lcode+"\" "+selected+">"+result[count].lvalue+"</option>"));
		}
	}else{
		const common = await Promise.all([service.retreiveDong(bjdnm)]);
		var result = common[0].data.result;
		grpifm.form['bjdNm'] = result;
		for(var count = 0; count < result.length; count++){                
			$("#bjdNm").append(("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}
}

//날짜 정렬
export function formatDate(date,join) {
			var d = new Date(date), 
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();
			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2) 
				day = '0' + day; 
			
			if(year.toString() >= 5){

			}

			return [year, month, day].join(join); 
}

export function formatDate2(date,join) {
			var year = date.substr(0,4);
			var month = date.substr(4,2);
			var day = date.substr(6,2);

			return [year, month, day].join(join); 
}

export function formatTime(date,join) {
	var d = new Date(date);
  var hh = d.getHours();
  var mm = d.getMinutes();
  var ss = d.getSeconds();

  return [(hh>9 ? '' : '0') + hh,
          (mm>9 ? '' : '0') + mm,
          (ss>9 ? '' : '0') + ss,
         ].join(join);
}

