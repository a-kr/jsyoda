/* jstile.image.js
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
(function(jstile){
	/**
	 * Image Class
	 * @param String	src			Image url or false to create a invisible sprite
	 * @param Int		width		Width of the image (not the whole image just what's shown)
	 * @param Int		height		Height of the image (not the whole image just what's shown)
	 * @param Int		direction	Direction of the animation (which automatically means that the multi image is picked using the other axis)
	 * @param Int		frames		Amount of frames starting with 0 like the frame parameter
	 * @param Int		speed		Milliseconds between frames (0 = dont animate) (default = 0)
	 */
	jstile.Image = function(src, width, height, direction, frames, speed)
	{
		var node;
		this.src = src;
		this.width = width;
		this.height = height;
		this.direction = (direction !== undefined) ? direction : jstile.HORIZONTAL;
		this.frames = (frames !== undefined) ? frames : 0;
		this.speed = (speed !== undefined) ? speed : 0;

		if(src) {
			if(typeof(jstile.Image._sources[this.src]) == 'undefined') {
				node = new Image();
				node.failed = false;
				node.loaded = -1;
				node.onload = this._onload.bind(this);
				node.onerror = this._onerror.bind(this);
				node.src = this.src;
				jstile.Image._sources[this.src] = node;
			}
			
			this.node = jstile.Image._sources[this.src];
		}
		else {
			this.node = false;
		}
	};
	
	/**
	 * Object holding all image objects using the src as key
	 * @var Object
	 */
	jstile.Image._sources = {};
	
	/**
	 * Callback that gets assigned to <img> nodes that are
	 * used for loading the sprites
	 * @return void
	 */
	jstile.Image.prototype._onload = function(){
		this.loaded = 1;
	};
	
	/**
	 * Callback that gets assigned to <img> nodes that are
	 * used for loading the sprites
	 * @return void
	 */
	jstile.Image.prototype._onerror = function(){
		this.loaded = 0;
		throw this.src+' could not be found';
	};
})(jstile);