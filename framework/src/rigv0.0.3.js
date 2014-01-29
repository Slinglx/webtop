
/** helper Functions **/
var MinX  = 0;
var MinY = 0;
var MaxX = 0;
var MaxY = 0;
var stage = null;
//Print Object Propertys
var printObj = function(info) {
	var propValue;
	for(var propName in info) {
		propValue = info[propName]
		console.log(propName,propValue);
	}
};
// Generate an ID-Sting of lenght lenght
function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}		



/** OBJECTS Classes **/
// Base Object 
var Base = function(){
	
	this.ID = makeid(10);
	
};
	Base.prototype.merge = function(source) {
	  for(var key in source) {
		if(source.hasOwnProperty(key)) {
		  this[key] = source[key];
		}
	  }
	 
	  return this;
	}

// watch for property changes
    Base.prototype.watch = function (prop, handler)
    {
        var val = this[prop],
        getter = function ()
        {
            return val;
        },
        setter = function (newval) {
            return val = handler.call(this, prop, val, newval);
        };
        if (delete this[prop]) { // can't watch constants
            if (Object.defineProperty) { // ECMAScript 5
                Object.defineProperty(this, prop, {
                   get: getter,
                   set: setter
                });
            }
            else if (Object.prototype.__defineGetter__ &&
                     Object.prototype.__defineSetter__) //legacy
            {
                Object.prototype.__defineGetter__.call(this, prop, getter);
                Object.prototype.__defineSetter__.call(this, prop, setter);
            }
        }
    };
// unwatch
   Base.prototype.unwatch = function (prop) {
        var val = this[prop];
        delete this[prop]; // remove accessors
        this[prop] = val;
    };
    
/* Stage Class*/
var Stage =  function (containerName){
	Base.call(this);
	
	// initialize Stage 
	this.stage = new Kinetic.Stage({
        container: containerName,
        width:  document.viewport.getWidth(),
        height: document.viewport.getHeight()
      });  
	// Set full size drawing area 
	var self = this;
	Event.observe(window, "resize", function() {
		var width = document.viewport.getWidth();
		var height = document.viewport.getHeight();
		var dims = document.viewport.getDimensions();    
		MaxX = width;
		MaxY = height; 
		self.stage.setHeight(height);
		self.stage.setWidth(width);
	});
	this.apps = new Array();
	this.layer = new Kinetic.Layer();
	this.baseLayer = new Kinetic.Group();
	this.layer.add(this.baseLayer);
	this.stage.add(this.layer);
		
	this.background = new Kinetic.Rect({
		x:0,
		y:0,
		width:this.stage.getWidth(),
		height:this.stage.getHeight(),		
		fill:'rgba(250,255,250,1)',			
		draggable:false		
	});			
	this.baseLayer.add(this.background);	
};
Stage.prototype = new Base(); // inhertance of Base
Stage.prototype.constructor = Stage; //set Constructor for new Object

Stage.prototype.addApp =  function(app){	
	this.apps.push(app);
	app.stage = this;
};
Stage.prototype.remove=  function(app){
	this.apps.remove(app);
};
Stage.prototype.draw=  function(){
	this.stage.draw();
};

   //Application Object
var App = function(name,st){		
	this.name = name;  // Name of the Application
	this.root = null; //Main Element 
	this.stage = st;		
	this.windows =  new Array();		
};
App.prototype = new Base(); // inhertance of Base
App.prototype.constructor = App; //set Constructor for new Object
App.prototype.addWindow = function (win) {
	this.windows.push(win);
	this.stage.baseLayer.add(win.group);
	win.app = this;
}
App.prototype.removeWindow = function (win) {
	this.windows.remove(win);
	this.stage.baseLayer.remove(win.group);
}


//Element 
var Element = function(name){
	Base.call(this);
	this.pinned = new Array();			// pinned elements on this	
	this.group = new Kinetic.Group({
       draggable: false,        
    });
	this.base = null;					// base Grafical element
	this.size = {x:100,y:100};			// start size	
	this.name = name;					// Elements name
	this.value = null;					// Elements Value
	this.att = [];						// other Attributes	

};

Element.prototype = new Base();
Element.prototype.constructor = Element;

	Element.prototype.add = function(object) {												
	  this.group.add(object);	
	  object.moveToTop();	  		
	};
	
	Element.prototype.pin  = function (element) {		
		this.group.add(element.getGroup());			
		element.moveToTop();		
		this.pinned.push(element);				
	};
	Element.prototype.moveToTop =  function(){
		this.group.moveToTop();		
	};
	Element.prototype.getGroup = function(){
		return this.group;
	};
	Element.prototype.move = function(newpos){				
		this.getGroup().move(newpos);		
	};
	Element.prototype.resize = function(newSize){		
		
	};

	Element.prototype.setEvent = function(event,funktion){
		this.group.on(event,funktion);
	};
	Element.prototype.draggable = function(b) {this.group.draggable(b);};

