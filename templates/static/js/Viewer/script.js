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
    var ClickedId;
    var mousePosition;
    var offset = [0, 0];
    var div;
    var isDown = false;
    var IsRulerBtnActive = false;
    var ISDOWNN;
    var curposX;
    var curposY;


    let fileName = "";
    var pois = [];

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
    console.log(1);
    var Url_SetPoints = res[0]+"//"+res[2]+"/webservice/setPoints/" + res[4] + "/" + res[5] + "/";
    var Url =  res[0]+"//"+res[2]+ '/webservice/getImage/' + res[4] + "/" + res[5] + "/";
    var Url_GetPoint = res[0]+"//"+res[2]+'/webservice/getPoints/' + res[4] + "/" + res[5] + "/";


    
    // set image on canvas:
    img = new Image();
    img.src = Url;
    img.onload = function () {
        ImgOnload();
        // console.log(Url);
    };

    //for show the images on the left side of :

    ShowImgOnTab();

    $("#ruler").click(function (e) {

        IsRulerBtnActive = true;
        // var subHeight=-canvas.height+$('#salam').height();
        // var subWidth=-canvas.width+$('#salam').width();
        context.beginPath();
        context.moveTo(points[i - 2].xpos, points[i - 2].ypos);
        context.lineTo(points[i - 1].xpos, points[i - 1].ypos);

        context.strokeStyle = "green";
        context.stroke();

        context.beginPath();
        context.moveTo(points[i].xpos, points[i].ypos);
        context.lineTo(points[i + 1].xpos, points[i + 1].ypos);
        context.strokeStyle = "green";
        context.stroke();

    });


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



    $(".Erase-btn").click(function (e) {
        Erase();
    });

    $(".getPoints-btn").click(function (e) {
        $.ajax({
            type: "GET",
            url: Url_GetPoint,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log(data);
                var array = JSON.parse(data);
                console.log(array[0][0]);
                var currentHeight = $("#canvas").height();
                var currentWidth = $("#canvas").width();
                var imgHeight = img.height;
                var imgWidth = img.width;
                var scalY = currentHeight / imgHeight;
                var scalX = currentWidth / imgWidth;
                var color = "red";
                var size = "9px";
                for (let f = 0; f < array.length; f++) {
                    points.push({
                        xpos: (array[f][0]),
                        ypos: (array[f][1])
                    });
                }
                for (let g = i; g <= i + array.length; g++) {
                    $("#salam").append(
                        $(`<div class="miniCanvas" id=${g}  ></div>`)
                            .css("position", "absolute")
                            .css("top", points[g].ypos * scalY + "px")
                            .css("left", points[g].xpos * scalX + "px")
                            .css("width", size)
                            .css("height", size)
                            .css("background-color", color)
                            .css("cursor", "move")
                            .css("border-radius", "30px")
                    );
                    document.getElementById(g).addEventListener('mousedown', function (e) {
                        ClickedId = this.id;
                        isDown = true;
                        offset = [
                            this.offsetLeft - e.clientX,
                            this.offsetTop - e.clientY
                        ];
                    }, true);
                    // for set resizable
                    if (g == i + array.length-1 ) {
                        i = g+1 ;
                    }
                }

            },
            failure: function (errMsg) {
                alert(errMsg);
            }
        });
    });
    //#region 

    // for manipulate brightness and contrast by dragging on canvas
    $("#canvas").mousedown(function (e) {
        console.log(e.pageX + " " + e.pageY);
        curposX = e.pageX;
        curposY = e.pageY;
        ISDOWNN = true;
    });
    $("#canvas").mouseup(function () {
        ISDOWNN = false;
    });
    $("#canvas").mousemove(function (e) {
        if (ISDOWNN) {
            if (e.pageX - curposX > 50) {
                if (e.pageY - curposY < 50) {
                    Caman("#canvas", img, function () {
                        this.brightness((e.pageX - curposX) / 250).render();
                    });
                }
            }
            if (e.pageX - curposX < 0) {
                if (e.pageY - curposY < 50) {
                    Caman("#canvas", img, function () {
                        this.brightness((e.pageX - curposX) / 250).render();
                    });
                }
            }
            if (e.pageY - curposY > 50) {
                if (e.pageX - curposX < 50) {
                    Caman("#canvas", img, function () {
                        this.contrast((e.pageY - curposY) / 250).render();
                    });
                }
            }
            if (e.pageY - curposY < -50) {
                if (e.pageX - curposX < 50) {
                    Caman("#canvas", img, function () {
                        this.contrast((e.pageY - curposY) / 250).render();
                    });
                }
            }

        }

    });


    document.addEventListener('mouseup', function () {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function (event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            var currentHeight = $("#canvas").height();
            var currentWidth = $("#canvas").width();
            var imgHeight = img.height;
            var imgWidth = img.width;
            var scalY = currentHeight / imgHeight;
            var scalX = currentWidth / imgWidth;
            points[ClickedId].xpos = Math.round((mousePosition.x + offset[0]) / scalX);
            points[ClickedId].ypos = Math.round((mousePosition.y + offset[1]) / scalY);
            if (IsRulerBtnActive) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, img.width, img.height);
                context.beginPath();
                context.moveTo(points[0].xpos, points[0].ypos);
                context.lineTo(points[1].xpos, points[1].ypos);
                context.moveTo(points[2].xpos, points[2].ypos);
                context.lineTo(points[3].xpos, points[3].ypos);
                // ctx.lineTo(70, 100);
                context.strokeStyle = "green";
                context.stroke();
                // context.beginPath();
                // context.moveTo(points[2].xpos, points[2].ypos);
                // context.lineTo(points[3].xpos, points[3].ypos);
                // context.strokeStyle = "skyBlue";
                // context.stroke();
            }

            console.log(points[ClickedId].xpos + " sss " + points[ClickedId].ypos);
            document.getElementById(`${ClickedId}`).style.left = (mousePosition.x + offset[0]) + 'px';
            document.getElementById(`${ClickedId}`).style.top = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);

    //#endregion


    // set points
    $(".addPoints-btn").click(function (e) {
        for (let i = 0; i < points.length; i++) {

            console.log(points[i].xpos + "   " + points[i].ypos);
        }
        // xpos/scalX
        const csrftoken = getCookie("csrftoken");
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
    function ShowImgOnTab() {
        loop1:
        for (let h1 = 0; h1 <= 10; h1++) {
            var PageURL = "http://172.93.194.118/patient/" + res[4] + "/" + h1 + "/pointsUpdate/"
            function UrlExists(url, cb) {
                jQuery.ajax({
                    url: url,
                    dataType: 'image',
                    type: 'GET',
                    complete: function (xhr) {
                        if (typeof cb === 'function')
                            cb.apply(this, [xhr.status]);
                    }
                });
            }
            UrlExists(`http://172.93.194.118/webservice/getImage/${res[4]}/${h1}/`, function (status) {
                if (status === 200) {
                    $("#London").append(
                        $(`<a  href=http://172.93.194.118/patient/${res[4]}/${h1}/pointsUpdate/ >
                        <img width=240px height=150px style=margin-left:-0.8rem;margin-top:20px;border-radius:5px;  src= http://172.93.194.118/webservice/getImage/${res[4]}/${h1}/ class=${PageURL}></img> </a>`)
                            .css("width", 240 + "px")
                            .css("height", 150 + "px")
                            .css("align-items", "center")
                            .css("margin-left", 0 + "rem")
                            .css("margin-top", 0 + "px")
                            .css("border-radius", 3 + "px")
                            .css("cursor", "move")
                            .css("cursor", "pointer")
                    );

                }
                else {
                    // nothing to do actualy!!!
                }
            });
        }
    }
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
    function undo() {
        $(`#${i - j}`).removeAttr("style");
        j += 1;
        //console.log(j);
    }
    //TODO  : Erase Context path
    function Erase() {
        for (var k = 0; k < points.length; k++) {
            $(`#${k}`).remove();
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height);
    }
    function ProbeOnMainCanvas() {
        //for PunctuationPunctuation on canvas!
        $("#canvas").click(function (ev) {
            var pos = getMousePos(canvas, ev);
            mousePX = pos.x;
            mousePY = pos.y;

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
            var size = "9px";
            XPosition = mousePX;
            YPosition = mousePY;

            if ((XPosition / scalX) >= 0 && (YPosition / scalY) >= 0) {

                points.push({
                    xpos: (XPosition / scalX),
                    ypos: (YPosition / scalY)
                });
                console.log(points[i].xpos + " " + points[i].ypos);

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
                i++;

                document.getElementById(i - 1).addEventListener('mousedown', function (e) {
                    ClickedId = this.id;
                    isDown = true;
                    offset = [
                        this.offsetLeft - e.clientX,
                        this.offsetTop - e.clientY
                    ];
                }, true);
            }
        });


    }
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
    //get header by name
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };

    //#endregion
});

