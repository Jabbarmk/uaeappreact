"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrl = getImageUrl;
const UPLOAD_URL = '/assets/uploads';
const PLACEHOLDER = '/assets/images/placeholder.jpg';
function getImageUrl(filename, folder) {
    if (!filename)
        return PLACEHOLDER;
    if (filename.startsWith('http'))
        return filename;
    return `${UPLOAD_URL}/${folder}/${filename}`;
}
