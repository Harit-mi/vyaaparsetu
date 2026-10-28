const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:52645";

const ROUTES = [
  { path: "/", expectedTitle: "VyapaarSetu" },
  { path: "/businesses", expectedTitle: "Opportunities" },
  { path: "/businesses/precision-auto-forgings-pune", expectedTitle: "Automotive" },
  { path: "/sell", expectedTitle: "Sell" },
  { path: "/sell/new", expectedTitle: "Mandate" },
  { path: "/buying-profile", expectedTitle: "Profile" },
  { path: "/dashboard/buyer", expectedTitle: "Buyer" },
  { path: "/dashboard/seller", expectedTitle: "Seller" },
  { path: "/dashboard/enquiries", expectedTitle: "Enquiries" },
  { path: "/messages", expectedTitle: "Conversations" },
  { path: "/account", expectedTitle: "Account" },
  { path: "/admin", expectedTitle: "Administrative Console" },
];

function fetchRoute(routePath) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${routePath}`;
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      })
      .on("error", (err) => reject(err));
  });
}

async function runTestSuite() {
  console.log("=================================================");
  console.log("  VyapaarSetu Automated E2E Verification Suite   ");
  console.log("=================================================");
  console.log(`Target: ${BASE_URL}\n`);

  let passedCount = 0;
  let failedCount = 0;

  for (const r of ROUTES) {
    process.stdout.write(`Testing Route: ${r.path.padEnd(45)} `);
    try {
      const res = await fetchRoute(r.path);
      if (res.statusCode === 200) {
        // Check for common error indicators in HTML
        if (res.body.includes("Internal Server Error") || res.body.includes("Unhandled Runtime Error")) {
          console.log("[FAIL] Server error in body");
          failedCount++;
        } else {
          console.log(`[PASS] 200 OK (${(res.body.length / 1024).toFixed(1)} KB)`);
          passedCount++;
        }
      } else {
        console.log(`[FAIL] Status ${res.statusCode}`);
        failedCount++;
      }
    } catch (err) {
      console.log(`[FAIL] ${err.message}`);
      failedCount++;
    }
  }

  console.log("\n-------------------------------------------------");
  console.log(`Summary: ${passedCount} Passed, ${failedCount} Failed`);
  console.log("-------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite();
