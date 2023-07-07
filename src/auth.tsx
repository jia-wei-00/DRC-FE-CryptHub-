import { PropsWithChildren } from "react";
// import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
// import { authStore } from "./stores";

const Auth = ({ children }: PropsWithChildren) => {
  // const navigate = useNavigate();

  // React.useEffect(() => {
  //   if (authStore.user === null) {
  //     navigate("/");
  //   }
  // }, [authStore.user, navigate]);

  return <>{children}</>;
};

export default observer(Auth);
