$('.form_date').datetimepicker({
        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: true,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		keyboardNavigation:true
 });

$('.form_date').datetimepicker().on('changeDate', function(ev){
    date = getDate(ev.date);
});

