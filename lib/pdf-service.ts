import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDF ArrayBuffers into a single PDF document.
 * 
 * @param pdfBuffers An array of ArrayBuffers representing the PDF files to merge.
 * @returns A Promise that resolves to a Uint8Array containing the merged PDF.
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  try {
    if (!pdfBuffers || pdfBuffers.length === 0) {
      throw new Error('No PDF buffers provided for merging.');
    }

    const mergedPdf = await PDFDocument.create();

    for (const buffer of pdfBuffers) {
      const pdf = await PDFDocument.load(buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    return await mergedPdf.save();
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to merge PDFs');
  }
}

/**
 * Splits a PDF by extracting specific pages into a new PDF document.
 * 
 * @param pdfBuffer The ArrayBuffer of the source PDF.
 * @param pageIndices An array of 0-based page indices to extract.
 * @returns A Promise that resolves to a Uint8Array containing the new PDF.
 */
export async function splitPdf(pdfBuffer: ArrayBuffer, pageIndices: number[]): Promise<Uint8Array> {
  try {
    if (!pdfBuffer) {
      throw new Error('No PDF buffer provided for splitting.');
    }
    
    if (!pageIndices || pageIndices.length === 0) {
      throw new Error('No page indices provided for extraction.');
    }

    const sourcePdf = await PDFDocument.load(pdfBuffer);
    const totalPages = sourcePdf.getPageCount();

    // Validate indices
    for (const index of pageIndices) {
      if (index < 0 || index >= totalPages) {
        throw new Error(`Page index ${index} is out of bounds. The document has ${totalPages} pages.`);
      }
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);

    copiedPages.forEach((page) => {
      newPdf.addPage(page);
    });

    return await newPdf.save();
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to split PDF');
  }
}
