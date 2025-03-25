import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

interface UserTextInputProps {
  placeholder: string;
  isPass: boolean;
  setStateValue: (value: string) => void;
  setEmailValid?: (value: boolean) => void;
}

const UserTextInput: React.FC<UserTextInputProps> = ({
  placeholder,
  isPass,
  setStateValue,
  setEmailValid,
}) => {
  const [value, setValue] = useState<string>("");
  const [showPass, setShowPass] = useState<boolean>(true);
  const [icon, setIcon] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const handleTextChange = (text: string) => {
    setValue(text);
    setStateValue(text);

    if(placeholder === "Email"){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(text);
      setIsEmailValid(status);
      setEmailValid && setEmailValid(status);
    }
  };

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        setIcon("person");
        break;
      case "Email":
        setIcon("email");
        break;
      case "Password":
        setIcon("lock");
        break;
      default:
        setIcon(null);
    }
  }, [placeholder]);

  return (
    <View style={[styles.Main , !isEmailValid && placeholder === "Email" && value.length >0 ? styles.borderRed : styles.borderGray]
    }>
      {icon && <MaterialIcons name={icon} size={24} color={"#6c6d83"} />}
      <TextInput
        style={styles.field}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        secureTextEntry={isPass && showPass}
        autoCapitalize="none"
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Entypo
            name={`${showPass ? "eye" : "eye-with-line"}`}
            size={24}
            color={"#6c6d83"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  Main: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
    borderColor: "#c7c9c9",
  },
  field: {
    width: width - 150,
    fontFamily: "NunitoBold",
    fontSize: 14,
  },
  borderRed: {
    borderColor: "red",
  },
  borderGray: {
    borderColor: "#c7c9c9",
  },
});
