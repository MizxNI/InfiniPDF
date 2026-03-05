import { mergePdfs, splitPdf, protectPdf, imageToPdf } from '../lib/pdf-service';

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  try {
    let result: Uint8Array;

    switch (type) {
      case 'MERGE':
        result = await mergePdfs(payload.pdfBuffers);
        break;

      case 'SPLIT':
        result = await splitPdf(payload.pdfBuffer, payload.pageIndices);
        break;

      case 'PROTECT':
        result = await protectPdf(payload.pdfBuffer, payload.password);
        break;

      case 'IMAGE_TO_PDF':
        result = await imageToPdf(payload.images);
        break;

      default:
        throw new Error(`Unknown worker operation type: ${type}`);
    }

    self.postMessage({ type: 'SUCCESS', result });
  } catch (error: any) {
    self.postMessage({ type: 'ERROR', error: error.message || 'An unknown error occurred in the Web Worker' });
  }
};
