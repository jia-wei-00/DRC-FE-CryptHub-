import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import axios, { AxiosError } from "axios";
import { authStore, websocketStoreP2P } from ".";
import {
  AddP2PContractFormT,
  ErrorResponse,
  P2PCompletedHistoryT,
  P2PContractsT,
} from "../types";
import { errorChecking } from "../functions";

class P2PStoreImplementation {
  p2p_contracts: P2PContractsT[] = [];
  p2p_completed_history: P2PCompletedHistoryT[] = [];

  constructor() {
    makeObservable(this, {
      p2p_contracts: observable,
      p2p_completed_history: observable,
      setP2PContracts: action.bound,
      addP2PContract: action.bound,
      buyContract: action.bound,
      withdrawContract: action.bound,
      fetchP2PMarket: action.bound,
      fetchP2PHistory: action.bound,
      setP2PCompletedHistory: action.bound,
    });
  }

  setP2PCompletedHistory(values: P2PCompletedHistoryT[]) {
    runInAction(() => {
      this.p2p_completed_history = values;
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
      authStore.setUserWallet(res.data.details.wallet_balance);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

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
      authStore.setUserWallet(res.data.details);
      console.log(res, "buy_contract");
      this.fetchOnGoingContracts();
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

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
        headers: headers(authStore.user!.token),
      });
      toast.update(id, {
        render: `Withdraw Sucessfully`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      authStore.setUserWallet(res.data.details);

      this.fetchOnGoingContracts();
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

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
      const res = await axios.get(`${domain}/p2p/getOpenContracts`);
      this.setP2PContracts(res.data.details);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  async fetchOnGoingContracts(): Promise<void> {
    if (authStore.user === null) return;
    try {
      const res = await axios.get(`${domain}/p2p/getOngoingContracts`, {
        headers: headers(authStore.user.token),
      });

      this.setP2PContracts(res.data.details);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  async fetchP2PHistory(): Promise<void> {
    try {
      const res = await axios.get(`${domain}/p2p/getCompletedContracts`, {
        headers: headers(authStore.user!.token!),
      });

      const values = res.data.details.map((value: P2PCompletedHistoryT) => {
        const created_date = new Date(value.created_at).getTime();
        const completed_date = new Date(value.completed_at).getTime();

        return {
          coin_amount: value.coin_amount,
          completed_at: completed_date,
          created_at: created_date,
          currency: value.currency,
          selling_price: value.selling_price,
          transaction_type: value.transaction_type,
        };
      });

      this.setP2PCompletedHistory(values);
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
}

const p2pStore = new P2PStoreImplementation();

export default p2pStore;
