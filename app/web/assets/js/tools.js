const routesjs = require('./routes');
require('parsleyjs');
const formjs = require('./frm');

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

}

function setContent(ajaxContentUrl) {

    const $content = $('#content');

    $content.find('.content').hide();

    $.ajax({
               url: ajaxContentUrl,
               type: 'GET',
               success: function (data) {

                   if (data.redirect) {
                       let method = data.redirectMethod ? data.redirectMethod : 'click';
                       setRoute(data.redirect, method);
                   }

                   $content.html(data);

               }
           }).done(function () {

        routesjs.getRoute(ajaxContentUrl);

        let $form = $('form');
        if ($form.length === 1) {

            formjs.loadFrm($form);

            $('.btn.url').on('click', function () {
                let url = $(this).attr('data-url');
                setRoute(url, 'init');
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
                               // console.log(xhr.status, thrownError);
                           }
                       });
            });

            $('#removeTodo').on('click', function () {

                let categoryId = parseInt($(this).data('category'));
                let todoId = parseInt($(this).data('id'));

                let ajaxUrl = Routing.generate('content_todolist_remove', {
                    category: categoryId,
                    id: todoId
                });

                $.ajax({
                           url: ajaxUrl,
                           type: 'GET',
                           success: function (data) {
                               if (data.redirect) {
                                   $('#removeTodoModal').hide();
                                   window.location.href = data.redirect;
                               }
                           }

                       }).done(function () {
                });

            });
        }
    });
}

function load_data() {

    setRoute(window.location.href, 'init');

    $(document).on('click', '.menu', function (e) {
        e.preventDefault();
        let $this = $(this);
        let url = $this.data('url');
        setRoute(url, $this.data('method'));
    });

}

module.exports = {
    load_data: load_data
};