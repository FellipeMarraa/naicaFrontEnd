import {DateType, JacksonType, JsonIdentityInfo} from '@sonner/jackson-service-v2';

@JacksonType('CustomFileSystemItem')
@JsonIdentityInfo()
export class CustomFileSystemItem {
    path?: string;
    pathKeys?: string[];
    key?: string;
    name?: string;
    @DateType()
    dateModified?: Date;
    size?: number;
    isDirectory?: boolean;
    hasSubDirectories?: boolean;
    thumbnail?: string;
    mimeType?: string;
}
