$(function() {
    
    //INIT THE CLIENT
    var list = $('#ajax-list'); 
    var criteria = $('form.criteria');
    var meta = $('#browser .meta');
    var keyup_timer = false;
    var section = window.location.pathname; 
    
    meta.sort = meta.find('.sort select');
    meta.dir = meta.find('.sort a.order'); 
    list.css('min-height', document.documentElement.clientHeight - 240);
    
    //set the section
    console.log(window.location.pathname);
    console.log(section);
    window.section = section;
    
    var old_q = false; //init old_query
    var limit = 5;
    var page = 0;
    var pages = 0;
    
    var Browser = {
        table: false,
        keyword: false,
        q: false,
        parent: list.parent().get(0),
        count:0,
        onRow: {
            '/admin/apps': function (row) { 
                var ret = '<tr id="row-'+row.id+'" rel="'+row.id+'"><td><h4>'+row.name+'</h4></td></tr>';
                return ret;
            },
            '/admin/badges':function (row) {
               var ret = '<tr id="row-'+row.id+'" rel="'+row.id+'"><td><h4>'+row.name+'</h4></td></tr>';
                return ret;
                
            }, '/admin/trigger': function (row) { 
                var ret = '<tr id="row-'+row.id+'" rel="'+row.id+'"><td><h4>'+row.name+'</h4></td></tr>';
                return ret;
            }, '/admin/trigger': function (row) { 
                var ret = '<tr id="row-'+row.id+'" rel="'+row.id+'"><td><h4>'+row.name+'</h4></td></tr>';
                return ret;
            }
        },
        update: function(options) {
          //  alert(section);
            var self = Browser;
            self.keyword = criteria.find('input[name=keyword]').val();
            self.subject = criteria.find('input[name=subject]').val() || 'apps';
            self.q = criteria.serialize(); 
            
            if(old_q == self.q && !options) {
            	return(false);
            }
            else {
            	old_q = self.q;
            }
            	
            $('#browser .create.button.openbox').attr('rel',section+'/'+self.subject+'/create');
            $('#browser .import.button.openbox').attr('rel',section+'/'+self.subject+'/import');
            
            page = options.page?parseInt(options.page):0;
            if(page < 0) page = 0;
            
            var sort = meta.sort.val();
            var dir = meta.dir.hasClass('desc')?'-1':'1';
            
            var offset = page*limit;
            
            
            $.getJSON(section+'/'+self.subject+'/search',self.q+'&offset='+offset+'&limit='+limit+'&sort='+sort+'&dir='+dir, function (response) { 
                var html = '';
                self.count = response.results.length;//response.count;
                self.table = $('<table class="list"></table>');
                list.empty().append(self.table);
                console.log(response); 
                $.each(response.results, function(i,row) {
                    html += self.onRow[section+"/"+self.subject].call(self,row);
                });
                self.table.html(html); 
                // Pagination
                var pagination = new Array();
                pages = Math.floor(self.count / limit) + 1;
                
                for(i = 0; i < response.count / limit; i++) {
                	if(Math.abs(page - i) < 6 || i < 1 || i > pages-2)
                	pagination.push('<a rel="'+i+'"'+(page==i?' class="selected"':'')+'>'+(i+1)+'</a>');
                }
                
                meta.find('.pagination').html(pagination.join(' | '));
                meta.find('.found').html('page'+' <b>'+(page+1)+'</b> / '+pages+'');
            });
        }
    }
    criteria.change(Browser.update); 
    Browser.update(true);
    
    
	// Object handles items (right panel)
	var ObjectPane = {
		url: false,
		load: function(url, callback) {
			this.url = url;
			
			$('#object').show().find('.ajax').hide().load(url, function() {
				$(this).show();
				
				if(object_tab && $(this).find('.tabs li[rel='+object_tab+']').click().length == 1) {}
				else
					$(this).find('.tabs li:first').click();
				
			//	loadFeed();
				
				$(this).find('.attach').each(function() {
		//			createUploader(this);
				});
				
			//	$(this).find('.tags:empty').html('<p>'+loc('add_tags')+'</p>');
				
				if(callback)
					callback.call(this);
			});
		},
		hide: function() {
		},
		reload: function() {
			this.load(this.url);
		}
	}
	window.ObjectPane = ObjectPane;
	var object_tab = $.cookie('object_tab_'+section);
	$('#object').delegate('.tabs li', 'click', function() {
		if($(this).attr('rel')) {
			object_tab = $(this).attr('rel');
			$.cookie('object_tab_'+section, object_tab);
		}
	});
    
    list.delegate('tr', 'click', function() {
    	if($(this).attr('rel')) {
    	    var subject = criteria.find('input[name=subject]').val() || 'apps';
    		window.location.hash = 'id:'+$(this).attr('rel');
    		url_id = $(this).attr('rel');
    		
    		$(this).addClass('selected').siblings().removeClass('selected');
    		ObjectPane.load(section+'/'+subject+'/show/'+$(this).attr('rel'));
    	}
    });
    $('.tabs li').live('click', function() {
    	if($(this).attr('rel')) {
    		$(this).siblings().removeClass('selected');
    		$(this).addClass('selected');
    		
    		$('.tab').hide();
    		$($(this).attr('rel')).show();
    	}
    });
    
    $('#sidebar li').live('click', function() { 
    	$(this).addClass('selected').siblings().removeClass('selected');
    	$(this).parents('ul').next('input').val($(this).attr('rel')).change().submit();
    });
    
    // Openbox
	$('#container .openbox, a.openbox').live('click', function() {
		var self = $(this);
		self.addClass('hover');
		
		var box = $('<div class="openbox loading"><span class="arrow"></span><div class="ajax"></div><a class="x"></a></div>');
		$(document.body).append(box);
		
		if($(this).hasClass('openbox-wide')) box.addClass('wide');
		
		if($(this).attr('rel'))
			box.find('div.ajax').load($(this).attr('rel'), function() {
				box.removeClass('loading');
				box.find('input[type=text], textarea').eq(0).focus();
			});
			
		
		var offset = $(this).offset();
		offset.left += $(this).get(0).offsetWidth / 2;
		offset.top += $(this).get(0).offsetHeight;
		
		if(offset.left + 40 > document.body.clientWidth)
			box.addClass('tight');
		
		if(offset.left < 280)
			box.addClass('left');
		
		box.css(offset).fadeIn(250);
		
		var hide = function(e) {
			if(e.type == 'close' || $(e.target).is('a.x') || (e.target != box.get(0) && $(e.target).parents('div.openbox').length == 0)) {
				box.fadeOut(100, function() {
					$(this).remove();
				});
				self.removeClass('hover');
			}
		};
		
		$(document.body).click(hide);
		box.find('a.x').click(hide);
		
		box.bind('close', hide)
	})
	 
	 
	 
	function split( val ) {
		return val.split( /\ \s*/ );
	}
	function extractLast( term ) {
		return split( term ).pop();
	}
 
	$('.feed form textarea').autocomplete({
		source: function( request, response ) {
		    if(extractLast(request.term).substring(0,1) == "@") {
		      response ([{ 'label':'user1', 'data': {'id':'IDOIJSDOIJF','name':'hello'} }]);
		    }
		    else if (extractLast(request.term).substring(0,1) == "#") {
		      response ([{ 'label':'trigger1', 'data': {'id':'asjkljklasjklas','name':'ZU SPät'} }]);
		    }
		    console.log(response);
		    return response;
			/*$.getJSON( "/feed/mentions/search", {
				term: extractLast( request.term )
			}, response );*/
		},
		search: function() {
			// custom minLength
			var term = extractLast( this.value );
			console.log("val:"+this.value);
			console.log("term:"+term);
			console.log("term???:"+term.substring(0,1));
			if ( term.length < 2 || (term.substring(0,1) != "@" && term.substring(0,1) != "#")) {
				return false;
			}
		},
		focus: function() {
			// prevent value inserted on focus
			return false;
		},
		select: function( event, ui ) {
			var terms = split( this.value );
			var users = $(this).parent().children('input[name="users"]').val().split(',').push(ui.item.data.id).join(',');
			
			// remove the current input
			terms.pop();
			// add the selected item
			
			console.log(users);
			terms.push( ui.item.label+"("+ui.item.data.id+")" );
			// add placeholder to get the comma-and-space at the end
			terms.push( "" );
			this.value = terms.join( " " );
			return false;
		}
	}); 
	        
/*	            .live('keyup', function() {
	    
	    
		var userlookupmatch = this.value.substr(0, this.selectionEnd).match(/@(.+)/); 
		var threadlookup = this.value.substr(0, this.selectionEnd).match(/#(.+)/); 
		$(this).next('ul').remove();
		console.log(userlookupmatch);
		if(userlookupmatch) { 
		   // alert("okay letz look");
			userlookupmatch = userlookupmatch[1].toLowerCase();
			var ul = '';
			
			$.each(data.users, function(i, user) {
				if(user.name.toLowerCase().indexOf(match) == 0) {
					ul += '<li rel="'+user._id+'">'+user.name+'</li>';
				}
			});
			
			$(this).after('<ul>'+ul+'</ul>');
		}
		
		if(threadlookup) {
		  alert("okay thread lookup");
		}
	}); */
	$('#object').delegate('.tags', 'click', function(e) {
		if(!$(this).hasClass('edit')) {
			var text = [];
			$(this).find('a').each(function() {
				text.push($(this).text());
			});
			text = text.join(', ');
			
			var self = $(this).addClass('edit');
			
			$(this).html('<input type="text" />');
			
			var update = function() {
				var val = input.val()
				var tags = val.split(', ');
				
				self.empty().removeClass('edit').hide().fadeIn();
				
				$.each(tags, function(i, v) {
					self.append('<a>'+html(v)+'</a>');
				});
				
				if(val != text) {
					$.post(self.parents('.editbox').attr('rel'), {
						field: 'tags',
						value: val
					});
				}
				
				if(val == '') {
					self.html('<p>'+loc('add_tags')+'</p>');
				}
			};
			
			var input = $(this).find('input').val(text).focus().blur(update);
			
			input.keypress(function(e) {
				var code = (e.keyCode ? e.keyCode : e.which);
				if(code == 13) update();
			});
		}
	});
	$('#object').delegate('dd', 'click', function(e) {
	    /*console.log(this);
	    console.log($(this)); */
		if(!$(this).hasClass('edit') && !$(e.target).is('a')) {
			var text = $(this).text();
			var self = $(this).addClass('edit');
			
			if($(this).hasClass('multiline'))
				$(this).html('<textarea rows="'+(text.split("\n").length - 1)+'"></textarea>');
			else
				$(this).html('<input type="text" />');
			
			var update = function() {
				var val = input.val();
				self.html(val).removeClass('edit').hide().fadeIn();
				
				if(val != text) {
					$.post(self.parents('.editbox').attr('rel'), {
						field: self.attr('rel'),
						value: val
					});
				}
			};
			
			var input = $(this).find('input,textarea').val(text).focus().blur(update);
			
			if(!$(this).hasClass('multiline')) {
				input.keypress(function(e) {
					var code = (e.keyCode ? e.keyCode : e.which);
					if(code == 13) update();
				});
			}
		}
	});
	
	$('#object').delegate('.editable', 'click', function(e) {
		if(!$(this).hasClass('edit') && !$(e.target).is('a')) {
			var text = $(this).text();
			var self = $(this).addClass('edit');
			
			$(this).html('<input type="text" />');
			
			var update = function() {
				var val = input.val();
				self.html(val).removeClass('edit').hide().fadeIn();
				
				if(val != text) {
					$.post(self.parents('.editbox').attr('rel'), {
						field: self.attr('rel'),
						value: val
					});
				}
			};
			
			var input = $(this).find('input,textarea').val(text).focus().blur(update);
			
			if(!$(this).hasClass('multiline')) {
				input.keypress(function(e) {
					var code = (e.keyCode ? e.keyCode : e.which);
					if(code == 13) update();
				});
			}
		}
	});
	
	$('#object').delegate('.edit-description', 'click', function(e) {
		var textarea = $(this).parent().prev();
		
		var text = textarea.text();
		var self = textarea.addClass('edit');
		
		textarea.html('<textarea class="autoresize"></textarea>');
		
		var update = function() {
			var val = input.val();
			self.html(val).removeClass('edit').hide().fadeIn();
			
			if(val != text) {
				$.post(self.parents('.editbox').attr('rel'), {
					field: 'description',
					value: val
				});
			}
		};
		
		var input = textarea.find('textarea').val(text).focus().blur(update).keyup();

/*function htmlp(string) {
    string = string.replace(/((https?)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]!\?])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    });
	
	string = string.replace(/((?:\S+)@(?:\S+))([.,?!)]?(\s|$))/g, '<a href="mailto:$1">$1</a>$2');
	string = '<p>'+string.replace(/\n/g, '<br />').replace(/(\<br \/\>\s*){2,}/g, '</p><p>')+'</p>';
	
	return string;
}*/

    });
});


