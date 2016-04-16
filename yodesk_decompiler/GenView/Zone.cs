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

using System.Collections.Generic;

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

        public Cell[,] Cells;

        public Izax IZAX;

        public byte[] IZAXTail;
        public byte[] IZX2;
        public byte[] IZX3;
        public byte[] IZX4;

        public IACT[] Iacts;

        public ZoneObjectInfo[] ObjectInfos;

		/// <summary>
		/// assuming that Stream is at the beginning of "IZON" string
		/// </summary>
		/// <param name="stream"></param>
		public Zone(YodaReader stream)
		{
            this.ReadHeader(stream);
            this.ReadCells(stream);
            this.ReadObjectInfo(stream);
            this.ReadIzaStuff(stream);
            this.ReadIacts(stream);
		}

        private void ReadHeader(YodaReader stream)
        {
            byte[] header = new byte[20];
            Header = header;
            stream.Read(header, 0, 20);

            Width = header[8];
            Height = header[10];

            this.Planet = header[18] >= PLANET.Length ? "UNK" : PLANET[header[18]];
            this.ZoneType = header[12] >= ZONE_TYPE.Length ? "UNK" : ZONE_TYPE[header[12]];
        }

        private void ReadCells(YodaReader stream)
        {
            Cells = new Cell[Width, Height];

            byte[] buf = new Byte[6];

            for (int i = 0; i < Width; i++)
            {
                for (int j = 0; j < Height; j++)
                {
                    Cells[i, j].Bytes = new byte[6];
                    stream.Read(Cells[i, j].Bytes, 0, 6);
                }
            }
        }

        private void ReadIzaStuff(YodaReader stream)
        {
            //stream.ReadUntil("IZAX");
            stream.ExpectAtCurrentPos("IZAX");
            this.ReadIzax(stream);
            stream.ExpectAtCurrentPos("IZX2");
            //IZAXTail = stream.ReadUntil("IZX2").Bytes;
            IZX2 = stream.ReadUntil("IZX3").Bytes;
            IZX3 = stream.ReadUntil("IZX4").Bytes;
            IZX4 = stream.ReadUntil("IACT", "IZON", "PUZ2").Bytes;
        }

        private void ReadIzax(YodaReader stream)
        {
            this.IZAX = new Izax();
            this.IZAX.Deserialize(stream);
        }

        private void ReadIacts(YodaReader stream)
        {
            List<IACT> iacts = new List<IACT>();

            while (stream.Next == "IACT")
            {
                var raw = stream.ReadUntil("IACT", "IZON", "PUZ2").Bytes;
                IACT act = new IACT();
                act.Raw = raw;
                iacts.Add(act);
            }

            this.Iacts = iacts.ToArray();

            // TODO read PUZ2, IPUZ
        }


        private void ReadObjectInfo(YodaReader s)
        {
            var n = s.ReadShort();
            this.ObjectInfos = new ZoneObjectInfo[n];
            for (var i = 0; i < n; i++)
            {
                var obj = new ZoneObjectInfo();
                obj.Type = s.ReadLong();
                obj.X = s.ReadShort();
                obj.Y = s.ReadShort();
                obj.Unk1 = s.ReadShort();
                obj.Arg = s.ReadShort();
                this.ObjectInfos[i] = obj;
            }
        }

        public string DebugDescription()
        {
            var d = "";

            d += string.Format("Planet: {0}\r\nZone: {1}\r\n", this.Planet, this.ZoneType);
            d += Utils.ToHexStr(this.Header);
            d += "\r\n\r\n";
            d += string.Format("ObjectInfos: {0}\r\n", this.ObjectInfos.Length);
            foreach (var o in this.ObjectInfos)
            {
                d += string.Format("{0}\r\n", o.String());
            }
            d += "\r\n\r\n";

            d += string.Format("IZAX: entry1 count = {0}\r\n", this.IZAX.Entries1.Length);
            foreach (var o in this.IZAX.Entries1)
            {
                d += string.Format("{0}\r\n", o.ToString());
            }
            d += string.Format("IZAX: entry2 count = {0}\r\n", this.IZAX.Entries2.Length);
            foreach (var o in this.IZAX.Entries2)
            {
                d += string.Format("{0}\r\n", o.ToString());
            }
            d += string.Format("IZAX: entry3 count = {0}\r\n", this.IZAX.Entries3.Length);
            foreach (var o in this.IZAX.Entries3)
            {
                d += string.Format("{0}\r\n", o.ToString());
            }

            //d += "IZAX tail:\r\n" + Utils.ToHexStr(this.IZAXTail) + "\r\n\r\n";
            d += "IZX2:\r\n" + Utils.ToHexStr(this.IZX2) + "\r\n\r\n";
            d += "IZX3:\r\n" + Utils.ToHexStr(this.IZX3) + "\r\n\r\n";
            d += "IZX4:\r\n" + Utils.ToHexStr(this.IZX4) + "\r\n\r\n";
            return d;
        }
	}
	
	public struct Cell 
	{
		public byte[] Bytes;
		
		public int SpriteOne { get { return Bytes[0] + Bytes[1] * 0x100; }}
		public int SpriteTwo { get { return Bytes[2] + Bytes[3] * 0x100; }}
		public int SpriteThree { get { return Bytes[4] + Bytes[5] * 0x100; }}
		
	}

    public class IACT
    {
        public byte[] Raw;
    }

    public class ZoneObjectInfo
    {
        public readonly string[] OBJECT_TYPE = {
            "QUEST_ITEM_SPOT", "SPAWN", "THE_FORCE", "VEHICLE_TO", "VEHICLE_FROM", "LOCATOR",
            "ITEM", "PUZZLE_NPC", "WEAPON", "DOOR_IN", "DOOR_OUT", "UNKNOWN", "LOCK",
            "TELEPORTER", "XWING_FROM", "XWING_TO"
        };

        public int Type;
        public int X;
        public int Y;
        public int Unk1;
        public int Arg;

        public string String()
        {
            return string.Format("{0} at {1};{2}", OBJECT_TYPE[Type], X, Y);
        }
    }

    public class Izax
    {
        public int Magic;
        public int Size;
        public int Pad;
        public IzaxEntry1[] Entries1;
        public IzaxEntry2[] Entries2;
        public IzaxEntry3[] Entries3;

        public void Deserialize(YodaReader stream)
        {
            this.Magic = stream.ReadLong();
            this.Size = stream.ReadLong();
            this.Pad = stream.ReadShort();

            int n;
            n = stream.ReadShort();
            this.Entries1 = stream.ReadObjectArray<IzaxEntry1>(n);
            n = stream.ReadShort();
            this.Entries2 = stream.ReadObjectArray<IzaxEntry2>(n);
            n = stream.ReadShort();
            this.Entries3 = stream.ReadObjectArray<IzaxEntry3>(n);
        }
    }

    public class IzaxEntry1: YodaDeserializable
    {
    	public int EntityId;
	    public int X;
	    public int Y;
	    public int Item;
	    public int NumItems;
	    public int Unk3;
	    public byte[] UnkTail;

        public void Deserialize(YodaReader stream)
        {
            this.EntityId = stream.ReadShort();
            this.X = stream.ReadShort();
            this.Y = stream.ReadShort();
            this.Item = stream.ReadShort();
            this.NumItems = stream.ReadShort();
            this.Unk3 = stream.ReadShort();
            this.UnkTail = stream.ReadN(2 * 0x10);
        }

        public override string ToString()
        {
            return string.Format("Entity {0}: at {1};{2} item {3} num {4} unk {5}",
                this.EntityId, this.X, this.Y, this.Item, this.NumItems, this.Unk3);
        }
    }

    public class IzaxEntry2 : YodaDeserializable
    {
        public int Item;
        public void Deserialize(YodaReader stream)
        {
            this.Item = stream.ReadShort();
        }

        public override string ToString()
        {
            return string.Format("IzaxEntry2(item={0})", this.Item);
        }
    }

    public class IzaxEntry3 : YodaDeserializable
    {
        public int Item;
        public void Deserialize(YodaReader stream)
        {
            this.Item = stream.ReadShort();
        }

        public override string ToString()
        {
            return string.Format("IzaxEntry3(item={0})", this.Item);
        }
    }
}
