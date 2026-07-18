import Certificate from "../models/Certificate.js";
import QRCode from "qrcode";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import xlsx from "xlsx";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { getCertificateHTML } from "../templates/certificateTemplate.js";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads", "pdfs");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to generate the PDF
export const generateCertificatePDF = async (certData, sharedBrowser = null) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/internship/${certData.certificateId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { width: 100, margin: 1 });
  
  const htmlContent = getCertificateHTML(certData, qrCodeDataUrl);
  
  const browser = sharedBrowser || await puppeteer.launch({ 
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  const pdfPath = path.join(UPLOADS_DIR, `${certData.certificateId}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
  });
  
  await page.close(); // Close the page to free memory

  if (!sharedBrowser) {
    await browser.close(); // Only close the browser if we created it here
  }
  return pdfPath;
};

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Admin
export const createCertificate = async (req, res, next) => {
  try {
    const {
      studentName,
      email,
      phoneNumber,
      college,
      university,
      internshipDomain,
      internshipTitle,
      duration,
      startDate,
      endDate,
    } = req.body;

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `LK-${new Date().getFullYear()}-INT-${randomId}`;

    const certificate = await Certificate.create({
      studentName,
      email,
      phoneNumber,
      college,
      university,
      internshipDomain,
      internshipTitle,
      duration,
      startDate,
      endDate,
      certificateId,
      pdfUrl: `/uploads/certificates/${certificateId}.pdf`
    });

    await generateCertificatePDF(certificate);

    res.status(201).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create certificates via CSV/Excel
// @route   POST /api/certificates/bulk
// @access  Admin
export const bulkCreateCertificates = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an Excel or CSV file" });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "No data found in file" });
    }

    const zip = new AdmZip();
    const generatedCertificates = [];

    // Launch a single shared browser for the entire batch to prevent OOM/crashing on Render
    const browser = await puppeteer.launch({ 
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    try {
      for (const row of data) {
        const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const certificateId = `LK-${new Date().getFullYear()}-INT-${randomId}`;

        // Normalize keys: lowercase and remove spaces
        const normalizedRow = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            const normalizedKey = key.toString().toLowerCase().replace(/\s+/g, '');
            normalizedRow[normalizedKey] = row[key];
          }
        }

        const certificate = await Certificate.create({
          studentName: normalizedRow.studentname || normalizedRow.name,
          email: normalizedRow.email,
          phoneNumber: normalizedRow.phonenumber || normalizedRow.phone,
          college: normalizedRow.college,
          university: normalizedRow.university,
          internshipDomain: normalizedRow.internshipdomain || normalizedRow.domain,
          internshipTitle: normalizedRow.internshiptitle || normalizedRow.title,
          duration: normalizedRow.duration,
          startDate: normalizedRow.startdate,
          endDate: normalizedRow.enddate,
          certificateId,
          pdfUrl: `/uploads/certificates/${certificateId}.pdf`
        });

        const pdfPath = await generateCertificatePDF(certificate, browser);
        zip.addLocalFile(pdfPath);
        generatedCertificates.push(certificate);
      }
    } finally {
      // Always ensure the shared browser is closed even if an error occurs
      await browser.close();
    }

    fs.unlinkSync(filePath); // Clean up uploaded file

    const zipBuffer = zip.toBuffer();
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename="certificates.zip"');
    res.send(zipBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Admin
export const getCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Admin
export const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    
    // Optional: Delete the PDF file if exists
    const pdfPath = path.join(UPLOADS_DIR, `${certificate.certificateId}.pdf`);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    await certificate.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
