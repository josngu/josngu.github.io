"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const box_top_down_webp_1 = __importDefault(require("../images/box-top-down.webp"));
function BenefitsSection() {
    return (<section>
      <div className='rl-two-columns'>
        <div className='benefits-container'>
          <div className='benefit-point'>
            <h2>Convenient Shell Disposal</h2>
            <p>
              Our dual compartment design allows for the clean disposal of
              sunflower seed shells.
            </p>
          </div>
          <div className='benefit-point'>
            <h2>Compostable Packaging</h2>
            <p>
              With the artwork printed with water-based inks and our packaging
              being made without plastics, our paperboard box alternative
              ensures that you can snack guilt-free!
            </p>
          </div>
          <div className='benefit-point'>
            <h2>Accessible Design</h2>
            <p>
              Our design features familiar tuck-end tabs, without making the
              shell disposal process unnecessarily complex.
            </p>
          </div>
        </div>
        <div className='benefits-image-container'>
          <img src={box_top_down_webp_1.default} alt='A top down rotated view of a sunflower seeds box with two compartments'/>
        </div>
      </div>
    </section>);
}
exports.default = BenefitsSection;
