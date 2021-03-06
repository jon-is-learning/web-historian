var path = require('path');
var Promise = require('bluebird');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var helpers = require('./http-helpers');
var url = require('url');
var fs = require('fs');

// Build parameters to feed helpers.serveAssets
exports.handleRequest = function (req, res) {
  // Parse url
  var urlPath = path.parse(req.url);
  // Direct path to appropriate key in paths object
  // If path is empty then we respond with index.html
  if (req.method === 'GET') {
    if (urlPath.dir === '/' && urlPath.base === '') {
      urlPath = archive.paths.index;
      res.writeHead(200, {'Content-Type': 'text/html'});
      helpers.serveAssets(res, urlPath);
    } else if (urlPath.ext === '.css') {
      urlPath = archive.paths.styles;
      res.writeHead(200, {'Content-Type': 'text/css'});
      helpers.serveAssetsAsync(res, urlPath);
    } else if (archive.paths[urlPath.base] === undefined) {
      archive.isUrlArchived(urlPath.base, function(exists) { // PROMISIFY
        if (exists) {
          urlPath = archive.paths.archivedSites + '/' + urlPath.base;
          helpers.serveAssets(res, urlPath);
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    }
  }

  if (req.method === 'POST') {
    res.writeHead(201);
    req.on('data', function(chunk) {
      var newUrl = chunk.toString().substring(4);
      archive.isUrlInList(newUrl, function(exists) { // PROMISIFY
        if (!exists) {
          archive.addUrlToList(newUrl, function() { // PROMISIFY
            helpers.serveAssets(res, archive.paths.loading);
          });
        } else {
          urlPath = archive.paths.archivedSites + '/' + newUrl;
          res.writeHead(302);
          helpers.serveAssets(res, urlPath);
        }
      });
    });
  }

};

exports.handleRequestAsync = function (req, res) {
  // Parse url
  var urlPath = path.parse(req.url);
  // Direct path to appropriate key in paths object
  // If path is empty then we respond with index.html
  if (req.method === 'GET') {
    if (urlPath.dir === '/' && urlPath.base === '') {
      urlPath = archive.paths.index;
      res.writeHead(200, {'Content-Type': 'text/html'});
      helpers.serveAssets(res, urlPath);
    } else if (urlPath.ext === '.css') {
      urlPath = archive.paths.styles;
      res.writeHead(200, {'Content-Type': 'text/css'});
      helpers.serveAssets(res, urlPath);
    } else if (archive.paths[urlPath.base] === undefined) {
      archive.isUrlArchived(urlPath.base, function(exists) { // PROMISIFY
        if (exists) {
          urlPath = archive.paths.archivedSites + '/' + urlPath.base;
          helpers.serveAssets(res, urlPath);
        } else {
          res.writeHead(404);
          res.end();
        }
      });
    }
  }

  if (req.method === 'POST') {
    res.writeHead(201);
    req.on('data', function(chunk) {
      var newUrl = chunk.toString().substring(4);
      archive.isUrlInList(newUrl, function(exists) { // PROMISIFY
        if (!exists) {
          archive.addUrlToList(newUrl, function() { // PROMISIFY
            helpers.serveAssets(res, archive.paths.loading);
          });
        } else {
          urlPath = archive.paths.archivedSites + '/' + newUrl;
          res.writeHead(302);
          helpers.serveAssets(res, urlPath);
        }
      });
    });
  }

};