const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    ignorePatterns: [
        'chart.js',
        'map.js',
        'eventchart.js',
        'eventreport.js',
        'reporttable.js',
    ],
}
