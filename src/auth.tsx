import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { authStore } from "./stores";

const Auth = ({ children }: React.PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (authStore.user === null && location.pathname === "/profile") {
      navigate("/");
    }
  }, [authStore.user, navigate]);

  return <>{children}</>;
};

export default observer(Auth);
