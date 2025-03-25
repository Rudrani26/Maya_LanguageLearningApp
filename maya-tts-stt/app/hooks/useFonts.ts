import { useEffect, useState } from "react";
import * as Font from "expo-font";

const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFontsAsync = async () => {
      try {
        await Font.loadAsync({
          NunitoBold: require("../assets/fonts/NunitoBold.ttf"),
          NunitoReg: require("../assets/fonts/NunitoRegular.ttf")
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFontsAsync();
  }, []);

  return fontsLoaded;
};

export default useFonts;
