// Blob constructor
// http://dev.w3.org/2006/webapi/FileAPI/#constructorBlob

Modernizr.addTest('blobconstructor', function () {
    try {
        return !!new Blob();
    } catch (e) {
        return false;
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2Rlcm5penIvZmVhdHVyZS1kZXRlY3RzL2Jsb2ItY29uc3RydWN0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQmxvYiBjb25zdHJ1Y3RvclxuLy8gaHR0cDovL2Rldi53My5vcmcvMjAwNi93ZWJhcGkvRmlsZUFQSS8jY29uc3RydWN0b3JCbG9iXG5cbk1vZGVybml6ci5hZGRUZXN0KCdibG9iY29uc3RydWN0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICEhbmV3IEJsb2IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59KTtcbiJdLCJmaWxlIjoibW9kZXJuaXpyL2ZlYXR1cmUtZGV0ZWN0cy9ibG9iLWNvbnN0cnVjdG9yLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=