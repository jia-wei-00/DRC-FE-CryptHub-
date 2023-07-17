import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import axios, { AxiosError } from "axios";
import { authStore, walletStore, websocketStoreP2P } from ".";
import { AddP2PContractFormT, ErrorResponse, P2PContractsT } from "../types";
import {
  createTimeoutPromise,
  errorChecking,
  handleSuccess,
} from "../functions";

class P2PStoreImplementation {
  p2p_contracts: P2PContractsT[] = [];
  p2p_ongoing_contracts: P2PContractsT[] = [];

  constructor() {
    makeObservable(this, {
      p2p_contracts: observable,
      p2p_ongoing_contracts: observable,
      setP2PContracts: action.bound,
      addP2PContract: action.bound,
      buyContract: action.bound,
      withdrawContract: action.bound,
      fetchP2PMarket: action.bound,
      setP2POngoingContracts: action.bound,
    });
  }

  setP2PContracts(values: P2PContractsT[]) {
    runInAction(() => {
      this.p2p_contracts = values;
    });
  }

  setP2POngoingContracts(values: P2PContractsT[]) {
    runInAction(() => {
      this.p2p_ongoing_contracts = values;
    });
  }

  async addP2PContract(
    values: AddP2PContractFormT,
    setSellModal: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    const data = {
      currency: websocketStoreP2P.currency,
      coin_amount: values.coin_amount,
      selling_price: values.price,
    };

    try {
      const res = await Promise.race([
        axios.post(`${domain}/p2p/addP2PContract`, data, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      walletStore.setUserWallet(res.data.details.wallet_balance);
      setSellModal(false);
      p2pStore.fetchP2PMarket();
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
      const res = await Promise.race([
        axios.post(`${domain}/p2p/buyContract`, data, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
      walletStore.setUserWallet(res.data.details);
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
      const res = await Promise.race([
        axios.post(`${domain}/p2p/deleteContract`, data, {
          headers: headers(authStore.user!.token),
        }),
        createTimeoutPromise(10000),
      ]);

      const message = handleSuccess(res.data.message);

      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      walletStore.setUserWallet(res.data.details);

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
      const res = await Promise.race([
        axios.get(`${domain}/p2p/getOpenContracts`),
        createTimeoutPromise(10000),
      ]);
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
      const res = await Promise.race([
        axios.get(`${domain}/p2p/getOngoingContracts`, {
          headers: headers(authStore.user.token),
        }),
        createTimeoutPromise(10000),
      ]);

      this.setP2POngoingContracts(res.data.details);
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
