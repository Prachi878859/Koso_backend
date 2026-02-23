


// import { useEffect, useState } from "react";
// import {
//   Animated,
//   Easing,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import Reanimated, {
//   Easing as ReanimatedEasing,
//   useAnimatedStyle,
//   useSharedValue,
//   withRepeat,
//   withTiming,
// } from "react-native-reanimated";
// import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Stop } from "react-native-svg";

// // Dynamic SVG Component for Gas Cylinder with animated leakage
// const AnimatedGasCylinder = ({ leakageLevel }) => {
//   const animatedGasOffset = useSharedValue(0); // For horizontal movement of gas
//   const animatedGasOpacity = useSharedValue(0);
//   const animatedGasColor = useSharedValue("#4CAF50"); // Green default

//   useEffect(() => {
//     let gasColor = "#4CAF50"; // Green for low leak
//     if (leakageLevel > 0.5) {
//       gasColor = "#FF5722"; // Orange for medium leak
//     }
//     if (leakageLevel > 0.8) {
//       gasColor = "#F44336"; // Red for high leak
//     }

//     animatedGasColor.value = gasColor;

//     if (leakageLevel > 0) {
//       // Animate gas moving left (right-to-left)
//       animatedGasOffset.value = withRepeat(
//         withTiming(-80, { duration: 2000, easing: ReanimatedEasing.linear }), // Move left from right
//         -1, // Repeat indefinitely
//         false
//       );
//       animatedGasOpacity.value = withTiming(1, { duration: 500 });
//     } else {
//       animatedGasOffset.value = withTiming(0, { duration: 500 });
//       animatedGasOpacity.value = withTiming(0, { duration: 500 });
//     }
//   }, [leakageLevel]);

//   const gasAnimatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: animatedGasOffset.value }],
//       opacity: animatedGasOpacity.value,
//     };
//   });

//   return (
//     <View style={styles.cylinderWrapper}>
//      <Svg width="220" height="220" viewBox="0 0 220 220">
//       <Defs>
//         {/* Gradient for Big Cylinder */}
//         <LinearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0%" stopColor="#E57373" />
//           <Stop offset="100%" stopColor="#B71C1C" />
//         </LinearGradient>
//         {/* Gradient for Small Cylinder */}
//         <LinearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
//           <Stop offset="0%" stopColor="#64B5F6" />
//           <Stop offset="100%" stopColor="#0D47A1" />
//         </LinearGradient>
//       </Defs>

//       {/* मोठा Cylinder */}
//       <G>
//         {/* Body */}
//         <AnimatedPath
//           d="M100 40 H160 V160 H100 Z"
//           stroke="#333"
//           strokeWidth="2"
//           fill="url(#gradRed)"
//           animatedProps={animatedProps}
//         />
//         {/* Top Dome */}
//         <Path
//           d="M100 40 Q130 20 160 40 Z"
//           fill="url(#gradRed)"
//           stroke="#333"
//           strokeWidth="2"
//         />
//         {/* Bottom Dome */}
//         <Path
//           d="M100 160 Q130 180 160 160 Z"
//           fill="url(#gradRed)"
//           stroke="#333"
//           strokeWidth="2"
//         />
//       </G>

//       {/* छोटा Cylinder */}
//       <G>
//         <Path
//           d="M40 90 H80 V150 H40 Z"
//           fill="url(#gradBlue)"
//           stroke="#333"
//           strokeWidth="2"
//         />
//         <Path
//           d="M40 90 Q60 75 80 90 Z"
//           fill="url(#gradBlue)"
//           stroke="#333"
//           strokeWidth="2"
//         />
//         <Path
//           d="M40 150 Q60 165 80 150 Z"
//           fill="url(#gradBlue)"
//           stroke="#333"
//           strokeWidth="2"
//         />
//         {/* Legs */}
//         <Path d="M45 150 V160 H50 V150 Z" fill="#0D47A1" />
//         <Path d="M70 150 V160 H75 V150 Z" fill="#0D47A1" />
//       </G>

