import { makeObservable, action, observable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const tickHistory = () =>
  api.subscribe({
    ticks_history: "cryBTCUSD",
    adjust_start_time: 1,
    count: 19,
    end: "latest",
    start: 1,
    style: "ticks",
  });

const tickHistoryETH = () =>
  api.subscribe({
    ticks_history: "cryETHUSD",
    adjust_start_time: 1,
    count: 19,
    end: "latest",
    start: 1,
    style: "ticks",
  });

class ApiStoreImplementation {
  chart_data: number[] = [];
  chart_data_eth: any[] = [];
  chart_labels: String[] = [];
  chart_labels_eth: String[] = [];

  constructor() {
    makeObservable(this, {
      chart_data: observable,
      chart_labels: observable,
      chart_data_eth: observable,
      chart_labels_eth: observable,
      tickResponse: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
      subscribeTicksEth: action.bound,
      unsubscribeTicksEth: action.bound,
    });

    // // Make the store persistable
    // makePersistable(this, {
    //   name: "ChartDataStore",
    //   properties: ["chart_data"],
    //   storage: window.localStorage,
    // });
  }

  tickResponse = async (res: any) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      connection.removeEventListener("message", this.tickResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === "history") {
      runInAction(() => {
        const formattedTimes = data.history.times.map(
          (timestamp: EpochTimeStamp) => {
            const date = new Date(timestamp * 1000); // Convert epoch to milliseconds
            const hours = date.getHours(); // Get minutes from timestamp
            const minutes = date.getMinutes(); // Get minutes from timestamp
            const seconds = date.getSeconds(); // Get seconds from timestamp
            return `${hours}:${minutes}:${seconds}`;
          }
        );
        this.chart_data = data.history.prices;
        this.chart_labels = formattedTimes;
      });
    }

    if (data.msg_type === "tick") {
      runInAction(() => {
        const updatedData = [...this.chart_data, data.tick.quote];
        const timestamp = new Date(data.tick.epoch * 1000); // Convert epoch to milliseconds
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes(); // Get minutes from timestamp
        const seconds = timestamp.getSeconds(); // Get seconds from timestamp
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format minutes and seconds
        const updatedLabels = [...this.chart_labels, formattedTime];
        if (updatedData.length > 20) {
          updatedData.shift();
          updatedLabels.shift();
        }
        this.chart_data = updatedData;
        this.chart_labels = updatedLabels;
      });
    }
  };

  tickResponseEth = async (res: any) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log("Error: ", data.error.message);
      connection.removeEventListener("message", this.tickResponse, false);
      await api.disconnect();
    }

    // if (data.msg_type === "history") {
    //   runInAction(() => {
    //     const formattedTimes = data.history.times.map(
    //       (timestamp: EpochTimeStamp) => {
    //         const date = new Date(timestamp * 1000); // Convert epoch to milliseconds
    //         const hours = date.getHours(); // Get minutes from timestamp
    //         const minutes = date.getMinutes(); // Get minutes from timestamp
    //         const seconds = date.getSeconds(); // Get seconds from timestamp
    //         return `${hours}:${minutes.toFixed(2)}:${seconds.toFixed(2)}`;
    //       }
    //     );
    //     this.chart_data_eth = data.history.prices;
    //     this.chart_labels_eth = formattedTimes;
    //   });
    // }

    if (data.msg_type === "tick") {
      runInAction(() => {
        // const updatedData = [...this.chart_data, data.tick.quote];
        // const timestamp = new Date(data.tick.epoch * 1000); // Convert epoch to milliseconds
        // const hours = timestamp.getHours();
        // const minutes = timestamp.getMinutes(); // Get minutes from timestamp
        // const seconds = timestamp.getSeconds(); // Get seconds from timestamp
        // const formattedTime = `${hours}:${minutes}:${seconds}`; // Format minutes and seconds
        // const updatedLabels = [...this.chart_labels, formattedTime];
        // if (updatedData.length > 20) {
        //   updatedData.shift();
        //   updatedLabels.shift();
        // }
        this.chart_data_eth = data.tick.quote;
        this.chart_labels_eth = data.tick.epoch;
      });
    }
  };

  subscribeTicks = async () => {
    // await tickHistory();
    // await tickStream();
    connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = () => {
    connection.removeEventListener("message", this.tickResponse, false);
    // tickStream().unsubscribe();
    tickHistory().unsubscribe();
  };

  subscribeTicksEth = async () => {
    await tickHistoryETH();
    // await tickStream();
    connection.addEventListener("message", this.tickResponseEth);
  };

  unsubscribeTicksEth = () => {
    connection.removeEventListener("message", this.tickResponseEth, false);
    // tickStream().unsubscribe();
    tickHistoryETH().unsubscribe();
  };
}

const apiStore = new ApiStoreImplementation();

export default apiStore;
