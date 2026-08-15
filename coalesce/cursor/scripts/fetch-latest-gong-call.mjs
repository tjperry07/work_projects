#!/usr/bin/env node
/**
 * One-off script to fetch the most recent Gong call and print a summary.
 * Loads GONG_ACCESS_KEY, GONG_SECRET_KEY, GONG_BASE_URL from .env in project root.
 */
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

const accessKey = process.env.GONG_ACCESS_KEY;
const secretKey = process.env.GONG_SECRET_KEY;
const baseUrl = (process.env.GONG_BASE_URL || "https://api.gong.io").replace(/\/$/, "");

if (!accessKey || !secretKey) {
  console.error("Missing GONG_ACCESS_KEY or GONG_SECRET_KEY in .env");
  process.exit(1);
}

const auth = `Basic ${Buffer.from(`${accessKey}:${secretKey}`).toString("base64")}`;

async function request(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Gong API ${res.status}: ${await res.text()}`);
  return res.json();
}

// Last 30 days
const to = new Date();
const from = new Date(to);
from.setDate(from.getDate() - 30);

const callsData = await request("/v2/calls/extensive", {
  filter: {
    fromDateTime: from.toISOString(),
    toDateTime: to.toISOString(),
  },
  contentSelector: {
    context: "Extended",
    exposedFields: {
      parties: true,
    },
  },
});

const calls =
  callsData.calls ??
  callsData.records?.calls ??
  (Array.isArray(callsData.records) ? callsData.records : []);
if (calls.length === 0) {
  console.log("No calls found in the last 30 days.");
  process.exit(0);
}

/** Gong extensive API nests title, started, duration, id under metaData. */
function callSurface(c) {
  const m = c.metaData ?? {};
  const rawId = c.id ?? m.id ?? c.callId ?? c.mediaId ?? m.mediaId;
  return {
    id: rawId != null && rawId !== "" ? String(rawId) : undefined,
    started: c.started ?? m.started,
    duration: c.duration ?? m.duration,
    title: c.title ?? m.title,
  };
}

// Sort by started desc to get most recent
calls.sort((a, b) => (callSurface(b).started || "").localeCompare(callSurface(a).started || ""));
const latest = calls[0];
const surf = callSurface(latest);
const callId = surf.id;
if (!callId) {
  console.error("No call ID in record. Keys:", Object.keys(latest));
  process.exit(1);
}

console.log("Most recent call:");
console.log(
  JSON.stringify(
    {
      id: callId,
      started: surf.started,
      duration: surf.duration,
      title: surf.title,
      participants: (latest.parties ?? []).map((p) => p.name || p.emailAddress),
    },
    null,
    2
  )
);

let transcriptData;
try {
  transcriptData = await request("/v2/calls/transcript", {
    filter: { callIds: [String(callId)] },
  });
} catch (err) {
  console.error("Transcript request failed:", err.message);
  console.log("\n--- Summary (no transcript) ---");
  console.log(`Call ID: ${callId}`);
  console.log(`Date: ${surf.started}`);
  console.log(
    `Participants: ${(latest.parties ?? []).map((p) => p.name || p.emailAddress).filter(Boolean).join(", ") || "N/A"}`
  );
  process.exit(0);
}
const transcripts = transcriptData.callTranscripts ?? [];
const transcript =
  transcripts.find((t) => String(t.callId) === String(callId)) ?? transcripts[0];

if (!transcript) {
  console.log("\nNo transcript available for this call.");
  process.exit(0);
}

const partyMap = new Map();
for (const p of latest.parties ?? []) {
  if (p.id != null && p.id !== "") {
    const pid = String(p.id);
    partyMap.set(pid, p.name || p.emailAddress || pid);
  }
}

const turns = (transcript.transcript ?? []).map((u) => {
  const sid =
    u.speakerId != null && u.speakerId !== "" ? String(u.speakerId) : "";
  const speaker =
    u.speakerName ?? (sid ? partyMap.get(sid) : undefined) ?? u.speakerId ?? "Unknown";
  const text = (u.sentences ?? []).map((s) => s.text ?? "").filter(Boolean).join(" ");
  return { speaker, text };
});

console.log("\n--- Transcript ---");
turns.forEach((t) => {
  if (t.text) console.log(`${t.speaker}: ${t.text}`);
});

// Summary
const fullText = turns.map((t) => t.text).filter(Boolean).join(" ");
console.log("\n--- Summary ---");
console.log(`Call ID: ${callId}`);
console.log(`Date: ${surf.started}`);
console.log(`Duration: ${surf.duration != null ? Math.round(surf.duration / 60) : "?"} min`);
console.log(`Participants: ${(latest.parties ?? []).map((p) => p.name || p.emailAddress).filter(Boolean).join(", ") || "N/A"}`);
console.log(`\nTranscript length: ${fullText.length} characters, ${turns.filter((t) => t.text).length} speaker turns`);
