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
  isPass?: boolean;
  setStateValue: (value: string) => void;
  setEmailValid?: (value: boolean) => void;
}

const UserTextInput: React.FC<UserTextInputProps> = ({
  placeholder,
  isPass = false,
  setStateValue,
  setEmailValid,
}) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [icon, setIcon] = useState<keyof typeof MaterialIcons.glyphMap | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChange = (text: string) => {
    setValue(text);
    setStateValue(text);

    if (placeholder === "Email") {
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
    <View
      style={[
        styles.inputContainer,
        placeholder === "Email" && value.length > 0 ?
          (isEmailValid ? styles.borderGreen : styles.borderRed)
          : styles.borderGray
      ]}
    >
      {icon && (
        <MaterialIcons name={icon} size={24} color="#6773FF" style={styles.icon} />
      )}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        secureTextEntry={isPass && showPass}
        value={value}
        onChangeText={handleTextChange}
        style={styles.field}
      />

      {isPass && (
        <TouchableOpacity
          onPress={() => setShowPass(!showPass)}
          style={styles.eyeIcon}
        >
          <Entypo
            name={showPass ? "eye" : "eye-with-line"}
            size={24}
            color="#6773FF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  field: {
    flex: 1,
    fontFamily: "NunitoBold",
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  icon: {
    marginRight: 12,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  borderRed: {
    borderColor: "#FF6B6B",
  },
  borderGray: {
    borderColor: "#E0E0E0",
  },
  borderGreen: {
    borderColor: "#4CAF50",
  },
});
