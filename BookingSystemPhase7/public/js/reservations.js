// Reservations page: auth gate + CRUD against /api/reservations

import {
  initAuthUI,
  getTokenPayload,
  requireAuthOrBlockPage,
  logout,
} from "./auth-ui.js";

initAuthUI();
if (!requireAuthOrBlockPage()) {
  throw new Error("Authentication required");
}
window.logout = logout;

// ---------- DOM ----------
const form = document.getElementById("reservationForm");
const actions = document.getElementById("reservationActions");
const listEl = document.getElementById("reservationList");

const el = (id) => document.getElementById(id);

const BUTTON_BASE =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";
const BUTTON_ON = "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";
const BUTTON_OFF = "cursor-not-allowed opacity-50";

let formMode = "create";
let reservationsCache = [];
let createButton = null;
let clearButton = null;
let updateButton = null;
let deleteButton = null;
let originalSnapshot = null;

// ---------- Messages (aligned with form.js) ----------
function showFormMessage(type, message) {
  const node = el("formMessage");
  if (!node) return;
  node.className =
    "mt-6 rounded-2xl border px-4 py-3 text-sm whitespace-pre-line";
  node.classList.remove("hidden");
  if (type === "success") {
    node.classList.add("border-emerald-200", "bg-emerald-50", "text-emerald-900");
  } else if (type === "info") {
    node.classList.add("border-amber-200", "bg-amber-50", "text-amber-900");
  } else {
    node.classList.add("border-rose-200", "bg-rose-50", "text-rose-900");
  }
  node.textContent = message;
  node.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearFormMessage() {
  const node = el("formMessage");
  if (!node) return;
  node.textContent = "";
  node.classList.add("hidden");
}

// ---------- Time helpers ----------
function pad2(n) {
  return String(n).padStart(2, "0");
}

function isoToDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function datetimeLocalToIso(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

// ---------- Row field access (API returns snake_case) ----------
function rid(row) {
  return row.id;
}
function rResourceId(row) {
  return row.resource_id ?? row.resourceId;
}
function rUserId(row) {
  return row.user_id ?? row.userId;
}
function rStart(row) {
  return row.start_time ?? row.startTime;
}
function rEnd(row) {
  return row.end_time ?? row.endTime;
}

// ---------- Buttons ----------
function setButtonEnabled(btn, enabled) {
  if (!btn) return;
  btn.disabled = !enabled;
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);
  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else if (btn.value === "create" || btn.textContent === "Create") {
    btn.classList.add("hover:bg-brand-dark/80");
  } else if (btn.value === "update" || btn.textContent === "Update") {
    btn.classList.add("hover:bg-brand-dark/80");
  }
}

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  if (value) btn.value = value;
  btn.className = `${BUTTON_BASE} ${classes}`.trim();
  actions.appendChild(btn);
  return btn;
}

function renderActionButtons() {
  actions.innerHTML = "";
  if (formMode === "create") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ON,
    });
    clearButton = addButton({
      label: "Clear",
      type: "button",
      classes: BUTTON_ON,
    });
    setButtonEnabled(createButton, false);
    setButtonEnabled(clearButton, true);
    clearButton.addEventListener("click", () => {
      clearReservationForm();
      clearFormMessage();
    });
  } else {
    updateButton = addButton({
      label: "Update",
      type: "submit",
      value: "update",
      classes: BUTTON_ON,
    });
    deleteButton = addButton({
      label: "Delete",
      type: "submit",
      value: "delete",
      classes: BUTTON_ON,
    });
    setButtonEnabled(updateButton, false);
    setButtonEnabled(deleteButton, true);
  }
}

// ---------- Form state ----------
function getFormSnapshot() {
  return {
    resourceId: el("resourceId")?.value ?? "",
    userId: el("userId")?.value ?? "",
    startTime: el("startTime")?.value ?? "",
    endTime: el("endTime")?.value ?? "",
    note: el("note")?.value ?? "",
    status: el("status")?.value ?? "",
  };
}

