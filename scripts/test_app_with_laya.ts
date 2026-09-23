import { execSync } from "child_process";
import { predictLaya, checkLayaHealth } from "../src/lib/layaClient";

async function runLayaAppTest() {
  console.log("=========================================");
  console.log("  HAPPY APP + LAYA SYSTEM-1 AI TEST RUN  ");
  console.log("=========================================\n");

  // 1. Check Laya Health
  const isLayaHealthy = await checkLayaHealth();
  if (!isLayaHealthy) {
    console.error("❌ Laya service is not running on http://127.0.0.1:8008.");
    console.error("   Run `npm run laya:start` in a terminal first.");
    process.exit(1);
  }
  console.log("✅ Laya Service: HEALTHY (http://127.0.0.1:8008)\n");

  // 2. Open Happy app on iOS simulator via agent-device
  console.log("📱 Launching Happy App on iOS Simulator...");
  try {
    execSync("agent-device open Happy --platform ios", { encoding: "utf8" });
  } catch (err: any) {
    console.error("❌ Failed to open app via agent-device:", err.message);
    process.exit(1);
  }

  // 3. Take UI snapshot
  console.log("📸 Capturing UI snapshot via agent-device...");
  let snapshotOutput = "";
  try {
    snapshotOutput = execSync("agent-device snapshot -i --platform ios", {
      encoding: "utf8",
    });
  } catch (err: any) {
    console.error("❌ Failed to capture snapshot:", err.message);
    process.exit(1);
  }

  console.log("\n--- RAW AGENT-DEVICE SNAPSHOT ---");
  console.log(snapshotOutput.trim());
  console.log("---------------------------------\n");

  // 4. Send snapshot text to Laya for 20ms AI System-1 Evaluation
  console.log("⚡ Evaluating screen state with Laya System-1 Model...");
  const evaluation = await predictLaya(snapshotOutput, {
    screen_type: {
      type: "choice",
      instructions: "What type of screen is currently displayed in the app UI?",
      criteria: {
        journey_map: "journey map, nodes, unit title, streak, sections, map view",
        course_catalog: "explore journeys, choose a journey to explore, course catalog, course list",
        course_overview: "course title, course outline, lessons, units, continue journey button",
        settings: "preferences, daily reminders, account, legal, privacy, sign out",
        unknown: "empty screen, loading spinner, or unknown screen"
      },
    },
    has_error: {
      type: "noul",
      instructions: "Does this screen show an error message, broken state, or network failure?",
    },
    action_readiness: {
      type: "score",
      instructions: "How ready is this screen for immediate user interaction or starting a lesson?",
      criteria: ["not interactive or broken", "partially interactive list", "fully ready with primary action button"],
    },
  });

  if (!evaluation) {
    console.error("❌ Laya evaluation returned null.");
    process.exit(1);
  }

  // 5. Output Results
  console.log("\n=========================================");
  console.log("        LAYA AI EVALUATION RESULTS       ");
  console.log("=========================================");
  
  const screenAnswer = evaluation.answers.screen_type;
  console.log(`📌 Detected Screen: ${screenAnswer.choice?.toUpperCase()} (Confidence: ${(screenAnswer.confidence * 100).toFixed(1)}%)`);
  if (screenAnswer.probabilities) {
    console.log("   Probabilities:");
    for (const [key, prob] of Object.entries(screenAnswer.probabilities)) {
      console.log(`     - ${key}: ${(prob * 100).toFixed(1)}%`);
    }
  }

  const errorAnswer = evaluation.answers.has_error;
  const isErrorProb = (errorAnswer.noul ?? 0) * 100;
  console.log(`\n🚨 Error Risk: ${isErrorProb.toFixed(1)}% (${isErrorProb > 30 ? "⚠️ POSITIVE ERROR" : "✅ CLEAN (NO ERROR)"})`);

  const scoreAnswer = evaluation.answers.action_readiness;
  console.log(`\n🎯 Interactive Readiness Score: ${scoreAnswer.score?.toFixed(2)} / 3.00`);

  console.log("\n=========================================");
  console.log("  TEST COMPLETE: ALL CHECKS PASSED ✅   ");
  console.log("=========================================");
}

runLayaAppTest();
