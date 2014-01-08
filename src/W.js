/*
    W, width management tool for responsive designs

    Version     : 0.3.1
    Authors     : Aurélien Delogu (dev@dreamysource.fr)
    Homepage    : https://github.com/pyrsmk/W
    License     : MIT

    Some readings
        http://www.alistapart.com/articles/fontresizing/
        http://tripleodeon.com/2011/12/first-understand-your-screen/

    Thanks
        To Lawrence Carvalho (carvalho@uk.yahoo-inc.com) for his useful TextResizeDetector script :)
*/

(function(def){
	if(typeof define=='function'){
		define(def);
	}
    else if(typeof module!='undefined'){
        module.exports=def;
    }
    else{
        this.W=def;
    }
}(function(){

    var win=window,
        doc=document,
        html=doc.documentElement,
        textelement,
        textheight,
        style='style',
        createElement='createElement',
        appendChild='appendChild',
        offsetHeight='offsetHeight',
        offsetWidth='offsetWidth',
        listeners=[];

    /*
        Main function

        Parameters
            boolean, number, Function spec: if true, return em-based window width
                                            if a number, translate it to ems
                                            if a function, will be called when the user resizes the window, zooms the contents or changes text size

        Return
            integer, null
    */
    return function(spec){
        var type=typeof spec,unit,a,b;
        if(type=='function'){
            // Catch window resize event
            if(a=win.addEventListener){
                a('resize',spec,false);
            }
            else{
                win.attachEvent('onresize',spec);
            }
            // Catch text resize event
            if(!listeners.length){
                textelement=doc[createElement]('b');
                textelement[style].position='absolute';
                textelement[style].top='-99em';
                textelement.innerHTML='W';
                html[appendChild](textelement);
                textheight=textelement[offsetHeight];
                setInterval(function(a,b){
                    // Trigger text resize event
                    if(textheight!=(b=textelement[offsetHeight])){
                        a=listeners.length;
                        while(a){
                            listeners[--a]();
                        }
                    }
                    textheight=b;
                },250);
            }
            listeners.push(spec);
            return;
        }
        // Compute em unit
        a=doc[createElement]('div');
        a[style].width='1em';
        html[appendChild](a);
        unit=a[offsetWidth];
        unit=unit?unit:16; // 16px as fallback
        html.removeChild(a);
        // Tranlate provided px-based width
        if(type=='number'){
            return spec/unit;
        }
        else{
            // Viewport width
            a=navigator.userAgent.match(/iPhone|iPod|iPad/i)?win.outerWidth:screen.width;
            // Window width
            if(!(b=win.innerWidth)){
                b=html.clientWidth;
            }
            // Guess the correct "window" width
            a=(b-a)*100/b<5?b:a;
            return spec?a/unit:a;
        }
    };

}()));
