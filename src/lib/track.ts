import { supabase, supabaseConfigured } from "./supabase";

export type EventName =
  | "page_view"
  | "click_download_android"
  | "click_download_ios"
  | "click_download_app"
  | "click_driver"
  | "click_whatsapp"
  | "click_instagram"
  | "click_cta_hero"
  | "click_cta_passenger"
  | "click_cta_driver";

// ID de sessão anônimo: vive só no sessionStorage, sem cookies, sem IP, sem dados pessoais.
function sessionId(): string {
  let id = sessionStorage.getItem("77d_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("77d_sid", id);
  }
  return id;
}

// Fire-and-forget: nunca bloqueia a navegação do usuário.
export function track(event: EventName, button?: string) {
  if (!supabaseConfigured || !supabase) {
    console.debug("[track]", event, button ?? "");
    return;
  }
  supabase
    .from("analytics_events")
    .insert({
      event,
      button: button ?? null,
      session_id: sessionId(),
      path: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    })
    .then(({ error }) => {
      if (error) console.debug("[track] erro ao enviar", error.message);
    });
}
