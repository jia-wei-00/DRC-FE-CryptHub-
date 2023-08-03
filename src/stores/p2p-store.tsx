import { action, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { authStore, walletStore, websocketStoreP2P } from ".";
import { AddP2PContractFormT, P2PContractsT, Wallet } from "../types";
import { createTimeoutPromise, firebaseError } from "../functions";
import db, { union } from "../firebase";
import firebase from "firebase/compat/app";
import { FirebaseError } from "@firebase/util";

class P2PStoreImplementation {
  p2p_contracts: P2PContractsT[] = [];
  p2p_ongoing_contracts: P2PContractsT[] = [];
  db_p2p_market = db.collection("p2p_market");

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
      updateSeller: action.bound,
      updateP2PHistory: action.bound,
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
      seller_id: authStore.user?.id,
      created_at: firebase.firestore.Timestamp.now().seconds,
    };

    try {
      await this.db_p2p_market.add(data);
      await authStore.db_user_data?.update({
        wallet: {
          ...walletStore.wallet,
          [data.currency]:
            walletStore.wallet[data.currency as keyof Wallet] -
            data.coin_amount!,
        },
      });

      toast.update(id, {
        render: "Contract created successfully",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      setSellModal(false);
    } catch (error: unknown) {
      toast.update(id, {
        render: firebaseError(error as FirebaseError),
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async buyContract(values: P2PContractsT): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      if (values.selling_price > walletStore.wallet.USD) {
        throw new Error("Insufficient balance");
      }

      this.updateSeller(values);

      await this.db_p2p_market.doc(values.contract_id).delete();
      await authStore.db_user_data?.update({
        wallet: {
          ...walletStore.wallet,
          USD: walletStore.wallet.USD - values.selling_price,
          [values.currency]:
            walletStore.wallet[values.currency as keyof Wallet] +
            values.coin_amount,
        },
      });

      this.updateP2PHistory(values, "bought");

      toast.update(id, {
        render: "Buy contract successful",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      toast.update(id, {
        render: firebaseError(error as FirebaseError),
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async withdrawContract(values: P2PContractsT): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      await this.db_p2p_market.doc(values.contract_id).delete();
      await authStore.db_user_data?.update({
        wallet: {
          ...walletStore.wallet,
          [values.currency]:
            walletStore.wallet[values.currency as keyof Wallet] +
            values.coin_amount,
        },
      });

      this.updateP2PHistory(values, "deleted");

      toast.update(id, {
        render: "Contract deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    } catch (error: unknown) {
      toast.update(id, {
        render: firebaseError(error as FirebaseError),
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });
    }
  }

  async fetchP2PMarket(): Promise<void> {
    try {
      await Promise.race([
        this.db_p2p_market.onSnapshot((snapshot) => {
          const payload = snapshot.docs.map((doc) => {
            const data = doc.data();
            const contract_id = doc.id;
            return { contract_id, ...data };
          }) as P2PContractsT[];

          this.setP2PContracts(payload);
        }),
        createTimeoutPromise(10000),
      ]);
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async fetchOnGoingContracts(): Promise<void> {
    if (authStore.user === null) return;
    try {
      await Promise.race([
        this.db_p2p_market
          .where("seller_id", "==", authStore.user.id)
          .onSnapshot((snapshot) => {
            const payload = snapshot.docs.map((doc) => {
              const data = doc.data();
              const contract_id = doc.id;
              return { contract_id, ...data };
            }) as P2PContractsT[];

            this.setP2POngoingContracts(payload);
          }),
        createTimeoutPromise(10000),
      ]);
    } catch (error: unknown) {
      toast.error(`Error: ${firebaseError(error as FirebaseError)}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  async updateSeller(values: P2PContractsT) {
    const seller = db.collection("user_data").doc(values.seller_id);
    const result = await seller.get();

    if (result.exists) {
      const seller_wallet = result.data()!.wallet;

      await db
        .collection("user_data")
        .doc(values.seller_id)
        .update({
          wallet: {
            ...seller_wallet,
            USD: seller_wallet.USD + values.selling_price,
          },
        });
    } else {
      throw new Error("Update seller wallet failed");
    }

    await seller.update({
      p2p_trader_record: union({
        contract_id: values.contract_id,
        currency: values.currency,
        coin_amount: values.coin_amount,
        selling_price: values.selling_price,
        created_at: values.created_at,
        completed_at: firebase.firestore.Timestamp.now().seconds,
        transaction_type: "sold",
      }),
    });
  }

  async updateP2PHistory(values: P2PContractsT, type: string) {
    await authStore.db_user_data!.update({
      p2p_trader_record: union({
        contract_id: values.contract_id,
        currency: values.currency,
        coin_amount: values.coin_amount,
        selling_price: values.selling_price,
        created_at: values.created_at,
        completed_at: firebase.firestore.Timestamp.now().seconds,
        transaction_type: type,
      }),
    });
  }
}

const p2pStore = new P2PStoreImplementation();

export default p2pStore;
