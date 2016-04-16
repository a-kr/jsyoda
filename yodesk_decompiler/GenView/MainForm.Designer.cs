/*
 * Created by SharpDevelop.
 * User: Alexey
 * Date: 12.06.2010
 * Time: 11:04
 * 
 * To change this template use Tools | Options | Coding | Edit Standard Headers.
 */
namespace GenView
{
	partial class MainForm
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
			this.btnShowItemsForm = new System.Windows.Forms.Button();
			this.btnShowZonesForm = new System.Windows.Forms.Button();
			this.btnDumpZones = new System.Windows.Forms.Button();
			this.SuspendLayout();
			// 
			// btnShowItemsForm
			// 
			this.btnShowItemsForm.Location = new System.Drawing.Point(12, 12);
			this.btnShowItemsForm.Name = "btnShowItemsForm";
			this.btnShowItemsForm.Size = new System.Drawing.Size(136, 23);
			this.btnShowItemsForm.TabIndex = 0;
			this.btnShowItemsForm.Text = "Items form";
			this.btnShowItemsForm.UseVisualStyleBackColor = true;
			this.btnShowItemsForm.Click += new System.EventHandler(this.BtnShowItemsFormClick);
			// 
			// btnShowZonesForm
			// 
			this.btnShowZonesForm.Location = new System.Drawing.Point(154, 12);
			this.btnShowZonesForm.Name = "btnShowZonesForm";
			this.btnShowZonesForm.Size = new System.Drawing.Size(172, 23);
			this.btnShowZonesForm.TabIndex = 1;
			this.btnShowZonesForm.Text = "Zones form";
			this.btnShowZonesForm.UseVisualStyleBackColor = true;
			this.btnShowZonesForm.Click += new System.EventHandler(this.BtnShowZonesFormClick);
            // 
			// btnDumpZones
			// 
			this.btnDumpZones.Location = new System.Drawing.Point(354, 12);
			this.btnDumpZones.Name = "btnDumpZones";
			this.btnDumpZones.Size = new System.Drawing.Size(172, 23);
			this.btnDumpZones.TabIndex = 1;
			this.btnDumpZones.Text = "DumpZones";
			this.btnDumpZones.UseVisualStyleBackColor = true;
			this.btnDumpZones.Click += new System.EventHandler(this.BtnDumpZonesClick);
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(603, 319);
			this.Controls.Add(this.btnShowZonesForm);
			this.Controls.Add(this.btnShowItemsForm);
			this.Controls.Add(this.btnDumpZones);
			this.Name = "MainForm";
			this.Text = "GenView";
			this.ResumeLayout(false);
		}
		private System.Windows.Forms.Button btnShowZonesForm;
		private System.Windows.Forms.Button btnShowItemsForm;
		private System.Windows.Forms.Button btnDumpZones;
	}
}
