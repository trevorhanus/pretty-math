/**
 * This file was copied from fbjs on 3.2.2020 and
 * converted to TypeScript
 */

import UAParser from 'ua-parser-js';

const UNKNOWN = 'Unknown';

const PLATFORM_MAP = {
    'Mac OS': 'Mac OS X',
};

/**
 * Convert from UAParser platform name to what we expect.
 */
function convertPlatformName(name: string): string {
    return PLATFORM_MAP[name] || name;
}

/**
 * Get the version number in parts. This is very naive. We actually get major
 * version as a part of UAParser already, which is generally good enough, but
 * let's get the minor just in case.
 */
function getBrowserVersion(version: string): { major: string, minor: string } {
    if (!version) {
        return {
            major: '',
            minor: '',
        };
    }
    var parts = version.split('.');
    return {
        major: parts[0],
        minor: parts[1],
    };
}

/**
 * Get the UA data fom UAParser and then convert it to the format we're
 * expecting for our APIS.
 */
const parser = new UAParser();
const results = parser.getResult();

// Do some conversion first.
const browserVersionData = getBrowserVersion(results.browser.version);

const uaData = {
    browserArchitecture: results.cpu.architecture || UNKNOWN,
    browserFullVersion: results.browser.version || UNKNOWN,
    browserMinorVersion: browserVersionData.minor || UNKNOWN,
    browserName: results.browser.name || UNKNOWN,
    browserVersion: results.browser.major || UNKNOWN,
    deviceName: results.device.model || UNKNOWN,
    engineName: results.engine.name || UNKNOWN,
    engineVersion: results.engine.version || UNKNOWN,
    platformArchitecture: results.cpu.architecture || UNKNOWN,
    platformName: convertPlatformName(results.os.name) || UNKNOWN,
    platformVersion: results.os.version || UNKNOWN,
    platformFullVersion: results.os.version || UNKNOWN,
};

export {
    uaData
}
