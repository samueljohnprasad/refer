import { execSync } from "child_process";
import * as path from "path";

function audit() {
  const root = path.resolve(process.cwd());
  try {
    const output = execSync(`node scripts/validate-journey-microlearning-content.mjs "${root}"`, { stdio: "pipe" });
    console.log(output.toString());
  } catch (err: any) {
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    process.exit(1);
  }
}
audit();
