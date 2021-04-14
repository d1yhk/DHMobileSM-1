import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Login, App  } from './containers'
 
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
 
import './App.css';
/*시설검색 공급시설*/
import retrievePipe from "./html/supply/retrievePipe";
import retrievePipeDetail from "./html/supply/retrievePipeDetail";
import retrieveValve from "./html/supply/retrieveValve";
import retrieveValveDetail from "./html/supply/retrieveValveDetail";
import retrieveGov from "./html/supply/retrieveGov";
import retrieveGovDetail from "./html/supply/retrieveGovDetail";
import retrieveSpecial from "./html/supply/retrieveSpecial";
import retrieveSpecialDetail from "./html/supply/retrieveSpecialDetail";

/*시설검색 사용시설*/
import retrieveCommunal from "./html/use/retrieveCommunal";
import retrieveSpecific from "./html/use/retrieveSpecific";
import retrieveGeneral from "./html/use/retrieveGeneral";
import retrieveGovernor from "./html/use/retrieveGovernor";
import retrieveRegulator from "./html/use/retrieveRegulator";
import retrieveCommunalDetail from "./html/use/retrieveCommunalDetail";
import retrieveSpecificDetail from "./html/use/retrieveSpecificDetail";
import retrieveGeneralDetail from "./html/use/retrieveGeneralDetail";
import retrieveGovernorDetail from "./html/use/retrieveGovernorDetail";
import retrieveRegulatorDetail from "./html/use/retrieveRegulatorDetail";

/*시설물 방식시설*/
import retrieveTb from "./html/protect/retrieveTb";
import retrieveRectifier from "./html/protect/retrieveRectifier";
import retrieveJoin from "./html/protect/retrieveJoin";
import retrieveTbDetail from "./html/protect/retrieveTbDetail";
import retrieveRectifierDetail from "./html/protect/retrieveRectifierDetail";
import retrieveJoinDetail from "./html/protect/retrieveJoinDetail";

/*시설물 관리시설*/
import retrieveCoatdamage from "./html/manage/retrieveCoatdamage";
import retrieveSoilresist from "./html/manage/retrieveSoilresist";
import retrievePunch from "./html/manage/retrievePunch";
import retrieveCoatdamageDetail from "./html/manage/retrieveCoatdamageDetail";
import retrieveSoilresistDetail from "./html/manage/retrieveSoilresistDetail";
import retrievePunchDetail from "./html/manage/retrievePunchDetail";

/*시설물 기타시설*/
import retrieveMemo from "./html/etc/retrieveMemo";
import retrievePlanpipe from "./html/etc/retrievePlanpipe";
import retrieveEdit from "./html/etc/retrieveEdit";
import retrieveRebuild from "./html/etc/retrieveRebuild";
import retrieveMemoDetail from "./html/etc/retrieveMemoDetail";
import retrievePlanpipeDetail from "./html/etc/retrievePlanpipeDetail";
import retrieveEditDetail from "./html/etc/retrieveEditDetail";
import retrieveRebuildDetail from "./html/etc/retrieveRebuildDetail";

/*안전점검 공급시설*/
import retrieveInspPln from "./html/supplyInsp/retrieveInspPln";
import retrieveInspPlnDetail from "./html/supplyInsp/retrieveInspPlnDetail";
import retrieveInspRslt from "./html/supplyInsp/retrieveInspRslt";

/*안전점검 정압시설*/
import retrieveWeeklyInsp from "./html/govInsp/retrieveWeeklyInsp";
import retrieveWeeklyInspDetail from "./html/govInsp/retrieveWeeklyInspDetail";
import retrieveQuarterInsp from "./html/govInsp/retrieveQuarterInsp";
import retrieveQuarterInspDetail from "./html/govInsp/retrieveQuarterInspDetail";
import retrieveQuarterInspDetail2 from "./html/govInsp/retrieveQuarterInspDetail2";
import retrieveQuarterInspDetail3 from "./html/govInsp/retrieveQuarterInspDetail3";
import retrieveAutoPeriodicInsp from "./html/govInsp/retrieveAutoPeriodicInsp";
import retrieveAutoPeriodicInspDetail from "./html/govInsp/retrieveAutoPeriodicInspDetail";
import retrieveDisassemblyInsp from "./html/govInsp/retrieveDisassemblyInsp";
import retrieveDisassemblyInspInfo from "./html/govInsp/retrieveDisassemblyInspInfo";
import retrieveRegulatorInsp from "./html/govInsp/retrieveRegulatorInsp";
import retrieveRegulatorInspInfo from "./html/govInsp/retrieveRegulatorInspInfo";
import retrieveGovInspRslt from "./html/govInsp/retrieveGovInspRslt";

