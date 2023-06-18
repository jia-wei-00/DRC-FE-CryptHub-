import { makeObservable, action, observable } from "mobx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider } from "../firebase";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { makePersistable } from "mobx-persist-store";

export class AuthStoreImplementation {
  user: User | null = null;
  username: string | null = null;
  login_modal = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      username: observable,
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

    // auth.onAuthStateChanged(
    //   (user) => {
    //     if (user) {
    //       this.setUser(user);
    //     } else {
    //       this.setUser(null);
    //     }
    //   },
    //   (error) => {
    //     // Handle error if needed
    //   },
    //   () => {
    //     // Completion callback if needed
    //   }
    // );
  }

  setUser = (authUser: User | null): void => {
    this.user = authUser;
  };

  setUsername(username: string | null): void {
    this.username = username;
  }

  async signIn(
    email: string,
    password: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      toast.update(id, {
        render: "Welcome " + user.user.email,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      this.user = user.user;
      setOpen(false);
    } catch (error: any) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async googleSignIn(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      const signIn = await signInWithPopup(auth, provider);
      toast.update(id, {
        render: "Welcome " + signIn.user.email,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      this.setUser(signIn.user);
      this.setUsername(signIn.user.displayName!);
    } catch (error: any) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async signOut(): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await signOut(auth);
      toast.update(id, {
        render: "Successfully Logout",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
      this.setUser(null);
      this.setUsername(null);
    } catch (error: any) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async signUp(
    email: string,
    password: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<void> {
    const id = toast.loading("Please wait...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.update(id, {
      render: `Welcome ${userCredential.user.email}`,
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });
    this.user = userCredential.user;
    setOpen(false);
    try {
    } catch (error: any) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }

  async resetPassword(email: string): Promise<void> {
    const id = toast.loading("Please wait...");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.update(id, {
        render: `Check your email to reset password`,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.update(id, {
        render: error.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  }
}

const authStore = new AuthStoreImplementation();

export default authStore;
