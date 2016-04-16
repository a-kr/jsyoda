/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 16:10
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.IO;
using System.Drawing;

namespace GenView
{
	/// <summary>
	/// Description of SpriteExtractor.
	/// </summary>
	public static class SpriteExtractor
	{
		static Color[] palette;
		
		public static void LoadPalette(string PaletteFilename)
		{
			byte[] bytes = File.ReadAllBytes(PaletteFilename);
			palette = new Color[bytes.Length / 4];
			for (int i = 0; i < palette.Length; i++)
			{
				bytes[i*4+3] = 0xFF;
				Int32 color = BitConverter.ToInt32(bytes, i*4);
				palette[i] = Color.FromArgb(color);
			}
			palette[0] = Color.Transparent;
		}
		
		public static YodaReader Yodesk;
		
		const int FirstSpriteOffset = 0x14788;
		
		static int GetSpriteOffset(int index)
		{
			return FirstSpriteOffset + (1024 + 4) * index + 4;
		}
		
		static byte[] ReadSpriteBytes(int offset)
		{
			byte[] sprite = new Byte[1024];
			Yodesk.Seek(offset, SeekOrigin.Begin);
			Yodesk.Read(sprite, 0, sprite.Length);
			return sprite;
		}
		
		public static Bitmap GetSprite(int index)
		{
			byte[] sprite = ReadSpriteBytes(GetSpriteOffset(index));
			Bitmap bmp = new Bitmap(32, 32);
			
			int pos = 0;
			for (int y = 0; y < 32; y++)
			{
				for (int x = 0; x < 32; x++)
				{
					Color color = palette[sprite[pos]];
					bmp.SetPixel(x, y, color);
					pos++;
				}
			}
			
			return bmp;
		}
	}
}
