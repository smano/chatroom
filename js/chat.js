$(function(){
	var socket = io.connect( 'http://'+window.location.hostname+':3000' );

	socket.on('users', function(data){
		$('.names-list').text('');
		$.each(data,function(i,v){
			$('.names-list').append('<li>'+v+'</li>');
		});
	});

	socket.on('push message', function(response){
		$('.messages').append('<li><div class="msg-lhs"><span class="username">'+response.name+'</span> : <span class="msg">'+response.msg+'</span></div><span data-livestamp="'+moment().unix()+'" class="msg-rhs"></span></li>');
		$('.messages').animate({scrollTop: $('.messages').prop("scrollHeight")}, 500);
	});

	$(document).on('keyup','.message-box',function(e){
		var $this = $(this);
		if(e.which === 13){
			var message = $this.val();
			socket.emit('new message', message);
			$this.val('');
			updateDB(localStorage.getItem('username'),message); //Update message in DB
		}
	});

	function updateDB(name,msg){
		$.post('process.php',{method:'update',name:name,msg:msg},function(response){
			console.log(response);
		});
	}

	$('#username').on('keyup',function(e){
		var $this = $(this);
		if(e.which === 13){
			var name = $this.val();
			socket.emit('new user', name, function(response){
				if(response){
					localStorage.setItem('username',name);
					$this.val('');
					$('#userinfo').hide();
					$('#chat-body').fadeIn();					
					loadMessages(); //retrieve messages from Database
				} else{
					$('.validation').text('Username taken!').fadeIn();
				}
			});
		}
	});

	function loadMessages(){
		$.post('process.php',{method:'retrieve'},function(response){
			$.each(JSON.parse(response),function(i,v){				
				$('.messages').append('<li><div class="msg-lhs"><span class="username">'+v.name+'</span> : <span class="msg">'+v.message+'</span></div><span data-livestamp="'+v.created_at+'" class="msg-rhs"></span></li>');
			});
			$('.messages').animate({scrollTop: $('.messages').prop("scrollHeight")}, 500);
		});
	}

	/*** App ***/

	$('.names-list').slimScroll({
	    width: '200px',
    	height: '400px',
    	color: '#ffcc00'
	});

	$('.messages').slimScroll({
	    width: '500px',
    	height: '350px',
    	color: '#3092BF',
    	alwaysVisible: true,
    	start: 'bottom'
	});
});