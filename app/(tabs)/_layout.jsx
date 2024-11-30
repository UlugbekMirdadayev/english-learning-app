import { Tabs } from "expo-router";
import React from "react";
import { HomeIcon, DictionaryIcon, ProfileIcon } from "@/assets/icons";

export default function TabLayout() {
  const screenOptions = ({ route }) => ({
    header: () => null,
    tabBarActiveTintColor: "#007aff",
    tabBarInactiveTintColor: "gray",
    tabBarLabelStyle: {
      fontSize: 14,
      fontFamily: "SFProTextMedium",
      fontWeight: "600",
      letterSpacing: -0.3,
    },
    tabBarIconStyle: {
      marginTop: 16,
    },
    tabBarStyle: {
      backgroundColor: "#fff",
      height: 96,
    },
  });

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              fill={focused ? "#007aff" : "gray"}
              width={30}
              height={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: "Dictionary",
          tabBarIcon: ({ focused }) => (
            <DictionaryIcon
              fill={focused ? "#007aff" : "gray"}
              width={30}
              height={30}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              fill={focused ? "#007aff" : "gray"}
              width={30}
              height={30}
            />
          ),
        }}
      />
    </Tabs>
  );
}
