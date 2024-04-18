"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const box_orthographic_lines_svg_1 = __importDefault(require("../images/box-orthographic-lines.svg"));
const box_orthographic_front_svg_1 = __importDefault(require("../images/box-orthographic-front.svg"));
const box_orthographic_left_lid_svg_1 = __importDefault(require("../images/box-orthographic-left-lid.svg"));
const box_orthographic_right_lid_svg_1 = __importDefault(require("../images/box-orthographic-right-lid.svg"));
const box_orthographic_side_svg_1 = __importDefault(require("../images/box-orthographic-side.svg"));
const Button_1 = __importDefault(require("./Button"));
function HomeHero() {
    return (<div className='container-bg'>
      <div>
        <h1 id='title-home'>SUN SEEDS</h1>
        <p id='subtitle-home'>Sunflower Seeds Packaging Mockup</p>
        <p id='sales-pitch'>
          Craving a healthy, crunchy snack but don't want to deal with the mess?
          Look no further! Sun Seeds' sunflower seeds are seasoned to your
          liking with a new packaging design that upholds the value of
          convenience for on-the-go customers.
        </p>
        <Button_1.default url='#/3d-model' text='View 3D model'/>
      </div>
      <div id='hero-images'>
        <img src={box_orthographic_lines_svg_1.default} alt='Sunflower seeds packaging mockup frame'/>
        <img src={box_orthographic_front_svg_1.default} alt='Sunflower seeds packaging mockup graphics'/>
        <img src={box_orthographic_left_lid_svg_1.default} alt=''/>
        <img src={box_orthographic_right_lid_svg_1.default} alt=''/>
        <img src={box_orthographic_side_svg_1.default} alt=''/>
      </div>
    </div>);
}
exports.default = HomeHero;
