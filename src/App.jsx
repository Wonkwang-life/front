import { useEffect } from "react";
import GlobalStyles from "./GlobalStyles";
import Router from "./Router";
import api from "./api";
import { useSetRecoilState } from "recoil";
import { userState } from "./state/userState";

function App() {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await api.get(`/user/check`, {
        // skipInterceptor: true,
      });
      setUser(response.data.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
      <Router />
      <GlobalStyles />
    </>
  );
}

export default App;
