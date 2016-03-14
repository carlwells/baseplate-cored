'use strict';

var path = require('path');
var express = require('express');
var find = require('lodash/find');
var assign = require('lodash/assign');

var commonVariables = require('../lib/commonVariables');
var collections = require('../lib/collections');
var helpers = require('../helpers');

module.exports = function (sectionConfig, items, partials, data, clientDir) {
    var router = new express.Router({
        mergeParams: true
    });

    function getItems(req) {
        return collections.pages(items, {
            partials: partials,
            helpers: helpers,
            data: assign(data, {
                link: commonVariables.link(req),
                absoluteLink: commonVariables.absoluteLink(req)
            })
        });
    }

    router.get('/', function (req, res) {
        res.render(path.resolve(clientDir, 'list'), {
            basePath: sectionConfig.path,
            items: getItems(req)
        });
    });

    router.get('/:id?', function (req, res) {
        let results = getItems(req);
        let result = find(results, x => x.id === req.params.id);
        if (result) {
            res.render(path.resolve(clientDir, 'standalone'), result);
        } else {
            res.sendStatus(404);
        }
    });

    return router;
};