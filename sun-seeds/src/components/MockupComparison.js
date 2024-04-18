"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const box_front_retail_before_webp_1 = __importDefault(require("../images/box-front-retail-before.webp"));
const box_front_retail_after_webp_1 = __importDefault(require("../images/box-front-retail-after.webp"));
const box_back_retail_before_webp_1 = __importDefault(require("../images/box-back-retail-before.webp"));
const box_back_retail_after_webp_1 = __importDefault(require("../images/box-back-retail-after.webp"));
require("two-up-element/dist/two-up");
function MockupComparison() {
    return (<div className='mockup-two-columns'>
      <two-up>
        <div>
          <img src={box_front_retail_before_webp_1.default} alt='A white box with two compartments'/>
        </div>
        <div>
          <img src={box_front_retail_after_webp_1.default} alt='A sunflower seeds box with two compartments'/>
        </div>
      </two-up>
      <two-up>
        <div>
          <img src={box_back_retail_before_webp_1.default} alt='A white box with two compartments'/>
        </div>
        <div>
          <img src={box_back_retail_after_webp_1.default} alt='A sunflower seeds box with two compartments'/>
        </div>
      </two-up>
    </div>);
}
exports.default = MockupComparison;
