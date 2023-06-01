// 1. SCROLLING LOGO

var gearlogo = document.getElementById("gearlogo_noflash");

;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };
    throttle ("scroll", "optimizedScroll");
})();
    
window.addEventListener("optimizedScroll", function() { 
    let speedAdjust = window.pageYOffset / 16;
    gearlogo.style.transform = "rotate("+speedAdjust+"deg)";
});

//2. SCROLL TO TOP

function scrollToTop(scrollDuration) {
      var scrollStep = -window.scrollY / (scrollDuration / 15),
          scrollInterval = setInterval(function(){
          if ( window.scrollY != 0 ) {
              window.scrollBy( 0, scrollStep );
          }
          else clearInterval(scrollInterval); 
      },15);
  }