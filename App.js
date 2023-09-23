import { Fragment, useEffect, useState } from "react";
import KFSDK from "@kissflow/lowcode-client-sdk";

import  MyTable  from "./table.jsx";

import "./App.css";


 function App() {
  const [kf, setKf] = useState();

  useEffect(() => {
    setTimeout(() => {
      loadKfSdk();
    }, 300);
  }, []);

  async function loadKfSdk() {
    let kf = await KFSDK.initialize();
    window.kf = kf;
    setKf(kf);
  
  }

  return <Fragment>{ kf&& <MyTable />}</Fragment>;

}
export default App;
