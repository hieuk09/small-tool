// ==UserScript==
// @name       PivotalTracker link copier
// @namespace  http://www.eastagile.com
// @version    1.3
// @description  Adds a button for quick copying from PT
// @match      https://www.pivotaltracker.com/*/projects/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2012+, Thien Lam, Hieu Nguyen
// ==/UserScript==
// access global variable 'app'

main = function() {

    function exec(fn) {
        var script = document.createElement('script');
        script.setAttribute("type", "application/javascript");
        script.textContent = '(' + fn + ')();';
        document.body.appendChild(script); // run the script
        document.body.removeChild(script); // clean up
    }

    // setup styles
    var style = document.createElement('style');
    style.innerHTML = ".prompt-box { position: absolute; border: 5px gray solid; padding: 10px 30px; border-radius: 5px; width: 500px; min-height: 300px; z-index: 99; background: white; text-align: left; "
    + "font-size: 12px; font-weight: normal; z-index: 1001; }"
    + ".copy-textarea { margin-top: 10px; width: 480px; height: 250px; }"
    + ".copy-button {float: left; width: 100px; height: 20px; border: 1px solid #FDA35D; border-radius: 5px; background: #FDA35D; margin-right: 10px; text-align: center; padding-top: 5px;"
    + "font-size: 12px; font-weight: bold; color: white; cursor: pointer; position: absolute; z-index: 1000; right: 30%; top: 80px;}"
    + ".copy-button:hover { border-color: white; border-width: 3px; }"
    + ".close_btn { margin: 10px 20px 20px 0; }"
    + ".prompt-box a {color: #15c; text-decoration: underline;}"
    + ".prompt-box ul li { list-style-type: disc; }"
    + ".prompt-box .header { font-weight: bold; }"
    + ".prompt-box div { padding: 10px 0; }";
    document.body.appendChild(style);

    // add the button
    var copyButton = document.createElement("div");
    copyButton.className = "copy-button";
    copyButton.textContent = "COPY";
    $("body").append(copyButton);
    // when clicking the button
    copyButton.onclick = function() {
        exec(function() {

            var $promptBox = $("<div>");

            var ancs = $("a.selector.selected");
            var completeString = ancs.length == 0 ? "No story selected" : "";

            var $doneUrl = $("<UL>");
            ancs.map(function() {
                var story = $(this).closest(".story");
                var item = $("<LI>");
                var link = $("<A>");

                var id = story.attr("class").match(/story_\d+/);
                link.attr("href", "https://www.pivotaltracker.com/story/show/" + id.toString().replace("story_", ""));
                link.attr("class", "link");
                link.attr("target", "_blank");

                var status = "";
                if (story.hasClass("finished")) {
                    status = "Finished ";
                } else if (story.hasClass("started")) {
                    status = "WIP ";
                } else if (story.hasClass("delivered") || story.hasClass("accepted")) {
                    status = "Delivered ";
                }

                if (status != "") {
                    var storyName = story.find("span.story_name").text();
                    link.append(storyName);
                    item.append(status);
                    item.append(link);
                    $doneUrl.append(item);
                }
            });

            var $toBeDoneUrl = $("<UL>");

            ancs.map(function() {
                var story = $(this).closest(".story");
                var item = $("<LI>");
                var link = $("<A>");

                var id = story.attr("class").match(/story_\d+/);
                link.attr("href", "https://www.pivotaltracker.com/story/show/" + id.toString().replace("story_", ""));
                link.attr("class", "link");
                link.attr("target", "_blank");

                var status = "";
                var storyName = story.find("span.story_name").text();
                if (story.hasClass("started")) {
                    status = "Finished ";
                    link.append(storyName);
                    item.append(status);
                    item.append(link);
                    $toBeDoneUrl.append(item);
                } else if (!story.hasClass("finished") && !story.hasClass("delivered") && !story.hasClass("accepted")) {
                    link.append(storyName);
                    item.append(link);
                    $toBeDoneUrl.append(item);
                }
            });

            var closeButton = $("<button>");
            closeButton.text("Close");
            closeButton.attr("class", "close_btn");
            closeButton.click(function() {
                $("#panels_control .deselect_all").click();
                $promptBox.remove();
            });

            var $helloString = $("<div>").text("Hi, ");
            var $contentBox = $("<div id='content'>");

            $promptBox.attr("class", "prompt-box");
            $promptBox.css("top", ((document.body.clientHeight - 500) / 2) + "px");
            $promptBox.css("left", ((document.body.clientWidth - 500) / 2) + "px");
            $promptBox.append(closeButton);
            $contentBox.append(completeString);
            $contentBox.append($helloString);
            $contentBox.append($("<div class='header'>").text("What has the team done since the last call/email regarding this project?"));
            $contentBox.append($doneUrl);
            $contentBox.append($("<div class='header'>").text("What will the team do between now and next call/email regarding this project?"));
            $contentBox.append($toBeDoneUrl);
            $contentBox.append($("<div class='header'>").text("What impedes the team from performing their work as effectively as possible?"));
            $contentBox.append($("<UL>").append($("<LI>").text("None")));
            $contentBox.append($("<div class='header'>").text("How much time have we spent today?"));
            $contentBox.append($("<UL>").append($("<LI>").text("2 days")));
            $contentBox.append($("<div class='header'>").text("How much time have we spent this week?"));
            var today = new Date();
            var numberOfDays = today.getDay();
            var daysSpentWeek = (numberOfDays * 2).toString() + " days"
            $contentBox.append($("<UL>").append($("<LI>").text(daysSpentWeek)));
            $contentBox.append($("<div class='header'>").text("How much time have we spent this month?"));
            numberOfDays = today.getDate();
            var daysSpentWeek = Math.round(numberOfDays/7*5).toString() + " days"
            $contentBox.append($("<UL>").append($("<LI>").text(daysSpentWeek)));
            $contentBox.append($("<div class='header'>").text("Our team today:"));
            $contentBox.append($("<UL>").append($("<LI>").text("Hieu Nguyen (hieu.nguyen@eastagile.com)")));
            $contentBox.append($("<UL>").append($("<LI>").text("Someone else (someone.else@eastagile.com)")));
            $contentBox.append($("<div>").text("Regards,"));
            $contentBox.append($("<div>").text("The East Agile Team"));
            $promptBox.append($contentBox);
            $("body").append($promptBox);

            $promptBox.append($("<br>"));

            var element = document.getElementById("content");
            var sel = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            sel.removeAllRanges();
            sel.addRange(range);
        });
    }

};

unsafeWindow.addEventListener("load", main);
