// continentTracer.js - Browser-based continent tracing from logo
class ContinentTracer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.imageData = null;
  }

  async loadLogoImage(imagePath) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.imageData = this.ctx.getImageData(0, 0, img.width, img.height);
        resolve(this.imageData);
      };
      img.onerror = reject;
      img.src = imagePath;
    });
  }

  // Convert to grayscale for edge detection
  toGrayscale(imageData) {
    const data = imageData.data;
    const grayData = new Uint8ClampedArray(data.length / 4);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      grayData[i / 4] = gray;
    }

    return grayData;
  }

  // Apply threshold to create binary image
  applyThreshold(grayData, threshold = 128) {
    const binaryData = new Uint8ClampedArray(grayData.length);

    for (let i = 0; i < grayData.length; i++) {
      binaryData[i] = grayData[i] > threshold ? 255 : 0;
    }

    return binaryData;
  }

  // Simple edge detection using Sobel operator
  detectEdges(binaryData, width, height) {
    const edges = new Uint8ClampedArray(binaryData.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;

        // Sobel X
        const sobelX = (-1 * binaryData[(y-1)*width + (x-1)]) +
                       (1 * binaryData[(y-1)*width + (x+1)]) +
                       (-2 * binaryData[y*width + (x-1)]) +
                       (2 * binaryData[y*width + (x+1)]) +
                       (-1 * binaryData[(y+1)*width + (x-1)]) +
                       (1 * binaryData[(y+1)*width + (x+1)]);

        // Sobel Y
        const sobelY = (-1 * binaryData[(y-1)*width + (x-1)]) +
                       (-2 * binaryData[(y-1)*width + x]) +
                       (-1 * binaryData[(y-1)*width + (x+1)]) +
                       (1 * binaryData[(y+1)*width + (x-1)]) +
                       (2 * binaryData[(y+1)*width + x]) +
                       (1 * binaryData[(y+1)*width + (x+1)]);

        const magnitude = Math.sqrt(sobelX * sobelX + sobelY * sobelY);
        edges[idx] = magnitude > 100 ? 255 : 0; // Threshold for edge detection
      }
    }

    return edges;
  }

  // Find contours using simple boundary tracing
  findContours(edgeData, width, height) {
    const contours = [];
    const visited = new Set();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const key = `${x},${y}`;

        if (edgeData[idx] === 255 && !visited.has(key)) {
          const contour = this.traceContour(edgeData, width, height, x, y, visited);
          if (contour.length > 50) { // Filter small contours
            contours.push(contour);
          }
        }
      }
    }

    return contours;
  }

  // Simple contour tracing algorithm
  traceContour(edgeData, width, height, startX, startY, visited) {
    const contour = [];
    const stack = [[startX, startY]];
    const directions = [
      [0, 1], [1, 1], [1, 0], [1, -1],
      [0, -1], [-1, -1], [-1, 0], [-1, 1]
    ];

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;

      if (x < 0 || x >= width || y < 0 || y >= height || visited.has(key)) {
        continue;
      }

      const idx = y * width + x;
      if (edgeData[idx] === 255) {
        visited.add(key);
        contour.push([x, y]);

        // Add neighboring pixels
        for (const [dx, dy] of directions) {
          stack.push([x + dx, y + dy]);
        }
      }
    }

    return contour;
  }

  // Convert contour to SVG path
  contourToSVGPath(contour, scaleX = 1, scaleY = 1, offsetX = 0, offsetY = 0) {
    if (contour.length === 0) return '';

    let path = `M ${contour[0][0] * scaleX + offsetX},${contour[0][1] * scaleY + offsetY}`;

    for (let i = 1; i < contour.length; i++) {
      path += ` L ${contour[i][0] * scaleX + offsetX},${contour[i][1] * scaleY + offsetY}`;
    }

    path += ' Z';
    return path;
  }

  // Main tracing function
  async traceAfricaContinent(imagePath) {
    try {
      // Load and process image
      const imageData = await this.loadLogoImage(imagePath);
      const grayData = this.toGrayscale(imageData);
      const binaryData = this.applyThreshold(grayData);
      const edges = this.detectEdges(binaryData, imageData.width, imageData.height);

      // Find contours
      const contours = this.findContours(edges, imageData.width, imageData.height);

      // Find largest contour (likely the continent)
      const largestContour = contours.reduce((largest, current) =>
        current.length > largest.length ? current : largest, []);

      // Convert to SVG path with scaling to fit our 400x300 viewBox
      const scaleX = 400 / imageData.width;
      const scaleY = 300 / imageData.height;
      const svgPath = this.contourToSVGPath(largestContour, scaleX, scaleY);

      return {
        originalSize: { width: imageData.width, height: imageData.height },
        contours: contours.length,
        largestContour: largestContour,
        svgPath: svgPath
      };

    } catch (error) {
      console.error('Error tracing continent:', error);
      return null;
    }
  }
}

// Usage example:
export default ContinentTracer;

/*
// In your main script:
import ContinentTracer from './continentTracer.js';

const tracer = new ContinentTracer();
const result = await tracer.traceAfricaContinent('/assets/images/afrAIca-small.png');

if (result) {
  console.log('Traced continent path:', result.svgPath);
  // Update your SVG path in the HTML
  document.getElementById('nuclear-africa-continent-main').setAttribute('d', result.svgPath);
}
*/