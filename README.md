# Window Factory

Window Factory is the javascript object for creating and managing windows on a web page within the browser window. Each window created by the object looks and behaves like conventional window in the OS, and can be dragged, resized, minimised, maximised, and even closed. Each window has a frame (absolute positioned DIV element) with a title bar and control buttons. Content is represented by iFRAME element, embedded into this DIV.

The solution is rather raw, and should be refactored (someday, maybe), but it works pretty fine, so, following the good practice: if it works - do not touch.

## API

### Constructor
      
#### object WindowFactory = new WindowFactory_(object styles, object orig);
      
where:
          
  **styles** (object, optional) - set of attributes, defining look of the window. Object may (or may not) include the following properties:
                    
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
  
