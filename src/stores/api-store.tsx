import { makeObservable, action, observable, runInAction } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const tickHistory = (currency: String) =>
  api.subscribe(
    {
      ticks_history: currency,
      adjust_start_time: 1,
      count: 500,
      end: "latest",
      start: 1,
      style: "ticks",
    }
    // {
    //   ticks_history: "cryETHUSD",
    //   adjust_start_time: 1,
    //   end: "latest",
    //   start: 1,
    //   style: "candles",
    // }
  );

class ApiStoreImplementation {
  chart_data: any[] = [];
  chart_labels: String[] = [];
  t_chart_data: any[] = [];
  t_chart_labels: String[] = [];

  constructor() {
    makeObservable(this, {
      chart_data: observable,
      t_chart_data: observable,
      chart_labels: observable,
      t_chart_labels: observable,
      tickResponse: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
      formattedTimes: action.bound,
      resetData: action.bound,
    });
  }

  resetData = () => {
    this.chart_data = [];
    this.chart_labels = [];
    this.t_chart_data = [];
    this.t_chart_labels = [];
  };

  formattedTimes = (times: EpochTimeStamp) => {
    const date = new Date(times * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours.padStart(2, "0")}:${minutes.padStart(
      2,
      "0"
    )}:${seconds.padStart(2, "0")}`;
  };

  tickResponse = async (res: any) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      connection.removeEventListener("message", this.tickResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === "history") {
      const formattedTimes = data.history.times.map((times: EpochTimeStamp) => {
        return this.formattedTimes(times);
      });

      const convertedData = data.history.prices.map(
        (price: number, index: number) => ({
          // previous: data.history.prices[index - 1],
          price: price,
          time: data.history.times[index],
          // time: formattedTimes[index],
        })
      );

      convertedData.shift();
      runInAction(() => {
        this.chart_data = convertedData;
        this.t_chart_data = data.history.prices;
        this.t_chart_labels = formattedTimes;
        // this.chart_labels = formattedTimes;
      });
    }

    if (data.msg_type === "tick") {
      runInAction(() => {
        const formattedTime = this.formattedTimes(data.tick.epoch);
        this.chart_data = [
          ...this.chart_data,
          {
            // previous: this.chart_data[this.chart_data.length - 2].price,
            price: data.tick.quote,
            time: data.tick.epoch,
          },
        ];
        if (this.chart_data.length > 500) {
          this.chart_data.shift();
        }

        const updatedData = [...this.t_chart_data, data.tick.quote];
        const updatedLabels = [...this.t_chart_labels, formattedTime];
        if (updatedData.length > 500) {
          updatedData.shift();
          updatedLabels.shift();
        }
        this.t_chart_data = updatedData;
        this.t_chart_labels = updatedLabels;
      });
    }
  };

  subscribeTicks = async (currency: String) => {
    await tickHistory(currency);
    connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = (currency: String) => {
    connection.removeEventListener("message", this.tickResponse, false);
    // tickStream().unsubscribe();
    tickHistory(currency).unsubscribe();
  };
}

const apiStore = new ApiStoreImplementation();

export default apiStore;
