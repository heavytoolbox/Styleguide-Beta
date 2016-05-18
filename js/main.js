function callExact (){
	var txt =  $("#search").val().toLowerCase();
	var o = $("h3").filter(function() {
    			return $.trim($(this).text().toLowerCase()) === txt;
		});
	var s = topIsUnfixed() ? 0 : $(".top-bar.vis").height() + 10;
	if (o){
		
		window.scrollTo (window.pageXOffset, o.offset().top - s);
	}
	else{
		var y = (s == 0) ? 0 : $("table:first").offset().top - s;
		window.scrollTo (window.pageXOffset, y);
	}
}
function callSeeAlso(s) {
	var word = s.trim();
	searchList.search (word);
	if (searchList.matchingItems.length <1)
	{
		if (/\((.*)\)/.test(word)) {
			word = word.replace(/\(.*\)/g,'').trim();
			searchList.search (word);
		}
	}
	$("#search").val(word);
	if (currPage == 'a-to-z' || currPage == 'glosses'){
		callExact ();
	}
}
function topIsUnfixed() {
	if ($('.top-bar.vis').css('position') === 'fixed'){
		return false;
	}else{
		return true;
	}
}
$(document).ready(function(){
	var loc = window.location.pathname;
	var path = loc.substring(0, loc.lastIndexOf("/"));
	currPage = path.substring(path.lastIndexOf("/")+1);
	//topBarH = $(".top-bar.vis").height();
	var pages = ['introduction', 'a-to-z', 'te-papa-names', 'iwi-names', 'glosses', 'acquisition-credits'];
	var i = $.inArray(currPage, pages) + 1;
	$("nav li:nth-child("+i+")").addClass('selected');
	
	if (currPage == 'a-to-z' || currPage == 'te-papa-names' || currPage == 'iwi-names'|| currPage == 'glosses'){
		$("#search").focus();
		$("tbody").addClass("list");
		$("table").addClass(currPage);
		
		if (currPage == 'a-to-z' || currPage == 'glosses'){
			$("h3").addClass( "headword" );
			$("td+td+td").addClass( "extras" );// or use 'nth' to skip other cols? (test ie)
			var options = {
				valueNames: [ 'headword','extras' ]
			};
			$("#exact").click(function(){
				callExact();
			});
			$("h4").click(function(e){
				callSeeAlso($(this).text());
			});
		}
		else if (currPage == 'te-papa-names') {
			$("table:last td").attr('colspan',3);
			$("table:first  > tbody:last").append($("table:last > tbody").html());
			$("table:last").remove();
			
			$("td:first-child").addClass( "headword" );
			var options = {
				valueNames: [ 'headword' ]
			};
			$('.read-more-toggle').on('click', function() {
				$('.read-more-content').toggleClass('hide');
			});
		}
		else if (currPage == 'iwi-names') {
			$("td:first-child").addClass( "headword" );
			$("td+td+td").addClass( "extras" );
			var options = {
				valueNames: [ 'headword','extras' ]
			};
		}
		searchList = new List('styleguide', options);
		searchList.on('updated', function(list) {
        		var s = topIsUnfixed() ? 0 : ($("table:first").offset().top - $(".top-bar.vis").height())-10;
			window.scrollTo (window.pageXOffset, s);
      		});
      		$("div[id^='_com']").addClass("invis");
		$("a[id^='_anchor']").addClass("tooltip");
		
		$("a[id^='_anchor']").each(function( index ) {
			var i = $(this).attr('id').substring(8);
			$(this).tooltipster({
                		animation: 'fade',
				delay: 100,
				theme: 'tooltipster-punk',// i hacked the default css file to save exta file load
				touchDevices: true,
				trigger: 'click',
				contentAsHTML: true,
				content: $("div[id^='_com_"+i+"']").html()
			})
    		});
		$("a[id^='_anchor']").click(function(e) {
			e.preventDefault();
		});
		$("#clear").click(function(){
			$("#search").val('');
			searchList.search ('');
			window.scrollTo (window.pageXOffset, 0);
		});
		$(window).on('hashchange',function(){ 
			var hash = location.hash.substring(1);
			if (hash.indexOf("_msocom") >= 0){
				
			}
			else{
				callSeeAlso(hash);
			} 
		});
		var hash = location.hash.substring(1);
		if (hash) {
			callSeeAlso(hash);
		} 
	}	
});
