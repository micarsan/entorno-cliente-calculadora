module.exports = {
    globDirectory: '.',
    globPatterns: [
        '**/*.{png,html,json,js}'
    ],
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ],
    swDest: 'sw.js'
};