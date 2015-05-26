// Just for tags recogniction, not for prodaction
class DicomTagsReference {
    static dicomTags: any = {
        "x00020000": "FileMetaInfoGroupLength",
        "x00020001": "FileMetaInfoVersion",
        "x00020002": "MediaStorageSOPClassUID",
        "x00020003": "MediaStorageSOPInstanceUID",
        "x00020010": "TransferSyntaxUID",
        "x00020012": "ImplementationClassUID",
        "x00020013": "ImplementationVersionName",
        "x00020016": "SourceApplicationEntityTitle"        
    };

    public static GetTagName(tagCode: string) {
        var tagName = this.dicomTags[tagCode];

        if (tagName == undefined) {
            return "unknown";
        }

        return tagName;
    }
}