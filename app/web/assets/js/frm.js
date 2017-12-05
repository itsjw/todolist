require('parsleyjs');
const prototype = require('./tools/prototype');
require('moment');
require('bootstrap4-datetimepicker');


function loadForm($form) {

    prototype.prototype();

    $form.find('.datetimepicker').each(function () {

        let $this = $(this);
        $this.datetimepicker({
                                 format: 'DD-MM-YYYY hh:mm'
                             });

        $this.find('input').click(function () {
            $this.data("DateTimePicker").show();
        });

    });

    $form.find('.form-control').each(function () {

        let $this = $(this);

        $this.parsley()
             .on('field:error', function () {
                 $this.prev('label.plh').addClass('red');
             })
             .on('field:succes', function () {
                 $this.prev('label.plh').removeClass('red');
             });


    });

    $('.save-todo-status').on('click', function () {

        $('#todolistForm').submit();

    });

    let $categorySaveButton = $('.category-save-button');
    $categorySaveButton.hide();
    $('.add-collection-item').on('click', function () {


        $categorySaveButton.hide();
        let checkRemoveButton = setInterval(function () {

            let $removeBtn = $('.remove-collection-item');
            if ($removeBtn.length) {
                clearInterval(checkRemoveButton);
                $categorySaveButton.show();
                $removeBtn.on('click', function () {
                    $categorySaveButton.hide();
                    let totalLeft = $('.remove-collection-item').length;
                    if (totalLeft > 1) {
                        $categorySaveButton.show();
                    }
                });

                $form.find('.datetimepicker').each(function () {

                    let $this = $(this);
                    $this.datetimepicker({
                                             format: 'DD-MM-YYYY hh:mm'
                                         });

                    $this.find('input').click(function () {
                        $this.data("DateTimePicker").show();
                    });

                });

            }
        }, 100);

    });

    $('#content').find('.content').addClass('fadeIn');

    setTimeout(function () {
        $('.alert').fadeOut('slow').remove();
    }, 7000);

}

module.exports = {
    loadFrm: loadForm
};
