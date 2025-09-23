import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getKidUsageTime, updateKidUsageTime } from "./database";

export const UsageTimerContext = createContext();

export const UsageTimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null); 
  const [kidId, setKidId] = useState(null);
  const router = useRouter();
  const intervalRef = useRef(null);
  const secondsCounterRef = useRef(0);

  useEffect(() => {
    const checkKidId = setInterval(async () => {
      const stored = JSON.parse(await AsyncStorage.getItem("kidId"));
      if (stored && !kidId) {
        setKidId(stored);
      }
    }, 1000);

    return () => clearInterval(checkKidId);
  }, [kidId]);


  useEffect(() => {
    if (!kidId) return;

    const initTimer = async () => {
      const limitObj = await getKidUsageTime(kidId);
      console.log("limit is", limitObj);

      if (limitObj && limitObj.allowedHours > 0) {
        setTimeLeft(limitObj.allowedHours * 60);
      } else {
        setTimeLeft(null);
      }
    };

    initTimer();
  }, [kidId]);


  useEffect(() => {
    if (timeLeft === null || !kidId) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    secondsCounterRef.current = 0;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, kidId]);

 
  useEffect(() => {
    if (!kidId || timeLeft === null) return;

   
    if (timeLeft <= 0) {
      (async () => {
        try {
          await updateKidUsageTime(kidId);
          console.log(" Final update before logout for child", kidId);
        } catch (err) {
          console.error(" Failed to update before logout", err);
        }

        await AsyncStorage.removeItem("kidId");
        setKidId(null);
        clearInterval(intervalRef.current);
        router.replace("/Login");
      })();
      return;
    }

    secondsCounterRef.current += 1;
    if (secondsCounterRef.current >= 60) {
      secondsCounterRef.current = 0;
      (async () => {
        try {
          await updateKidUsageTime(kidId);
          console.log(" Updated 1 minute usage for child", kidId);
        } catch (err) {
          console.error(" Failed to update DB", err);
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
