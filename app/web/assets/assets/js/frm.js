require('parsleyjs');
const Clipboard = require('clipboard');
const prototype = require('./tools/prototype');

jQuery.fn.extend({
                     autoHeight: function () {
                         function autoHeight_(element) {
                             return jQuery(element)
                                 .addClass('autoHeight')
                                 .css({'height': 'auto', 'overflow-y': 'hidden'})
                                 .height(element.scrollHeight);
                         }

                         return this.each(function () {
                             autoHeight_(this).on('input', function () {
                                 autoHeight_(this);
                             });
                         });
                     }
                 });

const eventNames = {
    'WebkitAnimation': 'webkit',
    'MozAnimation': 'moz',
    'animation': '',
    'OAnimation': 'o',
    'MsAnimation': 'MS'
};

const onAnimationStart = ({target, animationName}) => {
    switch (animationName) {
        case 'onAutoFillStart':
            $(target).prev('label.plh').addClass('active').removeClass('red');
            return;
        case 'onAutoFillCancel':
            $(target).prev('label.plh').removeClass('active');
            return;
    }
};

//label control
//add remove active > autofill
function prefixedEventListener(element, type, callback) {
    for (let name in eventNames) {
        let prefix = eventNames[name];
        if (element.style[name] !== undefined) {
            let evtName = type.toLowerCase();
            if (prefix.length > 0) {
                evtName = prefix + type;
            }
            element.addEventListener(evtName, callback, false);
            break;
        }
    }
}

function loadForm($form) {

    prototype.prototype();

    // $('label.plh').removeClass('red');

    $form.find('.form-control').each(function () {

        let $this = $(this);
        let thisid = $this.attr('id');


        // $this.val().length > 0
        //     ?
        //     $this.prev('label.plh').addClass('active')
        //     :
        //     $this.prev('label.plh').removeClass('active');

        //add active > keydown paste
        // $this.on('keydown paste', function () {
        //     $(this).prev('label.plh').addClass('active').removeClass('red');
        // });

        //add remove active > autofill
        // const thisElement = document.querySelector('#' + thisid);
        // prefixedEventListener(thisElement, "AnimationStart", onAnimationStart);

        //remove active > change keyup
        // $this.on('change keyup', function () {
        //     if ($this.attr('required') && $this.val() === '') {
        //         $(this).prev('label.plh').removeClass('active');
        //     }
        // });

        $this.parsley()
             .on('field:error', function () {
                 $this.prev('label.plh').addClass('red');
             })
             .on('field:succes', function () {
                 $this.prev('label.plh').removeClass('red');
             });

    });

    $form.find('textarea').autoHeight();

    // $('.copy').tooltip({
    //                        trigger: 'click',
    //                        placement: 'right',
    //                        html: true
    //                    });

    let clipboard = new Clipboard('.copy');

    clipboard.on('success', function (e) {

        // $(e.trigger).tooltip('hide').attr('data-original-title', 'copied<br>' + e.text).tooltip('show');

        // setTimeout(function () {
        //     $(e.trigger).tooltip('hide');
        // }, 1000);
    });

    $('.add-collection-item').on('click', function () {

        $('body').animate({scrollTop: $(document).height()}, 1200);

        setTimeout(function () {
            $('textarea').not('.autoHeight').autoHeight();
        }, 250);
    });

    $('.filter').on('keyup', function () {
        let value = $(this).val().toLowerCase();
        $('#filterContainer').find('.row').filter(function () {
            let $thisRow = $(this);
            let textIndex = $thisRow.text().toLowerCase().indexOf(value);
            $thisRow.toggle(textIndex > -1);
        });
    });

    $('#content').find('.content').addClass('fadeIn');

    setTimeout(function () {
        $('.alert').fadeOut('slow').remove();
    }, 7000);

}

module.exports = {
    loadFrm: loadForm
};
