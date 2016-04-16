using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GenView
{
    class Utils
    {
        public static string ToHexStr(byte[] thing) {
            return string.Join(" ", thing.Select(b => b.ToString("X2")).ToArray());
        }
    }
}
