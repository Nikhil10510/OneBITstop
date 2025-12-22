import { Readable } from 'stream';

export const handleFileUpload = (req, res, next) => {
  // Only process multipart form data
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }

  
  let data = Buffer.alloc(0);
  
  req.on('data', chunk => {
    data = Buffer.concat([data, chunk]);
  });

  req.on('end', () => {
    try {
      
      // Extract boundary
      const contentType = req.headers['content-type'];
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      
      if (!boundaryMatch) {
        throw new Error('No boundary found in Content-Type');
      }
      
      const boundary = boundaryMatch[1];
      
      // Split by boundary
      const boundaryStr = '--' + boundary;
      const endBoundaryStr = '--' + boundary + '--';
      
      const parts = data.toString('binary').split(boundaryStr);
      
      const formData = {};
      const files = [];
      
      for (let i = 1; i < parts.length - 1; i++) { // Skip first and last parts
        const part = parts[i];
        
        // Find the double CRLF that separates headers from body
        const headerEnd = part.indexOf('\r\n\r\n');
        if (headerEnd === -1) {
          continue;
        }
        
        const headers = part.substring(0, headerEnd);
        const body = part.substring(headerEnd + 4);
        
        // Extract field name
        const nameMatch = headers.match(/name="([^"]+)"/);
        if (!nameMatch) {
          continue;
        }
        
        const fieldName = nameMatch[1];
        
        // Check if it's a file
        const filenameMatch = headers.match(/filename="([^"]+)"/);
        const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
        
        if (filenameMatch && contentTypeMatch) {
          // It's a file
          const fileName = filenameMatch[1];
          const contentType = contentTypeMatch[1];
          
          // Remove trailing CRLF from body
          const cleanBody = body.replace(/\r\n$/, '');
          
          // Convert to base64
          const buffer = Buffer.from(cleanBody, 'binary');
          const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
          
          files.push({
            fieldName,
            fileName,
            contentType,
            base64Data,
            buffer
          });

        } else {
          // It's a regular field
          const fieldValue = body.replace(/\r\n$/, '');
          formData[fieldName] = fieldValue;
        }
      }
      
      req.body = formData;
      req.files = files;
      next();
      
    } catch (error) {
      res.status(400).json({ 
        message: 'Error parsing form data', 
        error: error.message,
        stack: error.stack 
      });
    }
  });
}; 