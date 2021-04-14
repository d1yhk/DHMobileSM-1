/*global jMap*/ 
import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';


import $ from "jquery";
import * as config from '../components/config';

import btnback from '../image/btn_back.png';


import footer_address from '../image/map-footer-address.png';
import footer_danger from '../image/map-footer-danger.png';
import footer_layer from '../image/map-footer-layer.png';
import footer_space from '../image/map-footer-space.png';

import * as service from '../services/posts';

//const Footer = () => ( 
class Footer extends Component {
	/*
    constructor(props) {
      super(props);
    }
	*/

	//레이어
	fetchMapLayer = async () => { 
		$(".mbap_box").css("display","none");
		$(".map_layer").css("display","block");
		
		if($(".map_layer_list ul").html()===""){
			const common = await Promise.all([ 
				service.retrieveUserLayerList()
			]);
			
			var results = common[0].data.result;
			config.map_layer.list = results;
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
	/*
	$(".btn_footer_address").click(function(){
		$(".mbap_box").css("display","none");
		$(".map_address").css("display","block");
	});
	$(".btn_footer_space").click(function(){
		$(".mbap_box").css("display","none");
		$(".map_space").css("display","block");
	});
	*/

	//공통함수
	fetchCommon = async (feature,type,id) => { 
		const common = await Promise.all([service.getCommon(feature,type)]);
		var result = common[0].data.result;
		for(var count = 0; count < result.length; count++){                
			$("#"+id).append($("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
		}
	}


	//지도 위치검색
	fetchMapAddress= async () => { 

		config.map_navi.name = "";
		config.map_navi.p1 = "";
		config.map_navi.p2 = "";
		$(".mbap_box").css("display","none");
		$(".map_address").css("display","block");
		
		if($("#map_bjdNm").html()===""){
			const common = await Promise.all([service.retreiveDong("")]);
			var result = common[0].data.result;
			for(var count = 0; count < result.length; count++){                
				$("#map_bjdNm").append($("<option value=\""+result[count].lcode+"\">"+result[count].lvalue+"</option>"));
			}
		}

	}
	fetchMapSpace = () => {
		config.map_navi.name = "";
		config.map_navi.p1 = "";
		config.map_navi.p2 = "";

		$(".mbap_box").css("display","none");
		$(".map_space").css("display","block");
		if($("#facil_space").html() === ""){
			this.fetchCommon("공간검색","검색시설","facil_space");
		}
	}
	fetchMapDanger = () => {
		$(".mbap_box").css("display","none");
		$(".map_danger").css("display","block");
		jMap.setTrace(true);
	}


	render() { 
		return (
			<div>
				<div className="footer">
					<footer>
						<div className="first_map">
							<button type="button" className="btn_back" onClick={() => config.btnBack(this.props)}><img alt="" src={btnback} width="15" height="15" />뒤로가기</button>
							<button type="button" className="btn_footer_danger" onClick={this.fetchMapDanger}><img alt="" src={footer_danger} width="15" height="15" />차단추척</button>
							<button type="button" className="btn_footer_space" onClick={this.fetchMapSpace}><img alt="" src={footer_space} width="15" height="15" />공간검색</button>
							<button type="button" className="btn_footer_address" onClick={this.fetchMapAddress}><img alt="" src={footer_address} width="15" height="15" />위치검색</button>
							<button type="button" className="btn_footer_layer" onClick={this.fetchMapLayer}><img alt="" src={footer_layer} width="15" height="15" />레이어</button>
						</div>
					</footer>
				</div>
			</div>
	)}
}
export default withRouter(Footer);


