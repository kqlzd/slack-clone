import { Button, Box, Input, Text } from "@chakra-ui/react";

import { supabase } from "../../lib/supabase";
import { useAuthStates } from "../../hooks/useAuthStates";

export const Auth = () => {
  const {
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
  } = useAuthStates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <>
      <Box
        as="form"
        onSubmit={handleSubmit}
        alignContent={"center"}
        width="50%"
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
        />

        <Input
          type="password"
          placeholder="Şifrə"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb={4}
        />

        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}

        <Button type="submit" loading={loading} width="full">
          {isLogin ? "Giriş et" : "Qeydiyyat"}
        </Button>

        <Text
          mt={4}
          textAlign="center"
          cursor="pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Hesabın yoxdur? Qeydiyyat" : "Hesabın var? Giriş et"}
        </Text>
      </Box>
    </>
  );
};
