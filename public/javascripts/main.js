(function(){

<!--向上滚动 -->
	var speed = 35;//滚动的速度
	var tab = document.getElementById("ad_content");
	var tab1 = document.getElementById("ad_ul");
	var tab2 = document.getElementById("ad_ul1");
	var li_count=tab1.getElementsByTagName('li').length;
	tab2.innerHTML = tab1.innerHTML;
	function Marquee(){
		
		if(li_count%2==1){
		    tab2.className="odd";
		}else{
		    tab2.className="even";
		}
	    if(tab.scrollTop==tab1.offsetHeight ){//当滚动条到达可见视图框底部的时候

	        tab.scrollTop = 0;
	    }
	    else{
	        tab.scrollTop++;//滚动条往下移动

	    }
	}
var MyMar = setInterval(Marquee,speed);
tab.onmouseover = function(){ clearInterval(MyMar)};//清除循环
tab.onmouseout =  function(){MyMar = setInterval(Marquee,speed)}; //恢复循环
})();


	var time_transform=function(timesteamp){
		timesteamp=Math.round(timesteamp/1000);
		var time=new Date(timesteamp*1000);
		return time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate();
	};
	var renderList=function(list){
		list.forEach(function(item,i){

			var content=$(item.content).text();
			var time=time_transform(item.meta.createAt);
			var article="<div class='index_list'>";
			article+="<div class='index_title'><a href='/article/"+item.user._id+"/"+item._id+"'>"+item.title+"</a></div>";
			article+="<div class='index_content'><img src='/images/"+item.user.photo+"'><p>（摘要）"+content+"</p></div>";
			article+="<p>[<a href='/userMain/"+item.user._id+"'>"+item.user.username+"</a>] 发布于 "+time+" <span class='glyphicon glyphicon-edit'>评论"+item.commentL+"</span> <span class='glyphicon glyphicon-list-alt'>阅读"+item.pv+"</span></p>"
			article+="</div>";
			$("#leftContent").append($(article));

		});
		
					
	};
	var selectP=function(num){
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		callSever(num);
	}
	var paging=function(start,count,single){
		var page_num=Math.ceil(count/single);
		console.log(page_num);
		if(page_num!=0){
			var buttons="<p id='button'>";
			for(var i=1;i<=page_num;i++){
				if(i==(start)){
					buttons+="<a class='active' onclick='selectP("+i+",this);'>"+i+"</a>";
				}else{
					buttons+="<a onclick='selectP("+i+",this);'>"+i+"</a>";
				}
			}
			buttons+="</p>";
			$("#leftContent").append($(buttons))
		}
		
	};
	var callSever=function(start){
		$.ajax({
			url:'/seq',
			catch:false,
			data:{
				start:(start-1)
			},
			success:function(data){
				$("#leftContent").html(" ");
				renderList(data.list);
				paging(start,data.count,10);
			}
		});
	}
	callSever(1);
	


