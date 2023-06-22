import { makeObservable, action, observable, runInAction } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import { makePersistable } from "mobx-persist-store";

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

class ApiStoreImplementation {
  chart_data: any[] = [];
  subscribeCurrency: string = "BTC";

  constructor() {
    makeObservable(this, {
      chart_data: observable,
      subscribeCurrency: observable,
      tickResponse: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
      resetData: action.bound,
      tickHistory: action.bound,
      setSubscribeCurrency: action.bound,
      changeSubscribedCurrency: action.bound,
    });

    makePersistable(this, {
      name: "subscribeCurrency",
      properties: ["subscribeCurrency"],
      storage: window.localStorage,
    });
  }

  tickHistory = () =>
    api.subscribe({
      ticks_history:
        this.subscribeCurrency === "BTC" ? "cryBTCUSD" : "cryETHUSD",
      adjust_start_time: 1,
      count: 2000,
      end: "latest",
      start: 1,
      style: "ticks",
    });

  setSubscribeCurrency = (currency: string) => {
    this.subscribeCurrency = currency;
  };

  resetData = () => {
    this.chart_data = [];
  };

  tickResponse = async (res: any) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      connection.removeEventListener("message", this.tickResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === "history") {
      const convertedData = data.history.prices.map(
        (price: number, index: number) => ({
          previous: data.history.prices[index - 1],
          price: price,
          time: data.history.times[index],
        })
      );

      convertedData.shift();
      runInAction(() => {
        this.chart_data = convertedData;
      });
    }

    if (data.msg_type === "tick") {
      runInAction(() => {
        this.chart_data = [
          ...this.chart_data,
          {
            previous: this.chart_data[this.chart_data.length - 2].price,
            price: data.tick.quote,
            time: data.tick.epoch,
          },
        ];
        if (this.chart_data.length > 2000) {
          this.chart_data.shift();
        }
      });
    }
  };

  changeSubscribedCurrency = async (currency: string) => {
    await this.unsubscribeTicks();
    // this.resetData();
    this.setSubscribeCurrency(currency);
    // this.subscribeTicks();
  };

  subscribeTicks = async () => {
    await this.tickHistory();
    connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = async () => {
    connection.removeEventListener("message", this.tickResponse, false);
    await this.tickHistory().unsubscribe();
  };
}

const apiStore = new ApiStoreImplementation();

export default apiStore;
