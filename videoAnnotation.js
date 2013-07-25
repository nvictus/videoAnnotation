/*
 * Table of Contents - Organized by astrixed comment sections
 *		1. Youtube Video-Related Code
 *		2. Progressbar-related Code
 *		3. Commenting-related Code (includes accordion)
 *		4. Tick-related code
 *		5. jQuery(document).ready() 
 *				-calls: updateProgressbar(), addAllCommentHTML(), setupAccordion(), addTicks()
 */

/*
 * 1. Youtube Video-Related Code
 */

// Update a particular HTML element with a new value
function updateHTML(elmId, value) {
	document.getElementById(elmId).innerHTML = value;
}

// This function is called when an error is thrown by the player
function onPlayerError(errorCode) {
	alert("An error occured of type:" + errorCode);
}

// This function is called when the player changes state
function onPlayerStateChange(newState) {
	updateHTML("playerState", newState);
}

// Display information about the current state of the player
function updatePlayerInfo() {
	// Also check that at least one function exists since when IE unloads the
	// page, it will destroy the SWF before clearing the interval.
	if(ytplayer && ytplayer.getDuration) {
		updateHTML("videoDuration", ytplayer.getDuration());
		updateHTML("videoCurrentTime", ytplayer.getCurrentTime());
		var percentage = 100*ytplayer.getCurrentTime()/ytplayer.getDuration();
		//$("#progressbar").progressbar("option","value", percentage);
		updateHTML("videoPercentage", percentage);
		updateHTML("bytesTotal", ytplayer.getVideoBytesTotal());
		updateHTML("startBytes", ytplayer.getVideoStartBytes());
		updateHTML("bytesLoaded", ytplayer.getVideoBytesLoaded());
		updateHTML("volume", ytplayer.getVolume());
		updateHTML("videoCurrentTimeMinSec", ytplayer.getCurrentTime());
		updateHTML("videoTimeDisplay", calculateTime(ytplayer.getCurrentTime())); //seen under progressbar
		updateHTML("videoTotalTimeDisplay", calculateTime(ytplayer.getDuration()));
	}
}

//give the time in secodns, show the time as a string with (hours:)minutes:seconds
function calculateTime(givenTime){
	var totalSec = parseInt(givenTime);
	var hours = 0;
	if (totalSec >= 3600){
		hours = parseInt(totalSec/3600);
		totalSec -= hours*3600;
	}
	var minutes = 0;
	if(totalSec >= 60){
		minutes = parseInt(totalSec/60);
		totalSec -= minutes*60;
	}
	var display = "";
	if(hours > 0){
		display += hours + ":";
	}
	if(hours > 0 && minutes <10){
		display += "0" + minutes + ":";
	}else{
		display += minutes + ":";
	}
	if (totalSec < 10){
		display+= "0" + totalSec;
	}else{
		display+= totalSec;
	}
	return display;
}

//calculate the number of seconds given the time as a string
function calcualateTime_stringToNum(timeStr){
	var seconds = parseInt(timeStr.substring(timeStr.length-2, timeStr.length)); //gets seconds
	timeStr = timeStr.substring(0, timeStr.length-3); //gets rid of the seconds portion of string
	var minutes, hours = 0;
	if (timeStr.length == 1 || timeStr.length == 2){
		minutes = parseInt(timeStr);
	}else{//if the video has hours
		minutes = parseInt(timeStr.substring(timeStr.length-2, timeStr.length));
		timeStr = timeStr.substring(0, timeStr.length-3); //gets rid of the seconds portion of string
		hours = parseInt(timeStr);
	}

	var totalSeconds = hours*3600 + minutes*60 + seconds;
	return totalSeconds;	
}

function updateProgressBar(){
	var percentage = 100*ytplayer.getCurrentTime()/ytplayer.getDuration();
	$("#progressbar").progressbar("option","value", percentage);
}

// Allow the user to set the volume from 0-100
function setVideoVolume() {
	var volume = parseInt(document.getElementById("volumeSetting").value);
	if(isNaN(volume) || volume < 0 || volume > 100) {
		alert("Please enter a valid volume between 0 and 100.");
	}
	else if(ytplayer){
		ytplayer.setVolume(volume);
	}
}

