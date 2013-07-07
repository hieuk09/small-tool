// ==UserScript==
// @name       PivotalTracker link copier
// @namespace  http://www.eastagile.com
// @version    1.3
// @description  Adds a button for quick copying from PT
// @match      https://www.pivotaltracker.com/*/projects/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2012+, Thien Lam
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
    style.innerHTML = ".prompt-box { position: absolute; border: 5px gray solid; padding: 10px 30px; border-radius: 5px; width: 500px; height: 300px; z-index: 99; background: white; text-align: left; "
    + "font-size: 12px; font-weight: normal; z-index: 1001; }"
    + ".copy-textarea { margin-top: 10px; width: 480px; height: 250px; }"
    + ".copy-button {float: left; width: 100px; height: 20px; border: 1px solid #FDA35D; border-radius: 5px; background: #FDA35D; margin-right: 10px; text-align: center; padding-top: 5px;"
    + "font-size: 12px; font-weight: bold; color: white; cursor: pointer; position: absolute; z-index: 1000; right: 30%; top: 80px;}"
    + ".copy-button:hover { border-color: white; border-width: 3px; }"
    + ".close_btn { margin: 10px 20px 20px 0; }"
    + ".prompt-box a {color: #15c; text-decoration: underline;}"
    + ".prompt-box ul li { list-style-type: disc; }";
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

            var ul = $("<UL>");
            ancs.map(function() {
                var story = $(this).closest(".story");
                var item = $("<LI>");
                var link = $("<A>");

                var id = story.attr("class").match(/story_\d+/);
                link.attr("href", "https://www.pivotaltracker.com/story/show/" + id.toString().replace("story_"));
                link.attr("class", "link");
                var storyName = story.find("span.story_name").text();
                link.append(storyName);
                item.append(link);
                ul.append(item);
            });

            ul.attr("id", "content");

            var closeButton = $("<button>");
            closeButton.text("Close");
            closeButton.attr("class", "close_btn");
            $promptBox.append(closeButton);
            closeButton.click(function() {
                $promptBox.remove();
            });

            $promptBox.append(completeString);

            $promptBox.attr("class", "prompt-box");
            $promptBox.css("top", ((document.body.clientHeight - 300) / 2) + "px");
            $promptBox.css("left", ((document.body.clientWidth - 500) / 2) + "px");
            $promptBox.append(ul);
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
