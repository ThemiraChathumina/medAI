import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext, BasicUserInfo } from "@asgardeo/auth-react";

interface UserContextProps {
  username: string | null;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, getBasicUserInfo } = useAuthContext();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (state?.isAuthenticated) {
      (async () => {
        const basicUserInfo: BasicUserInfo = await getBasicUserInfo();
        setUsername(basicUserInfo?.username || null);
      })();
    }
  }, [state?.isAuthenticated, getBasicUserInfo]);

  return (
    <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
