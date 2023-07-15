import { makeObservable, action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { AxiosError } from "axios";
import {
  Action,
  ErrorResponse,
  InputData,
  ModalState,
  ResetPassword,
  ResetPasswordFormT,
  User,
} from "../types";
import { MODALACTIONS, domain, headers } from "../constant";
import {
  createTimeoutPromise,
  errorChecking,
  handleSuccess,
} from "../functions";
import Cookies from "js-cookie";
import { walletStore } from ".";

class AuthStoreImplementation {
  user: User | null = null;
  auth_modal: boolean = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      auth_modal: observable,
      setUser: action.bound,
      signOut: action.bound,
      setAuthModal: action.bound,

      reset: action.bound,
    });

    const user_data = Cookies.get("crypthub_user");

    this.setUser(user_data ? JSON.parse(user_data) : null);
  }

  reset() {
    runInAction(() => {
      this.user = null;
      this.auth_modal = true;
    });

    Cookies.remove("crypthub_user");
  }

  setAuthModal(value: boolean) {
    runInAction(() => {
      this.auth_modal = value;
    });
  }

  setUser = (authUser: User | null): void => {
    runInAction(() => {
      this.user = authUser;
    });
  };

  async resetPassword(values: ResetPasswordFormT): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      const res = await Promise.race([
        axios.post(`${domain}/user/resetPassword`, values, {
          headers: headers(this.user!.token!),
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

  async signIn(values: InputData): Promise<void> {
    const toast_id = toast.loading("Please wait...");
    try {
      const userCredential = await Promise.race([
        axios.post(`${domain}/user/loginUser`, values),
        createTimeoutPromise(10000),
      ]);

      const { id, email, name, token, BTC, ETH, USD } =
        userCredential.data.details;

      this.setUser({ id, email, name, token });
      walletStore.setUserWallet({ BTC, ETH, USD });

      Cookies.set("crypthub_user", JSON.stringify(this.user), { expires: 1 });

      this.setAuthModal(false);
      toast.update(toast_id, {
        render: `Welcome ${this.user!.name}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      const message = errorChecking(error as AxiosError<ErrorResponse>);

      toast.update(toast_id, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const res = await Promise.race([
        axios.post(
          `${domain}/user/logoutUser`,
          {}, // pass in empty body
          { headers: headers(this.user!.token!) }
        ),
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

      runInAction(() => {
        this.setUser(null);
      });

      Cookies.remove("crypthub_user");
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

  async signUp(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const res = await Promise.race([
        axios.post(`${domain}/user/registerUser`, values),
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
      this.setAuthModal(false);
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

  async forgotPassword(
    values: ResetPassword,
    modal: ModalState,
    dispatch: React.Dispatch<Action>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const res = await Promise.race([
        axios.post(`${domain}/user/forgotPassword`, values),
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
      dispatch({
        type: MODALACTIONS.FORGOTPASSWORD,
        payload: !modal.forgot_password_modal,
      });
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
}

const authStore = new AuthStoreImplementation();

export default authStore;
