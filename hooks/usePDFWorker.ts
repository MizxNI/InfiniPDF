"use client";

import { useEffect, useRef, useCallback } from 'react';

export function usePDFWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize the Web Worker only on the client side
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(new URL('../workers/pdf.worker.ts', import.meta.url));
    }

    return () => {
      // Terminate the worker when the component unmounts to prevent memory leaks
      workerRef.current?.terminate();
    };
  }, []);

  const processJob = useCallback((action: string, payload: any): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current;
      
      if (!worker) {
        return reject(new Error('Web Worker is not initialized.'));
      }

      const handleMessage = (event: MessageEvent) => {
        const { type, result, error } = event.data;
        
        if (type === 'SUCCESS') {
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
          resolve(result);
        } else if (type === 'ERROR') {
          worker.removeEventListener('message', handleMessage);
          worker.removeEventListener('error', handleError);
          reject(new Error(error));
        }
      };

      const handleError = (event: ErrorEvent) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        reject(new Error(event.message || 'Worker encountered an error'));
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);

      worker.postMessage({ type: action, payload });
    });
  }, []);

  return { processJob };
}
