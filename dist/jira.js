"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var JiraApi = require('jira-client');
// Initialize
var jira = new JiraApi({
    protocol: 'https',
    host: 'slackira.atlassian.net',
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    apiVersion: '2',
    strictSSL: true
});
function addComment(issueId, comment) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("trying to add comment for issue " + issueId + " with comment " + comment);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, jira.addComment(issueId, comment)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_1 = _a.sent();
                    console.log('could not add comment with jira node');
                    console.log(e_1.message);
                    console.log(e_1.options);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addCommentsIdempotent(issueId, newComment) {
    return __awaiter(this, void 0, void 0, function () {
        var comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getIssueComments(issueId)];
                case 1:
                    comments = _a.sent();
                    if (!(comments.filter(function (issueComment) { return issueComment.body === newComment; }).length === 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, addComment(issueId, newComment)];
                case 2:
                    _a.sent();
                    console.log("added comment " + newComment + " to issue " + issueId);
                    return [3 /*break*/, 4];
                case 3:
                    console.log("comment " + newComment + " was already on issue " + issueId);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.addCommentsIdempotent = addCommentsIdempotent;
function getIssueComments(issueId) {
    return __awaiter(this, void 0, void 0, function () {
        var issue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findIssue(issueId)];
                case 1:
                    issue = _a.sent();
                    return [2 /*return*/, issue.fields.comment.comments];
            }
        });
    });
}
function findIssue(issueId) {
    return __awaiter(this, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("trying to find issue " + issueId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, jira.findIssue(issueId)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    e_2 = _a.sent();
                    console.log('could not add comment with jira node');
                    console.log(e_2.message);
                    console.log(e_2.options);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=jira.js.map