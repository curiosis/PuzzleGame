// autor Remigiusz Drobinski

var change=false;

$(document).ready(function(){
    alert("Wizualnie program najlepiej wygląda na urządzeniach iPhone6/7/8 Plus");
    var col = 4;
    var rows = 4;
    var pieces = "";
    
    for(var i=0, left=0; i<col; i++, left-=75){
        for(var j=0, top=0; j<rows; j++, top-=75){
            pieces += "<div style='background-position:" + top + "px " + left + "px;' class='piece'></div>";
        }
    }
    $("#puzzleContainer").html(pieces);
    $("#change").click(function(){
        if(change){
            change=false;
            document.querySelector('#change').innerText = 'Wolny';
        }
        else{
            change=true;
            document.querySelector('#change').innerText = 'Przesuwny';
        }
    })
    
    $("#start").click(function(){
        $("#desc").hide();
        $("#clipboardContainer").show();
        $("#change").hide();
        var pieces = $("#puzzleContainer div");
        pieces.each(function(){
            if (window.matchMedia("(orientation: portrait)").matches){
                var leftPos = Math.floor(Math.random()*300) + "px";
                var topPos = Math.floor(Math.random()*150+375) + "px";
            }
            if (window.matchMedia("(orientation: landscape)").matches){
                var leftPos = Math.floor(Math.random()*250+355) + "px";
                var topPos = Math.floor(Math.random()*200+50) + "px";
            }
            
            $(this).addClass("draggablePiece").css({
                position:"absolute",
                left:leftPos,
                top:topPos
            })
            $("#clipboardContainer").append($(this))
        })
        var tempEmptyPieces="";
        for(var i=0; i<col; i++){
            for(var j=0; j<rows; j++){
                tempEmptyPieces += "<div style='background-image:none;' class='piece droppableSpace'></div>";
            }
        }
        
        $(this).hide();
        $("#reset").show();
        $("#puzzleContainer").html(tempEmptyPieces);
        initMovment(window.innerWidth, window.innerHeight);
    })
    $("#reset").click(function(){
        location.reload();
    })
});

function initMovment(width, height) {
  var obs = document.querySelectorAll(".draggablePiece");
  var zIndex = 1;
  var x, y, that;
  var stopAll = function (e) {
    e.stopPropagation();
    e.preventDefault();
    
  };
  var startMovement = function (e, That) {
    x = e.pageX;
    y = e.pageY;
    that = That;
    that.style.zIndex = zIndex++;
    stopAll(e);
  };
  var beginingOfTouchMovement = function (e) {
    if (e.changedTouches.length > 0) startMovement(e.changedTouches[0], this);
  };
  var startOfMouseMovement = function (e) {
    window.addEventListener("mousemove", mouseOrTouchMovement, true);
    window.addEventListener("mouseup", endOfMouseMovement, true);
    startMovement(e, this);
  };
  var stopMovment = function (e) {
    stopAll(e);
  };
  var mouseOrTouchMovement = function (e) {
    var dx = e.pageX - x;
    var dy = e.pageY - y;
    x = e.pageX;
    y = e.pageY;
    that.style.top = that.offsetTop + +dy + "px";
    that.style.left = that.offsetLeft + +dx + "px";
  };
  function mouseMovement(e) {
    mouseOrTouchMovement(e);
    stopAll(e);
  }
  var endOfMouseMovement = function (e) {
    window.removeEventListener("mouseup", endOfMouseMovement, true);
    window.removeEventListener("mousemove", mouseOrTouchMovement, true);
    stopAll(e);
    
  };
  var touchMovement = function (e) {
    if (e.changedTouches.length > 0) mouseOrTouchMovement(e.changedTouches[0]);
    stopAll(e);
  };
  var endOfTouchMovement = function (e) {
      if(change == true){
        $("#puzzleContainer").append($(this))
        $(this).addClass("droppedPiece").css({
            top:-308,
            left:0,
            position:"relative"
        });
      }
    stopAll(e);
  };
  for (var i = 0; i < obs.length; i++) {
    var ob = obs[i];
    ob.addEventListener("mousedown", startOfMouseMovement, true);
    ob.addEventListener("touchstart", beginingOfTouchMovement, false);
    ob.addEventListener("touchmove", touchMovement, false);
    ob.addEventListener("touchend", endOfTouchMovement, false);
  }
}