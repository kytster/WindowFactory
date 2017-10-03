function WindowFactory_(styles,orig){
	if(orig)this.origin={x:(orig.x?orig.x:10),y:(orig.y?orig.y:80),w:(orig.w?orig.w:600),h:(orig.h?orig.h:400)};
	else this.origin={x:10,y:80,w:600,h:400};
	this.shft=24;
	var shid=0;
	if(styles)
		this.styles={
			borderWidth:(styles.borderWidth||2),
			borderColor:(styles.borderColor||'#3333CC'),
			backgroundColor:(styles.backgroundColor !== undefined ? styles.backgroundColor :'#ffffff'),
			headerTxtClass:(styles.headerTxtClass||''),
			headerTxtColor:(styles.headerTxtColor||'#CCCC33')
		};
	else this.styles={borderWidth:2,borderColor:'#3333CC',backgroundColor:'#ffffff',headerTxtClass:'',headerTxtColor:'#CCCC33'};
	var self=this;
	this.Windows=[];
	var Window_=function(idx,src,headerTxt,styles,place,clckHndl){
		var idx=idx;
		var clickHandler=clckHndl||null;
		var wnd=window,doc=wnd.document;
		var self=this;
		var drugging=false,md_set=false,mup_set=false,iefx,drug_type,cX,cY;
		var getY=function(im){
			var imY=im.offsetTop,cnt=im.offsetParent;
			while(cnt!=null){imY+=cnt.offsetTop;cnt=cnt.offsetParent;}
			return imY;
		}
		var getX=function(im){
			var imX=im.offsetLeft,cnt=im.offsetParent;
			while(cnt!=null){imX+=cnt.offsetLeft;cnt=cnt.offsetParent;}
			return imX;
		}
		var createButton=function(handler,label,squeeze){
			var btn=doc.createElement('span');
			btn.style.font='bold 6pt monospace';btn.style.cursor='pointer';btn.style.verticalAlign='middle';btn.style.borderWidth='2px';
			btn.style.paddingLeft=btn.style.paddingRight=squeeze ? '1px' : '5px';
			btn.style.color='#cccccc';btn.style.borderStyle='outset';btn.style.paddingBottom='2px';btn.style.paddingTop='1px';
			btn.onmouseover=function(){btn.style.color='#ffffff';btn.style.borderStyle='outset';btn.style.paddingBottom='2px';btn.style.paddingTop='1px';}
			btn.onmousedown=function(){btn.style.color='#ffffff';btn.style.borderStyle='inset';btn.style.paddingBottom='1px';btn.style.paddingTop='2px';}
			btn.onmouseup=function(){btn.style.color='#ffffff';btn.style.borderStyle='outset';btn.style.paddingBottom='2px';btn.style.paddingTop='1px';}
			btn.onmouseout=function(){btn.style.color='#cccccc';btn.style.borderStyle='outset';btn.style.paddingBottom='2px';btn.style.paddingTop='1px';}
			btn.onclick=function(){handler(btn);}
			btn.innerHTML=label;
			return btn;
		}
		this.active=false;
		this.closed=true;
		this.maxed=false;
		this.mined=false;
		this.borderColor=styles.borderColor;
		this.borderWidth=styles.borderWidth;
		this.Wmin=200;
		this.Hmin=100;
		this.zStep=100;	
		this.controlsTdIdx=2;
		this.headerTxt=headerTxt||'';
		this.headerTxtClass=styles.headerTxtClass;
		this.headerTxtClr=styles.headerTxtColor;
		this.initW=this.currentW=place.w;
		this.initH=this.currentH=place.h;
		this.initX=this.currentX=place.x;
		this.initY=this.currentY=place.y;
		this.div=doc.createElement('Div');
		this.div.style.zIndex=this.zStep*(idx+1);this.div.style.position='absolute';this.div.style.display='none'; 
		this.div.style.border=this.borderWidth.toString()+'px solid '+this.borderColor;
		var hHTML='<table width="100%" cellspacing=0 sellpadding=0><tr style="background-color:'+this.borderColor+';"><td></td>';
		if(this.headerTxtClass)hHTML+='<td class="'+this.headerTxtClass;
		else hHTML+='<td style="color:'+this.headerTxtClr+';font:bold 12pt Helvetica, sans-serif;text-align:center;';
		hHTML+='">'+this.headerTxt+'</td>';
		hHTML+='<td width="70px" align="right"><div style="width:1px;height:100%;display:inline-block;zoom:1;*display:inline;vertical-align:middle;">&nbsp;</div></td>';
		hHTML+='</tr></table>'
		this.div.innerHTML=hHTML;
		var storePos=function(){self.initW=self.currentW;self.initH=self.currentH;self.initX=self.currentX;self.initY=self.currentY;}
		var restorePos=function(){
			self.currentW=self.initW;self.currentH=self.initH;
			if(!self.mined){self.currentX=self.initX;self.currentY=self.initY;}
			adjustDims();
		}
		this.header=this.div.children[0].children[0].children[0].children[1];
		this.controls=this.div.children[0].children[0].children[0].children[this.controlsTdIdx];
		this.buttonPressed=function(btn){
			switch(btn.innerHTML){
				case '[ ]':self.triggerMax();break;
				case '_':self.triggerMin();break;
				case 'X':self.hide();break;
			}
		}
		for(var indx in lbls=['_','[ ]','X'])this.controls.appendChild(createButton(this.buttonPressed,lbls[indx],lbls[indx]=='[ ]'));
		this.ifr=doc.createElement('iframe');var f=this.ifr;
		f.style.position='relative';f.style.width='100%';f.style.border='none';
		if(styles.backgroundColor)f.style.backgroundColor=styles.backgroundColor;
		f.src=src;
		this.div.appendChild(f);
		iefx=doc.all?this.borderWidth:0;
		var sh=doc.createElement('Div')
		sh.onclick=function(){if(clickHandler)clickHandler(idx);};
		var shst=sh.style;
		shst.position='absolute';shst.zIndex=(this.zStep*(idx+1))+(this.zStep/2);shst.display='none';shst.left='0px';shst.top='0px';
		shst.backgroundColor='#CCCCCC';
		doc.body.appendChild(sh);
		var coverFrame=function(){
			shst.top=getY(f).toString()+'px';shst.left=getX(f).toString()+'px';
			shst.width=(parseInt(self.div.style.width)+2*self.borderWidth).toString()+'px';
			shst.height=(parseInt(f.style.height)+2*self.borderWidth).toString()+'px';;
			shst.display='block';
			shst.opacity=0;
		}
		var uncoverFrame=function(){shst.display='none';}
		var setMouseDownCapture=function(unset){
			if(unset){if(md_set)unsetEvent('mousedown',mouseDown);md_set=false;}
			else{if(!md_set)setEvent('mousedown',mouseDown);md_set=true;}
		}
		var setMouseUpCapture=function(unset){
			if(unset){if(mup_set)unsetEvent('mouseup',mouseUp);mup_set=false;}
			else{if(!mup_set)setEvent('mouseup',mouseUp);mup_set=true;}
		}
		var setEvent=function(eventType,handler){
			if(doc.attachEvent)doc.attachEvent('on'+eventType,handler);
			else wnd.addEventListener(eventType,handler,true);
		}
		var unsetEvent=function(eventType,handler){
			if(doc.attachEvent)doc.detachEvent('on'+eventType,handler);
			else wnd.removeEventListener(eventType,handler,true);
		}
		var getCursorStatus=function(e){
			var x=e.clientX+doc.documentElement.scrollLeft,y=e.clientY+doc.documentElement.scrollTop,lX,rX,tY,bY;
			lX=getX(self.div);rX=lX+parseInt(self.div.clientWidth)+iefx;tY=getY(self.div);bY=tY+parseInt(self.div.clientHeight)+iefx;
			if(lX<x&&x<rX-70&&tY<y&&y<tY+iefx+parseInt(self.header.clientHeight))return 'hdr';
			if(lX-1<x&&x<=lX+self.borderWidth&&tY<y&&y<bY&&!self.mined)return 'lb';
			if(rX-1<x&&x<=rX+self.borderWidth+1&&bY-1<y&&y<=bY+self.borderWidth+1&&!self.mined)return 'cnr';
			if(rX-1<x&&x<rX+self.borderWidth+1&&tY<y&&y<bY&&!self.mined)return 'rb';
			if(lX<x&&x<rX&&bY-1<y&&y<bY+self.borderWidth+1&&!self.mined)return 'bb';
			return 'out';
		}
		var mouseDown=function(evt){
			var e=evt||event;
			coverFrame();
			cX=e.clientX;cY=e.clientY;
			setMouseUpCapture();
			setMouseDownCapture(true);
			unsetEvent('mousemove',cursorMoved);
			setEvent('mousemove',cursorMoved);
			self.drugging=true;
		}
		var mouseUp=function(evt){
			setMouseUpCapture(true);
			self.drugging=false;
		}
		var cursorMoved=function(evt){
			if(!self.active)self.deactivate();
			else{
				var e=evt||event;
				if(!self.drugging){
					drug_type=getCursorStatus(e);
					switch(drug_type){
						case 'hdr':coverFrame();setMouseDownCapture();doc.body.style.cursor='move';break;
						case 'rb':coverFrame();setMouseDownCapture();doc.body.style.cursor='e-resize';break;
						case 'bb':coverFrame();setMouseDownCapture();doc.body.style.cursor='s-resize';break;
						case 'cnr':coverFrame();setMouseDownCapture();doc.body.style.cursor='se-resize';break;
						default:uncoverFrame();setMouseDownCapture(true);doc.body.style.cursor='default';
					}
				}else{
					var dX=e.clientX-cX,dY=e.clientY-cY;
					switch(drug_type){
						case 'hdr':self.currentX+=dX;self.currentY+=dY;break;
						case 'rb':self.currentW+=dX;break;
						case 'cnr':self.currentW+=dX;
						case 'bb':self.currentH+=dY;break;
					}
					self.currentW=self.currentW>self.Wmin?self.currentW:self.Wmin;
					if(!self.mined)self.currentH=self.currentH>self.Hmin?self.currentH:self.Hmin;
					adjustDims();
					cX=e.clientX;cY=e.clientY;dX=0;dY=0;
				}
			}
		}
		var adjustDims=function(){
			self.div.style.height=self.currentH.toString()+'px';
			self.div.style.width=self.currentW.toString()+'px';
			self.div.style.left=self.currentX.toString()+'px';
			self.div.style.top=self.currentY.toString()+'px';
			f.style.height=(self.currentH-self.header.offsetHeight).toString()+'px';
			shst.top=getY(f).toString()+'px';
			shst.left=self.div.style.left
			shst.height=(parseInt(f.style.height)+2*self.borderWidth).toString()+'px';
			shst.width=(self.currentW+2*self.borderWidth).toString()+'px';
		}
		this.show=function(place,headerTxt,z){
			this.headerTxt=headerTxt||this.headerTxt;
			if(!this.div.parentElement)doc.body.appendChild(this.div);
			if(place&&place.h!==undefined)this.initH=this.currentH=place.h;
			if(place&&place.w!==undefined)this.initW=this.currentW=place.w;
			if(place&&place.x!==undefined)this.initX=this.currentX=place.x;
			if(place&&place.y!==undefined)this.initY=this.currentY=place.y;
			this.div.style.display='block';
			this.closed=false;
			adjustDims();
			setEvent('mousemove',cursorMoved)
			this.active=true;
		}
		this.deactivate=function(){
			unsetEvent('mousemove',cursorMoved)
			this.active=false;
		}
		this.triggerMin=function(){
			if(this.mined){restorePos();f.style.display='block';this.mined=false;}
			else{storePos();self.currentW=self.Wmin;
				f.style.display='none';
				self.currentH=parseInt(self.header.clientHeight);
				adjustDims();this.mined=true;
			}
		}
		this.triggerMax=function(){
			if(this.maxed){restorePos();this.maxed=false;}
			else{
				if(!self.mined)storePos();
				self.currentX=self.currentY=0;
				self.currentH=(wnd.innerHeight?wnd.innerHeight:doc.documentElement.clientHeight+doc.documentElement.scrollTop)-3*self.borderWidth;
				self.currentW=(wnd.innerWidth?wnd.innerWidth:doc.documentElement.clientWidth+doc.documentElement.scrollLeft)-3*self.borderWidth;
				adjustDims();
				f.style.display='block';
				this.maxed=true;
			}
		}
		this.hide=function(){
			this.deactivate();this.div.style.display='none';this.closed=true;
			if(clickHandler)clickHandler(idx,true);
		}
		this.setOrder=function(ind,active){
			idx=ind;
			self.div.style.zIndex=this.zStep*(idx+1);
			shst.zIndex=(this.zStep*(idx+1))+(this.zStep/2);
			if(active){
				adjustDims();
				shst.display='none';
				setEvent('mousemove',cursorMoved)
				this.active=true;
			}else{
				shst.top=getY(self.div).toString()+'px';
				shst.left=self.div.style.left
				shst.height=self.div.offsetHeight.toString()+'px';
				shst.width=self.div.offsetWidth.toString()+'px';
				shst.display='block';
				shst.opacity=0.3;
				self.deactivate();
			}
		}
	}
	var reorderWindows=function(idx){
		for(var i=idx||0;i<self.Windows.length;i++)
			self.Windows[i].setOrder(i,i==self.Windows.length-1);
		}
	var windowClicked=function(idx,hide){
		if(hide){
			var w=self.Windows.splice(idx,1);
			w=null;
		}
		else self.Windows.push(self.Windows.splice(idx,1)[0]);
		reorderWindows(idx);
	}
	this.addWindow=function(src,header_text,pos){
		var idx=this.Windows.length;
		var pos={x:(pos&&pos.x?pos.x:this.origin.x+this.shft*shid),y:(pos&&pos.y?pos.y:this.origin.y+this.shft*shid),w:(pos&&pos.w?pos.w:this.origin.w),h:(pos&&pos.w?pos.h:this.origin.h)};
		shid++;
		this.Windows.push(new Window_(idx,src,header_text,this.styles,pos,windowClicked));
		this.Windows[idx].show();
		reorderWindows(Math.max(this.Windows.length-2,0));
		return this.Windows[idx];
	}
}
