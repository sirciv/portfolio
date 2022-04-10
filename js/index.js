// 1. SCROLLING LOGO

var gearlogo = document.getElementById("gearlogo");

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
    let speedAdjust = window.pageYOffset / 20;
    gearlogo.style.transform = "rotate("+speedAdjust+"deg)";
});

// 2. CONTENT SELECTION FUNCTIONS

const loadContent = (contentNumber) => {
    let content2url = `/cs130-coursework/finalproject/content/c${contentNumber}/c${contentNumber}.txt`;
    scrollToTop(500);
    document.querySelector('.content-1').innerHTML = `<img src="https://sirciv.github.io/cs130-coursework/finalproject/content/c${contentNumber}/c${contentNumber}.jpg">`;
    getContent(content2url);
};

const getContent = (url) => {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            document.querySelector('.content-2').innerHTML = data;
        })
};

//3. SCROLL TO TOP

function scrollToTop(scrollDuration) {
      var scrollStep = -window.scrollY / (scrollDuration / 15),
          scrollInterval = setInterval(function(){
          if ( window.scrollY != 0 ) {
              window.scrollBy( 0, scrollStep );
          }
          else clearInterval(scrollInterval); 
      },15);
  }