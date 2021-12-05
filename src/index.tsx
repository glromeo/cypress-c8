import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./index.scss";

function testCoverage(value: number) {
    if (value > 0) {
        console.log("this should be covered");
    } else {
        console.log("this should not be covered");
    }
}

testCoverage(1);

ReactDOM.render(<App/>, document.getElementById("root"));
