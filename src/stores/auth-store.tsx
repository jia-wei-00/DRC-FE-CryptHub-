import { makeObservable, action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Action, InputData, ModalState, ResetPassword, User } from "../types";
import { MODALACTIONS } from "../constant";
import { createTimeoutPromise, firebaseError } from "../functions";
import Cookies from "js-cookie";
import db, { auth } from "../firebase";
import { FirebaseError } from "@firebase/util";
import { walletStore } from ".";
import firebase from "firebase/compat/app";

class AuthStoreImplementation {
  user: User | null = null;
  auth_modal: boolean = false;
  db_user_data: firebase.firestore.DocumentReference | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      db_user_data: observable,
      auth_modal: observable,
      setUser: action.bound,
      signOut: action.bound,
      setAuthModal: action.bound,
      setDbUserData: action.bound,
      reset: action.bound,
    });

    const user_data = Cookies.get("crypthub_user");

    this.setUser(user_data ? JSON.parse(user_data) : null);

    user_data && this.setDbUserData(JSON.parse(user_data).id);
  }

  setDbUserData(id: string) {
    runInAction(() => {
      this.db_user_data = db.collection("user_data").doc(id);
    });
  }

  reset() {
    runInAction(() => {
      this.user = null;
      this.auth_modal = true;
      walletStore.setUserWallet({ BTC: 0, ETH: 0, USD: 0 });
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

  async resetPassword(): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      await Promise.race([
        auth.sendPasswordResetEmail(this.user!.email),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Please check your email to reset password",
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

  async signIn(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");

    try {
      const { email, password } = values;

      const userCredential = await Promise.race([
        auth.signInWithEmailAndPassword(email, password),
        createTimeoutPromise(10000),
      ]);

      const user = userCredential.user;

      if (user && !user.emailVerified) {
        user.sendEmailVerification();

        return toast.update(id, {
          render: "Please check your email to verify your account!",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: null,
        });
      }

      const { uid, displayName, refreshToken } = user!;

      const details = {
        id: uid,
        email: email,
        name: displayName!,
        token: refreshToken,
      };

      Cookies.set("crypthub_user", JSON.stringify(details), { expires: 1 });

      this.setUser(details);
      this.setDbUserData(details.id);

      toast.update(id, {
        render: `Welcome ${displayName}`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      this.setAuthModal(false);
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

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await Promise.race([auth.signOut(), createTimeoutPromise(10000)]);

      toast.update(id, {
        render: "Sign out Successfull",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      this.reset();
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

  async signUp(values: InputData): Promise<void> {
    const id = toast.loading("Please wait...");
    const { name, email, password } = values;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Update the user's display name
      await userCredential.user?.updateProfile({
        displayName: name,
      });

      const docRef = db.collection("user_data").doc(userCredential.user!.uid);

      await docRef.set({
        wallet: {
          USD: 0,
          BTC: 0,
          ETH: 0,
        },
        crypthub_trader_record: [],
        p2p_trader_record: [],
        wallet_record: [],
      });

      // Send email verification to the user
      await userCredential.user?.sendEmailVerification();

      toast.update(id, {
        render: "Please check your email to activate account!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
        closeButton: null,
      });

      this.setAuthModal(false);
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

  async forgotPassword(
    values: ResetPassword,
    modal: ModalState,
    dispatch: React.Dispatch<Action>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await Promise.race([
        auth.sendPasswordResetEmail(values.email),
        createTimeoutPromise(10000),
      ]);

      toast.update(id, {
        render: "Please check your email to reset password",
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
      toast.update(id, {
        render: firebaseError(error as FirebaseError),
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
