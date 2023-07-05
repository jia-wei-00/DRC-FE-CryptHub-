import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import axios from "axios";
import { authStore, websocketStoreP2P } from ".";
import { AddP2PContractFormT, P2PContractsT } from "../types";

class P2PStoreImplementation {
  p2p_contracts: P2PContractsT[] = [];

  constructor() {
    makeObservable(this, {
      p2p_contracts: observable,
      addP2PContract: action.bound,
    });
  }

  setP2PContracts(values: P2PContractsT[]) {
    runInAction(() => {
      this.p2p_contracts = values;
    });
  }

  async addP2PContract(values: AddP2PContractFormT): Promise<void> {
    const id = toast.loading("Please wait...");
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
    } catch (error: any) {
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

  async buyContract(values: P2PContractsT): Promise<void> {
    const id = toast.loading("Please wait...");
    const data = {
      contract_id: values.contract_id,
    };

    try {
      const res = await axios.post(`${domain}/p2p/buyContract`, data, {
        headers: headers(authStore.user!.token!),
      });
      toast.update(id, {
        render: `Buy Sucessfully`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      authStore.setUser(res.data.details.wallet_balance);
      this.fetchOnGoingContracts();
    } catch (error: any) {
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

  async withdrawContract(values: P2PContractsT): Promise<void> {
    const id = toast.loading("Please wait...");
    const data = {
      contract_id: values.contract_id,
    };

    try {
      const res = await axios.post(`${domain}/p2p/deleteContract`, data, {
        headers: headers(authStore.user!.token!),
      });
      toast.update(id, {
        render: `Withdraw Sucessfully`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      authStore.setUser(res.data.details.wallet_balance);
      this.fetchOnGoingContracts();
    } catch (error: any) {
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
      this.setP2PContracts(res.data.details);
    } catch (error: any) {
      let message = error.message;
      if (error.response) {
        message = error.response.data.message;
      }
      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchOnGoingContracts(): Promise<void> {
    try {
      const res = await axios.get(`${domain}/p2p/getOngoingContracts`, {
        headers: headers(authStore.user!.token!),
      });

      this.setP2PContracts(res.data.details);
    } catch (error: any) {
      let message = error.message;
      if (error.response) {
        message = error.response.data.message;
      }
      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchP2PHistory(): Promise<void> {
    try {
      const res = await axios.get(`${domain}/p2p/getCompletedContracts`, {
        headers: headers(authStore.user!.token!),
      });

      console.log(res);

      // this.setP2PContracts(res.data.details);P2PHistory
    } catch (error: any) {
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
