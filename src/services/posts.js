import axios from 'axios';
import * as config from '../components/config';

export const host = "http://localhost:8088";
//export const host = "http://ibc.iptime.org:8080";
//export const host = "http://grpmobile.dhgas.com:4800";
export const url = host+"/DHMobileSM";

//로그인
export function login(id,pw){
	return axios.post(url+'/common/userAuth.do',{idUser: id, passWord: pw});
}
//로그인후 토큰 저장
export function token_save(idUser,token){
	return axios.post(url+'/common/LoginController/modifyToken.do',{idUser:idUser,token:token});
}
//메뉴 리스트
export function menuList(){
	return axios.post(url+'/common/menuController/retrieveMenuList.do',{token2:config.user.token2,idUser:config.user.id});
}
//공통코드
export function getCommon(feature,type,filter){
	var data = {feature: feature,gubun: type}
	if(filter !== ''){
		data['filter'] = filter;
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/common/codeController/retrievePickList.do', data);
}

//사용자 선택
export function retrieveFileGroup(){
	return axios.post(url+'/file/retrieveFileGroup.do', {token2:config.user.token2,idUser:config.user.id});
}


//읍면동
export function retreiveDong(bjdNm){
	//return axios.post(url+'/common/codeController/retrieveErpDong.do', {bjdNm: bjdNm});
	return axios.post(url+'/common/codeController/retrieveDong.do', {bjdNm: bjdNm,token2:config.user.token2,idUser:config.user.id});
}

//법정동
export function retrieveErpDong(bjdNm){
	return axios.post(url+'/common/codeController/retrieveErpDong.do', {bjdNm: bjdNm,token2:config.user.token2,idUser:config.user.id});
}
//리 검색
export function retrieveRi(bjdNm){
	return axios.post(url+'/common/codeController/retrieveRi.do', {bjdNm: bjdNm,token2:config.user.token2,idUser:config.user.id});
}

//관경별 연장
export function retrievePipeDiaLenDetail(idConst){
	return axios.post(url+'/supply/pipeController/retrievePipeDiaLenDetail.do', {idConst: idConst, token2:config.user.token2,idUser:config.user.id});
}
//과년도 전위값
export function retrievePastTb(facilNo,idInspType,yyPlnFr,yyPlnTo){
	return axios.post(url+'/protect/tbController/retrievePastTb.do', {facilNo : facilNo ,idInspType : idInspType ,yyPlnFr : yyPlnFr ,yyPlnTo : yyPlnTo,token2:config.user.token2,idUser:config.user.id });
}

//상세페이지
//config.detail_file.folder1, config.detail_file.folder2, config.detail_file.name, config.detail_file.index
export function getDetail(){
	var link=url+"/"+config.detail_file.folder1+"/"+config.detail_file.folder2+"/"+config.detail_file.name+'.do';
	var data = {};
	data[config.detail_file.param] = config.detail_file.index;
	data['gbFrag'] = config.table.param2;
/*
	if(config.detail_file.name ==="retrievePipeDetail" && config.detail_file.idx!==""){
		data['id'] = config.detail_file.idx;
	}
*/
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	
	return axios.post(link, data);
}

//지도 차단분석 차단추적
export function retrieveStopValve(){
	return axios.post(url+'/situ/situController/retrieveStopValve.do',{token2:config.user.token2,idUser:config.user.id});
}
export function retrieveAreaStopValve(){
	return axios.post(url+'/situ/situController/retrieveAreaStopValve.do',{token2:config.user.token2,idUser:config.user.id});
}
export function retrieveSituBuldDtlInfo(){
	return axios.post(url+'/situ/situController/retrieveSituBuldDtlInfo.do',{token2:config.user.token2,idUser:config.user.id});
}
//차단수용가 목록 리스트
export function retrieveSituBuldInfo(){
	return axios.post(url+'/situ/situController/retrieveSituBuldInfo.do',{token2:config.user.token2,idUser:config.user.id});
}
//차단수용가 상세 리스트
export function retrieveBuldDtlInfo(cdBld){
	return axios.post(url+'/situ/situController/retrieveBuldDtlInfo.do',{cdBld:cdBld,token2:config.user.token2,idUser:config.user.id});
}


//지도 레이어 버튼
export function retrieveUserLayerList(){
	return axios.post(url+'/map/LayerController/retrieveUserLayerList.do',{userId: config.user.id,token2:config.user.token2,idUser:config.user.id});
}
//지도 레이어초기화 버튼
export function resetLayerForSystem(){
	return axios.post(url+'/map/LayerController/resetLayerForSystem.do',{userId: config.user.id,token2:config.user.token2,idUser:config.user.id});
}
//지도 레이어적용 버튼
export function setUserLayers( userLayers){
	return axios.post(url+'/map/LayerController/setUserLayers.do',{userId: config.user.id,userLayers: userLayers,token2:config.user.token2,idUser:config.user.id });
}
//지도 공간검색 버튼
export function retrieveSpatialSearch(gubun,facil,radius,geometryInfo){
	return axios.post(url+'/map/spatialSearchController/retrieveSpatialSearch.do',{gubun: gubun,facil: facil,radius: radius,geometryInfo: geometryInfo,token2:config.user.token2,idUser:config.user.id});
}
//지도 위치검색 버튼
export function retrieveLocation(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/map/locationController/retrieveLocation.do',data);
}

//파일첨부 사진조회 리스트
export function retrieveFiles(skip,top){
	
	var data =  {$skip: skip,$top: top, gubun:config.table.attach1,cdKey1:config.table.attach2};
	if(config.table.attach3!==""){
		data['cdKey2'] = config.table.attach3;
	}
	if(config.table.attach4!==""){
		data['cdKey3'] = config.table.attach4;
	}
	if(config.table.attach5!==""){
		data['cdKey4'] = config.table.attach5;
	}

	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/file/retrieveFiles.do', data);
}
//파일첨부 사진조회 다운로드
export function fileDownload(data){
	//data['gubun']=config.table.attach1;
	//return axios.post(url+'/file/download3.do',{cdCompany:"10000",cdKey1:"19870001",dtsInsert:"2020-08-06 13:35",filename:"시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",gbFile:"SFR35_01_01",gbNmFile:"시공감리필증",gubun:"배관",idInsert:"10056",noDocu:"EF20200801",noFile:"1000015796",num:"2",pathname:"ftp://121.180.31.15:1021/IMAGE/DOCU/F/시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",remark:"1",seqFile:"1"});
	//return axios.post(url+'/file/download.do',data);
	//var data = {cdCompany:"10000",cdKey1:"19870001",dtsInsert:"2020-08-06 13:35",filename:"시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",gbFile:"SFR35_01_01",gbNmFile:"시공감리필증",gubun:"배관",idInsert:"10056",noDocu:"EF20200801",noFile:"1000015796",num:"2",pathname:"ftp://121.180.31.15:1021/IMAGE/DOCU/F/시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",remark:"1",seqFile:"1"};
	/*
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: qs.stringify(data),
		url:url+'/file/download3.do',
	};
	return axios(options);
	*/
}
//파일 사진 조회

export function fileDownloadImage(data){
	data['gubun']=config.table.attach1;
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	//return axios.post(url+'/file/download3.do',{cdCompany:"10000",cdKey1:"19870001",dtsInsert:"2020-08-06 13:35",filename:"시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",gbFile:"SFR35_01_01",gbNmFile:"시공감리필증",gubun:"배관",idInsert:"10056",noDocu:"EF20200801",noFile:"1000015796",num:"2",pathname:"ftp://121.180.31.15:1021/IMAGE/DOCU/F/시공필증 - 미평동 미평삼거리 ~ 연등3교 전단 구간 배관공사_INZ20200800520.pdf",remark:"1",seqFile:"1"});
	return axios.post(url+'/file/download5.do',data);
}

//파일첨부 사진조회 삭제
/*
export function retrieveFiles(){
	return axios.post(url+'/file/retrieveFiles.do', {gubun:config.table.attach1,cdKey1:config.table.attach3});
}
*/

//시설물 공급시설 배관 검색
export function retrievePipeList(cdDong,idConst,nmConst,kdPipe,cdPress,cdMat,noSector1,gbPipe,skip,top){
	return axios.post(url+'/supply/pipeController/retrievePipeList.do', {token2:config.user.token2,idUser:config.user.id,cdDong: cdDong, idConst: idConst,nmConst: nmConst,kdPipe: kdPipe,cdPress: cdPress,cdMat: cdMat,noSector1: noSector1,gbPipe: gbPipe, $skip: skip,$top: top});
}

//시설물 공급시설 밸브 검색
export function retrieveValveList(gbPipe,facilNo,nmVb,bjdNm,idConst,nmConst,noSector1,pressure,valveTyp,skip,top){
	return axios.post(url+'/supply/valveController/retrieveValveList.do', {token2:config.user.token2,idUser:config.user.id,gbPipe: gbPipe, facilNo: facilNo,nmVb: nmVb,bjdNm: bjdNm,idConst: idConst,nmConst: nmConst,noSector1: noSector1,pressure: pressure,valveTyp: valveTyp,$skip: skip,$top: top});
}

//시설물 공급시설 정압기 검색
export function retrieveGovList(govnm,typertu,addr,kindmd,dtlawfr,dtlawto,skip,top){
	return axios.post(url+'/supply/govController/retrieveGovList.do', {token2:config.user.token2,idUser:config.user.id,govNm: govnm, typeRtu: typertu, addr: addr, kindMd: kindmd, dtLawFr: dtlawfr, dtLawTo: dtlawto, $skip: skip, $top: top});
}

//시설물 중점 관리 시설
export function retrieveSpecialList(gbFrag,facilNo,specialName,bjdNm,idConst,nmConst,noSector1,cdPress,kdVb,skip,top){
	return axios.post(url+'/supply/specialController/retrieveSpecialList.do', {token2:config.user.token2,idUser:config.user.id,gbFrag:gbFrag,facilNo:facilNo,specialName:specialName,bjdNm:bjdNm,idConst:idConst,nmConst:nmConst,noSector1:noSector1,cdPress:cdPress,kdVb:kdVb, $skip: skip, $top: top});
}
//시설물 중점관리시설 scada
export function retrieveScadaEventInfo(facilNo){
	return axios.post(url+'/supply/govController/retrieveScadaEventInfo.do',{token2:config.user.token2,idUser:config.user.id,facilNo: facilNo});
}



//사용시설 공동주택
export function retrieveCommunalList(dtFstInspFr,dtFstInspTo,stUse,nmFcltBld,skip,top){
	return axios.post(url+'/use/useFacilityController/retrieveCommunalList.do', {token2:config.user.token2,idUser:config.user.id,dtFstInspFr: dtFstInspFr, dtFstInspTo: dtFstInspTo, stUse: stUse, nmFcltBld: nmFcltBld, $skip: skip, $top: top});
}

//사용시설 특정사용시설
export function retrieveSpecificList(dtFstInspFr,dtFstInspTo,stUse,nmFcltBld,ynMultiuse,ynSafe,skip,top){
	return axios.post(url+'/use/useFacilityController/retrieveSpecificList.do', {token2:config.user.token2,idUser:config.user.id,dtFstInspFr: dtFstInspFr, dtFstInspTo: dtFstInspTo, stUse: stUse, nmFcltBld: nmFcltBld, ynMultiuse: ynMultiuse, ynSafe: ynSafe, $skip: skip, $top: top});
}
//사용시설 특정사용시설 변경이력
export function retrieveChangeList(){
	return axios.post(url+'/use/useFacilityController/retrieveChangeList.do', {token2:config.user.token2,idUser:config.user.id,cdFcltBld: config.table.change1,kdFclt: config.table.change2});
}

//사용시설 일반사용시설
export function retrieveGeneralList(dtSplyFr,dtSplyTo,txAddr,gbCntr,ynStdpipe,stUse,nmFcltBld,skip,top){
	return axios.post(url+'/use/useFacilityController/retrieveGeneralList.do', {token2:config.user.token2,idUser:config.user.id,dtSplyFr: dtSplyFr, dtSplyTo: dtSplyTo, txAddr: txAddr, gbCntr: gbCntr, ynStdpipe: ynStdpipe, stUse: stUse, nmFcltBld: nmFcltBld, $skip: skip, $top: top});
}

//사용시설 단독사용시설
export function retrieveGovernorList(dtLawFr,dtLawTo,dtInspFr,dtInspTo,nmGov,txAddr,skip,top){
	return axios.post(url+'/use/governorController/retrieveGovernorList.do', {token2:config.user.token2,idUser:config.user.id,dtLawFr: dtLawFr, dtLawTo: dtLawTo, dtInspFr: dtInspFr, dtInspTo: dtInspTo, nmGov: nmGov, txAddr: txAddr, $skip: skip, $top: top});
}

//사용시설 압력조정기
export function retrieveRegulatorList(dtLawFr,dtLawTo,dtInspFr,dtInspTo,nmGov,txAddr,gbFclt,skip,top){
	return axios.post(url+'/use/governorController/retrieveRegulatorList.do', {token2:config.user.token2,idUser:config.user.id,dtLawFr: dtLawFr, dtLawTo: dtLawTo, dtInspFr: dtInspFr, dtInspTo: dtInspTo, nmGov: nmGov, txAddr: txAddr, gbFclt: gbFclt, $skip: skip, $top: top});
}

//시설물 방식시설 전기방식
export function retrieveTbList(gbPipe,facilNo,facilNm,bjdNm,idConst,nmConst,noSector1,pressure,ynProtect,skip,top){
	return axios.post(url+'/protect/tbController/retrieveTbList.do', {token2:config.user.token2,idUser:config.user.id,gbPipe: gbPipe, facilNo: facilNo, facilNm: facilNm, bjdNm: bjdNm, idConst: idConst, nmConst: nmConst, noSector1: noSector1, pressure: pressure, ynProtect: ynProtect, $skip: skip, $top: top});
}
//시설물 방식시설 외부전원장치
export function retrieveRectifierList(bjdNm,idConst,nmConst,exvtgNm,status,skip,top){
	return axios.post(url+'/protect/rectifierController/retrieveRectifierList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, idConst: idConst, nmConst: nmConst, exvtgNm: exvtgNm, status: status, $skip: skip, $top: top});
}
//시설물 방식시설 절연조인트
export function retrieveJointList(bjdNm,status,pressure,material,dia,skip,top){
	return axios.post(url+'/protect/jointController/retrieveJointList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, status: status, pressure: pressure, material: material, dia: dia, $skip: skip, $top: top});
}
//시설물 관리시설 피복손상부
export function retrieveCoatdamageList(bjdNm,idConst,nmConst,yyPlnFr,yyPlnTo,probDtFr,probDtTo,location,skip,top){
	return axios.post(url+'/manage/coatdamageController/retrieveCoatdamageList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, idConst: idConst, nmConst: nmConst, yyPlnFr: yyPlnFr, yyPlnTo: yyPlnTo, probDtFr: probDtFr, probDtTo: probDtTo, location: location, $skip: skip, $top: top});
}
//시설물 관리시설 토양비저항
export function retrieveSoilresistList(bjdNm,idConst,nmConst,yyPlnFr,yyPlnTo,probDtFr,probDtTo,location,skip,top){
	return axios.post(url+'/manage/soilresistController/retrieveSoilresistList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, idConst: idConst, nmConst: nmConst, yyPlnFr: yyPlnFr, yyPlnTo: yyPlnTo, probDtFr: probDtFr, probDtTo: probDtTo, location: location, $skip: skip, $top: top});
}
//시설물 관리시설 천공칩
export function retrievePunchList(bjdNm,constNm,constDateFr,constDateTo,coating,dust,corrosion,skip,top){
	return axios.post(url+'/manage/punchController/retrievePunchList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, constNm: constNm, constDateFr: constDateFr, constDateTo: constDateTo, coating: coating, dust: dust, corrosion: corrosion, $skip: skip, $top: top});
}
//시설물 기타시설 메모
export function retrieveMemoList(bjdNm,gubun,ynCivil,updUsr,updDtFr,updDtTo,skip,top){
	var data = {$skip: skip, $top: top};
	if(bjdNm!==''){
		data['bjdNm'] = bjdNm;
	}
	if(gubun!==''){
		data['gubun'] = gubun;
	}
	if(ynCivil!==''){
		data['ynCivil'] = ynCivil;
	}
	if(updUsr!==''){
		data['updUsr'] = updUsr;
	}
	if(updDtFr!==''){
		data['updDtFr'] = updDtFr;
	}
	if(updDtTo!==''){
		data['updDtTo'] = updDtTo;
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/etc/memoController/retrieveMemoList.do', data);
}
//시설물 기타시설 계획배관
export function retrievePlanpipeList(bjdNm,noConstpln,idConst,nmConst,status,skip,top){
	return axios.post(url+'/etc/planpipeController/retrievePlanpipeList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, noConstpln: noConstpln, idConst: idConst, nmConst: nmConst, status: status, $skip: skip, $top: top});
}
//시설물 기타시설 수정의뢰
export function retrieveEditList(bjdNm,status,edtUsr,edtDtFr,edtDtTo,skip,top){
	return axios.post(url+'/etc/editController/retrieveEditList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, status: status, edtUsr: edtUsr, edtDtFr: edtDtFr, edtDtTo: edtDtTo, $skip: skip, $top: top});
}
//시설물 기타시설 재개발건축
export function retrieveRebuildList(bjdNm,gubun,status,constNm,beginDateFr,beginDateTo,complDateFr,complDateTo,agntCom,constCom,constMng,skip,top){
	return axios.post(url+'/etc/rebuildController/retrieveRebuildList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, gubun: gubun, status: status, constNm: constNm, beginDateFr: beginDateFr, beginDateTo: beginDateTo, complDateFr: complDateFr, complDateTo: complDateTo, agntCom: agntCom, constCom: constCom, constMng: constMng, $skip: skip, $top: top});
}


//안전점검 공급시설 검사대상
export function retrieveInspPlnList(inspGubun,kdFclt,gbFrag,yyPln,gbPipe,noSector1Nm,cdDong,skip,top){
	var data = {$skip: skip, $top: top};
	if(inspGubun!==''){
		data['inspGubun'] = inspGubun;
	}
	if(kdFclt!==''){
		data['kdFclt'] = kdFclt;
	}
	if(gbFrag!==''){
		data['gbFrag'] = gbFrag;
	}
	if(yyPln!==''){
		data['yyPln'] = yyPln;
	}
	if(gbPipe!==''){
		data['gbPipe'] = gbPipe;
	}
	if(noSector1Nm!==''){
		data['noSector1Nm'] = noSector1Nm;
	}
	if(cdDong!==''){
		data['cdDong'] = cdDong;
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/supplyInsp/inspPlnController/retrieveInspPlnList.do', data);
}

//안전점검 공급시설 검사이력
export function retrieveInspRsltList(inspGubun,kdFclt,gbFrag,gbPipe,noSector1Nm,cdDong,dtInspFr,dtInspTo,cdRslt,cdFclt,skip,top){
	var data = {$skip: skip, $top: top};
	if(inspGubun!==''){
		data['inspGubun'] = inspGubun;
	}
	if(kdFclt!==''){
		data['kdFclt'] = kdFclt;
	}
	if(inspGubun!==''){
		data['inspGubun'] = inspGubun;
	}
	if(gbFrag!==''){
		data['gbFrag'] = gbFrag;
	}
	if(gbPipe!==''){
		data['gbPipe'] = gbPipe;
	}
	if(noSector1Nm!==''){
		data['noSector1Nm'] = noSector1Nm;
	}
	if(cdDong!==''){
		data['cdDong'] = cdDong;
	}
	if(dtInspFr!==''){
		data['dtInspFr'] = dtInspFr;
	}
	if(dtInspTo!==''){
		data['dtInspTo'] = dtInspTo;
	}
	if(cdRslt!==''){
		data['cdRslt'] = cdRslt;
	}
	if(cdFclt!==''){
		data['cdFclt'] = cdFclt;
	}

	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/supplyInsp/inspRsltController/retrieveInspRsltList.do', data);
}

//기타시설물 메모 저장
export function saveMemoInfo(id, siNm, bjdNm, hjdNm, riNm, gubun, ynCivil, crtDt, crtUsr, note, updDt, updUsr, noteCivil, init){
	var data = {token2:config.user.token2,idUser:config.user.id,userId: config.user.id, id: id, siNm: siNm, bjdNm: bjdNm, hjdNm: hjdNm, riNm: riNm, gubun: gubun, ynCivil: ynCivil, crtDt: crtDt, crtUsr: crtUsr, note: note, updDt: updDt, noteCivil: noteCivil, init: init};

	return axios.post(url+'/etc/memoController/saveMemoInfo.do', data);
}

//기타시설물 메모 삭제
export function deleteMemoInfo(id){
	/*, JSESSIONID: config.login.session*/
	return axios.post(url+'/etc/memoController/deleteMemoInfo.do', {token2:config.user.token2,idUser:config.user.id,userId: config.user.id, id: id});
}
//기타시설 수정의뢰 저장
export function saveEditReqInfo(id,siNm, bjdNm, hjdNm, reqDt, reqUsr, status, note, edtDt, edtUsr, edtNote, init){
	var data = {token2:config.user.token2,idUser:config.user.id,userId: config.user.id, id: id, siNm: siNm, bjdNm: bjdNm, hjdNm: hjdNm, reqDt: reqDt, reqUsr: reqUsr, status: status, note: note, edtDt: edtDt, edtUsr: edtUsr, edtNote: edtNote, init: init};
	return axios.post(url+'/etc/editController/saveEditReqInfo.do', data);
}

//기타시설 수정의뢰 삭제
export function deleteEditReqInfo(id){
	return axios.post(url+'/etc/editController/deleteEditReqInfo.do', {token2:config.user.token2,idUser:config.user.id,userId: config.user.id,id: id});
}

//천공칩 수정
export function savePunchInfo(id, init, siNm, bjdNm, riNm, constDate, constNm, coating, dust, corrosion, pipeThick, note, crtDt, crtUsr, updDt, updUsr){
	return axios.post(url+'/manage/punchController/savePunchInfo.do', {token2:config.user.token2,idUser:config.user.id,id, init, siNm, bjdNm, riNm, constDate, constNm, coating, dust, corrosion, pipeThick, note, crtDt, crtUsr, updDt, updUsr});
}
//천공칩 삭제
export function deletePunchInfo(id){
	return axios.post(url+'/manage/punchController/deletePunchInfo.do', {token2:config.user.token2,idUser:config.user.id,userId: config.user.id,id: id});
}

//검사대상  관로자율검사(밸브), 관로정기검사(밸브)
//관로자율검사(TB), 관로정기검사(TB)
//관로자율검사(중점관리대상), 관로정기검사(중점관리대상)
export function retrieveSupplyInspInfo(){
	var data={token2:config.user.token2,idUser:config.user.id,cdCompany: 10000, kdFclt: config.report.param1, idInsp: config.report.param2, idInspType : config.report.param3}
	return axios.post(url+'/supplyInsp/inspPlnController/retrieveSupplyInspInfo.do',data);
}
export function retrieveSupplyInspInfo2(kdFclt,idInsp,idInspType){
	var data={token2:config.user.token2,idUser:config.user.id,cdCompany: 10000, kdFclt: kdFclt, idInsp: idInsp, idInspType : idInspType}
	return axios.post(url+'/supplyInsp/inspPlnController/retrieveSupplyInspInfo.do',data);
}
//검사대상 저장
export function saveInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/supplyInsp/inspPlnController/saveInspInfo.do',data);
}

//안전점검 정압시설 주간점검
export function retrieveWeeklyInspList(cycleDay,nmFclt,skip,top){
	return  axios.post(url+'/govInsp/weeklyInspController/retrieveWeeklyInspList.do', {token2:config.user.token2,idUser:config.user.id,cycleDay: cycleDay, nmFclt: nmFclt, idInspType:1042, $skip: skip, $top: top});
}

//안전점검 사용시설 주간점검 상세 
export function retrieveWeeklyInspInfo(cdFclt,idInsp,idInspType){
	var data = {cdFclt:cdFclt};
	if(idInsp !== "undefined"){
		data['idInsp'] = idInsp;
	}else{
		data['idInsp'] = "";
	}
	if(idInspType !== "undefined"){
		data['idInspType'] = idInspType
	}else{
		data['idInspType'] = "";
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/weeklyInspController/retrieveWeeklyInspInfo.do', data);
}
//안전점검 사용시설 주간점검 상세/저장
export function saveWeeklyInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/govInsp/weeklyInspController/saveWeeklyInspInfo.do',data);
}


//안전점검 정압시설 분기점검
export function retrieveQuarterInspList(idInspType,nmFclt,skip,top){
	return  axios.post(url+'/govInsp/quarterInspController/retrieveQuarterInspList.do', {token2:config.user.token2,idUser:config.user.id,idInspType: idInspType, nmFclt: nmFclt,  $skip: skip, $top: top});
}

//안전점검 정압시설 분기점검 상세
export function retrieveQuarterInspInfo(cdFclt,idInsp,idInspType){
	var data = {cdFclt:cdFclt, idInspType:idInspType};
	if(idInsp !== "undefined"){
		data['idInsp'] = idInsp;
	}else{
		data['idInsp'] = "";
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/quarterInspController/retrieveQuarterInspInfo.do', data);
}
//안전점검 정압시설 분기점검 저장
export function saveQuarterInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/quarterInspController/saveQuarterInspInfo.do', data);
}

//안전점검 정압시설 자율/정기검사
export function retrieveAutoPeriodicInspList(inspGubun,dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,skip,top){
	return  axios.post(url+'/govInsp/autoPeriodicInspController/retrieveAutoPeriodicInspList.do',  {token2:config.user.token2,idUser:config.user.id,inspGubun: inspGubun, dtInspPlnFr: dtInspPlnFr, dtInspPlnTo:dtInspPlnTo, nmFclt:nmFclt, txAddr:txAddr, $skip: skip, $top: top});
}
//안전점검 정압시설 자율/정기검사 상세
export function retrieveAutoPeriodicInspInfo(cdFclt,idInsp,idInspType){
	var data = {cdFclt:cdFclt, idInspType:idInspType};
	if(idInsp !== "undefined"){
		data['idInsp'] = idInsp;
	}else{
		data['idInsp'] = "";
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/autoPeriodicInspController/retrieveAutoPeriodicInspInfo.do', data);
}

//안전점검 정압시설 자율/정기검사 저장
export function saveAutoPeriodicInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/autoPeriodicInspController/saveAutoPeriodicInspInfo.do', data);
}
//안전점검 정압시설 분해점검 리스트
export function retrieveDisassemblyInspList(inspGubun,dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,skip,top){
	return  axios.post(url+'/govInsp/DisassemblyInspController/retrieveDisassemblyInspList.do',{token2:config.user.token2,idUser:config.user.id,inspGubun: inspGubun, dtInspPlnFr: dtInspPlnFr, dtInspPlnTo:dtInspPlnTo, nmFclt:nmFclt, txAddr:txAddr, $skip: skip, $top: top});
}
 
//안전점검 정압시설 분해점검 상세
export function retrieveDisassemblyInspInfo(idInsp,idInspType){
	return  axios.post(url+'/govInsp/DisassemblyInspController/retrieveDisassemblyInspInfo.do', {token2:config.user.token2,idUser:config.user.id,idInsp:idInsp, idInspType:idInspType});
}
  
//안전점검 정압시설 분해점검 저장
export function saveDisassemblyInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/govInsp/DisassemblyInspController/saveDisassemblyInspInfo.do', data);
}

//안전점검 정압시설 공급압력조정기 점검 리스트
export function retrieveRegulatorInspList(idInspType,inspGubun,dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,skip,top){
	return  axios.post(url+'/useInsp/regulatorInspController/retrieveRegulatorInspList.do',{token2:config.user.token2,idUser:config.user.id,idInspType: idInspType, inspGubun: inspGubun, dtInspPlnFr: dtInspPlnFr, dtInspPlnTo:dtInspPlnTo, nmFclt:nmFclt, txAddr:txAddr, $skip: skip, $top: top});
}
 
//안전점검 정압시설 공급압력조정기 점검 상세
export function retrieveRegulatorInspInfo(idInsp,idInspType){
	return  axios.post(url+'/useInsp/regulatorInspController/retrieveRegulatorInspInfo.do', {token2:config.user.token2,idUser:config.user.id,idInsp:idInsp, idInspType:idInspType});
}
  
//안전점검 정압시설 공급압력조정기 점검 저장
export function saveRegulatorInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/useInsp/regulatorInspController/saveRegulatorInspInfo.do', data);
}


//안전점검 정압시설 점검이력 리스트
export function retrieveGovInspRsltList(inspGubun, dtInspFr, dtInspTo,cdRslt,inspType,cdFclt,nmFclt, skip, top){
	return  axios.post(url+'/govInsp/govInspRsltController/retrieveGovInspRsltList.do', {token2:config.user.token2,idUser:config.user.id,inspGubun:inspGubun, dtInspFr:dtInspFr, dtInspTo:dtInspTo, cdRslt:cdRslt, inspType:inspType, cdFclt:cdFclt, nmFclt:nmFclt, $skip: skip, $top: top});
}



//안전점검 사용시설 공동주택
export function retrieveAptInspList(inspGubun, dtInspPlnFr, dtInspPlnTo, nmFclt, txAddr, skip,top){
	return  axios.post(url+'/useInsp/aptInspController/retrieveAptInspList.do', {token2:config.user.token2,idUser:config.user.id,inspGubun: inspGubun, dtInspPlnFr: dtInspPlnFr, dtInspPlnTo: dtInspPlnTo, nmFclt: nmFclt, txAddr: txAddr, $skip: skip, $top: top});
}
//안전점검 사용시설 공동주택 자율검사 상세
export function retrieveAptInspInfo(cdFclt,idInsp,idInspType){
	return  axios.post(url+'/useInsp/aptInspController/retrieveAptInspInfo.do', {token2:config.user.token2,idUser:config.user.id,cdFclt: cdFclt, idInsp: idInsp, idInspType : idInspType});
}

//안전점검 사용시설 공동주택 자율검사 저장
export function saveAptInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	
	return  axios.post(url+'/useInsp/aptInspController/saveAptInspInfo.do', data);
}
//안전점검 사용시설 특정사용시설 리스트
export function retrieveSpecificInspList2(inspGubun,dtInspPlnFr,dtInspPlnTo,nmFclt,txAddr,skip,top){
	return  axios.post(url+'/useInsp/specificInspController/retrieveSpecificInspList.do', {token2:config.user.token2,idUser:config.user.id,inspGubun: inspGubun, dtInspPlnFr: dtInspPlnFr, dtInspPlnTo:dtInspPlnTo, nmFclt:nmFclt, txAddr:txAddr, $skip: skip, $top: top});
}

//안점점검 사용시설 특정사용시설 상세
export function retrieveSpecificInspInfo(cdFclt,idInsp,idInspType){
	return  axios.post(url+'/useInsp/specificInspController/retrieveSpecificInspInfo.do', {token2:config.user.token2,idUser:config.user.id,cdFclt:cdFclt, idInsp:idInsp, idInspType:idInspType});
}

//안점점검 사용시설 특정사용시설 저장
export function saveSpecificInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/useInsp/specificInspController/saveSpecificInspInfo.do', data);
}


//안전점검 사용시설 검사이력 리스트
export function retrieveUseInspRslt(gbFclt,cdFclt,nmFclt,txAddr,inspGubun,dtInspFr,dtInspTo,cdRslt,skip,top){
	return  axios.post(url+'/useInsp/useInspRsltController/retrieveUseInspRsltList.do', {token2:config.user.token2,idUser:config.user.id,gbFclt:gbFclt,cdFclt:cdFclt,nmFclt:nmFclt,txAddr:txAddr,inspGubun:inspGubun,dtInspFr:dtInspFr,dtInspTo:dtInspTo,cdRslt:cdRslt, $skip: skip, $top: top});
}
//안점점검 사용시설 검사이력 개선조치 결과등록
export function retrieveCorrRsltInfo(cdFclt,idInsp,idInspType){
	return  axios.post(url+'/useInsp/useInspRsltController/retrieveCorrRsltInfo.do', {token2:config.user.token2,idUser:config.user.id,cdFclt:cdFclt, idInsp:idInsp, idInspType:idInspType});
}

//안점점검 사용시설 검사이력 개선조치 결과저장
export function saveCorrRsltInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return  axios.post(url+'/useInsp/useInspRsltController/saveCorrRsltInfo.do', data);
}




//공급관리 

//작업관리 피복탐측
export function retrieveProbList(idConst,nmConst,yyPln,skip,top){
	return axios.post(url+'/work/probController/retrieveProbList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,yyPln:yyPln,$skip: skip, $top: top});
}
//피복탐측 결과
export function retrieveProbRsltDetail(idConst,yyPln){
	return axios.post(url+'/work/probController/retrieveProbRsltDetail.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,yyPln:yyPln});
}
//dcvg피복손상부 목록조회
export function retrieveProbRsltDcvgList(cntDcvg,dtProb,seqProb,idConst,yyPln ){
	return axios.post(url+'/work/probController/retrieveProbRsltDcvgList.do',{token2:config.user.token2,idUser:config.user.id,cntDcvg:cntDcvg,dtProb:dtProb,seqProb:seqProb,idConst:idConst,yyPln:yyPln});
}
//피복 탐측 결과 정보 저장
export function saveProbRslt(idConst,yyPln,seqProb,gbProb,dtProb,nmEmp,qtyLen,plcProbFr,plcProbTo,cntDcvg,lenDcvg,cntCips,qtyResi,plcResi ){
	return axios.post(url+'/work/probController/saveProbRslt.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,yyPln:yyPln,seqProb:seqProb,gbProb:gbProb,dtProb:dtProb,nmEmp:nmEmp,qtyLen:qtyLen,plcProbFr:plcProbFr,plcProbTo:plcProbTo,cntDcvg:cntDcvg,lenDcvg:lenDcvg,cntCips:cntCips,qtyResi:qtyResi,plcResi:plcResi});
}
//피복 탐측 결과 정보 삭제
export function deleteProbRslt(yyPln, idConst, seqProb){
	return axios.post(url+'/work/probController/deleteProbRslt.do',{token2:config.user.token2,idUser:config.user.id,seqProb:seqProb,idConst:idConst,yyPln:yyPln});
}
//피복손상부부 저장
export function saveProbRsltDcvg(yyPln, idConst, seqProb, dtProb, dcvgList){
	return axios.post(url+'/work/probController/saveProbRsltDcvg.do',{token2:config.user.token2,idUser:config.user.id,seqProb:seqProb,idConst:idConst,yyPln:yyPln,dtProb:dtProb,dcvgList:dcvgList});
}




//작업관리 위험작업 리스트 
export function retrieveDangerWorkList(idConst,nmConst,status,gbWork,cdDept,dtWorkRsvFr,dtWorkRsvTo,skip,top){
	return axios.post(url+'/work/dangerWorkController/retrieveDangerWorkList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,status:status,gbWork:gbWork,cdDept:cdDept,dtWorkRsvFr:dtWorkRsvFr,dtWorkRsvTo:dtWorkRsvTo,$skip: skip, $top: top});
}
//작업관리 위험작업 저장
export function updateDangerWork(dtWork, contWork, idWork, status) {
    return axios.post(url+'/work/dangerWorkController/updateDangerWork.do', {token2:config.user.token2,idUser:config.user.id,dtWork:dtWork, contWork:contWork, idWork:idWork, status:status})
}
//작업관리 안전교육 
export function retrieveDangerWorkEdu(idWork) {
    return axios.post(url+'/work/dangerWorkController/retrieveDangerWorkEdu.do', {token2:config.user.token2,idUser:config.user.id,idWork:idWork})
}
//작업관리 안전교육  작업수행자정보 
export function retrieveDangerWorkEduWorker(idWork) {
    return axios.post(url+'/work/dangerWorkController/retrieveDangerWorkEduWorker.do', {token2:config.user.token2,idUser:config.user.id,idWork:idWork})
}

//작업관리 안전교육  필요장비 및 공구 준비사항 정보 
export function retrieveDangerWorkEduFacil(idWork) {
    return axios.post(url+'/work/dangerWorkController/retrieveDangerWorkEduFacil.do', {token2:config.user.token2,idUser:config.user.id,idWork:idWork})
}

//작업관리 안전교육 필요장비 및 공구 작업수행장 정보 합침.
export function retrieveDangerWorkEduList(idWork) {
  return axios.post(url+'/work/dangerWorkController/retrieveDangerWorkEduList.do', {token2:config.user.token2,idUser:config.user.id,idWork:idWork})
}

//작업관리 보수작업 리스트
export function retrieveRepairList(cdDong,idInspType,status,kdFclt,crtDtFr,crtDtTo,dtInspFr,dtInspTo,skip,top) {
    return axios.post(url+'/work/repairController/retrieveRepairList.do', {token2:config.user.token2,idUser:config.user.id,cdDong:cdDong,idInspType:idInspType,status:status,kdFclt:kdFclt,crtDtFr:crtDtFr,crtDtTo:crtDtTo,dtInspFr:dtInspFr,dtInspTo:dtInspTo, $skip: skip, $top: top})
}
//작업관리 보수작업 상세정보 저장
export function updateRepairResultInfo(status, noEmpCorr, dtCorr, contCorr, id, updUsr, idInspType, idInsp) {
    return axios.post(url+'/work/repairController/updateRepairResultInfo.do', {token2:config.user.token2,idUser:config.user.id,status:status, noEmpCorr:noEmpCorr, dtCorr:dtCorr, contCorr:contCorr, id:id, updUsr:updUsr, idInspType:idInspType, idInsp:idInsp})
}
//작업관리 보수작업 위치 저장
export function updateGisRepairInfo(id,siNm,bjdNm,hjdNm,riNm,status,idInspType,idInsp,init,crtUsr) {
    return axios.post(url+'/work/repairController/updateGisRepairInfo.do', {token2:config.user.token2,idUser:config.user.id,id:id, siNm:siNm, bjdNm:bjdNm, hjdNm:hjdNm, riNm:riNm, status:status, idInspType:idInspType, idInsp:idInsp, init:init, crtUsr:crtUsr})
}
export function createDangerWorkEdu(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/work/dangerWorkController/createDangerWorkEdu.do',data);
}






//영업관리 
export function retrieveContractList(nmPrd,addrSply,dtCntrFr,dtCntrTo,gbCntr,skip,top){
	return axios.post(url+'/sales/contractController/retrieveContractList.do',{token2:config.user.token2,idUser:config.user.id,nmPrd:nmPrd,addrSply:addrSply,dtCntrFr:dtCntrFr,dtCntrTo:dtCntrTo,gbCntr:gbCntr,$skip: skip, $top: top});
}
//영업관리 상세 계약정보
export function retrieveContractUseList(idCntr){
	return axios.post(url+'/sales/contractController/retrieveContractUseList.do',{token2:config.user.token2,idUser:config.user.id,idCntr:idCntr});
}





//자재관리 자재현황 리스트
export function retrieveItemList(dtItem,cdItem,ynQtySafe,YnQtyRemReal,skip,top){
	return axios.post(url+'/item/itemController/retrieveItemList.do',{token2:config.user.token2,idUser:config.user.id,dtItem:dtItem,cdItem:cdItem,ynQtySafe:ynQtySafe,YnQtyRemReal:YnQtyRemReal,$skip: skip, $top: top});
}
//자재관리 자재현황 실사저장
export function modifyItemListReal(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/item/itemController/modifyItemListReal.do',data);
}
//자재관리 자재입고
export function retrieveItemInList(dtInFr,dtInTo,noIn,nmEmpChk,nmEmp,skip,top){
	return axios.post(url+'/item/itemController/retrieveItemInList.do',{token2:config.user.token2,idUser:config.user.id,dtInFr:dtInFr,dtInTo:dtInTo,noIn:noIn,nmEmpChk:nmEmpChk,nmEmp:nmEmp,$skip: skip, $top: top});
}
//자재관리 자재삭제
export function deleteItemIn(noIn){
	return axios.post(url+'/item/itemController/deleteItemIn.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn});
}
//자재관리 자재입고 추가
export function createItemIn(dtIn,noEmpChk,remark){
	return axios.post(url+'/item/itemController/createItemIn.do',{token2:config.user.token2,idUser:config.user.id,dtIn:dtIn,noEmpChk:noEmpChk,remark:remark});
}
//자재관리 자재입고 수정
export function modifyItemIn(noIn,dtIn,noEmpChk,remark){
	return axios.post(url+'/item/itemController/modifyItemIn.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn,dtIn:dtIn,noEmpChk:noEmpChk,remark:remark});
}
//자재관리 자재입고 입고상세
export function retrieveItemInDetailInfo(noIn){
	return axios.post(url+'/item/itemController/retrieveItemInDetailInfo.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn});
}
//자재관리 자재입고 입고품목 
export function retrieveItemInDtlList(noIn){
	return axios.post(url+'/item/itemController/retrieveItemInDtlList.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn});
}
//자재관리 자재입고 입고품목저장 gis품목조회랑 api 같음 확인 필요 입고품목 저장이 맞음 gis목록조회 수정해야함.
export function createItemInDtlList(data){

	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;

	return axios.post(url+'/item/itemController/createItemInDtlList.do',data);
}
//자재관리 자재입고 입고품목수정
export function modifyItemInDtl(noIn,seqIn,dtIn,cdPartner,qtyIn,prcItem ){
	return axios.post(url+'/item/itemController/modifyItemInDtl.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn,seqIn:seqIn,dtIn:dtIn,cdPartner:cdPartner,qtyIn:qtyIn,prcItem:prcItem});
}
//자재관리 자재입고 입고품목삭제
export function deleteItemInDtl(noIn,seqIn){
	return axios.post(url+'/item/itemController/deleteItemInDtl.do',{token2:config.user.token2,idUser:config.user.id,noIn:noIn,seqIn:seqIn});
}
//자재관리 자재입고 입고품목추가 발주요청정보목록조회
export function retrieveItemOrdNmOrdList(dtOrdFr,dtOrdTo){
	return axios.post(url+'/item/itemController/retrieveItemOrdNmOrdList.do',{token2:config.user.token2,idUser:config.user.id,dtOrdFr:dtOrdFr,dtOrdTo:dtOrdTo});
}
//자재관리 자재입고 입고품목추가 발주요청조회
export function retrieveItemOrdDtlList(dtOrdFr,dtOrdTo,noOrd){
	return axios.post(url+'/item/itemController/retrieveItemOrdDtlList.do',{token2:config.user.token2,idUser:config.user.id,dtOrdFr:dtOrdFr,dtOrdTo:dtOrdTo,noOrd:noOrd});
}
//자재관리 자재출고
export function retrieveItemOutList(dtOutFr,dtOutTo,noOut,idConst,nmConst,skip,top){
	return axios.post(url+'/item/itemController/retrieveItemOutList.do',{token2:config.user.token2,idUser:config.user.id,dtOutFr:dtOutFr,dtOutTo:dtOutTo,noOut:noOut,idConst:idConst,nmConst:nmConst,$skip: skip, $top: top});
}
//자재관리 자재출고 삭제
export function deleteItemOut(noOut){
	return axios.post(url+'/item/itemController/deleteItemOut.do',{token2:config.user.token2,idUser:config.user.id,noOut:noOut});
}
//자재관리 자재출고 추가
export function createItemOut(noOut,gbOut,dtOut){
	return axios.post(url+'/item/itemController/createItemOut.do',{token2:config.user.token2,idUser:config.user.id,noOut:noOut,gbOut:gbOut,dtOut:dtOut});
}
//자재관리 자재출고 출고상세
export function retrieveItemOutDetailInfo(noOut){
	return axios.post(url+'/item/itemController/retrieveItemOutDetailInfo.do',{token2:config.user.token2,idUser:config.user.id,noOut:noOut});
}
//자재관리 자재출고 출고품목 리스트
export function retrieveItemOutDtlList(noOut){
	return axios.post(url+'/item/itemController/retrieveItemOutDtlList.do',{token2:config.user.token2,idUser:config.user.id,noOut:noOut});
}
//자재관리 자재입고 입고품목삭제
export function deleteItemOutDtl(seqOut,gbOut,noOut){
	return axios.post(url+'/item/itemController/deleteItemOutDtl.do',{token2:config.user.token2,idUser:config.user.id,seqOut:seqOut,gbOut:gbOut, noOut:noOut});
}
//자재관리 자재출고 출고품목정보 저장
export function createItemOutDtlList(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	
	return axios.post(url+'/item/itemController/createItemOutDtlList.do',data);
}
//자재관리 자재출고 출고품목정보 출고요청정보목록 
export function retrieveItemOutreqNmList(dtOutreqFr,dtOutreqTo){
	return axios.post(url+'/item/itemController/retrieveItemOutreqNmList.do',{token2:config.user.token2,idUser:config.user.id,dtOutreqFr:dtOutreqFr,dtOutreqTo:dtOutreqTo});
}
//자재관리 자재출고 출고품목정보 출고요청정보목록 
export function retrieveItemOutreqDtlList(dtOutreqFr,dtOutreqTo,noOutreq,noOut){
	return axios.post(url+'/item/itemController/retrieveItemOutreqDtlList.do',{token2:config.user.token2,idUser:config.user.id,dtOutreqFr:dtOutreqFr,dtOutreqTo:dtOutreqTo,noOutreq:noOutreq,noOut:noOut});
}
//자재관리 자재반입 리스트
export function retrieveItemOutInDtlList(dtOutFr,dtOutTo,noOut){
	return axios.post(url+'/item/itemController/retrieveItemOutInDtlList.do',{token2:config.user.token2,idUser:config.user.id,dtOutFr:dtOutFr,dtOutTo:dtOutTo,noOut:noOut});
}
//자재관리 자재반입 출고정보
export function retrieveItemOutNmList(dtOutFr,dtOutTo){
	return axios.post(url+'/item/itemController/retrieveItemOutNmList.do',{token2:config.user.token2,idUser:config.user.id,dtOutFr:dtOutFr,dtOutTo:dtOutTo});
}
//자재관리 자재반입 저장
export function createItemOutInDtlList(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;

	console.log("b");
	console.log(data);
	return axios.post(url+'/item/itemController/createItemOutInDtlList.do',data);
}
//자재관리 자재반입 삭제
export function deleteItemOutInDtl(seqOut,noOut,gbOut){
	return axios.post(url+'/item/itemController/deleteItemOutInDtl.do',{token2:config.user.token2,idUser:config.user.id,seqOut :seqOut,noOut :noOut,gbOut :gbOut});
}
//자재관리 자재반입 반입대상품목
export function retrieveItemOutInList(noOut){
	return axios.post(url+'/item/itemController/retrieveItemOutInList.do',{token2:config.user.token2,idUser:config.user.id,noOut :noOut});
}



//공사관리 공통 코드
export function getStrCode(feature,type,filter){
	var data = {feature: feature,gubun: type}
	if(filter !== ''){
		data['filter'] = filter;
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/common/codeController/retrieveStrCode.do', data);
}
//민원 코드 
export function retrieveCivilCode(civilYn){
	return axios.post(url+'/building/buildingController/retrieveCivilCode.do',{token2:config.user.token2,idUser:config.user.id,civilYn:civilYn});
}
//공사관리 공사현장관리 리스트
export function retrieveConstList(idConst,nmConst,cdCom,dtDigFr,dtDigTo,nmEmpDir,gbReq,skip,top){
	return axios.post(url+'/constManage/ConstController/retrieveConstList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,cdCom:cdCom,dtDigFr:dtDigFr,dtDigTo:dtDigTo,nmEmpDir:nmEmpDir,gbReq:gbReq,$skip: skip, $top: top});
}

//공사관리 공사현장관리 주의장저장
export function createConstWarning(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/constManage/ConstController/createConstWarning.do',data);
}
//공사관리 주의장 삭제
export function deleteConstWarning(idConst,warningSeq){
	return axios.post(url+'/constManage/ConstController/deleteConstWarning.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,warningSeq:warningSeq});
}



//공사관리 공사현장관리 수신인 이메일 조회 
export function retrieveMailUserInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/constManage/ConstController/retrieveMailUserInfo.do',data);
}
//공사관리 공사현장관리 수신인 이메일 발송 
export function createConstWarningMail(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/constManage/ConstController/createConstWarningMail.do',data);
}
//공사관리 작업일보 리스트
export function retrieveConstdailyList(idConst,nmConst,cdCom,dtConstFr,dtConstTo,nmEmpDir,gbReq,skip,top){
	return axios.post(url+'/constManage/ConstController/retrieveConstdailyList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,cdCom:cdCom,dtConstFr:dtConstFr,dtConstTo:dtConstTo,nmEmpDir:nmEmpDir,gbReq:gbReq,$skip: skip, $top: top});
}

//공사관리 작업일보 상세
export function retrieveConstMatList(idConst,dtConst){
	return axios.post(url+'/constManage/ConstController/retrieveConstMatList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,dtConst:dtConst});
}

//공사관리 현장별 자재사용내역 리스트
export function retrieveConstItemList(idConst,nmConst,nmEmpDir,ymConstPlnFr,ymConstPlnTo,cdCom,skip,top){
	return axios.post(url+'/constManage/ConstController/retrieveConstItemList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,nmEmpDir:nmEmpDir,ymConstPlnFr:ymConstPlnFr,ymConstPlnTo:ymConstPlnTo,cdCom:cdCom,$skip: skip, $top: top});
}

//공사관리 현장별 자재사용내역 상세 리스트
export function retrieveConstItemMatList(idConst){
	return axios.post(url+'/constManage/ConstController/retrieveConstItemMatList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst});
}

//공사관리 출고요청 품목검색 
export function retrieveItemNmList(divItem){
	return axios.post(url+'/item/itemController/retrieveItemNmList.do',{token2:config.user.token2,idUser:config.user.id,divItem:divItem});
}

//공사관리 출고요청 규격검색 
export function retrieveItemInfoSpecList(nmItem){
	return axios.post(url+'/item/itemController/retrieveItemInfoSpecList.do',{token2:config.user.token2,idUser:config.user.id,nmItem:nmItem});
}
//공사관리 출고요청 현재고수량 
export function retrieveItemChangeInfo(nmItem,specItem){
	return axios.post(url+'/item/itemController/retrieveItemChangeInfo.do',{token2:config.user.token2,idUser:config.user.id,nmItem:nmItem,specItem:specItem});
}

//공사관리 출고요청 접수
export function createConstOutreq(noEmp,idConst,cdItem,qtyOutreq,remark){
	return axios.post(url+'/constManage/ConstController/createConstOutreq.do',{token2:config.user.token2,idUser:config.user.id,noEmp:noEmp,idConst:idConst,cdItem:cdItem,qtyOutreq:qtyOutreq,remark:remark});
}

//공사관리 구매요청 접수
export function createConstOrdreq(noEmp,idConst,cdItem,qtyOutreq,remark){
	return axios.post(url+'/constManage/ConstController/createConstOrdreq.do',{token2:config.user.token2,idUser:config.user.id,noEmp:noEmp,idConst:idConst,cdItem:cdItem,qtyOutreq:qtyOutreq,remark:remark});
}


//고객관리 현장민원접수
export function retrieveBuildingMinwonList(civilCom,cdCivilAcpt,dtAcptFr,dtAcptTo,noEmpAcpt,addr,dtHndlFr,dtHndlTo,stCivil,skip,top){
	return axios.post(url+'/building/buildingController/retrieveBuildingMinwonList.do',{token2:config.user.token2,idUser:config.user.id,civilCom:civilCom,cdCivilAcpt:cdCivilAcpt,dtAcptFr:dtAcptFr,dtAcptTo:dtAcptTo,noEmpAcpt:noEmpAcpt,addr:addr,dtHndlFr:dtHndlFr,dtHndlTo:dtHndlTo,stCivil:stCivil,$skip: skip, $top: top});
}

//고객관리 현장민원접수 상단 수용가 조회
export function retrieveBuildingMinwonCustList(noCust){
	return axios.post(url+'/building/buildingController/retrieveBuildingMinwonCustList.do',{token2:config.user.token2,idUser:config.user.id,noCust:noCust});
}

//고객관리 현장민원접수 상단 수용가 조회 건물용
export function retrieveBuildingMinwonCustList2(nmBld,nmDong,nmHo){
	return axios.post(url+'/building/buildingController/retrieveBuildingMinwonCustList.do',{token2:config.user.token2,idUser:config.user.id,nmBld:nmBld,nmDong:nmDong,nmHo:nmHo});
}

//고객관리 현장민원접수 GIS건물 목록조회
export function retrieveBuildingCustGisList(buildId){
	return axios.post(url+'/building/buildingController/retrieveBuildingCustGisList.do',{token2:config.user.token2,idUser:config.user.id,buildId:buildId});
}
//고객관리 현장민원접수 GIS건물 목록조회
export function retrieveBuildingCustGisList2(cdBld){
	return axios.post(url+'/building/buildingController/retrieveBuildingCustGisList.do',{token2:config.user.token2,idUser:config.user.id,cdBld:cdBld});
}

//고객관리 현장민원접수 상세조회
export function retrieveCivilDetailInfo(noCust, noCivil, buildId ){
	var data = {noCust:noCust,noCivil:noCivil}
	if(buildId > 0 ){
		data['buildId'] = buildId;
	}
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	
	return axios.post(url+'/building/buildingController/retrieveCivilDetailInfo.do',data);
}

//고객관리 현장민원접수 저장
export function createCivil(dtReq,tmReq,contCivilAct,cdCivilAcpt,contHndl,noEmpHndl,noInhbt,noInhbtAt,noCust,cdZone,cdDong,addr,noTel1,buildId,nmRprt,noEmpAcpt,noEmpPln,cdCivilHndl){
	return axios.post(url+'/building/buildingController/createCivil.do',{token2:config.user.token2,idUser:config.user.id,dtReq:dtReq,tmReq:tmReq,contCivilAct:contCivilAct,cdCivilAcpt:cdCivilAcpt,contHndl:contHndl,noEmpHndl:noEmpHndl,noInhbt:noInhbt,noInhbtAt:noInhbtAt,noCust:noCust,cdZone:cdZone,cdDong:cdDong,addr:addr,noTel1:noTel1,buildId:buildId,nmRprt:nmRprt,noEmpAcpt:noEmpAcpt,noEmpPln:noEmpPln,cdCivilHndl:cdCivilHndl});
}

//고객관리 현장민원접수 수정
export function modifyCivil(dtReq,tmReq,contCivilAct,contHndl,noEmpHndl,noCust,noCivil,buildId,cdCivilAcpt){
	return axios.post(url+'/building/buildingController/modifyCivil.do',{token2:config.user.token2,idUser:config.user.id,dtReq:dtReq,tmReq:tmReq,contCivilAct:contCivilAct,contHndl:contHndl,noEmpHndl:noEmpHndl,noCust:noCust,noCivil:noCivil,buildId:buildId,cdCivilAcpt:cdCivilAcpt});
}
//고객관리 현장민원접수 취소
export function modifyCivilCencle(noCivil){
	return axios.post(url+'/building/buildingController/modifyCivilCencle.do',{token2:config.user.token2,idUser:config.user.id,noCivil:noCivil})
}
//상황조치 지시전달
export function retrievePushUser(){
	return axios.post(url+'/common/pushController/retrievePushUser.do',{token2:config.user.token2,idUser:config.user.id})
}
//상황조치 지시전달 상세
export function getInstrtDtl(pushSeq,mrgIdUser){
	return axios.post(url+'/instrt/instrtController/getInstrtDtl.do',{token2:config.user.token2,idUser:config.user.id,pushSeq:pushSeq,mrgIdUser:mrgIdUser})
}
export function pushSend(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/common/pushController/pushSend.do',data)
}
//상황조치 전송상태 코드
export function retrieveResponseCode(){
	return axios.post(url+'/common/pushController/retrieveResponseCode.do ', {token2:config.user.token2,idUser:config.user.id})
}
//상황조치 지시이력 조회
export function retrievePushSendInfo(pushSeq,responseCode,mrgIdUser,fromCrtDt,toCrtDt,skip,top){
	return axios.post(url+'/common/pushController/retrievePushSendInfo.do ', {token2:config.user.token2,idUser:config.user.id,pushSeq:pushSeq,responseCode:responseCode,mrgIdUser:mrgIdUser,fromCrtDt:fromCrtDt,toCrtDt:toCrtDt,$skip:skip,$top:top})
}
//상황조치 지시처리관리
export function retrieveInstrt(fromIntDt,toIntDt,fromActDt,toActDt,intActState,skip,top){
	return axios.post(url+'/instrt/instrtController/retrieveInstrt.do', {token2:config.user.token2,idUser:config.user.id,fromIntDt:fromIntDt,toIntDt:toIntDt,fromActDt:fromActDt,toActDt:toActDt,intActState:intActState,$skip:skip,$top:top})
}
//상황조치 조치처리
export function instrtActUpdt(){
	return axios.post(url+'/instrt/instrtController/instrtActUpdt.do', {token2:config.user.token2,idUser:config.user.id} )
}

//공급관리 굴착공사 굴착현장 정보 저장
export function updateDigworkLocationInfo(jupno,idConst, ynPatrol, cdPress, rsltPatrol, gbConst, ynNoNotice, stEocs){
	return axios.post(url+'/supplyManage/digworkController/updateDigworkLocationInfo.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst, ynPatrol:ynPatrol, cdPress:cdPress, rsltPatrol:rsltPatrol, gbConst:gbConst, ynNoNotice:ynNoNotice, jupno:jupno, stEocs:stEocs} )
}

//공급관리 굴착공사 입회정보 저장
export function saveDigworkPatrol(seqPatrol,jupno,dtPatrol,tmPatrol,contPatrol,remark,empPatrol){
	return axios.post(url+'/supplyManage/digworkController/saveDigworkPatrol.do', {token2:config.user.token2,idUser:config.user.id,seqPatrol:seqPatrol,jupno:jupno,dtPatrol:dtPatrol,tmPatrol:tmPatrol,contPatrol:contPatrol,remark:remark,empPatrol:empPatrol} )
}
//공급관리 굴착공사 입회정보 삭제
export function deleteDigworkPatrol(seqPatrol,jupno){
	return axios.post(url+'/supplyManage/digworkController/deleteDigworkPatrol.do', {token2:config.user.token2,idUser:config.user.id,seqPatrol:seqPatrol,jupno:jupno} )
}

//협의 교육정보 저장
export function saveDigworkAgrmtDocInfo(jupno,seqAgrmt,agrmtDt,agrmtStdt,agrmtEndt,note,agrmtNm) {
    return axios.post(url+'/supplyManage/digworkController/saveDigworkAgrmtDocInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,agrmtDt:agrmtDt,agrmtStdt:agrmtStdt,agrmtEndt:agrmtEndt,note:note,agrmtNm:agrmtNm});
}
export function deleteDigworkAgrmtDocInfo(jupno,seqAgrmt) {
    return axios.post(url+'/supplyManage/digworkController/deleteDigworkAgrmtDocInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt});
}
export function retrieveDigworkPipeList(jupno,seqAgrmt) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkPipeList.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt});
}
export function saveDigworkPipe(jupno,seqAgrmt,seqPipe,facGubun,pressure,material,dia,len,note) {
	console.log({token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqPipe:seqPipe,facGubun:facGubun,pressure:pressure,material:material,dia:dia,len:len,note:note})
    return axios.post(url+'/supplyManage/digworkController/saveDigworkPipe.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqPipe:seqPipe,facGubun:facGubun,pressure:pressure,material:material,dia:dia,len:len,note:note});
}
export function deleteDigworkPipe(jupno,seqAgrmt,seqPipe) {
    return axios.post(url+'/supplyManage/digworkController/deleteDigworkPipe.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqPipe:seqPipe});
}
//2,3,5번 내용
export function retrieveDigworkAgrmtDocInfo(jupno,seqAgrmt) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkAgrmtDocInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt});
}
//4. 가스공급시설의 안전조치방법(목록)
export function retrieveDigworkSafetyActList(jupno,seqAgrmt) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkSafetyActList.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt});
}
export function saveDigworkSafetyAct(jupno,seqAgrmt,seqSafetyAct,reloc,tmpPipe,rest,stop,kndChng,etcAct,worker) {
    return axios.post(url+'/supplyManage/digworkController/saveDigworkSafetyAct.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqSafetyAct:seqSafetyAct,reloc:reloc,tmpPipe:tmpPipe,rest:rest,stop:stop,kndChng:kndChng,etcAct:etcAct,worker:worker});
}
export function deleteDigworkSafetyAct(jupno,seqAgrmt,seqSafetyAct) {
    return axios.post(url+'/supplyManage/digworkController/deleteDigworkSafetyAct.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqSafetyAct:seqSafetyAct});
}
//현장교육
export function updateDigworkAgrmtDocEduInfo(jupno,seqAgrmt,eduDt,eduTm,eduTcUserId,cfUserPst,cfUserId,eduWorkerComp,eduWorkerPst,eduWorker) {
    return axios.post(url+'/supplyManage/digworkController/updateDigworkAgrmtDocEduInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,eduDt:eduDt,eduTm:eduTm,eduTcUserId:eduTcUserId,cfUserPst:cfUserPst,cfUserId:cfUserId,eduWorkerComp:eduWorkerComp,eduWorkerPst:eduWorkerPst,eduWorker:eduWorker});
}
//교육 수강자 리스트
export function retrieveDigworkEduAttenderList(jupno,seqAgrmt) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkEduAttenderList.do',  {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt});
}
export function deleteDigworkEduAttender(jupno,seqAgrmt,seqAttender ) {
    return axios.post(url+'/supplyManage/digworkController/deleteDigworkEduAttender.do', {jtoken2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqAttender:seqAttender });
}
export function saveDigworkEduAttender(jupno,seqAgrmt,seqAttender,attenderPst,attender,note) {
    return axios.post(url+'/supplyManage/digworkController/saveDigworkEduAttender.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,seqAttender:seqAttender,attenderPst:attenderPst,attender:attender,note:note});
}

//모두 저장 
export function updateDigworkAgrmtDocSubInf(jupno,seqAgrmt,chngAct,agrmtCn,etcCn,workerComp,worker,agrmtUserId) {
    return axios.post(url+'/supplyManage/digworkController/updateDigworkAgrmtDocSubInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno:jupno,seqAgrmt:seqAgrmt,chngAct:chngAct,agrmtCn:agrmtCn,etcCn:etcCn,workerComp:workerComp,worker:worker,agrmtUserId:config.user.id});
}







//팝업 사용자 정보 조회
export function retrieveUserInfoList(noEmp,nmKor,nmDept,nmDutyRank,skip,top){
	return axios.post(url+'/user/userController/retrieveUserInfoList.do',{token2:config.user.token2,idUser:config.user.id,noEmp:noEmp,nmKor:nmKor,nmDept:nmDept,nmDutyRank:nmDutyRank,$skip: skip, $top: top});
}
//팝업 부서 목록
export function retrieveDeptList(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/user/userController/retrieveDeptList.do',data);
}

//팝업 직급 목록
export function retrieveRankList(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/user/userController/retrieveRankList.do',data);
}
//팝업 시공업체 목록
export function retrieveConstComList(){
	return axios.post(url+'/constManage/ConstController/retrieveConstComList.do',{token2:config.user.token2,idUser:config.user.id});
}
//팝업 공사정보 조회
export function retrieveConstInfoList(idConst ,nmConst ,cdComNm,dtDigFr,dtDigTo,skip,top){
	return axios.post(url+'/constManage/ConstController/retrieveConstInfoList.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst,nmConst:nmConst,cdComNm:cdComNm,dtDigFr:dtDigFr,dtDigTo:dtDigTo,$skip: skip, $top: top});
}

//팝업 수용가번호 조회
export function retrieveCustList(cdCompany,cdDong,lotFrom,lotTo,cdZone,roadAddr,addrL,addrS,nmCust,nmBld,dongHs,hoHs,syseqno,skip,top){
	return axios.post(url+'/customer/custController/retrieveCustList.do',{token2:config.user.token2,idUser:config.user.id,cdCompany:cdCompany,cdDong:cdDong,lotFrom:lotFrom,lotTo:lotTo,cdZone:cdZone,roadAddr:roadAddr,addrL:addrL,addrS:addrS,nmCust:nmCust,nmBld:nmBld,dongHs:dongHs,hoHs:hoHs,syseqno:syseqno,$skip: skip, $top: top});
}
//팝업 건물코드 조회
export function retrieveBuildingCodeList(cdCompany,cdDong,lotFrom,lotto,nmBld,roadAddr,addrL,addrS,skip,top){
	return axios.post(url+'/building/buildingController/retrieveBuildingCodeList.do',{token2:config.user.token2,idUser:config.user.id,cdCompany:cdCompany,cdDong:cdDong, lotFrom:lotFrom, lotto:lotto, nmBld:nmBld, roadAddr:roadAddr, addrL:addrL, addrS:addrS, $skip: skip, $top: top});
}
//팝업 정압기 변경이력
export function retrieveGovChgList(cdFclt,cdCompany){
	return axios.post(url+'/supply/govController/retrieveGovChgList.do',{token2:config.user.token2,idUser:config.user.id,cdFclt:cdFclt,cdCompany:cdCompany});
}
//팝업 거래처
export function retrievePartnerInfoList(fgPartner,cdCon,lnPartner,skip,top){
	return axios.post(url+'/user/userController/retrievePartnerInfoList.do',{token2:config.user.token2,idUser:config.user.id,fgPartner:fgPartner,cdCon:cdCon,lnPartner:lnPartner, $skip: skip, $top: top});
}

//팝업 건물조회 기본정보 ppt191
export function retrieveBuildingDetailInfo(id){
	return axios.post(url+'/building/buildingController/retrieveBuildingDetailInfo.do',{token2:config.user.token2,idUser:config.user.id,id:id});
}
//팝업 건물조회 수용가정보 조회 ppt191
export function retrieveBuildingCustList(id){
	return axios.post(url+'/building/buildingController/retrieveBuildingCustList.do',{token2:config.user.token2,idUser:config.user.id,id:id});
}
//팝업 건물조회 상단 공급계약 ppt192
export function retrieveBuildingContractList(id){
	return axios.post(url+'/building/contractController/retrieveBuildingContractList.do',{token2:config.user.token2,idUser:config.user.id,id:id});
}
//팝업 건물조회 계약일반정보 ppt192
export function retrieveContractDetail(idCntr){
	return axios.post(url+'/sales/contractController/retrieveContractDetail.do',{token2:config.user.token2,idUser:config.user.id,idCntr:idCntr});
}
//팝업 건물조회 계약정보  ppt192
//줄150에 있음




//고객센터 계량기 저장
export function saveGMInspInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/customer/gmController/saveGMInspInfo.do',data);
}

//공급전검사 결과등록 공급정압기
export function retrieveGovListWithPreInsp(){
	return axios.post(url+'/usePreInsp/preInspController/retrieveGovListWithPreInsp.do',{token2:config.user.token2,idUser:config.user.id});
}

//안전점검 공급전검사 상세 정보 저장
export function updateUseFacilInfoWithPreInsp(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/usePreInsp/preInspController/updateUseFacilInfoWithPreInsp.do',data);
}
//안전점검 공급전검사 바코드 저장
export function savePreInspGmInfo(noCust,nmGm,nmUse,grdGm,cdMoel,cdMakerVc,gbGm,tyGm,yhGm,yyMade,plcGm,cdModel,noMachinGm){
	return axios.post(url+'/usePreInsp/preInspController/savePreInspGmInfo2.do',{token2:config.user.token2,idUser:config.user.id,noCust: noCust,nmGm: nmGm,nmUse: nmUse,grdGm: grdGm,cdMoel: cdMoel,cdMakerVc: cdMakerVc,gbGm: gbGm,tyGm: tyGm,yhGm: yhGm,yyMade: yyMade,plcGm: plcGm,cdModel: cdModel,noMachinGm: noMachinGm});
}

//수용가 정보 기본 조회
export function retrievePreInspDetail2(idPreinsp) {
    return axios.post(url+'/usePreInsp/preInspController/retrievePreInspDetail.do', {token2:config.user.token2,idUser:config.user.id,idPreinsp: idPreinsp})
}
//수용가 정보 조회
export function retrievePreInspCustList(cdBld) {
    return axios.post(url+'/usePreInsp/preInspController/retrievePreInspCustList.do', {token2:config.user.token2,idUser:config.user.id,cdBld: cdBld})
}
//수용가 정보 저장
export function savePreInspCustInfo(custList) {
    return axios.post(url+'/usePreInsp/preInspController/savePreInspCustInfo.do', {token2:config.user.token2,idUser:config.user.id,custList: custList})
}
//수용가 정보 계량기 바코드
export function retrievePreInspGmDetail(noCust,nmCust,grdGmNm,ynExist,nmUse) {
    return axios.post(url+'/usePreInsp/preInspController/retrievePreInspGmDetail.do', {token2:config.user.token2,idUser:config.user.id,noCust:noCust,nmCust:nmCust,grdGmNm:grdGmNm,ynExist:ynExist,nmUse:nmUse})
}
//안전점검 공급전검사 결과 등록 검사결과 저장
export function savePreInspRsltInfo(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/usePreInsp/preInspController/savePreInspRsltInfo.do',data);
}

//공급관리 공급시설 인수검사 
export function retrieveAcceptanceInfoForTakeinsp(idConst){
	return axios.post(url+'/supplyManage/acceptanceController/retrieveAcceptanceInfoForTakeinsp.do',{token2:config.user.token2,idUser:config.user.id,idConst:idConst});
}
//공급관리 공급시설 인수검사 감시장버 저장
export function saveAcceptanceInfoForTakeinsp(data){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	return axios.post(url+'/supplyManage/acceptanceController/saveAcceptanceInfoForTakeinsp.do',data);
}


//도우테크 작업
//2020-12-28

//계량기 정보목록 조회
export function retrieveGMList(noCust, cdBld, noMachinGm, gmCheck, skip, top){
    return axios.post(url+'/customer/gmController/retrieveGMList.do', {token2:config.user.token2,idUser:config.user.id,noCust: noCust, cdBld: cdBld, noMachinGm: noMachinGm, gmCheck: gmCheck, $skip: skip, $top: top});
}

//계량기 상세정보
export function retrieveGMDetail(noCust){
    return axios.post(url+'/customer/gmController/retrieveGMDetail.do', {token2:config.user.token2,idUser:config.user.id,noCust: noCust});
}

//보정기 상세정보
export function retrieveVCDetail(noCust){
    return axios.post(url+'/customer/gmController/retrieveVCDetail.do', {token2:config.user.token2,idUser:config.user.id,noCust: noCust});
}

//중/대용량 계량기 점검목록 조회
export function retrieveGMInspList(dtInspPlnFr, dtInspPlnTo, nmFclt, txAddr, cdFclt, skip, top){
    return axios.post(url+'/customer/gmController/retrieveGMInspList.do', {token2:config.user.token2,idUser:config.user.id,dtInspPlnFr: dtInspPlnFr, dtInspPlnTo: dtInspPlnTo, nmFclt: nmFclt, txAddr: txAddr, cdFclt: cdFclt, idInspType: 1090, $skip: skip, $top: top});
}

//중/대용량 계량기 검사등록
export function retrieveGMInspInfo(idInsp, idInspType){
    return axios.post(url+'/customer/gmController/retrieveGMInspInfo.do', {token2:config.user.token2,idUser:config.user.id,idInsp: idInsp, idInspType: idInspType})
}

//공급전검사 결과등록 조회
export function retrievePreInspList(dtInspFr, dtInspTo, gbFclt, stPreInsp, addrSply, skip, top){
	return axios.post(url+'/usePreInsp/preInspController/retrievePreInspList.do', {token2:config.user.token2,idUser:config.user.id,dtInspFr: dtInspFr, dtInspTo: dtInspTo, gbFclt: gbFclt, stPreinsp: stPreInsp, addrSply: addrSply, $skip: skip, $top: top});
}

//공급전검사 상세 시설정보 조회
export function retrievePreInspDetail(endUrl, cdFcltBld) {
    return axios.post(url+'/usePreInsp/preInspController/'+endUrl+'.do', {token2:config.user.token2,idUser:config.user.id,cdFcltBld: cdFcltBld})
}

//공급전검사 결과등록 항목 조회
export function retrievePreInspRsltInfo(idPreinsp, idCntr) {
    return axios.post(url+'/usePreInsp/preInspController/retrievePreInspRsltInfo.do', {token2:config.user.token2,idUser:config.user.id,idPreinsp: idPreinsp, idCntr: idCntr})
}

//공급관리 인수검사목록 조회
export function retrieveAcceptanceList(cdCom, idConst, nmConst, noEmpGive, dtTakeFrSt, dtTakeFrEd, noEmpTakeinsp, dtTakeToSt, dtTakeToEd, cdRsltTakeinsp, ynTakeTo, skip, top){
    return axios.post(url+'/supplyManage/acceptanceController/retrieveAcceptanceList.do', {token2:config.user.token2,idUser:config.user.id,cdCom: cdCom, idConst: idConst, nmConst: nmConst, noEmpGive: noEmpGive, dtTakeFrSt: dtTakeFrSt, dtTakeFrEd: dtTakeFrEd, noEmpTakeinsp: noEmpTakeinsp, dtTakeToSt: dtTakeToSt, dtTakeToEd: dtTakeToEd, cdRsltTakeinsp: cdRsltTakeinsp, ynTakeTo: ynTakeTo,$skip: skip, $top: top})
}

//공급관리 인수검사 관경별 연장목록 조회
export function retrievePipeLenForDiaListWithAcceptanceInfo(idConst) {
	return axios.post(url+'/supplyManage/acceptanceController/retrievePipeLenForDiaListWithAcceptanceInfo.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst})
}

//공급관리 인수검사 시설물, 라인마크 카운트 조회
export function retrieveFacilCntWithAcceptanceInfo(idConst) {
	return axios.post(url+'/supplyManage/acceptanceController/retrieveFacilCntWithAcceptanceInfo.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst})
}

//공급관리 인수검사 1번 목록 조회
export function retrieveAcceptanceVbList(idConst){
	return axios.post(url+'/supply/valveController/retrieveAcceptanceVbList.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst});
}

//공급관리 인수검사 1번 상세 조회
export function retrieveAcceptanceVbDetail(id){
	return axios.post(url+'/supply/valveController/retrieveAcceptanceVbDetail.do', {token2:config.user.token2,idUser:config.user.id,id: id});
}

//공급관리 인수검사 2번 목록 조회
export function retrieveAcceptanceTbList(idConst){
	return axios.post(url+'/protect/tbController/retrieveAcceptanceTbList.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst});
}

//공급관리 인수검사 2번 상세 조회
export function retrieveAcceptanceTbDetail(id){
	return axios.post(url+'/protect/tbController/retrieveAcceptanceTbDetail.do', {token2:config.user.token2,idUser:config.user.id,id: id});
}

//공급관리 인수검사 3번 목록 조회
export function retrieveAcceptanceSpecialList(idConst){
	return axios.post(url+'/supply/specialController/retrieveAcceptanceSpecialList.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst});
}

//공급관리 인수검사 3번 상세 조회
export function retrieveAcceptanceSpecialDetail(id){
	return axios.post(url+'/supply/specialController/retrieveAcceptanceSpecialDetail.do', {token2:config.user.token2,idUser:config.user.id,id: id});
}

//공급관리 인수검사 4번 목록 조회
export function retrieveAcceptanceJointList(idConst){
	return axios.post(url+'/protect/jointController/retrieveAcceptanceJointList.do', {token2:config.user.token2,idUser:config.user.id,idConst: idConst});
}

//공급관리 인수검사 4번 상세 조회
export function retrieveAcceptanceJointDetail(id){
	return axios.post(url+'/protect/jointController/retrieveAcceptanceJointDetail.do', {token2:config.user.token2,idUser:config.user.id,id: id});
}

//공급관리 인수검사 상세 밸브,전기,등 저장
export function modifyAcce(data,type){
	data['token2'] = config.user.token2;
	data['idUser'] = config.user.id;
	if(type === 0 ){
		return axios.post(url+'/supply/valveController/modifyValve.do', data);
	}else if(type === 1){
		return axios.post(url+'/protect/tbController/modifyTb.do', data);
	}else if(type === 2){
		return axios.post(url+'/supply/specialController/modifySpecial.do', data);
	}else if(type === 3){
		return axios.post(url+'/protect/jointController/modifyJoint.do', data);
	}
}




//공급관리 굴착공사목록 조회
export function retrieveDigworkList(bjdNm, jupno, locnm, state, fstdtFr, fstdtTo, stEocs, stadt, stodt, locgu,skip, top) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkList.do', {token2:config.user.token2,idUser:config.user.id,bjdNm: bjdNm, jupno: jupno, locnm: locnm, state: state, fstdtFr: fstdtFr, fstdtTo: fstdtTo, stEocs: stEocs, stadt: stadt, stodt: stodt, locgu: locgu, $skip: skip, $top: top});
}

//공급관리 굴착공사 현황조회
export function retrieveDigworkDetail(jupno) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkDetail.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno});
}

//공급관리 굴착공사 입회정보 목록 조회
export function retrieveDigworkPatrolList(jupno) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkPatrolList.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno});
}

//공급관리 굴착공사 순회일지 상세 조회
export function retrieveDigworkCheckInfo(jupno, seqPatrol,gbDig) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkCheckInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno, seqPatrol: seqPatrol, gbDig:gbDig});
}
//공급관리 굴착공사 순회일지 저장
export function saveDigworkCheckInfo(jupno, seqPatrol,gubun, gbDig, locState, locStateEtc, woker,checkList,repairList ) {
    return axios.post(url+'/supplyManage/digworkController/saveDigworkCheckInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno, seqPatrol: seqPatrol, gubun:gubun, gbDig:gbDig, locState:locState, locStateEtc:locStateEtc,woker:woker, checkList:checkList, repairList:repairList});
}
export function saveDigworkCheckInfo2(jupno, seqPatrol,gubun, gbDig, woker,checkList, dia, pressure, len ) {
    return axios.post(url+'/supplyManage/digworkController/saveDigworkCheckInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno, seqPatrol: seqPatrol, gubun:gubun, gbDig:gbDig, woker:woker, checkList:checkList,dia:dia, pressure:pressure, len:len});
}
//공급관리 굴착공사 순회일지 삭제
export function deleteDigworkCheckInfo(jupno, seqPatrol) {
    return axios.post(url+'/supplyManage/digworkController/deleteDigworkCheckInfo.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno, seqPatrol: seqPatrol});
}

//공급관리 굴착공사 협의 및 교육 목록 조회
export function retrieveDigworkAgrmtDocList(jupno) {
    return axios.post(url+'/supplyManage/digworkController/retrieveDigworkAgrmtDocList.do', {token2:config.user.token2,idUser:config.user.id,jupno: jupno});
}

//작업관리 위험작업 검색
export function retrieveDeptListForDangerWork(idConst, nmConst) {
    return axios.post(url+'/work/dangerWorkController/retrieveDeptListForDangerWork.do', {token2:config.user.token2,idUser:config.user.id});
}

//지도 점검
//phnNum,sectorNm,driver1,patrol,logSts,dblX,dblY,receiveDate,
export function saveGpsLogInfo(gpsLogList) {
    return axios.post(url+'/common/gpsLogController/saveGpsLogInfo.do', {token2:config.user.token2,idUser:config.user.id,gpsLogList:gpsLogList});
}


//파일다운로드
export function downloadSign(gbFile,noFile,cdKey1,cdKey2,cdKey3,cdKey4) {
    return axios.post(url+'/sign/downloadSign.do', {token2:config.user.token2,idUser:config.user.id,gbFile:gbFile,noFile:noFile,cdKey1:cdKey1,cdKey2:cdKey2,cdKey3:cdKey3,cdKey4:cdKey4});
}
