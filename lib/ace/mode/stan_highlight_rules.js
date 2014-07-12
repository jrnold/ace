/*
 * stan_highlight_rules.js
 *
 * Copyright (C) 2014 by Jeffrey B. Arnold
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;    

    var StanHighlightRules = function() {
	
	var keywords = (
            "for|in|while|repeat|until|if|then|else|true|false|return|void"
	);
	
	var storageType = (
            "int|real|vector|simplex|unit_vector|ordered|positive_ordered|row_vector|" +
		"matrix|cholesky_factor_cov|corr_matrix|cov_matrix"
	);
	
	var builtinConstants = (
            "lp__"
	);
	
	var keywordMapper = this.$keywords = this.createKeywordMapper({
            "keyword" : keywords,
            "keyword.storagetype" : storageType,
            "variable.language": builtinConstants
	}, "identifier");
	
	// regexp must not have capturing parentheses. Use (?:) instead.
	// regexps are ordered -> the first match is used
	this.$rules = {
            "start" : [
		{
                    token : "comment",
                    regex : "(:?\\/\\/|#).*$"
		}, {
                    token : "comment", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
		}, {
                    token : "keyword.blockid",
                    regex : "(?:(?:transformed\\s+)?(?:data|parameters)|functions|model|generated\\s+quantities)(?=\\s*{)"
		}, {
                    token : "string", // single line
                    regex : '["][^"]*["]'
		}, {
                    token : "string", // multi line string start
                    regex : '["].*\\\\$',
                    next : "qqstring"
		}, {
                    token : "constant.numeric",
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
		}, {
                    token : "keyword.operator", // truncation
                    regex : "\\bT(?=\\s*\\[)"
		}, {
                    token : keywordMapper,
                    regex : "[a-zA-Z][a-zA-Z0-9_]*\\b"
		}, {
                    token : "keyword.operator",
                    regex : "<-|~"
		}, {
                    token : "keyword.operator",
                    regex : "\\|\\||&&|==|!=|<=?|>=?|\\+|-|\\.?\\*|\\.?/|\\\\|^|!|'"
		}, {
		    token : "punctuation.operator",
		    regex : "\\:|\\,|\\;|="
		}, {
                    token : "paren.lparen",
                    regex : "[[({]"
		}, {
                    token : "paren.rparen",
                    regex : "[\\])}]"
		}, {
                    token : "text",
                    regex : "\\s+"
		}
            ],
            "comment" : [
		{
                    token : "comment", // closing comment
                    regex : ".*?\\*\\/",
                    next : "start"
		}, {
                    token : "comment", // comment spanning whole line
                    regex : ".+"
		}
            ],
	};
	this.normalizeRules();
    };
    
    oop.inherits(StanHighlightRules, TextHighlightRules);
    
    exports.StanHighlightRules = StanHighlightRules;
});
    