function reservationPayloadFromForm() {
  const snap = getFormSnapshot();
  return {
    resourceId: Number(snap.resourceId),
    userId: Number(snap.userId),
    startTime: datetimeLocalToIso(snap.startTime),
    endTime: datetimeLocalToIso(snap.endTime),
    note: snap.note.trim() || null,
    status: snap.status || "active",
  };
}

function isFormStructurallyValid() {
  const snap = getFormSnapshot();
  const ridOk = snap.resourceId !== "" && Number(snap.resourceId) > 0;
  const uidOk = snap.userId !== "" && Number(snap.userId) > 0;
  const t0 = snap.startTime ? new Date(snap.startTime) : null;
  const t1 = snap.endTime ? new Date(snap.endTime) : null;
  const timesOk =
    t0 &&
    t1 &&
    !Number.isNaN(t0.getTime()) &&
    !Number.isNaN(t1.getTime()) &&
    t1 > t0;
  return ridOk && uidOk && timesOk;
}

function hasEditsFromOriginal() {
  if (!originalSnapshot) return false;
  const cur = getFormSnapshot();
  return (
    cur.resourceId !== originalSnapshot.resourceId ||
    cur.userId !== originalSnapshot.userId ||
    cur.startTime !== originalSnapshot.startTime ||
    cur.endTime !== originalSnapshot.endTime ||
    cur.note !== originalSnapshot.note ||
    cur.status !== originalSnapshot.status
  );
}

function refreshPrimaryButtonState() {
  const valid = isFormStructurallyValid();
  if (formMode === "create") {
    setButtonEnabled(createButton, valid);
  } else {
    setButtonEnabled(updateButton, valid && hasEditsFromOriginal());
  }
}

function clearReservationForm() {
  formMode = "create";
  originalSnapshot = null;
  el("reservationId").value = "";
  el("resourceId").value = "";
  el("userId").value = defaultUserIdFromToken();
  el("startTime").value = "";
  el("endTime").value = "";
  el("note").value = "";
  el("status").value = "active";
  highlightSelectedReservation(null);
  renderActionButtons();
  refreshPrimaryButtonState();
}

function defaultUserIdFromToken() {
  const p = getTokenPayload();
  return p?.sub != null ? String(p.sub) : "";
}

function fillFormFromRow(row) {
  el("reservationId").value = String(rid(row));
  el("resourceId").value = String(rResourceId(row));
  el("userId").value = String(rUserId(row));
  el("startTime").value = isoToDatetimeLocal(rStart(row));
  el("endTime").value = isoToDatetimeLocal(rEnd(row));
  el("note").value = row.note ?? "";
  el("status").value = row.status ?? "active";
  originalSnapshot = getFormSnapshot();
  formMode = "edit";
  renderActionButtons();
  highlightSelectedReservation(rid(row));
  refreshPrimaryButtonState();
}

function selectReservation(row) {
  clearFormMessage();
  fillFormFromRow(row);
}

// ---------- List UI ----------
function formatListWhen(startIso) {
  const d = new Date(startIso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function renderReservationList(rows) {
  if (!listEl) return;
  if (!rows.length) {
    listEl.innerHTML =
      '<p class="text-sm text-black/50">No reservations yet.</p>';
    return;
  }

  listEl.innerHTML = rows
    .map((r) => {
      const name = r.resource_name ?? `Resource #${rResourceId(r)}`;
      const email = r.user_email ?? "";
      const when = formatListWhen(rStart(r));
      return `
        <button
          type="button"
          data-reservation-id="${rid(r)}"
          class="w-full text-left rounded-2xl border border-black/10 bg-white px-4 py-3 transition hover:bg-black/5"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="font-semibold truncate">#${rid(r)} · ${escapeHtml(name)}</div>
              <div class="text-xs text-black/55 truncate">${escapeHtml(email)}</div>
              <div class="mt-1 text-xs text-black/50">${escapeHtml(when)} · ${escapeHtml(r.status ?? "")}</div>
            </div>
          </div>
        </button>`;
    })
    .join("");

  listEl.querySelectorAll("[data-reservation-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.reservationId);
      const row = reservationsCache.find((x) => Number(rid(x)) === id);
      if (row) selectReservation(row);
    });
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightSelectedReservation(id) {
  if (!listEl) return;
  listEl.querySelectorAll("[data-reservation-id]").forEach((node) => {
    const thisId = Number(node.dataset.reservationId);
    const on = id != null && thisId === Number(id);
    node.classList.toggle("ring-2", on);
    node.classList.toggle("ring-brand-blue/40", on);
    node.classList.toggle("bg-brand-blue/5", on);
  });
}

// ---------- API ----------
async function readResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  if (response.status === 204) return null;
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return { ok: false, error: "Invalid JSON response" };
    }
  }
  const text = await response.text().catch(() => "");
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text || "Non-JSON response" };
  }
}

