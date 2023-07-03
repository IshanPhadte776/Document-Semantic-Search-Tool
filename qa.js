"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.createEmbeddings = void 0;
//This import brings in the OpenAI class from the langchain/llms/openai module. It is used for interacting with the OpenAI API.
var openai_1 = require("langchain/llms/openai");
//These imports bring in the RetrievalQAChain and ConversationalRetrievalQAChain classes from the langchain/chains module. They are used for building retrieval-based question answering chains.
var chains_1 = require("langchain/chains");
//This import brings in the RecursiveCharacterTextSplitter class from the langchain/text_splitter module. It is used for splitting text into smaller chunks or documents.
var text_splitter_1 = require("langchain/text_splitter");
//This import brings in the entire fs module, which is a built-in Node.js module used for file system operations such as reading files.
var fs = require("fs");
//This import brings in the entire dotenv module, which is used for loading environment variables from a .env file into process.env.
var dotenv = require("dotenv");
//This import brings in the FaissStore class from the langchain/vectorstores/faiss module. It is used for creating and managing vector stores using the Faiss library.
var faiss_1 = require("langchain/vectorstores/faiss");
//This import brings in the OpenAIEmbeddings class from the langchain/embeddings/openai module. It is used for generating embeddings using the OpenAI language model.
var openai_2 = require("langchain/embeddings/openai");
//dotenv.config() loads environment variables from a .env file located in the same directory as the script.
dotenv.config();
var openaiKey = process.env.OPENAI_API_KEY;
// Create embeddings
var createEmbeddings = function () { return __awaiter(void 0, void 0, void 0, function () {
    var model, text, textSplitter, docs, vectorStore, chain, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                model = new openai_1.OpenAI({ openAIApiKey: openaiKey });
                text = fs.readFileSync("GAN.pdf", "utf-8");
                textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                    chunkSize: 1000,
                    chunkOverlap: 250,
                });
                return [4 /*yield*/, textSplitter.createDocuments([text])];
            case 1:
                docs = _a.sent();
                return [4 /*yield*/, faiss_1.FaissStore.fromDocuments(docs, new openai_2.OpenAIEmbeddings())];
            case 2:
                vectorStore = _a.sent();
                chain = chains_1.RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
                return [4 /*yield*/, chain.call({
                        query: "What is a variational autoencoder?",
                    })];
            case 3:
                response = _a.sent();
                console.log({ response: response });
                return [2 /*return*/];
        }
    });
}); };
exports.createEmbeddings = createEmbeddings;
(0, exports.createEmbeddings)();