// ElementFactory prduces various Elements
var ElementFactory = function(){
	
};
ElementFactory.prototype = new Base();
ElementFactory.prototype.constructor = ElementFactory;
	ElementFactory.prototype.create =  function(type, params){
		if (type == "window") return new Window(params.name,params);
	};
	
//Button 
var Button = function (name){
	Element.call(this,name);
};
Button.prototype = new Element();
Button.prototype.constructor = Button;

// FullScreen Button for windows
var FSButton = function(x,y) {
	Button.call(this,"FSButton");
	var rect = new Kinetic.Rect({
		x:0,
		y:0,
		width:15,
		height:15,
		height:15,
		fill:'rgba(180,180,255,1)',			
		draggable:false,
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOffset: {x:0,y:0},
		shadowOpacity: 0.5,
		cornerRadius:3	
	});		
	this.group.move({x:x,y:y});	
	this.group.draggable(false);
	this.group.add(rect);	
	//baseLayer.add(this.group);	   								
};
FSButton.prototype = new Button();
FSButton.prototype.constructor = FSButton;

// ExitScreen Button for windows
var ExitButton = function(x,y) {
	Button.call(this,"ExitButton");
	var exit = new Kinetic.Rect({
			x:0,
			y:0,
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
		
		var basex=0;
		var basey=0;
		var redLine = new Kinetic.Line({
			points: [basex+3, basey+3, basex+12, basey+12,basex+8, basey+8,basex+12, basey+3,basex+3, basey+12	],
			stroke: 'red',
			strokeWidth: 2,
			lineCap: 'round',
			lineJoin: 'round'
		});	
	this.group.move({x:x,y:y});	
	this.group.draggable(false);
	this.group.add(exit);	
	this.group.add(redLine);										
};
ExitButton.prototype = new Button();
ExitButton.prototype.constructor = ExitButton;

// ResizeScreen Button for windows
var ResizeButton = function(x,y,win) {
	Button.call(this,"ResizeButton");
	var exit = new Kinetic.Rect({
			x:0,
			y:0,
			width:15,
			height:15,
			height:15,
			fill:'rgba(100,100,255,1)',								
			cornerRadius:3
		});		   		
		var basex=0;
		var basey=0;		
	this.dragging = false;
	this.win = win;
	this.group.move({x:x,y:y});		
	this.group.add(exit);		
	this.draggable(true);
	var self = this;
	this.group.on("dragstart",function(){self.drag(true);});
	this.group.on("dragend",function(){self.drag(false);});	
	this.group.on("mouseenter",function(){self.vis(true);});
	this.group.on("mouseout",function(){self.vis(false);});
	this.group.opacity(0);
	this.dragRect = new Kinetic.Rect({
			x:0,
			y:0,
			width:15,
			height:15,
			height:15,
			lineJoin: 'round',
			stroke: 'blue',
			strokeWidth: 2,
			dash: [33, 10],
			cornerRadius:3
		});		   				
	this.win.app.stage.baseLayer.add(this.dragRect);	
	this.dragRect.moveToTop();
	this.dragRect.visible(false);
};
ResizeButton.prototype = new Button();
ResizeButton.prototype.constructor = ResizeButton;

ResizeButton.prototype.vis = function(val) {
	if (val) {
		var tween = new Kinetic.Tween({
          node: this.group, 
          opacity:1,
          easing: Kinetic.Easings.EaseIn,
          duration: 1
        });
        tween.play();
	} else {
		var tween = new Kinetic.Tween({
          node: this.group, 
          opacity:0,
          easing: Kinetic.Easings.EaseOut,
          duration: 1
        });
        tween.play();
	}
};
ResizeButton.prototype.drag = function(val){
	var mousePos = stage.getPointerPosition()
	var w =  mousePos.x-this.win.x;
	var h =  mousePos.y-this.win.y;	
	this.dragging = val;
	if (val) {
		if (this.win) {
			this.dragRect.setX(this.win.x);
			this.dragRect.setY(this.win.y);
			this.dragRect.setHeight(this.win.height);
			this.dragRect.setWidth(this.win.width);
			this.dragRect.visible(true);
			this.dragRect.moveToTop();
			stage.draw();
		}
	} else {
		var mousePos = this.win.app.stage.stage.getPointerPosition()
		var w =  mousePos.x-this.win.x;
		var h =  mousePos.y-this.win.y;
		this.dragRect.visible(false);
		this.win.setSize(w,h);
		stage.draw();
	}
};
//Window
var Window = function(name,attributes) {	
	Element.call(this.name);	
	this.merge(attributes);	
	this.cont = new Array();
	if (this.width < 50)  this.width = 50;
	if (this.height < 50)  this.height = 50;
	this.fullScreen = false;	
	this.createWindowsElements();	
	this.probagateMouseMove = true;	
	this.draggable(true);
	
};
Window.prototype = new Element();
Window.prototype.constructor = Window;
	// Window methods
	Window.prototype.createWindowsElements = function(){
		this.base = new Kinetic.Rect({
			x:this.x,
			y:this.y,
			width:this.width,
			height:this.height,
			fill:'rgba(180,180,255,1)',			
			shadowColor: 'black',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			cornerRadius:10,			
		});		
		this.add(this.base);							
		this.rect1 = new Kinetic.Rect({
			x:this.x,
			y:this.y,
			width:this.width,
			height:40,
			fill:'rgba(100,100,170,1)',			
			cornerRadius:10
		});	
		this.add(this.rect1);
		this.blend = new Kinetic.Rect({
			x:this.x,
			y:this.y+25,
			width:this.width,
			height:40,
			fill:'rgba(180,180,255,1)'			
		});	
		this.add(this.blend);		
		this.title = new Kinetic.Text({
			x: 10+this.x,
			y: 5+this.y	,
			text: this.name,
			fontSize: 15,
			fontFamily: 'Calibri',
			shadowColor: '#000000',
			shadowBlur: 10,
			shadowOffset: {x:0,y:0},
			shadowOpacity: 0.5,
			fill: 'rgba(180,180,255,1)'	
		});			    		
		this.add(this.title);		
		var self = this; 
		this.fsb = new FSButton(this.x+this.width-50,this.y+5);		
		this.fsb.setEvent("mousedown touchstart",function(){self.setFullScreen();});
		this.pin(this.fsb);			
		this.exit = new ExitButton(this.x+this.width-25,this.y+5);
		this.exit.setEvent("mousedown touchstart",function(){self.onExit();});
		this.pin(this.exit);
		this.resize = new ResizeButton(this.x+this.width-15,this.height+this.y-15,this);		
		this.pin(this.resize);		
		this.setEvent("mousedown touchstart",function(evt){self.mouseDown(evt);});
		this.setEvent("mouseup touchend",function(evt){self.mouseUp(evt);});
		this.setEvent("dragend",function(evt){self.x = self.group.getX();self.y=self.group.getY();});
		
	};
	Window.prototype.mouseUp = function(evt){		
	};
	Window.prototype.mouseDown  = function(evt){		
		var x = evt.x-this.group.getX(); // Locale Position
		var y = evt.y-this.group.getY();				
	};
	

	Window.prototype.setFullScreen = function(){		
		this.fullScreen = !this.fullScreen;
		if (this.fullScreen) {						
			this.old = {w:this.base.width(),h:this.base.height(),x:this.group.getX(),y:this.group.getY()};		
			this.group.setX(0);
		    this.group.setY(0);
		    this.setSize(this.app.stage.stage.getWidth()-40,this.app.stage.stage.getHeight()-40);
		    this.app.stage.draw();
		} else {
			if (this.old != null) {
				this.group.setX(this.old.x);
				this.group.setY(this.old.y);
				this.setSize(this.old.w,this.old.h);
				this.app.stage.draw();
			}
		}
	};
	Window.prototype.onExit = function() {
		var self = this;
		var tween = new Kinetic.Tween({
          node: self.group, 
          duration: 0.6,
          blurRadius: 0,
          opacity:0,
          easing: Kinetic.Easings.EaseInOut
        });
		tween.play();
		//TODO: send Message "exit" to App 
	}
	Window.prototype.setSize = function(w,h) {
		this.base.width(w);
		this.base.height(h);
		this.rect1.width(w);
		this.blend.width(w);
		var fx = this.fsb.group.getAttr('x');
		this.fsb.move({x:w-50-fx,y:0});	
		fx = this.exit.group.getAttr('x');
		this.exit.move({x:w-25-fx,y:0});	
		fx = this.resize.group.getAttr('x');
		var fy = this.resize.group.getAttr('y');
		this.resize.move({x:w-10-fx,y:h-10-fy});
		this.width=w;
		this.height=h;
	};
	
	//*/
//Layout
Layout = function() {
	Element.call(this,"layout");
};
Layout.prototype = new Element();
Layout.prototype.constructor = Layout;

HorizontalLayout = function() {
	Layout.call(this,"HorizontalLayout");
};
HorizontalLayout.prototype = new Element();
HorizontalLayout.prototype.constructor = Layout;



/** init Kinetic and Drawing area**/		

/** Global Objects **/
var elementFactory = new ElementFactory();
		

