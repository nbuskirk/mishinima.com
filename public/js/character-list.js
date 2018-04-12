$(function(){
	////
	$('form[name="create-character"]').submit(function(e){
		
		$.ajax({
			type: 'POST',
			url: '/character',
			data: {
				name: $('input[name="name"]').val(),
				description: $('textarea[name="description"]').val(),
				portrait: $('input[name="portrait"]').val(),
				moves: $('textarea[name="moves"]').val()
			},
			success: function() {},
			dataType: 'text'
		})

	});

})