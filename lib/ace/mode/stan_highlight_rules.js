/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (C) 2014, Jeffrey B. Arnold
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
    "use strict"; 

    var oop = require("../lib/oop");
    var lang = require("../lib/lang");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var StanHighlightRules = function() {

	var variableName = "[a-zA-Z$][a-zA-Z0-9_$]*\\b"

    	var keywords = lang.arrayToMap(
	    ("for|in|while|repeat|until|if|then|else|return"
	     + "|" + "lower|upper" // include range bounds as keywords
	    ).split("|")
	);

	// technically keywords, differentiate from regular functions
	var keywordFunctions = lang.arrayToMap(
	    ("print|increment_log_prob").split("|")
	);

    	var storageType = lang.arrayToMap(
	    ("int|real|vector|simplex|unit_vector|ordered"
    	     + "|" + "positive_ordered|row_vector"
    	     + "|" + "matrix|cholesky_factor_cov|cholesky_factor_corr"
	     + "|" + "corr_matrix|cov_matrix"
	     + "|" + "void"
	    ).split("|")
	);

    	var variableLanguage = lang.arrayToMap(
	    ("lp__").split("|")
	);

    	// // regexp must not have capturing parentheses. Use (?:) instead.
    	// // regexps are ordered -> the first match is used
    	this.$rules = {
            "start" : [
    		{
                    token : "comment",
                    regex : "\\/\\/.*$"
    		}, {
                    token : "comment",
                    regex : "#.*$"
    		}, {
                    token : "comment", // multi line comment
		    merge : true,
                    regex : "\\/\\*",
                    next : "comment"
    		}, {
                    token : "keyword.blockid",
                    regex : "functions|data|transformed\\s+data|parameters|" +
			     "transformed\\s+parameters|model|generated\\s+quantities"
    		}, {
                    token : "string", // single line
                    regex : '["][^"]*["]'
    		}, {
                    token : "constant.numeric",
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
    		}, {
                    token : "keyword.operator", // truncation
                    regex : "\\bT(?=\\s*\\[)"
		}, {
		    // highlights everything that looks like a function
		    token : function(value) {
			if (keywordFunctions.hasOwnProperty(value)) {
			    return "keyword"
			} else {
			    return "support.function"
			}
		    },
		    regex : variableName + "(?=\\s*\\()"
    		}, {
		    token : function(value) {
			if (keywords.hasOwnProperty(value)) {
			    return "keyword"
			}
			else if (storageType.hasOwnProperty(value)) {
			    return "storage.type"
			}
			else if (variableLanguage.hasOwnProperty(value)) {
			    return "variable.language"
			}
			else {
			    return "text"
			}
		    },
                    regex : variableName + "\\b"
    		}, {
                    token : "keyword.operator",
                    regex : "<-|~"
    		}, {
                    token : "keyword.operator",
                    regex : "\\|\\||&&|==|!=|<=?|>=?|\\+|-|\\.?\\*|\\.?/|\\\\|\\^|!|'"
    		}, {
    		    token : "punctuation.operator",
    		    regex : ":|,|;|="
    		}, {
                    token : "paren.lparen",
                    regex : "[\\[\\(\\{]"
    		}, {
                    token : "paren.rparen",
                    regex : "[\\]\\)\\}]"
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
                    merge : true,
                    regex : ".+"
		}
            ]
    	};
        this.normalizeRules();
    };

    oop.inherits(StanHighlightRules, TextHighlightRules);

    exports.StanHighlightRules = StanHighlightRules;
});
