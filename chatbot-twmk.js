(function(){
    "use strict";

    /* ── High-Fidelity Chatbot Styles ── */
    if(!document.getElementById('pd-chat-style')){
        const s = document.createElement('style');
        s.id = 'pd-chat-style';
        s.innerHTML = `
    :root {
        --cb-purple: #5FA8D3;
        --cb-deep: #3D7EA6;
        --cb-bg: rgba(255, 255, 255, 0.98);
        --cb-text: #1e1b4b;
    }
    
    #pd-chat-bubble {
        position:fixed; bottom:28px; right:28px; z-index:9999;
        width:64px; height:64px; border-radius:24px;
        background: linear-gradient(135deg, var(--cb-purple), var(--cb-deep));
        box-shadow: 0 12px 40px rgba(95, 168, 211, 0.4);
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: bubbleFloat 3s ease-in-out infinite;
    }
    #pd-chat-bubble:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 15px 50px rgba(95, 168, 211, 0.6); }
    #pd-chat-bubble.open { transform: scale(0.9) rotate(90deg); background: #1e1b4b; }
    #pd-chat-bubble .chat-x { display:none; color:#fff; font-size:24px; font-weight:300; }
    #pd-chat-bubble.open .chat-x { display:block; }
    #pd-chat-bubble.open .ai-svg { display:none; }
    
    #pd-chat-window {
        position:fixed; bottom:108px; right:28px; z-index:9998;
        width:420px; background: var(--cb-bg); backdrop-filter: blur(20px);
        border: 1px solid rgba(95, 168, 211, 0.1);
        box-shadow: 0 30px 90px rgba(30, 27, 75, 0.2);
        display:flex; flex-direction:column;
        opacity:0; pointer-events:none; transform:translateY(30px) scale(0.95);
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        max-height: min(720px, calc(100vh - 140px)); border-radius:32px; overflow: hidden;
    }
    #pd-chat-window.open { opacity:1; pointer-events:all; transform:translateY(0) scale(1); }
    
    .chat-hdr { background: linear-gradient(135deg, var(--cb-purple), var(--cb-deep)); padding:24px 28px; display:flex; align-items:center; gap:16px; flex-shrink:0; }
    .chat-avatar { width:48px; height:48px; border-radius:18px; background:#fff; display:flex; align-items:center; justify-content:center; box-shadow: 0 8px 16px rgba(0,0,0,0.1); flex-shrink:0; overflow: hidden; perspective: 1000px; }
    .chat-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); }
    .chat-avatar:hover img { transform: rotateY(20deg) rotateX(10deg) scale(1.15); filter: drop-shadow(0 12px 20px rgba(0,0,0,0.15)); }
    .chat-hdr-name { font-size:1.1rem; font-weight:800; color:#fff; font-family: 'Inter', sans-serif; letter-spacing: -0.02em; }
    .chat-hdr-status { font-size:0.75rem; color:rgba(255,255,255,0.8); display:flex; align-items:center; gap:8px; margin-top:2px; font-weight: 500; }
    .chat-sdot { width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow: 0 0 10px #22c55e; animation: pgr 2s infinite; }
    @keyframes pgr { 0%,100%{opacity:1; transform: scale(1);} 50%{opacity:0.6; transform: scale(1.2);} }

    .chat-hdr-right { margin-left:auto; display:flex; align-items:center; gap:10px; }
    #chat-voice-toggle {
        background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
        color: #fff; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase;
        padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;
    }
    #chat-voice-toggle.voice-on { background: #fff; color: var(--cb-purple); }

    /* ── Agent Selector ── */
    #agent-selector {
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        padding:32px 24px; gap:16px; flex:1;
    }
    #agent-selector .sel-title {
        font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;
        color:rgba(30,27,75,0.45); margin-bottom:4px;
    }
    .agent-sel-card {
        width:100%; padding:18px 20px; border-radius:18px; border:1.5px solid rgba(95,168,211,0.15);
        background:#fff; cursor:pointer; display:flex; align-items:center; gap:16px;
        transition:all 0.2s; box-shadow:0 2px 12px rgba(95,168,211,0.06);
    }
    .agent-sel-card:hover { border-color:rgba(95,168,211,0.5); box-shadow:0 6px 24px rgba(95,168,211,0.14); transform:translateY(-2px); }
    .agent-sel-card img { width:48px; height:48px; border-radius:14px; object-fit:cover; flex-shrink:0; }
    .agent-sel-card .asc-name { font-size:1rem; font-weight:800; color:#1e1b4b; font-family:'Inter',sans-serif; }
    .agent-sel-card .asc-role { font-size:0.78rem; color:rgba(30,27,75,0.55); margin-top:2px; font-weight:500; }

    /* ── Switch Agent Button (header) ── */
    #chat-switch-btn {
        background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2);
        color:#fff; border-radius:12px; font-size:10px; font-weight:800; text-transform:uppercase;
        padding:8px 12px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s;
        white-space:nowrap;
    }
    #chat-switch-btn:hover { background:rgba(255,255,255,0.25); }

    /* ── Drew Vapi Panel ── */
    #drew-panel {
        display:none; flex-direction:column; align-items:center; justify-content:center;
        flex:1; padding:32px 24px; gap:20px; text-align:center;
    }
    #drew-panel.active { display:flex; }
    #drew-soundwave {
        display:flex; align-items:flex-end; gap:4px; height:40px; justify-content:center;
    }
    #drew-soundwave span {
        width:5px; border-radius:3px; background:linear-gradient(135deg,#5FA8D3,#3D7EA6);
        height:8px; transition:height 0.15s;
        animation:none;
    }
    #drew-soundwave.speaking span:nth-child(1){animation:drewWave 0.8s 0.0s infinite ease-in-out;}
    #drew-soundwave.speaking span:nth-child(2){animation:drewWave 0.8s 0.1s infinite ease-in-out;}
    #drew-soundwave.speaking span:nth-child(3){animation:drewWave 0.8s 0.2s infinite ease-in-out;}
    #drew-soundwave.speaking span:nth-child(4){animation:drewWave 0.8s 0.15s infinite ease-in-out;}
    #drew-soundwave.speaking span:nth-child(5){animation:drewWave 0.8s 0.05s infinite ease-in-out;}
    @keyframes drewWave { 0%,100%{height:8px;} 50%{height:32px;} }
    #drew-status { font-size:0.85rem; font-weight:600; color:rgba(30,27,75,0.6); font-family:'Inter',sans-serif; }
    #drew-btn-start {
        background:linear-gradient(135deg,#5FA8D3,#3D7EA6); color:#fff; border:none;
        border-radius:50px; padding:14px 32px; font-size:0.9rem; font-weight:800;
        font-family:'Inter',sans-serif; cursor:pointer; letter-spacing:0.04em;
        box-shadow:0 8px 24px rgba(95,168,211,0.35); transition:all 0.2s;
    }
    #drew-btn-start:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(95,168,211,0.45); }
    #drew-btn-end {
        display:none; background:#fff; color:#ef4444; border:1.5px solid rgba(239,68,68,0.3);
        border-radius:50px; padding:12px 28px; font-size:0.9rem; font-weight:800;
        font-family:'Inter',sans-serif; cursor:pointer; letter-spacing:0.04em; transition:all 0.2s;
    }
    #drew-btn-end.visible { display:block; }

    #chat-back-bar { display:none; align-items:center; gap:10px; padding:12px 24px; border-bottom:1px solid rgba(0,0,0,0.03); background:rgba(95, 168, 211, 0.03); cursor:pointer; flex-shrink:0; }
    #chat-back-bar.vis { display:flex; }
    #chat-back-bar span { font-size:11px; font-weight:800; text-transform:uppercase; color:var(--cb-purple); letter-spacing: 0.05em; }
    
    .chat-msgs { flex:1; overflow-y:auto; padding:28px; display:flex; flex-direction:column; gap:16px; min-height:60px; max-height:480px; -webkit-overflow-scrolling: touch; }
    .chat-msgs::-webkit-scrollbar { width:4px; }
    .chat-msgs::-webkit-scrollbar-thumb { background: rgba(95, 168, 211, 0.1); border-radius:10px; }
    
    .cmsg { max-width:85%; font-size:0.95rem; line-height:1.6; padding:14px 20px; border-radius:24px; font-family: 'Inter', sans-serif; position: relative; }
    .cmsg.bot { background:#EAF4FC; color: var(--cb-text); align-self:flex-start; border-bottom-left-radius: 4px; }
    .cmsg.usr { background: var(--cb-purple); color:#fff; align-self:flex-end; border-bottom-right-radius: 4px; box-shadow: 0 4px 15px rgba(95, 168, 211, 0.2); font-weight: 500; }
    
    /* Media/Link Style */
    .cmsg a { color: inherit; text-decoration: underline; font-weight: 700; }
    .cmsg img { max-width: 100%; border-radius: 12px; margin-top: 8px; cursor: pointer; }
    .chat-audio-msg { display: flex; align-items: center; gap: 10px; }
    .voice-player { display: flex; align-items: center; gap: 10px; min-width: 190px; }
    .vp-btn { width: 30px; height: 30px; border-radius: 50%; border: none; flex-shrink: 0; cursor: pointer;
        display: flex; align-items: center; justify-content: center; transition: transform 0.15s; }
    .vp-btn:active { transform: scale(0.9); }
    .cmsg.usr .vp-btn { background: rgba(255,255,255,0.22); color: #fff; }
    .cmsg.bot .vp-btn { background: var(--cb-purple); color: #fff; }
    .vp-track { flex: 1; height: 3px; border-radius: 3px; cursor: pointer; position: relative; }
    .cmsg.usr .vp-track { background: rgba(255,255,255,0.28); }
    .cmsg.bot .vp-track { background: rgba(95, 168, 211, 0.18); }
    .vp-fill { height: 100%; border-radius: 3px; width: 0%; pointer-events: none; }
    .cmsg.usr .vp-fill { background: #fff; }
    .cmsg.bot .vp-fill { background: var(--cb-purple); }
    .vp-time { font-size: 0.7rem; font-weight: 600; opacity: 0.75; flex-shrink: 0; min-width: 32px; font-variant-numeric: tabular-nums; }
    
    /* Typing dots */
    .cmsg.typing { background:#f3f4f6; align-self:flex-start; border-radius:24px 24px 24px 4px; padding:18px 24px; }
    .typing-dots { display:flex; gap:6px; }
    .typing-dots span { width:8px; height:8px; border-radius:50%; background:var(--cb-purple); opacity: 0.3; animation: tdot 1.4s infinite; }
    .typing-dots span:nth-child(2){animation-delay:0.2s;}
    .typing-dots span:nth-child(3){animation-delay:0.4s;}
    @keyframes tdot{0%,60%,100%{transform:translateY(0); opacity: 0.3;}30%{transform:translateY(-8px); opacity: 1;}}

    .chat-qr { padding:0 28px 24px; display:flex; flex-wrap:wrap; gap:8px; flex-shrink:0; }
    .qrb { 
        font-size:0.76rem; font-weight:600; padding:9px 14px; border:1px solid rgba(95, 168, 211, 0.2); 
        background:#fff; cursor:pointer; color:var(--cb-purple); border-radius:14px; 
        transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        font-family: 'Inter', sans-serif;
        display: flex; align-items: center; gap: 7px;
        flex-shrink: 0;
    }
    .qrb svg { width: 14px; height: 14px; flex-shrink: 0; stroke-width: 2.5; }
    .qrb:hover { background:var(--cb-purple); color:#fff; border-color:var(--cb-purple); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(95, 168, 211, 0.2); }
    .qrb.wa { background: #22c55e; color:#fff; border-color:#22c55e; display:inline-flex; align-items:center; gap:8px; }
    
    .chat-inp-row { display:flex; border-top:1px solid rgba(0,0,0,0.05); padding:10px 12px; background:#fff; align-items:center; gap:4px; position: relative; }
    #chat-inp { flex:1; min-width:0; border:none; background:#f3f4f6; padding:10px 14px; font-size:0.9rem; border-radius:14px; outline:none; transition: all 0.2s; font-family: 'Inter', sans-serif; }
    #chat-inp:focus { background: #fff; box-shadow: inset 0 0 0 2px rgba(95, 168, 211, 0.1); }
    
    .chat-tool-btn { 
        width:36px; height:36px; display:flex; align-items:center; justify-content:center; 
        border-radius:12px; cursor:pointer; transition:all 0.2s; border:none; background: transparent; color: #64748b;
        flex-shrink: 0;
    }
    .chat-tool-btn:hover { color: var(--cb-purple); background: #f3f4f6; }
    #chat-mic.recording { background: #fee2e2; color: #ef4444; animation: cbPulse 1.5s infinite; }
    #chat-timer { display:none; font-size:12px; font-weight:700; color:#ef4444; margin-right:4px; font-family:monospace; }
    #chat-timer.vis { display:inline; }
    #chat-snd { color: var(--cb-purple); }
    #chat-snd:hover { transform: scale(1.1); }
    
    #emoji-picker {
        position: absolute; bottom: 70px; right: 16px; background: #fff; border: 1px solid #e2e8f0;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 16px; display: none; grid-template-columns: repeat(6, 1fr);
        padding: 10px; gap: 8px; z-index: 10000;
    }
    #emoji-picker.open { display: grid; }
    .emoji-item { cursor: pointer; font-size: 20px; transition: transform 0.1s; }
    .emoji-item:hover { transform: scale(1.3); }

    @keyframes bubbleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes cbPulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }

    .cpkg-grid { display:flex; flex-direction:column; gap:12px; width:100%; align-self:stretch; }
    .cpkg-card { background:#fff; border:1px solid rgba(95, 168, 211, 0.1); padding:20px; cursor:pointer; transition:all 0.3s; border-radius:20px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    .cpkg-card:hover { border-color:var(--cb-purple); background:rgba(95, 168, 211, 0.02); transform: translateY(-3px); box-shadow: 0 12px 24px rgba(95, 168, 211, 0.08); }
    .cpkg-name { font-size:1rem; font-weight:800; color:var(--cb-purple); letter-spacing:-0.01em; }
    .cpkg-price { font-size:0.85rem; font-weight:700; color:#64748b; margin-top:4px; }
    .cpkg-desc { font-size:0.85rem; color:#475569; margin-top:12px; line-height:1.6; }

    @media(max-width:520px){
        #pd-chat-window { width:calc(100vw - 32px); right:16px; bottom:100px; border-radius:24px; max-height: calc(100vh - 130px); }
    }
    `;
        document.head.appendChild(s);
    }
    
    // Inject Structure
    if(!document.getElementById('pd-chat-bubble')){
        const c = document.createElement('div');
        c.innerHTML = `
    <div id="pd-chat-bubble" onclick="toggleChat()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ai-svg" style="width:30px; height:30px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2z"></path></svg>
        <span class="chat-x">✕</span>
    </div>
    <div id="pd-chat-window">
        <div class="chat-hdr">
            <div class="chat-avatar">
                <img src="https://raw.githubusercontent.com/priscadezigns9/thewaymadeknown/main/assets/twmk_tree_logo.png" alt="TWMK">
            </div>
            <div style="flex:1">
                <div class="chat-hdr-name">Sierra</div>
                <div class="chat-hdr-status"><div class="chat-sdot"></div> Active Agent</div>
            </div>
            <div class="chat-hdr-right">
                <button id="chat-switch-btn" onclick="switchAgent()" title="Switch Agent">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    <span id="switch-btn-label">DREW</span>
                </button>
                <button id="chat-voice-toggle" onclick="toggleVoice()">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M11 5L6 9H2v6h4l5 4V5z"></path></svg>
                    AUDIO
                </button>
            </div>
        </div>
        <!-- Agent Selector (shown on first open) -->
        <div id="agent-selector">
            <div class="sel-title">Who would you like to speak with?</div>
            <div class="agent-sel-card" onclick="selectAgent('sierra')">
                <img src="https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/sierra_headshot.jpg" alt="Sierra" onerror="this.src='https://raw.githubusercontent.com/priscadezigns9/thewaymadeknown/main/assets/twmk_tree_logo.png'">
                <div>
                    <div class="asc-name">Sierra</div>
                    <div class="asc-role">Customer Relations — Chat</div>
                </div>
            </div>
            <div class="agent-sel-card" onclick="selectAgent('drew')">
                <img src="https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/drew_headshot.jpg" alt="Drew" onerror="this.src='https://raw.githubusercontent.com/priscadezigns9/thewaymadeknown/main/assets/twmk_tree_logo.png'">
                <div>
                    <div class="asc-name">Drew</div>
                    <div class="asc-role">Sales Representative — Voice</div>
                </div>
            </div>
        </div>
        <!-- Drew Vapi Voice Panel -->
        <div id="drew-panel">
            <img src="https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/drew_headshot.jpg" alt="Drew" style="width:72px;height:72px;border-radius:20px;object-fit:cover;box-shadow:0 8px 24px rgba(95,168,211,0.25);" onerror="this.src='https://raw.githubusercontent.com/priscadezigns9/thewaymadeknown/main/assets/twmk_tree_logo.png'">
            <div style="font-size:1.1rem;font-weight:800;color:#1e1b4b;font-family:'Inter',sans-serif;">Drew</div>
            <div id="drew-soundwave"><span></span><span></span><span></span><span></span><span></span></div>
            <div id="drew-status">Ready to connect</div>
            <button id="drew-btn-start" onclick="drewStartCall()">🎙 Start Call</button>
            <button id="drew-btn-end" onclick="drewEndCall()">End Call</button>
            <button id="drew-btn-text" onclick="enterDrewText()" style="margin-top:10px;background:none;border:none;color:var(--cb-purple);font-weight:700;font-size:0.85rem;cursor:pointer;display:flex;align-items:center;gap:6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.5 8.5 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Text Instead
            </button>
        </div>
        <div id="chat-back-bar" onclick="chatBack()"><span>← Return</span></div>
        <div class="chat-msgs" id="chat-msgs"></div>
        <div class="chat-qr" id="chat-qr"></div>
        <div id="emoji-picker"></div>
        <div class="chat-inp-row">
            <button class="chat-tool-btn" onclick="document.getElementById('chat-file-inp').click()" title="Attach File">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
            <input type="file" id="chat-file-inp" style="display:none" onchange="handleChatFile(this.files)" />
            <input type="text" id="chat-inp" placeholder="Ask anything..." onkeydown="if(event.key==='Enter')chatSend()" />
            <button class="chat-tool-btn" onclick="toggleEmojis()" title="Emojis">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </button>
            <button id="chat-mic" class="chat-tool-btn" onclick="toggleMic()" title="Voice Note">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            </button>
            <span id="chat-timer">00:00</span>
            <button id="chat-snd" class="chat-tool-btn" onclick="chatSend()">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
        </div>
    </div>`;
        document.body.appendChild(c);
    // ── Persistent Guidance Buttons ──
    if(!document.getElementById('pd-roadmap-bar')){
        const r = document.createElement('div');
        r.id = 'pd-roadmap-bar';
        r.style = 'padding:0 28px 12px; display:flex; flex-wrap:wrap; gap:10px; flex-shrink:0;';
        r.innerHTML = `
            <style>
                #pd-roadmap-bar::-webkit-scrollbar { display:none; }
                .road-btn { 
                    font-size:0.76rem; font-weight:600; padding:9px 14px; border:1px solid rgba(95, 168, 211, 0.2); 
                    background:#fff; cursor:pointer; color:var(--cb-purple); border-radius:14px; 
                    transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    font-family: 'Inter', sans-serif;
                    display: flex; align-items: center; gap: 7px;
                    flex-shrink: 0;
                }
                .road-btn svg { width: 14px; height: 14px; flex-shrink: 0; }
                .road-btn:hover { background:var(--cb-purple); color:#fff; border-color:var(--cb-purple); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(95, 168, 211, 0.2); }
                @media (max-width: 520px) {
                    #pd-roadmap-bar { padding-left:16px !important; padding-right:16px !important; gap:6px !important; }
                    .road-btn { font-size:0.72rem; padding:9px 12px; gap:5px; border-radius:12px; }
                    .road-btn svg { width:13px; height:13px; }
                }
                @media (max-width: 340px) {
                    #pd-roadmap-bar { padding-left:10px !important; padding-right:10px !important; gap:4px !important; }
                    .road-btn { font-size:0.64rem; padding:8px 9px; gap:4px; }
                    .road-btn svg { width:12px; height:12px; }
                }
            </style>
            <button class="road-btn" onclick="window.open('https://driveevolve.com', '_blank')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>
                <span>Evolve</span>
            </button>
            <button class="road-btn" onclick="window.open('https://thewaymadeknown.com', '_blank')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                <span>TWMK</span>
            </button>
            <button class="road-btn" onclick="window.open('https://priscadezigns.org/audit/', '_blank')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
                <span>Request Audit</span>
            </button>
        `;
        const msgs = document.getElementById('chat-msgs');
        msgs.parentNode.insertBefore(r, document.querySelector('.chat-inp-row'));
    }

        
        // Populate Emojis
        const ep = document.getElementById('emoji-picker');
        ['👋','🔥','🚀','💎','✨','✅','🙏','💯','💡','📱','💻','🎨','💼','⚡','🔋','🛠️','📣','💬'].forEach(e => {
            const span = document.createElement('span');
            span.className = 'emoji-item';
            span.innerText = e;
            span.onclick = () => {
                const inp = document.getElementById('chat-inp');
                inp.value += e;
                inp.focus();
                toggleEmojis();
            };
            ep.appendChild(span);
        });
    }

const WA="https://wa.me/18683424101";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhemhkbnF6YXFwcWNyYWxtdGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzE5NjYsImV4cCI6MjA5Mzc0Nzk2Nn0.uTyw31uWTNOTV5-HzNpm46vpAJABAsHLMzW-sYOkRhc";
const SB_URL = "https://sazhdnqzaqpqcralmthh.supabase.co";

const SYSTEM_PROMPT = "Your name is Sierra. You are the Prisca Dezigns AI assistant — the sales and support agent for Prisca Dezigns, a premium digital agency based in Trinidad & Tobago. If a user asks your name, or greets you by name, or asks what you are, tell them you're Sierra. You are also literally the AI Employee behind the 'AI Customer Relations' department listed under AI Employees on this site -- if someone asks what AI Customer Relations does, you can honestly say 'that's me' and describe yourself.\n\nYour personality: warm, professional, sharp, and conversational. You speak like a knowledgeable friend who happens to be a web design expert — never robotic, never generic, never pushy. Keep replies concise (2–4 sentences max unless detail is needed). Always ask a follow-up question to keep the conversation moving.\n\nATTACHMENT HANDLING:\nYou DO accept documents and files -- there is a paperclip/attach button in the chat for exactly this. When a user asks to send a document, image, or file, tell them to use the attach button, never say you lack the capability to receive files. When a user uploads an image, you will receive it as actual image content you can see — describe or respond to what is genuinely in it. When a user uploads a voice note, you will only receive a text transcript if one was successfully captured; if a message tells you no transcript is available, say so honestly and ask the user to type their question instead. When a user uploads a general file/document, it has already been saved securely and logged for the team -- confirm this to the user and ask what they need next, rather than saying you cannot handle it. Never claim to have heard or seen something you were not actually given.\n\nABOUT PRISCA DEZIGNS:\nPrisca Dezigns is an enterprise AI and digital transformation partner based in Trinidad & Tobago, founded by Priscilla Narine. The agency combines high-fidelity websites, AI automation (chatbots, WhatsApp automation, email automation, voice agents, lead qualification and routing), and brand architecture — helping businesses modernize how they operate, not just how they look online. Every project is professionally built — no drag-and-drop builders. Clients provide content; the team handles everything else.\n\nBRAND IDENTITY:\nPrisca Dezigns' primary brand color is a rich purple (#7c3aed), paired with a warm ivory/cream background (#FFFFF0). If asked about the brand's colors, favorite color, or visual identity, answer directly and confidently using this — purple is the signature color across the website, logo, and all client-facing materials.\n\nSERVICES & PRICING (always quote these exact figures):\n- 1-Day Custom Site: $200 setup + $50/mo maintenance (Live in 24hrs). Includes 1 revision. Any additional add-on is $50 USD each.\n- Custom Web Packages: Starter ($297), Growth ($597), Trusted ($1,200), Custom (Bespoke)\n- E-Commerce: E-Starter ($497), E-Growth ($1,497), E-Trusted ($2,500) -- setup fee only, no separate monthly hosting fee\n- Maintenance: $99/mo -- monthly updates, security monitoring, performance checks, 1 content edit/mo, priority support (E-Commerce Maintenance: $199.99/mo)\n- Template Site: $149.99 + $19.99/mo · Micro Store: $249.99 + $34.99/mo · Agency & Artist (Premium 3D): $299.99 + $19.99/mo\n- Template Add-Ons: Copywriting ($49.99 + $4.99/update) · AI Chatbot ($349.99 + $49.99/mo)\n- Voice Agents: Starting at $8,000 setup + $900/mo (Add-on: $500 setup + $50/mo)\n- AI Consultancy at Prisca Dezigns covers two umbrellas -- AI Employees and AI Voice -- each with its own dedicated pricing page:\n  - AI EMPLOYEES (/aidata/) -- Starter (From $1,250 + $599/mo), Growth (From $2,000 + $899/mo), Enterprise (From $4,000 + $1,499/mo). This was previously called 'AI Data' -- if a user says 'AI Data', they mean this. AI Employees is organised into 9 departments (NOT a flat product, each is its own entry on the homepage globe navigation), and each department is represented by ONE named AI Employee persona: AI Administration -- Alana, Cross-Department Admin Coordinator (inbox triage, scheduling, follow-ups, connects to other AI Employees for one unified daily brief); AI Human Resources -- Alice, AI Human Resources Officer (onboarding, leave tracking, application screening, TT payroll compliance); AI Finance -- Jamal, AI Finance Officer (reconciliation, discrepancy detection, automated monthly reports); AI Health & Safety -- Luna, AI Health & Safety Officer (incident monitoring, toolbox talks, hazard logs, compliance audits); AI Information Technology -- Sunil, AI IT Support Officer (help desk, data quality validation, 24/7 systems monitoring); AI Marketing -- Dean, AI Marketing Data Administrator (marketing data management, lead scoring, campaign performance reporting); AI Quality Assurance -- Zara, AI QA/QC Officer (inspection logging, non-conformance tracking, continuous compliance monitoring); AI Production -- Chan, AI Production Officer (output logging, inventory tracking, preventive maintenance scheduling, production trend analysis); AI Customer Relations -- Sierra, handles WhatsApp/email/website chat around the clock, qualifies leads, books appointments, follows up automatically (this was previously marketed separately as 'AI Channel', now folded in as a department here, same tier pricing as every other department). When discussing a department, use the employee's name naturally (e.g. 'Alana handles that' rather than just 'the Administration department'). All 9 departments share the same tier pricing above. Optional add-ons: Starter tier can add Custom Export Formats, Automated Report Delivery, Anomaly & Error Alerts; Growth tier adds those plus CRM & Database Sync, Multi-Source Data Intake, Analytics Dashboard; Enterprise includes ALL add-ons as standard.\n  - AI VOICE (/aivoice/) -- Starter (From $1,500 + $499/mo), Growth (From $2,500 + $899/mo), Enterprise (From $5,000 + $1,699/mo). A separate umbrella from AI Employees, not a department within it. Specific AI employees (flat list, not departmentalised): AI Receptionist, AI Customer Service, AI Sales Rep, AI Scheduler, AI Survey & Feedback, AI Accounts Receivable, AI HSE Assistant. Optional add-ons included at Starter: WhatsApp & SMS Follow-Up, Custom Voice & Persona, Multi-Language Support; Growth adds CRM Integration, Call Analytics Dashboard; Enterprise includes ALL add-ons as standard, including Outbound Calling Campaigns. AI Voice Feature Upgrades (can be added to ANY package at any time, with their own individual pricing): CRM Integration (+$300 setup +$50/mo), Outbound Calling Campaigns (+$400 setup +$75/mo), WhatsApp & SMS Follow-Up (+$200 setup +$30/mo), Custom Voice & Persona (+$250 setup +$30/mo), Call Analytics Dashboard (+$350 setup +$50/mo), Multi-Language Support (+$300 setup +$40/mo).\n  When a user asks about a specific role (e.g. 'AI receptionist' or 'data entry automation'), name the correct umbrella it belongs to and quote that umbrella's tier pricing -- the tier pricing (Starter/Growth/Enterprise) represents the complexity of the agent/employee chosen, not a separate per-role price list. Both umbrellas include an AI Management Plan (platform monitoring, performance optimization, workflow maintenance, updates, and support). All prices are starting prices -- final implementation and monthly pricing are confirmed following a Business Process Audit tailored to the client's actual volume and needs.\n\nMANDATORY: whenever a user asks about ANY automation product -- AI Consultancy in general, any AI Employees department (including AI Customer Relations), or AI Voice -- always give them two things in the same reply: the audit link (https://priscadezigns.org/audit/, a free self-service form that produces a personalised recommendation) and the WhatsApp number (1-868-342-4101). This applies no matter how the question arrives -- typed message or voice note. Frame it naturally, e.g. 'You can start your free audit at priscadezigns.org/audit to get a personalised recommendation, or message us directly on WhatsApp at 1-868-342-4101.'\n\nABOUT THE WAY MADE KNOWN (this website, thewaymadeknown.com):\nThe Way Made Known (TWMK) is a Christian ministry and charitable initiative -- global biblical apologetics, gospel mission, and analytical faith. It is founded by the same person behind Prisca Dezigns, and funded in part through a portion of Prisca Dezigns' agency profits. Anchored in San Fernando, Trinidad & Tobago.\n\nCORE THEME: Acts 17:23 -- 'What therefore you worship as unknown, this I proclaim to you.' Like Paul at the altar to the 'Unknown God', TWMK meets people wherever they are in their spiritual search, with respect rather than condescension -- honoring the journey, not standing apart from it.\n\nSITE SECTIONS: The Mission; Visual Bible Library & Bookstore (illustrated/visual scripture resources and books); The Proclamation (an interactive 'Neural Proclamation' tool where a user submits a scripture or question for analytical synthesis); Donate (supports the foundation's work); a Blog organised into categories like Visions & Dreams, Revelations, My Testimony, Analytical Faith, and Excellence Editorial.\n\nREAL BLOG POSTS currently on the site (mention these by title if relevant, and direct users to thewaymadeknown.com/blog/ for the full library):\n- 'Analytical Faith: Evidence for Biblical Narratives and Archaeological Stewardship in 2026' (Excellence Editorial) -- archaeological science as evidence-based defense of biblical narratives.\n- 'Analytical Thinking in a World of Emotion' (Visions & Dreams) -- questioning faith analytically rather than following leaders blindly.\n- 'From a Mustard Seed to a Mustard Tree' (Visions & Dreams) -- faith isn't meant to stay small; it's meant to grow into something that shelters others.\n- 'The Myth of \"Realness\": Why High-Fidelity Faith Requires a Higher Standard' (Analytical Faith) -- critiques Caribbean culture's use of 'realness' as an excuse for lack of filter or accountability.\n- 'When Scales Fall from the Eyes' (My Testimony) -- the founder's personal testimony: raised in church but not truly converted until a confrontation with hard questions in 2015 while at university.\n- 'The Heartbeat of the Empire' (Visions & Dreams) -- on how Prisca Dezigns and The Way Made Known share one underlying purpose: excellence in service of a deeper, grace-driven mission.\n- 'Walking in Eden Now' (Revelations) -- a realized-eschatology reflection: the victory of Christ means paradise is already available now, not only in the future.\n\nIf a user asks something you don't have specific content for (e.g. detailed donation logistics, book titles in the Visual Bible Library, or specifics of the Neural Proclamation tool), be honest that you don't have that detail and point them to the relevant section of thewaymadeknown.com or to WhatsApp for a direct answer, rather than guessing.\n\nEVOLVE MOBILITY (driveevolve.com):\nStrategic digital partner. EVOLVE Mobility Limited is transforming the Caribbean's roads through green mobility, based in Trinidad & Tobago. Phone: +1-868-387-6937 (also \\\"EVPOWER\\\"). Email: info@driveevolve.com. WhatsApp: https://wa.me/18683876937\n\nBrands carried: BYD (est. 1994, EVs & battery innovation leader), Denza (2010, premium NEV brand under BYD, luxury design), Dongfeng (1969, one of China's largest automakers, EV sub-brand Dongfeng Nammi), GAC (1997, EVs & global expansion), iCAUR (2023, under Chery Group, youthful urban/light off-road EVs), JuneYao (1991, diverse Chinese holding group), Leapmotor (2015, smart EVs with autonomous driving tech), Wuling (1982, affordable mini EVs & utility vehicles).\n\nFeatured vehicles (current lineup, prices in TTD):\n- GAC Aion ES: TT$195,000 (from TT$2,500/mo), 440km range, 0-100km/h in 12.1s, 7-8hr AC charge, ~TT$22 to charge\n- Leapmotor C10: TT$255,000, 480km range, 0-100km/h in 7.5s, 9-10hr AC charge\n- BYD Sealion 7 (Premium) RWD: TT$360,000, 560km range, 0-100km/h in 6.7s, 8-9hr AC charge\n- GAC Aion V: TT$260,000, 600km range, 0-100km/h in 7.7s, 8-9hr AC charge\nMany vehicles are available from as low as TT$2,500/mo on financing — always mention this option since it makes EVs far more accessible than the full sticker price suggests. Full current inventory: driveevolve.com/vehicles.\n\nWhy choose EVOLVE: future-ready EVs from leading Chinese manufacturers; servicing & software updates handled by SBCS University (their official Hybrid+EV service partner); genuine parts supplied directly by EVOLVE; complete customer support before and after purchase.\n\nCharging: EVOLVE operates a growing charging network in Trinidad & Tobago, including a station at Ramps Cunupia (51A Railway Road, Cunupia), Type 2 connector, up to 100kW. Full map at driveevolve.com/charging.\n\nBooking: customers can book a showroom viewing at driveevolve.com/book-viewing or via WhatsApp. Payment types include full purchase and financing/lease options.\n\nFLEET ASSESSMENT & FLEET TRANSITION (B2B service, run jointly by Prisca Dezigns and EVOLVE):\nFor businesses in Trinidad & Tobago/the Caribbean that operate a vehicle fleet (delivery, logistics, corporate, courier, construction, oil & gas, etc.), Prisca Dezigns and EVOLVE offer a fleet EV transition service:\n- Free Fleet Assessment: a free site visit to assess the client's current fleet and evaluate EV transition suitability. Free charging equipment is also offered with qualifying purchases.\n- Fleet Transition process: (1) the business shares its fleet needs (executive sedan, field SUV, crew MPV, or a mix) via hello@priscadezigns.org or WhatsApp +1-868-342-4101; (2) Prisca Dezigns makes a direct introduction to EVOLVE Mobility's sales team, who confirm live pricing, availability, and fleet deal structure; (3) EVOLVE structures the fleet agreement (full purchase or bank-financed) and manages all documentation, registration, and delivery logistics, with Prisca Dezigns remaining available as liaison throughout.\n- Recommended starting point for larger fleets: a pilot fleet of 2-3 vehicles (e.g. one executive sedan, one SUV for field teams) to gather measurable cost data within 90 days before a full rollout -- phased/flexible acquisition avoids one large capital outlay.\n- Value case: switching to electric can cut fuel costs by up to 70%, with no oil changes, fewer brake replacements, and no transmission servicing. Fleet vehicles charge overnight (a fleet of 5 vehicles adds roughly TT$100/night to the electricity bill) so they leave fully charged every morning -- no fuel runs, no petrol station queues, no idle time during operating hours, and no need to stop at a public station at odd hours (a real security upgrade for staff). Every EVOLVE vehicle carries an 8-year manufacturer battery warranty, with battery degradation averaging just 2.3%/year (over 81% capacity remaining after 8 years).\n- This is a distinct lead type from general chatbot/web leads -- if a user mentions a fleet, multiple vehicles, or a vehicle-dependent business, treat it as a Fleet enquiry and route them toward WhatsApp for the team to follow up.\n\nRULES:\n- Keep replies conversational, 2-4 sentences.\n- Always provide exact prices when asked about specific tiers or vehicles — use the figures above exactly, never estimate or round differently.\n- Offer WhatsApp (1-868-342-4101) for booking or viewing.\n- Use point form for all summaries and service lists.\n- Be concise, professional, and results-oriented.";

let vpCounter = 0;
const VP_PLAY = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
const VP_PAUSE = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';

function voicePlayerHtml(url) {
    const id = 'vp' + (vpCounter++);
    setTimeout(() => initVoicePlayer(id, url), 0);
    return `<div class="voice-player" id="${id}">
        <button class="vp-btn" data-play>${VP_PLAY}</button>
        <div class="vp-track" data-track><div class="vp-fill" data-fill></div></div>
        <span class="vp-time" data-time>0:00</span>
    </div>`;
}

function initVoicePlayer(id, url) {
    const root = document.getElementById(id);
    if (!root) return;
    const audio = new Audio(url);
    const btn = root.querySelector('[data-play]');
    const track = root.querySelector('[data-track]');
    const fill = root.querySelector('[data-fill]');
    const timeEl = root.querySelector('[data-time]');
    const fmt = s => { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

    btn.onclick = () => { audio.paused ? audio.play() : audio.pause(); };
    audio.onplay = () => { btn.innerHTML = VP_PAUSE; };
    audio.onpause = () => { btn.innerHTML = VP_PLAY; };
    audio.onended = () => { btn.innerHTML = VP_PLAY; fill.style.width = '0%'; timeEl.textContent = fmt(audio.duration); };
    audio.onloadedmetadata = () => { timeEl.textContent = fmt(audio.duration); };
    audio.ontimeupdate = () => {
        if (audio.duration) fill.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
        timeEl.textContent = fmt(audio.currentTime);
    };
    track.onclick = (e) => {
        if (!audio.duration) return;
        const rect = track.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    };
}

let history = [];

function getAI(txt, cb, imageUrl) {
    let userContent = txt;
    if (imageUrl) {
        // OpenAI/Grok-compatible multimodal content block, so the backend can forward
        // this straight to a vision-capable model instead of just a text URL.
        userContent = [
            { type: 'text', text: txt },
            { type: 'image_url', image_url: { url: imageUrl } }
        ];
    }
    history.push({role:'user', content:userContent});
    const payload = JSON.stringify({ system: SYSTEM_PROMPT, messages: history, max_tokens: 350 });
    
    fetch(SB_URL + '/functions/v1/chat-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    })
    .then(r => r.json())
    .then(data => {
        if(data.reply) {
            history.push({role:'assistant', content:data.reply});
            cb(data.reply);
        } else {
            fallback(txt, cb);
        }
    })
    .catch(() => fallback(txt, cb));
}

function fallback(txt, cb) {
    const s = txt.toLowerCase();
    let r = "That's a great question. I want to make sure I give you the perfect info—would you like to see our full service menu or chat with the team on WhatsApp?";
    if(s.includes("price") || s.includes("cost")) r = "Our agency packages are customized, but our 1-Day Custom Sites start at just $200 flat. Would you like the full pricing guide for our AI automation tiers?";
    else if(s.includes("evolve")) r = "We are the lead digital architects for Evolve Mobility (driveevolve.com), the Caribbean's premier EV dealership. We handle their entire sales ecosystem. Are you interested in fleet mobility or a personal EV?";
    cb(r);
}

const WA_SVG='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.5 8.5 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';

function ensureWhatsAppBtn(botText){
    if(!botText || !/whatsapp/i.test(botText)) return;
    const q = document.getElementById('chat-qr');
    if(!q || q.querySelector('.qrb.wa')) return; // already offered, don't duplicate
    const a = document.createElement('a');
    a.href = WA; a.target = '_blank';
    a.className = 'qrb wa'; a.innerHTML = WA_SVG + ' Chat on WhatsApp';
    q.appendChild(a);
}

var voiceOn=false;
var preferredVoice=null;
function pickVoice(){
  if(!window.speechSynthesis) return;
  var voices=window.speechSynthesis.getVoices();
  if(!voices.length) return;
  // If the user has manually picked a voice via the voice picker, honor that
  // above all else -- it's guaranteed correct since they heard it themselves.
  var savedName = localStorage.getItem('pd_chosen_voice');
  if (savedName) {
    var saved = voices.find(v => v.name === savedName);
    if (saved) { preferredVoice = saved; return; }
  }
  // Preference order: an explicitly female-labeled voice first (this is what
  // was reliably working), then natural/neural-named voices as a secondary
  // preference, falling back to whatever the browser offers.
  var priorities = [
    v => /female/i.test(v.name),                                     // explicit female label -- top priority
    v => /Google UK English Female/i.test(v.name),
    v => v.name === 'Samantha',                                      // macOS/iOS default, female, quite natural
    v => /natural/i.test(v.name) && /female/i.test(v.name),          // female + Edge "Online (Natural)" voices
    v => /Aria|Jenny|Emma|Ava/i.test(v.name),                        // common neural voice names (often female)
    v => /Google US English/i.test(v.name),
    v => v.lang && v.lang.startsWith('en')
  ];
  for (var i = 0; i < priorities.length; i++) {
    var match = voices.find(priorities[i]);
    if (match) { preferredVoice = match; return; }
  }
  preferredVoice = voices[0];
}
if(window.speechSynthesis){
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}
window.toggleVoice=function(){
  voiceOn=!voiceOn;
  var btn=document.getElementById('chat-voice-toggle');
  if(btn){
    var svgPath=voiceOn?'M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07':'M11 5L6 9H2v6h4l5 4V5z';
    btn.innerHTML='<svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"'+svgPath+'\"/></svg>'+(voiceOn?' AUDIO ON':' AUDIO OFF');
    btn.classList.toggle('voice-on',voiceOn);
  }
  if(!voiceOn&&window.speechSynthesis)window.speechSynthesis.cancel();
};
var speakGeneration = 0;
function speak(txt){
  if(!voiceOn||!window.speechSynthesis)return;
  var clean=txt.replace(/<[^>]*>/g,' ').replace(/\n/g,' ').replace(/Dezigns/gi, 'Designs').trim();
  if(!clean) return;
  if(!preferredVoice) pickVoice();
  window.speechSynthesis.cancel();
  var myGeneration = ++speakGeneration;

  // Split into segments at commas and sentence-enders, keeping the punctuation
  // so we can pause longer after . ! ? than after a comma. This is queued as
  // separate utterances with an explicit gap, since browsers vary a lot in
  // how much (if any) of a pause they naturally give for punctuation alone.
  var rawParts = clean.split(/([.!?,])/);
  var segments = [];
  var buffer = '';
  for (var i = 0; i < rawParts.length; i++) {
    var p = rawParts[i];
    if (/^[.!?,]$/.test(p)) {
      buffer += p;
      var text = buffer.trim();
      if (text) segments.push({ text: text, pause: (p === ',') ? 180 : 380 });
      buffer = '';
    } else {
      buffer += p;
    }
  }
  if (buffer.trim()) segments.push({ text: buffer.trim(), pause: 0 });

  var idx = 0;
  function speakNext() {
    if (myGeneration !== speakGeneration) return; // a newer speak() call has taken over
    if (idx >= segments.length) return;
    var seg = segments[idx++];
    var u = new SpeechSynthesisUtterance(seg.text);
    u.rate = 1.0; u.pitch = 1.03; u.volume = 1;
    if (preferredVoice) u.voice = preferredVoice;
    u.onend = function() {
      if (myGeneration !== speakGeneration) return;
      if (seg.pause > 0) setTimeout(speakNext, seg.pause);
      else speakNext();
    };
    window.speechSynthesis.speak(u);
  }
  speakNext();
}

window.toggleEmojis = function() {
    document.getElementById('emoji-picker').classList.toggle('open');
};

// Close the emoji picker on outside click — otherwise it sits on top of the
// send button and silently swallows clicks meant for Send.
document.addEventListener('click', function(e) {
    const ep = document.getElementById('emoji-picker');
    if (!ep || !ep.classList.contains('open')) return;
    const toggleBtn = document.querySelector('[onclick="toggleEmojis()"]');
    if (ep.contains(e.target) || (toggleBtn && toggleBtn.contains(e.target))) return;
    ep.classList.remove('open');
});

// --- High-Fidelity Voice Recording & Attachment Handlers ---
let mediaRecorder;
let audioChunks = [];
let recInterval;
let recSeconds = 0;
let recognition;
let currentTranscript = "";
let isRecordingActive = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
}

window.toggleMic = function() {
    const btn = document.getElementById('chat-mic');
    if (btn.classList.contains('recording')) {
        stopAudioRecord();
    } else {
        startAudioRecord();
    }
};

function startAudioRecord() {
    currentTranscript = "";
    isRecordingActive = true;
    if (recognition) {
        recognition.onresult = (event) => {
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) final += event.results[i][0].transcript;
            }
            currentTranscript += final;
        };
        // Mobile Chrome stops listening after a few seconds of silence even
        // with continuous=true -- unlike desktop. If it ends on its own while
        // the user is still recording, just restart it so it keeps capturing
        // for the full duration of the recording.
        recognition.onend = () => {
            if (isRecordingActive) {
                try { recognition.start(); } catch (e) { /* already running */ }
            }
        };
        recognition.onerror = (e) => {
            // 'no-speech' and 'aborted' are routine (esp. on mobile) and are
            // always followed by onend, which will restart it -- don't treat
            // these as fatal. Other errors just get logged, not thrown.
            console.log('Speech recognition:', e.error);
        };
        try { recognition.start(); } catch (e) { /* ignore if already started */ }
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            document.getElementById('chat-mic').classList.add('recording');
            
            const timer = document.getElementById('chat-timer');
            timer.innerText = '00:00';
            timer.classList.add('vis');
            recSeconds = 0;
            recInterval = setInterval(() => {
                recSeconds++;
                const m = Math.floor(recSeconds / 60).toString().padStart(2, '0');
                const s = (recSeconds % 60).toString().padStart(2, '0');
                timer.innerText = `${m}:${s}`;
            }, 1000);

            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                uploadToVault(blob, 'voice_note_' + Date.now() + '.webm', 'audio');
            };
        })
        .catch(err => alert("Microphone access denied or not supported."));
}

