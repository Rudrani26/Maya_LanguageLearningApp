import React from "react";
import { Stack } from "expo-router";
// import "nativewind/tailwind.css";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="Signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