//       {/* Valve + Gauge */}
//       <G>
//         <Path d="M120 15 H140 V25 H120 Z" fill="#FFD54F" stroke="#333" strokeWidth="1" />
//         <Path d="M125 5 H135 V15 H125 Z" fill="#FFD54F" stroke="#333" strokeWidth="1" />
//         <Circle cx="150" cy="10" r="8" fill="#fff" stroke="#333" strokeWidth="1" />
//         <Line x1="150" y1="10" x2="154" y2="6" stroke="#333" strokeWidth="1" />
//       </G>
//     </Svg>


//       {/* Animated Gas Leakage (from right to left) */}
//       <Reanimated.View style={[styles.gasEmissionContainer, gasAnimatedStyle]}>
//         <Svg width="100" height="100" viewBox="0 0 100 100">
//           <Defs>
//             <LinearGradient id="gasGradient" x1="1" y1="0" x2="0" y2="0">
//               <Stop
//                 offset="0%"
//                 stopColor={animatedGasColor.value}
//                 stopOpacity="0.8"
//               />
//               <Stop
//                 offset="100%"
//                 stopColor={animatedGasColor.value}
//                 stopOpacity="0.1"
//               />
//             </LinearGradient>
//           </Defs>
//           <G
//             name="gas-leak"
//             origin="0,50" // Origin for right-to-left emission
//             style={{ opacity: leakageLevel > 0 ? 1 : 0 }}
//           >
//             {/* Animated gas flow path (adjusted for right-to-left emission) */}
//             <Path
//               d="M 0 50 C 5 45 15 55 10 60 S 20 50 30 50 C 40 50 45 45 35 40 S 0 50 0 50"
//               fill="url(#gasGradient)"
//             />
//           </G>
//         </Svg>
//       </Reanimated.View>
//     </View>
//   );
// };

// export default function Index() {
//   const [P1, setP1] = useState("");
//   const [P2, setP2] = useState("");
//   const [T1, setT1] = useState("");
//   const [T2, setT2] = useState("");
//   const [Tmix, setTmix] = useState("");
//   const [WCRH, setWCRH] = useState("");

//   const [open, setOpen] = useState(false);
//   const [wcrUnit, setWcrUnit] = useState("T/HR");
//   const [items, setItems] = useState([
//     { label: "T/HR", value: "T/HR" },
//     { label: "KG/HR", value: "KG/HR" },
//   ]);

//   const [result, setResult] = useState("0");
//   const [message, setMessage] = useState("");
//   const [leakageLevel, setLeakageLevel] = useState(0);

//   const [blinkAnim] = useState(new Animated.Value(1));

//   useEffect(() => {
//     if (message) {
//       startBlink();
//     } else {
//       blinkAnim.stopAnimation();
//       blinkAnim.setValue(1);
//     }
//   }, [message]);

//   const startBlink = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(blinkAnim, {
//           toValue: 0,
//           duration: 500,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//         Animated.timing(blinkAnim, {
//           toValue: 1,
//           duration: 500,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const validateInputs = (p1, p2, t1, t2, tmix) => {
//     if (p1 < 40 || p1 > 280) return "P1 out of bounds";
//     if (p2 < 20 || p2 > 60) return "P2 out of bounds";
//     if (p1 / p2 < 2 || p1 / p2 > 6) return "P1/P2 ratio invalid";
//     if (t1 < 500 || t1 > 600) return "T1 out of bounds";
//     if (t2 < 300 || t2 > 400) return "T2 out of bounds";
//     if (tmix < 360 || tmix > 450) return "T-MIX out of bounds";
//     if (t2 - tmix > 5) return "T-MIX lower than T2";
//     return "";
//   };

//   const calculateLeakFlow = () => {
//     const p1 = Number.parseFloat(P1);
//     const p2 = Number.parseFloat(P2);
//     const t1 = Number.parseFloat(T1);
//     const t2 = Number.parseFloat(T2);
//     const tmix = Number.parseFloat(Tmix);
//     const wcrh = Number.parseFloat(WCRH);
//     const K = wcrUnit === "KG/HR" ? 145 : 0.145;

