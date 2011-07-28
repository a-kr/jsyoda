/* jstile.sprite.js
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
	 * The actual construct of the Sprite class,
	 * use Sprite.factory() to create a Sprite instead!
	 * @access Private
	 */
	jstile.Sprite = function(image, left, top, zindex, frame, onDrawCallback, once, onDone)
	{
		this.id = ++jstile.Sprite._lastid;
		this.left = left;
		this.top = top;
		this.zindex = zindex;
		this.frame = (frame !== undefined) ? frame : 0;
		this.once = !!once;
		this.onDone = onDone;
		this.onDrawCallback = onDrawCallback;

		this.active = true;
		this.layer = false;
		this.parent = false;
		this.children = {};
		this.currentframe = 0;
		this._calculateZindex(); // sets this._calculatedZindex
		this._calculatePosition(); // sets this._calculatedPosition
		this.setImage(image);
	};

	/**
	 * @var Int get incremented with each sprite creation
	 */
	jstile.Sprite._lastid = 0;
	
	/**
	 * @var Array stack where inactive sprites are kept
	 */
	jstile.Sprite._recyclebin = [];
	
	/**
	 * Sprite Class factory
	 * @param jstile.Image|Bool	image			jstile.Image object or false for creating a layer
	 * @param Int				left			x coordinate on layer
	 * @param Int				top				y coordinate on layer
	 * @param Int				zindex			Z-index
	 * @param Int				frame			The current frame
	 * @param Function			onDrawCallback	Callback that gets executed right before the sprite gets drawn
	 * @param Bool				once			Just run the animation once
	 * @param Function			onDone			Callback that is executed when the animation resets/finishes
	 */
	jstile.Sprite.factory = function(image, left, top, zindex, frame, onDrawCallback, once, onDone)
	{
		if(jstile.Sprite._recyclebin.length) {
			var sprite = jstile.Sprite._recyclebin.shift();
			jstile.Sprite.call(sprite, image, left, top, zindex, frame, onDrawCallback, once, onDone);
			return sprite;
		}
		return new this(image, left, top, zindex, frame, onDrawCallback, once, onDone);
	};

	/**
	 * Set a new image
	 * @param jstile.Image|bool		image
	 * @return jstile.Sprite self
	 */
	jstile.Sprite.prototype.setImage = function(image)
	{
		this.image = image;
		this.currentframe = 0;
		this._updateAnimRate();
		this._calculateImageOffset(); // sets this._imageOffset
		
		return this;
	};

	/**
	 * Set the sprite on a different image
	 * @param frame
	 * @return jstile.Sprite self
	 */
	jstile.Sprite.prototype.setFrame = function(frame)
	{
		this.frame = frame;
		this._calculateImageOffset();
		
		return this;
	};

	jstile.Sprite.prototype.setPosition = function(left, top)
	{
		this.left = left;
		this.top = top;
		this._calculatePosition();
		return this;
	};
    jstile.Sprite.prototype.setPositionDelta = function(dx, dy)
	{
		this.setPosition(this.left + dx, this.top + dy);
		return this;
	};

	/**
	 * Draw the sprite to the layer
	 * @link https://developer.mozilla.org/en/Canvas_tutorial/Using_images#Slicing
	 * @param jstile.Layer layer
     * @param Bool nocallbacks    if true, onDrawCallback is not called
	 * @return Bool Returns if the image did get drawn
	 */
	jstile.Sprite.prototype.draw = function(layer, nocallbacks)
	{
		if(!!nocallbacks || !this.onDrawCallback || false !== this.onDrawCallback()) {
			var image = this.image;
			
			if(image && this.active && image.node.complete && image.loaded === 1) {
				var width = image.width,
				height = image.height,
				sx = this._imageOffset.left,
				sy = this._imageOffset.top,
				dx = this._calculatedPosition.left,
				dy = this._calculatedPosition.top,
				px = 0;
				
				// Do we try to draw at a position outside of the layer
				if(dx < 0) {
					if(dx + width < 0) return false;
					var px = (0 - dx); // Amount we're overdue
					width -= px;// Cut it off the width
					sx += px;
					dx = 0;
				}
				// If the image get drawn completely outside skip it
				else if(dx > layer.width) {
					return false;
				}
				else if(dx + width > layer.width) {
					width = (layer.width - dx); // Width is the remaining width
				}
				
				if(dy < 0) {
					if(dy + height < 0) return false;
					var px = (0 - dy); // Amount we're overdue
					height -= px;// Cut it off the height
					sy += px;
					dy = 0;
				}
				else if(dy > layer.height) {
					return false;
				}
				else if(dy + height > layer.height) {
					height = (layer.height - dy);// Height is the remaining width
				}
				
				if(!width || !height) {
					return false;
				}
				
				// drawImage returns void
				layer.context.drawImage(image.node, sx, sy, width, height, dx, dy, width, height);
				
				if(image.frames && image.speed > 0) {
					if(this._idleCount == this.animRate) {
						this._idleCount = 0;
						// Advance the animation
						if(++this.currentframe > this.image.frames) {
							this.currentframe = 0;
							if(this.onDone) {
								this.onDone();
							}
							
							if(this.once) {
								this.remove();
							}
						}
						this._calculateImageOffset();
					}
					else if(this._idleCount !== false) {
						++this._idleCount;
					}
				}
				
				return true;
			}
		}
		return false;
	};

	
	/**
	 * Add a child
	 * @param jstile.Sprite	child
	 * @param Bool			noprepare
	 * @return jstile.Sprite self
	 */
	jstile.Sprite.prototype.addChild = function(child, noprepare)
	{
		if(!(child instanceof Array)) {
			child = [child];
		}
		
		for(var i = 0, len = child.length; i < len; i++) {
			child[i]._setParent(this);
			this.children[child[i].id] = child[i];
		}
        if(this.layer) {
            this.layer._prepareSprites();
        }
		return this;
	};
	
	/**
	 * Remove a child
	 * @param jstile.Sprite	child
	 * @param Bool			noprepare
	 * @return jstile.Sprite self
	 */
	jstile.Sprite.prototype.removeChild = function(child, noprepare)
	{
		if(!(child instanceof Array)) {
			child = [child];
		}
		
		for(var i = 0, len = child.length; i < len; i++) {
			delete this.children[child[i].id];
			child[i]._setParent(false);
		}
        if(this.layer) {
            this.layer._prepareSprites();
        }
		return this;
	};	
    
    /* Removes and destroys all child sprites. */
    jstile.Sprite.prototype.removeChildren = function()
	{
		for (var chid in this.layer.sprites) {
            if (this.layer.sprites[chid].parent == this) {
                this.layer.sprites[chid].remove();
            }
        }
        this.children = {};
		return this;
	};	
    
	
	/**
	 * Does the Sprite contain the given child
	 * @param jstile.Sprite	child
	 * @return Bool
	 */
	jstile.Sprite.prototype.hasChild = function(child)
	{
		return typeof(this.children[child.id]) !== 'undefined';
	};
	
	/**
	 * Destroys the Sprite rendering it useless and ready for
	 * recycling by the factory method
	 */
	jstile.Sprite.prototype.remove = function()
	{
		this.active = false;
		jstile.Sprite._recyclebin.push(this);
		
        /*this.removeChildren();*/
		if(this.parent) {
			this.parent.removeChild(this);
		}
		else if(this.layer) {
			this.layer.removeSprite(this);
		}
		this.id = false;
	};
	
	/**
	 * Is this sprite somewhere shown on the layer
	 * or is it completely outside of the layer
	 * @return Bool
	 */
	jstile.Sprite.prototype.inViewport = function()
	{
		var position = this._calculatedPosition;
		return (
			position.top <= this.layer.height
			&& position.left <= this.layer.width 
			&& position.top + this.image.height >= 0
			&& position.left + this.image.width >= 0
		);
	};
	
	/**
	 * Test for collisions with other sprites
	 * @param	Array	Array with sprites to test for
	 * @return	Array	Array containing colliding sprites
	 */
	jstile.Sprite.prototype.collides = function(sprites)
	{
		var result = [], i, sprite, thatPosition, thisPosition = this._calculatedPosition,
		bottom = thisPosition.top + this.image.height,
		right = thisPosition.left + this.image.width;
		
		if(this.inViewport()) {
			for (i = sprites.length-1; i >= 0; --i) {
				sprite = sprites[i];
				
				if(sprite instanceof Array) {
					result = result.concat(this.collision(sprite));
				}
				else {
					thatPosition = sprite._calculatedPosition;
					// If we not not touch ;)
					if(!(
						thatPosition.top+sprite.image.height <= thisPosition.top		// we're to far to the top to touch
						|| thatPosition.left+sprite.image.width <= thisPosition.left	// we're to far to the right to touch
						|| thatPosition.top >= bottom	// we're to far to the bottom to touch
						|| thatPosition.left >= right	// we're to far to the left to touch
					)){
						result.push(sprite);
					}
				}
			}
		}
		
		return result;
	};
	
	/**
	 * Sort a given array of sprites on the Zindex of the sprites
	 * @param Object sprites
	 * @return Object
	 */
	jstile.Sprite.sortSprites = function(sprites)
	{
		var id, sprite, i, z2objects = {}, sortArr = [], zindex, retArr = [];
		sprites = jstile.Sprite._flattenSpritesArray(sprites);
		for(id in sprites) {
			sprite = sprites[id];
			
			if(!(z2objects[sprite._calculatedZindex] instanceof Array)) {
				z2objects[sprite._calculatedZindex] = [];
			}
			
			z2objects[sprite._calculatedZindex].push(sprite);
		}
		
		for(zindex in z2objects) {
			sortArr.push(zindex);
		}

		sortArr.sort(function(a, b) { return a - b; });
		for(i = 0; i < sortArr.length; i++) {
			retArr = retArr.concat(z2objects[sortArr[i]]);
		}
		return retArr;
	};
	
	/**
	 * Flatten a multidimensional sprites array
	 * @access private
	 * @param Object sprites
	 * @return Object
	 */
	jstile.Sprite._flattenSpritesArray = function(sprites)
	{
		var id, retArr = [], children;
		for(id in sprites) {
			retArr.push(sprites[id]);
			retArr = retArr.concat(jstile.Sprite._flattenSpritesArray(sprites[id].children));
		}
		return retArr;
	};
	
	/**
	 * Set or unset the layer
	 * @access private
	 * @param Layer 	layer
	 * @return jstile.Sprite self
	 */
	jstile.Sprite.prototype._setLayer = function(layer)
	{
		this.layer = layer;
		this._updateAnimRate();
		
		for(var id in this.children) {
			this.children[id]._setLayer(layer);
		}

		return this;
	};
	
	/**
	 * Set or unset the parent of the sprite
	 * @access private
	 * @param jstile.Sprite|jstile.Layer parent
	 */
	jstile.Sprite.prototype._setParent = function(parent)
	{
		if(parent !== false) {
			if(this.parent !== false) {
				throw 'Sprite already has a parent remove it first';
			}
			this.parent = parent;
            this._setLayer(parent.layer);
			this._calculateZindex();
			this._calculatePosition();
		}
		else {
			this.parent = false;
			this._calculateZindex();
			this._calculatePosition();
		}
	};

	/**
	 * Gets the Zindex relative from its parent
	 * @access private
	 */
	jstile.Sprite.prototype._calculateZindex = function()
	{
		if(this.parent instanceof jstile.Sprite) {
			this._calculatedZindex = this.parent._calculatedZindex + this.zindex;
		}
		else {
			this._calculatedZindex = this.zindex;
		}
		
		for(var id in this.children) {
			this.children[id]._calculateZindex();
		}
	};
	
	/**
	 * Calculates the animation rate using the layers FPS
	 * @access private
	 */
	jstile.Sprite.prototype._updateAnimRate = function()
	{
		if(this.image.frames && this.layer) {
			// We know the FPS so we can normalize the ms to our FPS
			this.animRate = parseInt(this.image.speed / this.layer.framerateMs);
			this._idleCount = 0;
		}
		else {
			this.animRate = false;
			this._idleCount = false;
		}
	};
	
	
	/**
	 * Get the offsets in the source image for the current frames
	 * @access private
	 */
	jstile.Sprite.prototype._calculateImageOffset = function()
	{
		var xframe, yframe;
		switch(this.image.direction) {
			case jstile.VERTICAL:
				xframe = this.frame;
				yframe = this.currentframe;
			break;
			case jstile.HORIZONTAL:
			default:
				xframe = this.currentframe;
				yframe = this.frame;
			break;
		}

		this._imageOffset = {
			left : xframe * this.image.width,
			top : yframe * this.image.height
		};
	};
	
	
	/**
	 * Get the offsets in the current image for the current frames
	 * @access private
	 */
	jstile.Sprite.prototype._calculatePosition = function()
	{
		var position = {}, id;
		
		if(this.parent) {
			position = {
				left : this.parent._calculatedPosition.left + this.left,
				top : this.parent._calculatedPosition.top + this.top
			};
		}
		else {
			position = {
				left : this.left,
				top : this.top
			};
		}
		
		this._calculatedPosition = position;
		
		for (id in this.children) {
			this.children[id]._calculatePosition();
		}
	};
})(jstile);