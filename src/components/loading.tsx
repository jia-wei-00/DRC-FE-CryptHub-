import ReactLoading from "react-loading";
import { modeStore } from "../stores";
import { observer } from "mobx-react-lite";

export const Loading: React.FC<{ height: string; width: string }> = observer(
  ({ height, width }) => {
    return (
      <ReactLoading
        color={modeStore.mode === "light" ? "#a27b5c" : "white"}
        type="bars"
        height={height}
        width={width}
      />
    );
  }
);
