/*
 * stan.js
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
    var TextMode = require("./text").Mode;
    var StanHighlightRules = require("./stan_highlight_rules").StanHighlightRules;
    var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
    var CStyleFoldMode = require("./folding/cstyle").FoldMode;

    var Mode = function() {
	this.$outdent = new MatchingBraceOutdent();	
	this.HighlightRules = StanHighlightRules;
	this.foldingRules = new CStyleFoldMode();
    };
    oop.inherits(Mode, TextMode);
    
    (function() {

	this.toggleCommentLines = function(state, doc, startRow, endRow) {
            var outdent = true;
            var re = /^(\s*)\/\//;

            for (var i=startRow; i<= endRow; i++) {
		if (!re.test(doc.getLine(i))) {
                    outdent = false;
                    break;
		}
            }

            if (outdent) {
		var deleteRange = new Range(0, 0, 0, 0);
		for (var i=startRow; i<= endRow; i++)
		{
                    var line = doc.getLine(i);
                    var m = line.match(re);
                    deleteRange.start.row = i;
                    deleteRange.end.row = i;
                    deleteRange.end.column = m[0].length;
                    doc.replace(deleteRange, m[1]);
		}
            }
            else {
		doc.indentRows(startRow, endRow, "//");
            }
	};

	this.getNextLineIndent = function(state, line, tab, tabSize, row) {
            var indent = this.$getIndent(line);

            var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;

            if (tokens.length && tokens[tokens.length-1].type == "comment") {
		return indent;
            }

            if (state == "start") {
		var match = line.match(/^.*[\{\(\[]\s*$/);
		if (match) {
                    indent += tab;
		}
            }

            return indent;
	};

	this.checkOutdent = function(state, line, input) {
            return this.$outdent.checkOutdent(line, input);
	};

	this.autoOutdent = function(state, doc, row) {
            return this.$outdent.autoOutdent(doc, row);
	};

	this.lineCommentStart = "//";
	this.blockComment = {start: "/*", end: "*/"};
	this.$id = "ace/mode/stan";
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
});
