/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 14:57
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
namespace GenView
{
	partial class IactForm
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
            this.lbIactIndex = new System.Windows.Forms.ListBox();
            this.splitContainer1 = new System.Windows.Forms.SplitContainer();
            this.tbHex = new System.Windows.Forms.TextBox();
            this.tbAnsi = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.splitContainer1.Panel1.SuspendLayout();
            this.splitContainer1.Panel2.SuspendLayout();
            this.splitContainer1.SuspendLayout();
            this.SuspendLayout();
            // 
            // lbIactIndex
            // 
            this.lbIactIndex.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)));
            this.lbIactIndex.FormattingEnabled = true;
            this.lbIactIndex.Location = new System.Drawing.Point(12, 12);
            this.lbIactIndex.Name = "lbIactIndex";
            this.lbIactIndex.Size = new System.Drawing.Size(55, 290);
            this.lbIactIndex.TabIndex = 0;
            this.lbIactIndex.SelectedIndexChanged += new System.EventHandler(this.LbIactIndexSelectedIndexChanged);
            // 
            // splitContainer1
            // 
            this.splitContainer1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.splitContainer1.Location = new System.Drawing.Point(73, 38);
            this.splitContainer1.Name = "splitContainer1";
            // 
            // splitContainer1.Panel1
            // 
            this.splitContainer1.Panel1.Controls.Add(this.tbHex);
            // 
            // splitContainer1.Panel2
            // 
            this.splitContainer1.Panel2.Controls.Add(this.tbAnsi);
            this.splitContainer1.Size = new System.Drawing.Size(787, 261);
            this.splitContainer1.SplitterDistance = 393;
            this.splitContainer1.TabIndex = 1;
            // 
            // tbHex
            // 
            this.tbHex.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbHex.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tbHex.Location = new System.Drawing.Point(3, 3);
            this.tbHex.Multiline = true;
            this.tbHex.Name = "tbHex";
            this.tbHex.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tbHex.Size = new System.Drawing.Size(387, 255);
            this.tbHex.TabIndex = 0;
            // 
            // tbAnsi
            // 
            this.tbAnsi.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbAnsi.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tbAnsi.Location = new System.Drawing.Point(1, 3);
            this.tbAnsi.Multiline = true;
            this.tbAnsi.Name = "tbAnsi";
            this.tbAnsi.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tbAnsi.Size = new System.Drawing.Size(388, 255);
            this.tbAnsi.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(76, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 2;
            this.label1.Text = "label1";
            // 
            // IactForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(872, 311);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.splitContainer1);
            this.Controls.Add(this.lbIactIndex);
            this.Name = "IactForm";
            this.Text = "IactForm";
            this.Load += new System.EventHandler(this.IactForm_Load);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.IactFormFormClosing);
            this.splitContainer1.Panel1.ResumeLayout(false);
            this.splitContainer1.Panel1.PerformLayout();
            this.splitContainer1.Panel2.ResumeLayout(false);
            this.splitContainer1.Panel2.PerformLayout();
            this.splitContainer1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

		}
		private System.Windows.Forms.Label label1;
		private System.Windows.Forms.TextBox tbAnsi;
		private System.Windows.Forms.TextBox tbHex;
		private System.Windows.Forms.SplitContainer splitContainer1;
		private System.Windows.Forms.ListBox lbIactIndex;
	}
}
