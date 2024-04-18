"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
require("./App.css");
const NavigationBar_1 = __importDefault(require("./components/NavigationBar"));
const Footer_1 = __importDefault(require("./components/Footer"));
const FooterEmbellishment_1 = __importDefault(require("./components/FooterEmbellishment"));
const Homepage_1 = __importDefault(require("./components/Homepage"));
const DevelopmentProcessPage_1 = __importDefault(require("./components/DevelopmentProcessPage"));
const ModelViewerPage_1 = __importDefault(require("./components/ModelViewerPage"));
const NotFoundPage_1 = __importDefault(require("./components/NotFoundPage"));
const ScrollToTop_1 = __importDefault(require("./components/ScrollToTop"));
function App() {
    return (<>
      <ScrollToTop_1.default />
      <NavigationBar_1.default />
      <main>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path='/' element={<Homepage_1.default />}/>
          <react_router_dom_1.Route path='/development-process' element={<DevelopmentProcessPage_1.default />}/>
          <react_router_dom_1.Route path='/3d-model' element={<ModelViewerPage_1.default />}/>
          <react_router_dom_1.Route path='*' element={<NotFoundPage_1.default />}/>
        </react_router_dom_1.Routes>
      </main>
      {(0, react_router_dom_1.useLocation)().pathname !== '/3d-model' && <FooterEmbellishment_1.default />}
      <Footer_1.default />
    </>);
}
exports.default = App;
