// ==UserScript==
// @name       Pivotal Link for commit
// @namespace  http://eastagile.com/
// @version    1.0
// @description  This is use for get the link from story for commit name
// @match      https://www.pivotaltracker.com/*/projects/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @copyright  2013+, Hieu Nguyen
// ==/UserScript==

commitCopier = function() {

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
    + ".commit_link_btn {float: left; width: 100px; height: 20px; border: 1px solid #FDA35D; border-radius: 5px; background: #FDA35D; margin-right: 10px; text-align: center; padding-top: 5px;"
    + "font-size: 12px; font-weight: bold; color: white; cursor: pointer; position: absolute; z-index: 1000; right: 50%; top: 80px;}"
    + ".commit_link_btn:hover { border-color: white; border-width: 3px; }"
    + ".close_btn { margin: 10px 20px 20px 0; }";
    document.body.appendChild(style);

    // add the button
    var commitLinkBtn = document.createElement("div");
    commitLinkBtn.className = "commit_link_btn";
    commitLinkBtn.textContent = "COMMIT LINK";
    $("body").append(commitLinkBtn);
    
    // when clicking
    commitLinkBtn.onclick = function() {
        var $promptBox = $("<div>");

        var ancs = $("a.selector.selected");
        var completeString = ancs.length == 0 ? "No story selected" : "";

        var div = $("<DIV>");
        ancs.map(function() {
            var story = $(this).closest(".story");
            var id = story.attr("class").match(/story_\d+/);
            var link = '[https://www.pivotaltracker.com/story/show/' + id.toString().replace('story_', '') + ']';

            var status = '';
            if (story.is('.feature')) {
                status = '[f] ';
            } else if (story.is('.bug')) {
                status = '[b] ';
            } else if (story.is('.chore')) {
                status = '[ax] ';
            }

            var storyName = story.find("span.story_name").text();
            div.append(status);
            div.append(storyName);
            div.append("<BR/><BR/>");
            div.append(link);
            div.append("<BR/><BR/>");
        });

        div.attr("id", "content");

        var closeButton = $("<button>");
        closeButton.text("Close");
        closeButton.attr("class", "commit_close_btn");
        $promptBox.append(closeButton);
        closeButton.click(function() {
            $("#panels_control .deselect_all").click();
            $promptBox.remove();
        });

        $promptBox.append(completeString);

        $promptBox.attr("class", "prompt-box");
        $promptBox.css("top", ((document.body.clientHeight - 300) / 2) + "px");
        $promptBox.css("left", ((document.body.clientWidth - 500) / 2) + "px");
        $promptBox.append(div);
        $("body").append($promptBox);

        $promptBox.append($("<br>"));

        var element = document.getElementById("content");
        var sel = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        sel.removeAllRanges();
        sel.addRange(range);
    };
};

unsafeWindow.addEventListener("load", commitCopier);