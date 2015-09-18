function datepickerInit(){

    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekHeader: 'Нед',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };

    $('.datepicker-wrap').each(function(){
        var placeholder = $(this).find('.datepicker-placeholder');
        $(this).find('.datepicker').datepicker({
            dateFormat:'dd.mm.yy',
            onSelect:function(arg){
                placeholder.text(arg);
                $(this).parent().find('.datepicker').removeClass('datepicker-error error');
            }
        });
    });

}

function maskedInputs(){
    $('.tel-mask').each(function(){
        var dataMask = $(this).data('mask');
        $(this).mask(dataMask);
    });

}

function selectStyling(selects){

    selects.each(function(){
        var itemSelect = $(this).find('select');
        itemSelect.wrap('<div class="select-main-wrap"></div>');
        var item = $(this).find('.select-main-wrap');
        itemSelect.addClass('hiden');
        item.append('<div class="select-main"><div class="select-top"><span class="select-text"></span><span class="select-icon"></span></div><div class="select-list"><ul></ul></div></div>');
        var optLength = itemSelect.find('option').length;
        for(var i=0;i<optLength;i++){
            var optValue = itemSelect.find('option').eq(i).attr('value');
            var optText = itemSelect.find('option').eq(i).text();
            var listItem = $('<li data-value="'+optValue+'"></li>').text(optText);
            item.find('.select-list ul').append(listItem);
        }

        if(typeof itemSelect.attr('placeholder') != "undefined"){
            var placeholder = itemSelect.attr('placeholder');
            item.find('.select-text').text(placeholder);
            if(typeof itemSelect.attr('required') != 'undefined'){
                item.addClass('error-hiden error');
            }
        }
        else{
            var firstItem = item.find('.select-list ul li').eq(0).text();
            item.find('.select-text').text(firstItem);
        }
    });

    $(document).on('click','.select-list ul li', function(){

        var parent = $(this).parents('.select-main-wrap');
        parent.removeClass('error error-hiden');
        var value = $(this).attr('data-value');
        var text= $(this).text();
        parent.find('select').val(value).prop('selected',true);
        parent.find('.select-text').text(text);

        var list = $(this).parents('.select-main');
        $('.select-main').removeClass('worked');
        list.addClass('worked');

        slideList(list);

    });

    $(document).on('click','.select-top',function(){

        var list = $(this).parents('.select-main');
        slideList(list);
    });

    function slideList(list){
        $('.select-main:not(.worked) .select-list').slideUp(300);
        if(list.is('.active')){
            list.removeClass('active');
            list.find('.select-list').slideUp(300);
        }
        else{
            list.addClass('active');
            list.find('.select-list').slideDown(300);
        }
    };

    $(document).mouseup(function (e) {
        var container = $(".select-main");
        if (container.has(e.target).length === 0){
            $('.select-main').removeClass('active worked');
            $('.select-main .select-list').slideUp(300);
        }
    });

}

function popup(){
    $('.popup').fancybox({
        padding:0,
        fitToView:false,
        autoSize:true,
        wrapCSS:'dashboardPopup'
    });
}
function statementPopup(){
    $('.modal').fancybox({
        padding:0,
        fitToView:false,
        autoSize:true,
        wrapCSS:'statement-form-popup-id'
    });
}

$(document).ready(function(){

    $('.checkbox-wrap label').click(function (e) {
        if ($('input', this).is(':checked')) {
            $(this).children('span').addClass('checkedCheckboxColor');
        } else {
            $(this).children('span').removeClass('checkedCheckboxColor');
        }
    });

    datepickerInit();
    maskedInputs();
    selectStyling($('.registration-select-wrap'));
    popup();
    statementPopup();

});