//     if ([p1, p2, t1, t2, tmix, wcrh].some(isNaN)) {
//       setMessage("Invalid input values");
//       setResult("0");
//       setLeakageLevel(0); // Do not show gas on error
//       return;
//     }

//     const validation = validateInputs(p1, p2, t1, t2, tmix);
//     if (validation) {
//       setMessage(validation);
//       setResult("0");
//       setLeakageLevel(0); // Do not show gas on warning
//       return;
//     }

//     const K2 = 0.4;
//     const T1m = t1 - K2 * (p1 - p2);
//     const num = tmix - t2;
//     const den = T1m - t2;
//     const x = num / den;
//     const wLeak = K * wcrh * x;

//     const finalResult = wLeak.toFixed(2);
//     setResult(finalResult);
//     setMessage("");

//     // Set leakage level for animation based on calculated value
//     let dynamicLeakage = 0;
//     if (wLeak > 50) {
//       dynamicLeakage = 1;
//     } else if (wLeak > 20) {
//       dynamicLeakage = 0.6;
//     } else if (wLeak > 0) {
//       dynamicLeakage = 0.3;
//     }
//     setLeakageLevel(dynamicLeakage);
//   };

//   const resetAll = () => {
//     setP1("");
//     setP2("");
//     setT1("");
//     setT2("");
//     setTmix("");
//     setWCRH("");
//     setResult("0");
//     setMessage("");
//     setLeakageLevel(0);
//     blinkAnim.stopAnimation();
//     blinkAnim.setValue(1);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >

//        <View style={styles.header}>
//           <Text style={styles.logo}>KOSO</Text>
//           <View style={styles.stationUnitContainer}>
//             <Text style={styles.station}>Bashpoorja Station</Text>
//             <View style={styles.underline} />
//             <Text style={styles.unit}>Unit 4</Text>
//           </View>
//         </View>
//       <ScrollView contentContainerStyle={styles.container}>
//         {/* Header */}
       

//         {/* Dynamic Cylinder Illustration */}
//         <View style={styles.boilerContainer}>
//           <AnimatedGasCylinder leakageLevel={leakageLevel} />
//         </View>

//         {/* Output section under Cylinder */}
//         <View style={styles.outputBox}>
//           <View style={styles.outputInnerBox}>
//             <Text style={styles.outputText}>
//               Leakage <Text style={styles.outputValue}>
//                 {result} Tr/TH
//               </Text>
//             </Text>
//             {message ? (
//               <Animated.Text style={[styles.warningText, { opacity: blinkAnim }]}>
//                 Warning: {message}
//               </Animated.Text>
//             ) : null}
//           </View>
//         </View>

//         {/* Inputs */}
//         <Text style={styles.sectionTitle}>Application - HP ByPass</Text>
//         <View style={styles.row}>
//           <InputField label="P1 (HP Inlet Pressure)" value={P1} onChangeText={setP1} />
//           <InputField label="T1 (HP Steam °C)" value={T1} onChangeText={setT1} />
//         </View>
//         <View style={styles.row}>
//           <InputField label="P2 (CRH Outlet Pressure)" value={P2} onChangeText={setP2} />
//           <InputField label="T2 (°C)" value={T2} onChangeText={setT2} />
//         </View>
//         <View style={styles.row}>
//           <InputField label="W-CRH" value={WCRH} onChangeText={setWCRH} />
//           <View style={{ flex: 1, marginLeft: 10 }}>
//             <Text style={styles.inputLabel}>Unit</Text>
//             <DropDownPicker
//               open={open}
//               value={wcrUnit}
//               items={items}
//               setOpen={setOpen}
//               setValue={setWcrUnit}
//               setItems={setItems}
//               style={styles.dropdown}
//               dropDownContainerStyle={styles.dropdownList}
//               textStyle={styles.dropdownText}
//               placeholderStyle={styles.dropdownText}
//             />
//           </View>
//         </View>
//         <View style={styles.row}>
//           <InputField label="T-MIX (°C)" value={Tmix} onChangeText={setTmix} />
//         </View>

