import PDFDocument from 'pdfkit';
import { Prescription } from '../../entities/prescription.entity';
import { WritableStreamBuffer } from 'stream-buffers';

export async function generatePrescriptionPDF(
  prescription: Prescription,
  doctorId: string,
): Promise<Buffer> {
  const doc = new PDFDocument();
  const bufferStream = new WritableStreamBuffer();

  doc.pipe(bufferStream);
  doc.fontSize(16).text(`Prescription ID: ${prescription.id}`);
  doc.text(`Doctor: Dr ${doctorId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text('Items:');
  prescription.items.forEach((i) => {
    doc.text(`${i.denomination} ${i.dosage} - ${i.posologie}`);
  });
  doc.text(
    `Signé électroniquement par Dr ${doctorId} le ${new Date().toLocaleString()}`,
  );
  doc.end();

  return new Promise((resolve) => {
    bufferStream.on('finish', () =>
      resolve(bufferStream.getContents() as Buffer),
    );
  });
}
