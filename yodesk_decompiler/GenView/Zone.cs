/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 11.06.2010
 * Time: 20:38
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.IO;

namespace GenView
{
	/// <summary>
	/// Description of Zone.
	/// </summary>
	public class Zone
	{
		public  int Width;
		public  int Height;
		
		public byte[] Header;

        public readonly string[] PLANET = { "UNUSED", "DESERT", "SNOW", "FOREST", "UNUSED", "SWAMP" };
        public readonly string[] ZONE_TYPE = {
            "NOP", "ENEMY_TERRITORY", "FINAL_DESTINATION", "ITEM_FOR_ITEM", "FIND_SOMETHING_USEFUL_NPC",
            "ITEM_TO_PASS", "FROM_ANOTHER_MAP", "TO_ANOTHER_MAP", "INDOORS", "INTRO_SCREEN", "FINAL_ITEM",
            "MAP_START_AREA", "UNUSED_C", "VICTORY_SCREEN", "LOSS_SCREEN", "MAP_TO_ITEM_FOR_LOCK",
            "FIND_SOMETHING_USEFUL_DROP", "FIND_SOMETHING_USEFUL_BUILDING", "FIND_THE_FORCE"
        };

        public string Planet;
        public string ZoneType;
		
		/// <summary>
		/// assuming that Stream is at the beginning of "IZON" string
		/// </summary>
		/// <param name="stream"></param>
		public Zone(YodaReader stream)
		{
			byte[] header = new byte[20];
			Header = header;
			stream.Read(header, 0, 20);
			
			Width = header[8];
			Height = header[10];

            this.Planet = header[18] >= PLANET.Length ? "UNK" : PLANET[header[18]];
            this.ZoneType = header[12] >= ZONE_TYPE.Length ? "UNK": ZONE_TYPE[header[12]];
			
			Cells = new Cell[Width,Height];
			
			byte[] buf = new Byte[6];
			
			for (int i = 0; i < Width; i++)
			{
				for (int j = 0; j < Height; j++)
				{
					Cells[i,j].Bytes = new byte[6];
					stream.Read(Cells[i,j].Bytes, 0, 6);
				}
			}
		}
		
		public Cell[,] Cells;
	}
	
	public struct Cell 
	{
		public byte[] Bytes;
		
		public int SpriteOne { get { return Bytes[0] + Bytes[1] * 0x100; }}
		public int SpriteTwo { get { return Bytes[2] + Bytes[3] * 0x100; }}
		public int SpriteThree { get { return Bytes[4] + Bytes[5] * 0x100; }}
		
	}
}
