/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:31
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
namespace GenView
{
	partial class ItemsForm
	{
		/// <summary>
		/// Designer variable used to keep track of non-visual components.
		/// </summary>
		private System.ComponentModel.IContainer components = null;
		
		/// <summary>
		/// Disposes resources used by the form.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing) {
				if (components != null) {
					components.Dispose();
				}
			}
			base.Dispose(disposing);
		}
		
		/// <summary>
		/// This method is required for Windows Forms designer support.
		/// Do not change the method contents inside the source code editor. The Forms designer might
		/// not be able to load this method if it was changed manually.
		/// </summary>
		private void InitializeComponent()
		{
            this.lbItems = new System.Windows.Forms.ListBox();
            this.tbFinder = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // lbItems
            // 
            this.lbItems.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.lbItems.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.lbItems.FormattingEnabled = true;
            this.lbItems.ItemHeight = 34;
            this.lbItems.Location = new System.Drawing.Point(12, 46);
            this.lbItems.Name = "lbItems";
            this.lbItems.Size = new System.Drawing.Size(580, 208);
            this.lbItems.TabIndex = 0;
            this.lbItems.DrawItem += new System.Windows.Forms.DrawItemEventHandler(this.LbItemsDrawItem);
            this.lbItems.SelectedIndexChanged += new System.EventHandler(this.lbItems_SelectedIndexChanged);
            // 
            // tbFinder
            // 
            this.tbFinder.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbFinder.Location = new System.Drawing.Point(12, 12);
            this.tbFinder.Name = "tbFinder";
            this.tbFinder.Size = new System.Drawing.Size(580, 20);
            this.tbFinder.TabIndex = 1;
            this.tbFinder.TextChanged += new System.EventHandler(this.TbFinderTextChanged);
            // 
            // ItemsForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(604, 266);
            this.Controls.Add(this.tbFinder);
            this.Controls.Add(this.lbItems);
            this.Name = "ItemsForm";
            this.Text = "ItemsForm";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.ItemsFormFormClosing);
            this.ResumeLayout(false);
            this.PerformLayout();

		}
		private System.Windows.Forms.TextBox tbFinder;
		private System.Windows.Forms.ListBox lbItems;
	}
}
