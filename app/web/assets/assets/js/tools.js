const routesjs = require('./routes');
require('parsleyjs');
const formjs = require('./frm');

function open_close_menu(action) {

    const $main_menu_wrap = $('#main_menu_wrap'),
          $main_menu_btn  = $('#main_menu_btn'),
          $nav            = $('#nav_sm'),
          $content        = $('#content');

    if (action === 'open') {
        $main_menu_wrap.find('.wrap1').width('180px');
        $main_menu_wrap.find('.wrap3').addClass('open');
        $main_menu_btn.hide();
        $nav.animate({paddingLeft: '280px'});
        $content.animate({paddingLeft: '180px'});
    }

    if (action === 'close') {
        $content.animate({'paddingLeft': '0'});
        $nav.animate({'paddingLeft': '100px'});
        $main_menu_wrap.find('.wrap3').removeClass('open');
        $main_menu_wrap.find('.wrap1').width(0);
        $main_menu_btn.show('slow');
    }

}

function setRoute(url, method) {

    let routesVars = routesjs.getRoute(url);

    let ajaxContentUrl = routesVars.ajaxContentUrl;
    let ajaxMenuUrl = routesVars.ajaxMenuUrl;

    let currentUrl = window.location.href;
    if (url && currentUrl !== url) {
        history.pushState({}, '', url);
    }
    if (ajaxContentUrl) {
        if (method === 'init') {

            $.ajax({
                       url: ajaxMenuUrl,
                       type: 'GET',
                       success: function (data) {
                           $('#menu').html(data);
                       }

                   }).done(function () {

                open_close_menu('close');
                setContent(ajaxContentUrl);
            });

        } else {

            setContent(ajaxContentUrl);
        }
    }
}

/**
 * @param data
 * @param data.message
 * @param data.redirect
 * @param data.redirectMethod
 * @param data.flash
 * @param data.errors
 * @param data.errors.errorId
 * @param data.errors.errorFieldClass
 * @param data.errors.errorMessage
 */
function setAjaxSuccesResponse(data) {

    const $body_content = $('#body_content'),
          $form         = $('form');

    if (data.errors) {
        let errorId         = data.errors.errorId,
            errorFieldClass = data.errors.errorFieldClass,
            errorMessage    = data.errors.errorMessage;
        let $errorContainer = $form.find('.error-' + errorId);
        $errorContainer.each(function () {
            let $errorField = $(this).find('.' + errorFieldClass);
            $errorField.parsley().addError('custom-error-message', {message: errorMessage});
        });
    }

    if (data.redirect) {
        let method = data.redirectMethod ? data.redirectMethod : 'click';
        setRoute(data.redirect, method);
    }

    if (data.flash) {
        let flashData = data.flash,
            label     = flashData[0],
            message   = flashData[1];
        $body_content.append('<div class="alert alert-' + label + '">' + message + '</div>');
    }

}

function setContent(ajaxContentUrl) {

    const $content = $('#content');

    $content.find('.content').hide();

    $.ajax({
               url: ajaxContentUrl,
               type: 'GET',
               success: function (data) {

                   $content.html(data);

               }
           }).done(function () {

        routesjs.getRoute(ajaxContentUrl);

        // $('body').bootstrapMaterialDesign();

        let $form = $('form');
        if ($form.length === 1) {

            formjs.loadFrm($form);

            $('.btn.url').on('click', function () {
                let url = $(this).attr('data-url');
                setRoute(url, 'click');
            });

            $form.parsley();

            $form.on('submit', function (e) {

                e.preventDefault();

                $form.parsley().validate();

                $.ajax({
                           url: $form.attr('action'),
                           data: $form.serialize(),
                           type: 'POST',
                           dataType: 'json',
                           success: function (data) {
                               setAjaxSuccesResponse(data);
                           },
                           error: function (xhr, ajaxOptions, thrownError) {
                               console.log(xhr.status, thrownError);
                           }
                       });
            });
        }
    });
}


function init() {

    const $main_menu_wrap = $('#main_menu_wrap'),
          $main_menu_btn  = $('#main_menu_btn');

    open_close_menu('close');

    $main_menu_btn.on('click', function () {
        open_close_menu('open');
    });

    $(document).on('click', function (e) {
        const target = e.target,
              $wrap1 = $main_menu_wrap.find('.wrap1 *'),
              $btn   = $main_menu_btn.find('*');
        if (!$(target).is($wrap1) && !$(target).is($btn) && $wrap1.width !== 0) {
            open_close_menu('close');
        }
    });

    setRoute(window.location.href, 'init');

    $(document).on('click', '.menu', function (e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.data('url');
        setRoute(url, $this.data('method'));
    });

}


function load_data() {

    $('#body_loaded').promise().done(function () {
        init();
    });

}


module.exports = {
    load_data: load_data
};