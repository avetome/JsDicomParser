/// <reference path="./../DicomElement.ts" />
/// <reference path="./../DicomTag.ts" />
/// <reference path="./../ByteStream.ts" />
/// <reference path="./../TagReader.ts" />
/// <reference path="./../DicomDataSet.ts" />
/// <reference path="./../Utils/DicomConstants.ts" />
/// <reference path="./../DicomReaders/ExplicitDicomReader.ts" />

class ExplicitSequenceReader 
{   
    ReadSequence(stream: ByteStream, element: DicomElement) 
    {
        if(stream === undefined)
        {
            throw "ExplicitSequenceReader.ReadSequence: missing required parameter 'stream'";
        }
        if(element === undefined)
        {
            throw "ExplicitSequenceReader.ReadSequence: missing required parameter 'element'";
        }

        element.items = [];

        if (element.length == 4294967295)  // xFFFFFFFF
        {
            this._readSqElementWithUndefinedLength(stream, element);
        }
        else 
        {
            this._readSqElementWithKnownLength(stream, element);
        }
    }

    private _readSqElementWithUndefinedLength(stream: ByteStream, element: DicomElement) 
    {
        while(stream.position < stream.byteArray.length)
        {
            var item = this._readSequenceItem(stream);

            element.items.push(item);

            if(item.tag === DicomConstants.Tags.EndOfSequence)
            {
                element.length = stream.position - element.offset;
                return;
            }
        }
    }

    private _readSqElementWithKnownLength(stream: ByteStream, element: DicomElement) 
    {

    }

    private _readSequenceItem(stream: ByteStream)
    {
        var item = new DicomElement();

        var tag: DicomTag = TagReader.ReadTag(stream);
        item.tag = tag.getCode();
        item.tagName = tag.findName();
        item.tagSearchCode = tag.getDicomLookupSearchCode();
        
        item.length = stream.readUint32();
        item.offset = stream.position;

        if(item.length === 4294967295)// xFFFFFFFF
        {
            item.isUndefinedLength = true;
            item.DataSet = this._readDicomDataSetUndefinedLength(stream);
            item.length = stream.position - item.offset;
        }
        else
        {
            //item.dataSet = new dicomParser.DataSet(byteStream.byteArrayParser, byteStream.byteArray, {});
            //dicomParser.parseDicomDataSetExplicit(item.dataSet, byteStream, byteStream.position + item.length);
        }

        return item;
    }

    private _readDicomDataSetUndefinedLength(stream: ByteStream, maxlength?: number) {
        var dicomParser = new ExplicitDicomReader();

        maxlength = maxlength || stream.byteArray.length;

        var dataSet = new DicomDataSet(stream.byteArray, stream.byteArrayParser, []);

        var limit = Math.min(stream.byteArray.length, maxlength);

        try {
            while (stream.position < limit) {
                var position: number = stream.position;

                var element: DicomElement = dicomParser.readElement(stream);

                dataSet.addElement(element);

                if(element.tag === DicomConstants.Tags.EndOfItems)
                {
                    return dataSet;
                }                
            }
        }
        catch(e) {
            console.debug("ExplicitSequenceReader:_readDicomDataSetUndefinedLength",stream.position, element);
            throw e;
        }        
    }
}