using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GenView
{
    class PuzzleCollection: YodaDeserializable
    {
        public Ipuz[] Puzzles;

        public static readonly string[] PUZZLE_TYPE = new string[] { "TWO_NPC_QUEST", "ONE_NPC_QUEST_1", "ONE_NPC_QUEST_2", "YODA_QUEST" };

        public PuzzleCollection()
        {

        }
    
        public void  Deserialize(YodaReader stream)
        {
            var puzzles = new List<Ipuz>();

            stream.Seek(0x457048, System.IO.SeekOrigin.Begin);

            stream.ExpectAtCurrentPos("PUZ2");
            stream.ReadLong(); // PUZ2
            stream.ReadLong(); // skip length
            while (stream.CurrentPosContainsAtOffset("IPUZ", 2))
            {
                var ipuz = new Ipuz();
                ipuz.Deserialize(stream);
                puzzles.Add(ipuz);
            }

            this.Puzzles = puzzles.ToArray();
        }

        public void ExportToCsv(string filename)
        {
            var filestream = System.IO.File.OpenWrite(filename);
            var stream = new System.IO.StreamWriter(filestream);

            for (var i = 0; i < this.Puzzles.Length; i++)
            {
                string s = string.Format("{0};{1}", i, this.Puzzles[i].CsvRow());
                stream.WriteLine(s);
            }

            stream.Close();
        }
    }

    class Ipuz: YodaDeserializable
    {
        public int Id;
        public int ByteLength;
        public uint PuzzleType;

        public uint Head2_u32;
        public uint Head3_u32;
        public int Head4_u16;

        public string[] Strings;
        public int Tail1_u16;
        public int Tail2_u16;
        public int RewardItem;
        public int Tail3_u16;

        public int TailSize;
        public int SizeError;

        public string CsvRow()
        {
            var s = "";
            s += string.Format("{0};0x{1:X};0x{2:X};0x{3:X};{4};", this.Id, this.PuzzleType, this.Head2_u32, this.Head3_u32, this.Head4_u16);
            s += string.Format("{0};", this.Strings.Length);
            for (int i = 0; i < 4; i++)
            {
                if (i < this.Strings.Length)
                {
                    s += "\"" + this.Strings[i] + "\";";
                }
                else
                {
                    s += "--;";
                }
            }
            s += string.Format("{0};{1};{2};{3};{4};{5}", this.Tail1_u16, this.Tail2_u16, this.RewardItem, this.Tail3_u16, this.TailSize, this.SizeError);
            return s;
        }

        public static int GetTailSize(int id)
        {
            if (id == 85 || id == 103 || id == 108 || id == 115 || id == 131 || id == 132)
            {
                return 6;
            }
            return 8;
        }

        public void Deserialize(YodaReader stream)
        {
            this.Id = stream.ReadShort();
            stream.ExpectAtCurrentPos("IPUZ");
            stream.ReadLong(); // skip IPUZ
            this.ByteLength = stream.ReadLong();
            var endPosition = stream.S.Position + this.ByteLength;
            this.TailSize = 8;// GetTailSize(this.Id);

            

            var tailPosition = endPosition - this.TailSize;
            this.PuzzleType = stream.ReadUnsignedLong();
            this.Head2_u32 = stream.ReadUnsignedLong();
            this.Head3_u32 = stream.ReadUnsignedLong();
            this.Head4_u16 = stream.ReadShort();
            var strings = new List<string>();
            while (stream.S.Position < tailPosition)
            {
                strings.Add(stream.ReadLengthPrefixedString().Replace("\r", "\\r").Replace("\n", "\\n").Replace(";", ","));
            }
            this.Strings = strings.ToArray();

            this.Tail1_u16 = stream.ReadShort();
            this.Tail2_u16 = stream.ReadShort();
            this.RewardItem = stream.ReadShort();
            if (this.TailSize > 6)
            {
                this.Tail3_u16 = stream.ReadShort();
            }

            if (stream.S.Position != endPosition)
            {
                this.SizeError = (int)(stream.S.Position - endPosition);
                stream.S.Seek(endPosition, System.IO.SeekOrigin.Begin);
                //throw new Exception(string.Format("Expected to end at {0}, actual position is {1}", endPosition, stream.S.Position));
            }
        }


    }
}
