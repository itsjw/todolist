// (function ($) {

// 'use strict';


;(function (mwd_transform_elements) {

    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["jquery",
                   "jquery-ui",
                   "jquery-ui/ui/widgets/mouse",
                   "jquery-ui/ui/widgets/selectmenu",
                   "jquery-ui/ui/widgets/autocomplete",
                   "jquery-ui/ui/widgets/datepicker",
                   "jquery-ui/ui/widgets/progressbar",
                   "jquery-ui/ui/widgets/slider",
                   "jquery-ui/ui/widgets/menu"
               ], function () {
            // "/home/marja/Mwd/administratie/app/node_modules/jquery-ui"
            // app/node_modules/jquery-ui/ui/widget.js
            // /home/marja/Mwd/administratie/app/node_modules/jquery-ui/ui/widget.js
            mwd_transform_elements(window.jQuery, window, document);

            // require('jquery-ui/ui/widgets/autocomplete');
            // require("jquery-ui/ui/widgets/datepicker");
            // require("jquery-ui/ui/widgets/progressbar");
            // require("jquery-ui/ui/widgets/slider");
            // require("jquery-ui/ui/widgets/menu");
        });
    } else {
        // Browser globals
        mwd_transform_elements(window.jQuery, window, document);
    }

}
(function ($, window, document, undefined) {

    $.widget('mwd_transform_elements', {

        options: {
            validationType: 'mwd_error_title',
            txtRequired: 'This is a required field - please fill in a value',
            txtRequiredCheckbox: 'Please select this option',
            txtRequiredRadio: 'Please select one of the options',
            txtRequiredFile: 'Please select a file',
            txtMinlength: 'The mimimum amount of characters is ',
            txtMaxlength: 'The maximum amount of characters is ',
            txtPattern: 'Please match the requested format',
            txtPatternEmail: 'Please fill in a valid email address',
            txtPatternUrl: 'Please fill in a valid url (http://...)',
            txtPatternTel: 'Please fill in a valid telephonenumber',
            txtPatternNumber: 'Please fill in a valid number',
            txtButtonFile: 'Browse',
            txtButtonFileCancel: 'Cancel',
            onElementNumber: null,
            onElementColor: null,
            onElementDate: null,
            elementDateOptions: {},
            onElementTime: null,
            onElementClick: null,
            onElementChange: null,
            onElementLoad: null,
            onElementProgress: null,
            onElementOutput: null,
            onElementText: null,
            onElementSelect: null,
            onElementRadio: null,
            onElementButton: null
        },

        _create: function () {
            let element     = this.element,
                thisid      = element.attr('id'),
                thisname    = element.attr('name'),
                thistagname = (element.prop('tagName')).toLowerCase();
            let thistype = thistagname;
            if (thistagname === 'input') {
                thistype = element.attr('type');
                if (element.attr('data-type')) {
                    thistype = element.attr('data-type');
                }
            }
            if (thistype === 'hidden') {
            } // jshint ignore:line
            else {
                element.addClass('mwd');
                if (!thisid || thisid === undefined || thisid === '') {
                    element.uniqueId();
                    thisid = element.attr('id');
                }
                if (!thisname || thisname === undefined || thisname === '') {
                    thisname = thisid;
                    element.attr('name', thisname);
                }
                if (!thistype || thistype === undefined || thistype === '') {
                    thistype = 'text';
                    if (thistagname === 'input') {
                        element.attr('type', 'text');
                    }
                }
            }
            this.mwd_id = thisid;
            this.mwd_element = element;
            this.mwd_type = thistype;

        },

        _destroy: function () {

            //console.log('giro destroy');
            //let containerid = '#mwd_'+ this.mwd_id;
            //let parent = $(containerid).parent();
            //let element = this.mwd_element;
            //element.removeClass('mwd_destroy');
            //element.removeClass('mwd_input');
            //element.removeClass('mwd_button');
            //element.removeClass('mwd');
            //element.removeClass('mwd_' + this.mwd_type);
            //let clone = element.clone();
            //clone.appendTo(parent);
            //console.log('giro destroy ' + containerid);
            //$(containerid).remove();
            //this._create();


        },

        _init: function () {
            let element = this.mwd_element;
            if (element.hasClass('mwd_destroy')) {
                this._destroy();
            }
            else if (this.mwd_type === 'hidden') {
            } // jshint ignore:line
            else if (element.hasClass('mwd_input') || element.hasClass('mwd_button')) {
                this._create();
            } else {
                element.addClass('mwd_' + this.mwd_type);
                if (element.hasClass('mwd_submit')) {
                    element.addClass('mwd_button');
                }
                else if (element.hasClass('mwd_reset')) {
                    element.addClass('mwd_button');
                }
                else if (element.hasClass('mwd_button')) {
                } // jshint ignore:line
                else if (element.hasClass('mwd_image')) {
                    element.addClass('mwd_button');
                }
                else {
                    element.addClass('mwd_input');
                }
                this._createMwdElement();
            }
        },

        _createMwdElement: function () {
            let element = this.mwd_element;
            element.wrap('<div id="mwd_' + this.mwd_id + '" class="mwd_element_wrapper mwd_wrapper_' + this.mwd_type + '">')
                   .before('<div id="mwd_info_' + this.mwd_id + '" class="mwd_info"></div>')
                   .wrap('<div id="mwd_' + this.mwd_type + '_' + this.mwd_id + '" class="mwd_wrapper">')
                   .data({
                             'placeholder': element.attr('placeholder'),
                             'minlength': element.attr('minlength'),
                             'maxlength': element.attr('maxlength'),
                             'pattern': element.attr('pattern'),
                             'list': element.attr('list'),
                             'size': element.attr('size'),
                             'type': this.mwd_type,
                             'z-index': element.css('z-index')
                         })
                   .removeAttr('placeholder minlength maxlength pattern list size');
            this._on('#mwd_' + this.mwd_id, {
                                                click: this._handleClick
                                            });
            this._on('#' + this.mwd_id, {
                                            change: this._handleChange
                                        });
            //console.log('create');

            //thisfrmid =  element.closest('form').attr('id'),

            this._styleTheElement();
            this._updateInfobox();
        },


        _setOptions: function () {
            this._superApply(arguments);
            this._updateInfobox();
        },

        _setOption: function (key, value) {

            if (key === 'txtButtonFile') {
                //let wrapper = $('#mwd_' + this.mwd_id);
                $('#mwd_' + this.mwd_id).find('.mwd_file_btn').html(value);
            }
            if (key === 'txtButtonFileCancel') {
                //let wrapper = $('#mwd_' + this.mwd_id);
                $('#mwd_' + this.mwd_id).find('.mwd_file_cancel').attr('title', value);
            }
            this._super(key, value);
        },

        _handleClick: function () {
            this._trigger('onElementClick');
        },

        _handleChange: function () {
            this._trigger('onElementChange');
        },

        _styleTheElement: function () {
            let thisinput = this,
                element   = this.mwd_element,
                thistype  = this.mwd_type,
                wrapper   = $('#mwd_' + this.mwd_id);
            // apply nessecary classes
            if (element.prop('disabled')) {
                wrapper.addClass('mwd_disabled');
            }
            else {
                wrapper
                    .on('click', function () {
                        $('.mwd_element_wrapper').each(function () {
                            if ($(this).hasClass('mwd_focus')) {
                                $(this).removeClass('mwd_focus').trigger('mwd_focusout');
                            }
                        });
                        $(this).addClass('mwd_focus')
                               .trigger('mwd_focusin');
                        //noinspection BadExpressionStatementJS,JSHint
                        thisinput.options.onElementClick;
                    })
                    .hover(
                        function () {
                            $(this).addClass('mwd_hover');
                        },
                        function () {
                            $(this).removeClass('mwd_hover');
                        }
                    )
                    .focusin(function () {
                        wrapper.trigger('click');
                    })
                    .bind('mwd_focusin mwd_focusout');
                //noinspection JSValidateTypes
                wrapper.children().addClass('mwd_' + thistype);
                //noinspection JSValidateTypes
                wrapper.children().on('click', function () {
                    wrapper.addClass('mwd_focus');
                });
                if (element.prop('autofocus')) {
                    wrapper.trigger('click');
                    //console.log('autofocus');
                }
                if (element.prop('readonly')) {
                    wrapper.addClass('mwd_readonly');
                }
            }
            //set input
            if (element.hasClass('mwd_input')) {
                if (thistype === 'text' || thistype === 'password' || thistype === 'email' || thistype === 'url' || thistype === 'tel' || thistype === 'search') {
                    this._inputText();
                }
                if (thistype === 'checkbox') {
                    this._inputCheckbox();
                }
                if (thistype === 'radio') {
                    this._inputRadio();
                }
                if (thistype === 'file') {
                    this._inputFile();
                }
                if (thistype === 'textarea') {
                    this._inputTextarea();
                }
                if (thistype === 'select') {
                    this._inputSelect();
                }
                if (thistype === 'date' || thistype === 'time' || thistype === 'datetime' || thistype === 'datetime-local' || thistype === 'month' || thistype === 'week') {
                    this._inputDate();
                }
                if (thistype === 'number') {
                    this._inputNumber();
                }
                if (thistype === 'range') {
                    this._inputRange();
                }
                if (thistype === 'meter') {
                    this._inputMeter();
                }
                if (thistype === 'progress') {
                    this._inputPogress();
                }
                if (thistype === 'output') {
                    this._inputOutput();
                }
                if (thistype === 'color') {
                    this._inputColor();
                }
            }
            //set button
            if (element.hasClass('mwd_button')) {
                this._buttonActions();
            }
        },

        //onElementClick: function() {
        //function onElementClick() {
        //	console.log('click');
        //},

        _buttonActions: function () {
            let element  = this.mwd_element,
                thistype = this.mwd_type,
                findfrm  = element.closest('form').length;
            if (findfrm === 0) {
                console.log('there is no form element'); // jshint ignore:line
            }
            else if (thistype === 'submit' || thistype === 'image' || element.hasClass('submit')) {
                let bntfrmmethod  = element.attr('formmethod'),
                    bntfrmtarget  = element.attr('formtarget'),
                    bntfrmenctype = element.attr('formenctype'),
                    bntfrmaction  = element.attr('formaction'),
                    thisfrmid     = element.closest('form').attr('id'),
                    bntfrmid      = element.attr('form');
                if (bntfrmid) {
                    thisfrmid = bntfrmid;
                }
                if (!thisfrmid) {
                    //noinspection JSDuplicatedDeclaration
                    let thisfrmx = element.closest('form');
                    let newid = thisfrmx.uniqueId();
                    thisfrmx.attr('id', newid.id);
                    thisfrmid = newid.id;
                }
                let thisfrm = $('#' + thisfrmid);
                thisfrm.attr('novalidate', '');
                element.click(function (e) {
                    e.preventDefault();
                    if (bntfrmmethod) {
                        thisfrm.attr('method', bntfrmmethod);
                    }
                    if (bntfrmtarget) {
                        thisfrm.attr('target', bntfrmtarget);
                    }
                    if (bntfrmenctype) {
                        thisfrm.attr('enctype', bntfrmenctype);
                    }
                    if (bntfrmaction) {
                        thisfrm.attr('action', bntfrmaction);
                    }
                    let errorfields = 0;
                    thisfrm.find('.mwd_input').each(function () {
                        $(this).trigger('blur');
                        let thisid   = $(this).attr('id'),
                            thistest = mwd_test_value(thisid);
                        if (thistest === false) {
                            errorfields++;
                        }
                        //console.log('mwd_input ' + thistest + ' ' +thisid + ' errorfields: ' + errorfields);
                    });
                    element.attr('data-errors', errorfields);
                    //console.log(errorfields + ' ' + thistype + ' ' + thisfrmid);
                    if (errorfields === 0) {
                        if (thistype === 'submit' || thistype === 'image') {
                            thisfrm.submit(function (ev) {
                                if (element.hasClass('submit')) {
                                    ev.preventDefault();
                                }
                            });
                        }
                        thisfrm.find('.mwd_info').removeClass('mwd_info_help mwd_info_oke');
                    }
                    if (errorfields > 0) {
                        thisfrm.find('.mwd_info_error_init').addClass('mwd_info_error').removeClass('mwd_info_error_init mwd_info_help mwd_info_oke');
                        return false;
                    }
                    //console.log('errorfields: ' + errorfields);
                });
            }
            this._trigger('onElementButton');
        },


        _inputText: function () {
            let element = this.mwd_element;
            if (element.data('list')) {
                this._createAutocomplete();
            }
            if (element.data('placeholder')) {
                this._setPlaceholder();
            }
            this._validateInput();
            this._trigger('onElementText');
        },

        _inputCheckbox: function () {
            let element = this.mwd_element,
                wrapper = $('#mwd_' + this.mwd_id),
                cb      = this;
            cb._setCheckbox();
            if (element.prop('disabled') || element.prop('readonly')) {
            } // jshint ignore:line
            else {
                wrapper.on('click', function () {
                    let cb_state = element.prop('checked');
                    if (cb_state === true) {
                        element.prop('checked', false);
                    }
                    else {
                        element.prop('checked', true);
                    }
                    cb._setCheckbox();
                });
                if (element.prop('required')) { // jshint ignore:line
                    //this._validateInput();
                }
            }
        },

        _setCheckbox: function () {
            let element  = this.mwd_element,
                wrapper  = $('#mwd_' + this.mwd_id),
                cb_state = element.prop('checked');
            //console.log(element.prop('checked'));
            if (cb_state === true) {
                wrapper.addClass('mwd_checkbox_checked').removeClass('mwd_checkbox_unchecked');
            }
            else {
                wrapper.removeClass('mwd_checkbox_checked').addClass('mwd_checkbox_unchecked');
            }
            if (element.prop('required')) {
                this._validateInput();
            }
        },

        _inputRadio: function () {
            let element  = this.mwd_element,
                wrapper  = $('#mwd_' + this.mwd_id),
                r        = this,
                thisname = element.attr('name');
            r._setRadiobox();
            if (element.prop('disabled')) {
            } // jshint ignore:line
            else {
                wrapper.on('click', function () {
                    $('input[name="' + thisname + '"]').closest('.mwd_wrapper_radio').removeClass('mwd_radio_checked').addClass('mwd_radio_unchecked');
                    element.prop('checked', true).trigger('change');
                    r._setRadiobox();
                });
                if (element.prop('required')) {
                    this._validateInput();
                }
            }
            $('input[name=\'' + thisname + '\']').not('.mwd').click(function () {
                $('input[name="' + thisname + '"]').closest('.mwd_wrapper_radio').removeClass('mwd_radio_checked').addClass('mwd_radio_unchecked');
            });
            this._trigger('onElementRadio');
        },

        _setRadiobox: function () {
            let element  = this.mwd_element,
                wrapper  = $('#mwd_' + this.mwd_id),
                cb_state = element.prop('checked');
            if (cb_state === true) {
                wrapper.addClass('mwd_radio_checked').removeClass('mwd_radio_unchecked');
            }
            else {
                wrapper.removeClass('mwd_radio_checked').addClass('mwd_radio_unchecked');
            }
        },

        _inputFile: function () {
            let element = this.mwd_element,
                thisid  = this.mwd_id;
            //wrapper = $('#mwd_' + thisid);
            element
                .attr('title', ' ')
                .before('<div id="mwd_placeholder_' + thisid + '" class="mwd_placeholder"></div>')
                .after('<div id="mwd_file_cancel_' + thisid + '" class="mwd_file_cancel" title="' + this.options.txtButtonFileCancel + '"></div><div class="mwd_file_btn">' + this.options.txtButtonFile + '</div>');
            if (element.prop('disabled')) {
            } // jshint ignore:line
            else {
                $('#mwd_file_cancel_' + thisid).off('click').click(function () {
                    $('#mwd_placeholder_' + thisid)
                        .removeClass()
                        .addClass('mwd_placeholder')
                        .html('');
                    element.wrap('<form>').closest('form').get(0).reset();
                    element.unwrap();
                    $(this).hide();
                });
                element.on('change', function () {
                    let files     = element[0].files,
                        filenames = [];
                    for (let i = 0; i < files.length; i++) {
                        filenames.push(' ' + files[i].name);
                    }
                    let file_name = element.val().split(/\\/).pop();
                    if (file_name !== '') {
                        let file_ext = 'mwd-ext-' + file_name.split('.').pop().toLowerCase();
                        $('#mwd_placeholder_' + thisid)
                            .removeClass()
                            .addClass('mwd_placeholder mwd-ext-x ' + file_ext)
                            .html(filenames);
                        $('#mwd_file_cancel_' + thisid).show();
                    }
                });
                if (element.prop('required')) {
                    this._validateInput();
                }
            }
        },

        _inputTextarea: function () {
            let element = this.mwd_element,
                thisid  = this.mwd_id,
                wrapper = $('#mwd_' + thisid),
                ta      = this;
            if (element.attr('resize') === 'false') {
            } // jshint ignore:line
            else {
                let wrw    = wrapper.width(),
                    wrh    = wrapper.height(),
                    wrwcss = wrapper.css('width'),
                    wrhcss = wrapper.css('height');
                if (wrwcss.match('%')) {
                    wrw = wrapper.parent().width();
                }
                if (wrhcss.match('%')) {
                    wrh = wrapper.parent().height();
                }
                //console.log(wrhcss);
                element
                    .width(wrw)
                    .height(wrh);

                let wrapper_minheight   = parseInt(wrapper.css('minHeight')),
                    wrapper_maxheight   = parseInt(wrapper.css('maxHeight')),
                    wrapper_minwidth    = parseInt(wrapper.css('minWidth')),
                    wrapper_maxwidth    = parseInt(wrapper.css('maxWidth')),

                    //w1 = element.css('width'),
                    //w2 = element.width(), // width - padding - border
                    //w3 = element.outerWidth(),// width + padding + border
                    //w4 = element.outerWidth(true),// width + padding + border + margin
                    //w5 = element.innerWidth(), // width + padding - border

                    textarea_min_height = wrh,
                    textarea_max_height = 99999,
                    textarea_min_width  = wrw,
                    textarea_max_width  = wrw;
                if (wrapper_minheight > 0) {
                    textarea_min_height = wrapper_minheight;
                }
                if (wrapper_maxheight > 0) {
                    textarea_max_height = wrapper_maxheight;
                }
                if (wrapper_minwidth > 0) {
                    textarea_min_width = wrapper_minwidth;
                }
                if (wrapper_maxwidth > 0) {
                    textarea_max_width = wrapper_maxwidth;
                }

                let ta_width       = element.width(),
                    ta_innerWidth  = element.innerWidth(),
                    ta_padding_w   = ta_innerWidth - ta_width - 5,
                    ta_height      = element.height(),
                    ta_innerHeight = element.innerHeight(),
                    ta_padding_h   = ta_innerHeight - ta_height;

                //console.log(wrh + ' ' + ta_height + ' ' + ta_innerHeight + ' ' + ta_padding_h + ' ' + element.height() + ' --- '
                //		+ wrw + ' ' + ta_width + ' ' + ta_innerWidth + ' ' + ta_padding_w + ' ' + element.width() + ' ');

                element
                    .on('focusin', function () {
                        wrapper.addClass('mwd_focus').trigger('mwd_focusin');
                        ta._ResizeTextarea();
                    })
                    .on('keyup paste', function () {
                        ta._ResizeTextarea();
                    }).data({
                                'ta_width': ta_width,
                                'ta_padding_w': ta_padding_w,
                                'ta_minw': textarea_min_width,
                                'ta_maxw': textarea_max_width,
                                'ta_height': ta_height,
                                'ta_padding_h': ta_padding_h,
                                'ta_minh': textarea_min_height,
                                'ta_maxh': textarea_max_height
                            })
                    .width(wrw - ta_padding_w + scrollbar_size)
                    .height(wrh - ta_padding_h)
                    .removeAttr('cols rows wrap');
                $('#mwd_textarea_' + thisid)
                    .width(wrw - ta_padding_w)
                    .height(wrh - ta_padding_h);

                //let opts_resize = {
                //	minHeight: textarea_min_height,
                //	maxHeight: textarea_max_height,
                //	minWidth: textarea_min_width,
                //	maxWidth: textarea_max_width,
                //	alsoResize: '#' + thisid + ', #mwd_textarea_' + thisid
                //};
                //wrapper.resizable(opts_resize);
                //wrapper.find('.ui-resizable-handle').css('z-index', parseInt(element.css('z-index')) + 1).addClass('mwd_resizehandle');

            }
            if (element.data('placeholder')) {
                this._setPlaceholder();
            }
            this._validateInput();
        },

        _ResizeTextarea: function () {
            let element           = this.mwd_element,
                thisid            = this.mwd_id,
                wrapper           = $('#mwd_' + thisid),
                value_length      = element.val().length,
                outer_width       = element.outerWidth(),
                this_value_length = 0,
                this_outer_width  = 0;
            if (value_length !== this_value_length || outer_width !== this_outer_width) {
                let ta_padding_h    = element.data('ta_padding_h'),
                    ta_padding_w    = element.data('ta_padding_w'),
                    ta_minh         = element.data('ta_minh'),
                    ta_maxh         = element.data('ta_maxh'),
                    ta_maxw         = element.data('ta_maxw'),
                    ta_scrollHeight = element.prop('scrollHeight');
                if (ta_scrollHeight <= ta_minh) {
                } // jshint ignore:line
                else if (ta_scrollHeight > ta_maxh) {
                    element
                        .width(ta_maxw - ta_padding_w + scrollbar_size)
                        .height(ta_maxh - ta_padding_h);
                    $('#mwd_textarea_' + thisid)
                        .width(ta_maxw - ta_padding_w)
                        .height(ta_maxh - ta_padding_h);
                    wrapper
                        .width(ta_maxw)
                        .height(ta_maxh);
                }
                else {
                    element
                        .width(ta_maxw - ta_padding_w + scrollbar_size)
                        .height(0);
                    ta_scrollHeight = element.prop('scrollHeight');
                    let ta_newheight = ta_scrollHeight - ta_padding_h;
                    element.height(ta_newheight);
                    wrapper
                        .animate({height: ta_scrollHeight}, 'fast');
                    $('#mwd_textarea_' + thisid)
                        .width(ta_maxw - ta_padding_w)
                        .height(ta_newheight);
                }
                //this_value_length = value_length;
                //this_outer_width = outer_width;
            }

            //console.log(value_length + ' ' + this_value_length + ' ' + outer_width + ' ' + this_outer_width + ' ' + ta_padding_h + ' ' + ta_width + ' ' + ta_scrollHeight);
        },


        _inputSelect: function () {
            let element   = this.mwd_element,
                thisid    = this.mwd_id,
                inputattr = '';
            //inputattr = 'readonly';
            if (element.prop('required')) {
                //inputattr = 'readonly required';
                inputattr = 'required';
            }
            //console.log(thisid);
            let optgroup = element.find('optgroup');
            $(optgroup).each(function () {
                $(this).prepend('<option value=\"mwd_startoptgroup\"></option>').append('<option value=\"mwd_endoptgroup\"></option>');
            });
            if (element.prop('multiple')) {
                $('#mwd_' + thisid).addClass('mwd_multiple');
                element.hide().after('<div id="mwd_mulitselect_box_' + thisid + '" class="mwd_mulitselect_box"></div>');
            } else {
                let mwdselectbtn = $('#mwd_select_btn_' + thisid);
                element.hide().after('<div id="mwd_select_cvr_' +
                    thisid +
                    '" class="mwd_select_cvr"></div>' +
                    '<input id="mwd_select_box_' +
                    thisid +
                    '" class="mwd mwd_input mwd_select_box" type="text" value="" ' + inputattr + '>' +
                    '<div id="mwd_select_btn_' + thisid + '" class="mwd_select_btn"></div>');
                let initbtnw = parseInt(mwdselectbtn.css('width'));
                if (initbtnw <= 0) {
                    let totalbtnw = mwdselectbtn.outerWidth(true),
                        newbtnw   = scrollbar_size - totalbtnw - 1;
                    mwdselectbtn.width(newbtnw);
                    //console.log(scrollbar_size + ' ' + totalbtnw);
                }
            }
            this._createAutocomplete();
            if (element.prop('autofocus')) {
                $('#mwd_' + thisid).addClass('mwd_focus').trigger('mwd_focusin');
            }
            if (element.data('placeholder')) {
                this._setPlaceholder();
            }
            if (element.prop('required')) {
                this._validateInput();
            }
            this._trigger('onElementSelect');
        },

        _createAutocomplete: function () {
            let element       = this.mwd_element,
                select        = $('#' + element.data('list')),
                selected      = select.find(':selected'),
                value         = selected.val() ? selected.text() : '',
                ac_inst       = element,
                thisid        = this.mwd_id,
                thistype      = this.mwd_type,
                wrapper       = '#mwd_' + this.mwd_id,
                //thiselement = this,
                thisinstid    = '#' + this.mwd_id,
                appendto_this = wrapper,
                position_at   = 'left bottom';
            // console.log(value + ' ' + thistype);
            if (thistype === 'text') {
                value = $(element).val();
                //console.log(value);
                let optgroup = select.find('optgroup');
                $(optgroup).each(function () {
                    $(this).prepend('<option value=\"mwd_startoptgroup\"></option>').append('<option value=\"mwd_endoptgroup\"></option>');
                });
            }
            if (thistype === 'select') {
                select = this.mwd_element;
                selected = select.find(':selected');
                value = selected.val() ? selected.text() : '';
                thisinstid = '#mwd_select_box_' + this.mwd_id;
                if (element.attr('combobox')) {
                    $('#mwd_' + thisid).addClass('mwd_combobox');
                    $('#mwd_select_cvr_' + thisid).hide();
                    $('#mwd_select_box_' + thisid).prop('readonly', false);
                }
                if (element.prop('multiple')) {
                    thisinstid = '#mwd_mulitselect_box_' + this.mwd_id;
                    appendto_this = thisinstid;
                    position_at = 'left top';
                }
                // console.log(thisinstid);
                ac_inst = $(thisinstid);
            }
            //noinspection JSUnusedLocalSymbols
            ac_inst.mwd_autocomplete({
                                         delay: 0,
                                         minLength: 0,
                                         autoFocus: false,
                                         appendTo: appendto_this,
                                         position: {my: 'left top', at: position_at},
                                         source: $.proxy(this, '_acSource'),
                                         open: function (event, ui) {
                                             let thiswidget = ac_inst.mwd_autocomplete('widget'),
                                                 selected   = select.find(':selected');
                                             thiswidget.find('li').removeClass('selected');
                                             let selected_li = thiswidget.find('li[data-value="' + $(selected).val() + '"]');
                                             // console.log(selected_li.length);
                                             if (selected_li.length > 0) {
                                                 selected_li.addClass('selected');
                                                 let li_offset   = selected_li.offset().top,
                                                     ac_offset   = thiswidget.offset().top,
                                                     ac_scroll   = thiswidget.scrollTop(),
                                                     ac_height   = thiswidget.height() / 2,
                                                     scrollvalue = li_offset - ac_offset + ac_scroll - ac_height;
                                                 //thiswidget.scrollTop(scrollvalue);
                                                 thiswidget.animate({scrollTop: scrollvalue}, 'fast');
                                             }
                                             setTimeout(function () {
                                                 $(wrapper).css('z-index', select.data('z-index') + 1).addClass('mwd_select_open');
                                             }, 1);
                                             $('.ui-autocomplete-input').not(ac_inst).mwd_autocomplete('close');
                                         },
                                         select: function (event, ui) {
                                             if (element.prop('multiple')) {
                                                 let thisval    = $(ui.item.option).val(),
                                                     thiswidget = ac_inst.mwd_autocomplete('widget'),
                                                     thisitem   = thiswidget.find('li[data-value="' + thisval + '"]');
                                                 if (thisitem.hasClass('selected')) {
                                                     ui.item.option.selected = false;
                                                     thisitem.removeClass('selected');
                                                 }
                                                 else {
                                                     if (element.prop('required') && ui.item.value === '') {
                                                         ui.item.option.selected = false;
                                                         thisitem.removeClass('selected');
                                                     }
                                                     else {
                                                         ui.item.option.selected = true;
                                                         thisitem.addClass('selected');
                                                     }
                                                 }
                                             } else {
                                                 ui.item.option.selected = true;
                                                 this.value = ui.item.value;
                                             }
                                             element.trigger('change');
                                             return false;
                                         },
                                         change: function (event, ui) {
                                             if (element.attr('combobox')) {
                                                 if (!ui.item) {
                                                     let inputvalue = $(this).val(),
                                                         valid      = false;
                                                     element.find('option').each(function () {
                                                         if ($(this).text() === inputvalue) {
                                                             this.selected = valid = true;
                                                             //return;
                                                         }
                                                     });
                                                     if (element.attr('new')) {
                                                     }  // jshint ignore:line
                                                     else {
                                                         if (!valid) {
                                                             $(this).val('');
                                                             element.val('');
                                                             return false;
                                                         }
                                                     }
                                                     element.trigger('change');
                                                 }
                                             }
                                         },
                                         close: function (event, ui) {
                                             //element.trigger('change');
                                             if (element.prop('multiple')) {
                                                 let thiswidget = ac_inst.mwd_autocomplete('widget');
                                                 thiswidget.css('display', 'block');
                                             }
                                             $(wrapper).css('z-index', select.data('z-index')).removeClass('mwd_select_open');
                                         }
                                     })
                   .val(value);

            if (element.prop('multiple')) {
                ac_inst.mwd_autocomplete('search', '');
            } else {
                $('#mwd_select_cvr_' + this.mwd_id).add(ac_inst).add('#mwd_select_btn_' + thisid).click(function () {
                    if (element.prop('disabled')) {
                    }  // jshint ignore:line
                    else {
                        let ac_open = ac_inst.mwd_autocomplete('widget').is(':visible');
                        if (ac_open) {
                            ac_inst.mwd_autocomplete('close');
                            return;
                        }
                        ac_inst.mwd_autocomplete('search', '');
                    }
                });
            }
        },

        _acSource: function (request, response) {
            let element     = this.mwd_element,
                thiselement = $('#' + element.data('list')),
                thistype    = this.mwd_type;
            if (thistype === 'select') {
                thiselement = element;
            }
            let matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
            // console.log(matcher);
            response(thiselement.find('option').map(function () {
                let thislabel = $(this).val(),
                    thisvalue = $(this).val(),
                    thistext  = $(this).text();
                thistext = thistext.trim();
                if (thistext.length > 0) {
                    thislabel = $(this).text();
                }
                if (!request.term || matcher.test(thislabel)) {
                    return {
                        label: thislabel,
                        value: thislabel,
                        relvalue: thisvalue,
                        option: this,
                        category: $(this).closest('optgroup').attr('label')
                    };
                }
            }));
        },


        _inputDate: function () {
            //noinspection JSDuplicatedDeclaration
            let element                  = this.mwd_element,
                thisid                   = this.mwd_id,
                picker                   = this,
                mwd_wrapper_id           = '#mwd_' + thisid,
                thisopts                 = {},
                min = '', max = '', step = '';
            //date
            if (element.hasClass('mwd_date')) {
                if (element.attr('min')) {
                    min = {minDate: element.attr('min')};
                    thisopts = $.extend({}, thisopts, min);
                }
                if (element.attr('max')) {
                    max = {maxDate: element.attr('max')};
                    thisopts = $.extend({}, thisopts, max);
                }
                //let optionsset = this.options.elementDateOptions;
                //if(optionsset.length > 0) {
                //	thisopts = $.extend({}, thisopts, optionsset);
                //}
                let optionsset = $.makeArray(this.options.elementDateOptions);
                //console.log(optionsset[0]);
                //noinspection JSDuplicatedDeclaration
                thisopts = $.extend({}, thisopts, optionsset[0]);
                //if (typeof mwd_datepicker !==== 'undefined' && $.isFunction(mwd_datepicker)) {
                //picker._trigger('elementDateOptions');
                //console.log(thisid);

                element.mwd_datepicker(thisopts);
                $('#ui-datepicker-div').addClass('mwd_dateelement');
                //}
                //picker._trigger('onElementDate');
            }
            //time
            if (element.hasClass('mwd_time')) {
                if (element.attr('min')) {
                    min = {minTime: element.attr('min')};
                    thisopts = $.extend({}, thisopts, min);
                }
                if (element.attr('max')) {
                    max = {maxTime: element.attr('max')};
                    thisopts = $.extend({}, thisopts, max);
                }
                if (element.attr('step')) {
                    step = {step: element.attr('step')};
                    thisopts = $.extend({}, thisopts, step);
                }
                element.mwd_timepicker(thisopts);
                $('#ui-datepicker-div').addClass('mwd_form_element');
                picker._trigger('onElementTime');
            }
            //datetime
            if (element.hasClass('mwd_datetime') || element.hasClass('mwd_datetime-local')) {
                if (element.hasClass('mwd_datetime')) {
                    //noinspection JSDuplicatedDeclaration,JSUnusedLocalSymbols
                    let tz       = {showTimezone: true},
                        thisopts = $.extend(thisopts, tz);  // jshint ignore:line
                }
                if (element.attr('min')) {
                    min = {minDate: element.attr('min')};
                    thisopts = $.extend(thisopts, min);
                }
                if (element.attr('max')) {
                    max = {maxDate: element.attr('max')};
                    thisopts = $.extend(thisopts, max);
                }
                if (element.attr('step')) {
                    step = {step: element.attr('step')};
                    thisopts = $.extend(thisopts, step);
                }
                element.mwd_datetimepicker(thisopts);
                $('#ui-datepicker-div').addClass('mwd_form_element');
            }
            //month
            if (element.hasClass('mwd_month')) {
                if (element.attr('min')) {
                    min = {minDate: element.attr('min')};
                    thisopts = $.extend(thisopts, min);
                }
                if (element.attr('max')) {
                    max = {maxDate: element.attr('max')};
                    thisopts = $.extend(thisopts, max);
                }
                element.mwd_monthpicker(thisopts);
                $('#ui-datepicker-div').addClass('mwd_form_element');
            }
            //week
            if (element.hasClass('mwd_week')) {
                if (element.attr('min')) {
                    min = {minDate: element.attr('min')};
                    thisopts = $.extend(thisopts, min);
                }
                if (element.attr('max')) {
                    max = {maxDate: element.attr('max')};
                    thisopts = $.extend(thisopts, max);
                }
                element.mwd_weekpicker(thisopts);
                $('#ui-datepicker-div').addClass('mwd_form_element');
            }
            if (element.attr('readonly')) {
                element.datepicker('destroy');
            }
            $(mwd_wrapper_id)
                .find('.mwd_datepicker_value')
                .addClass('mwd mwd_input');
        },

        _inputNumber: function () {

            //http://api.jqueryui.com/spinner/
            let element  = this.mwd_element,
                thisid   = this.mwd_id,
                thisopts = mwd_number_options(thisid, 'number');

            let spinopt = {
                spin: function (event, ui) {
                    element
                        .val(ui.value)
                        .trigger('change');
                }
            };
            thisopts = $.extend(thisopts, spinopt);

            element
                .prop('type', 'tel')
                .mwd_spinner(thisopts);
            if (element.attr('readonly')) {
                element.mwd_spinner('disable').removeAttr('disabled');
            }
            if (element.attr('disabled')) {
                element.mwd_spinner('disable');
            }

            this._trigger('onElementNumber');

            if (this.mwd_element.data('placeholder')) {
                this._setPlaceholder();
            }
            this._validateInput();

        },

        _inputRange: function () {
            //noinspection JSUnusedLocalSymbols
            let element  = this.mwd_element,
                wrapper  = $('#mwd_' + this.mwd_id),
                thisopts = mwd_number_options(this.mwd_id, 'range'),
                slideopt = {
                    slide: function (event, ui) {
                        element
                            .val(ui.value)
                            .trigger('change');
                    },
                    start: function (event, ui) {
                        wrapper.trigger('click');
                    }
                };
            thisopts = $.extend(thisopts, slideopt);
            element
                .prop('type', 'text')
                .removeAttr('required');
            let rangeobject = $('#mwd_range_' + this.mwd_id);
            rangeobject.mwd_slider(thisopts);
            if (element.attr('disabled') || element.attr('readonly')) {
                rangeobject.mwd_slider('disable');
            }
            element.prop('readonly', true);
        },

        _inputMeter: function () {
            let element  = this.mwd_element,
                thisopts = mwd_number_options(this.mwd_id, 'meter');
            element
                .hide()
                .before('<div id="mwd_placeholder_' + this.mwd_id + '" class="mwd_placeholder"></div>');
            $('#mwd_placeholder_' + this.mwd_id).html(element.val());
            $('#mwd_meter_' + this.mwd_id).mwd_progressbar(thisopts);
        },

        _inputPogress: function () {
            let element     = this.mwd_element,
                thisopts    = mwd_number_options(this.mwd_id, 'progress'),
                placeholder = element.data('placeholder');
            element
                .hide()
                .before('<div id="mwd_placeholder_' + this.mwd_id + '" class="mwd_placeholder"></div>');

            $('#mwd_placeholder_' + this.mwd_id).html(placeholder);

            $('#mwd_progress_' + this.mwd_id).mwd_progressbar(thisopts);
            //console.log(thisopts);
            this._trigger('onElementProgress');
        },

        _inputOutput: function () {
            let element  = this.mwd_element,
                thisname = element.attr('name');
            element
                .after('<input name="' + thisname + '" type="hidden" value="' + element.val() + '">')
                .on('change', function () {
                    let thisval = $(this).val();
                    $('input[name=' + thisname + ']').val(thisval);
                });
            this._trigger('onElementOutput');
        },

        _inputColor: function () {
            let element = this.mwd_element;
            //noinspection JSUnusedLocalSymbols,JSUnresolvedFunction
            element
                .prop('type', 'text')
                .spectrum({
                              clickoutFiresChange: true,
                              showInitial: true,
                              allowEmpty: true,
                              showInput: true,
                              showButtons: false,
                              preferredFormat: 'hex6',
                              beforeShow: function (color) {
                                  if (element.attr('readonly')) {
                                      return false;
                                  }
                              }
                          });
            this._trigger('onElementColor');
            //this._validateInput();

        },


        _setPlaceholder: function () {
            let element      = this.mwd_element,
                thisid       = this.mwd_id,
                plh          = this,
                thisphobject = $('#' + thisid);
            element.before('<div id="mwd_placeholder_' + this.mwd_id + '" class="mwd_placeholder"></div>');
            this._getPlaceholder();
            thisphobject.on('input change', function () {
                plh._getPlaceholder();
            });
            if (this.mwd_type === 'select') {
                thisphobject = $('#mwd_select_box_' + this.mwd_id);
                thisphobject.on('input change', function () {
                    plh._getPlaceholder();
                });
            }
        },

        _getPlaceholder: function () {
            let element            = this.mwd_element,
                mwd_placeholder_id = 'mwd_placeholder_' + this.mwd_id,
                thisid             = this.mwd_id,
                thistype           = this.mwd_type,
                placeholder        = element.data('placeholder');
            let plhobject = $('#' + mwd_placeholder_id);
            plhobject.html('');
            if (thistype === 'select') {
                thisid = 'mwd_select_box_' + this.mwd_id;
            }
            if ($('#' + thisid).val() === '') {
                plhobject.html(placeholder);
            }
        },

        _validateInput: function () {
            let element = this.mwd_element;
            //disabled	readonly
            if (element.prop('disabled') || element.prop('readonly')) {
            } // jshint ignore:line
            //test
            else {
                /*if (element.prop('required')
                || element.data('minlength')
                || element.data('maxlength')
                || element.data('pattern')
                || element.data('type') === 'number'
                || element.data('type') === 'email'
                || element.data('type') === 'url'
                || element.data('type') === 'tel') {*/
                let thisid    = this.mwd_id,
                    wrapper   = $('#mwd_' + this.mwd_id),
                    thistype  = this.mwd_type,
                    //thiselement = this,
                    thisevent = 'input change',
                    //initvalue = element.val(),
                    thistest  = '',
                    valid     = thisid;
                if (thistype === 'select') {
                    valid = 'mwd_select_box_' + this.mwd_id;
                    thisevent = 'change';
                    if (element.prop('multiple')) {
                        valid = this.mwd_id;
                    }
                }
                if (thistype === 'number') {
                    thisevent = 'input';
                }
                //validation test
                thistest = mwd_test_value(valid);
                mwd_infobox(thisid, thistest, 'nofocus');
                //console.log('nofocus ' + thistest + ' ' + thisid);
                wrapper
                    .on('mwd_focusin', function () {
                        thistest = mwd_test_value(valid);
                        mwd_infobox(thisid, thistest, 'focusin');
                        //console.log('mwd_focusin ' + thistest + ' ' + thisid);
                    })
                    .on('mwd_focusout', function () {
                        thistest = mwd_test_value(valid);
                        mwd_infobox(thisid, thistest, 'focusout');
                        //console.log('mwd_focusout ' + thistest + ' ' + thisid);
                    });
                $('#' + valid)
                    .on(thisevent, function () {
                        thistest = mwd_test_value(valid);
                        mwd_infobox(thisid, thistest, 'keyup');
                        //console.log(thisevent + ' ' + thistest + ' ' + thisid);
                    });
                //}
            }
        },

        _updateInfobox: function () {
            let element  = this.mwd_element,
                thistype = this.mwd_type,
                infoid   = '#mwd_info_' + this.mwd_id,
                valtext  = '',
                valtype  = this.options.validationType;
            if (element.prop('required')) {
                let infotxtreq = this.options.txtRequired;
                if (thistype === 'checkbox') {
                    infotxtreq = this.options.txtRequiredCheckbox;
                }
                if (thistype === 'radio') {
                    infotxtreq = this.options.txtRequiredRadio;
                }
                if (thistype === 'file') {
                    infotxtreq = this.options.txtRequiredFile;
                }
                valtext += infotxtreq;
            }
            if (element.data('minlength')) {
                let minlength  = parseFloat(element.data('minlength')),
                    infotxtmin = this.options.txtMinlength + minlength;
                if (this.options.txtMinlength === '') {
                    infotxtmin = '';
                }
                if (valtext.length > 0) {
                    valtext += '\n';
                }
                valtext += infotxtmin;
            }
            if (element.data('maxlength')) {
                let maxlength  = parseFloat(element.data('maxlength')),
                    infotxtmax = this.options.txtMaxlength + maxlength;
                if (this.options.txtMaxlength === '') {
                    infotxtmax = '';
                }
                if (valtext.length > 0) {
                    valtext += '\n';
                }
                valtext += infotxtmax;
            }
            let infotxtpatt = '';
            if (element.data('pattern')) {
                infotxtpatt = this.options.txtPattern;
            }
            if (element.data('type') === 'number') {
                infotxtpatt = this.options.txtPatternNumber;
            }
            if (element.data('type') === 'email') {
                infotxtpatt = this.options.txtPatternEmail;
            }
            if (element.data('type') === 'url') {
                infotxtpatt = this.options.txtPatternUrl;
            }
            if (element.data('type') === 'tel') {
                infotxtpatt = this.options.txtPatternTel;
            }
            if (infotxtpatt.length > 0) {
                if (valtext.length > 0) {
                    valtext += '\n';
                }
                valtext += infotxtpatt;
            }
            $(infoid).attr('data-title', valtext).attr('title', valtext).attr('data-type', valtype).addClass(valtype);
            if (valtype === 'mwd_error_html') {
                $(infoid).attr('title', '').html(valtext).removeClass('mwd_error_title');
            }
        }

    });

    function mwd_number_options(thisid, type) {
        let element                                                                   = $('#' + thisid),
            //wrapper = $('#mwd_' + thisid),
            min                                                                       = parseFloat(element.attr('min')),
            max                                                                       = parseFloat(element.attr('max')),
            step                                                                      = parseFloat(element.attr('step')),
            value                                                                     = parseFloat(element.val()),
            min_init, thisopts = '', valueopt = '', stepopt = '', minopt = '', maxopt = '';
        if (type === 'number') {  // min max step value
            if (isNaN(value) === true) {
                value = '';
            }
        }
        if (type === 'range') {
        } // min max step value
        if (type === 'meter') {
            step = 'x';
            if (isNaN(value) === true) {
                value = 0;
            }
            if (isNaN(min) === true) {
                min = 0;
            }
            if (value >= 0 && value <= 1) {
                if (isNaN(max) === true) {
                    max = 1;
                }
            }
            if (isNaN(max) === true) {
                max = 100;
            }
        } // min max value
        if (type === 'progress') {
            min = 'x';
            step = 'x';
            if (isNaN(max) === true) {
                max = 100;
            }
            if (isNaN(value) === true) {
                value = 0;
            }
            if (max < 0) {
                max = 100;
            }
            if (value > max) {
                value = max;
            }
            if (value < 0) {
                value = 0;
            }
            //console.log(value + ' ' + max + ' ' + element.val());
        } // max value

        if (isNaN(value) === false) {
            valueopt = {value: value};
            thisopts = $.extend(valueopt, thisopts);
        }
        if (isNaN(step) === false) {
            stepopt = {step: step};
            thisopts = $.extend(stepopt, thisopts);
        }
        if (isNaN(min) === false) {
            minopt = {min: min};
            thisopts = $.extend(minopt, thisopts);
        }
        if (isNaN(step) === false && isNaN(min) === true) {
            min_init = $(this).val() - (step * 2); // jshint ignore:line
            minopt = {min: min_init};
            thisopts = $.extend(minopt, thisopts);
        }
        if (isNaN(max) === false) {
            maxopt = {max: max};
            thisopts = $.extend(maxopt, thisopts);
        }

        return thisopts;
    }

    function mwd_test_value(thisid) {
        let element     = $('#' + thisid),
            thisval     = ('' + element.val()).replace('\n', '').trim(),
            test        = true,
            testreq     = true,
            testmin     = true,
            testmax     = true,
            testnr      = true,
            pattern     = '',
            thispattern = '',
            testpatt    = true;
        if (element.data('type') === 'checkbox' || element.data('type') === 'radio') {
            thisval = 'checked';
            //console.log(element.prop('checked'));
            if (element.prop('checked') === false) {
                thisval = '';
            }
        }
        if (thisval === null || thisval === 'null' || thisval === undefined || thisval === 'undefined' || thisval === false || thisval === 'false') {
            thisval = '';
        }
        //required
        if (element.prop('required')) {
            if (thisval.length === 0) {
                testreq = false;
                if (element.data('type') === 'number') {
                    //isValid = element.mwd_spinner('isValid');
                    //testreq = isValid;
                    testreq = true;
                    //noinspection JSCheckFunctionSignatures
                    if (isNaN(thisval) === true) {
                        testreq = false;
                    }
                }
            }
            //console.log(thisval.length + ' ' + thisval + ' ' + isNaN(thisval));
        }
        //minlength
        if (element.data('minlength')) {
            let minlength = parseFloat(element.data('minlength'));
            if (thisval.length < minlength) {
                testmin = false;
            }
        }

        //maxlength
        if (element.data('maxlength')) {
            let maxlength = parseFloat(element.data('maxlength'));
            if (thisval.length > maxlength) {
                testmax = false;
            }
        }

        if (element.data('type') === 'number') {
            //noinspection JSCheckFunctionSignatures
            if (thisval.length > 0 && isNaN(thisval) === true) {
                testnr = false;
            }
        }

        //pattern
        if (element.data('pattern') || element.data('type') === 'email' || element.data('type') === 'url' || element.data('type') === 'tel') {
            if (element.data('type') === 'email') {
                pattern = /^[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
            }
            if (element.data('type') === 'url') {
                pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            }
            if (element.data('type') === 'tel') {
                pattern = /^/;
            }
            if (element.data('pattern')) {
                pattern = element.data('pattern');
            }
            thispattern = new RegExp(pattern);
            if (thisval.length > 0) {
                testpatt = thispattern.test(thisval);
            }
        }

        if (testreq === false || testmin === false || testmax === false || testnr === false || testpatt === false) {
            test = false;
        }

        return test;
    }

    function mwd_infobox(thisid, valtest, valkey) {
        let infoid  = '#mwd_info_' + thisid,
            status  = '',
            valtext = $(infoid).attr('data-title'),
            valtype = $(infoid).attr('data-type');
        $(infoid).addClass(valtype)
                 .removeClass('mwd_info_help mwd_info_error mwd_info_error_init mwd_info_oke')
                 .attr('title', '')
                 .html('');
        if (valkey === 'nofocus') {
            status = 'mwd_info_error_init';
        }
        if (valkey === 'focusin') {
            status = 'mwd_info_help';
        }
        if (valkey === 'keyup') {
            status = 'mwd_info_help';
            $(infoid).addClass('mwd_info_oke').attr('title', '').html('');
        }
        if (valkey === 'focusout') {
            status = 'mwd_info_error';
        }
        if (valtest === false) {
            $(infoid).removeClass('mwd_info_oke').addClass(status).attr('title', valtext);
            if (valtype === 'mwd_error_html') {
                $(infoid).attr('title', '').html(valtext);
            }
        }
    }

    $('body').click(function (e) {
        let thisclass = String(e.target.className);
        //console.log(thisclass);
        if (!thisclass.match(/mwd/)) {
            $('.mwd_element_wrapper').each(function () {
                if ($(this).hasClass('mwd_focus')) {
                    $(this).removeClass('mwd_focus').trigger('mwd_focusout');
                }
            });
            let selectboxobj = $('.mwd_select_box');
            if (selectboxobj.length > 0) {
                selectboxobj.mwd_autocomplete('close');
            }
        }
    });

    //mwd custom spinner
    $.widget('custom.mwd_spinner', $.ui.spinner, {
        _create: function () {
            this._super();
            this.widget().find('.ui-icon').addClass('mwd_spinner');
        }
    });

    //mwd custom progressbar
    $.widget('custom.mwd_progressbar', $.ui.progressbar, {
        _create: function () {
            this._super();
            this.widget().find('.ui-progressbar-value').addClass('mwd_progressbar');
        }
    });

    //mwd custom slider
    $.widget('custom.mwd_slider', $.ui.slider, {
        _create: function () {
            this._super();
            this.widget().find('.ui-slider-handle').addClass('mwd_slider');
        }
    });


    //mwd custom autocomplete
    $.widget('custom.mwd_autocomplete', $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
        },
        _renderMenu: function (ul, items) {
            let that = this;
            //currentCategory = '';
            $(ul).addClass('mwd_select_list');
            $.each(items, function (index, item) {
                let li = that._renderItemData(ul, item);
                if (item.category) {
                    if (item.relvalue === 'mwd_startoptgroup') {
                        li.removeClass('ui-menu-item mwd_item').addClass('ui-autocomplete-category mwd_group_label').text(item.category);
                    }
                    else if (item.relvalue === 'mwd_endoptgroup') {
                        li.removeClass('ui-menu-item mwd_item').addClass('ui-autocomplete-category mwd_group_label_end').text('');
                    }
                    else {
                        li.addClass('mwd_group').attr('data-group', item.category);
                    }
                }
            });
        },
        _renderItem: function (ul, item) {
            let listItem;
            if (item.label === '') {
                if (item.relvalue !== '') {
                    listItem = $('<li></li>')
                        .append('&nbsp;')
                        .addClass('mwd_item ui-menu-item')
                        .removeClass('ui-widget-content ui-menu-divider')
                        .attr('data-value', item.relvalue)
                        .appendTo(ul);
                } else {
                    listItem = $('<li></li>')
                        .append('&nbsp;')
                        .appendTo(ul);
                }
            }
            else {
                listItem = $('<li></li>')
                    .append(item.label)
                    .attr('data-value', item.relvalue)
                    .addClass('mwd_item')
                    .appendTo(ul);
            }
            return listItem;
        }
    });

    //Scrollbar size detection
    let scrollbar_size = scrollbarSize();

    function scrollbarSize() {
        let size;
        if (size === undefined) {
            let div = $('<div style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%"></div></div>');
            $('body').append(div);
            let w1 = $(div).innerWidth(),
                w2 = $('div', div).innerWidth();
            $(div).remove();
            size = w1 - w2;
        }
        return size;
    }

// }(jQuery)); // jshint ignore:line


}) );
