$(document).ready(function () {

    var i = 0;
    var j = 0;
    var rot;
    var XPosition;
    var YPosition;
    var startPointX;
    var startPointY;
    var points = [];
    var scaleX = [];
    var scaley = [];
    let fileName = "";
   

    WB = document.getElementById("WorkBench");
    var canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    const revertBtn = document.getElementById("revert-btn");
    const downloadBtn = document.getElementById("download-btn");
    $(".drawDiv").removeAttr("style");
    $(".dkonvajs-content").removeAttr("style");
    var toggle = $('#ss_toggle');
    var menu = $('#ss_menu');


    // get WebService Unique url for each Patient
    var currentURL = document.URL;
    var res = currentURL.split("/");
    var Url_SetPoints = "http://127.0.0.1:8000/webservice/setPoints/" + res[4] + "/" + res[5] + "/";
    var Url = 'http://127.0.0.1:8000/webservice/getImage/' + res[4] + "/" + res[5] + "/";

    // set image on canvas:
    img = new Image();
    img.src = Url;
    img.onload = function () {
        ImgOnload();
    };



    //add filter and effects:
    document.addEventListener("click", e => {
        if (e.target.classList.contains("filter-btn")) {
            if (e.target.classList.contains("brightness-add")) {
                Caman("#canvas", img, function () {
                    this.brightness(5).render();
                });
            } else if (e.target.classList.contains("brightness-remove")) {
                Caman("#canvas", img, function () {
                    this.brightness(-5).render();
                });
            } else if (e.target.classList.contains("contrast-add")) {
                Caman("#canvas", img, function () {
                    this.contrast(5).render();
                });
            } else if (e.target.classList.contains("contrast-remove")) {
                Caman("#canvas", img, function () {
                    this.contrast(-5).render();
                });
            }
        }

    });
    $(".punctuation").click(function (e) {
        ProbeOnMainCanvas();
    });

    //#region download operation
    downloadBtn.addEventListener("click", () => {
        //get the file extension:
        const fileExt = fileName.slice(-4);
        //initialize new file name
        let newFileName;

        //check image type
        if (fileExt === ".jpg" || fileExt === "png") {
            newFileName = fileName.substring(0, fileName.length - 4) + "-edited.jpg";
        }

        //call download
        download(canvas, newFileName);
    });

    function download(canvas, filename) {
        // init event
        let ev;
        //creat Link
        const link = document.createElement("a");
        //set Props:
        link.download = filename;
        link.href = canvas.toDataURL("image/jpg", 0.8);
        //new mouse event
        ev = new MouseEvent("click");
        //dispatch ev
        link.dispatchEvent(ev);
    }
    //#endregion


    $(".Erase-btn").click(function (e) {
        Erase();
    });

    $(".getPoints-btn").click(function (e) {
        for (var j = 0; j < points.length; j++) {
            scaleX[j] = (points[j].xpos) / window_width;
            scaley[j] = (points[j].ypos) / window_height;
            console.log("x = " + points[j].xpos + "\n" + "y = " + points[j].ypos);
            console.log("scalex = " + scaleX[j] + "\n" + "scaley = " + scaley[j]);
        }
        // var getJSON = function (url, callback) {
        //     var xhr = new XMLHttpRequest();
        //     xhr.open("GET", url, true);
        //     xhr.responseType = "json";

        //     xhr.onload = function () {
        //         var status = xhr.status;

        //         if (status == 200) {
        //             callback(null, xhr.response);
        //         } else {
        //             callback(status);
        //         }
        //     };

        //     xhr.send();
        // };

        //         getJSON("getPoints.webService", function (err, data) {
        //             if (err != null) {
        //                 console.error(err);
        //             } else {
        //                 var text = `Date: ${data.date}
        // Time: ${data.time}
        // Unix time: ${data.milliseconds_since_epoch}`;

        //                 console.log(text);
        //             }
        //         });
    });

    $(".addPoints-btn").click(function (e) {
        for (let i = 0; i < points.length; i++) {

            console.log(points[i].xpos + "   " + points[i].ypos);
        }
        $.ajax({
            type: "POST",
            url: Url_SetPoints,
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify({ POINTS: points }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) { alert(data); },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
        //#region first algo for ajax
        //first method
        // sendJSON(points);

        //second method
        //     let xhr = new XMLHttpRequest();
        //     let url = "server";

        //     // open a connection
        //     xhr.open("POST", "addPoints", true);
        //     var myJson = JSON.stringify(points);
        //     xhr.setRequestHeader("Content-Type", "application/json");
        //     xhr.onreadystatechange = function () {
        //         if (xhr.readyState === 4 && xhr.status === 200) {
        //             // Print received data from server
        //             console.log(this.responseText);
        //         }
        //     };

        //     xhr.send({
        //         data: {
        //             param: myJson
        //         }
        //     });
        // });
        //#endregion
    });

    //#region second algo for ajax
    // function sendJSON(object) {
    //     // Creating a XHR object
    //     let xhr = new XMLHttpRequest();
    //     let url = "addPoints.webService";

    //     // open a connection
    //     xhr.open("POST", url, true);

    //     // Set the request header i.e. which type of content you are sending
    //     xhr.setRequestHeader("Content-Type", "application/json");

    //     // Create a state change callback
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             // Print received data from server
    //             console.log(this.responseText);
    //         }
    //     };

    //     // Converting JSON data to string
    //     var data = [];
    //     for (let i = 0; i < object.length; i++) {
    //         data[i] = JSON.stringify({
    //             XPosition: object[i].xpos,
    //             YPosition: object[i].ypos
    //         });
    //     }
    //     // console.log(object[0].xpos);
    //     // console.log(object[0].ypos);

    //     // Sending data with the request
    //     xhr.send(data);
    // }

    //#endregion

    $(window).resize(function () {
        var currentHeight = $("#canvas").height();
        var currentWidth = $("#canvas").width();
        var imgHeight = img.height;
        var imgWidth = img.width;
        // console.log($(document).height()+" "+$(document).width());

        var scalY = currentHeight / imgHeight;
        var scalX = currentWidth / imgWidth;
        for (let i = 0; i < points.length; i++) {
            $(`#${i}`)
                .css("top", points[i].ypos * scalY + "px")
                .css("left", points[i].xpos * scalX + "px");
            //console.log(points[i].xpos + " " + points[i].ypos * currentHeight + "||" + points[i].xpos * window_width + " " + points[i].ypos * window_height);
        }

    });

    //#region for undo
    $("#undo").click(function (e) {
        undo();
    });
    function KeyPress(e) {
        var evtobj = window.event ? event : e
        if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
            console.log("Ctrl+z");
            undo();
        }

    }
    document.onkeydown = KeyPress;
    //#endregion

    //#region Redo(TODO)
    // redo : Todo!
    //     $(".redo").click(function (e) { 
    //         $(`#${i - j}`).Attr("css", { backgroundColor: "gray", position: absolute ,  });
    //         j += 1;
    //         console.log(j);

    //     });



    //#endregion
    revertBtn.addEventListener("click", e => {
        Caman("#canvas", img, function () {
            this.revert();
        });
    });

    //#region  toggle btn
    $('#ss_toggle').on('click', function (ev) {
        rot = parseInt($(this).data('rot')) - 180;
        menu.css('transform', 'rotate(' + rot + 'deg)');
        menu.css('webkitTransform', 'rotate(' + rot + 'deg)');
        if ((rot / 180) % 2 == 0) {
            //Moving in
            toggle.parent().addClass('ss_active');
            toggle.addClass('close');
        } else {
            //Moving Out
            toggle.parent().removeClass('ss_active');
            toggle.removeClass('close');
        }
        $(this).data('rot', rot);
    });


    menu.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
        if ((rot / 180) % 2 == 0) {
            $('#ss_menu div i').addClass('ss_animate');
        } else {
            $('#ss_menu div i').removeClass('ss_animate');
        }
    });

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-36251023-1']);
    _gaq.push(['_setDomainName', 'jqueryscript.net']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();

    //#endregion


    //#region External Functions
    function undo() {
        $(`#${i - j}`).removeAttr("style");
        j += 1;
        console.log(j);
    }
    function Erase() {
        for (var k = 1; k <= i; k++) {
            $(`#${k}`).remove();
        }
    }
    function ProbeOnMainCanvas() {
        //for PunctuationPunctuation on canvas!
        $("#canvas").click(function (ev) {
            var pos = getMousePos(canvas, ev);

            mousePX = pos.x;
            mousePY = pos.y;
            console.log(mousePX);
            console.log(mousePY);

            // canvas.width=salam_width;
            // img.width=salam_width;
            // img.height=salam_height;
            var salam_width = $("#salam").width();
            var salam_height = $("#salam").height();

            var currentHeight = $("#canvas").height();
            var currentWidth = $("#canvas").width();

            // currentHeight=salam_height;
            // currentWidth=salam_width;
            var imgHeight = img.height;
            var imgWidth = img.width;
            var scalY = currentHeight / imgHeight;
            var scalX = currentWidth / imgWidth;

            // var b = salam_height - currentHeight;
            // var c = salam_width - currentWidth;

            // console.log(b);
            // console.log(c);


            var color = "rgb(248, 248, 91)";
            var size = "7px";
            XPosition = mousePX;
            YPosition = mousePY;

            points.push({
                xpos: (XPosition / scalX),
                ypos: (YPosition / scalY)
            });
            i++;
            $("#salam").append(
                $(`<div class="miniCanvas" id= ${i}  ></div>`)
                    .css("position", "absolute")
                    .css("top", mousePY + "px")
                    .css("left", mousePX + "px")
                    .css("width", size)
                    .css("height", size)
                    .css("background-color", color)
                    .css("cursor", "move")
                    .css("border-radius", "30px")

            );




        });
    }
    function salam() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var $canvas = $("#canvas");
        var canvasOffset = $canvas.offset();
        var offsetX = canvasOffset.left;
        var offsetY = canvasOffset.top;
        var scrollX = $canvas.scrollLeft();
        var scrollY = $canvas.scrollTop();
        var cw = canvas.width;
        var ch = canvas.height;

        // flag to indicate a drag is in process
        // and the last XY position that has already been processed
        var isDown = false;
        var lastX;
        var lastY;

        // the radian value of a full circle is used often, cache it
        var PI2 = Math.PI * 2;

        // variables relating to existing circles
        var circles = [];
        var stdRadius = 5;
        var draggingCircle = -1;

        // clear the canvas and redraw all existing circles
        function drawAll() {
            ctx.clearRect(0, 0, cw, ch);
            for (var i = 0; i < circles.length; i++) {
                var circle = circles[i];
                ctx.beginPath();
                ctx.arc(circle.x, circle.y, circle.radius, 0, PI2);
                ctx.closePath();
                ctx.fillStyle = circle.color;
                ctx.fill();
            }
        }

        function handleMouseDown(e) {
            // tell the browser we'll handle this event
            e.preventDefault();
            e.stopPropagation();

            // save the mouse position
            // in case this becomes a drag operation
            lastX = parseInt(e.clientX - offsetX);
            lastY = parseInt(e.clientY - offsetY);

            // hit test all existing circles
            var hit = -1;
            for (var i = 0; i < circles.length; i++) {
                var circle = circles[i];
                var dx = lastX - circle.x;
                var dy = lastY - circle.y;
                if (dx * dx + dy * dy < circle.radius * circle.radius) {
                    hit = i;
                }
            }

            // if no hits then add a circle
            // if hit then set the isDown flag to start a drag
            if (hit < 0) {
                circles.push({ x: lastX, y: lastY, radius: stdRadius, color: randomColor() });
                drawAll();
            } else {
                draggingCircle = circles[hit];
                isDown = true;
            }

        }

        function handleMouseUp(e) {
            // tell the browser we'll handle this event
            e.preventDefault();
            e.stopPropagation();

            // stop the drag
            isDown = false;
        }

        function handleMouseMove(e) {

            // if we're not dragging, just exit
            if (!isDown) { return; }

            // tell the browser we'll handle this event
            e.preventDefault();
            e.stopPropagation();

            // get the current mouse position
            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // calculate how far the mouse has moved
            // since the last mousemove event was processed
            var dx = mouseX - lastX;
            var dy = mouseY - lastY;

            // reset the lastX/Y to the current mouse position
            lastX = mouseX;
            lastY = mouseY;

            // change the target circles position by the 
            // distance the mouse has moved since the last
            // mousemove event
            draggingCircle.x += dx;
            draggingCircle.y += dy;

            // redraw all the circles
            drawAll();
        }

        // listen for mouse events
        $("#canvas").mousedown(function (e) { handleMouseDown(e); });
        $("#canvas").mousemove(function (e) { handleMouseMove(e); });
        $("#canvas").mouseup(function (e) { handleMouseUp(e); });
        $("#canvas").mouseout(function (e) { handleMouseUp(e); });

        //////////////////////
        // Utility functions

        function randomColor() {
            return ('#' + Math.floor(Math.random() * 16777215).toString(16));
        }
    }
    // for (let i = 0; i < points.length; i++) {
    //     document.getElementById(`#${i}`).onmousedown = function () {
    //         console.log('salam');
    //     }
    // }
    function ImgOnload() {
        canvas.width = img.width;
        canvas.height = img.height;
        WB.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.removeAttribute("data-caman-id");
    }
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
   
    //#endregion
});

