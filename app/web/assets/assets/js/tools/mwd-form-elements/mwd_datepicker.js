/*mwd_datepicker - v1.0 beta
* http://www.mwd-form-elements.com/datetime/#!/getting-started/download/mwd_datepicker
* Copyright (c) 2014 Marja Menge, Menge Webdesign, MIT License */

/*
 * widget factory
 * fix min max date
 *
 *
 *
 *
 * cleanup placeholder code
 * added trigger change
 * no need to destroy anymore - just call again
 * clearbutton resets time now too
 * repaired wrong date display in case of min or max
 * move focus from the input to the wrapper -> ie
 * clone form attribute to the extra inputs
 * added trigger change to the input on timeslider
 * */

(function ($) {

    'use strict';

	$.widget('mwd.mwd_date_and_timepicker', {

		options: {
			currentText: 'Now',
			clearBtnText: 'Clear',
			weekText: 'Week',
			timeText: 'Current time:&nbsp;',
			closeText: 'Close',
			changeMonth: true,
			monthNamesShort: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
			changeYear: true,
			showButtonPanel: true,
			dateFormat: 'dd-mm-yy',
			clearBtn: true,
			monthSeperator: ' ',
			weekSeperator: ', ',
			timeSeperator: ' ',
			minTime: '00:00',
			maxTime: '23:59',
			step: 1,
			orientation: 'horizontal',
			showTimezone: false,
			timezoneList:	[
				{ value: -12, label: ' Z-12h'},
				{ value: -11, label: ' Z-11h'},
				{ value: -10, label: ' Z-10h'},
				{ value: -9, label: ' Z-9h'},
				{ value: -8, label: ' Z-8h'},
				{ value: -7, label: ' Z-7h'},
				{ value: -6, label: ' Z-6h'},
				{ value: -5, label: ' Z-5h'},
				{ value: -4, label: ' Z-4h'},
				{ value: -3, label: ' Z-3h'},
				{ value: -2, label: ' Z-2h'},
				{ value: -1, label: ' Z-1h'},
				{ value: 0, label: ' Z+0h'},
				{ value: +1, label: ' Z+1h'},
				{ value: +2, label: ' Z+2h'},
				{ value: +3, label: ' Z+3h'},
				{ value: +4, label: ' Z+4h'},
				{ value: +5, label: ' Z+5h'},
				{ value: +6, label: ' Z+6h'},
				{ value: +7, label: ' Z+7h'},
				{ value: +8, label: ' Z+8h'},
				{ value: +9, label: ' Z+9h'},
				{ value: +10, label: ' Z+10'},
				{ value: +11, label: ' Z+11h'},
				{ value: +12, label: ' Z+12h'}
			]
		},

		_options: {
			datePicker: true,
			monthPicker: false,
			weekPicker: false,
			timePicker: false
		},

		_create: function() {

			var element = this.element,
			thisid = element.attr('id'),
			thisname = element.attr('name'),
			thistype = element.attr('type');
			if(element.attr('data-type')) {
				thistype = element.attr('data-type');
			}

			if(!thisid || thisid == undefined || thisid == '') {
				element.uniqueId();
				thisid = element.attr('id');
			}
			if(!thisname || thisname == undefined || thisname == '') {
				thisname = thisid;
			}
			if(!thistype || thistype == undefined || thistype == '') {
				thistype = 'date';
			}

			this.mwd_dtid = thisid;
			this.mwd_dtname = thisname;
			this.mwd_dtelement = element;
			this.mwd_dttype = thistype;
		},

		 _init: function() {
			var element = this.mwd_dtelement;
			if (element.hasClass('mwd_datepicker_input')) {
				this._destroyMwdDTElement();
				//console.log(element.attr('id') + ' d ' + element.attr('class'));
			} else {
				element.addClass('mwd_datepicker_input');
				this._createMwdDTElement();
				//console.log(element.attr('id') + ' c ' + element.attr('class'));
			}
			//console.log(element.attr('id') + ' ' + element.attr('class'));
	    },

	    _destroyMwdDTElement: function() {
			this._destroy();
			this._create();
		},

		_createMwdDTElement: function() {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			thisname = this.mwd_dtname,
			thisval = element.val(),
			thisdate = '',
			thistime = ''; //thisdatetime['thistime'];//thisdatetime['thisdate'],
			element
			.after('<div  id="mwd_datepicker_' + thisid + '" class="mwd_datepicker">'
			+ '<div class="mwd-ui-datepicker" style=\"display: none;\"></div>'
			+ '</div>');
			//.css({overflow: 'hidden', outline: 'none', border: 0, padding: 0, margin: 0, color: '#000000'});

			//element
			//.attr('name', thisname + '[date]')
			//.after('<div  id="mwd_datepicker_' + thisid + '" class="mwd_datepicker">'
			//+ '<input  id="mwd_dp_time_' + thisid + '" name="' + thisname + '[time]" type="hidden" value="' + thistime + '">'
			//+ '<input  id="mwd_dp_value_' + thisid + '" name="' + thisname + '[value]" type="text" class="mwd_datepicker_value" value="' + thisval + '" readonly>'
			//+ '<div class="mwd-ui-datepicker" style=\"display: none;\"></div>'
			//+ '</div>')
			//.css({width: 0, overflow: 'hidden', outline: 'none', border: 0, padding: 0, margin: 0, color: 'transparent'});

			//initiate the datepicker
			$('#' + thisid).datepicker(this._setOptions());

			this._createMwdElement(thisval);

			var thisinst = $.datepicker._getInst($('#' + thisid)[0]),
			mwddp_inst = $.datepicker._get(thisinst, 'mwdDateTimePickerInst');
			//mwddp_inst._setSelectedDate(thisinst, thisval);
					//	console.log(thisval);
			//trigger the input
			$('#mwd_dp_value_' + thisid).click(function() {
				element.trigger('focus');
			});
			if(element.attr('autofocus')) {
				element.trigger('focus');
			}
			element.focus(function(e){
				$(this).blur();
			});
		},

		_setOptions: function () {

			var element = this.mwd_dtelement,
			thisoptions_default = this.options,
			thisoptions_private = this._options,
			thisdp = this,
			thisid = this.mwd_dtid,
			thisoptions = {};

			thisoptions = $.extend({}, thisoptions, thisoptions_default);
			thisoptions = $.extend({}, thisoptions, thisoptions_private);

			var thisoptions_extend = {
				beforeShow: function () {	},
				onChangeMonthYear: function(y, m, dp_inst) {
					thisdp._setSelectedDate(dp_inst, 'select');
				},
				onSelect: function() {


				},
				onClose: function () {	},
				mwdDateTimePickerInst: thisdp
			}

			thisoptions = $.extend({}, thisoptions, thisoptions_extend);

			return thisoptions;
		},

		_setSelectedDate: function(dp_inst, initval) {

			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			dateid = '#mwd_dp_value_' + thisid,
			hiddenid_time = '#mwd_dp_time_' + thisid,
			d = dp_inst.selectedDay,
			m = dp_inst.selectedMonth,
			fm = m + 1,
			y = dp_inst.selectedYear,
			thistype = 'date';
			//console.log('1 ' + y + '-' + fm + '-' + d);
			//element.datepicker( "getDate" );

			if (element.datepicker('option', 'weekPicker') == true) { thistype = 'week'; }
			if (element.datepicker('option', 'monthPicker') == true) { thistype = 'month'; }

			//valid date
			try { $.datepicker.parseDate('yy-m-d', y + '-' + fm + '-' + d, ''); }
			catch (e) {
				var ld = new Date(y, m + 1, 0),
				ldm = ld.getDate();
				d = ldm;
			}
			var thisnewdateval = new Date(y + '/' + fm + '/' + d);

			//console.log('1 ' + thisnewdateval);
			//console.log(element.datepicker( "getDate" ) );

			var dateopts = '',
			dateobject = '',
			datestring = '',
			timestring = '',
			timezonelabel = '',
			timeopts = '',
			thistime = $(hiddenid_time).val(),
			df = element.datepicker('option', 'dateFormat'),
			dfc = $.datepicker._getFormatConfig(dp_inst);

			if(thistype == 'date') {
				dateopts = { 'sep': '', 'df': df, 'dfc': dfc };
			}
			if(thistype == 'month') {
				dateopts = { 'sep': element.datepicker('option', 'monthSeperator'), 'monthnames': element.datepicker('option', 'monthNames'), 'dfc': dfc };
			}
			if(thistype == 'week') {
				dateopts = { 'sep': element.datepicker('option', 'weekSeperator'), 'weektext': element.datepicker('option', 'weekText') };
			}

			//console.log(element.datepicker('option', 'minDate'));
			var get_thisdate = getNewdate(thistype, thisnewdateval, dateopts);

			//console.log('2 ' + thisnewdateval);
			if(get_thisdate == undefined) { }
			else {
				dateobject = get_thisdate['dateobject'];
				datestring = String(get_thisdate['datestring']);
			}

			//get time
			var timezonelist = '';
			if(element.datepicker('option', 'showTimezone') == true) {
				timezonelist = element.datepicker('option', 'timezoneList');
			}

			timeopts = {'timezonelist': timezonelist};
			var get_thistime = get_newtime(thistime, timeopts),
			timestring = get_thistime['timestring'],
			timezonevalue = get_thistime['timezonevalue'],
			timesep = element.datepicker('option', 'timeSeperator');

			if(timezonelist) {
				$.map(timezonelist, function (val) {
					if(timezonevalue == val.value) {	timezonelabel = val.label; }
				});
			}

			var required = element.attr('required');
			if(initval == '' && !required) {
				datestring = '';
				timestring = '';
			}

			//date & time
			var dateshow = datestring,
			dp = element.datepicker('option', 'datePicker');
			if(element.datepicker('option', 'timePicker') == true) {
				if(datestring != '' && timestring != '') { dateshow = datestring + timesep + timestring + timezonelabel; }
			}
			if(dp == false) {
				if(timestring != '') { dateshow = timestring + timezonelabel; }
			}

			$(hiddenid_time).val(timestring + timezonelabel);
			$(dateid).val(dateshow).trigger('change');

			element.datepicker('setDate', dateobject);


		},

		_addClearBtn: function() {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			required = element.attr('required'),
			clearbtn = element.datepicker('option', 'clearBtn'),
			buttondisplay = '',
			thisinst = $.datepicker._getInst($('#' + thisid)[0]),
			mwddp_inst = $.datepicker._get(thisinst, 'mwdDateTimePickerInst'),
			buttonPane = element.datepicker('widget').find('.ui-datepicker-buttonpane'),
			btntxt = element.datepicker('option', 'clearBtnText');
			if(required || clearbtn == false) { buttondisplay = 'display: none;'; }
			var btn = $('<button class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all" type="button" style="' + buttondisplay + '">' + btntxt + '</button>')
			.unbind('click')
			.bind('click', function () {
				$('#mwd_dp_value_' + thisid).val('').trigger('change');
				$('#mwd_dp_time_' + thisid).val('');
				element.datepicker('setDate', new Date());
				mwddp_inst._setSelectedDate(thisinst, '');
			})
			.appendTo(buttonPane);
		},

		_addTimepicker: function() {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			dp_inst = $.datepicker._getInst($('#' + thisid)[0]),
			mwddp_inst = $.datepicker._get(dp_inst, 'mwdDateTimePickerInst');

			if(element.datepicker('option', 'timePicker') == true) {
				var dpdiv = dp_inst.dpDiv,
				buttonPane = dpdiv.find('.ui-datepicker-buttonpane'),
				timetext = element.datepicker('option', 'timeText'),
				zonelist = '',
				zonelistclass = '';
				if(element.datepicker('option', 'showTimezone') == true) {
					zonelist = '<select id="zonelist_' + thisid + '" class="zonelist"></select>',
					zonelistclass = ' time_slider_btn-zl';
				}

				if(element.datepicker('option', 'datePicker') == false) {
					var html_h = '<div class="mwd-ui-timepicker">';
					html_h += '<div class="ui-datepicker-header mwd-ui-datepicker-header-h ui-widget-header ui-helper-clearfix ui-corner-all">';
					html_h += '<div class="time_current_txt">' + timetext + '</div>';
					html_h += '<input id="mwd_time_current_' + thisid + '" type="text" value="" readonly>';
					html_h += zonelist;
					html_h += '</div>';
					html_h += '<div class="time_sliderwrapper">';
					html_h += '<div id="time_slider_min_btn_' + thisid + '" class="time_slider_btn time_slider_min_btn ui-corner-all ui-state-default">';
					html_h += '<span class="ui-icon ui-icon-circle-triangle-w"></span>';
					html_h += '</div>';
					html_h += '<div id="time_slider_' + thisid + '" class="time_slider"></div>';
					html_h += '<div id="time_slider_max_btn_' + thisid + '" class="time_slider_btn time_slider_max_btn ui-corner-all ui-state-default">';
					html_h += '<span class="ui-icon ui-icon-circle-triangle-e"></span>';
					html_h += '</div>';
					html_h += '</div>';
					html_h += '<div id="time_slider_min_' + thisid + '" class="time_slider_time time_slider_mintime"></div>';
					html_h += '<div id="time_slider_max_' + thisid + '" class="time_slider_time time_slider_maxtime"></div>';
					html_h += '</div>';
					$(html_h).prependTo(dpdiv);
				} else {
					var html_v = '<div class="mwd-ui-datetimepicker' + '">';
					html_v += '<div class="ui-datepicker-header mwd-ui-datepicker-header-v ui-widget-header ui-helper-clearfix ui-corner-all">';
					html_v += '<input id="mwd_time_current_' + thisid + '" type="text" value="" readonly>';
					html_v += zonelist;
					html_v += '</div>';
					html_v += '<div id="time_slider_max_btn_' + thisid + '" class="time_slider_btn' + zonelistclass + ' time_slider_max_btn ui-corner-all ui-state-default">';
					html_v += '<span class="ui-icon ui-icon-circle-triangle-n"></span>';
					html_v += '</div>';
					html_v += '<div id="time_slider_min_' + thisid + '" class="time_slider_time time_slider_mintime"></div>';
					html_v += '<div id="time_slider_' + thisid + '" class="time_slider"></div>';
					html_v += '<div id="time_slider_max_' + thisid + '" class="time_slider_time time_slider_maxtime"></div>';
					html_v += '<div id="time_slider_min_btn_' + thisid + '" class="time_slider_btn' + zonelistclass + ' time_slider_min_btn ui-corner-all ui-state-default">';
					html_v += '<span class="ui-icon ui-icon-circle-triangle-s"></span>';
					html_v += '</div>';
					html_v += '</div>';
					$( dpdiv ).wrapInner('<div class="datewrapper-v"></div>');
					$(html_v).appendTo(dpdiv);
				}
				mwddp_inst._addSlider();
			}
		},

		_addSlider: function() {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			dp_inst = $.datepicker._getInst($('#' + thisid)[0]),
			mwddp_inst = $.datepicker._get(dp_inst, 'mwdDateTimePickerInst');
			if(element.datepicker('option', 'timePicker') == true) {
				var hiddenid_time = '#mwd_dp_time_' + thisid;

				$('button.ui-datepicker-current').on('click', function() {
					var $dp = dp_inst.dpDiv;
					$('button.ui-datepicker-clear').trigger('click');
					$('.ui-datepicker-today', $dp).click();
				});

				var thistime = $(hiddenid_time).val(),
				dateid = '#mwd_dp_value_' + thisid,
				orientation =element.datepicker('option', 'orientation'),
				stepvalue = parseInt(element.datepicker('option', 'step')),
				thismintime = String(element.datepicker('option', 'minTime')),
				thismaxtime = String(element.datepicker('option', 'maxTime')),
				get_thistime = {},
				dp = element.datepicker('option', 'datePicker'),
				timesep = element.datepicker('option', 'timeSeperator'),
				thisdate =  $('#mwd_dp_value_' + thisid).val(),
				timeopts = '',
				timezonelist = '';
				$('#time_slider_min_' + thisid).html(thismintime);
				$('#time_slider_max_' + thisid).html(thismaxtime);
				//get time
				if(element.datepicker('option', 'showTimezone') == true) {
					timezonelist = element.datepicker('option', 'timezoneList');
				}

				timeopts = {'timezonelist': timezonelist};

				var get_thistime = get_newtime(thistime, timeopts),
				timestring = get_thistime['timestring'],
				timevalue = get_thistime['timevalue'],
				timezonevalue = get_thistime['timezonevalue'];

				var get_thistime_min = get_newtime(thismintime, ''),
				minvalue = get_thistime_min['timevalue'];

				var get_thistime_max = get_newtime(thismaxtime, ''),
				maxvalue = get_thistime_max['timevalue'];

				if(orientation == 'vertical') {
					timevalue =  maxvalue - get_thistime['timevalue'] + minvalue;
				}
				$('#mwd_time_current_' + thisid).val(timestring);

				if(timezonelist) {
					var listitems;
					$.map(timezonelist, function (val) {
						listitems = $('<option></option>');
						$(listitems).val(val.value);
						$(listitems).text(val.label);
						if(timezonevalue == val.value) {
							$(listitems).attr('selected', 'selected');
						}
						$('#zonelist_' + thisid).append(listitems);
					});
					$('#zonelist_' + thisid).change(function () {
						var timecurrent = $('#mwd_time_current_' + thisid).val();
						var selected = $(this).find(":selected").text();
						if(dp == false) {
							$(dateid).val(timecurrent + selected);
						}   else {
							$(dateid).val(thisdate + timesep + timecurrent + selected);
						}
						$(hiddenid_time).val(timecurrent + selected);
					});
				}

				$('#time_slider_' + thisid).slider({
					orientation: orientation,
			        min: minvalue,
			        max: maxvalue,
			        step: stepvalue,
			        value: timevalue,
			        slide: function(event, ui) {
			        	var sliderval = ui.value;
			        	if(orientation == 'vertical') {
			        		sliderval = maxvalue - ui.value + minvalue;
			        		if(ui.value == minvalue) { sliderval = maxvalue; }
			        		if(ui.value == maxvalue) { sliderval = minvalue; }
			        	}
			            var hours = Math.floor(sliderval / 60);
			            var minutes = sliderval - (hours * 60);
			            if(hours < 10) { hours= '0' + hours; }
			            if(minutes < 10) { minutes = '0' + minutes; }
			            if(hours == 0) { hours = '00'; }
			            if(minutes == 0) { minutes = '00'; }
						var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();
						if(dp == false) {
							$(dateid).val(hours + ':' + minutes + timezonecurrent);
						}   else {
							$(dateid).val(thisdate + timesep + hours + ':' + minutes + timezonecurrent);
						}
						$('#mwd_time_current_' + thisid).val(hours + ':' + minutes);
						$(dateid).trigger('change');
			        }
			    });

				$('#time_slider_' + thisid).on('slidechange', function( event, ui ) {
		        	var sliderval = ui.value;
		        	if(orientation == 'vertical') {
		        		sliderval = maxvalue - ui.value + minvalue;
		        		if(ui.value == minvalue) { sliderval = maxvalue; }
		        		if(ui.value == maxvalue) { sliderval = minvalue; }
		        	}
		            var hours = Math.floor(sliderval / 60);
		            var minutes = sliderval - (hours * 60);
					var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();
		            if(hours < 10) { hours= '0' + hours; }
		            if(minutes < 10) { minutes = '0' + minutes; }
		            if(hours == 0) { hours = '00'; }
		            if(minutes == 0) { minutes = '00'; }
					var timezonecurrent = $('#zonelist_' + thisid).find(":selected").text();
					if(dp == false) {
						$(dateid).val(hours + ':' + minutes + timezonecurrent);
					}   else {
						$(dateid).val(thisdate + timesep + hours + ':' + minutes + timezonecurrent);
					}
					$('#mwd_time_current_' + thisid).val(hours + ':' + minutes);
					$(hiddenid_time).val(hours + ':' + minutes + timezonecurrent);
				});

				var intervalmin, timermin;
				$('#time_slider_min_btn_' + thisid).mousedown(function() {
					repeatingbtnmin(thisid, stepvalue);
					timermin = setTimeout(function(){
						intervalmin = setInterval( function() { repeatingbtnmin(thisid, stepvalue); }, 100);
					}, 500);
				})
				.mouseover(function() { $(this).addClass('ui-state-hover'); })
				.mouseup(function() { clearTimeout(timermin); clearInterval(intervalmin); })
				.mouseout(function() { clearTimeout(timermin); clearInterval(intervalmin);  $(this).removeClass('ui-state-hover'); });

				var intervalmax, timermax;
				$('#time_slider_max_btn_' + thisid).mousedown(function() {
					repeatingbtnmax(thisid, stepvalue);
					timermax = setTimeout(function(){
						intervalmax = setInterval( function() { repeatingbtnmax(thisid, stepvalue); }, 100);
					}, 500);
				})
				.mouseover(function() { $(this).addClass('ui-state-hover'); })
				.mouseup(function() { clearTimeout(timermax); clearInterval(intervalmax); })
				.mouseout(function() { clearTimeout(timermax); clearInterval(intervalmax); $(this).removeClass('ui-state-hover'); });

			}
		}

	});


    /* mwd_datepicker extends mwd.mwd_date_and_timepicker */
    $.widget('mwd.mwd_datepicker', $.mwd.mwd_date_and_timepicker, {

		_createMwdElement: function(thisval) {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			thisdate = new Date(),
			thistime = get_currenttime();
			if(thisval) {
				thisdate = thisval;
			}

			element.datepicker('setDate', thisdate);
			element.datepicker('option', 'monthPicker', false);
			element.datepicker('option', 'weekPicker', false);
			element.datepicker('option', 'datePicker', true);
			element.datepicker('option', 'timePicker', false);

			$('#mwd_dp_value_' + thisid).val(thisdate);
			$('#mwd_dp_time_' + thisid).val(thistime);
		},

		_setTheCss: function() {
			var element = this.mwd_dtelement,
			dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			$('.ui-datepicker').css({height: dph + 'px', width: dpw + 'px'});
			$('.ui-datepicker').off('mousemove', 'tbody tr');
			$('.ui-datepicker').off('mouseleave', 'tbody tr');
		}


    });

    $.widget('mwd.mwd_timepicker', $.mwd.mwd_date_and_timepicker, {

		_createMwdElement: function(thisval) {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			thisval =element.attr('value'),
			mintime =element.datepicker('option', 'minTime'),
			maxtime =element.datepicker('option', 'maxTime'),
			thisdate = '',
			thistime = '',
			setdate = new Date(),
			settime = get_currenttime(),
			thismintime = mintime,
			thismaxtime = maxtime;
			element.datepicker('option', 'dateFormat',  'dd-mm-yy');
			thistime = settime;
			if(thisval) {
				thisdate = $.datepicker.formatDate('dd-mm-yy', setdate, '');
				thistime = thisval;
			}
			element.datepicker('setDate', setdate);
			element.datepicker('option', 'orientation', 'horizontal');
			element.datepicker('option', 'timeSeperator', '_____');
			element.datepicker('option', 'monthPicker', false);
			element.datepicker('option', 'weekPicker', false);
			element.datepicker('option', 'datePicker', false);
			element.datepicker('option', 'timePicker', true);

			if(thistime) {
				var gettimevalues = get_value_from_time(thistime),
				timevalue = gettimevalues['value'];
				if(thismintime && thismintime != '00:00') {
					var get_thistime_min = get_value_from_time(thismintime),
					minvalue = get_thistime_min['value'];
					if(timevalue < minvalue) {
						thistime = thismintime;
					}
				}
				if(thismaxtime && thismaxtime != '23:59') {
					var get_thistime_max = get_value_from_time(thismaxtime),
					maxvalue = get_thistime_max['value'];
					if(timevalue > maxvalue) {
						thistime = thismaxtime;
					}
				}
			}

			$('#mwd_dp_value_' + thisid).val(thistime);
			$('#mwd_dp_time_' + thisid).val(thistime);

		},

		_setTheCss: function() {
			var element = this.mwd_dtelement,
			dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			var dp = element.datepicker('option', 'datePicker'),
			orientation = 'h';
			var tph = parseInt($('.time_sliderwrapper').css('height'));
			$('.ui-datepicker-header').hide();
			$('.ui-datepicker-calendar').hide();
			$('.mwd-ui-datepicker-header-h').show();
			$('.ui-datepicker').css({height: dph - calh + tph + 'px', width: dpw + 'px'});
			$('.ui-datepicker').off('mousemove', 'tbody tr');
			$('.ui-datepicker').off('mouseleave', 'tbody tr');

		}

    });

    $.widget('mwd.mwd_datetimepicker', $.mwd.mwd_date_and_timepicker, {

		_createMwdElement: function(thisval) {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			thisval =element.attr('value'),
			mindate = element.datepicker('option', 'minDate'),
			maxdate = element.datepicker('option', 'maxDate'),
			mintime =element.datepicker('option', 'minTime'),
			maxtime =element.datepicker('option', 'maxTime'),
			timesep = element.datepicker('option', 'timeSeperator'),
			thisdate = '',
			thistime = '',
			setdate = new Date(),
			settime = get_currenttime(),
			thismintime = mintime,
			thismaxtime = maxtime,
			thismindate = mindate,
			thismaxdate = maxdate;
			if(thisval) {
				var splitvalue1 = thisval.split(':'),
				splitvalue2 = splitvalue1[0].split(timesep),
				lastsep = splitvalue2.length-1;
				thistime = splitvalue2[lastsep] + ':' + splitvalue1[1];
				thisdate = thisval.replace(timesep + thistime, '');
				setdate = thisdate;
			}
			if(mindate && mintime == '00:00' && mindate.match(timesep) && mindate.match(':')) {
				var splitvalue1 = mindate.split(':'),
				splitvalue2 = splitvalue1[0].split(timesep),
				lastsep = splitvalue2.length-1;
				thismintime = splitvalue2[lastsep] + ':' + splitvalue1[1];
				thismindate = mindate.replace(timesep + mintime, '');
				element.datepicker('option', 'minDate', thismindate);
				element.datepicker('option', 'minTime', thismintime);
			}
			if(maxdate && maxtime == '23:59' && maxdate.match(timesep) && maxdate.match(':')) {
				var splitvalue1 = maxdate.split(':'),
				splitvalue2 = splitvalue1[0].split(timesep),
				lastsep = splitvalue2.length-1;
				thismaxtime = splitvalue2[lastsep] + ':' + splitvalue1[1];
				thismaxdate = maxdate.replace(timesep + maxtime, '');
				element.datepicker('option', 'maxDate', thismaxdate);
				element.datepicker('option', 'maxTime', thismaxtime);
			}
			if(timesep == '' || thisdate.match(timesep)) {
				timesep = ' T';
				element.datepicker('option', 'timeSeperator', ' T');
			}
			element.datepicker('setDate', setdate);
			element.datepicker('option', 'orientation', 'vertical');
			element.datepicker('option', 'monthPicker', false);
			element.datepicker('option', 'weekPicker', false);
			element.datepicker('option', 'datePicker', true);
			element.datepicker('option', 'timePicker', true);


			if(thistime) {
				var gettimevalues = get_value_from_time(thistime),
				timevalue = gettimevalues['value'];
				if(thismintime && thismintime != '00:00') {
					var get_thistime_min = get_value_from_time(thismintime),
					minvalue = get_thistime_min['value'];
					if(timevalue < minvalue) {
						thistime = thismintime;
					}
				}
				if(thismaxtime && thismaxtime != '23:59') {
					var get_thistime_max = get_value_from_time(thismaxtime),
					maxvalue = get_thistime_max['value'];
					if(timevalue > maxvalue) {
						thistime = thismaxtime;
					}
				}
			}

			$('#mwd_dp_value_' + thisid).val(thisval);
			$('#mwd_dp_time_' + thisid).val(thistime);

		},

		_setTheCss: function() {
			var element = this.mwd_dtelement,
			dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			var dp = element.datepicker('option', 'datePicker'),
			orientation = 'v';
			$('.datewrapper-v').css({float: 'left', 'width': dpw + 'px'});
			$('.ui-datepicker').css({height: dph + 'px', width: 'auto'});
			$('.mwd-ui-datepicker-header-v').css({paddingLeft: '5px', paddingBottom: '4px'});
			$('.mwd-ui-datetimepicker').css({height: dph - 3 + 'px'});
			$('.ui-datepicker').off('mousemove', 'tbody tr');
			$('.ui-datepicker').off('mouseleave', 'tbody tr');
		}

    });

    $.widget('mwd.mwd_monthpicker', $.mwd.mwd_date_and_timepicker, {

		_createMwdElement: function(thisval) {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			mindate = element.datepicker('option', 'minDate'),
			maxdate = element.datepicker('option', 'maxDate'),
			thisdate = '',
			thistime = '',
			setdate = new Date(),
			settime = get_currenttime(),
			msep = element.datepicker('option', 'monthSeperator');

			element.datepicker('option', 'dateFormat',  'd MM' + msep + 'yy');
			if(thisval) {
				setdate = '1 ' + thisval;
				thisdate = thisval;
				thistime = settime;
			}
			if(mindate) {
				element.datepicker('option', 'minDate', '1 ' + mindate);
			}
			if(maxdate) {
				element.datepicker('option', 'maxDate', '1 ' + maxdate);
			}
			element.datepicker('setDate', setdate);
			element.datepicker('option', 'datePicker', true);
			element.datepicker('option', 'timePicker', false);
			element.datepicker('option', 'weekPicker', false);
			element.datepicker('option', 'monthPicker', true);

			$('#mwd_dp_value_' + thisid).val(thisval);
			$('#mwd_dp_time_' + thisid).val(thistime);
		},

		_setTheCss: function() {
			var element = this.mwd_dtelement,
			dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			$('.ui-datepicker-calendar').hide();
			$('.ui-datepicker').css({height: hh + 5 + bh + 'px', width: dpw + 'px'});
		}


    });

    $.widget('mwd.mwd_weekpicker', $.mwd.mwd_date_and_timepicker, {

		_createMwdElement: function(thisval) {
			var element = this.mwd_dtelement,
			thisid = this.mwd_dtid,
			mindate = element.datepicker('option', 'minDate'),
			maxdate = element.datepicker('option', 'maxDate'),
			thisdate = '',
			thistime = '',
			setdate = new Date(),
			settime = get_currenttime(),
			wsep = element.datepicker('option', 'weekSeperator');
			if(thisval) {
				var weekvalnrs = thisval.split(wsep),
				weekvalnrs1 = weekvalnrs[0].match(/\d/g),
				wyval = parseInt(weekvalnrs[1]),
				wwval = parseInt(weekvalnrs1.join('')),
				setdate = get_first_weekday(wwval, wyval);
				thisdate = thisval;
				thistime = settime;
			}
			if(mindate) {
				var weekvalnrsmin = mindate.split(wsep),
				weekvalnrs1min = weekvalnrsmin[0].match(/\d/g),
				wymin = parseInt(weekvalnrsmin[1]),
				wwmin = parseInt(weekvalnrs1min.join('')),
				wdmin = get_first_weekday(wwmin, wymin);
				element.datepicker('option', 'minDate', wdmin);
			}
			if(maxdate) {
				var weekvalnrsmax = maxdate.split(wsep),
				weekvalnrs1max = weekvalnrsmax[0].match(/\d/g),
				wymax = parseInt(weekvalnrsmax[1]),
				wwmax = parseInt(weekvalnrs1max.join('')),
				wdmax = get_first_weekday(wwmax, wymax);
				element.datepicker('option', 'maxDate', wdmax);
			}
			element.datepicker('setDate', setdate);
			element.datepicker('option', 'showWeek', true);
			element.datepicker('option', 'firstDay', 1);
			element.datepicker('option', 'datePicker', true);
			element.datepicker('option', 'timePicker', false);
			element.datepicker('option', 'monthPicker', false);
			element.datepicker('option', 'weekPicker', true);


			$('#mwd_dp_value_' + thisid).val(thisval);
			$('#mwd_dp_time_' + thisid).val(thistime);
		},

		_setTheCss: function() {
			var element = this.mwd_dtelement,
			dph = parseInt($('.mwd-ui-datepicker').css('height')),
			dpw = parseInt($('.mwd-ui-datepicker').css('width')),
			calh = parseInt($('.ui-datepicker-calendar').outerHeight()),
			hh = parseInt($('.ui-datepicker-header').outerHeight()),
			bh = parseInt($('.ui-datepicker-buttonpane').outerHeight());
			$('.ui-datepicker-buttonpane').css('width', dpw - 3 + 'px');
			$('.ui-datepicker').css({height: dph + 'px', width: dpw + 'px'});
			$('.ui-datepicker').on('mousemove', 'tbody tr', function () { $(this).find('td a').addClass('ui-state-hover'); });
			$('.ui-datepicker').on('mouseleave', 'tbody tr', function() { $(this).find('td a').removeClass('ui-state-hover'); });
			$('.ui-datepicker').find('.ui-datepicker-current-day a').addClass('ui-state-default').removeClass('ui-state-active');
			$('.ui-datepicker').find('.ui-datepicker-current-day').parents('tr').addClass('ui-state-highlight');
		}


    });


	function getNewdate(type, thisval, dateopts) {

		var sep = String(dateopts['sep']),
		dateobject = null, datestring = '', dateval = null;
		if(thisval == '') { thisval = new Date(); }

		//console.log('3 ' + thisval);
		//dateval string
		if(typeof thisval === 'string') {
			dateval = new Date();
			if(type == 'date') {
				try { dateval = new Date($.datepicker.parseDate(dateopts['df'], thisval, dateopts['dfc'])); }
				catch (e) { }
			}
			if(type == 'month' && thisval.match(sep)) {
				try {
					dateval = new Date($.datepicker.parseDate('d MM' + sep + 'yy', thisval, dateopts['dfc']));
					var mnr = $.datepicker.formatDate('m', dateval, '') - 1,
					m = dateopts['monthnames'][mnr],
					y = $.datepicker.formatDate('yy', thisval, '');
					thisval = m + sep + y;
				}
				catch (e) { }
			}
			if(type == 'week' && thisval.match(sep)) {
				var weekvalnrs = thisval.split(sep),
				weekvalnrs1 = weekvalnrs[0].match(/\d/g),
				weekvalnrs2 = weekvalnrs[1].match(/\d/g);
				if(weekvalnrs1 != null && weekvalnrs2 != null) {
					var ww = parseInt(weekvalnrs1.join('')),
					wy = parseInt(weekvalnrs2.join(''));
					if(ww >= 1 && ww <= 52 && wy > 0 && wy.toString().length == 4) {
						dateval = new Date(get_first_weekday(ww, wy));
					}
				}
			}
			dateobject = dateval;
			datestring = thisval;
		}

		//dateval object
		if(typeof thisval === 'object') {
			dateobject = thisval;
			if(type == 'date') {
				datestring = $.datepicker.formatDate(dateopts['df'], thisval, dateopts['dfc']);
			}
			if(type == 'month') {
				var mnr = $.datepicker.formatDate('m', thisval, '') - 1,
				m = dateopts['monthnames'][mnr],
				y = $.datepicker.formatDate('yy', thisval, '');
				datestring = m + sep + y;
			}
			if(type == 'week') {
				var fw = $.datepicker.iso8601Week(thisval),
				y = $.datepicker.formatDate('yy', thisval, '');
				datestring = dateopts['weektext'] + ' ' + fw + sep + y;
			}
		}


		return { 'dateobject': dateobject, 'datestring': datestring };

	}

	function repeatingbtnmin(thisid, stepvalue) {
		var currentvalue = $('#time_slider_' + thisid).slider('value');
		$('#time_slider_' + thisid).slider('value', currentvalue - stepvalue );
	}

	function repeatingbtnmax(thisid, stepvalue) {
		var currentvalue = $('#time_slider_' + thisid).slider('value');
		$('#time_slider_' + thisid).slider('value', currentvalue + stepvalue );
	}

	function get_newtime(thistime, timeopts) {

		thistime = String(thistime);
		if(thistime == '') {	thistime = get_currenttime(); }
		var timestring = thistime,
		thistimex = encodeURIComponent(thistime), lbl,
		timezoneval = '';

		if(timeopts['timezonelist']) {
			var timezonelist = timeopts['timezonelist'], timezonelbl = '';
			timezoneval = -(new Date().getTimezoneOffset() / 60);
			$.map(timezonelist, function (val) {
				lbl = encodeURIComponent(val.label);
				if(thistimex.match(lbl)) {
					timezoneval = val.value;
					timezonelbl = val.label;
				}
			});
			thistime = thistime.replace(timezonelbl, '');
		}

		//curr
		var gettimevalues = get_value_from_time(thistime),
		thishour = gettimevalues['hours'],
		thisminute = gettimevalues['minutes'],
		timevalue = gettimevalues['value'];

		timestring = thishour + ':' + thisminute;

		return {'timestring': timestring, 'timevalue': timevalue, 'timezonevalue': timezoneval};

	};

	//get value from time
	var get_value_from_time = function(time) {
		var hours = 0, minutes = 0, value = 0;
		if(time.match(':')) {
			var splittime = time.split(':'),
			hours = parseInt(splittime[0]),
			minutes = parseInt(splittime[1]);
			var value = Math.floor(hours * 60) + minutes;
			if (hours < 10) { hours = '0' + hours; }
			if (minutes < 10) { minutes = '0' + minutes; }
		}
		return {'hours': hours, 'minutes': minutes, 'value': value};
	};

	//get the current time
	var get_currenttime = function() {
		var d = new Date(),
		hours = d.getHours(),
		minutes = d.getMinutes();
        if(hours < 10) { hours= '0' + hours; }
        if(minutes < 10) { minutes = '0' + minutes; }
		var currenttime = hours + ':' + minutes;
		return currenttime;
	};

	//get first day of the week
	var get_first_weekday = function(w, y){
		var simple = new Date(y, 0, 1 + (w - 1) * 7),
		dow = simple.getDay(),
		first_weekday = simple;
		if (dow <= 4) {
			first_weekday.setDate(simple.getDate() - simple.getDay() + 1);
		} else {
			first_weekday.setDate(simple.getDate() + 8 - simple.getDay());
		}
		return first_weekday;
	};

	//get last day of the week
	var get_last_weekday = function(w, y){
		var simple = new Date(y, 0, 1 + (w - 1) * 7),
		dow = simple.getDay(),
		first_weekday = simple,
		last_weekday = simple;
		if (dow <= 4) {
			first_weekday.setDate(simple.getDate() - simple.getDay() + 1);
		} else {
			first_weekday.setDate(simple.getDate() + 8 - simple.getDay());
		}
		last_weekday.setDate(first_weekday.getDate() + 6);
		return last_weekday;
	};

	/* bad hack : override datepicker so it doesn't close on select */
	$.datepicker._base_selectDate_mwddp = $.datepicker._selectDate;
	$.datepicker._selectDate = function (id, dateStr) {
		var inst = this._getInst($(id)[0]),
		mwddp_inst = this._get(inst, 'mwdDateTimePickerInst');
		if (mwddp_inst) {
			inst.inline = inst.stay_open = true;
			this._base_selectDate_mwddp(id, dateStr);
			inst.inline = inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);
		} else {
			this._base_selectDate_mwddp(id, dateStr);
		}
	};

	/* bad hack : override datepicker so it triggers an event when changing the input field and does not redraw the datepicker on every selectDate event */
	$.datepicker._base_updateDatepicker_mwddp = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function (inst) {
		// don't popup the datepicker if there is another instance already opened
		var input = inst.input[0],
		mwddp_inst = this._get(inst, 'mwdDateTimePickerInst');
		if (mwddp_inst) {
			if ($.datepicker._curInst && $.datepicker._curInst !== inst && $.datepicker._datepickerShowing && $.datepicker._lastInput !== input) {
				return;
			}
			if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {
				this._base_updateDatepicker_mwddp(inst);
				var vis = $(input).datepicker('widget').is(':visible');
				if(vis == true) {
					mwddp_inst._addTimepicker();
					mwddp_inst._addClearBtn();
					mwddp_inst._setTheCss();
					$('#ui-datepicker-div').find('*').addClass('mwd_dp');
				}
			}
		} else {
			this._base_updateDatepicker_mwddp(inst);
		}
	};

}(jQuery));
