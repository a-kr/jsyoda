/* jstile.layer.js
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
	 * Layer Class
	 * @param Int		width			The width of the layer in pixels
	 * @param Int		height			The height of the layer in pixels
	 * @param Int		framerate		FPS
	 * @param String	background		Background color used. False to not clear the layer, true for a transparent layer.
	 * @param Function	onBeforeRefresh	This function gets executed before each refresh. If it returns false the refresh is aborted.
	 * @param Bool		doubleBuffering	Use double buffering
	 */
	jstile.Layer = function(width, height, framerate, background, onBeforeRefresh, doubleBuffering)
	{
		this.width = width;
		this.height = height;
		this.framerate = framerate;
		this.background = background;
		this.onBeforeRefresh = onBeforeRefresh;
		this.doubleBuffering = !!doubleBuffering;
		
		this.layer = false;
		this.context = false;
		this.interval = false;
		this.framerateMs = Math.round(1000 / this.framerate);
		this.sprites = {}; // Sprites are kept by id here
		this._spritesArr = []; // Sprites are sorted by zindex in here
	};

	/**
	 * Initialize the Layer object creating the layer node
	 * @param String|Node	container	The id or the node itself that should contain the layer
	 * @return jstile.Layer self
	 */
	jstile.Layer.prototype.init = function(container)
	{
		if(typeof(container) == 'string') {
			container = document.getElementById(container);
		}

		if(!container || typeof(container.innerHTML) != 'string') {
			throw new Error('Container not found');
		}
		this.layer = this._createCanvas();
		if(!this.layer.getContext) {
			delete this.layer;
			throw new Error('Browser does not support the HTML 5 <canvas> tag');
		}
		
		this.layer.height = this.height;
		this.layer.width = this.width;

		this.context = this.layer.getContext('2d');
		
		if(this.doubleBuffering) {
			this.output = this._createCanvas();
			this.output.height = this.height;
			this.output.width = this.width;
			this.outputContext = this.output.getContext('2d');
			container.appendChild(this.output);
		}
		else {
			container.appendChild(this.layer);
		}
		
		return this;
	};
	
	/**
	 * Starts the drawing loop
	 * @return jstile.Layer self
	 */
	jstile.Layer.prototype.start = function()
	{
		if(this.framerate) {
			this.interval = setInterval(this._refresh.bind(this), this.framerateMs);
		}
		return this;
	};
	
	/**
	 * Stops the drawing loop
	 * @return jstile.Layer self
	 */
	jstile.Layer.prototype.stop = function()
	{
		if(this.interval) {
			clearInterval(this.interval);
		}
		return this;
	};

	/**
	 * Redraws the layer
       @param nocallbacks Bool    if true, do not call sprites' onDrawCallback
	 * @access private
	 */
	jstile.Layer.prototype._refresh = function(nocallbacks)
	{
		if(this.onBeforeRefresh && false === this.onBeforeRefresh()) {
			return;
		}
		
		// Clean the layer
		this.context.clearRect (0, 0, this.width, this.height);
		
		for (var i = 0, len = this._spritesArr.length; i < len; ++i) {
			if(this._spritesArr[i] && this._spritesArr[i].active) {
				this._spritesArr[i].draw(this, nocallbacks);
			}
		}
		
		if(this.doubleBuffering) {
			this.outputContext.clearRect (0, 0, this.width, this.height);
			this.outputContext.drawImage(this.layer, 0, 0, this.width, this.height);
		}
	};

	/**
	 * Sort the registered sprites
	 * @return jstile.Layer	self
	 */
	jstile.Layer.prototype._prepareSprites = function()
	{
		this._spritesArr = jstile.Sprite.sortSprites(this.sprites);
		return this;
	};
	
	/**
	 * Creates a new canvas node
	 * @return DOMnode
	 */
	jstile.Layer.prototype._createCanvas = function()
	{
		var canv = document.createElement('canvas');
		/*if(G_vmlCanvasManager) {
			G_vmlCanvasManager.initElement(canv);
		}*/
		return canv;
	}

	/**
	 * Add a sprite to the layer
	 * @param jstile.Sprite		sprite
	 * @param Bool				noprepare If set to true it won't auto reorder the sprites
	 * @return jstile.Layer self
	 */
	jstile.Layer.prototype.addSprite = function(sprite, noprepare)
	{
		var i, id;
		if(sprite instanceof Array) {
			for (i = 0; i < sprite.length; i++) {
				this.addSprite(sprite[i], true);
			}
		}
		else {
			sprite._setLayer(this);
			this.sprites[sprite.id] = sprite;
		}

		if(!noprepare) {
			this._prepareSprites();
		}
		return this;
	};

	/**
	 * Remove a sprite from the layer
	 * @param jstile.Sprite sprite
	 * @return jstile.Layer self
	 */
	jstile.Layer.prototype.removeSprite = function(sprite, noprepare)
	{
		if(sprite instanceof Array) {
			for (var i = 0; i < sprite.length; i++) {
				this.removeSprite(sprite[i], true);
			}
		}
		else {
			delete this.sprites[sprite.id];
			sprite._setLayer(false);
		}
		
		if(!noprepare) {
			this._prepareSprites();
		}
		return this;
	};

})(jstile);