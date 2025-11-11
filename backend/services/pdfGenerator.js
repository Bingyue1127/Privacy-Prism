const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Generate a styled PDF report from analysis results using PDFKit
 * Lightweight alternative to Puppeteer (2MB vs 350MB)
 * @param {object} analysisData - The analysis results (content, six dimensions, optional summary paragraph)
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(analysisData) {
  return new Promise((resolve, reject) => {
    try {
      const { content, results, timestamp, summary } = analysisData;

      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Register Chinese font
      const fontPath = path.join(__dirname, '../fonts/NotoSansSC.otf');
      if (fs.existsSync(fontPath)) {
        doc.registerFont('NotoSansSC', fontPath);
        doc.font('NotoSansSC');
      } else {
        console.warn('Chinese font not found, using default font');
      }

      // Buffer to store PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Colors
      const primaryColor = '#667eea';
      const textColor = '#2c3e50';
      const lightGray = '#f8f9fa';

      // Helper function to add a section
      const addDimension = (number, title, content, isFirst = false) => {
        if (!isFirst) {
          doc.addPage();
        }

        // Dimension number and title
        doc.fillColor(primaryColor)
           .fontSize(48)
           .text(number.toString().padStart(2, '0'), 50, 50);

        doc.fillColor(primaryColor)
           .fontSize(24)
           .text(title, 50, 110);

        // Divider line
        doc.moveTo(50, 145)
           .lineTo(545, 145)
           .strokeColor(primaryColor)
           .lineWidth(2)
           .stroke();

        // Content
        doc.fillColor(textColor)
           .fontSize(11)
           .text(content || 'No analysis available', 50, 165, {
             width: 495,
             align: 'left',
             lineGap: 4
           });
      };

      // === PAGE 1: Cover Page ===
      
      // Title
      doc.fillColor(primaryColor)
         .fontSize(36)
         .text('PRIVACY PRISM', 50, 200, { align: 'center' });

      doc.fillColor(textColor)
         .fontSize(16)
         .text('Privacy Risk Analysis Report', 50, 260, { align: 'center' });

      // Timestamp
      doc.fontSize(12)
         .fillColor('#7f8c8d')
         .text(`Generated on ${timestamp || new Date().toLocaleString()}`, 50, 300, { align: 'center' });

      // Divider
      doc.moveTo(150, 340)
         .lineTo(445, 340)
         .strokeColor(primaryColor)
         .lineWidth(3)
         .stroke();

      // Analyzed Content Section
      doc.fillColor(textColor)
         .fontSize(14)
         .text('Analyzed Content', 50, 370);

      const contentPreview = content.length > 800 ? content.substring(0, 800) + '...' : content;
      doc.fontSize(10)
         .fillColor('#555')
         .text(contentPreview, 50, 395, {
           width: 495,
           align: 'left',
           lineGap: 3
         });

      // === PAGE 2-7: Analysis Dimensions ===
      
      doc.addPage();
      addDimension(1, 'EXPOSURE', results.exposure || 'No analysis available', true);
      
      addDimension(2, 'INFERENCE', results.inference || 'No analysis available');
      
      addDimension(3, 'AUDIENCE & CONSEQUENCES', results.audience || 'No analysis available');
      
      addDimension(4, 'PLATFORMS & RULES', results.platforms || 'No analysis available');
      
      addDimension(5, 'AMPLIFICATION', results.amplification || 'No analysis available');
      
      addDimension(6, 'MANIPULABILITY', results.manipulability || 'No analysis available');

      if (summary) {
        doc.addPage();

        doc.fillColor(primaryColor)
          .fontSize(24)
          .text('Executive Summary', 50, 80);

        doc.fillColor(textColor)
          .fontSize(11)
          .text(summary, 50, 130, {
            width: 495,
            align: 'left',
            lineGap: 4,
          });
      }

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(new Error(`Failed to generate PDF: ${error.message}`));
    }
  });
}

module.exports = {
  generatePDF
};
