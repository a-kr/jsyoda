/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 12:28
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Drawing;

namespace GenView
{
	[Flags]
	public  enum ZoneLayers { 
		Empty = 0, 
		One = 1,
		Two = 2,
		Three = 4,
		All = One | Two | Three
	}
	/// <summary>
	/// Description of ZoneDrawer.
	/// </summary>
	public static class ZoneDrawer
	{
		public static Bitmap DrawZone(Zone zone, ZoneLayers layersToDraw)
		{
			Bitmap b = new Bitmap(zone.Width * SpriteMgr.SW, zone.Height * SpriteMgr.SH);
			Graphics g = Graphics.FromImage(b);
			g.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
			
			for (int x = 0; x < zone.Width; x++)
			{
				for (int y = 0; y < zone.Height; y++)
				{
					if ((layersToDraw & ZoneLayers.One) == ZoneLayers.One)
					{
						g.DrawImage(SpriteMgr.GetSprite(zone.Cells[x,y].SpriteOne), 
						            y*SpriteMgr.SW, x*SpriteMgr.SH, SpriteMgr.SW, SpriteMgr.SH);
					}
					if ((layersToDraw & ZoneLayers.Two) == ZoneLayers.Two)
					{
						g.DrawImage(SpriteMgr.GetSprite(zone.Cells[x,y].SpriteTwo), 
						            y*SpriteMgr.SW, x*SpriteMgr.SH, SpriteMgr.SW, SpriteMgr.SH);
					}
					if ((layersToDraw & ZoneLayers.Three) == ZoneLayers.Three)
					{
						g.DrawImage(SpriteMgr.GetSprite(zone.Cells[x,y].SpriteThree), 
						            y*SpriteMgr.SW, x*SpriteMgr.SH, SpriteMgr.SW, SpriteMgr.SH);
					}
				}
			}
			
			return b;
		}
	}
}
