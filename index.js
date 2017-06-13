/*!
 * answers 1.0 (https://github.com/xc0d3rz/npm-answers)
 * Copyright 2016-2017 xc0d3rz(x.c0d3rz000@gmail.com)
 * Licensed under the MIT license
 */
(function () {
    var request = require('request'),
        cheerio = require('cheerio'),
        async = require('async'),
        deepExtend = require('deep-extend');

    var answers = function () {
        this.fetch.apply(this, arguments);
    };

    /**
     *
     * @type {string}
     */
    answers.prototype.url = 'http://www.answers.com/solo/header/redcarpet/fayt';

    /**
     *
     * @param qs
     * @param cb
     */
    answers.prototype.fetch = function (qs, cb) {
        var _this = this;
        qs = (typeof qs != 'object' ? qs = {} : (!'limit' in qs) ? qs.limit = 6 : qs);
        if ('q' in qs) {
            request({url: this.url, qs: {search_string: qs.q, limit: qs.limit}, json: true}, function (a, b, c) {
                _this.parser.apply(_this, [a, b, c, cb]);
            });
        }
    };

    /**
     *
     * @param er
     */
    answers.prototype.error = function (er) {
        throw er;
    };

    /**
     *
     * @param url
     * @param cb
     */
    answers.prototype.document = function (url, cb) {
        var selectors = ['.answer_text', '.confidence_num'],
            _this = this;
        request({url: url}, function (err, res, body) {
            if (err) _this.error(err);
            var $ = cheerio.load(body);
            cb && cb({answer: $(selectors[0]).text(), votes: $(selectors[1]).text()});
        });
    };

    /**
     *
     * @param err
     * @param res
     * @param body
     * @param cb
     */
    answers.prototype.parser = function (err, res, body, cb) {
        var arr = [];
        if (err) this.error(err);
        async.map(body, function (r, c) {
            if (r.is_answered) {
                answers.prototype.document(r.link, function (rr) {
                    deepExtend(r, rr);
                    arr.push(r);
                    c(arr);
                });
            }
        }, cb);
    };

    module.exports = answers;
}.call(module.exports));