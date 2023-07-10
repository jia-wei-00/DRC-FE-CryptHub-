import { makeObservable, action, observable, runInAction } from "mobx";
import DerivAPIBasic from "https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic";
import { makePersistable } from "mobx-persist-store";
import { toast } from "react-toastify";
import { APIT } from "../types";

class P2PWebSocketStoreImplementation {
  ticks: number = 0;
  currency: string = "";

  constructor() {
    makeObservable(this, {
      ticks: observable,
      currency: observable,
      tickSubscribe: action.bound,
      setCurrency: action.bound,
      setTicks: action.bound,
      resetData: action.bound,
      changeSubscribedCurrency: action.bound,
      subscribeTicks: action.bound,
      unsubscribeTicks: action.bound,
    });

    makePersistable(this, {
      name: "p2p_tick_currency",
      properties: ["currency"],
      storage: window.localStorage,
    });
  }

  app_id = 1089;

  connection: WebSocket = new WebSocket(
    `wss://ws.binaryws.com/websockets/v3?app_id=${this.app_id}`
  );

  api = new DerivAPIBasic({ connection: this.connection });

  tickSubscribe = () =>
    this.api.subscribe({
      ticks: this.currency === "BTC" ? "cryBTCUSD" : "cryETHUSD",
      subscribe: 1,
    });

  setCurrency = (currency: string) => {
    runInAction(() => {
      this.currency = currency;
    });
  };

  setTicks = (value: number) => {
    runInAction(() => {
      this.ticks = value;
    });
  };

  resetData = () => {
    runInAction(() => {
      this.ticks = 0;
    });
  };

  tickResponse = async (res: any) => {
    console.log(res);
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      toast.error(`Error: ${data.error.message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.connection?.removeEventListener("message", this.tickResponse, false);
      await this.api.disconnect();
    }

    if (data.msg_type === "tick") {
      this.setTicks(data.tick.quote);
    }
  };

  changeSubscribedCurrency = (currency: string) => {
    this.resetData();
    this.setCurrency(currency);
    this.subscribeTicks();
  };

  subscribeTicks = async () => {
    this.unsubscribeTicks(); // Disconnect previous connection
    this.resetData();

    this.connection = new WebSocket(
      `wss://ws.binaryws.com/websockets/v3?app_id=${this.app_id}`
    );
    this.api = new DerivAPIBasic({ connection: this.connection });

    await this.tickSubscribe(); // Subscribe to ticks

    this.connection.addEventListener("message", this.tickResponse);
  };

  unsubscribeTicks = async () => {
    this.connection!.removeEventListener("message", this.tickResponse, false);
    await this.tickSubscribe().unsubscribe();
    this.resetData();
  };
}

const websocketStoreP2P = new P2PWebSocketStoreImplementation();

export default websocketStoreP2P;
