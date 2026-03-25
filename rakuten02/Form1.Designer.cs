namespace rakuten02
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            txtCheckin = new TextBox();
            txtCheckout = new TextBox();
            txtPlace = new TextBox();
            btnSearch = new Button();
            webView = new Microsoft.Web.WebView2.WinForms.WebView2();
            cboRadius = new ComboBox();
            label4 = new Label();
            ((System.ComponentModel.ISupportInitialize)webView).BeginInit();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(69, 26);
            label1.Name = "label1";
            label1.Size = new Size(72, 20);
            label1.TabIndex = 0;
            label1.Text = "チェックイン";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(69, 102);
            label2.Name = "label2";
            label2.Size = new Size(83, 20);
            label2.TabIndex = 1;
            label2.Text = "チェックアウト";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Location = new Point(69, 139);
            label3.Name = "label3";
            label3.Size = new Size(39, 20);
            label3.TabIndex = 2;
            label3.Text = "場所";
            // 
            // txtCheckin
            // 
            txtCheckin.Location = new Point(69, 49);
            txtCheckin.Name = "txtCheckin";
            txtCheckin.Size = new Size(125, 27);
            txtCheckin.TabIndex = 3;
            // 
            // txtCheckout
            // 
            txtCheckout.Location = new Point(69, 102);
            txtCheckout.Name = "txtCheckout";
            txtCheckout.Size = new Size(125, 27);
            txtCheckout.TabIndex = 4;
            // 
            // txtPlace
            // 
            txtPlace.Location = new Point(69, 162);
            txtPlace.Name = "txtPlace";
            txtPlace.Size = new Size(125, 27);
            txtPlace.TabIndex = 5;
            // 
            // btnSearch
            // 
            btnSearch.Location = new Point(85, 267);
            btnSearch.Name = "btnSearch";
            btnSearch.Size = new Size(94, 29);
            btnSearch.TabIndex = 6;
            btnSearch.Text = "検索";
            btnSearch.UseVisualStyleBackColor = true;
            btnSearch.Click += btnSearch_Click;
            // 
            // webView
            // 
            webView.AllowExternalDrop = true;
            webView.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            webView.CreationProperties = null;
            webView.DefaultBackgroundColor = Color.White;
            webView.Location = new Point(217, 26);
            webView.Name = "webView";
            webView.Size = new Size(583, 419);
            webView.TabIndex = 7;
            webView.ZoomFactor = 1D;
            // 
            // cboRadius
            // 
            cboRadius.FormattingEnabled = true;
            cboRadius.Location = new Point(60, 233);
            cboRadius.Name = "cboRadius";
            cboRadius.Size = new Size(151, 28);
            cboRadius.TabIndex = 8;
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Location = new Point(60, 210);
            label4.Name = "label4";
            label4.Size = new Size(69, 20);
            label4.TabIndex = 9;
            label4.Text = "検索半径";
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(label4);
            Controls.Add(cboRadius);
            Controls.Add(webView);
            Controls.Add(btnSearch);
            Controls.Add(txtPlace);
            Controls.Add(txtCheckout);
            Controls.Add(txtCheckin);
            Controls.Add(label3);
            Controls.Add(label2);
            Controls.Add(label1);
            Name = "Form1";
            Text = "終電逃したアプリ";
            Load += Form1_Load;
            ((System.ComponentModel.ISupportInitialize)webView).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label label1;
        private Label label2;
        private Label label3;
        private TextBox txtCheckin;
        private TextBox txtCheckout;
        private TextBox txtPlace;
        private Button btnSearch;
        private Microsoft.Web.WebView2.WinForms.WebView2 webView;
        private ComboBox cboRadius;
        private Label label4;
    }
}
