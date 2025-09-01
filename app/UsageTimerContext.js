import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getKidUsageTime, updateUsageTime } from "./database";

export const UsageTimerContext = createContext();

export const UsageTimerProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [kidId, setKidId] = useState(null);
  const router = useRouter();
  const intervalRef = useRef(null);

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
      setTimeLeft(limitObj.allowedHours  * 60); 
    } else {
      setTimeLeft(null);
    }
  };

  initTimer();
}, [kidId]);

  useEffect(() => {
    if (timeLeft === null || !kidId) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        const newTime = prev - 1;

        if (newTime <= 0) {
          AsyncStorage.removeItem("kidId");
          setKidId(null);
          clearInterval(intervalRef.current);
          router.replace("/Login");
          return 0;
        }

        if (newTime % 60 === 0) {
          (async () => {
            await updateUsageTime(kidId);
            console.log("✅ Updated 1 minute usage for child", kidId);
          })();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLeft, kidId]);

  return (
    <UsageTimerContext.Provider value={{ timeLeft }}>
      {children}
    </UsageTimerContext.Provider>
  );
};
