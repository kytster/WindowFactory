# Window Factory

Window Factory is the javascript object for creating and managing windows on a web page within the browser window. Each window created by the object looks and behaves like conventional window in the OS, and can be dragged, resized, minimised, maximised, and even closed. Each window has a frame (absolute positioned DIV element) with a title bar and control buttons. Content is represented by IFRAME element, embedded into this DIV.

The solution is rather raw, and should be refactored (someday, maybe), but it works pretty fine, so, following the good practice: if it works - do not touch.

## API

### Constructor
      
#### object WindowFactory = new WindowFactory_(object styles, object orig);
      
where:
          
  **styles** (object, optional) - set of properties, defining look of the window. Object may (or may not) include the following properties:
                    
	.borderWidth (integer, optional) - width of window border in pixels (default 2);
                 
	.borderColor (string, optional) - color of window border and title bar (default '#3333CC');
                 
	.backgroundColor (string, optional) -  background color for window content (default '#ffffff'). 
                                          Might by empty string or false to specify transparent background;
               
	.headerTxtClass (string, optional) The header text in the title bar is wrapped into the SPAN element.
                                     The property allows to define a CSS class for this SPAN element
                                     (default - emopty string);
                                              
	.headerTxtColor (string, optional) If you dont need a whole of CSS class for header text, 
                                      you may define only color (default '#CCCC33').
                                      If the .headerTxtClass is defined, this property is ignored.
  

  **orig** (object, optional) - set of properties, defining the originating point and default size for new windows. Object may (or may not) include the following properties:
  
  	.x (integer, optional) - left offset of originating point for new windows in pixels (default: 10);
	
	.y (integer, optional) - top offset of originating point for new windows in pixels (default: 80);
	
	.w (integer, optional) - default width for new windows in pixels (default:600);
	
	.h (integer, optional) - default height for new windows in pixels (default:400);
	
### Properties

**.shft** (integer) - amount of pixels, each new window is shifted by, regarding previous one. The first window created by the addWindow() method is placed into originating point (if no other position specified). Each new window, created by the method will be shifted by the _shft_ pixels right and down from the previous one (if no other position specified).

**.Windows** (array) - array of objects, representing windows. Windows are placed in the array in the order of creation. When the window is closed by close button (at the right top corner) it is kicked out from the array, and the array is reordered.

### Method

**.addWindow** (src,header_text,pos) - creates new window, places it on screen on top over all previously created windows (if any). Method returns an object, representing created window (see below).

Arguments:

**src** (string / url, optional) - the source attribute for the IFRAME element representing the content area of window.

**header_text** (string, optional) - text for the window header.

**pos** (object, optional) - set of properties, defining position and size of the window. Object may (or may not) include the following properties:
  
  	.x (integer, optional) - left offset of originating point for new windows in pixels (default: 10);
	
	.y (integer, optional) - top offset of originating point for new windows in pixels (default: 80);
	
	.w (integer, optional) - default width for new windows in pixels (default:600);
	
	.h (integer, optional) - default height for new windows in pixels (default:400);
	
	
	
