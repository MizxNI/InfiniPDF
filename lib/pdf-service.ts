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

/**
 * Protects a PDF document with a password.
 * 
 * @param pdfBuffer The ArrayBuffer of the source PDF.
 * @param password The password to encrypt the PDF with.
 * @returns A Promise that resolves to a Uint8Array containing the encrypted PDF.
 */
export async function protectPdf(pdfBuffer: ArrayBuffer, password: string): Promise<Uint8Array> {
  try {
    if (!pdfBuffer) {
      throw new Error('No PDF buffer provided for protection.');
    }
    if (!password) {
      throw new Error('No password provided.');
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Encrypt the document using pdf-lib
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        documentAssembly: false,
      },
    });

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error protecting PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to protect PDF');
  }
}

/**
 * Unlocks a password-protected PDF document.
 * 
 * @param pdfBuffer The ArrayBuffer of the protected PDF.
 * @param password The password to decrypt the PDF.
 * @returns A Promise that resolves to a Uint8Array containing the unlocked PDF.
 */
export async function unlockPdf(pdfBuffer: ArrayBuffer, password: string): Promise<Uint8Array> {
  try {
    if (!pdfBuffer) {
      throw new Error('No PDF buffer provided for unlocking.');
    }

    // Load the document with the password
    const pdfDoc = await PDFDocument.load(pdfBuffer, { password });
    
    // Save it without encryption
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error unlocking PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to unlock PDF. Incorrect password?');
  }
}

export interface ImageInput {
  buffer: ArrayBuffer;
  mimeType: string;
}

/**
 * Converts one or more images into a single PDF document.
 * 
 * @param images An array of objects containing the image buffer and mimeType.
 * @returns A Promise that resolves to a Uint8Array containing the new PDF.
 */
export async function imageToPdf(images: ImageInput[]): Promise<Uint8Array> {
  try {
    if (!images || images.length === 0) {
      throw new Error('No images provided.');
    }

    const pdfDoc = await PDFDocument.create();
    
    for (const imgData of images) {
      let image;
      if (imgData.mimeType === 'image/jpeg' || imgData.mimeType === 'image/jpg') {
        image = await pdfDoc.embedJpg(imgData.buffer);
      } else if (imgData.mimeType === 'image/png') {
        image = await pdfDoc.embedPng(imgData.buffer);
      } else if (imgData.mimeType === 'image/webp') {
         // Note: pdf-lib doesn't natively support WebP embedding. 
         // For a robust production app, we'd need to convert WebP to JPG/PNG first 
         // using a canvas or another library. For now, we will throw an error to fail gracefully.
         throw new Error(`Unsupported image MIME type for direct embedding: ${imgData.mimeType}. Please convert to JPG or PNG.`);
      } else {
        throw new Error(`Unsupported image MIME type: ${imgData.mimeType}`);
      }

      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to convert images to PDF');
  }
}

/**
 * Renames a file by appending a suffix before the extension.
 * 
 * @param filename The original filename.
 * @param suffix The suffix to append (e.g., '_merged').
 * @returns The new filename.
 */
export function renameFile(filename: string, suffix: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${filename}${suffix}.pdf`;
  }
  const name = filename.substring(0, lastDotIndex);
  return `${name}${suffix}.pdf`;
}
