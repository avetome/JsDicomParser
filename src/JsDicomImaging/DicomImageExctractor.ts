/// <reference path="./DicomImage/DicomImage.ts" />
/// <reference path="./DicomImage/GrayscaleDicomImage.ts" />

module JsDicomImaging 
{
    export class DicomImageExtractor 
    {
        getDicomImage(dicomDataSet: any) 
        {
            console.debug(dicomDataSet);
            var photometricInterpretation = dicomDataSet.getElementAsString('x00280004');
            console.debug(photometricInterpretation);

            if (this._isColorImage(photometricInterpretation)) {
                throw "DicomImageExtractor.getDicomImage: only grayscale images supports yet";
            }

            var image = new GrayscaleDicomImage();
            image.photometricInterpretation = photometricInterpretation;
            image.rows = image.height = dicomDataSet.getElementAsUint16('x00280010');
            image.columns = image.width = dicomDataSet.getElementAsUint16('x00280011');
            image.pixelsCount = image.rows * image.columns;
            image.pixelSpacing = this._getPixelSpacing(dicomDataSet);
            image.pixelData = this._extractStoredPixels(dicomDataSet, image.width, image.height);

            return image;
        }

        private _extractStoredPixels(dataSet: any, width: number, height: number)
        {
            return this._extractUncompressedPixels(dataSet, width, height);
        }

        private _extractUncompressedPixels(dataSet: any, width: number, height: number) 
        {
            var pixelFormat = this._getPixelFormat(dataSet);

            if(pixelFormat !== 2) // unsigned 16 bit
            {
                throw "DicomImageExtractor:_extractUncompressedPixels: only unsigned 16 bit images supports yet"
            }

            var pixelDataElement = dataSet.elements["x7fe00010"];
            var pixelDataOffset = pixelDataElement.offset;

            var numPixels = width * height;

            return new Uint16Array(dataSet.byteArray.buffer, pixelDataElement.offset, numPixels);
        }

        private _getPixelFormat(dataSet: any)
        {
            var pixelRepresentation = dataSet.getElementAsUint16('x00280103');
            var bitsAllocated = dataSet.getElementAsUint16('x00280100');

            if(pixelRepresentation === 0 && bitsAllocated === 8) 
            {
                return 1; // unsigned 8 bit
            } 
            else if(pixelRepresentation === 0 && bitsAllocated === 16) 
            {
                return 2; // unsigned 16 bit
            }
            else if(pixelRepresentation === 1 && bitsAllocated === 16) 
            {
                return 3; // signed 16 bit data
            }
        }

        private _getPixelSpacing(dataSet: any):number {
            var pss = dataSet.getElementAsString('x00280030');
            if (!pss || !pss.length) {
                return 0;
            }

            return parseFloat(pss) || 0;
        }

        private  _isColorImage(photoMetricInterpretation)
        {
            if(photoMetricInterpretation === "RGB" ||
                photoMetricInterpretation === "PALETTE COLOR" ||
                photoMetricInterpretation === "YBR_FULL" ||
                photoMetricInterpretation === "YBR_FULL_422" ||
                photoMetricInterpretation === "YBR_PARTIAL_422" ||
                photoMetricInterpretation === "YBR_PARTIAL_420" ||
                photoMetricInterpretation === "YBR_RCT")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}

declare var module: any;
declare var define: any;

// see http://garrettn.github.io/blog/2014/02/19/write-modular-javascript-that-works-anywhere-with-umd/
if (typeof module === "object" && module.exports) {
    // CommonJS (Node)
    module.exports = JsDicomImaging;
} else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () { return JsDicomImaging; });
}