function stopAudioRecord() {
    isRecordingActive = false;
    document.getElementById('chat-mic').classList.remove('recording');
    document.getElementById('chat-timer').classList.remove('vis');
    clearInterval(recInterval);

    const finishRecording = () => {
        clearTimeout(recStopSafety);
        if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    };

    if (recognition) {
        // Wait for recognition to fully finish (including any final result still
        // in flight) before stopping the recorder and triggering the upload —
        // otherwise the transcript can still be empty at the moment it's checked.
        recognition.onend = finishRecording;
        recognition.stop();
        // Safety net in case onend never fires (e.g. permission hiccup).
        var recStopSafety = setTimeout(finishRecording, 1200);
    } else {
        finishRecording();
    }
}

window.handleChatFile = function(files) {
    if (files && files[0]) {
        uploadToVault(files[0], files[0].name, 'file');
    }
};

// Auto-generated per-session identifier so every visitor still gets their own
// folder without being interrupted by a popup. If they later tell the bot
// their name in conversation, we swap it in for future uploads this session.
let clientName = 'Visitor-' + Math.random().toString(36).slice(2, 8).toUpperCase();
let clientEmail = null;
let clientPhone = null;
function maybeCaptureName(text) {
    const m = text.match(/\bmy name is ([a-zA-Z][a-zA-Z '.-]{1,40})/i) || text.match(/\bi'?m ([a-zA-Z][a-zA-Z '.-]{1,40})\b/i);
    if (m && m[1]) {
        const cleaned = m[1].trim().replace(/[^a-zA-Z0-9 _-]/g, '').slice(0, 60);
        if (cleaned) clientName = cleaned;
    }
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) clientEmail = emailMatch[0];
    const phoneMatch = text.match(/(\+?1?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4})/);
    if (phoneMatch) clientPhone = phoneMatch[0].trim();
    if (emailMatch || phoneMatch) {
        // We now have real contact info -- log/update this as an actual lead,
        // not just an anonymous session, so the team can follow up.
        fetch(SB_URL + '/rest/v1/client_leads', {
            method: 'POST',
            headers: {
                'apikey': SB_ANON, 'Authorization': 'Bearer ' + SB_ANON,
                'Content-Type': 'application/json', 'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ name: clientName, email: clientEmail, phone: clientPhone, brand: 'Prisca Dezigns', status: 'new' })
        }).catch(() => {});
    }
}
function ensureClientName(cb) {
    cb(clientName);
}

function uploadToVault(file, fileName, type) {
    ensureClientName(function(client) {
        addMsg("Uploading " + type + "...", 'bot');
        const safeClient = client.replace(/\s+/g, '_');
        const path = 'chatbot_uploads/' + safeClient + '/' + Date.now() + '_' + fileName;

        fetch(SB_URL + '/storage/v1/object/media/' + path, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + SB_ANON,
                'Content-Type': file.type,
                'x-upsert': 'true'
            },
            body: file
        })
        .then(r => r.json())
        .then(data => {
            if (data.Key || data.path) {
                const url = SB_URL + '/storage/v1/object/public/media/' + path;
                const isImage = file.type && file.type.startsWith('image/');

                if (type === 'audio') {
                    addMsg(`<div class="chat-audio-msg">${voicePlayerHtml(url)}</div>`, 'usr');
                } else if (isImage) {
                    addMsg(`<img src="${url}" onclick="window.open('${url}')" />`, 'usr');
                } else {
                    addMsg(`📎 File attached: <a href="${url}" target="_blank">${fileName}</a>`, 'usr');
                }

                // Server-side: log the attachment (with contact info if we have it) to Supabase.
                // Fire-and-forget — doesn't block the chat reply.
                fetch(SB_URL + '/functions/v1/save-attachment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_ANON },
                    body: JSON.stringify({ clientName: client, clientEmail: clientEmail, clientPhone: clientPhone, fileUrl: url, fileName: fileName, fileType: file.type, category: type })
                }).catch(() => {});

                if (type === 'audio') {
                    if (currentTranscript && currentTranscript.trim()) {
                        getAI("I just uploaded a voice note. Transcript: \"" + currentTranscript.trim() + "\"", (reply) => { addMsg(reply, 'bot'); speak(reply); });
                    } else {
                        const noTranscriptMsg = "Got your voice note saved — but I couldn't capture a live transcript that time (this browser may not support speech-to-text). Mind typing your question instead?";
                        addMsg(noTranscriptMsg, 'bot');
                        speak(noTranscriptMsg);
                    }
                } else if (isImage) {
                    // Real multimodal call — the image is sent as actual image content, not just a URL string.
                    getAI("The user uploaded this image. Take a look and respond to what's actually in it.", (reply) => { addMsg(reply, 'bot'); speak(reply); }, url);
                } else {
                    getAI("I just uploaded a file: " + fileName + " (" + url + ")", (reply) => { addMsg(reply, 'bot'); speak(reply); });
                }
            } else {
                addMsg("Upload failed. Please try again.", 'bot');
            }
        })
        .catch(() => addMsg("Upload error. Check connection.", 'bot'));
    });
}

const PKGS={"standard":[{"name":"Starter","price":"$297","desc":"1-Page High-Fidelity Website \u00b7 Full Brand Setup (Logo, Domain, Favicon) \u00b7 Social Media Integration (FB/IG Covers) \u00b7 Technical SEO & SSL \u00b7 1 Month Free Maintenance"},{"name":"Growth","price":"$597","desc":"Manage 1 Brand Page (Full Social Setup) \u00b7 Full Branding & App/Web Architecture \u00b7 Content Creation & Copywriting \u00b7 Advanced SEO & Analytics \u00b7 1 Month Free Maintenance"},{"name":"Trusted","price":"$1,200","desc":"Full Business Automation \u00b7 10-15 Pages of High-Fidelity Content \u00b7 Premium Brand Scaling & PR Logic \u00b7 24/7 Priority Tech Support \u00b7 1 Month Free Maintenance"},{"name":"Custom","price":"Bespoke","desc":"Tailored Digital Architecture \u00b7 Custom API & Tool Integration \u00b7 Unique Brand Identity Design \u00b7 Scalable Infrastructure Logic \u00b7 Priority Support"}],"ecommerce":[{"name":"E-Starter","price":"$497","desc":"1-Page Online Shop \u00b7 Full Store Branding & Domain \u00b7 Integrated Social Shop Setup \u00b7 Payment Gateway Integration \u00b7 1 Month Free Maintenance"},{"name":"E-Growth","price":"$1,497","desc":"2-5 Page Store Architecture \u00b7 Full Shop Logic (10+ Products) \u00b7 Deep Copywriting & Product SEO \u00b7 Automated Fulfillment Sync \u00b7 1 Month Free Maintenance"},{"name":"E-Trusted","price":"$2,500","desc":"Elite Store (50+ Products) \u00b7 15+ Page Network Architecture \u00b7 Advanced Inventory & CRM Automation \u00b7 On-Chain Inventory Logic \u00b7 1 Month Free Maintenance"},{"name":"E-Commerce Maintenance","price":"$199.99/mo","desc":"E-Commerce Store Uptime & Security Monitoring \u00b7 Monthly Product & Content Updates \u00b7 High-Fidelity Technical Backups \u00b7 Priority Support"}],"continuity":[{"name":"Maintenance","price":"$99/mo","desc":"Monthly Updates \u00b7 Security Monitoring \u00b7 Performance Checks \u00b7 1 Content Edit/mo \u00b7 Priority Support"}],"templates":[{"name":"Template Site","price":"$149.99 + $19.99/mo","desc":"Custom branded to your business \u00b7 Live on your domain in 24 hours \u00b7 SSL, mobile-ready, SEO basics included \u00b7 1 complimentary revision round"},{"name":"+ Copywriting Add-On","price":"$49.99 + $4.99/update","desc":"We write your headline, bio & service copy \u00b7 Based on a short intake form you fill in \u00b7 $4.99 flat per edit after go-live"},{"name":"+ AI Chatbot Add-On","price":"$349.99 + $49.99/mo","desc":"24/7 AI \u2014 answers your business FAQs \u00b7 Preloaded with hours, location, services \u00b7 Works with new or existing sites"},{"name":"Micro Store","price":"$249.99 + $34.99/mo","desc":"Product grid \u2014 up to 12 products \u00b7 WhatsApp order button per product \u00b7 WhatsApp-driven orders with zero fees \u00b7 Everything in Standard Site included"},{"name":"Agency & Artist (Premium 3D)","price":"$299.99 + $19.99/mo","desc":"High-end cinematic 3D scroll experience \u00b7 Aeon \u00b7 Nexus \u00b7 Stellar \u00b7 Live on your domain in 24\u201348 hours"}],"aidata":[{"name":"Starter","price":"From $1,250 + $599/mo","desc":"AI Data Entry, Processing, Records, Reporting, Workflow & Document automation \u00b7 Add-ons available: Custom Export Formats, Automated Report Delivery, Anomaly & Error Alerts"},{"name":"Growth","price":"From $2,000 + $899/mo","desc":"Same roles \u00b7 Add-ons available: everything in Starter plus CRM & Database Sync, Multi-Source Data Intake, Analytics Dashboard"},{"name":"Enterprise","price":"From $4,000 + $1,499/mo","desc":"Same roles at enterprise scale \u00b7 ALL add-ons included as standard"}],"aivoice":[{"name":"Starter","price":"From $1,500 + $499/mo","desc":"AI Receptionist, Customer Service, Sales Rep, Scheduler, Survey & Feedback, Accounts Receivable, HSE Assistant \u00b7 Add-ons available: WhatsApp & SMS Follow-Up, Custom Voice & Persona, Multi-Language Support"},{"name":"Growth","price":"From $2,500 + $899/mo","desc":"Same roles \u00b7 Add-ons available: everything in Starter plus CRM Integration, Call Analytics Dashboard"},{"name":"Enterprise","price":"From $5,000 + $1,699/mo","desc":"Full voice network across all roles \u00b7 ALL add-ons included as standard"}],"aichannel":[{"name":"Starter","price":"From $750 + $399/mo","desc":"Responds to basic inquiries, captures lead name & contact, simple FAQ & greeting logic, monthly performance report"},{"name":"Growth","price":"From $1,250 + $599/mo","desc":"Qualifies & scores leads automatically, books appointments without human input, sends follow-up sequences, connects to your CRM, bi-weekly performance report"},{"name":"Enterprise","price":"From $2,500 + $999/mo","desc":"Full conversational AI with custom personality, multi-language & industry-specific logic, sales & objection-handling intelligence, deep CRM sync & analytics, weekly reporting dashboard"}],"specializedNote":"All Specialized AI Network pricing (AI Administration/HR/Finance/Health & Safety/IT/Marketing/Quality Assurance/Production, AI Voice Agents, AI Customer Relations) starts from the figures shown. Final implementation and monthly AI Management pricing are confirmed following a Business Process Audit, and every plan includes ongoing platform monitoring, updates, and support."};

const STEPS = {
    "request_audit": {
    "bot": "I can run a full high-fidelity audit on your current digital infrastructure \u2014 from your website conversion to your automation efficiency. Ready to level up?",
    "r": [
        {
            "l": "Yes, start audit",
            "s": "talk",
            "i": "clipboard-check"
        },
        {
            "l": "Back",
            "s": "start",
            "i": "arrow-left"
        }
    ]
},
    "start": {
        "bot": "Hey 👋 I'm Sierra. What brings you here today?",
        "r": [
            { "l": "About Prisca Dezigns", "s": "about", "i": "info" },
            { "l": "Talk to Drew about pricing", "s": "__drew_text__", "i": "dollar-sign" },
            { "l": "General support", "s": "talk", "i": "message-circle" }
        ]
    },
    "drew_start": {
        "bot": "Hey, I'm Drew — I handle sales and pricing. What are you looking to build or automate?",
        "r": [
            { "l": "I want a template site", "s": "pkg_templates", "i": "color-swatch" },
            { "l": "I need a custom website", "s": "need_website", "i": "layout" },
            { "l": "I need AI automation", "s": "automation", "i": "cpu" },
            { "l": "Agency Packages", "s": "pkg_menu", "i": "package" }
        ]
    },
    "about": {
        "bot": "Prisca Dezigns is an enterprise AI and digital transformation partner — we build high-fidelity web architecture, AI automation systems, and brand infrastructure for businesses ready to scale. Based in Trinidad & Tobago, working across the Caribbean.",
        "r": [
            { "l": "Evolve Mobility", "s": "about_brands", "i": "car" },
            { "l": "The Way Made Known", "s": "about_twmk", "i": "heart" },
            { "l": "About Prisca Dezigns", "s": "about_founder", "i": "user" },
            { "l": "Back", "s": "start", "i": "arrow-left" }
        ]
    },
    "about_brands": {
        "bot": "We're the strategic digital partners for EVOLVE Mobility (driveevolve.com), transforming the Caribbean's roads through green mobility.\n\nCurrent lineup includes:\n⚡ GAC Aion ES — from TT$195,000 (TT$2,500/mo)\n⚡ Leapmotor C10 — TT$255,000\n⚡ GAC Aion V — TT$260,000\n⚡ BYD Sealion 7 (Premium) — TT$360,000\n\nCarrying BYD, Denza, GAC, Leapmotor, Wuling & more, with servicing by SBCS University.",
        "r": [
            { "l": "Visit Evolve Mobility", "url": "https://driveevolve.com", "i": "external-link" },
            { "l": "Fleet Assessment & Transition", "s": "fleet_transition", "i": "truck" },
            { "l": "Back", "s": "about", "i": "arrow-left" }
        ]
    },
    "fleet_transition": {
        "bot": "If your business runs a vehicle fleet, we offer a free on-site assessment and handle the full EV transition — from picking the right models to financing, documentation, and delivery. Fuel costs typically drop up to 70%, with no oil changes or transmission servicing. Most fleets start with a 2-3 vehicle pilot to see real numbers within 90 days.",
        "wa": true
    },
    "about_twmk": {
        "bot": "The Way Made Known is a Christian ministry rooted in Acts 17:23 — \"what you worship as unknown, this I proclaim to you.\" We meet people wherever they are in their spiritual search, with respect rather than judgment. The site includes a Visual Bible Library & Bookstore, The Proclamation (an interactive tool for exploring scripture), and a blog covering testimony, analytical faith, and reflections on Christian life today.",
        "r": [
            { "l": "Visit the Blog", "url": "https://thewaymadeknown.com/blog/", "i": "book-open" },
            { "l": "Back", "s": "about", "i": "arrow-left" }
        ]
    },
    "about_founder": {
        "bot": "Prisca Dezigns was founded in Trinidad & Tobago by Priscilla Narine. The agency operates as an enterprise AI and digital transformation partner — combining high-fidelity web architecture with AI automation (chatbots, WhatsApp automation, voice agents, lead qualification) to help businesses modernize how they operate, not just how they look online.",
        "r": [
            { "l": "Back", "s": "about", "i": "arrow-left" }
        ]
    },
    "need_website": {
        "bot": "Our custom websites are built from scratch — fully tailored to your brand, SEO-optimised, and delivered fast. What do you need?",
        "r": [
            { "l": "Need it in 24hrs — $200", "s": "pkg_oneday", "i": "zap" },
            { "l": "I need a full custom build", "s": "pkg_standard", "i": "code" },
            { "l": "Mine isn't converting", "s": "bad_website", "i": "trending-down" },
            { "l": "Show me templates instead", "s": "pkg_templates", "i": "color-swatch" }
        ]
    },
    "bad_website": {
        "bot": "That's usually a sign of weak conversion design, slow load times, or missed follow-up on leads — all fixable. Want us to run a quick audit, or look at AI automation to catch the leads you're currently losing?",
        "r": [
            { "l": "Run an audit", "s": "request_audit", "i": "clipboard-check" },
            { "l": "Show me AI automation", "s": "automation", "i": "cpu" },
            { "l": "Back", "s": "need_website", "i": "arrow-left" }
        ]
    },
    "pkg_menu": {
        "bot": "Our agency packages are full custom builds — designed, developed and delivered by Prisca Dezigns. Which fits your needs?",
        "r": [
            { "l": "1-Day Website — $200", "s": "pkg_oneday", "i": "zap" },
            { "l": "Custom Website Packages", "s": "pkg_standard", "i": "layout" },
            { "l": "E-Commerce Packages", "s": "pkg_ecommerce", "i": "shopping-bag" },
            { "l": "AI Consultancy", "s": "pkg_ai", "i": "cpu" },
            { "l": "Maintenance", "s": "pkg_continuity", "i": "tool" },
            { "l": "I want a template instead", "s": "pkg_templates", "i": "color-swatch" }
        ]
    },
    "pkg_oneday": {
        "bot": "The 1-Day Website is a fully custom site — built to your brand, live within 24 hours. One flat price: $200 setup (includes 1 revision). Then $50/mo to keep it live, optimised, and secure. Any add-on after that is $50 USD each.",
        "r": [
            { "l": "What's included?", "s": "oneday_included", "i": "check-circle" },
            { "l": "I want this — let's talk", "s": "talk", "i": "message-circle" },
            { "l": "See other packages", "s": "pkg_menu", "i": "package" }
        ]
    },
    "oneday_included": {
        "bot": "Your 1-Day Site includes: ✦ Full custom design (not a template) ✦ Mobile-first, fast-loading ✦ SEO + GEO + AEO optimised ✦ WhatsApp & contact integration ✦ 1 Revision Included ✦ Live in 24 hours. $200 flat. $50/mo maintenance. Any additional add-on is $50 USD each.",
        "r": [
            { "l": "Let's get started", "s": "talk", "i": "zap" },
            { "l": "See template option instead", "s": "pkg_templates", "i": "color-swatch" },
            { "l": "See all packages", "s": "pkg_menu", "i": "package" }
        ]
    },
    "automation": {
        "bot": "We build AI systems that replace a full-time customer service rep. They respond, qualify, and follow up — all day, every day. What are you trying to automate?",
        "r": [
            { "l": "Customer service / enquiries", "s": "how_it_works", "i": "headphones" },
            { "l": "AI Employees (9 departments)", "s": "aidata_products", "i": "database" },
            { "l": "AI Voice (receptionist, sales)", "s": "aivoice_products", "i": "phone" },
            { "l": "Talk to someone", "s": "talk", "i": "message-circle" }
        ]
    },
    "whatsapp_auto": {
        "bot": "We integrate an AI agent directly into your WhatsApp Business. It responds to every message instantly, qualifies the lead, and alerts you only when someone is ready to pay.",
        "r": [
            { "l": "See AI Consultancy", "s": "pkg_ai", "i": "package" },
            { "l": "Talk to someone", "s": "talk", "i": "message-circle" }
        ]
    },
    "how_it_works": {
        "bot": "We connect an AI agent to your WhatsApp, website, or email. It greets every lead, asks qualifying questions, routes serious buyers to you, and follows up with everyone else automatically. Setup takes 2–4 weeks.",
        "r": [
            { "l": "See AI Consultancy", "s": "pkg_ai", "i": "package" },
            { "l": "Talk to someone", "s": "talk", "i": "message-circle" }
        ]
    },
    "talk": {
        "bot": "The best way to get moving is a direct handshake on WhatsApp. I've prepared a direct link for you to message the management team.",
        "wa": true
    },
    "pkg_templates": { "bot": "Choose from our high-fidelity templates — live in 24-48hrs.", "pkg": "templates" },
    "pkg_standard": { "bot": "Professional custom web packages for growing brands.", "pkg": "standard" },
    "pkg_ecommerce": { "bot": "Scalable e-commerce solutions for global selling.", "pkg": "ecommerce" },
    "pkg_ai": {
        "bot": "AI Consultancy at Prisca Dezigns covers two things: AI Employees (department-based automation) and AI Voice (voice agents). Which one fits what you're trying to automate?",
        "r": [
            { "l": "AI Employees (9 departments)", "s": "aidata_products", "i": "database" },
            { "l": "AI Voice (receptionist, sales)", "s": "aivoice_products", "i": "phone" },
            { "l": "Start Free Audit", "url": "https://priscadezigns.org/audit/", "i": "clipboard-check" },
            { "l": "Talk to someone", "s": "talk", "i": "message-circle" }
        ]
    },
    "aidata_products": {
        "bot": "AI Employees is organised by department — meet the specialist AI Employee for each:\n\n<b>AI Administration — Alana</b>\nCross-department admin coordinator. Handles inbox triage, scheduling, follow-ups, and connects to your other AI Employees for one unified daily brief.\n\n<b>AI Human Resources — Alice</b>\nManages onboarding, leave tracking, application screening, and TT payroll compliance.\n\n<b>AI Finance — Jamal</b>\nReconciles transactions, surfaces discrepancies early, and generates monthly financial reports automatically.\n\n<b>AI Health & Safety — Luna</b>\nMonitors incident reports, distributes toolbox talks, tracks hazard logs, and audits compliance.\n\n<b>AI Information Technology — Sunil</b>\nHandles help desk requests, validates data quality, and monitors your systems 24/7.\n\n<b>AI Marketing — Dean</b>\nManages marketing data, scores leads, and delivers campaign performance reporting.\n\n<b>AI Quality Assurance — Zara</b>\nLogs inspections, tracks non-conformances, and monitors your compliance posture continuously.\n\n<b>AI Production — Chan</b>\nLogs output data, tracks inventory, schedules preventive maintenance, and analyses production trends.\n\n<b>AI Customer Relations — Sierra</b>\nHandles WhatsApp, email, and website chat around the clock — qualifies leads, books appointments, and follows up automatically.\n\nWant a personalised recommendation? Start your free audit at priscadezigns.org/audit, or message us on WhatsApp.",
        "pkg": "aidata",
        "r": [
            { "l": "Start Free Audit", "url": "https://priscadezigns.org/audit/", "i": "clipboard-check" },
            { "l": "← Back", "s": "pkg_ai", "i": "arrow-left" }
        ]
    },
    "aivoice_products": {
        "bot": "AI Voice covers seven specific roles:\n• AI Receptionist\n• AI Customer Service\n• AI Sales Rep\n• AI Scheduler\n• AI Survey & Feedback\n• AI Accounts Receivable\n• AI HSE Assistant\n\nThe pricing below represents the complexity of the agent/employee you choose. Want a personalised recommendation? Start your free audit at priscadezigns.org/audit, or message us on WhatsApp.",
        "pkg": "aivoice",
        "r": [
            { "l": "Start Free Audit", "url": "https://priscadezigns.org/audit/", "i": "clipboard-check" },
            { "l": "← Back", "s": "pkg_ai", "i": "arrow-left" }
        ]
    },
    "aichannel_products": {
        "bot": "AI Customer Relations covers three channels, and each one runs the same two AI Employees — AI Customer Service and AI Lead Generation:\n• Website Automation\n• WhatsApp Automation\n• Email Automation\n\nThe pricing below represents the complexity of the agent/employee you choose. Want a personalised recommendation? Start your free audit at priscadezigns.org/audit, or message us on WhatsApp.",
        "pkg": "aichannel",
        "r": [
            { "l": "Start Free Audit", "url": "https://priscadezigns.org/audit/", "i": "clipboard-check" },
            { "l": "← Back", "s": "pkg_ai", "i": "arrow-left" }
        ]
    },
    "pkg_aidata": { "bot": "AI Employees — hire specialist AI staff across 9 departments (Admin, HR, Finance, Health & Safety, IT, Marketing, Quality Assurance, Production, Customer Relations), each on the same tier pricing.", "pkg": "aidata" },
    "pkg_aivoice": { "bot": "AI Voice — human-grade voice agents for reception, sales, lead qualification, and survey/feedback, answering calls 24/7.", "pkg": "aivoice" },
    "pkg_aichannel": { "bot": "AI Customer Relations — autonomous email, website, and WhatsApp lead conversion pipelines, working your inbox and chats around the clock.", "pkg": "aichannel" },
    "pkg_continuity": { "bot": "Keep your digital infrastructure peak & secure.", "pkg": "continuity" }
};

let hist = [];
let open = false;

// ── Active agent: 'selector' | 'sierra' | 'drew'
var activeAgent = 'selector';

window.enterDrewText = function() {
    activeAgent = 'drew';
    var sel = document.getElementById('agent-selector');
    var sierraUi = document.getElementById('chat-back-bar');
    var msgs = document.getElementById('chat-msgs');
    var qr = document.getElementById('chat-qr');
    var inp = document.querySelector('.chat-inp-row');
    var drewPanel = document.getElementById('drew-panel');
    var hdrName = document.querySelector('.chat-hdr-name');
    var hdrStatus = document.querySelector('.chat-hdr-status');
    var switchLabel = document.getElementById('switch-btn-label');
    var voiceBtn = document.getElementById('chat-voice-toggle');
    var avatar = document.querySelector('.chat-avatar img');

    if (sel) sel.style.display = 'none';
    if (drewPanel) drewPanel.classList.remove('active');
    // Stop any active Drew voice call before switching into text mode
    if (typeof drewVapi !== 'undefined' && drewVapi && drewCallActive) drewVapi.stop();

    if (sierraUi) sierraUi.style.display = '';
    if (msgs) { msgs.style.display = ''; msgs.innerHTML = ''; }
    if (qr) { qr.style.display = ''; qr.innerHTML = ''; }
    if (inp) inp.style.display = '';
    if (voiceBtn) voiceBtn.style.display = '';
    if (hdrName) hdrName.textContent = 'Drew';
    if (hdrStatus) hdrStatus.innerHTML = '<div class="chat-sdot"></div> Sales Representative';
    if (switchLabel) switchLabel.textContent = 'SIERRA';
    if (avatar) avatar.src = 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/drew_headshot.jpg';

    // Reset history so Drew starts fresh at his own menu, regardless of
    // whatever step Sierra's conversation was on.
    hist.length = 0;
    go('drew_start');
}

window.selectAgent = function(agent) {
    activeAgent = agent;
    var sel = document.getElementById('agent-selector');
    var sierraUi = document.getElementById('chat-back-bar');
    var msgs = document.getElementById('chat-msgs');
    var qr = document.getElementById('chat-qr');
    var inp = document.querySelector('.chat-inp-row');
    var drewPanel = document.getElementById('drew-panel');
    var hdrName = document.querySelector('.chat-hdr-name');
    var hdrStatus = document.querySelector('.chat-hdr-status');
    var switchLabel = document.getElementById('switch-btn-label');
    var voiceBtn = document.getElementById('chat-voice-toggle');
    var avatar = document.querySelector('.chat-avatar img');

    if (sel) sel.style.display = 'none';

    if (agent === 'sierra') {
        if (drewPanel) drewPanel.classList.remove('active');
        if (sierraUi) sierraUi.style.display = '';
        if (msgs) msgs.style.display = '';
        if (qr) qr.style.display = '';
        if (inp) inp.style.display = '';
        if (voiceBtn) voiceBtn.style.display = '';
        if (hdrName) hdrName.textContent = 'Sierra';
        if (hdrStatus) hdrStatus.innerHTML = '<div class="chat-sdot"></div> Active Agent';
        if (switchLabel) switchLabel.textContent = 'DREW';
        if (avatar) avatar.src = 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/sierra_headshot.jpg';
        if (hist.length === 0) go('start');
    } else if (agent === 'drew') {
        if (sierraUi) sierraUi.style.display = 'none';
        if (msgs) msgs.style.display = 'none';
        if (qr) qr.style.display = 'none';
        if (inp) inp.style.display = 'none';
        if (voiceBtn) voiceBtn.style.display = 'none';
        if (drewPanel) drewPanel.classList.add('active');
        if (hdrName) hdrName.textContent = 'Drew';
        if (hdrStatus) hdrStatus.innerHTML = '<div class="chat-sdot"></div> Sales Representative';
        if (switchLabel) switchLabel.textContent = 'SIERRA';
        if (avatar) avatar.src = 'https://raw.githubusercontent.com/priscadezigns9/priscadezignswebsite/main/assets/drew_headshot.jpg';
        drewInitVapi();
    }
};

window.switchAgent = function() {
    // If on selector screen, do nothing
    if (activeAgent === 'selector') return;
    // Stop any active Drew call before switching
    if (activeAgent === 'drew' && drewVapi && drewCallActive) drewVapi.stop();
    // Show selector again to let user pick
    var sel = document.getElementById('agent-selector');
    var sierraUi = document.getElementById('chat-back-bar');
    var msgs = document.getElementById('chat-msgs');
    var qr = document.getElementById('chat-qr');
    var inp = document.querySelector('.chat-inp-row');
    var drewPanel = document.getElementById('drew-panel');
    var voiceBtn = document.getElementById('chat-voice-toggle');
    if (sel) sel.style.display = '';
    if (sierraUi) sierraUi.style.display = 'none';
    if (msgs) msgs.style.display = 'none';
    if (qr) qr.style.display = 'none';
    if (inp) inp.style.display = 'none';
    if (drewPanel) drewPanel.classList.remove('active');
    if (voiceBtn) voiceBtn.style.display = 'none';
    activeAgent = 'selector';
};

window.toggleChat = function(){
    open = !open;
    document.getElementById('pd-chat-window').classList.toggle('open', open);
    document.getElementById('pd-chat-bubble').classList.toggle('open', open);
    if (open && activeAgent === 'selector') {
        // Show selector — hide sierra/drew UI elements until agent chosen
        var sierraUi = document.getElementById('chat-back-bar');
        var msgs = document.getElementById('chat-msgs');
        var qr = document.getElementById('chat-qr');
        var inp = document.querySelector('.chat-inp-row');
        var voiceBtn = document.getElementById('chat-voice-toggle');
        if (sierraUi) sierraUi.style.display = 'none';
        if (msgs) msgs.style.display = 'none';
        if (qr) qr.style.display = 'none';
        if (inp) inp.style.display = 'none';
        if (voiceBtn) voiceBtn.style.display = 'none';
    }
};

window.go = function(step, label){
    if (step === '__drew_text__') { enterDrewText(); return; }
    const s = STEPS[step];
    if(!s) return;
    if(label) addMsg(label, 'usr');
    
    const m = document.getElementById('chat-msgs');
    const td = document.createElement('div');
    td.className = 'cmsg bot typing';
    td.id = 'typing-id';
    td.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    m.appendChild(td); m.scrollTop = m.scrollHeight;
    
    setTimeout(() => {
        if(document.getElementById('typing-id')) document.getElementById('typing-id').remove();
        hist.push(step);
        const q = document.getElementById('chat-qr');
        q.innerHTML = '';
        const botTxt = s.bot;
        addMsg(botTxt, 'bot');
        speak(botTxt);
        setBack(hist.length > 1);
        
        if(s.wa){
            const a = document.createElement('a');
            a.href = WA; a.target = '_blank';
            a.className = 'qrb wa'; a.innerHTML = WA_SVG + ' Chat on WhatsApp';
            q.appendChild(a);
            addQR('← Packages', 'pkg_menu');
            return;
        }
        if(s.pkg){
            renderPkgs(PKGS[s.pkg], ['aidata','aivoice','aichannel'].includes(s.pkg) ? PKGS.specializedNote : null);
            if(s.r){
                s.r.forEach(r => addQR(r.l, r.s, r.i, r.url));
            } else {
                addQR('← Packages', 'pkg_menu');
                addQR('Contact Team', 'talk');
            }
            return;
        }
        if(s.url) window.open(s.url, '_blank');
        if(s.r) s.r.forEach(r => addQR(r.l, r.s, r.i, r.url));
    }, 600);
}

function addQR(label, step, icon, url){
    const q = document.getElementById('chat-qr');
    const b = document.createElement('button');
    b.className = 'qrb';
    
    let iconSvg = '';
    if(icon){
            const icons = {
        'color-swatch': '<path d="M12 2l10 6.5V17c0 .5-.5 1-1 1h-7l-2 2-2-2H5c-.5 0-1-.5-1-1V8.5L12 2zM5 10l7 4.5 7-4.5"/>',
        'layout': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/>',
        'cpu': '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/><path d="M9 9h6v6H9z"/>',
        'package': '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zM12 22V12M3 7l9 5 9-5"/>',
        'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
        'car': '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/>',
        'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
        'user': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
        'arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
        'zap': '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
        'code': '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
        'trending-down': '<path d="M23 18l-9.5-9.5L8.5 14 1 6.5"/><path d="M16 18h7v-7"/>',
        'shopping-bag': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
        'tool': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
        'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
        'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.5 8.5 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
        'headphones': '<path d="M3 18v-6a9 9 0 0 1 18 0v6M3 14h3v4H3zM18 14h3v4h-3z"/>',
        'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
        'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
        'dollar-sign': '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
        'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
        'clipboard-check': '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8zM9 14l2 2 4-4"/>',
        'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>'
      };

      iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${icons[icon] || icons['info']}</svg>`;
    }

    b.innerHTML = iconSvg + `<span>${label}</span>`;
    b.onclick = url ? () => window.open(url, '_blank') : () => go(step, label);
    q.appendChild(b);
}

function setBack(vis){
    document.getElementById('chat-back-bar').classList.toggle('vis', vis);
}

window.chatBack = function(){
    if(hist.length < 2) return;
    hist.pop();
    const last = hist.pop();
    go(last);
};

function addMsg(txt, side, skipScroll){
    const m = document.getElementById('chat-msgs');
    const d = document.createElement('div');
    d.className = 'cmsg ' + side;
    d.innerHTML = txt.replace(/\n/g, '<br>');
    m.appendChild(d);
    if (skipScroll) {
        // no-op: caller is responsible for scroll position (e.g. a trailing
        // disclaimer note that shouldn't steal focus from the main content)
    } else if (side === 'bot') {
        // Scroll so the new message starts at the top of the visible area
        // instead of jumping straight to the bottom -- important for longer
        // replies (e.g. the AI Employees department list) so the user reads
        // from the start and can scroll down themselves.
        d.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else {
        m.scrollTop = m.scrollHeight;
    }
    if(side === 'bot') ensureWhatsAppBtn(txt);
}

function renderPkgs(list, note){
    const m = document.getElementById('chat-msgs');
    const g = document.createElement('div');
    g.className = 'cpkg-grid';
    list.forEach(p => {
        const c = document.createElement('div');
        c.className = 'cpkg-card';
        c.innerHTML = `<div class="cpkg-name">${p.name}</div><div class="cpkg-price">${p.price}</div><div class="cpkg-desc">${p.desc}</div>`;
        c.onclick = () => {
            addMsg(`I'm interested in the ${p.name} package.`, 'usr');
            setTimeout(() => go('talk'), 500);
        };
        g.appendChild(c);
    });
    m.appendChild(g);
    if(note){
        addMsg(`<span style="font-size:0.8em;opacity:0.75;font-style:italic;">${note}</span>`, 'bot', true);
    }
    // Deliberately no forced scroll here -- the preceding bot message (added
    // via addMsg) already scrolled to its own top, and we want the user to
    // stay there and scroll down through the cards themselves, not get
    // jumped straight to the bottom past everything they haven't read yet.
}