/*안전점검 사용시설*/
import retrieveAptInsp from "./html/uselnsp/retrieveAptInsp";
import retrieveAptInspDetail from "./html/uselnsp/retrieveAptInspDetail";
import retrieveAptInspDetailFree from "./html/uselnsp/retrieveAptInspDetailFree";
import retrieveSpecificInsp2 from "./html/uselnsp/retrieveSpecificInsp2";
import retrieveSpecificDetail2 from "./html/uselnsp/retrieveSpecificDetail2";
import retrieveRegulatorInsp2 from "./html/uselnsp/retrieveRegulatorInsp2";
import retrieveRegulatorInspInfo2 from "./html/uselnsp/retrieveRegulatorInspInfo2";
import retrieveUseInspRslt from "./html/uselnsp/retrieveUseInspRslt";
import retrieveUseInspRsltDetail from "./html/uselnsp/retrieveUseInspRsltDetail";

//공급관리 

//작업관리 
import retrieveProb from "./html/work/retrieveProb";
import retrieveProbRsltDetail from "./html/work/retrieveProbRsltDetail";

import retrieveDangerWork from "./html/work/retrieveDangerWork";
import retrieveDangerWorkDetail from "./html/work/retrieveDangerWorkDetail";
import retrieveDangerWorkEdu from "./html/work/retrieveDangerWorkEdu";
import retrieveRepair from "./html/work/retrieveRepair";
import retrieveRepairDetail from "./html/work/retrieveRepairDetail";


//영업관리 
import retrieveContract from "./html/sales/retrieveContract";
import retrieveContractDetail from "./html/sales/retrieveContractDetail";


//자재관리
import retrieveItem from "./html/item/retrieveItem";
import retrieveItemIn from "./html/item/retrieveItemIn";
import retrieveItemInDetailInfo from "./html/item/retrieveItemInDetailInfo";
import retrieveItemOrdDtlList from "./html/item/retrieveItemOrdDtlList";
import retrieveItemOut from "./html/item/retrieveItemOut";
import retrieveItemOutDetailInfo from "./html/item/retrieveItemOutDetailInfo";
import retrieveItemOutInList from "./html/item/retrieveItemOutInList";
import retrieveItemOutInDtl from "./html/item/retrieveItemOutInDtl";
import retrieveItemOutreqDtlList from "./html/item/retrieveItemOutreqDtlList";

//공사관리
import retrieveConst from "./html/constManage/retrieveConst";
import retrieveConstdaily from "./html/constManage/retrieveConstdaily";
import retrieveConstItem from "./html/constManage/retrieveConstItem";
import retrieveConstItemMatList from "./html/constManage/retrieveConstItemMatList";
import retrieveConstMatList from "./html/constManage/retrieveConstMatList";
import retrieveConstWarningInfo from "./html/constManage/retrieveConstWarningInfo";

//상황조치
import retrievePushUser from "./html/instrt/retrievePushUser";
import retrievePushSendInfo from "./html/instrt/retrievePushSendInfo";
import retrieveInstrt from "./html/instrt/retrieveInstrt";
import getInstrtDtl from "./html/instrt/getInstrtDtl";
import getInstrtDtlWrite from "./html/instrt/getInstrtDtlWrite";

