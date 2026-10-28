const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:52645";
const TARGET_DIR = process.argv[2] || "test-artifacts/baseline";

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "narrow-360", width: 360, height: 800 },
];

const ROUTES = [
  { name: "home", path: "/" },
  { name: "browse", path: "/businesses" },
  { name: "detail", path: "/businesses/precision-auto-forgings-pune" },
  { name: "sell-overview", path: "/sell" },
  { name: "sell-wizard", path: "/sell/new" },
  { name: "buying-profile", path: "/buying-profile" },
  { name: "buyer-dashboard", path: "/dashboard/buyer" },
  { name: "seller-dashboard", path: "/dashboard/seller" },
  { name: "enquiries", path: "/dashboard/enquiries" },
  { name: "messages", path: "/messages" },
  { name: "account", path: "/account" },
  { name: "admin", path: "/admin" },
];

const outDir = path.resolve(__dirname, "..", TARGET_DIR);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`Capturing screenshots into ${outDir}...`);

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    // For every route, take desktop and mobile at minimum
    const filename = `${route.name}_${vp.name}.png`;
    const dest = path.join(outDir, filename);
    const url = `${BASE_URL}${route.path}`;
    
    const cmd = `"${CHROME_PATH}" --headless=new --user-data-dir=/tmp/chrome-test-profile --no-sandbox --disable-gpu --screenshot="${dest}" --window-size=${vp.width},${vp.height} --hide-scrollbars "${url}"`;
    try {
      execSync(cmd, { stdio: "ignore" });
      console.log(`Saved: ${filename}`);
    } catch (err) {
      console.error(`Failed ${filename}:`, err.message);
    }
  }
}

console.log("Screenshot capture complete.");
