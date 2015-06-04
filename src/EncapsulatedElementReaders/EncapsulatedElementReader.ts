/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./../DicomElement.ts" />
/// <reference path="./../DicomTag.ts" />
/// <reference path="./../TagReader.ts" />
/// <reference path="./../ByteStream.ts" />
/// <reference path="./../Utils/DicomConstants.ts" />

// according this: http://medical.nema.org/dicom/2013/output/chtml/part05/sect_A.4.html
class EncapsulatedElementReader {
    
    static readElement(stream: ByteStream, element: DicomElement) {
        element.isEncapsulatedPixelData = true;
        element.basicOffsetTable = [];
        element.fragments = [];

        var basicOffsetTableItemTag = TagReader.ReadTag(stream).getCode();

        if(basicOffsetTableItemTag !== DicomConstants.Tags.StartOfItem) {
            throw "EncapsulatedElementReader.readElement: basic offset table not found";
        }

        var basicOffsetTableItemlength = stream.readUint32();
        var fragmentsCount = basicOffsetTableItemlength / 4;

        console.debug("fragmentsCount: ", fragmentsCount);

        for(var i = 0; i < fragmentsCount; i++) {
            var offset = stream.readUint32();
            element.basicOffsetTable.push(offset);
        }

        console.debug("element.basicOffsetTable: ", element.basicOffsetTable);

        var baseOffset = stream.position;

        while(stream.position < stream.byteArray.length) {
            var tag = TagReader.ReadTag(stream).getCode();
            var length = stream.readUint32();

            if(tag === DicomConstants.Tags.EndOfSequence) {
                stream.seek(length);
                element.length = stream.position - element.offset;

                return;
            }
            else if (tag === DicomConstants.Tags.StartOfItem) {
                element.fragments.push({
                    offset: stream.position - baseOffset - 8,
                    position : stream.position,
                    length : length
                });
            }
            else {
                if(length > stream.byteArray.length - stream.position)
                {                    
                    length = stream.byteArray.length - stream.position;
                }

                element.fragments.push({
                    offset: stream.position - baseOffset - 8,
                    position : stream.position,
                    length : length
                });

                stream.seek(length);
                element.length = stream.position - element.offset;
                return;                
            }

            stream.seek(length);
        }        
    }
}