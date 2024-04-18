"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const logo_svg_1 = __importDefault(require("../logo.svg"));
const menu_icon_svg_1 = __importDefault(require("../images/menu-icon.svg"));
const close_icon_svg_1 = __importDefault(require("../images/close-icon.svg"));
const NavigationMenuMobile_1 = __importDefault(require("./NavigationMenuMobile"));
function NavigationBar() {
    const location = (0, react_router_dom_1.useLocation)();
    // Set the state of the mobile nav menu
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [navMenuClass, setNavMenuClass] = (0, react_1.useState)('');
    function toggleMenu() {
        setIsOpen(!isOpen);
        if (isOpen === true) {
            setNavMenuClass('nav-menu-slide-out');
        }
        else {
            setNavMenuClass('nav-menu-slide-in');
        }
    }
    return (<header>
      <nav id='navigation-menu'>
        <react_router_dom_1.Link to='/'>
          <img src={logo_svg_1.default} id='logo' alt='Sun Seeds Logo'/>
        </react_router_dom_1.Link>
        <ul>
          <li>
            {/*If the current path is equal to the set path, change the class*/}
            <react_router_dom_1.Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to='/' tabIndex={0}>
              Home
            </react_router_dom_1.Link>
          </li>
          <li>
            <react_router_dom_1.Link className={location.pathname === '/development-process'
            ? 'nav-link active'
            : 'nav-link'} to='/development-process' tabIndex={0}>
              Development Process
            </react_router_dom_1.Link>
          </li>
          <li>
            <react_router_dom_1.Link className={location.pathname === '/3d-model'
            ? 'nav-link active'
            : 'nav-link'} to='/3d-model' tabIndex={0}>
              View 3D Model
            </react_router_dom_1.Link>
          </li>
        </ul>
        <div id='menu'>
          <button id='menu-button' onClick={() => toggleMenu()} aria-label='Menu'>
            <img src={isOpen === true ? close_icon_svg_1.default : menu_icon_svg_1.default} alt='Menu button'/>
          </button>
        </div>
      </nav>
      <NavigationMenuMobile_1.default isOpen={isOpen} setIsOpen={setIsOpen} navMenuClass={navMenuClass} toggleMenu={toggleMenu}/>
    </header>);
}
exports.default = NavigationBar;
