// ==UserScript==
// @name         LinkedIn Jobs Blocklist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  LinkedIn Jobs Blocklist
// @author       Anthony Attard
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @require      https://git.io/JJt7d
// ==/UserScript==

(function () {
    'use strict';

    var blocklist = [
        "Company 1",
        "Company 2",
        "Company 3"
    ];

    blocklist = blocklist.map(function (item) {
        return item.toLowerCase();
    });

    function filter(jNode) {
        let company = jNode.find('.job-card-container__company-name').text().trim().toLowerCase();
        if (blocklist.includes(company)) {
            console.log('Hide item from company: ' + company);
            jNode.closest(".artdeco-list__item").hide();
        }

        // Debug Section
        // console.log('Total items: ' + $('.job-card-container__company-name').length);
        // console.log('Remaining items: ' + $('.job-card-container__company-name:visible').length);
        // console.log('Hidden items: ' + $('.job-card-container__company-name:hidden').length);
    }

    waitForKeyElements(".job-card-container--clickable", filter);

})();