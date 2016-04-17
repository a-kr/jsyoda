/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:04
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
	/// Description of MainForm.
	/// </summary>
	public partial class MainForm : Form
	{
		const string DtaFname = @"Yodesk.dta";
		const string ZoneOffsetsFname = @"offsets.txt";
		const string PaletteFname = @"yopal.1";

		public ItemsForm itemsForm;
		public ZonesForm zonesForm;
		
		public ItemCollection itemCollection;
		
		public MainForm()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			
			//
			// TODO: Add constructor code after the InitializeComponent() call.
			//
			SpriteExtractor.LoadPalette(PaletteFname);

            SpriteExtractor.Yodesk = this.GetReader();			
			itemCollection = new ItemCollection(this.GetReader());
			
			itemsForm = new ItemsForm();
			itemsForm.SetCollection(itemCollection);
			
			int[] zoneOffsets = File.ReadAllLines(ZoneOffsetsFname).Select(s => int.Parse(s)).ToArray();
			zonesForm = new ZonesForm();
			zonesForm.SetThings(this.GetReader(), zoneOffsets);
		}

        public YodaReader GetReader()
        {
            return new YodaReader(File.OpenRead(DtaFname));
        }
		
		void BtnShowItemsFormClick(object sender, EventArgs e)
		{
			itemsForm.Show();
		}
		
		void BtnShowZonesFormClick(object sender, EventArgs e)
		{
			zonesForm.Show();
            zonesForm.WindowState = FormWindowState.Maximized;
		}
        
		void BtnDumpZonesClick(object sender, EventArgs eventargs)
		{
            var filestream = System.IO.File.OpenWrite(@"yozones.js");
            var stream = new System.IO.StreamWriter(filestream);
            var yodesk = this.GetReader();
            stream.WriteLine("ZONES = {};\n\n");
            
			IEnumerable<ZonesForm.ZoneListEntry> to_dump;
            to_dump = ZonesForm.entries.Where(e => (e.planet == 1 && e.type == 1));
            
            Func<int, int> tn = delegate (int tile) {
                return (tile >= SpriteMgr.SpriteCount) ? SpriteMgr.EmptyTileIndex : tile;
            };
            
            foreach (ZonesForm.ZoneListEntry entry in to_dump) {
                yodesk.Seek(entry.offset, 0);
                //Yodesk.Seek(0x022cb64, 0);
                var zone = new GenView.Zone(yodesk);
                
                
                stream.WriteLine("ZONES[{0}] = {{", entry.index);
                stream.WriteLine("\twidth: {0},", zone.Width);
                stream.WriteLine("\theight: {0},", zone.Height);
                stream.WriteLine("\ttiles: [");
                for (var i = 0; i < zone.Width; i++) {
                    stream.Write("\t\t");
                    for (var j = 0; j < zone.Height; j++) {
                        stream.Write("{0},{1},{2}, ", 
                            tn(zone.Cells[i,j].SpriteOne),
                            tn(zone.Cells[i,j].SpriteTwo),
                            tn(zone.Cells[i,j].SpriteThree));
                    }
                    stream.WriteLine();
                }
                stream.WriteLine("\t],");
                stream.WriteLine("};");
            } // end foreach
            
            stream.WriteLine("");
            stream.WriteLine("var WILD_ZONES = [");
            foreach (var entry in to_dump) {
                stream.WriteLine("\t{0},", entry.index);
            }
            stream.WriteLine("];\n");
            
            stream.Close();
            
            MessageBox.Show("Done.");
		}

        private void btnDumpPuzzles_Click(object sender, EventArgs e)
        {
            var puzzleCollection = new PuzzleCollection();
            puzzleCollection.Deserialize(this.GetReader());

            puzzleCollection.ExportToCsv("puzzles.csv");

            MessageBox.Show("Done.");
        }
	}
}