//         {/* Buttons */}
//         <TouchableOpacity style={styles.calculateBtn} onPress={calculateLeakFlow}>
//           <Text style={styles.calculateText}>Calculate</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={resetAll}>
//           <Text style={styles.resetText}>Reset Value</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// // Reusable InputField component
// function InputField({ label, value, onChangeText }) {
//   return (
//     <View style={styles.inputFieldContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         value={value}
//         onChangeText={onChangeText}
//         placeholder="00"
//         placeholderTextColor="#fa1010ff"
//       />
//     </View>
//   );
// }

// // Stylesheet
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     padding: 20,
//     flexGrow: 1,
//   },
//   header: {
//     backgroundColor: "#000",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   logo: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#FF4D57",
//   },
//   stationUnitContainer: {
//     alignItems: "flex-end",
//   },
//   station: {
//     fontSize: 16,
//     color: "#FF4D57",
//   },
//   underline: {
//     height: 1,
//     width: "80%",
//     backgroundColor: "#FF4D57",
//     marginVertical: 2,
//   },
//   unit: {
//     fontSize: 14,
//     color: "#eee",
//   },
//   boilerContainer: {
//     position: "relative",
//     width: "50%",
//     height: 150,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   cylinderWrapper: {
//     width: "100%",
//     height: "100%",
//     position: "relative",
//   },
//   svgCylinder: {
//     position: "absolute",
//     left: "50%",
//     transform: [{ translateX: -50 }],
//   },
//   gasEmissionContainer: {
//     position: "absolute",
//     top: "15%", // Adjust vertical position to align with valve
//     right: "15%", // Position near the right side of the cylinder valve
//     width: 100,
//     height: 100,
//     overflow: "hidden", // Ensures gas doesn't spill out too much
//   },
//   outputBox: {
//     marginTop: 10,
//     alignItems: "center",
//   },
//   outputInnerBox: {
//     backgroundColor: "rgba(255, 77, 87, 0.1)",
//     borderWidth: 1,
//     borderColor: "#FF4D57",
//     padding: 15,
//     borderRadius: 15,
//     width: "90%",
//     alignItems: "center",
//   },
//   outputText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   outputValue: {
//     color: "#333",
//     fontSize: 20,
//   },
//   warningText: {
//     fontSize: 14,
//     color: "#FF4D57",
//     marginTop: 6,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: "#FF4D57",
//     marginVertical: 15,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   inputFieldContainer: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   inputLabel: {
//     color: "#080808ff",
//     marginBottom: 4,
//     fontSize: 13,
//   },
//   input: {
//     backgroundColor: "#eee",
//     color: "#f10b0bff",
//     padding: 12,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#FF4D57",
//     fontSize: 16,
//   },
//   dropdown: {
//     backgroundColor: "#eee",
//     borderColor: "#FF4D57",
//     height: 40,
//     minHeight: 40,
//   },
//   dropdownList: {
//     backgroundColor: "#eee",
//     borderColor: "#FF4D57",
//     borderTopColor: "transparent",
//   },
//   dropdownText: {
//     color: "#f75a5aff",
//     fontSize: 14,
//   },
//   calculateBtn: {
//     backgroundColor: "#FF4D57",
//     padding: 16,
//     borderRadius: 35,
//     marginTop: 20,
//     alignItems: "center",
//     elevation: 5,
//     width: "60%",
//     alignSelf: "center",
//   },
//   calculateText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   resetText: {
//     color: "#666",
//     textAlign: "center",
//     marginTop: 15,
//     fontSize: 16,
//     textDecorationLine: "underline",
//   },
// });


