/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IDicomReader.ts" />
/// <reference path="./../DicomElement.ts" />
/// <reference path="./../DicomTag.ts" />
/// <reference path="./../TagReader.ts" />
/// <reference path="./../utils/DicomConstants.ts" />

class ExplicitDicomReader implements IDicomReader 
{
    readElement(stream: ByteStream): DicomElement 
    {
        if(stream === undefined)
        {
            throw "ExplicitDicomReader.readTag: stream can't be undefined";
        }

        var element = new DicomElement();
        
        var tag: DicomTag = TagReader.ReadTag(stream);
        element.tag = tag.getCode();
        element.tagName = tag.findName();
        element.tagSearchCode = tag.getDicomLookupSearchCode();

        element.vr = stream.readFixedString(2);

        var dataLengthSizeBytes = this._getDataLengthSizeInBytesForVR(element.vr);
        if(dataLengthSizeBytes === 2)
        {
            element.length = stream.readUint16();
            element.offset = stream.position;
        }
        else
        {
            stream.seek(2);
            element.length = stream.readUint32();
            element.offset = stream.position;
        }

        if(element.length === 4294967295) // xFFFFFFFF
        {
            element.isUndefinedLength = true;

            if(element.tag === DicomConstants.Tags.PixelData) 
            {

                console.debug("pixels size ", stream.position);

                // find image pixels size
                
                return element;
            } 
            else 
            {
                console.debug("find item delimitation ", stream.position, element);

                // find item delimitation 

                return element;
            }            
        }

        if(element.vr === 'SQ') {
            // read the sequence
            console.debug("sequence ", stream.position);
        }
        
        stream.seek(element.length);
        
        return element;
    }

    private _getDataLengthSizeInBytesForVR(vr) 
    {
        if( vr === 'OB' ||
            vr === 'OW' ||
            vr === 'SQ' ||
            vr === 'OF' ||
            vr === 'UT' ||
            vr === 'UN')
        {
            return 4;
        }
        else
        {
            return 2;
        }
    }
}