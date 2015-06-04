module JsDicomImaging {
    export class DicomImage {
        uid: string;
        photometricInterpretation: string; // TODO: create photometricInterpretation enum
        rows: number;
        columns: number;
        width: number;
        height: number;
        pixelsCount: number;
        sizeInBytes: number;
        pixelSpacing: number;
    }
}