/*!
 * answers 1.0 (https://github.com/xc0d3rz/npm-answers)
 * Copyright 2016-2017 xc0d3rz(x.c0d3rz000@gmail.com)
 * Licensed under the MIT license
 */
(function () {
    var request = require('request'),
        cheerio = require('cheerio'),
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
                _this.parser(a, b, c, cb);
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
     * @param o
     * @param cb
     */
    answers.prototype.document = function (o, cb) {
        var rp = require('request-promise'),
            selectors = ['.answer_text', '.confidence_num'],
            _this = answers.prototype;
        if (o.is_answered) {
            rp({
                uri: o.link,
                transform: function (body) {
                    var $ = cheerio.load(body);
                    deepExtend(o, {answer: $(selectors[0]).text().trim(), votes: $(selectors[1]).text().trim()});
                    return o;
                }
            })
                .then(function (r) {
                    cb(r);
                })
                .catch(function (err) {
                    _this.error(err);
                })
        }
    };

    answers.prototype.result = [];

    /**
     *
     * @param err
     * @param res
     * @param body
     * @param cb
     */
    answers.prototype.parser = function (err, res, body, cb) {
        var
            arr = [],
            ire = 0;
        if (err) this.error(err);
        for (var r in body) {
            this.document(body[r], function (res) {
                arr.push(res);
                ire++;
                if (ire == body.length) {
                    cb(arr);
                }
            });


        }

    };

    module.exports = answers;
}.call(module.exports));
