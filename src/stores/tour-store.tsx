import { action, makeObservable, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";

class TourStoreImplementation {
  tour: { home: boolean; p2p: boolean; sell_p2p: boolean } = {
    home: false,
    p2p: false,
    sell_p2p: false,
  };
  tour_modal: boolean = true;

  constructor() {
    makeObservable(this, {
      tour: observable,
      tour_modal: observable,
      setTour: action.bound,
      setTourModal: action.bound,
    });

    makePersistable(this, {
      name: "crypthub_tour_store",
      properties: ["tour_modal"],
      storage: window.localStorage,
    });
  }

  setTourModal(value: boolean) {
    runInAction(() => {
      this.tour_modal = value;
    });
  }

  setTour(value: { home?: boolean; p2p?: boolean; sell_p2p?: boolean }) {
    runInAction(() => {
      this.tour = { ...this.tour, ...value };
    });
  }
}

const tourStore = new TourStoreImplementation();

export default tourStore;
