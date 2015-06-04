/// <reference path="./DicomImage.ts" />

module JsDicomImaging {
    export class GrayscaleDicomImage extends DicomImage {
        pixelData: Uint16Array;
    }
}