//고객관리
import retrieveBuildingMinwon from "./html/building/retrieveBuildingMinwon";
import retrieveBuildingMinwonDetail from "./html/building/retrieveBuildingMinwonDetail";
//첨부파일
import Attach from "./html/Attach";
import AttachAdd from "./html/AttachAdd";
import Map from "./html/Map";
import PopupBuildingSearch from "./components/PopupBuildingSearch";



//도우테크
//2020-12-30 추가
/*고객관리 계량기*/
import retrieveGM from "./html/customer/retrieveGM";
import retrieveGMDetail from "./html/customer/retrieveGMDetail";
import retrieveVCDetail from "./html/customer/retrieveVCDetail";
import retrieveGMInsp from "./html/customer/retrieveGMInsp";
import retrieveGMInspInfo from "./html/customer/retrieveGMInspInfo";

import retrievePreInsp from "./html/usePreInsp/retrievePreInsp";
import retrievePreInspDetail from "./html/usePreInsp/retrievePreInspDetail";
import retrievePreInspRsltInfo from "./html/usePreInsp/retrievePreInspRsltInfo";
import retrievePreInspDetail2 from "./html/usePreInsp/retrievePreInspDetail2";
import retrievePreInspGmDetail from "./html/usePreInsp/retrievePreInspGmDetail";


/*인수검사*/
import retrieveAcceptance from "./html/supplyManage/retrieveAcceptance";
import retrieveAcceptanceVb from "./html/supplyManage/retrieveAcceptanceVb";
import retrieveAcceptanceInfoForTakeinsp from "./html/supplyManage/retrieveAcceptanceInfoForTakeinsp";

/*굴착공사*/ 
import retrieveDigwork from "./html/supplyManage/retrieveDigwork";
import retrieveDigworkDetail from "./html/supplyManage/retrieveDigworkDetail";
import retrieveDigworkPatrol from "./html/supplyManage/retrieveDigworkPatrol";
import retrieveDigworkAgrmtDoc from "./html/supplyManage/retrieveDigworkAgrmtDoc";



