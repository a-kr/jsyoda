/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:09
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using System.IO;
using System.Drawing;

namespace GenView
{
	/// <summary>
	/// Description of SpriteMgr.
	/// </summary>
	public class SpriteMgr
	{
		public const int SW = 32;
		public const int SH = 32;
		
		public const int SpriteCount = 2123;
        public const int EmptyTileIndex = 355;
		
		static Dictionary<int, Bitmap> bitmapCache = new Dictionary<int, Bitmap>();
		static Bitmap emptySprite = new Bitmap(SW, SH);
		
		public static Bitmap GetSprite(int index)
		{
			if (index >= SpriteCount)
			{
				return emptySprite;
			}
			
			if (!bitmapCache.ContainsKey(index))
			{
				bitmapCache[index] = SpriteExtractor.GetSprite(index);
			}
			
			return bitmapCache[index];
		}
	}
}