import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Reanimated, {
  Easing as ReanimatedEasing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

const AnimatedGasCylinder = ({ leakageLevel }) => {
  const animatedGasOffset = useSharedValue(0);
  const animatedGasOpacity = useSharedValue(0);

  const [gasColor, setGasColor] = useState("#4CAF50");
  const [bigCylTop, setBigCylTop] = useState("#81C784");
  const [bigCylBottom, setBigCylBottom] = useState("#388E3C");

  useEffect(() => {
    // Dynamic color by leakage level
    if (leakageLevel <= 0) {
      setGasColor("#4CAF50");
      setBigCylTop("#81C784");
      setBigCylBottom("#388E3C");
    } else if (leakageLevel > 0 && leakageLevel <= 0.6) {
      setGasColor("#FF9800");
      setBigCylTop("#FFB74D");
      setBigCylBottom("#F57C00");
    } else {
      setGasColor("#F44336");
      setBigCylTop("#E57373");
      setBigCylBottom("#B71C1C");
    }

    if (leakageLevel > 0) {
      animatedGasOffset.value = withRepeat(
        withTiming(-80, { duration: 2000, easing: ReanimatedEasing.linear }),
        -1,
        false
      );
      animatedGasOpacity.value = withTiming(1, { duration: 400 });
    } else {
      animatedGasOffset.value = withTiming(0, { duration: 300 });
      animatedGasOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [leakageLevel]);

  const gasAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: animatedGasOffset.value }],
      opacity: animatedGasOpacity.value,
    };
  });

  return (
    <View style={styles.cylinderWrapper}>
      <Svg width="220" height="220" viewBox="0 0 220 220">
        <Defs>
          {/* Big Cylinder Gradient */}
          <LinearGradient id="gradBig" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={bigCylTop} />
            <Stop offset="100%" stopColor={bigCylBottom} />
          </LinearGradient>
          {/* Small Cylinder Gradient */}
          <LinearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#64B5F6" />
            <Stop offset="100%" stopColor="#0D47A1" />
          </LinearGradient>
        </Defs>

        {/* मोठा Cylinder */}
        <G>
          <Path
            d="M100 40 H160 V160 H100 Z"
            stroke="#333"
            strokeWidth="2"
            fill="url(#gradBig)"
          />
          <Path
            d="M100 40 Q130 20 160 40 Z"
            fill="url(#gradBig)"
            stroke="#333"
            strokeWidth="2"
          />
          <Path
            d="M100 160 Q130 180 160 160 Z"
            fill="url(#gradBig)"
            stroke="#333"
            strokeWidth="2"
          />
        </G>

        {/* छोटा Cylinder */}
        <G>
          <Path
            d="M40 90 H80 V150 H40 Z"
            fill="url(#gradBlue)"
            stroke="#333"
            strokeWidth="2"
          />
          <Path
            d="M40 90 Q60 75 80 90 Z"
            fill="url(#gradBlue)"
            stroke="#333"
            strokeWidth="2"
          />
          <Path
            d="M40 150 Q60 165 80 150 Z"
            fill="url(#gradBlue)"
            stroke="#333"
            strokeWidth="2"
          />
          <Path d="M45 150 V160 H50 V150 Z" fill="#0D47A1" />
          <Path d="M70 150 V160 H75 V150 Z" fill="#0D47A1" />
        </G>

        {/* Valve + Gauge */}
        <G>
          <Path
            d="M120 15 H140 V25 H120 Z"
            fill="#FFD54F"
            stroke="#333"
            strokeWidth="1"
          />
          <Path
            d="M125 5 H135 V15 H125 Z"
            fill="#FFD54F"
            stroke="#333"
            strokeWidth="1"
          />
          <Circle cx="150" cy="10" r="8" fill="#fff" stroke="#333" strokeWidth="1" />
          <Line x1="150" y1="10" x2="154" y2="6" stroke="#333" strokeWidth="1" />
        </G>
      </Svg>

      {/* Leak Air Emission (Top Valve पासून) */}
      <Reanimated.View
        style={[
          styles.gasEmissionContainer,
          { top: -5, right: 40 }, // top valve जवळ
          gasAnimatedStyle,
        ]}
      >
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="gasGradient" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0%" stopColor={gasColor} stopOpacity="0.7" />
              <Stop offset="100%" stopColor={gasColor} stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          <Path
            d="M 110 60 C 90 50, 70 70, 50 60 S 20 55, 0 65"
            fill="none"
            stroke="url(#gasGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </Svg>
      </Reanimated.View>
    </View>
  );
};

