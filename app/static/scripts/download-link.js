(function () {
    'use strict';

    function downloadLink(os, ext = ".tar.gz") {
        var properties = window.OPENSHIFT_EXTENSION_PROPERTIES,
            url = properties.ocUrl,
            major = properties.ocMajorVersion,
            minor = properties.ocMinorVersion;
        return url + "/" + major + "/oc-" + major + "." + minor + "-" + os + ext;
    }

    window.OPENSHIFT_CONSTANTS.CLI = {
        "Linux": downloadLink("linux"),
        "Mac OS X": downloadLink("macosx"),
        "Windows": downloadLink("windows", ".zip"),
    };

}());