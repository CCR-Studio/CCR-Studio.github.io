var width = $(window).width();
	jQuery(document).ready(function($) {
		var num =$(".nav_li ul li").length;
		for(var i = 0;i<=200;i++ ){
			$(".nav_li ul").after('<div class="a" id="a'+i+'"></div>');	
		}
		change();
		function change(){
			for(var i= 0;i<=200;i++ ){
			var top       = parseInt(100*Math.random());
			var left      = parseInt(width*Math.random());
			var right     = parseInt(300*Math.random());
			var bottom    = parseInt(300*Math.random());
			var transform = parseInt(360*Math.random());
			$("#a"+i).css({transform:'rotate('+transform+'deg)',
				top:top,
				left:left,
				right:right,
				bottom:bottom,
				transition:'0.5s',
				width:i/40+'px',
				height:i/40+'px',
				background:"rgba(200, 200, 200,"+i/200+")"
				});
			}
		}
		var nav_li=$(".nav_li ul li");
		var nav = nav_li.offset();
		$(".nav_li ul li").hover(function(){
			//console.log(x+","+y);
			a   = $(this).find("a").offset();
			b   = $(this).next().find("a").offset(); 
			wid = $(this).width();
			for (var i = 0; i <=200; i++) {
				if (i<=wid/2) {
					$("#a"+i).css({transform:'rotate(0deg)',
						top:a.top+26,
						left:a.left+(i*2),
						right:0,
						bottom:0,
						width:'2px',
						height:'0.5px',
						background:"rgba(255, 255, 255,1)"
						});
				}else {
					$("#a"+i).css({transform:'rotate(0deg)',
						top:a.top+27,
						left:a.left+((i-wid/2-1)*2),
						right:0,
						bottom:0,
						width:'4px',
						height:'0.5px',
						background:"rgba(255, 255, 255,1)"
						});
				}
			}
		},function(){
			change();
	    });
	});