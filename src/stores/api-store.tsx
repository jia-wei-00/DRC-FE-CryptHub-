import { makeObservable, action, observable, runInAction } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
const connection = new WebSocket(
  `wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`
);
const api = new DerivAPIBasic({ connection });

const tickHistory = (currency: String) =>
  api.subscribe({
    ticks_history: currency,
    adjust_start_time: 1,
    count: 19,
    end: "latest",
    start: 1,
    style: "ticks",
  });

class ApiStoreImplementation {
  chart_data: String[] = [];
  chart_labels: String[] = [];

  constructor() {
    makeObservable(this, {
      chart_data: observable,
      chart_labels: observable,
      tickResponse: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
    });
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
