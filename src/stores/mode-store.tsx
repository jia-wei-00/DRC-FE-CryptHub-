import { observable, makeObservable, action } from "mobx";
import { makePersistable } from "mobx-persist-store";

class modeStoreImplementation {
  mode = "dark";

  constructor() {
    makeObservable(this, {
      mode: observable,
      setMode: action,
    });

    makePersistable(this, {
      name: "ModeStore",
      properties: ["mode"],
      storage: window.localStorage,
    });
  }

  setMode() {
    this.mode === "dark" ? (this.mode = "light") : (this.mode = "dark");
  }
}

const modeStore = new modeStoreImplementation();

export default modeStore;