async function loadReservations() {
  try {
    const res = await fetch("/api/reservations");
    const body = await readResponseBody(res);
    if (!res.ok) {
      console.error("Failed to load reservations:", res.status, body);
      reservationsCache = [];
      renderReservationList([]);
      return;
    }
    reservationsCache = Array.isArray(body.data) ? body.data : [];
    renderReservationList(reservationsCache);

    const currentId = el("reservationId")?.value
      ? Number(el("reservationId").value)
      : null;
    if (currentId) {
      const found = reservationsCache.find((x) => Number(rid(x)) === currentId);
      if (found) {
        fillFormFromRow(found);
      } else {
        clearReservationForm();
      }
    }
  } catch (err) {
    console.error(err);
    reservationsCache = [];
    renderReservationList([]);
  }
}

async function onSubmit(event) {
  event.preventDefault();
  const submitter = event.submitter;
  const actionValue = submitter?.value || "create";

  clearFormMessage();

  if (!isFormStructurallyValid()) {
    showFormMessage(
      "error",
      "Check your input: resource and user IDs must be positive numbers, and end time must be after start time."
    );
    return;
  }

  const payload = reservationPayloadFromForm();

  try {
    let method = "POST";
    let url = "/api/reservations";
    let body = JSON.stringify(payload);

    if (actionValue === "create") {
      method = "POST";
      url = "/api/reservations";
      body = JSON.stringify(payload);
    } else if (actionValue === "update") {
      const id = el("reservationId")?.value;
      if (!id) {
        showFormMessage("error", "Select a reservation from the list first.");
        return;
      }
      method = "PUT";
      url = `/api/reservations/${id}`;
      body = JSON.stringify(payload);
    } else if (actionValue === "delete") {
      const id = el("reservationId")?.value;
      if (!id) {
        showFormMessage("error", "Select a reservation from the list first.");
        return;
      }
      method = "DELETE";
      url = `/api/reservations/${id}`;
      body = undefined;
    } else {
      showFormMessage("error", `Unknown action: ${actionValue}`);
      return;
    }

    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body,
    });

    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      const msg =
        responseBody?.error ||
        `Request failed (${response.status}).`;
      showFormMessage("error", msg);
      return;
    }

    if (actionValue === "delete") {
      showFormMessage("success", "Reservation deleted successfully.");
    } else if (actionValue === "create") {
      showFormMessage("success", "Reservation created successfully.");
    } else {
      showFormMessage("success", "Reservation updated successfully.");
    }

    clearReservationForm();
    await loadReservations();
  } catch (err) {
    console.error(err);
    showFormMessage(
      "error",
      "Network error: could not reach the server. Check your connection and try again."
    );
  }
}

// ---------- Boot ----------
function wireInputs() {
  ["resourceId", "userId", "startTime", "endTime", "note", "status"].forEach(
    (id) => {
      const node = el(id);
      if (!node) return;
      node.addEventListener("input", () => refreshPrimaryButtonState());
      node.addEventListener("change", () => refreshPrimaryButtonState());
    }
  );
}

el("userId").value = defaultUserIdFromToken();
renderActionButtons();
wireInputs();
refreshPrimaryButtonState();

form.addEventListener("submit", onSubmit);
loadReservations();
