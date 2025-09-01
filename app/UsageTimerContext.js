import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getKidUsageTime, updateKidUsageTime } from "./database";

export const UsageTimerContext = createContext();

export const UsageTimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null); // time in seconds
  const [kidId, setKidId] = useState(null);
  const router = useRouter();
  const intervalRef = useRef(null);
  const secondsCounterRef = useRef(0);

  // 🔹 Watch for kidId in storage
  useEffect(() => {
    const checkKidId = setInterval(async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("kidId"));
      if (stored && !kidId) {
        setKidId(stored);
      }
    }, 1000);

    return () => clearInterval(checkKidId);
  }, [kidId]);

  // 🔹 Initialize timer from DB
  useEffect(() => {
    if (!kidId) return;

    const initTimer = async () => {
      const limitObj = await getKidUsageTime(kidId);
      console.log("limit is", limitObj);

      if (limitObj && limitObj.allowedHours > 0) {
        setTimeLeft(limitObj.allowedHours * 60); // minutes → seconds
      } else {
        setTimeLeft(null);
      }
    };

    initTimer();
  }, [kidId]);

  // 🔹 Countdown timer
  useEffect(() => {
    if (timeLeft === null || !kidId) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    secondsCounterRef.current = 0;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, kidId]);

  // 🔹 React to timer changes (logout & DB update here safely)
  useEffect(() => {
    if (!kidId || timeLeft === null) return;

    // Time is up → update DB + logout
    if (timeLeft <= 0) {
      (async () => {
        try {
          await updateKidUsageTime(kidId);
          console.log("✅ Final update before logout for child", kidId);
        } catch (err) {
          console.error("❌ Failed to update before logout", err);
        }

        await AsyncStorage.removeItem("kidId");
        setKidId(null);
        clearInterval(intervalRef.current);
        router.replace("/Login");
      })();
      return;
    }

    // Update DB every 60 seconds
    secondsCounterRef.current += 1;
    if (secondsCounterRef.current >= 60) {
      secondsCounterRef.current = 0;
      (async () => {
        try {
          await updateKidUsageTime(kidId);
          console.log("✅ Updated 1 minute usage for child", kidId);
        } catch (err) {
          console.error("❌ Failed to update DB", err);
        }
      })();
    }
  }, [timeLeft, kidId]);

  return (
    <UsageTimerContext.Provider value={{ timeLeft }}>
      {children}
    </UsageTimerContext.Provider>
  );
};
