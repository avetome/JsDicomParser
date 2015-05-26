/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IDicomReader.ts" />
/// <reference path="./../DicomElement.ts" />

class ExplicitDicomReader implements IDicomReader {

    readTag(stream: ByteStream):string {

        if(stream === undefined)
        {
            throw "ExplicitDicomReader.readTag: stream can't be undefined";
        }

        var groupNumber =  stream.readUint16() * 256 * 256;
        var elementNumber = stream.readUint16();

        var tag = "x" + ('00000000' + (groupNumber + elementNumber).toString(16)).substr(-8);

        return tag;
    }

    readElement(stream: ByteStream): DicomElement {
        if(stream === undefined)
        {
            throw "ExplicitDicomReader.readTag: stream can't be undefined";
        }

        var element = new DicomElement();
        element.tag = this.readTag(stream);
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

        if(element.length === 4294967295)
        {
            element.isUndefinedLength = true;

            if(element.tag === 'x7fe00010') {
                // find image pixels size
                
                return element;
            } else {
                // find item delimitation 

                return element;
            }            
        }

        if(element.vr === 'SQ') {
            // read the sequence
        }
        
        stream.seek(element.length);
        
        return element;
    }

    _getDataLengthSizeInBytesForVR(vr)
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