export default function Index() {
  const [P1, setP1] = useState("");
  const [P2, setP2] = useState("");
  const [T1, setT1] = useState("");
  const [T2, setT2] = useState("");
  const [Tmix, setTmix] = useState("");
  const [WCRH, setWCRH] = useState("");

  const [open, setOpen] = useState(false);
  const [wcrUnit, setWcrUnit] = useState("T/HR");
  const [items, setItems] = useState([
    { label: "T/HR", value: "T/HR" },
    { label: "KG/HR", value: "KG/HR" },
  ]);

  const [result, setResult] = useState("0");
  const [message, setMessage] = useState("");
  const [leakageLevel, setLeakageLevel] = useState(0);

  const [blinkAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (message) {
      startBlink();
    } else {
      blinkAnim.stopAnimation();
      blinkAnim.setValue(1);
    }
  }, [message]);

  const startBlink = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const validateInputs = (p1, p2, t1, t2, tmix) => {
    if (p1 < 40 || p1 > 280) return "P1 out of bounds";
    if (p2 < 20 || p2 > 60) return "P2 out of bounds";
    if (p1 / p2 < 2 || p1 / p2 > 6) return "P1/P2 ratio invalid";
    if (t1 < 500 || t1 > 600) return "T1 out of bounds";
    if (t2 < 300 || t2 > 400) return "T2 out of bounds";
    if (tmix < 360 || tmix > 450) return "T-MIX out of bounds";
    if (t2 - tmix > 5) return "T-MIX lower than T2";
    return "";
  };

  const calculateLeakFlow = () => {
    const p1 = Number.parseFloat(P1);
    const p2 = Number.parseFloat(P2);
    const t1 = Number.parseFloat(T1);
    const t2 = Number.parseFloat(T2);
    const tmix = Number.parseFloat(Tmix);
    const wcrh = Number.parseFloat(WCRH);
    const K = wcrUnit === "KG/HR" ? 145 : 0.145;

    if ([p1, p2, t1, t2, tmix, wcrh].some(isNaN)) {
      setMessage("Invalid input values");
      setResult("0");
      setLeakageLevel(0);
      return;
    }

    const validation = validateInputs(p1, p2, t1, t2, tmix);
    if (validation) {
      setMessage(validation);
      setResult("0");
      setLeakageLevel(0);
      return;
    }

    const K2 = 0.4;
    const T1m = t1 - K2 * (p1 - p2);
    const num = tmix - t2;
    const den = T1m - t2;
    const x = num / den;
    const wLeak = K * wcrh * x;

    const finalResult = wLeak.toFixed(2);
    setResult(finalResult);
    setMessage("");

    let dynamicLeakage = 0;
    if (wLeak > 50) {
      dynamicLeakage = 1;
    } else if (wLeak > 20) {
      dynamicLeakage = 0.6;
    } else if (wLeak > 0) {
      dynamicLeakage = 0.3;
    }
    setLeakageLevel(dynamicLeakage);
  };

  const resetAll = () => {
    setP1("");
    setP2("");
    setT1("");
    setT2("");
    setTmix("");
    setWCRH("");
    setResult("0");
    setMessage("");
    setLeakageLevel(0);
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>KOSO</Text>
        <View style={styles.stationUnitContainer}>
          <Text style={styles.station}>Bashpoorja Station</Text>
          <View style={styles.underline} />
          <Text style={styles.unit}>Unit 4</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.boilerContainer}>
          <AnimatedGasCylinder leakageLevel={leakageLevel} />
        </View>

        <View style={styles.outputBox}>
          <View style={styles.outputInnerBox}>
            <Text style={styles.outputText}>
              Leakage{" "}
              <Text style={styles.outputValue}>
                {result} Tr/TH
              </Text>
            </Text>
            {message ? (
              <Animated.Text style={[styles.warningText, { opacity: blinkAnim }]}>
                Warning: {message}
              </Animated.Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Application - HP ByPass</Text>
        <View style={styles.row}>
          <InputField label="P1 (HP Inlet Pressure)" value={P1} onChangeText={setP1} />
          <InputField label="T1 (HP Steam °C)" value={T1} onChangeText={setT1} />
        </View>
        <View style={styles.row}>
          <InputField label="P2 (CRH Outlet Pressure)" value={P2} onChangeText={setP2} />
          <InputField label="T2 (°C)" value={T2} onChangeText={setT2} />
        </View>
        <View style={styles.row}>
  {/* W-CRH Input */}
  <View style={{ flex: 1, marginRight: 8 }}>
    <InputField label="W-CRH" value={WCRH} onChangeText={setWCRH} />
  </View>

  {/* Unit Dropdown */}
  <View style={{ flex: 1, marginRight: 8, }}>
    <Text style={styles.inputLabel} >Unit</Text>
    <DropDownPicker
      open={open}
      value={wcrUnit}
      items={items}
      setOpen={setOpen}
      setValue={setWcrUnit}
      setItems={setItems}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownList}
      textStyle={styles.dropdownText}
      placeholderStyle={styles.dropdownText}
      listMode="SCROLLVIEW"
    />
  </View>

  {/* T-MIX Input */}
  <View style={{ flex: 1 }}>
    <InputField label="T-MIX (°C)" value={Tmix} onChangeText={setTmix} />
  </View>
</View>


        <TouchableOpacity style={styles.calculateBtn} onPress={calculateLeakFlow}>
          <Text style={styles.calculateText}>Calculate</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={resetAll}>
          <Text style={styles.resetText}>Reset Value</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, value, onChangeText }) {
  return (
    <View style={styles.inputFieldContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        placeholder="00"
        placeholderTextColor="#fa1010ff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#000",
    // marginTop: Platform.OS === "ios" ? 40 : 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF4D57",
  },
  stationUnitContainer: {
    alignItems: "flex-end",
  },
  station: {
    fontSize: 16,
    color: "#FF4D57",
  },
  underline: {
    height: 1,
    width: "80%",
    backgroundColor: "#FF4D57",
    marginVertical: 2,
  },
  unit: {
    fontSize: 14,
    color: "#eee",
  },
  boilerContainer: {
    position: "relative",
    width: "60%",
    height: 180,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginTop: 30,
    marginBottom: 5,
  },
  cylinderWrapper: {
    width: "100%",
    height: "120%",
    position: "relative",
  },
  gasEmissionContainer: {
    position: "absolute",
    width: 120,
    height: 120,
    overflow: "hidden",
  },
  outputBox: {
    marginTop: 8,
    alignItems: "center",
  },
  outputInnerBox: {
    backgroundColor: "rgba(255, 77, 87, 0.1)",
    // borderWidth: 1,
    // borderColor: "#FF4D57",
    padding: 15,
    borderRadius: 0,
    width: "70%",
    alignItems: "center",
  },
  outputText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  outputValue: {
    color: "#333",
    fontSize: 17,
  },
  warningText: {
    fontSize: 14,
    color: "#FF4D57",
    marginTop: 6,
    textAlign: "center",
  },
  sectionTitle: {
    backgroundColor: "#c7c5c5ff",
    padding: 10,
    fontSize: 18,
    color: "#FF4D57",
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputFieldContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    color: "#080808ff",
    marginBottom: 4,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#f5eaeaff",
    color: "#f10b0bff",
    padding: 12,
    borderRadius: 0,
    // borderWidth: 1,
    // borderColor: "#ebacb0ff",
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#f1e4e4ff",
    // borderColor: "#FF4D57",
    borderRadius: 0,
    borderWidth: 0,
      

    
  },
  dropdownList: {
    borderColor: "#FF4D57",
        backgroundColor: "#f1e4e4ff",

    borderRadius: 0,
    borderWidth: 0,
    fontSize: 12,
  },
  dropdownText: {
    color: "#FF4D57",
    fontSize: 12,
    height: 20,
  },
  calculateBtn: {
    backgroundColor: "#FF4D57",
    padding: 10,
    borderRadius: 30,
    marginTop: 15,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
  },
  calculateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetText: {
    color: "#FF4D57",
    fontSize: 12,
    textAlign: "center",  
    marginTop: 10,
  },
});
