/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 12:43
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using System.Linq;

namespace GenView
{
	/// <summary>
	/// Description of ZonesForm.
	/// </summary>
	public partial class ZonesForm : Form
	{
		YodaReader yodesk;
		int[] zoneOffsets;
		
		IactForm iactForm = new IactForm();

        public class ZoneListEntry
        {
            public int index;
            public int offset;
            public byte planet;
            public byte type;
            public override string ToString()
            {
                return string.Format("{0:000} 0x{1} {2} {3}", index, index.ToString("X04"),
                    type.ToString("X02"), planet.ToString("X02"));
            }
        }
        
        public static IEnumerable<ZoneListEntry> entries;
		
		public void SetThings(YodaReader yodesk_reader, int[] zoneOffsets)
		{
            this.yodesk = yodesk_reader;
			this.zoneOffsets = zoneOffsets;

            Func<int, byte[]> attrs = delegate(int i)
            {
                byte[] header = new byte[20];
                yodesk.Seek(zoneOffsets[i], 0);
                yodesk.Read(header, 0, 20);

                //return header[12].ToString("X02") + " " + header[18].ToString("X02");
                return new byte[] { header[12], header[18] };
            };

            var zone_list = Enumerable.Range(0, zoneOffsets.Length)
                .Select(i => new
                {
                    index = i,
                    attr = attrs(i)
                })
                .Select(o => new ZoneListEntry
                {
                    index = o.index,
                    offset = zoneOffsets[o.index],
                    planet = o.attr[1],
                    type = o.attr[0]
                })
                ;//.OrderBy(o => o.type).OrderBy(o => o.planet);

            ZonesForm.entries = zone_list;
			
			lbZoneIndex.Items.Clear();
			lbZoneIndex.Items.AddRange(zone_list.ToArray());

		}
		
		Zone zone;
		
		public ZonesForm()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			
			//
			// TODO: Add constructor code after the InitializeComponent() call.
			//
		}

		
		void LbZoneIndexSelectedIndexChanged(object sender, EventArgs e)
		{
			if (lbZoneIndex.SelectedIndex < 0 || lbZoneIndex.SelectedIndex >= zoneOffsets.Length)
				return;
			yodesk.Seek((lbZoneIndex.SelectedItem as ZoneListEntry).offset, SeekOrigin.Begin);
            this.Text = (lbZoneIndex.SelectedItem as ZoneListEntry).index.ToString();
            
			zone = new Zone(yodesk);
			
			btnShowIacts.Text = string.Format("IACTs: {0}", zone.Iacts.Length);

            tbZZ.Text = zone.DebugDescription();
			    
			
			RenderZone();
		}
		
		void RenderZone()
		{
			ZoneLayers layers = ZoneLayers.Empty;
			if (cbLayer1.Checked) layers |= ZoneLayers.One;
			if (cbLayer2.Checked) layers |= ZoneLayers.Two;
			if (cbLayer3.Checked) layers |= ZoneLayers.Three;
			Bitmap b = ZoneDrawer.DrawZone(zone, layers);
			pbImage.Image = b;
			pbImage.Refresh();
		}
		
		void ZonesFormFormClosing(object sender, FormClosingEventArgs e)
		{
			if (e.CloseReason == CloseReason.UserClosing)
			{
				e.Cancel = true;
				this.Hide();
			}
		}
		
		void CbLayer3CheckedChanged(object sender, EventArgs e)
		{
			RenderZone();
		}
		
		void BtnShowIactsClick(object sender, EventArgs e)
		{
			iactForm.SetThings(zone);
			iactForm.Show();
		}

        private void ZonesForm_Load(object sender, EventArgs e)
        {

        }
	}
}
