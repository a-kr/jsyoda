/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 14:16
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.IO;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace GenView
{
	/// <summary>
	/// Description of ZoneData.
	/// </summary>
	public class ZoneData
	{
		public byte[] IZAX;
		public byte[] IZX2;
		public byte[] IZX3;
		public byte[] IZX4;
		
		public IACT[] Iacts;
		
		public ZoneData(YodaReader stream)
		{
			stream.ReadUntil("IZAX"); // TODO read object info
            IZAX = stream.ReadUntil("IZX2").Bytes;
            IZX2 = stream.ReadUntil("IZX3").Bytes;
            IZX3 = stream.ReadUntil("IZX4").Bytes;
            IZX4 = stream.ReadUntil("IACT", "IZON", "PUZ2").Bytes;
			
			List<IACT> iacts = new List<IACT>();
			
            while (stream.Next == "IACT")
			{
                var raw = stream.ReadUntil("IACT", "IZON", "PUZ2").Bytes;
				IACT act = new IACT();
				act.Raw = raw;
				iacts.Add(act);
			}
			
			Iacts = iacts.ToArray();

            // TODO read PUZ2, IPUZ
		}

        private void ReadObjectInfo(Stream s)
        {
        }
		
	}
	
	public class IACT
	{
		public byte[] Raw;
	}

    public class ObjectInfo
    {
        public int Type;
        public int X;
        public int Y;
        public int Unk1;
        public int Arg;
    }
}
