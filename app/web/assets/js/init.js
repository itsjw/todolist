require('jquery');
require('popper.js');
require('bootstrap');

const toolsjs = require('./tools');

$(document).ready(function () {

    toolsjs.load_data();
    $(window).on('popstate', function () {
        toolsjs.load_data();
    });

});