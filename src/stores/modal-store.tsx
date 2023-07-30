import { action, makeObservable, observable, runInAction } from "mobx";

class ModalStoreImplementation {
  confirmation_modal: {
    open: boolean;
    text: string | null;
    type: string | null;
    pay_currency: string | null;
    get_currency: string | null;
    pay: number | null;
    receive: number | null;
    modal_function: (() => Promise<void>) | null;
  } = {
    open: false,
    text: null,
    modal_function: null,
    pay_currency: null,
    get_currency: null,
    type: null,
    pay: null,
    receive: null,
  };

  verify_email_modal: boolean = false;
  verify_email: string = "";

  constructor() {
    makeObservable(this, {
      confirmation_modal: observable,
      setConfirmationModal: action.bound,
    });
  }

  setConfirmationModal(
    modal_function: (() => Promise<void>) | null,
    type: string | null,
    text: string | null,
    pay_currency: string | null,
    get_currency: string | null,
    receive: number | null,
    pay: number | null
  ) {
    runInAction(() => {
      this.confirmation_modal = {
        open: !this.confirmation_modal.open,
        text: text,
        pay_currency: pay_currency,
        get_currency: get_currency,
        receive: receive,
        pay: pay,
        type: type,
        modal_function: modal_function,
      };
    });
  }
}

const modalStore = new ModalStoreImplementation();

export default modalStore;
