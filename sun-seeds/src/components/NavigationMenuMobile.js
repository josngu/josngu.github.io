"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
function NavigationMenuMobile({ isOpen, setIsOpen, navMenuClass, toggleMenu, }) {
    const location = (0, react_router_dom_1.useLocation)();
    return (<nav id='navigation-menu-mobile' className={navMenuClass}>
      <ul>
        <li>
          {/*If the current path is equal to the set path, change the class*/}
          <react_router_dom_1.Link className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} to='/' onClick={() => toggleMenu()} tabIndex={0}>
            Home
          </react_router_dom_1.Link>
        </li>
        <li>
          <react_router_dom_1.Link className={location.pathname === '/development-process'
            ? 'nav-link active'
            : 'nav-link'} to='/development-process' onClick={() => toggleMenu()} tabIndex={0}>
            Development Process
          </react_router_dom_1.Link>
        </li>
        <li>
          <react_router_dom_1.Link className={location.pathname === '/3d-model' ? 'nav-link active' : 'nav-link'} to='/3d-model' onClick={() => toggleMenu()} tabIndex={0}>
            View 3D Model
          </react_router_dom_1.Link>
        </li>
      </ul>
    </nav>);
}
exports.default = NavigationMenuMobile;