const store = createStore(reducers, applyMiddleware(thunk));
//const title = 'GRP-iFM';
 
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
				<Route path="/" component={App}/>
				<Route path="/login" component={Login}/>
				<Switch>
					<Route path="/Map" component={Map} /> 
					{/*공급시설*/}
					<Route path="/retrievePipe/:idx/:type" component={retrievePipe} /> 
					<Route path="/retrievePipe/:idx" component={retrievePipe} /> 
					<Route path="/retrievePipe" component={retrievePipe} /> 

					<Route path="/retrievePipeDetail/:idx/:type" component={retrievePipeDetail} /> 
					<Route path="/retrievePipeDetail/:idx" component={retrievePipeDetail} /> 
					<Route path="/retrieveValve" component={retrieveValve} /> 
					<Route path="/retrieveValveDetail/:idx" component={retrieveValveDetail} /> 
					<Route path="/retrieveGov" component={retrieveGov} /> 
					<Route path="/retrieveGovDetail/:idx" component={retrieveGovDetail} /> 
					<Route path="/retrieveSpecial" component={retrieveSpecial} /> 
					<Route path="/retrieveSpecialDetail/:idx" component={retrieveSpecialDetail} /> 
					{/*사용시설*/}
					<Route path="/retrieveCommunal" component={retrieveCommunal} /> 
					<Route path="/retrieveCommunalDetail/:idx" component={retrieveCommunalDetail} /> 
					<Route path="/retrieveSpecific" component={retrieveSpecific} /> 
					<Route path="/retrieveSpecificDetail/:idx" component={retrieveSpecificDetail} /> 
					<Route path="/retrieveGeneral" component={retrieveGeneral} /> 
					<Route path="/retrieveGeneralDetail/:idx" component={retrieveGeneralDetail} /> 
					<Route path="/retrieveGovernor" component={retrieveGovernor} /> 
					<Route path="/retrieveGovernorDetail/:idx/:title" component={retrieveGovernorDetail} /> 
					<Route path="/retrieveGovernorDetail/:idx" component={retrieveGovernorDetail} /> 
					<Route path="/retrieveRegulator" component={retrieveRegulator} /> 
					<Route path="/retrieveRegulatorDetail/:idx" component={retrieveRegulatorDetail} /> 
					{/*시설물 방식시설*/}
					<Route path="/retrieveTb" component={retrieveTb} /> 
					<Route path="/retrieveTbDetail/:idx" component={retrieveTbDetail} /> 
					<Route path="/retrieveRectifier" component={retrieveRectifier} /> 
					<Route path="/retrieveRectifierDetail/:idx" component={retrieveRectifierDetail} /> 
					<Route path="/retrieveJoin" component={retrieveJoin} /> 
					<Route path="/retrieveJoinDetail/:idx" component={retrieveJoinDetail} /> 
					{/*시설물 관리시설*/}
					<Route path="/retrieveCoatdamage" component={retrieveCoatdamage} /> 
					<Route path="/retrieveCoatdamageDetail/:idx" component={retrieveCoatdamageDetail} /> 
					<Route path="/retrieveSoilresist" component={retrieveSoilresist} /> 
					<Route path="/retrieveSoilresistDetail/:idx" component={retrieveSoilresistDetail} /> 
					<Route path="/retrievePunch" component={retrievePunch} /> 
					<Route path="/retrievePunchDetail/:idx" component={retrievePunchDetail} /> 
					{/*시설물 기타시설*/}
					<Route path="/retrieveMemo" component={retrieveMemo} /> 
					<Route path="/retrieveMemoDetail/:idx" component={retrieveMemoDetail} /> 
					<Route path="/retrievePlanpipe" component={retrievePlanpipe} /> 
					<Route path="/retrievePlanpipeDetail/:idx" component={retrievePlanpipeDetail} /> 
					<Route path="/retrieveEdit" component={retrieveEdit} /> 
					<Route path="/retrieveEditDetail/:idx" component={retrieveEditDetail} /> 
					<Route path="/retrieveRebuild" component={retrieveRebuild} /> 
					<Route path="/retrieveRebuildDetail/:idx" component={retrieveRebuildDetail} /> 
					{/*안점점검 공급시설*/}
					<Route path="/retrieveInspPln/:gubun" component={retrieveInspPln} /> 
					<Route path="/retrieveInspPln" component={retrieveInspPln} /> 
					<Route path="/retrieveInspPlnDetail/:kdFclt/:idInsp/:idInspType" component={retrieveInspPlnDetail} /> 
					<Route path="/retrieveInspPlnDetail/:idx" component={retrieveInspPlnDetail} /> 
					<Route path="/retrieveInspRslt/:type/:type1/:type2" component={retrieveInspRslt} /> 
					<Route path="/retrieveInspRslt/:type/:type1" component={retrieveInspRslt} /> 
					<Route path="/retrieveInspRslt/:type" component={retrieveInspRslt} /> 
					<Route path="/retrieveInspRslt" component={retrieveInspRslt} /> 
					{/*안점점검 정압시설*/}
					<Route path="/retrieveWeeklyInsp" component={retrieveWeeklyInsp} /> 
					<Route path="/retrieveWeeklyInspDetail/:cdFclt/:idInsp/:idInspType" component={retrieveWeeklyInspDetail} /> 
					<Route path="/retrieveQuarterInsp" component={retrieveQuarterInsp} /> 
					<Route path="/retrieveQuarterInspDetail/:cdFclt/:idInsp/:idInspType" component={retrieveQuarterInspDetail} /> 
					<Route path="/retrieveQuarterInspDetail2/:cdFclt/:idInsp/:idInspType" component={retrieveQuarterInspDetail2} /> 
					<Route path="/retrieveQuarterInspDetail3/:cdFclt/:idInsp/:idInspType" component={retrieveQuarterInspDetail3} /> 
					<Route path="/retrieveAutoPeriodicInsp" component={retrieveAutoPeriodicInsp} /> 
					<Route path="/retrieveAutoPeriodicInspDetail/:cdFclt/:idInsp/:idInspType/:inspGubunNm" component={retrieveAutoPeriodicInspDetail} /> 
					<Route path="/retrieveDisassemblyInsp" component={retrieveDisassemblyInsp} /> 
					<Route path="/retrieveDisassemblyInspInfo/:idInsp/:idInspType" component={retrieveDisassemblyInspInfo} /> 
					<Route path="/retrieveRegulatorInsp" component={retrieveRegulatorInsp} /> 
					<Route path="/retrieveRegulatorInspInfo/:idInsp/:idInspType" component={retrieveRegulatorInspInfo} /> 
					<Route path="/retrieveGovInspRslt/:facilNo" component={retrieveGovInspRslt} /> 
					<Route path="/retrieveGovInspRslt" component={retrieveGovInspRslt} /> 
					{/*안점점검 사용시설*/}
					<Route path="/retrieveAptInsp" component={retrieveAptInsp} /> 
					<Route path="/retrieveAptInspDetail/:cdFclt/:idInsp/:idInspType" component={retrieveAptInspDetail} /> 
					<Route path="/retrieveAptInspDetailFree/:cdFclt/:idInsp/:idInspType" component={retrieveAptInspDetailFree} /> 
					<Route path="/retrieveSpecificInsp2" component={retrieveSpecificInsp2} /> 
					<Route path="/retrieveSpecificDetail2/:cdFclt/:idInsp/:idInspType" component={retrieveSpecificDetail2} /> 
					<Route path="/retrieveRegulatorInsp2" component={retrieveRegulatorInsp2} /> 
					<Route path="/retrieveRegulatorInspInfo2/:idInsp/:idInspType" component={retrieveRegulatorInspInfo2} /> 
					<Route path="/retrieveUseInspRslt" component={retrieveUseInspRslt} /> 
					<Route path="/retrieveUseInspRsltDetail/:cdFclt/:idInsp/:idInspType" component={retrieveUseInspRsltDetail} /> 

					{/*도우테크 안전점검 공급전검사*/}
					<Route path="/retrievePreInsp" component={retrievePreInsp} />
					<Route path="/retrievePreInspDetail/:idx" component={retrievePreInspDetail} />
					<Route path="/retrievePreInspRsltInfo/:idPreinsp/:idCntr" component={retrievePreInspRsltInfo} />
					<Route path="/retrievePreInspDetail2/:idPreinsp/:cdBld" component={retrievePreInspDetail2} />
					<Route path="/retrievePreInspGmDetail/:noCust/:nmCust/:grdGmNm/:ynExist/:nmUse" component={retrievePreInspGmDetail} />
					

                    {/*인수공사*/}
					<Route path="/retrieveAcceptance" component={retrieveAcceptance} />
					<Route path="/retrieveAcceptanceVb/:idConst" component={retrieveAcceptanceVb} />
					<Route path="/retrieveAcceptanceInfoForTakeinsp/:idConst" component={retrieveAcceptanceInfoForTakeinsp} />

					{/*굴착공사*/}
					<Route path="/retrieveDigwork" component={retrieveDigwork} />
					<Route path="/retrieveDigworkDetail/:jupno" component={retrieveDigworkDetail} />
					<Route path="/retrieveDigworkPatrol/:jupno" component={retrieveDigworkPatrol} />
					<Route path="/retrieveDigworkAgrmtDoc/:jupno" component={retrieveDigworkAgrmtDoc} />
					{/*작업관리 */}
					<Route path="/retrieveProb" component={retrieveProb} /> 
					<Route path="/retrieveProbRsltDetail/:idConst/:yyPln" component={retrieveProbRsltDetail} /> 
					
					<Route path="/retrieveDangerWork" component={retrieveDangerWork} /> 
					<Route path="/retrieveDangerWorkDetail/:idWork" component={retrieveDangerWorkDetail} /> 
					<Route path="/retrieveDangerWorkEdu/:idWork" component={retrieveDangerWorkEdu} /> 
					<Route path="/retrieveRepair" component={retrieveRepair} /> 
					<Route path="/retrieveRepairDetail/:idInsp" component={retrieveRepairDetail} /> 

					{/*영업관리 ppt 160 */}
					<Route path="/retrieveContract" component={retrieveContract} /> 
					<Route path="/retrieveContractDetail/:idx" component={retrieveContractDetail} /> 

					{/*자재관리 ppt 162 */}
					<Route path="/retrieveItem" component={retrieveItem} /> 
					<Route path="/retrieveItemIn" component={retrieveItemIn} /> 
					<Route path="/retrieveItemInDetailInfo/:idx" component={retrieveItemInDetailInfo} /> 
					<Route path="/retrieveItemOrdDtlList" component={retrieveItemOrdDtlList} /> 
					<Route path="/retrieveItemOut" component={retrieveItemOut} /> 
					<Route path="/retrieveItemOutDetailInfo/:idx" component={retrieveItemOutDetailInfo} /> 
					<Route path="/retrieveItemOutreqDtlList/:noOut" component={retrieveItemOutreqDtlList} /> 
					<Route path="/retrieveItemOutInDtl" component={retrieveItemOutInDtl} /> 
					<Route path="/retrieveItemOutInList/:idx" component={retrieveItemOutInList} /> 

					{/*공사관리*/}
					<Route path="/retrieveConst" component={retrieveConst} /> 
					<Route path="/retrieveConstdaily/:idConst/:nmConst" component={retrieveConstdaily} /> 
					<Route path="/retrieveConstdaily" component={retrieveConstdaily} /> 
					<Route path="/retrieveConstItem" component={retrieveConstItem} /> 
					<Route path="/retrieveConstItemMatList/:idx/:type" component={retrieveConstItemMatList} /> 
					<Route path="/retrieveConstItemMatList/:idx" component={retrieveConstItemMatList} /> 
					<Route path="/retrieveConstMatList/:idx/:type" component={retrieveConstMatList} /> 
					<Route path="/retrieveConstMatList/:idx" component={retrieveConstMatList} /> 
					<Route path="/retrieveConstWarningInfo/:idx" component={retrieveConstWarningInfo} /> 

					{/*고객관리*/}
					<Route path="/retrieveGM" component={retrieveGM} />
					<Route path="/retrieveGMDetail" component={retrieveGMDetail} />
					<Route path="/retrieveGMDetail2/:idx" component={retrieveGMDetail} />
					<Route path="/retrieveVCDetail" component={retrieveVCDetail} />
					<Route path="/retrieveVCDetail2/:idx" component={retrieveVCDetail} />
					<Route path="/retrieveGMInsp" component={retrieveGMInsp} />
					<Route path="/retrieveGMInspInfo/:idInsp/:idInspType" component={retrieveGMInspInfo} />
					
					<Route path="/retrieveBuildingMinwon" component={retrieveBuildingMinwon} /> 
					<Route path="/retrieveBuildingMinwonDetail/:noCust/:noCivil/:buildId" component={retrieveBuildingMinwonDetail} /> 
					<Route path="/retrieveBuildingMinwonDetail/:buildNm" component={retrieveBuildingMinwonDetail} /> 
					<Route path="/retrieveBuildingMinwonDetail" component={retrieveBuildingMinwonDetail} /> 
					
					{/*상황조치 지시전달*/}
					<Route path="/retrievePushUser" component={retrievePushUser} /> 
					<Route path="/retrievePushSendInfo" component={retrievePushSendInfo} /> 
					<Route path="/retrieveInstrt" component={retrieveInstrt} /> 
					<Route path="/getInstrtDtl/:pushSeq/:mgrIdUser" component={getInstrtDtl} /> 
					<Route path="/getInstrtDtlWrite/:pushSeq/:mgrIdUser" component={getInstrtDtlWrite} /> 

					{/*첨부파일*/}
					<Route path="/Attach/:title" component={Attach} /> 
					<Route path="/AttachAdd/:title" component={AttachAdd} /> 

					{/*팝업 확인용 지우세요*/}
					<Route path="/PopupBuildingSearch" component={PopupBuildingSearch} /> 
				</Switch>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
 
//module.hot.accept();
