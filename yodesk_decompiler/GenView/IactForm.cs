/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 14:57
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
using System;
using System.Drawing;
using System.Windows.Forms;
using System.Linq;
using System.Text;

namespace GenView
{
	/// <summary>
	/// Description of IactForm.
	/// </summary>
	public partial class IactForm : Form
	{
		Zone zone;
		IACT iact;
		
		public void SetThings(Zone zone)
		{
			this.zone = zone;
			lbIactIndex.Items.Clear();
			lbIactIndex.Items.AddRange(Enumerable.Range(0, zone.Iacts.Length).Select(i => i.ToString()).ToArray());
		}
		
		public IactForm()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			
			//
			// TODO: Add constructor code after the InitializeComponent() call.
			//
		}
		
		void LbIactIndexSelectedIndexChanged(object sender, EventArgs e)
		{
			if (lbIactIndex.SelectedIndex < 0 || lbIactIndex.SelectedIndex >= zone.Iacts.Length)
				return;
			
			iact = zone.Iacts[lbIactIndex.SelectedIndex];
			int iact4 = iact.Raw[4] + iact.Raw[5] * 0x100;
			label1.Text = string.Format("real len: {0}, iact[4]: {1}, diff: {2}",
			                            iact.Raw.Length, iact4, iact.Raw.Length - iact4);
			tbHex.Text = ToHex(iact.Raw);
			tbAnsi.Text = ToAnsi(iact.Raw);
		}
		
		string ToHex(byte[] bytes)
		{
			StringBuilder builder = new StringBuilder();
			for (int i = 0; i < bytes.Length; i++)
			{
				if (i % 16 == 0)
					builder.Append("\r\n");
				builder.Append(bytes[i].ToString("X02") + " ");
			}
			return builder.ToString().Trim();
		}
		
		string ToAnsi(byte[] bytes)
		{
			StringBuilder builder = new StringBuilder();
			for (int i = 0; i < bytes.Length; i++)
			{
				if (i % 16 == 0)
					builder.Append("\r\n");
				
				char c = (char)bytes[i];
				if (Char.IsLetterOrDigit(c) || char.IsPunctuation(c) || c == ' ')
				{
					builder.Append(c);
				}
				else
				{
					builder.Append('.');
				}
			}
			return builder.ToString().Trim();
		}
		
		void IactFormFormClosing(object sender, FormClosingEventArgs e)
		{
			if (e.CloseReason == CloseReason.UserClosing)
			{
				e.Cancel = true;
				this.Hide();
			}
		}
	}
}
