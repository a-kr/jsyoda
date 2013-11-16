/* jstile.keytracker.js
 * 
 * The MIT License
 * 
 * Copyright (c) 2009 Christiaan Baartse <christiaan@baartse.nl>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
 /* keys which must be handled exclusively by the game and not by the browser */
 var key_shall_not_pass = {
    32 /* space */: true,
    37 /* left  */: true,
    38 /* up    */: true,
    39 /* right */: true,
    40 /* down  */: true,
 };
 
(function(jstile){
	jstile.keytracker = {onkeydown: null, onkeyup: null};
	
	document.onkeydown = function(e) {
		e = e || window.event;
		jstile.keytracker[e.keyCode] = true;
        if (jstile.keytracker.onkeydown) jstile.keytracker.onkeydown(e);
        if (key_shall_not_pass[e.keyCode])
            return false;
	};
	
	document.onkeyup = function(e) {
		e = e || window.event;
		jstile.keytracker[e.keyCode] = false;
        if (jstile.keytracker.onkeyup) jstile.keytracker.onkeyup(e);
        if (key_shall_not_pass[e.keyCode])
            return false;
	};
})(jstile);