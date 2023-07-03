import { makeObservable, action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";
import { InputData, ResetPassword, Transaction, User } from "../types";
import { domain, headers } from "../constant";

class AuthStoreImplementation {
  user: User | null = null;
  auth_modal: boolean = false;
  transaction: Transaction[] = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      auth_modal: observable,
      transaction: observable,
      setUser: action.bound,
      signOut: action.bound,
      setAuthModal: action.bound,
      reset: action.bound,
      fetchTransaction: action.bound,
    });

    // Make the store persistable
    makePersistable(this, {
      name: "UserStore",
      properties: ["user"],
      storage: window.localStorage,
    });
  }

  reset() {
    runInAction(() => {
      this.user = null;
      this.auth_modal = true;
    });
  }

  setAuthModal(value: boolean) {
    runInAction(() => {
      this.auth_modal = value;
    });
  }

  setUser = (authUser: User | null): void => {
    runInAction(() => {
      authUser === null
        ? (this.user = null)
        : (this.user = { ...this.user, ...authUser! });
    });
  };

  async signIn(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const userCredential = await axios.post(
        `${domain}/user/loginUser`,
        values
      );

      runInAction(() => {
        this.user = userCredential.data.details;
      });

      this.setAuthModal(false);
      toast.update(id, {
        render: `Welcome ${this.user!.name}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      let message = error.message;
      if (error.response) {
        if (error.response.data.message === "ACCOUNT_NOT_VERIFIED") {
          message = "Please check your email to verify your account";
        } else {
          message = error.response.data.message;
        }
      }
      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async deposit(): Promise<void> {
    const id = toast.loading("Please wait...");

    const values = {
      amount: 1000,
    };

    try {
      const res = await axios.post(`${domain}/wallet/walletDeposit`, values, {
        headers: headers(this.user!.token!),
      });

      toast.update(id, {
        render: "Successfully Deposited",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      runInAction(() => {
        this.user!.USD += values.amount;
      });
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
      });
    }
  }

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      console.log({
        headers: headers(this.user!.token!),
      });
      await axios.post(
        `${domain}/user/logoutUser`,
        {}, //pass in empty body
        { headers: headers(this.user!.token!) }
      );

      toast.update(id, {
        render: "Successfully Logout",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      runInAction(() => {
        this.setUser(null);
      });
    } catch (error: any) {
      console.log(error);
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async signUp(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const userCredential = await axios.post(
        `${domain}/user/registerUser`,
        values
      );
      toast.update(id, {
        render: `Check your email to activate account`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      this.setAuthModal(false);
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
      });
    }
  }

  async forgotPassword(
    values: ResetPassword,
    setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await axios.post(`${domain}/user/forgotPassword`, values);
      toast.update(id, {
        render: `Check your email to reset password`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      setForgotPassword(false);
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
      });
    }
  }

  async fetchTransaction(): Promise<void> {
    try {
      const res = await axios.get(`${domain}/transaction/getAllTransactions`, {
        headers: headers(this.user!.token!),
      });

      const transaction = res.data.details.map((data: any) => {
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
      });

      runInAction(() => {
        this.transaction = transaction;
      });
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

const authStore = new AuthStoreImplementation();

export default authStore;
