"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const footer_embellishment_center_svg_1 = __importDefault(require("../images/footer-embellishment-center.svg"));
const footer_embellishment_end_svg_1 = __importDefault(require("../images/footer-embellishment-end.svg"));
const footer_embellishment_line_svg_1 = __importDefault(require("../images/footer-embellishment-line.svg"));
function FooterEmbellishment() {
    return (<div id='footer-embellishment-container'>
      <div>
        <img src={footer_embellishment_end_svg_1.default} alt=''/>
      </div>
      <div>
        <img src={footer_embellishment_line_svg_1.default} alt=''/>
      </div>
      <div>
        <img src={footer_embellishment_center_svg_1.default} alt=''/>
      </div>
      <div>
        <img src={footer_embellishment_line_svg_1.default} alt=''/>
      </div>
      <div>
        <img src={footer_embellishment_end_svg_1.default} alt=''/>
      </div>
    </div>);
}
exports.default = FooterEmbellishment;
