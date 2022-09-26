const subgraphs = require('./subgraphs');
const supergraphHandler = require('./supergraph');
const functions = require('./functions');

module.exports = { ...supergraphHandler, ...subgraphs, ...functions };