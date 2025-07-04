import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export default function PdfViewer({ fileUrl, title }: PdfViewerProps) {
  return (
    <div 
      className="bg-white dark:bg-gray-900 w-full h-full overflow-hidden rounded-lg" 
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => e.preventDefault()}
      style={{ userSelect: 'none' }}
    >
      <Worker workerUrl={workerUrl}>
        <Viewer 
          fileUrl={fileUrl}
          defaultScale={1.0}
        />
      </Worker>
    </div>
  );
}