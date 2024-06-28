import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import BrainImageLayout from "./components/BrainImageLayout";
import ChestXrayLayout from "./components/ChestXrayLayout";
import SelectScan from "./components/SelectScan";
import Login from "./components/Login";
import { ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { useAuthContext, BasicUserInfo } from "@asgardeo/auth-react";
import { UserProvider } from "./components/UserContext";

interface DerivedState {
  authenticateResponse: BasicUserInfo;
  idToken: string[];
  decodedIdTokenHeader: string;
  decodedIDTokenPayload: Record<string, string | number | boolean>;
}

const Loading: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      backgroundColor="white"
    >
      <Spinner size="xl" />
    </Flex>
  );
};

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return <Loading />;
  }

  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthenticatedRedirect: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { state } = useAuthContext();

  if (state.isLoading) {
    return <Loading />;
  }

  return state.isAuthenticated ? <Navigate to="/" /> : children;
};

const App: React.FC = () => {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getAccessToken,
    getDecodedIDToken,
  } = useAuthContext();

  const [derivedAuthenticationState, setDerivedAuthenticationState] =
    useState<DerivedState>({} as DerivedState);

  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    if (!state?.isAuthenticated) {
      return;
    }

    (async (): Promise<void> => {
      const basicUserInfo = await getBasicUserInfo();
      const idToken = await getIDToken();
      const accessToken = await getAccessToken();
      const decodedIDToken = await getDecodedIDToken();

      const derivedState: DerivedState = {
        authenticateResponse: basicUserInfo,
        idToken: idToken.split("."),
        decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
        decodedIDTokenPayload: decodedIDToken,
      };

      setDerivedAuthenticationState(derivedState);
      setAccessToken(accessToken);
    })();
  }, [state.isAuthenticated, getBasicUserInfo, getIDToken, getDecodedIDToken]);

  return (
    <ChakraProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SelectScan signOut={signOut} />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <AuthenticatedRedirect>
                  <Login signIn={signIn} />
                </AuthenticatedRedirect>
              }
            />
            <Route
              path="/brain-image-layout"
              element={
                <PrivateRoute>
                  <BrainImageLayout signOut={signOut} />
                </PrivateRoute>
              }
            />
            <Route
              path="/chest-xray-layout"
              element={
                <PrivateRoute>
                  <ChestXrayLayout signOut={signOut} />
                </PrivateRoute>
              }
            />
            {/* Catch-all route */}
            <Route
              path="*"
              element={
                <PrivateRoute>
                  <Navigate to="/" />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
};

export default App;
