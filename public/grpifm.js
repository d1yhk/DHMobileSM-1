			function onBarcodeImage(image){
				$(".barcode_img").find("img").attr("src",image);
			}
			function setBarcodeImg(path) {
        $("#test").attr("src",path);
      }
			function onBarcodeInfo(bnum){

				//제조사
				$(".cdMakerVc").val(bnum.substr(2,1));
				//등급
				$(".grdGm").val(bnum.substr(3,1));
				//모델,등급별 모델
				var cdModel = {"3":"020","4":"030","6":"040","10":"050","16":"060","25":"070","40":"074","65":"076","100":"080","160":"084","250":"086","400":"088","650":"110","1000":"120","1600":"130","2500":"140","4000":"160"};
				$(".cdModel").val(cdModel[bnum.substr(3,1)]);

				//타입
				$(".tyGm").val(bnum.substr(4,1));
				//유형
				var yhGm = bnum.substr(5,2);
				if(yhGm == "35" || yhGm == "45"){
					$(".yhGm").val(yhGm);
				}else{
					$(".yhGm").val(bnum.substr(5,1));
				}
				//제조년도
				$(".yyMade").val((parseInt(bnum.substr(0,2)) + 5));

				$(".barcodeNum").val(bnum);
			}
			function setImage(path) {
        alert(path);
        $(".addfile").html('<img src="'+path+'" />')
      }

      function myToken(tok){
        //alert(tok);
        token = tok;
      }
      var i=0;
      var la1 = 0;
      var lo1 = 0;
      function myArea(la,lo,ga,open){
        $("#aa").html(i+"번 : " + la+"/"+lo+"/"+ga+"/"+open);
				//lat_grp = la;
				//lng_grp = lo;
				//ph_grp = phone;
        jMap.dispGps(lo,la,ga);
        i++;
      }

      function myArea2(la,lo,ga,open,phone){
				//alert(la);
				lat_grp = la;
				lng_grp = lo;
				ph_grp = phone;
      }

      function myAreaStop(){
        $("#aa").html("gps 스톱");
      }
      function myAreaStop2(){
        $("#aa").html("gps 스톱");
      }

      function Orientation(type){
        setTimeout(function(){
          var eleMap = document.getElementById('dvMap');

          var viewerWidth = window.innerWidth;
          var viewerHeight = window.innerHeight-111;
          eleMap.style.width = viewerWidth + "px"; 
          eleMap.style.height = viewerHeight + "px";		

          $("#aa").html("0 : " + viewerWidth + "//" + viewerHeight);
          jMap.pivot(viewerWidth, viewerHeight, 0 ,56);  //맵 사이즈 설정



          if(typeof $("#gridContainer").html() != 'undefined'){
            var table_height = $(window).height() - $(".search").height() - $(".message").height() - $(".tab").height() - 275;
            //alert( table_height +"/"+$(window).height()+"/"+$(".search").height()+"/"+$(".message").height()+"/"+$(".tab").height() + $("#gridContainer").height() );
            if(table_height<=150){
              table_height = 500;
            }

            var wrap_height = $(window).height() - 160 ;
            $(".wrap").height(wrap_height);
            $("#gridContainer").height(table_height);
          }
        },100);

      
      }

      var map_type=0;
      function displayNone(t){
    		
        jMap.refreshMap();
        jMap.drawFeature_cancel();
    
        if(t!='btn-area-circle'){
          $(".btn-area-circle").css("display","none");
        }
        if(t!='btn-marea'){
          $(".btn-marea").css("display","none");
        }
        if(t!='btn-select'){
          $(".btn-select").css("display","none");
        }
        $(".map-left-btn").css("display","none");
        $(".btn-input").removeClass("active");
        $(".btn-mdistance").removeClass("active");
        $(".btn-marea").removeClass("active");
        $(".btn-area").removeClass("active");
        $(".btn-area-circle").removeClass("active");
        $(".btn-info").removeClass("active");
        $(".btn-select").removeClass("active");
      }


      $( document ).ready(function() {
				
				console.log("version : " + (location.href));
				console.log("version : " + h);
				if(typeof h[1] != "undefined"){
			    $(".app_version").val(h[1]);
					setTimeout(function(){
						console.log("version : " + h[1]);
			      $(".app_version").val(h[1]);
					},500);
				}
        //로그인 토큰 정보
        $(document).on("click",".login_token",function(){
          window.Android.getToken();
        });

        //지도 관련
        $(document).on("click",".btn-portal",function(){
          //displayNone("");
          if( $(this).attr("class").indexOf("active") < 0 ){
            $(this).addClass("active");
            $(".map-top").css("display","block");
          }else{
            $(this).removeClass("active");
            $(".map-top").css("display","none");
          }

          if(map_type== 0){
            jMap.openMap();
            jMap.setOpenMapType(1);
            map_type=1;
            $(this).find("span").html("GIS맵");

            if($(".btn-map").attr("class").indexOf("active") < 0 ){
              $(".btn-map").addClass("active");
            }
            if($(".btn-skyview").attr("class").indexOf("active") >= 0 ){
              $(".btn-skyview").removeClass("active");
            }
            if($(".btn-cadastral").attr("class").indexOf("active") >= 0 ){
              jMap.setUseDistrict(false);
              $(".btn-cadastral").removeClass("active");
            }
          }else{
            jMap.gisMap();
            map_type=0;
            $(this).find("span").html("포탈맵");

          }
        });
        
        //일반맵, 오픈맵
        $(document).on("click",".btn-map",function(){
          if($(this).attr("class").indexOf("active") < 0 ){
            $(this).addClass("active");
            jMap.setOpenMapType(1);
          }
          if($(".btn-skyview").attr("class").indexOf("active") >= 0 ){
            $(".btn-skyview").removeClass("active");
          }
          if($(".btn-cadastral").attr("class").indexOf("active") >= 0 ){
            jMap.setUseDistrict(false);
            $(".btn-cadastral").removeClass("active");
          }
        });
        //위성맵 스카이뷰
        $(document).on("click",".btn-skyview",function(){
          if($(this).attr("class").indexOf("active") < 0 ){
            $(".btn-skyview").addClass("active");
            jMap.setOpenMapType(2);
          }

          if($(".btn-map").attr("class").indexOf("active") >= 0 ){
            $(".btn-map").removeClass("active");
          }
          if($(".btn-cadastral").attr("class").indexOf("active") >= 0 ){
            jMap.setUseDistrict(false);
            $(".btn-cadastral").removeClass("active");
          }
          

        });
        //지적도
        $(document).on("click",".btn-cadastral",function(){
          if($(this).attr("class").indexOf("active") < 0 ){
            jMap.setUseDistrict(true);
            $(this).addClass("active");
          }else{
            jMap.setUseDistrict(false);
            $(this).removeClass("active");
          }
        });

        //내위치
				var navi = 0;
        $(document).on("click",".btn-my-area",function(){
					navi = 0;
          if( $(".btn-my-drive").attr("class").indexOf("active") >= 0 ){
            jMap.setGps(false);
            $(".btn-my-drive").removeClass("active");
          }

          if( $(this).attr("class").indexOf("active") >= 0 ){
            $(this).removeClass("active");
            $(".btn-my-drive").css("display","none");
            jMap.setGps(false);
            window.Android.stopArea();
          }

          if($(".btn-my-drive").css("display")=="block"){
            jMap.setGps(true);
						navi = 1;
            window.Android.startArea();
            $(this).addClass("active");
          }

          $(".btn-my-drive").css("display","block");

        })

				$(document).on("click",".smsSend",function(){
					window.Android.SmsSend($(".sms_number").val(),$(".sms_message").val());
				});
        $(document).on("click",".btn-my-drive",function(){
					navi = 0;
          if( $(".btn-my-area").attr("class").indexOf("active") >= 0 ){
            jMap.setGps(false);
            $(".btn-my-area").removeClass("active");
          }

          if( $(this).attr("class").indexOf("active") < 0 ){
						navi = 1;
            jMap.setGps(true,true);
            window.Android.startArea();
            $(this).find("span").html("스톱");
            $(this).addClass("active") 
            //$(".btn-my-area").removeClass("active");
          }else{
            $(this).find("span").html("주행");
            $(this).removeClass("active");
            jMap.setGps(false);
            window.Android.stopArea();
          }
        });

        $(document).on("click",".btn-input",function(){
          $(".btn-input-modify").removeClass("active");
          $(".btn-input-memo").removeClass("active");
          $(".btn-input-punch").removeClass("active");
          jMap.drawFeature_cancel();
          if($(".map-left-btn").css("display")=='block'){
            $(".map-left-btn").css("display","none");
            $(this).removeClass("active");
          }else{
            displayNone("");
            $(".map-left-btn").css("display","block");
            $(this).addClass("active");
          }
        });

        $(document).on("click",".btn-zoom-in",function(){
          displayNone("");
          jMap.zoomIn();
        })

        $(document).on("click",".btn-zoom-out",function(){

          displayNone("");
          jMap.zoomOut();
        });

        //거리면적
        $(document).on("click",".btn-mdistance",function(){
          displayNone("btn-marea");
          if($(".btn-marea").css("display")=="block"){
            jMap.measureDistance();
            $(this).addClass("active");
          }
          $(".btn-marea").css("display","block");

        });
        $(document).on("click",".btn-marea",function(){
          jMap.measureArea();
          $(this).addClass("active");
          $(".btn-mdistance").removeClass("active");
        });

        // 영역 설정
        $(document).on("click",".btn-area",function(){
          displayNone("btn-area-circle");
          if($(".btn-area-circle").css("display")=="block"){
            jMap.setArea(1);
            $(this).addClass("active");
          }
          $(".btn-area-circle").css("display","block");
        });

        $(document).on("click",".btn-area-circle",function(){
          jMap.setArea(2);
          $(this).addClass("active");
          $(".btn-area").removeClass("active");
        });

        //선택정보
        $(document).on("click",".btn-info",function(){
          displayNone("btn-select");
          if($(".btn-select").css("display")=="block"){
            jMap.selectFeature();
            $(this).addClass("active");
          }
          $(".btn-select").css("display","block");
          
        });
        $(document).on("click",".btn-select",function(){
          jMap.selectFeature('multi');
          $(this).addClass("active");
          $(".btn-info").removeClass("active");
        });
        //지도 초기화
        $(document).on("click",".btn-reflash",function(){
          displayNone("");
					if(navi == 1){
						navi = 0;
            $(".btn-my-drive").css("display","none");
            jMap.setGps(false);
            $(".btn-my-drive").removeClass("active");
            $(".btn-my-area").removeClass("active");

					}
          //jMap.resetTrace();
        });
				//점검 버튼 1~4구간
				/*
        $(document).on("click",".btn-gps",function(){
					if($(".btn-gps-box").css("display")=="none"){
						$(".btn-gps-box").css("display","block");
						$(".btn-gps").addClass("active");
					}else{
						$(".btn-gps-box").css("display","none");
						$(".btn-gps").removeClass("active");
					}
				});
				*/

				$(document).on("focus",".keyup",function(){
					if($(this).attr("class").indexOf("readonly") < 0){
						$(".contents").css("margin-top","-200px");
					}
					if($(".popup-box").html() !== undefined){
						$(".popup-box").css("top", "50px");
					}
				});
				$(document).on("blur",".keyup",function(){
					if($(this).attr("class").indexOf("readonly") < 0){
						$(".contents").css("margin-top","0px");
					}
					if($(".popup-box").html() !== undefined){
						$(".popup-box").css("top", "50%");
					}
				});
				$(document).on("click",".onBarcode",function(){
					/*
					var bnum = "176311004892";
					//제조사
					$(".cdMakerVc").val(bnum.substr(2,1));
					//등급
					$(".grdGm").val("000"+bnum.substr(3,1));
					//모델,등급별 모델
					var cdModel = {"3":"020","4":"030","6":"040","10":"050","16":"060","25":"070","40":"074","65":"076","100":"080","160":"084","250":"086","400":"088","650":"110","1000":"120","1600":"130","2500":"140","4000":"160"};
					$(".cdModel").val(cdModel[bnum.substr(3,1)]);

					//타입
					$(".tyGm").val(bnum.substr(4,1));
					//유형
					var yhGm = bnum.substr(5,2);
					if(yhGm == "35" || yhGm == "45"){
						$(".yhGm").val(yhGm);
					}else{
						$(".yhGm").val(bnum.substr(5,1));
					}
					//제조년도
					$(".yyMade").val((parseInt(bnum.substr(0,2)) + 2005));

					$(".barcodeNum").val(bnum);
					*/
			
					//window.Android.onBarcode($(".barcode_nocust").val())
				});
				$(document).on("click",".onDraw",function(){
					window.Android.DrawSign("1","1","1","","","");
				});
				
      });
			