// Fills src/utils/data/ads.json `slots` with dedicated AdSense ad unit IDs.
//
//   node scripts/set-ad-slots.mjs                      # read IDs from the AdSense Management API v2
//   node scripts/set-ad-slots.mjs --rail 1234567890 --in-article 2345678901 --multiplex 3456789012   # manual
//   Options: --file <ads.json>  --dry-run
//
// API mode calls accounts.adclients.adunits.list and matches ad units by display name.
// Token: env ADSENSE_ACCESS_TOKEN, else `gcloud auth application-default print-access-token`.
// The token is never printed or written. See the hand-off message for the OAuth steps.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const OLD_SLOT = "4893845087";
const UNIT_NAMES = { rail: "post-rail-300x600", inArticle: "post-in-article", multiplex: "post-multiplex" };
const DEFAULT_FILE = fileURLToPath(new URL("../src/utils/data/ads.json", import.meta.url));
const PUBLISHER = process.env.ADSENSE_ACCOUNT || "pub-8641089059133134";

export function slotsFromAdUnits(adUnits) {
  const out = {};
  for (const [key, displayName] of Object.entries(UNIT_NAMES)) {
    const hits = adUnits.filter((u) => u.displayName === displayName && (u.state ?? "ACTIVE") === "ACTIVE");
    if (hits.length !== 1) throw new Error(`ad unit "${displayName}": found ${hits.length}, expected 1`);
    out[key] = String(hits[0].name).split("/").pop();
  }
  return out;
}

export function validateSlots(slots) {
  for (const [k, v] of Object.entries(slots)) if (!/^\d{10}$/.test(v)) throw new Error(`slot ${k} is not 10 digits`);
  if (Object.values(slots).every((v) => v === OLD_SLOT)) throw new Error("all slots still equal the placeholder");
  return slots;
}

export function applySlots(ads, slots) {
  const { note, ...rest } = ads;
  return { ...rest, slots: { ...slots } };
}

function accessToken() {
  if (process.env.ADSENSE_ACCESS_TOKEN) return process.env.ADSENSE_ACCESS_TOKEN.trim();
  return execFileSync("gcloud", ["auth", "application-default", "print-access-token"], { encoding: "utf8" }).trim();
}

async function listAdUnits() {
  const token = accessToken();
  const base = `https://adsense.googleapis.com/v2/accounts/${PUBLISHER}/adclients/ca-${PUBLISHER}/adunits`;
  const units = [];
  let pageToken = "";
  do {
    const res = await fetch(`${base}?pageSize=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`AdSense API ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const body = await res.json();
    units.push(...(body.adUnits ?? []));
    pageToken = body.nextPageToken ?? "";
  } while (pageToken);
  return units;
}

async function main() {
  const args = process.argv.slice(2);
  const opt = (name) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const file = opt("--file") ?? DEFAULT_FILE;
  const manual = { rail: opt("--rail"), inArticle: opt("--in-article"), multiplex: opt("--multiplex") };
  const anyManual = Object.values(manual).some(Boolean);
  const slots = anyManual ? manual : slotsFromAdUnits(await listAdUnits());
  validateSlots(slots);
  const next = applySlots(JSON.parse(readFileSync(file, "utf8")), slots);
  if (!args.includes("--dry-run")) writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log(`${args.includes("--dry-run") ? "dry-run " : ""}slots: ${JSON.stringify(slots)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`set-ad-slots: ${e.message}`);
    process.exit(1);
  });
}
