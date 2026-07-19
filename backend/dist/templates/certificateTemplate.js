export const getCertificateHTML = (certData, qrCodeDataUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearnKins Certificate</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 297mm;
        height: 210mm;
        box-sizing: border-box;
        font-family: 'Montserrat', sans-serif;
        background: #fdfdfd;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      
      .certificate-container {
        width: 100%;
        height: 100%;
        padding: 20mm;
        box-sizing: border-box;
        position: relative;
        background: radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
      }

      .border-outer {
        position: absolute;
        top: 10mm;
        left: 10mm;
        right: 10mm;
        bottom: 10mm;
        border: 2px solid #e2e8f0;
        z-index: 1;
      }

      .border-inner {
        position: absolute;
        top: 12mm;
        left: 12mm;
        right: 12mm;
        bottom: 12mm;
        border: 8px solid #4f46e5;
        z-index: 2;
      }

      .content {
        position: relative;
        z-index: 10;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
      }

      .logo-container {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo-icon {
        width: 40px;
        height: 40px;
        background-color: #4f46e5;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 24px;
      }

      .logo-text {
        font-size: 28px;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: -1px;
      }
      
      .title {
        font-family: 'Playfair Display', serif;
        font-size: 48px;
        color: #1e293b;
        margin: 0 0 10px 0;
        text-transform: uppercase;
        letter-spacing: 4px;
      }

      .subtitle {
        font-size: 16px;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 40px;
      }

      .presented-to {
        font-size: 14px;
        color: #94a3b8;
        margin-bottom: 15px;
      }

      .student-name {
        font-family: 'Playfair Display', serif;
        font-size: 56px;
        font-style: italic;
        color: #4f46e5;
        margin: 0 0 30px 0;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 10px;
        width: 70%;
      }

      .description {
        font-size: 16px;
        line-height: 1.6;
        color: #475569;
        max-width: 70%;
        margin-bottom: 50px;
      }

      .highlight {
        font-weight: 600;
        color: #1e293b;
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 80%;
        margin-top: auto;
        padding-bottom: 20px;
      }

      .signature-block {
        text-align: center;
      }

      .signature-line {
        width: 200px;
        height: 1px;
        background-color: #cbd5e1;
        margin-bottom: 10px;
      }

      .signature-name {
        font-weight: 600;
        font-size: 14px;
        color: #1e293b;
      }

      .signature-title {
        font-size: 12px;
        color: #64748b;
      }

      .qr-block {
        text-align: center;
      }

      .qr-code {
        width: 100px;
        height: 100px;
        background-color: white;
        padding: 5px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        margin-bottom: 5px;
      }

      .qr-text {
        font-size: 10px;
        color: #64748b;
        margin-top: 5px;
      }

      .cert-id {
        font-size: 10px;
        color: #94a3b8;
        font-family: monospace;
      }
      
      .corner-decoration {
        position: absolute;
        width: 50px;
        height: 50px;
        border: 4px solid #4f46e5;
        z-index: 3;
      }

      .tl { top: 12mm; left: 12mm; border-right: none; border-bottom: none; }
      .tr { top: 12mm; right: 12mm; border-left: none; border-bottom: none; }
      .bl { bottom: 12mm; left: 12mm; border-right: none; border-top: none; }
      .br { bottom: 12mm; right: 12mm; border-left: none; border-top: none; }
    </style>
  </head>
  <body>
    <div class="certificate-container">
      <div class="border-outer"></div>
      <div class="border-inner"></div>
      <div class="corner-decoration tl"></div>
      <div class="corner-decoration tr"></div>
      <div class="corner-decoration bl"></div>
      <div class="corner-decoration br"></div>
      
      <div class="content">
        <div class="logo-container">
          <div class="logo-icon">LK</div>
          <div class="logo-text">LearnKins</div>
        </div>
        
        <h1 class="title">Certificate of Internship</h1>
        <div class="subtitle">Awarded for Outstanding Achievement</div>
        
        <div class="presented-to">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
        
        <h2 class="student-name">${certData.studentName}</h2>
        
        <div class="description">
          In recognition of successful completion of the <span class="highlight">${certData.internshipTitle}</span> 
          internship program at LearnKins. During the period of <span class="highlight">${certData.duration}</span> 
          (From ${new Date(certData.startDate).toLocaleDateString()} to ${new Date(certData.endDate).toLocaleDateString()}), 
          they demonstrated excellent skills in <span class="highlight">${certData.internshipDomain}</span>.
        </div>
        
        <div class="footer">
          <div class="signature-block">
            <div class="signature-line"></div>
            <div class="signature-name">Soumya Ranjan Nayak</div>
            <div class="signature-title">CEO & Founder, LearnKins</div>
          </div>
          
          <div class="qr-block">
            <img src="${qrCodeDataUrl}" alt="QR Code" class="qr-code">
            <div class="qr-text">Scan to Verify</div>
            <div class="cert-id">${certData.certificateId}</div>
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};