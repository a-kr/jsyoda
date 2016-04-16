/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 12:43
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
namespace GenView
{
	partial class ZonesForm
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
            this.lbZoneIndex = new System.Windows.Forms.ListBox();
            this.panelForImage = new System.Windows.Forms.Panel();
            this.pbImage = new System.Windows.Forms.PictureBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.cbLayer3 = new System.Windows.Forms.CheckBox();
            this.cbLayer2 = new System.Windows.Forms.CheckBox();
            this.cbLayer1 = new System.Windows.Forms.CheckBox();
            this.btnShowIacts = new System.Windows.Forms.Button();
            this.tbZZ = new System.Windows.Forms.TextBox();
            this.panelForImage.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pbImage)).BeginInit();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // lbZoneIndex
            // 
            this.lbZoneIndex.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)));
            this.lbZoneIndex.FormattingEnabled = true;
            this.lbZoneIndex.Location = new System.Drawing.Point(12, 12);
            this.lbZoneIndex.Name = "lbZoneIndex";
            this.lbZoneIndex.Size = new System.Drawing.Size(149, 459);
            this.lbZoneIndex.TabIndex = 0;
            this.lbZoneIndex.SelectedIndexChanged += new System.EventHandler(this.LbZoneIndexSelectedIndexChanged);
            // 
            // panelForImage
            // 
            this.panelForImage.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Left)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.panelForImage.AutoScroll = true;
            this.panelForImage.Controls.Add(this.pbImage);
            this.panelForImage.Location = new System.Drawing.Point(167, 12);
            this.panelForImage.Name = "panelForImage";
            this.panelForImage.Size = new System.Drawing.Size(386, 465);
            this.panelForImage.TabIndex = 1;
            // 
            // pbImage
            // 
            this.pbImage.Location = new System.Drawing.Point(3, 3);
            this.pbImage.Name = "pbImage";
            this.pbImage.Size = new System.Drawing.Size(100, 50);
            this.pbImage.SizeMode = System.Windows.Forms.PictureBoxSizeMode.AutoSize;
            this.pbImage.TabIndex = 0;
            this.pbImage.TabStop = false;
            // 
            // groupBox1
            // 
            this.groupBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.groupBox1.Controls.Add(this.cbLayer3);
            this.groupBox1.Controls.Add(this.cbLayer2);
            this.groupBox1.Controls.Add(this.cbLayer1);
            this.groupBox1.Location = new System.Drawing.Point(559, 15);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(132, 89);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Слои";
            // 
            // cbLayer3
            // 
            this.cbLayer3.Checked = true;
            this.cbLayer3.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbLayer3.Location = new System.Drawing.Point(7, 60);
            this.cbLayer3.Name = "cbLayer3";
            this.cbLayer3.Size = new System.Drawing.Size(104, 24);
            this.cbLayer3.TabIndex = 2;
            this.cbLayer3.Text = "Слой 3";
            this.cbLayer3.UseVisualStyleBackColor = true;
            this.cbLayer3.CheckedChanged += new System.EventHandler(this.CbLayer3CheckedChanged);
            // 
            // cbLayer2
            // 
            this.cbLayer2.Checked = true;
            this.cbLayer2.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbLayer2.Location = new System.Drawing.Point(7, 40);
            this.cbLayer2.Name = "cbLayer2";
            this.cbLayer2.Size = new System.Drawing.Size(104, 24);
            this.cbLayer2.TabIndex = 1;
            this.cbLayer2.Text = "Слой 2";
            this.cbLayer2.UseVisualStyleBackColor = true;
            this.cbLayer2.CheckedChanged += new System.EventHandler(this.CbLayer3CheckedChanged);
            // 
            // cbLayer1
            // 
            this.cbLayer1.Checked = true;
            this.cbLayer1.CheckState = System.Windows.Forms.CheckState.Checked;
            this.cbLayer1.Location = new System.Drawing.Point(7, 20);
            this.cbLayer1.Name = "cbLayer1";
            this.cbLayer1.Size = new System.Drawing.Size(104, 24);
            this.cbLayer1.TabIndex = 0;
            this.cbLayer1.Text = "Слой 1";
            this.cbLayer1.UseVisualStyleBackColor = true;
            this.cbLayer1.CheckedChanged += new System.EventHandler(this.CbLayer3CheckedChanged);
            // 
            // btnShowIacts
            // 
            this.btnShowIacts.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnShowIacts.Location = new System.Drawing.Point(697, 26);
            this.btnShowIacts.Name = "btnShowIacts";
            this.btnShowIacts.Size = new System.Drawing.Size(101, 23);
            this.btnShowIacts.TabIndex = 3;
            this.btnShowIacts.Text = "button1";
            this.btnShowIacts.UseVisualStyleBackColor = true;
            this.btnShowIacts.Click += new System.EventHandler(this.BtnShowIactsClick);
            // 
            // tbZZ
            // 
            this.tbZZ.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom)
                        | System.Windows.Forms.AnchorStyles.Right)));
            this.tbZZ.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.tbZZ.Location = new System.Drawing.Point(559, 110);
            this.tbZZ.Multiline = true;
            this.tbZZ.Name = "tbZZ";
            this.tbZZ.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.tbZZ.Size = new System.Drawing.Size(239, 367);
            this.tbZZ.TabIndex = 5;
            // 
            // ZonesForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(810, 496);
            this.Controls.Add(this.tbZZ);
            this.Controls.Add(this.btnShowIacts);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.panelForImage);
            this.Controls.Add(this.lbZoneIndex);
            this.Name = "ZonesForm";
            this.Text = "ZonesForm";
            this.Load += new System.EventHandler(this.ZonesForm_Load);
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.ZonesFormFormClosing);
            this.panelForImage.ResumeLayout(false);
            this.panelForImage.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pbImage)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

		}
        private System.Windows.Forms.TextBox tbZZ;
		private System.Windows.Forms.Button btnShowIacts;
		private System.Windows.Forms.CheckBox cbLayer1;
		private System.Windows.Forms.CheckBox cbLayer2;
		private System.Windows.Forms.CheckBox cbLayer3;
		private System.Windows.Forms.GroupBox groupBox1;
		private System.Windows.Forms.PictureBox pbImage;
		private System.Windows.Forms.Panel panelForImage;
		private System.Windows.Forms.ListBox lbZoneIndex;
	}
}
