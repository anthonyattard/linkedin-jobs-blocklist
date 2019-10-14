// ==UserScript==
// @name         LinkedIn Jobs Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LinkedIn Jobs Blacklist
// @author       Anthony Attard
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// ==/UserScript==

(function() {
  'use strict';

  var blacklist = [
    "Company 1",
    "Company 2",
    "Company 3"
  ];

  blacklist = blacklist.map(function(item) {
      return item.toLowerCase();
  });


  function filter() {
   // console.log(blacklist);
    $('.job-card-search__company-name-link').each(function( index ) {
        let theVal = $( this ).text().trim().toLowerCase();
        //console.log(theVal);
        if(blacklist.includes( theVal ) ) {
            console.log('Hid item from company: ' + theVal);
            $( this ).closest(".artdeco-list__item").hide();
        }
    });

    console.log('Total items: ' + $('.job-card-search__company-name-link').length);
    console.log('Remaining items: ' + $('.job-card-search__company-name-link:visible').length);
    console.log('Hidden items: ' + $('.job-card-search__company-name-link:hidden').length);
  }


  /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
      that detects and handles AJAXed content.

      Usage example:

          waitForKeyElements (
              "div.comments"
              , commentCallbackFunction
          );

          //--- Page-specific function to do what we want when the node is found.
          function commentCallbackFunction (jNode) {
              jNode.text ("This comment changed by waitForKeyElements().");
          }

      IMPORTANT: This function requires your script to have loaded jQuery.
  */
//  waitForKeyElements (".ember-view", filter);
//  waitForKeyElements (".artdeco-list__item", filter);
  waitForKeyElements (".job-card-search--two-pane", filter);



  function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
  ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                          .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
  }
})();