window.chatSend = function(){
    const i = document.getElementById('chat-inp');
    const t = i.value.trim(); if(!t) return;
    i.value = ''; addMsg(t, 'usr');
    maybeCaptureName(t);
    const ep = document.getElementById('emoji-picker');
    if (ep) ep.classList.remove('open');
    
    const m = document.getElementById('chat-msgs');
    const td = document.createElement('div');
    td.className = 'cmsg bot typing';
    td.id = 'typing-id';
    td.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    m.appendChild(td); m.scrollTop = m.scrollHeight;
    
    getAI(t, (reply) => {
        if(document.getElementById('typing-id')) document.getElementById('typing-id').remove();
        addMsg(reply, 'bot');
        speak(reply);
    });
};

if(window.location.pathname.includes('/services')){
    setTimeout(() => { if(!open) toggleChat(); }, 8000);
}

// --- Voice Picker: visit any page with ?voicepicker=1 to open this ---
if (window.location.search.includes('voicepicker=1')) {
    function buildVoicePicker() {
        if (!window.speechSynthesis) return;
        var voices = window.speechSynthesis.getVoices();
        if (!voices.length) { setTimeout(buildVoicePicker, 300); return; }

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff;overflow-y:auto;padding:20px;font-family:sans-serif;';
        var currentSaved = localStorage.getItem('pd_chosen_voice');

        var header = document.createElement('div');
        header.innerHTML = '<h2 style="margin:0 0 6px;">Pick the chatbot\'s voice</h2><p style="color:#666;margin:0 0 20px;font-size:14px;">Tap a voice to hear it, then tap "Use this voice" on the one you like.</p>';
        overlay.appendChild(header);

        voices.forEach(function(v) {
            var row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #eee;border-radius:12px;margin-bottom:8px;' + (v.name === currentSaved ? 'border-color:#5FA8D3;background:#faf5ff;' : '');

            var label = document.createElement('div');
            label.style.cssText = 'flex:1;font-size:14px;';
            label.innerHTML = '<b>' + v.name + '</b><br><span style="color:#888;font-size:12px;">' + v.lang + (v.name === currentSaved ? ' — currently selected' : '') + '</span>';

            var playBtn = document.createElement('button');
            playBtn.textContent = '▶ Hear it';
            playBtn.style.cssText = 'padding:8px 14px;border-radius:8px;border:1px solid #5FA8D3;background:#fff;color:#5FA8D3;font-weight:bold;cursor:pointer;';
            playBtn.onclick = function() {
                window.speechSynthesis.cancel();
                var u = new SpeechSynthesisUtterance("Hi! I'm the Prisca Dezigns assistant. This is what I sound like.");
                u.voice = v; u.rate = 1.0; u.pitch = 1.03;
                window.speechSynthesis.speak(u);
            };

            var useBtn = document.createElement('button');
            useBtn.textContent = 'Use this voice';
            useBtn.style.cssText = 'padding:8px 14px;border-radius:8px;border:none;background:#5FA8D3;color:#fff;font-weight:bold;cursor:pointer;';
            useBtn.onclick = function() {
                localStorage.setItem('pd_chosen_voice', v.name);
                preferredVoice = v;
                alert('Saved! "' + v.name + '" will now be used everywhere on the site.');
                overlay.remove();
            };

            row.appendChild(label);
            row.appendChild(playBtn);
            row.appendChild(useBtn);
            overlay.appendChild(row);
        });

        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close without changing';
        closeBtn.style.cssText = 'margin-top:10px;padding:10px 16px;border-radius:8px;border:1px solid #ccc;background:#fff;cursor:pointer;';
        closeBtn.onclick = function() { overlay.remove(); };
        overlay.appendChild(closeBtn);

        document.body.appendChild(overlay);
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = buildVoicePicker;
        buildVoicePicker();
    }
}

