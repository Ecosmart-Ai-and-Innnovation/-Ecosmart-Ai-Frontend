import EcoChatAssistant from "./EcoChatAssistant";

export default function AssistantShell() {
  return (
    <div className="h-[calc(100vh-3rem)] overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
      <EcoChatAssistant />
    </div>
  );
}