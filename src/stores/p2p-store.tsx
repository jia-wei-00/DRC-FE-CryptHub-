import { action, makeObservable } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import axios from "axios";
import { authStore, websocketStoreP2P } from ".";
import { AddP2PContractFormT } from "../types";

class P2PStoreImplementation {
  constructor() {
    makeObservable(this, {
      addP2PContract: action.bound,
    });
  }

  async addP2PContract(values: AddP2PContractFormT): Promise<void> {
    const id = toast.loading("Please wait...");

    // console.log(values);

    const data = {
      currency: websocketStoreP2P.currency,
      coin_amount: values.coin_amount,
      selling_price: values.price,
    };

    try {
      const res = await axios.post(`${domain}/p2p/addP2PContract`, data, {
        headers: headers(authStore.user!.token!),
      });
      toast.update(id, {
        render: `Add Sucessfully`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      authStore.setUser(res.data.details.wallet_balance);
      console.log(authStore.user);
    } catch (error: any) {
      console.log(error);
      let message = error.message;
      if (error.response) {
        message = error.response.data.message;
      }
      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async fetchP2PMarket(): Promise<void> {
    try {
      const res = await axios.get(`${domain}/p2p/getOpenContracts`, {
        headers: headers(authStore.user!.token!),
      });
      console.log(res);
    } catch (error: any) {
      console.log(error);
      let message = error.message;
      if (error.response) {
        message = error.response.data.message;
      }
      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
}

const p2pStore = new P2PStoreImplementation();

export default p2pStore;
