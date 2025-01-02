import { Text, TouchableOpacity, StyleSheet } from "react-native";

type GreetingsButtonProps = {
  title: string;
  onPress: () => void;
};

export default function GreetingsButton({ title, onPress }: GreetingsButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50", // Green background color
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginVertical: 8,
    borderRadius: 8,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
