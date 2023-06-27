import { makeObservable, action, observable } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makePersistable } from "mobx-persist-store";
import axios from "axios";
import { InputData, ResetPassword, User } from "../types";
import { domain, headers } from "../constant";

class AuthStoreImplementation {
  user: User | null = null;
  login_modal = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      login_modal: observable,
      setUser: action.bound,
      signOut: action.bound,
    });

    // Make the store persistable
    makePersistable(this, {
      name: "UserStore",
      properties: ["user"],
      storage: window.localStorage,
    });
  }

  setUser = (authUser: User | null): void => {
    this.user = authUser;
  };

  async signIn(
    values: InputData,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const userCredential = await axios.post(
        `${domain}/user/loginUser`,
        values
      );
      console.log(userCredential.data.details);
      this.user = userCredential.data.details;
      console.log(this.user);
      setOpen(false);
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

  // async googleSignIn(): Promise<void> {
  //   const id = toast.loading("Please wait...");
  //   try {
  //     const signIn = await signInWithPopup(auth, provider);
  //     toast.update(id, {
  //       render: "Welcome " + signIn.user.email,
  //       type: "success",
  //       isLoading: false,
  //       autoClose: 5000,
  //     });
  //     this.setUser(signIn.user);
  //     this.setUsername(signIn.user.displayName!);
  //   } catch (error: any) {
  //     toast.update(id, {
  //       render: error.message,
  //       type: "error",
  //       isLoading: false,
  //       autoClose: 5000,
  //     });
  //   }
  // }

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      console.log({
        headers: headers(this.user!.token),
      });
      await axios.post(
        `${domain}/user/logoutUser`,
        {}, //pass in empty body
        { headers: headers(this.user!.token) }
      );

      toast.update(id, {
        render: "Successfully Logout",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      this.setUser(null);
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

  async signUp(
    values: InputData,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
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
      setOpen(false);
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
}

const authStore = new AuthStoreImplementation();

export default authStore;
