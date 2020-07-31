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
    var Elements = [];
    let fileName = "";
    var mousePosition;
    var offset = [0, 0];
    var isDown = false;
    var pois = [];

    WB = document.getElementById("WorkBench");
    var canvas = document.getElementById('canvas');
    var salam=document.getElementById("#salam");
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
    var Url_GetPoint = 'http://127.0.0.1:8000/webservice/getPoints/' + res[4] + "/" + res[5] + "/";
    console.log(Url);
    // set image on canvas:
    img = new Image();
    img.src = Url;
    img.onload = function () {
        ImgOnload();
        console.log(Url);

    };
    var currentHeight = $("#canvas").height();
    var currentWidth = $("#canvas").width();
    var imgHeight = img.height;
    var imgWidth = img.width;
    var scalY = currentHeight / imgHeight;
    var scalX = currentWidth / imgWidth;

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
        var aa;
        var bb;
        var cc;
        var dd;
        // len is the count of points
        var len;
        var ll = [];
        var cnt = 0;
        $.ajax({
            type: "GET",
            url: Url_GetPoint,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log(data + " / " + data.length);

                var array = JSON.parse(data);
                console.log(array[0][0]);
                var color = "rgb(248, 248, 91)";
                var size = "7px";
                for (let g = 0; g < array.length; g++) {
                    points.push({
                        xpos: (array[g][0]),
                        ypos: (array[g][1])
                    });
                    $("#salam").append(
                        $(`<div class="miniCanvas" id= ${g}  ></div>`)
                            .css("position", "absolute")
                            .css("top", array[g][1] * scalY + "px")
                            .css("left", array[g][0] * scalX + "px")
                            .css("width", size)
                            .css("height", size)
                            .css("background-color", color)
                            .css("cursor", "move")
                            .css("border-radius", "30px")

                    );
                }

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });



    });

    $(".addPoints-btn").click(function (e) {
        for (let i = 0; i < points.length; i++) {

            console.log(points[i].xpos + "   " + points[i].ypos);
        }
        // xpos/scalX
        const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });
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

    });


    $(window).resize(function () {
        var currentHeight = $("#canvas").height();
        var currentWidth = $("#canvas").width();
        var imgHeight = img.height;
        var imgWidth = img.width;
        var scalY = currentHeight / imgHeight;
        var scalX = currentWidth / imgWidth;


        for (let i = 0; i < points.length; i++) {

            $(`#${i}`)
                .css("top", points[i].ypos * scalY + "px")
                .css("left", points[i].xpos * scalX + "px");
            // //console.log(points[i].xpos + " " + points[i].ypos * currentHeight + "||" + points[i].xpos * window_width + " " + points[i].ypos * window_height);
        }
    });

    //#region for undo
    $("#undo").click(function (e) {
        undo();
    });
    $("#redo").click(function (e) {
        redo();
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
        if (i - j > 0) {
            j += 1;
            console.log(j);
        }
    }
    function redo() {
        $("#salam").append(
            $(`<div class="miniCanvas" id= ${j}  ></div>`)
                .css("position", "absolute")
                .css("top", points[j].ypos + "px")
                .css("left", points[j].xpos + "px")
                .css("width", size)
                .css("height", size)
                .css("background-color", color)
                .css("cursor", "move")
                .css("border-radius", "30px")

        );
    }
    function Erase() {
        for (var k = 0; k < points.length; k++) {
            $(`#${k}`).remove();
        }
    }
    function ProbeOnMainCanvas() {
        //for PunctuationPunctuation on canvas!
        $("#canvas").click(function (ev) {
            var pos = getMousePos(canvas, ev);
            mousePX = pos.x;
            mousePY = pos.y;
            // console.log(mousePX);
            // console.log(mousePY);

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




            var color = "rgb(248, 248, 91)";
            var size = "7px";
            XPosition = mousePX;
            YPosition = mousePY;

            points.push({
                xpos: (XPosition / scalX),
                ypos: (YPosition / scalY)
            });

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
            // Elements[i] = $(`#${i}`);
            // $(".miniCanvas").mousedown(function (e) {
            //     var id = this.id;
            //     var ele=$(`#${id}`);
            //     isDown = true;
            //     offset = [
            //         ele.offsetLeft - e.clientX,
            //         ele.offsetTop - e.clientY
            //     ];
            // });
            // $(".miniCanvas").mouseup(function () { 
            //     isDown=false;
            // });
            // $(".miniCanvas").mousemove(function (e) { 
            //     e.preventDefault();
            //     if (isDown ) {
            //         mousePosition = {

            //             x : e.clientX,
            //             y : e.clientY

            //         };

            //         var id = this.id;

            //         $(`#${id}`)
            //         .css("left", (mousePosition.x + offset[0]) + 'px')
            //         .css("top",(mousePosition.y + offset[1]) + 'px');
            //         console.log(mousePosition.x+" "+mousePosition.y);


            //     }

            // });
             
            // var m =document.getElementById("0");
            //  m.addEventListener('mousedown', mouseDown, false);
            //  $(window).addEventListener('mouseup', mouseUp, false);

            i++;




            // for (let i = 0; i < points.length; i++) {
            //     console.log(points[i].xpos+" "+points[i].ypos);


            // }


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

