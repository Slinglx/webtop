/* helper Functions */
var printObj = function(info) {
			var propValue;
			for(var propName in info) {
				propValue = info[propName]
				console.log(propName,propValue);
			}
		};
/* initialize Stage */
var stage = new Kinetic.Stage({
        container: 'container',
        width:  document.viewport.getWidth(),
        height: document.viewport.getHeight()
      });
var baseLayer = new Kinetic.Layer();
   stage.add(baseLayer);
/* Set full size drawing area */
Event.observe(window, "resize", function() {
    var width = document.viewport.getWidth();
    var height = document.viewport.getHeight();
    var dims = document.viewport.getDimensions();     
    stage.setHeight(height);
    stage.setWidth(width);
});

/* Base Class for all Classe in RIG */
var Base = Class.create({
	initialize: function () {
	}
		
});

/** Conector base class 
 *		Data Storage and Connection to Server 
 * 
 * **/
var Connector = Class.create(Base,{
	initialize: function($super,name) {
		$super();
		this.name = name;
		alert("new Element: "+name);
	}
});



/** Application base class 
 * 
 * 
 * **/
var App = Class.create(Base,{	
	initialize: function($super, name){		
		$super();
		this.name = name;
		this.elements = [];		
	},
	/** gets message when a observed UIElement changes its value **/
	valueChangeHandler: function(element) {
		alert("Value chage of element "+element.name+" to "+element.value);
	}
});


/** Element base class 
 * 	 	UI Elements 
 * 
 * **/
var Element = Class.create(Base,{	
	pined: [],
	group: new Kinetic.Group,	
	id: "0",
	size: {x:100,y:100},
	initialize: function($super,name) {
		$super();
		this.name = name;
		this.value = null;
		this.att = [];		
		var mainWidget = null; // hold backgroundwidget for element		
		this.group = new Kinetic.Group();
		this.pined = [];
		this.size = {x:100,y:100};
	},
	/** adds a Object that observes this Element **/
	addValueChangeHandler: function(app) {
		this.changeHandler = app.valueChangeHandler(this);
	},
	pin: function(object) {		
		baseLayer.add(object);		
		object.moveToTop();
		this.pined.push(object);
		baseLayer.draw();	
		this.group.add(object);	
	},
	
	pinElement: function (element) {		
		this.group.add(element.getGroup());			
		element.moveToTop();		
		this.pined.push(element);		
		baseLayer.draw();			
	},
	setMainWidget: function(O) {
		this.mainWidget = O;
		var pined =  this.pined;
		this.mainWidget.on("dragmove",function(info) {						
			pined.each(function(item) {
				item.move({x:info.webkitMovementX,y:info.webkitMovementY});
			});	
		});
	},
	moveToTop: function(){
		this.group.moveToTop();		
	},
	getGroup: function(){
		return this.group;
	},
	move: function(newpos){				
		this.getGroup().move(newpos);
		/*pined.each(function(item) {
			item.move({x:x,y:y});
		});*/	
	},
	resize: function(newSize){		
	},
	
	/** EVENTS **/
	setEvent: function(event,funktion){
		this.group.on(event,funktion);
	}
});



/* GUI ELEMENTS */
/** GUI Element Factory
 * 
 * creates and register all nessesary GUI elements
 * 
 **/
var ElementFactory = new Class.create(Base,{
	initalize: function($super){
		$super();
	},
	create: function(type, params){
		if (type == "window") return new Window(params);
	}
	
});

/** global element factory **/
var elementFactory = new ElementFactory();


/** Button **/

var Button = Class.create(Element,{
	initalize: function(){
	}
});

var FSButton = Class.create(Element,{
	initialize: function($super,x,y){				
		$super();
		var rect = new Kinetic.Rect({
			x:x,
			y:y,
			width:15,
			height:15,
			height:15,
			fill:'rgba(180,180,255,1)',			
			draggable:true,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			cornerRadius:3
		});		
		this.group.add(rect);	
		baseLayer.add(this.group);	   								
	},
	abc: function(){
		alert("abc");
	}
});
/** Window **/
 
var Window = Class.create(Element,{	
	fullScreen:false,
	draw: function(){
	//	alert(this.att.x+"  "+this.att.y+"  "+this.att.width+"  "+this.att.height);		
		this.rect = new Kinetic.Rect({
			x:this.att.x,
			y:this.att.y,
			width:this.att.width,
			height:this.att.height,
			fill:'rgba(180,180,255,1)',
			//stroke:'blue',		
			//strokeWidth:1,
			draggable:true,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			cornerRadius:10
		});		   
		this.setMainWidget(this.rect);
		baseLayer.add(this.rect);			
		var rect = new Kinetic.Rect({
			x:this.att.x,
			y:this.att.y,
			width:this.att.width,
			height:40,
			fill:'rgba(100,100,170,1)',			
			cornerRadius:10
		});	
		this.pin(rect);
		rect = new Kinetic.Rect({
			x:this.att.x,
			y:this.att.y+25,
			width:this.att.width,
			height:40,
			fill:'rgba(180,180,255,1)'			
		});	
		this.pin(rect);
		this.title = new Kinetic.Text({
			x: 10+this.att.x,
			y: 5+this.att.y	,
			text: this.att.name,
			fontSize: 15,
			fontFamily: 'Calibri',
			shadowColor: '#000000',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			fill: 'rgba(180,180,255,1)'	
		});			    		
		this.pin(this.title);		
		var fsb = new FSButton(this.att.x+this.att.width-50,this.att.y+5);
		
		fsb.setEvent("click",function(){this.setFullScreen();});
		
		this.pinElement(fsb);			
		var exit = new Kinetic.Rect({
			x:this.att.x+this.att.width-25,
			y:this.att.y+5,
			width:15,
			height:15,
			height:15,
			fill:'rgba(180,180,255,1)',		
			draggable:true,
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			cornerRadius:3
		});		   
		
		var basex=this.att.x+this.att.width-25;
		var basey=this.att.y+5;
		var redLine = new Kinetic.Line({
			points: [basex+3, basey+3, basex+12, basey+12,basex+8, basey+8,basex+12, basey+3,basex+3, basey+12	],
			stroke: 'red',
			strokeWidth: 2,
			lineCap: 'round',
			lineJoin: 'round'
		});		
		this.pin(exit);
		this.pin(redLine);
		
	},
	setFullScreen: function(){
		alert("click on FS");
		this.fullScreen = !this.fullScreen;
		if (this.fullScreen) {
		} else {
		}
	},	
	initialize: function($super,attributes){  					
		this.att = attributes;
		this.cont = new Array();
		if (this.att.width < 50)  this.att.width = 50;
		if (this.att.height < 50)  this.att.height = 50;
		this.draw();		
	},
	
});
