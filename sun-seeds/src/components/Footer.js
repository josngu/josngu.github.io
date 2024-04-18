"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function Footer() {
    const currentYear = new Date().getFullYear();
    return (<footer>
      Copyright &copy; {currentYear} Joseph Nguyen, Breanna Schuler, Katrin
      Manayev, Drewmore Moon. All rights reserved.
    </footer>);
}
exports.default = Footer;