//when the div covering the video is clicked; syncs with the play/pause button
function videoClicked(){
	playORpause();
}
//when the play/pause button is clicked
function playORpause(){
	if ($(".playORpause").attr("src") == "images/play.png"){
		$(".playORpause").attr("src", "images/pause.png")
		playVideo();
	}else{
		$(".playORpause").attr("src", "images/play.png")
		pauseVideo();
	}
}

//when the mute/unmute button is clicked
function muteORunmute(){
	if ($(".muteORunmute").attr("src") == "images/mute.png"){
		$(".muteORunmute").attr("src", "images/volume_up.png")
		muteVideo();
	}else{
		$(".muteORunmute").attr("src", "images/mute.png")
		unMuteVideo();
	}
}

function playVideo() {
	if (ytplayer) {
		ytplayer.playVideo();
	}
}

function pauseVideo() {
	if (ytplayer) {
		ytplayer.pauseVideo();
	}
}

function muteVideo() {
	if(ytplayer) {
		ytplayer.mute();
	}
}

function unMuteVideo() {
	if(ytplayer) {
		ytplayer.unMute();
	}
}


// This function is automatically called by the player once it loads
function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("ytPlayer");

	//This hack is an attempt to eliminate the big red play button by default
	//it prevents the default play button from playing the video without changing my own play button
	//it also starts the loading of the video sooner
	window.setTimeout(function() {
		ytplayer.playVideo();
	    ytplayer.pauseVideo();
	}, 0);

	// This causes the updatePlayerInfo function to be called every 250ms to
	// get fresh data from the player
	setInterval(updateProgressBar, 1000);
	setInterval(updatePlayerInfo, 250);
	updatePlayerInfo();
	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
	//Load an initial video into the player
	ytplayer.cueVideoById("BCkfTCjF8SM");
}

// The "main method" of this sample. Called when someone clicks "Run".
function loadPlayer() {
	// Lets Flash from another domain call JavaScript
	var params = { allowScriptAccess: "always" };
	// The element id of the Flash embed
	var atts = { id: "ytPlayer" };
	// All of the magic handled by SWFObject (http://code.google.com/p/swfobject/)
	swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
						"version=3&enablejsapi=1&playerapiid=player1", 
						"videoDiv", "752", "423", "9", null, null, params, atts);
}
function _run() {
	loadPlayer();
	$("#progressbar").progressbar();
	$("#progressbar").progressbar("option","value",0);
}
google.setOnLoadCallback(_run);

/*
 * 2. Progressbar-related Code  
 */

//update the time of the ytplayer if the progress bar is clicked
function progressbar_click(mouseX){
	var percentage = mouseX/660;
	$("#progressbar").progressbar("option","value",percentage*100); //updates progressbar location
	var currentSec = percentage*ytplayer.getDuration();
	ytplayer.seekTo(currentSec, true); //updates ytplayer location in video
}

//calculate the position of the mouse relative to the progressbar if clicked
function updateProgressbar(){
	//update progressbar if clicked
   $("#progressbar").click(function(e){
		var parentOffset = $(this).parent().offset(); 
		//or $(this).offset(); if you really just want the current element's offset
		var relX = e.pageX - parentOffset.left;
		var relY = e.pageY - parentOffset.top;
		$('#offset').html(relX + ', ' + relY);
		progressbar_click(relX);
	});

}

/*
 * 3. Commenting-related Code
 */

//the array of objects the stores all the information for every comment
//ID: number assigned in order of when comment is made (Starting at 0)
//timeSec: the time in seconds at which the comment refers to
//timeStr: the time as a string (in minute:second format) at which the comment refers to
//text: the body text of the comment
//type: the selected type - either Comment or Question
//viewer: who the student selected can view the comment (currently no functionality with it)
var commentObj = [
					{"ID": 0,
					"text": "This is my first comment! This is frame is interesting since ...",
					"timeSec" : 158, 
					"timeStr" : "2:38",
					"type" : "Comment",
					"viewer" : "Class",},
					{"ID": 1,
					"timeSec" : 38, 
					"timeStr" : "0:38",
					"text": "Comment number 2!",
					"type" : "Comment",
					"viewer" : "Class",},
					{"ID": 2,
					"timeSec" : 8, 
					"timeStr" : "0:08",
					"text": "Question number 1!",
					"type" : "Question",
					"viewer" : "Class",},
					{"ID": 3,
					"timeSec" : 191, 
					"timeStr" : "3:11",
					"text": "Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque.",
					"type" : "Question",
					"viewer" : "Just Me"},
					{"ID": 4,
					"timeSec" : 214, 
					"timeStr" : "3:34",
					"text": "Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque.",
					"type" : "Question",
					"viewer" : "Just Me"}
					];

