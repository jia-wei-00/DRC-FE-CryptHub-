import { action, makeObservable, observable, runInAction } from "mobx";

class LoadingStoreImplementation {
  history_loading: boolean = false;
  marketplace_loading: boolean = false;

  constructor() {
    makeObservable(this, {
      history_loading: observable,
      marketplace_loading: observable,
      setHistoryLoading: action.bound,
      setMarketplaceLoding: action.bound,
    });
  }

  setHistoryLoading(state: boolean) {
    runInAction(() => {
      this.history_loading = state;
    });
  }

  setMarketplaceLoding(state: boolean) {
    runInAction(() => {
      this.marketplace_loading = state;
    });
  }
}

const loadingStore = new LoadingStoreImplementation();

export default loadingStore;
