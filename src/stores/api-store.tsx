import { makeObservable, action, observable, runInAction } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import { makePersistable } from "mobx-persist-store";
import { Candles, ChartData } from "../types";

class ApiStoreImplementation {
  chart_data: ChartData[] = [];
  candles: Candles[] = [];
  subscribe_currency: string = "BTC";
  chart_type: string = "line";
  interval: string = "1t";

  constructor() {
    makeObservable(this, {
      chart_data: observable,
      subscribe_currency: observable,
      chart_type: observable,
      interval: observable,
      setInterval: action.bound,
      setChartType: action.bound,
      tickResponse: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
      resetData: action.bound,
      tickHistory: action.bound,
      setSubscribeCurrency: action.bound,
      changeSubscribedCurrency: action.bound,
    });

    makePersistable(this, {
      name: "chart_store",
      properties: ["subscribe_currency", "chart_type", "interval"],
      storage: window.localStorage,
    });
  }

  app_id = 1089;

  connection: WebSocket = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${this.app_id}`
  );

  api = new DerivAPIBasic({ connection: this.connection });

  tickHistory = () =>
    this.api.subscribe({
      ticks_history:
        this.subscribe_currency === "BTC" ? "cryBTCUSD" : "cryETHUSD",
      adjust_start_time: 1,
      count: 2000,
      end: "latest",
      start: 1,
      style: "ticks",
    });

  setSubscribeCurrency = (currency: string) => {
    this.subscribe_currency = currency;
  };

  setChartType = (type: string) => {
    this.chart_type = type;
  };

  setInterval = (interval: string) => {
    this.interval = interval;
  };

  resetData = () => {
    this.chart_data = [];
  };

  tickResponse = async (res: any) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      this.connection?.removeEventListener("message", this.tickResponse, false);
      await this.api.disconnect();
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

  changeSubscribedCurrency = (currency: string) => {
    this.resetData();
    this.setSubscribeCurrency(currency);
    this.subscribeTicks();
  };

  changeSubscribedInterval = (interval: string) => {
    this.resetData();
    this.setInterval(interval);
    this.subscribeTicks();
  };

  subscribeTicks = async () => {
    this.unsubscribeTicks(); // Disconnect previous connection
    this.resetData();

    this.connection = new WebSocket(
      `wss://ws.binaryws.com/websockets/v3?app_id=${this.app_id}`
    );
    this.api = new DerivAPIBasic({ connection: this.connection });

    await this.tickHistory(); // Subscribe to ticks

    this.connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = async () => {
    this.connection!.removeEventListener("message", this.tickResponse, false);
    await this.tickHistory().unsubscribe();
    this.resetData();
  };
}

const apiStore = new ApiStoreImplementation();

export default apiStore;
