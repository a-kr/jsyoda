/* jstile.grid.js
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
	 * jstile.Grid class
	 * 
	 * @param Int	width		The grid width of the map measured in tiles
	 * @param Int	height		The grid height of the map measured in tiles
	 * @param Int	tileWidth	The width of the tiles in pixels
	 * @param Int	tileHeight	The height of the tiles in pixels
	 * @param Int	type		ORTHOGONAL, ISOMETRIC or HEXAGONAL
	 */
	jstile.Grid = function(width, height, tileWidth, tileHeight, type)
	{
		this.width			= width;
		this.height			= height;
		this.tileWidth		= tileWidth;
		this.tileHeight		= tileHeight;
		this.type			= (undefined !== type) ? type : jstile.ORTHOGONAL;
		
		switch(this.type) {
			case jstile.ISOMETRIC:
				this._calculateIsometric();
			break;
			case jstile.HEXAGONAL:
				this._calculateHexagonal();
			break;
			case jstile.ORTHOGONAL:
			default:
				this._calculateOrthogonal();
			break;
		}
	};
	
	/**
	 * Calculate the offsets for a Orthogonal grid
	 * @access private
	 */
	jstile.Grid.prototype._calculateOrthogonal = function() {
		var x, yArr, y;
		this.offsets = [];
		for (x = 0; x < this.width; ++x) {
			yArr = [];
			for (y = 0; y < this.height; ++y) {
				yArr.push({
					top: this.tileHeight*y,
					left: this.tileWidth*x
				});
			}
			this.offsets.push(yArr);
		}
		
		this.widthPx		= this.width * this.tileWidth;
		this.heightPx		= this.height * this.tileHeight;
	};
	
	/**
	 * Calculate the offsets for a isometric grid
	 * @see http://www.gamedev.net/reference/articles/article747.asp
	 * @access private
	 */
	jstile.Grid.prototype._calculateIsometric = function() {
		var halveWidth = Math.round(this.tileWidth/2),
		halveHeight = Math.round(this.tileHeight/2),
		x, yArr, y, top, left;
		
		
		this.offsets = [];
		for (x = 0; x < this.width; ++x) {
			yArr = [];
			for (y = 0; y < this.height; ++y) {
				top = -halveHeight,
				left = 0;
				
				top += halveHeight*y,
				left += this.tileWidth*x;
				
				if(y%2 == 1) {
					left -= halveWidth;
				}
				
				yArr.push({
					top: top,
					left: left
				});
			}
			this.offsets.push(yArr);
		}
		
		this.widthPx		= (this.width-1) * this.tileWidth;
		this.heightPx		= (this.height-1) * Math.round(this.tileHeight/2);
	};
	
	/**
	 * Calculate the offsets for a Hexagonal grid
	 * @access private
	 */
	jstile.Grid.prototype._calculateHexagonal = function(width, height, tileHeight, tileWidth) {
		throw 'Not supported yet';
	};
	
})(jstile);