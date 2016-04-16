/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:16
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.IO;
using System.Text;

namespace GenView
{
	/// <summary>
	/// Description of ObjectCollection.
	/// </summary>
	public class ItemCollection
	{
		const int ITEM_COUNT = 246;
		const int TNAM_OFFSET = 0x00462466;
			
		public ItemCollection(YodaReader stream)
		{
			stream.Seek(TNAM_OFFSET, SeekOrigin.Begin);
			Items = new GameItem[ITEM_COUNT];
			
			stream.Seek(4, SeekOrigin.Current); // skip "TNAM"
			stream.Seek(4, SeekOrigin.Current); // skip 4-byte header
			for (int i = 0; i < ITEM_COUNT; i++)
			{
				byte[] buf = new byte[26];
				stream.Read(buf, 0, 26);
				Items[i].Index = i;
				Items[i].Sprite = buf[0] + buf[1] * 0x100;
				/*StringBuilder builder = new StringBuilder();
				for (int k = 2; k < 26; k++)
				{
					if (buf[k] == 0)
						break;
					builder.Append((char)buf[k]);
				}*/
				Items[i].Name = Encoding.ASCII.GetString(buf, 2, 24);
				Items[i].Name = Items[i].Name.Substring(0, Items[i].Name.IndexOf('\0'));
			}
		}
		
		public GameItem[] Items;
	}
	
	public struct GameItem
	{
		public int Index;
		public int Sprite;
		public string Name;
	}
}
