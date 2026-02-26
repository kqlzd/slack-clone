import { useState } from "react";

export const useAuthStates = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  return {
    email,
    password,
    error,
    isLogin,
    loading,
    setEmail,
    setPassword,
    setError,
    setIsLogin,
    setLoading,
  };
};
