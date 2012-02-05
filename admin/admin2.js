//Plugin Labyrinth Admin
(function($,window,document,undefined){
	$.fn.labygraph = function(options){
		//default settings
		options = $.extend({
			background: "#222",
			fps: 60,
			addNodeForm: null,
			onNodeClick: function(){},
			onGraphClick: function(){},
			onPathClick: function(){}
		},options);
		
		//set window.graphs
		window.labygraph = {};
		window.labygraph.items = [];
		
		var handlerObject = {
			"viewnode": function() {
				$.ajax({
					url: "./index.php?_a=1",
					type:"POST",
					dataType: "json",
					data: {
						action: "showNode",
						level: this.qno
					},
					success: function(data){
						if(data.status != 600){
							console.log(data.message);
							return;
						}
						$("#viewNode").html(data.html).find("img").css({
							width: 50,
							height: 50
						});
						console.log(data.html);
					}
				})
			},
			"editnode": function(){
				$("#addNode input[name=posX]").val(this.posX);
				$("#addNode input[name=posY]").val(this.posY);
				$("#addNode input[name=file]").click().change(function(){
					$("#addNode").ajaxSubmit({
						dataType:"json",
						success: function(data){
							if(data.status!=600){
								console.log(data.message);
								return;
							}
							console.log("edited successfully");
						}
					});
				});
			},
			"deleteNode": function(){
				
			},
			"createPath": function() {
				
			}
		}
		
		var createNode = function(options){
			var graph = options.graph;
			var node = graph.display.arc({
				x: options.posX,
				y: options.posY,
				radius: 5,
				start: 0, end: 360,
				fill: "#fff"
			});
			//set the id and position for the node
			node.qno = options.nodeId;
			node.posX = options.posX;
			node.posY = options.posY;
			//next step is to bind the event listeners to the node
			node.bind("mouseenter",function(){
				this.radius=7; 
				this.redraw();
				//view the node
				handlerObject["viewnode"].apply(this,[]);
			}).bind("mouseleave", function(){
				this.radius=5; 
				this.redraw();
				$("#viewNode").html("");
			}).bind("click",function(){
				graph.mouse.cancel();
				var _tselector = $("#actionType select[name=actionType]").val();
				if(typeof _tselector === "undefined")
					return;
				handlerObject[_tselector].apply(this,[]);
			});
			graph.nodes.push(node);
			graph.addChild(node);
		}
		//make it available Globally, to use it as an API
		window.labygraph.createNode = createNode;
		
		//make it available for cascading
		return this.each(function(){
			
			//create a graph for each object in the list
			var graph = oCanvas.create({
				canvas: "#"+this.id,
				background: options.background,
				fps: options.fps
			});
			//an array containing the reference to all the nodes
			graph.nodes=[];
			//set the default action
			graph.nodeAction = "select";
			
			//When a click happens in graph, it means creating a new node 
			graph.bind("click", function(e){
				e.preventDefault();
				var self= this;
				//display the container for image upload
				$("#addNode input[name=posX]").val(e.x);
				$("#addNode input[name=posY]").val(e.y);
				$("#addNode input[name=file]").click().change(function(){
					$("#addNode").ajaxSubmit({
						dataType:"json",
						success: function(data){
							if(data.status!=600){
								console.log(data.message);
								return;
							}
							createNode.apply(self,[{
								graph: graph,
								posX: data.posX,
								posY: data.posY,
								nodeId: data.nodeId
							}]);
						}
					});
				});
			});
			
			window.labygraph.items.push(graph);
			window.graph = graph;
		});
	}
})(jQuery, this, this.document);

(function($,window,document,undefined){
	//extend jQuery
	$("#addNode, #removeNode, #addPath, #removePath").submit(function(e){
		e.preventDefault();
		$(this).ajaxSubmit({
			dataType:"json",
			success: function(response){
				console.log(response);
			}
		});
		return false;
	});

	$("#graph").labygraph({
		
	});
	
})(jQuery,this,this.document);