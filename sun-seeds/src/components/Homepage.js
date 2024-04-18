"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const HomeHero_1 = __importDefault(require("../components/HomeHero"));
const BenefitsSection_1 = __importDefault(require("../components/BenefitsSection"));
const Button_1 = __importDefault(require("../components/Button"));
function Homepage() {
    return (<>
      <HomeHero_1.default />
      <BenefitsSection_1.default />
      <section className='cta-section'>
        <h2>See our development process!</h2>
        <Button_1.default url='#/development-process' text='Learn more'/>
      </section>
    </>);
}
exports.default = Homepage;
