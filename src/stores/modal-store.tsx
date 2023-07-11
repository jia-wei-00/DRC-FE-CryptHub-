import { action, makeObservable, observable, runInAction } from "mobx";

class ModalStoreImplementation {
  confirmation_modal: {
    open: boolean;
    text: string;
    modal_function: (() => Promise<void>) | null;
  } = { open: false, text: "", modal_function: null };

  constructor() {
    makeObservable(this, {
      confirmation_modal: observable,
      setConfirmationModal: action.bound,
    });
  }

  setConfirmationModal(
    modal_function: (() => Promise<void>) | null,
    text?: string
  ) {
    runInAction(() => {
      this.confirmation_modal = {
        open: !this.confirmation_modal.open,
        text: text ? text : this.confirmation_modal.text,
        modal_function: modal_function,
      };
    });
  }
}

const modalStore = new ModalStoreImplementation();

export default modalStore;
