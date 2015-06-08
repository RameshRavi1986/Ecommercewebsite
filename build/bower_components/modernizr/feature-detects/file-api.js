/**
 * file tests for the File API specification
 *   Tests for objects specific to the File API W3C specification without
 *   being redundant (don't bother testing for Blob since it is assumed
 *   to be the File object's prototype.
 *
 *   Will fail in Safari 5 due to its lack of support for the standards
 *   defined FileReader object
 */
Modernizr.addTest('filereader', function () {
    return !!(window.File && window.FileList && window.FileReader);
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2ZpbGUtYXBpLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogZmlsZSB0ZXN0cyBmb3IgdGhlIEZpbGUgQVBJIHNwZWNpZmljYXRpb25cbiAqICAgVGVzdHMgZm9yIG9iamVjdHMgc3BlY2lmaWMgdG8gdGhlIEZpbGUgQVBJIFczQyBzcGVjaWZpY2F0aW9uIHdpdGhvdXRcbiAqICAgYmVpbmcgcmVkdW5kYW50IChkb24ndCBib3RoZXIgdGVzdGluZyBmb3IgQmxvYiBzaW5jZSBpdCBpcyBhc3N1bWVkXG4gKiAgIHRvIGJlIHRoZSBGaWxlIG9iamVjdCdzIHByb3RvdHlwZS5cbiAqXG4gKiAgIFdpbGwgZmFpbCBpbiBTYWZhcmkgNSBkdWUgdG8gaXRzIGxhY2sgb2Ygc3VwcG9ydCBmb3IgdGhlIHN0YW5kYXJkc1xuICogICBkZWZpbmVkIEZpbGVSZWFkZXIgb2JqZWN0XG4gKi9cbk1vZGVybml6ci5hZGRUZXN0KCdmaWxlcmVhZGVyJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhISh3aW5kb3cuRmlsZSAmJiB3aW5kb3cuRmlsZUxpc3QgJiYgd2luZG93LkZpbGVSZWFkZXIpO1xufSk7XG4iXSwiZmlsZSI6Im1vZGVybml6ci9mZWF0dXJlLWRldGVjdHMvZmlsZS1hcGkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==