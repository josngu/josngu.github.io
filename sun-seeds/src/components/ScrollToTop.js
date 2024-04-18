"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This component was made by Matthew Hoelter (www.matthewhoelter.com)
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function ScrollToTop() {
    const { pathname } = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(() => {
        // "document.documentElement.scrollTo" is the magic for React Router Dom v6
        document.documentElement.scrollTo({
            top: 0,
            left: 0,
        });
    }, [pathname]);
    return null;
}
exports.default = ScrollToTop;
