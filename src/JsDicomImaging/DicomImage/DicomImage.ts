module JsDicomImaging {
    export class DicomImage {
        uid: string;
        
        photometricInterpretation: string; // TODO: create photometricInterpretation enum
        pixelSpacing: number;

        rows: number;
        columns: number;

        width: number;
        height: number;

        pixelsCount: number;
        sizeInBytes: number;
        
        windowCenter: number;
        windowWidth: number;

        maxPixelValue: number;
        minPixelValue: number;
    }
}