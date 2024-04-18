"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function Button({ url, text }) {
    return (<a className='button' href={url} tabIndex={0}>
      {text}
    </a>);
}
exports.default = Button;
