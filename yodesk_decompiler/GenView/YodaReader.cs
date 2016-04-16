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

                if (reached_stop || position >= s.Length)
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

        public int ReadShort()
        {
            byte[] buf = new byte[2];
            this.S.Read(buf, 0, 2);
            return (int)(buf[0]) + (int)(buf[1]) * 256;
        }

        public int ReadByte()
        {
            byte[] buf = new byte[1];
            this.S.Read(buf, 0, 1);
            return (int)(buf[0]);
        }

        public int ReadLong()
        {
            byte[] buf = new byte[4];
            this.S.Read(buf, 0, 4);
            return (int)(buf[0]) + (int)(buf[1]) * 256 + (int)(buf[2]) * 256 * 256 + (int)(buf[3]) * 256 * 256 * 256;
        }

        public T[] ReadObjectArray<T>(int n) where T: YodaDeserializable, new() {
            var result = new T[n];
            for (int i = 0; i < n; i++)
            {
                T obj = new T();
                obj.Deserialize(this);
                result[i] = obj;
            }
            return result;
        }

        internal byte[] ReadN(int n)
        {
            byte[] buf = new byte[n];
            this.S.Read(buf, 0, n);
            return buf;
        }

        public void ExpectAtCurrentPos(string s)
        {
            var s_bytes = Encoding.ASCII.GetBytes(s);
            byte[] actual_bytes = new byte[s_bytes.Length];
            this.S.Read(actual_bytes, 0, actual_bytes.Length);
            this.S.Seek(-actual_bytes.Length, SeekOrigin.Current);

            var actual_s = Encoding.ASCII.GetString(actual_bytes);
            if (actual_s != s)
            {
                throw new Exception(string.Format("Expected {0}, got {1}", s, actual_s));
            }
        }
    }

    public interface YodaDeserializable
    {
        void Deserialize(YodaReader stream);
    }
}