// ── Drew Vapi Integration ──
var drewVapi = null;
var drewCallActive = false;
var DREW_ASSISTANT_ID = 'ddf9f69d-bc14-4909-b057-a8736ef43990';
var VAPI_PUBKEY = 'f310f375-edec-472f-bfb6-ba5992ff623a';

function drewSetStatus(txt) {
    var el = document.getElementById('drew-status');
    if (el) el.textContent = txt;
}
function drewSetCallUI(active) {
    var sw = document.getElementById('drew-soundwave');
    var btnStart = document.getElementById('drew-btn-start');
    var btnEnd = document.getElementById('drew-btn-end');
    if (sw) sw.classList.toggle('speaking', active);
    if (btnStart) btnStart.style.display = active ? 'none' : '';
    if (btnEnd) btnEnd.classList.toggle('visible', active);
}

function drewInitVapi() {
    if (drewVapi) return;
    // Dynamically load Vapi SDK as ESM module
    var script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
        import Vapi from 'https://esm.sh/@vapi-ai/web@2.6.1';
        var v = new Vapi('${VAPI_PUBKEY}');
        window.__drewVapiInstance = v;
        v.on('call-start', function() {
            drewCallActive = true;
            window.drewSetStatus('Connected — Drew is live!');
            window.drewSetCallUI(true);
        });
        v.on('call-end', function() {
            drewCallActive = false;
            window.drewSetStatus('Call ended');
            window.drewSetCallUI(false);
            var btn = document.getElementById('drew-btn-start');
            if (btn) btn.textContent = '🎙 Call Again';
        });
        v.on('error', function(e) {
            window.drewSetStatus('Connection error — please try again');
            window.drewSetCallUI(false);
            console.error('Drew VAPI error:', e);
        });
        v.on('speech-start', function() {
            var sw = document.getElementById('drew-soundwave');
            if (sw) sw.classList.add('speaking');
        });
        v.on('speech-end', function() {
            var sw = document.getElementById('drew-soundwave');
            if (sw) sw.classList.remove('speaking');
        });
        drewVapi = v;
    `;
    document.head.appendChild(script);
    // expose helpers globally for the inline ESM to call back
    window.drewSetStatus = drewSetStatus;
    window.drewSetCallUI = drewSetCallUI;
    drewSetStatus('Initialising…');
    // Give SDK ~1.5s to load then update status
    setTimeout(function() {
        if (!drewCallActive) drewSetStatus('Ready to connect');
    }, 1500);
}

window.drewStartCall = function() {
    if (!window.__drewVapiInstance) {
        drewSetStatus('Still loading — please wait a moment…');
        return;
    }
    drewVapi = window.__drewVapiInstance;
    drewSetStatus('Connecting…');
    drewVapi.start(DREW_ASSISTANT_ID);
};

window.drewEndCall = function() {
    if (window.__drewVapiInstance && drewCallActive) {
        window.__drewVapiInstance.stop();
    }
};

// ── Zapia Executive Tag ──
// Timestamp: 2026-07-21 01:20:00 AST
// Author: Zapia Executive
// Change: Added Sierra / Drew agent selector on chatbot open.
//         Drew routes to Vapi assistant ddf9f69d (Sales Rep).
//         Sierra retains all existing behaviour unchanged.
//         Switch button in header lets user toggle between agents.

})();









