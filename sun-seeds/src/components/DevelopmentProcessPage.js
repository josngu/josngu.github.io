"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const BlogSection_1 = __importDefault(require("../components/BlogSection"));
const FourImagesSection_1 = __importDefault(require("../components/FourImagesSection"));
const MockupComparison_1 = __importDefault(require("./MockupComparison"));
const box_sketch_1_webp_1 = __importDefault(require("../images/box-sketch-1.webp"));
const box_sketch_2_webp_1 = __importDefault(require("../images/box-sketch-2.webp"));
const first_dieline_webp_1 = __importDefault(require("../images/first-dieline.webp"));
const first_dieline_insert_webp_1 = __importDefault(require("../images/first-dieline-insert.webp"));
const second_dieline_webp_1 = __importDefault(require("../images/second-dieline.webp"));
const box_compartments_webp_1 = __importDefault(require("../images/box-compartments.webp"));
const sun_seeds_box_1_webp_1 = __importDefault(require("../images/sun-seeds-box-1.webp"));
const sun_seeds_box_2_webp_1 = __importDefault(require("../images/sun-seeds-box-2.webp"));
const sun_seeds_box_3_webp_1 = __importDefault(require("../images/sun-seeds-box-3.webp"));
const sun_seeds_box_4_webp_1 = __importDefault(require("../images/sun-seeds-box-4.webp"));
function DevelopmentProcessPage() {
    return (<>
      <h1>Development Process</h1>
      <p id='overview-text'>
        Traditional sunflower seed packaging is not suitable for snacking
        on-the-go due to its inability to provide a convenient method for
        disposing of the seed shells. We were tasked to design a biodegradable,
        sustainable packaging that would solve this problem.
      </p>
      <BlogSection_1.default title='Step 1: Ideate' text={`The first step in prototyping the packaging for sunflower seeds is to define the structural requirements of the new packaging design. While it may be tempting to prioritize aesthetic appeal, we wanted our packaging to be stackable and have structural stability. These requirements would ensure that the product is protected during shipping and that it will be stacked efficiently, which is crucial for transportation purposes.
        
        The design will need an area for disposing the seed shells. The first sketch (left) uses an insert to divide the the box in half, creating two compartments. The second sketch (right) is a refinement of the first design and features the same divider but with a single dieline.`} imgURL={box_sketch_1_webp_1.default} altText='A pencil sketch of a box with a divider than inserts into the box' imgURL2={box_sketch_2_webp_1.default} altText2={'A pencil sketch of a box with a divider already built into it'}/>
      <BlogSection_1.default title='Step 2: Create' text={`During this phase, we created two dielines that would fulfill our set requirements. One dieline was for the box, and the other is for the insert. The dielines were cut using an Esko Kongsberg V20 cutting table, and then assembled manually.`} imgURL={first_dieline_webp_1.default} altText='Dieline and art for a sunflower seed box that uses an insert to divide the inside into two compartments' imgURL2={first_dieline_insert_webp_1.default} altText2='An assembled dieline that shows what the box would look like structurally'/>
      <BlogSection_1.default title='Step 3: Analyze' text={`The first iteration of the packaging had several issues. The disposed shells would fall out of the box if the user tried to pour more sunflower seeds to eat, which defeats the whole purpose of our packaging. Additionally, the box was too thick to hold in the hand comfortably, and 50% of the packaging is empty, making it inefficient to ship. Addressing these issues would require a complete redesign of the dieline.`} imgURL='' altText='' imgURL2='' altText2=''/>
      <BlogSection_1.default title='Step 4: Refine' text={`With the second iteration, we decreased the width of our first design from 2" to 1.5", making it more comfortable to hold. The dual compartment design was also remade so that the two compartments could be created with one dieline, saving on materials. In addition, the new design has two tuck flaps at the top to prevent the seed disposal compartment from emptying itself whenever the user tried to pour the seeds into their palm. Although this refined design addresses most of the issues with our first prototype, one challenge that remains is the empty space, which we have identified two possible solutions:

        1. Provide a seasoning packet for the user to season their seeds to their liking. This would provide a purpose for the wasted space.
        
        2. Insert the sunflower seed box inside another box, in which the user would remove the extra box to use as a seed shell disposal area. This would increase shipping efficiency by almost 100% at the cost of increasing material usage.
        
        Both of these solutions would not require the existing dieline and artwork to be remade. With this in mind, we created some mockups below to visualize how our packaging would look on retail shelves.`} imgURL={second_dieline_webp_1.default} altText='Sunflower seed box dieline' imgURL2={box_compartments_webp_1.default} altText2='A sunflower seed box with both of its tuck flaps opened, revealing two compartments'/>
      <MockupComparison_1.default />
      <FourImagesSection_1.default title='2023 AmeriStar Competition: Final Design' text={``} imgURL={sun_seeds_box_1_webp_1.default} altText={`The front of Sun Seeds' sunflower seeds box`} imgURL2={sun_seeds_box_2_webp_1.default} altText2={`Sun Seeds' sunflower seeds box with one lid opened`} imgURL3={sun_seeds_box_3_webp_1.default} altText3={`The back of Sun Seeds' sunflower seeds box with the nutrition facts`} imgURL4={sun_seeds_box_4_webp_1.default} altText4={`The front of Sun Seeds' sunflower seeds box at an angle that shows three sides`}/>
      <BlogSection_1.default title='Conclusion' text={`Our vision for a plastic-free sunflower seed packaging is difficult to achieve. Although our packaging is biodegradable, this comes at a cost in food preservation. Certain coatings could increase the preservation capabilities of our packaging, but not all coatings are biodegradable. More research is needed to determine the ideal balance between sustainability and food preservation.
        `} imgURL='' altText='' imgURL2='' altText2=''/>
    </>);
}
exports.default = DevelopmentProcessPage;
