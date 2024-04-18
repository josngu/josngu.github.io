"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
function BlogSection({ title = '', text = '', imgURL = '', altText = '', imgURL2 = '', altText2 = '', }) {
    return (<section className='blog-section'>
      <h2>{title}</h2>
      {/*Conditionally renders the images if there is an image present*/}
      {(imgURL || imgURL2) && (<div>
          <div>
            <img src={imgURL} alt={altText}></img>
          </div>
          <div>
            <img src={imgURL2} alt={altText2}></img>
          </div>
        </div>)}
      <p>{text}</p>
    </section>);
}
exports.default = BlogSection;
