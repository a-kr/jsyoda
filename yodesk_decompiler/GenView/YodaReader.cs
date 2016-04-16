using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace GenView
{
    public class YodaReaderByteChunk
    {
        public byte[] Bytes;
        public string Next;
    }

    public class YodaReader
    {
        public Stream S;
        public string Next;

        public YodaReader(Stream s)
        {
            this.S = s;
            this.Next = "";
        }

        public void Read(byte[] into, int into_offset, int length)
        {
            this.S.Read(into, into_offset, length);
        }

        public void Seek(long read_offset, SeekOrigin origin)
        {
            this.S.Seek(read_offset, origin);
        }

        public YodaReaderByteChunk ReadUntil(params string[] str_stops)
        {
            Stream s = this.S;

            byte[][] stops = str_stops.Select(stop => Encoding.ASCII.GetBytes(stop)).ToArray();
            int longest_stop_length = stops.Select(st => st.Length).Max();
            byte[] buf = new byte[longest_stop_length];

            var result = new YodaReaderByteChunk();

            long initial_pos = s.Position;
            long position = s.Position + 1;
            while (true)
            {
                s.Seek(position, SeekOrigin.Begin);
                s.Read(buf, 0, longest_stop_length);

                // comparing to all stops
                bool reached_stop = false;
                for (int i = 0; i < stops.Length; i++)
                {
                    bool equal = true;
                    for (int j = 0; j < stops[i].Length; j++)
                    {
                        if (stops[i][j] != buf[j])
                        {
                            equal = false;
                            break;
                        }
                    }
                    if (equal)
                    {
                        reached_stop = true;
                        result.Next = str_stops[i];
                        this.Next = result.Next;
                        break;
                    }
                }

                if (reached_stop)
                    break;

                position++;
            }
            long end_pos = position;
            s.Seek(initial_pos, SeekOrigin.Begin);
            buf = new Byte[end_pos - initial_pos];
            s.Read(buf, 0, buf.Length);
            result.Bytes = buf;
            return result;
        }
    }
}
