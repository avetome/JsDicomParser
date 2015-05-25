/// <reference path="./../typing/browserify.d.ts" />
/// <reference path="./IDicomReader.ts" />

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
}