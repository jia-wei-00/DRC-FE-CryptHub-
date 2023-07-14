import { action, makeObservable, observable, runInAction } from "mobx";
import {
  ErrorResponse,
  P2PCompletedHistoryT,
  Transaction,
  TransactionDateFromAPI,
  WalletHistoryT,
} from "../types";
import { authStore, loadingStore } from ".";
import { createTimeoutPromise, errorChecking } from "../functions";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { domain, headers } from "../constant";

class HistoryStoreImplementation {
  transaction: Transaction[] = [];
  wallet_history: WalletHistoryT[] = [];
  p2p_completed_history: P2PCompletedHistoryT[] = [];

  constructor() {
    makeObservable(this, {
      transaction: observable,
      wallet_history: observable,
      p2p_completed_history: observable,
      fetchTransaction: action.bound,
      fetchWalletHistory: action.bound,
      fetchP2PHistory: action.bound,
      setP2PCompletedHistory: action.bound,
      setWalletHistory: action.bound,
      setTransaction: action.bound,
    });
  }

  setP2PCompletedHistory(values: P2PCompletedHistoryT[]) {
    runInAction(() => {
      this.p2p_completed_history = values;
    });
  }

  setWalletHistory(values: WalletHistoryT[]) {
    runInAction(() => {
      this.wallet_history = values;
    });
  }

  setTransaction(values: Transaction[]) {
    runInAction(() => {
      this.transaction = values;
    });
  }

  async fetchTransaction(): Promise<void> {
    this.setTransaction([]);
    loadingStore.setHistoryLoading(true);

    try {
      const res = await Promise.race([
        axios.get(`${domain}/transaction/getAllTransactions`, {
          headers: headers(authStore.user!.token),
        }),
        createTimeoutPromise(10000),
      ]);

      const transaction = res.data.details.map(
        (data: TransactionDateFromAPI) => {
          const {
            transaction_id: id,
            trade_type: type,
            currency,
            coin_amount,
            transaction_amount,
            transaction_date: string_date,
            commission_deduction_5,
          } = data;

          const date = new Date(string_date).getTime();

          let commission = commission_deduction_5;

          if (commission === 0) {
            commission = "-";
          }

          return {
            id,
            type,
            currency,
            coin_amount,
            transaction_amount,
            commission,
            date,
          };
        }
      );

      this.setTransaction(transaction);

      loadingStore.setHistoryLoading(false);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchWalletHistory(): Promise<void> {
    this.setWalletHistory([]);
    loadingStore.setHistoryLoading(true);
    try {
      const res = await Promise.race([
        axios.get(`${domain}/wallet/walletTransaction`, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

      const transaction = res.data.details.map((data: WalletHistoryT) => {
        const { dwt_type, dwt_before, dwt_after, dwt_amount, created_at } =
          data;

        const date = new Date(created_at).getTime();
        const before = Number(dwt_before);
        const after = Number(dwt_after);
        const amount = Number(dwt_amount);

        return {
          dwt_type,
          dwt_before: before,
          dwt_after: after,
          dwt_amount: amount,
          created_at: date,
        };
      });

      this.setWalletHistory(transaction);

      loadingStore.setHistoryLoading(false);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchP2PHistory(): Promise<void> {
    this.setP2PCompletedHistory([]);
    loadingStore.setHistoryLoading(true);
    try {
      const res = await Promise.race([
        axios.get(`${domain}/p2p/getCompletedContracts`, {
          headers: headers(authStore.user!.token!),
        }),
        createTimeoutPromise(10000),
      ]);

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
      loadingStore.setHistoryLoading(false);
    } catch (error: unknown) {
      loadingStore.setHistoryLoading(false);
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.error(`Error: ${message}`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
}

const historyStore = new HistoryStoreImplementation();

export default historyStore;