//this function does all the work to display the comments:
//it calls SortsCommentObj, addAllCommentHTML, and setupAccordion
function setup_commentDisplay(){
	sortCommentObj();
	addAllCommentHTML();
	setupAccordion();
}

//This function sorts the commentObj array by the timeSec so we can later display the comments in order
function sortCommentObj(){
	function compare(a,b) {
	  if (a.timeSec < b.timeSec)
	     return -1;
	  if (a.timeSec > b.timeSec)
	    return 1;
	  return 0;
	}

	commentObj.sort(compare);
}

//Given the array index, this function gets the stored text and wraps it in HTML to be put into accordion
//called in addAllCommentHTML(), showNewComment()
function extractCommentHTML(num){
	var typeInitial = commentObj[num].type[0];
	var text = commentObj[num].text;
	var commentSnippet = text.substring(0,30);

	var html = "<text>" + typeInitial + ": " + commentSnippet;
	if(text.length > 30){
		html += "...";
	}
	html +="</text><div>"+ text + "</div>";

	return html;
}

//only called once when page is setting up (document ready function)
//goes in a for loop to add all of the objects to the accordion section of the html
function addAllCommentHTML(){
	var html = "";
	for(var num = 0; num < commentObj.length; num++){
		var htmlSection = extractCommentHTML(num);
		html += htmlSection;
	}
	$("#accordion").append(html);
}

//sets up the accordion
function setupAccordion(){
	$("#accordion").accordion({ header: "text", //selects type of element to be recognized as the 'header'
								collapsible: true, //allows all the panels to be collapsesd at the same time
								active: false, //initially none of the panels are selected- all starts closed
								heightStyle: "content"}); //each content panel adjusts its height to its own content
}

//shows the add new comment options
function show_addNewComment(){
	$(".commentsView_newComment").css("display", "");
	$("#comment_time").val(calculateTime(ytplayer.getCurrentTime()));
}
//hodes the add new comment options
function hide_addNewComment(){
	$(".commentsView_newComment").css("display", "None");
	$("#newCommentTime").val("");
	$(".newCommentTextbox").val("");
}
//when the comment button is pushed
function comment_btn(){
	ytplayer.pauseVideo();
	show_addNewComment();
}

//when the submit button is pushed
function submitNewComment(){
	$(".commentsView_newComment").css("display", "none"); //show the div
	var text = $(".newCommentTextbox").val();
	var type = $('#comment_type').find(":selected").text();
	var viewer = $('#comment_viewer').find(":selected").text();
	var time = $('#comment_time').val();
	commentObj.push({ "ID": commentObj.length,
						"text" : text,
						"timeSec" : calcualateTime_stringToNum(time),
						"timeStr" : time,
						"type" : type,
						"viewer" : viewer});
	$(".newCommentTextbox").val(""); //empty textbox
	showNewComment();

}

//adds the new comment into the accordion
//extracts information from the commentObj
function showNewComment(){
	$("#accordion").accordion('destroy');
	$("#accordion").html("");
	setup_commentDisplay();
}

/*
 *	4. Tick-related code
 */

//incomplete
 function addTicks(){
 	var arrayOfLocs= []
 }

/*
 *	5. jQuery(document).ready()
 *		calls: updateProgressbar(), addAllCommentHTML(), setupAccordion(), addTicks()
 */

jQuery(document).ready(function(){
   $(document).mousemove(function(e){
      $('#status').html(e.pageX +', '+ e.pageY);
   }); 

 	updateProgressbar();
 	setup_commentDisplay();
	addTicks();
})