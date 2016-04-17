/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:31
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Linq;

namespace GenView
{
	/// <summary>
	/// Description of ItemsForm.
	/// </summary>
	public partial class ItemsForm : Form
	{
		private ItemCollection Collection;
		
		public void SetCollection(ItemCollection collection)
		{
			Collection = collection;
			lbItems.Items.Clear();
			lbItems.Items.AddRange(Enumerable.Range(0, collection.Items.Length).Cast<object>().ToArray());
		}
		
		public ItemsForm()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			
			//
			// TODO: Add constructor code after the InitializeComponent() call.
			//
		}
		
		void ItemsFormFormClosing(object sender, FormClosingEventArgs e)
		{
			if (e.CloseReason == CloseReason.UserClosing)
			{
				e.Cancel = true;
				this.Hide();
			}
		}
		
		void LbItemsDrawItem(object sender, DrawItemEventArgs e)
		{
			e.DrawBackground();
			
			if (e.Index < 0 || e.Index >= Collection.Items.Length)
				return;
			
			string numbers = string.Format("{0:000} 0x{1} sprite {2:00000} 0x{3}",
			                               Collection.Items[e.Index].Index,
			                               Collection.Items[e.Index].Index.ToString("X2"),
                                           Collection.Items[e.Index].Sprite,
                                           Collection.Items[e.Index].Sprite.ToString("X4")
                                           );
			Brush brush = new SolidBrush(e.ForeColor);
			e.Graphics.DrawString(numbers, e.Font, brush, 2, e.Bounds.Top + 13);
			Bitmap b = SpriteMgr.GetSprite(Collection.Items[e.Index].Sprite);
			e.Graphics.CompositingMode = System.Drawing.Drawing2D.CompositingMode.SourceOver;
			e.Graphics.DrawImage(b, 160, e.Bounds.Top + 1, 32, 32);
			e.Graphics.DrawString(Collection.Items[e.Index].Name, e.Font, brush, 196,  e.Bounds.Top + 13);			
		}
		
		void TbFinderTextChanged(object sender, EventArgs e)
		{
			string lowertext = tbFinder.Text;
			int found = -1;
			for (int i = 0; i < Collection.Items.Length; i++)
			{
				if (Collection.Items[i].Name.ToLower().StartsWith(lowertext, true,
				                                                  System.Globalization.CultureInfo.InvariantCulture))
				{
					found = i;
					break;
				}
			}

            if (found == -1)
            {
                int spriteNo;
                if (Int32.TryParse(lowertext, out spriteNo)) {
                    for (int i = 0; i < Collection.Items.Length; i++)
                    {
                        if (Collection.Items[i].Sprite == spriteNo)
                        {
                            found = i;
                            break;
                        }
                    }
                }
            }
			
			if (found == -1)
			{
				tbFinder.BackColor = Color.Red;
			}
			else
			{
				tbFinder.BackColor = Color.Lime;
				lbItems.SelectedIndex = found;
			}
		}

        private void lbItems_SelectedIndexChanged(object sender, EventArgs e)
        {

        }
	}
}
