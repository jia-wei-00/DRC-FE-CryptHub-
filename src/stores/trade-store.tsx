import axios from "axios";
import { action, makeObservable } from "mobx";
import { toast } from "react-toastify";
import { domain, headers } from "../constant";
import { authStore, websocketStore } from ".";
import { BuyTokenT } from "../types";

class TradeStoreImplementation {
  constructor() {
    makeObservable(this, {
      buyToken: action.bound,
    });
  }

  //   {coin_currency, current_price, coin_amount}

  async buyToken(current_price: Number, input_price: Number): Promise<void> {
    const id = toast.loading("Please wait...");

    // console.log(current_price, input_price);

    const values = {
      coin_currency: websocketStore.subscribe_currency,
      current_price: current_price,
      coin_amount: input_price,
    };

    try {
      const res = await axios.post(`${domain}/trade/buy`, values, {
        headers: headers(authStore.user!.token),
      });

      toast.update(id, {
        render: res.data.message,
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
}

const tradeStore = new TradeStoreImplementation();

export default tradeStore;
