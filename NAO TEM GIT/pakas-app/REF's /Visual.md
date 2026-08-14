<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Pakas — MVP Mockup Showcase</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  :root {
    --mint: #2DD4BF;
    --mint-dark: #0F766E;
    --mint-soft: #CCFBF1;
    --ink: #0B1620;
    --ink-soft: #1E293B;
    --paper: #FFFFFF;
    --cream: #FAFAF7;
    --warm-gray: #F5F1EC;
    --line: #E8E5DF;
    --text: #1E293B;
    --text-soft: #64748B;
    --text-faint: #94A3B8;
    --accent-pink: #FF6B6B;
    --accent-yellow: #FFD166;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0B1620; color: #E2E8F0; min-height: 100vh; }
  body { padding: 64px 32px; overflow-x: auto; }

  .board-header { max-width: 1400px; margin: 0 auto 64px; }
  .board-header h1 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 56px; font-weight: 700; letter-spacing: -0.03em; color: white; line-height: 1; }
  .board-header h1 span { color: var(--mint); }
  .board-header p { margin-top: 16px; color: var(--text-faint); font-size: 18px; max-width: 720px; line-height: 1.5; }
  .board-header .meta { margin-top: 32px; display: flex; gap: 24px; flex-wrap: wrap; }
  .board-header .meta div { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-faint); }
  .board-header .meta div::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--mint); }

  .frames-grid {
    display: grid;
    grid-template-columns: repeat(3, 375px);
    gap: 48px 56px;
    justify-content: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .frame-wrapper { display: flex; flex-direction: column; }
  .frame-label { color: var(--text-faint); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 12px; padding-left: 4px; }
  .frame-label span { color: var(--mint); margin-right: 6px; }

  .phone {
    width: 375px; height: 812px;
    background: var(--paper);
    border-radius: 44px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 8px #0B1620;
    position: relative;
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 120px; height: 28px; background: #0B1620; border-radius: 0 0 18px 18px; z-index: 100; }

  .status-bar { position: absolute; top: 18px; left: 0; right: 0; padding: 0 30px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 600; color: var(--text); z-index: 50; }
  .status-icons { display: flex; gap: 6px; align-items: center; }
  .status-bar.dark, .status-bar.dark .status-icons svg { color: white; fill: white; }

  .screen-content { position: absolute; top: 50px; left: 0; right: 0; bottom: 0; padding: 24px 20px 100px; overflow: hidden; }

  /* Nav bar bottom */
  .tabbar { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: white; border-top: 1px solid var(--line); display: flex; justify-content: space-around; align-items: center; padding-bottom: 16px; }
  .tabbar-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-faint); font-size: 10px; font-weight: 600; }
  .tabbar-item.active { color: var(--mint-dark); }
  .tabbar-item svg { width: 22px; height: 22px; }

  /* ============= SCREEN 1: SPLASH ============= */
  .splash {
    background: linear-gradient(135deg, #0B1620 0%, #0F766E 100%);
    height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: white; padding: 24px;
    position: relative; overflow: hidden;
  }
  .splash::before { content: ''; position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, var(--mint) 0%, transparent 70%); opacity: 0.4; }
  .splash::after { content: ''; position: absolute; bottom: -150px; left: -100px; width: 350px; height: 350px; background: radial-gradient(circle, var(--mint) 0%, transparent 70%); opacity: 0.2; }

  .logo-mark {
    width: 110px; height: 110px;
    background: var(--mint);
    border-radius: 28px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 28px;
    box-shadow: 0 16px 48px rgba(45, 212, 191, 0.4);
    transform: rotate(-3deg);
    position: relative; z-index: 2;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 56px; font-weight: 800; color: #0B1620;
    letter-spacing: -0.04em;
  }
  .splash h1 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 48px; font-weight: 700; letter-spacing: -0.04em; margin-bottom: 12px; position: relative; z-index: 2; }
  .splash .tag { font-size: 17px; color: rgba(255,255,255,0.7); text-align: center; line-height: 1.5; max-width: 280px; position: relative; z-index: 2; }
  .splash .bottom { position: absolute; bottom: 60px; left: 0; right: 0; display: flex; flex-direction: column; gap: 12px; padding: 0 28px; z-index: 2; }
  .btn-primary { background: var(--mint); color: var(--ink); padding: 18px; border-radius: 16px; font-weight: 700; font-size: 16px; text-align: center; border: none; cursor: pointer; }
  .btn-ghost { background: transparent; color: white; padding: 18px; border-radius: 16px; font-weight: 600; font-size: 15px; text-align: center; border: 1.5px solid rgba(255,255,255,0.2); }

  /* ============= SCREEN 2: HOME ============= */
  .home-screen { background: var(--cream); }
  .home-header { padding: 8px 0 24px; }
  .greeting { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .greeting-text { font-size: 14px; color: var(--text-soft); }
  .greeting-name { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: var(--ink); line-height: 1.1; margin-top: 2px; }
  .avatar { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--mint), var(--mint-dark)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; }
  .location-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: white; border: 1px solid var(--line); border-radius: 100px; font-size: 12px; color: var(--text-soft); margin-top: 12px; font-weight: 500; }

  .hero-card { background: var(--ink); border-radius: 22px; padding: 22px; color: white; margin-top: 20px; position: relative; overflow: hidden; }
  .hero-card::before { content: ''; position: absolute; right: -40px; bottom: -40px; width: 180px; height: 180px; background: radial-gradient(circle, var(--mint) 0%, transparent 70%); opacity: 0.5; }
  .hero-card h2 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; line-height: 1.2; font-weight: 700; max-width: 230px; position: relative; }
  .hero-card h2 span { color: var(--mint); }
  .hero-card p { font-size: 13px; opacity: 0.7; margin-top: 8px; max-width: 220px; position: relative; }
  .hero-cta { margin-top: 18px; display: inline-flex; align-items: center; gap: 6px; background: var(--mint); color: var(--ink); padding: 10px 16px; border-radius: 100px; font-weight: 700; font-size: 13px; position: relative; }

  .section-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 18px; font-weight: 700; color: var(--ink); margin: 24px 0 14px; letter-spacing: -0.01em; }

  .intent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .intent-card { background: white; border: 1px solid var(--line); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 6px; }
  .intent-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .intent-icon.pink { background: #FFE4E4; color: var(--accent-pink); }
  .intent-icon.mint { background: var(--mint-soft); color: var(--mint-dark); }
  .intent-icon.yellow { background: #FFF4D6; color: #B07500; }
  .intent-icon.dark { background: var(--ink); color: var(--mint); }
  .intent-name { font-size: 13px; font-weight: 700; color: var(--ink); margin-top: 4px; }
  .intent-sub { font-size: 11px; color: var(--text-soft); }

  /* ============= SCREEN 3: QUIZ ============= */
  .quiz-screen { background: var(--cream); display: flex; flex-direction: column; height: 100%; }
  .quiz-header { display: flex; align-items: center; gap: 14px; padding-bottom: 20px; }
  .back-btn { width: 40px; height: 40px; border-radius: 12px; background: white; border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; }
  .progress-track { flex: 1; height: 6px; background: var(--warm-gray); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; width: 60%; background: var(--mint); border-radius: 100px; }
  .progress-text { font-size: 12px; color: var(--text-soft); font-weight: 600; }

  .quiz-step { font-size: 12px; color: var(--mint-dark); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 12px; }
  .quiz-question { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin-top: 8px; line-height: 1.2; }
  .quiz-sub { color: var(--text-soft); font-size: 14px; margin-top: 8px; }

  .quiz-options { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
  .quiz-option { background: white; border: 1.5px solid var(--line); border-radius: 16px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; cursor: pointer; }
  .quiz-option.selected { border-color: var(--mint); background: var(--mint-soft); }
  .quiz-option-emoji { font-size: 24px; }
  .quiz-option-content { flex: 1; }
  .quiz-option-name { font-size: 15px; font-weight: 700; color: var(--ink); }
  .quiz-option-sub { font-size: 12px; color: var(--text-soft); margin-top: 2px; }
  .quiz-option-check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--line); display: flex; align-items: center; justify-content: center; }
  .quiz-option.selected .quiz-option-check { background: var(--mint); border-color: var(--mint); }

  .quiz-next { margin-top: auto; padding-top: 20px; }
  .btn-full { width: 100%; padding: 18px; background: var(--ink); color: white; border: none; border-radius: 16px; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; }

  /* ============= SCREEN 4: RESULTS ============= */
  .results-screen { background: var(--cream); }
  .results-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .search-pill { flex: 1; background: white; border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text); font-weight: 600; }
  .filter-btn { width: 44px; height: 44px; border-radius: 14px; background: var(--ink); color: var(--mint); display: flex; align-items: center; justify-content: center; position: relative; }
  .filter-badge { position: absolute; top: -3px; right: -3px; width: 18px; height: 18px; background: var(--mint); color: var(--ink); border-radius: 50%; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid var(--cream); }

  .active-filters { display: flex; gap: 6px; margin-bottom: 16px; overflow-x: auto; }
  .chip { background: var(--ink); color: white; padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 600; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
  .chip.mint { background: var(--mint); color: var(--ink); }
  .chip-x { font-size: 14px; opacity: 0.6; }

  .results-meta { font-size: 12px; color: var(--text-soft); margin-bottom: 12px; }
  .results-meta strong { color: var(--ink); font-weight: 700; }

  .place-card { background: white; border-radius: 18px; overflow: hidden; margin-bottom: 14px; border: 1px solid var(--line); }
  .place-image { height: 130px; background: linear-gradient(135deg, #FFB088, #FF6B6B); position: relative; }
  .place-image.green { background: linear-gradient(135deg, #88C9A1, #2DD4BF); }
  .place-image.yellow { background: linear-gradient(135deg, #FFD166, #FF9F1C); }
  .match-badge { position: absolute; top: 10px; left: 10px; background: white; padding: 6px 10px; border-radius: 100px; font-size: 11px; font-weight: 800; color: var(--mint-dark); display: flex; align-items: center; gap: 4px; }
  .heart-btn { position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; background: rgba(255,255,255,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .place-tags { position: absolute; bottom: 10px; left: 10px; display: flex; gap: 4px; flex-wrap: wrap; max-width: 250px; }
  .place-tag { background: rgba(11, 22, 32, 0.85); color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; backdrop-filter: blur(8px); }

  .place-info { padding: 14px; }
  .place-name-row { display: flex; justify-content: space-between; align-items: flex-start; }
  .place-name { font-family: 'Bricolage Grotesque', sans-serif; font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
  .place-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: var(--ink); }
  .place-meta { font-size: 12px; color: var(--text-soft); margin-top: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .meta-dot { width: 3px; height: 3px; background: var(--text-faint); border-radius: 50%; }

  /* ============= SCREEN 5: PLACE DETAIL ============= */
  .place-screen { background: var(--cream); }
  .place-cover { height: 240px; margin: -24px -20px 0; background: linear-gradient(135deg, #88C9A1, #2DD4BF); position: relative; }
  .cover-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: linear-gradient(transparent, rgba(11,22,32,0.6)); }
  .cover-nav { position: absolute; top: 12px; left: 14px; right: 14px; display: flex; justify-content: space-between; z-index: 5; }
  .cover-btn { width: 38px; height: 38px; background: rgba(255,255,255,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .cover-name { position: absolute; bottom: 14px; left: 16px; right: 16px; color: white; z-index: 5; }
  .cover-name h1 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1; }
  .cover-name-meta { font-size: 12px; opacity: 0.9; margin-top: 4px; display: flex; align-items: center; gap: 8px; }

  .place-quick-info { display: flex; gap: 10px; margin-top: 16px; }
  .quick-item { flex: 1; background: white; border: 1px solid var(--line); border-radius: 14px; padding: 10px 8px; text-align: center; }
  .quick-item-value { font-family: 'Bricolage Grotesque', sans-serif; font-size: 14px; font-weight: 700; color: var(--ink); }
  .quick-item-label { font-size: 10px; color: var(--text-soft); margin-top: 2px; }

  .features-section { margin-top: 18px; }
  .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .feature-tag { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: var(--ink); }
  .feature-tag .check { width: 16px; height: 16px; background: var(--mint); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .match-card { background: linear-gradient(135deg, var(--mint), var(--mint-dark)); border-radius: 16px; padding: 14px; color: white; margin-top: 16px; display: flex; align-items: center; gap: 12px; }
  .match-percent { font-family: 'Bricolage Grotesque', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; }
  .match-text { font-size: 12px; line-height: 1.3; opacity: 0.95; }
  .match-text strong { display: block; font-size: 14px; font-weight: 700; margin-bottom: 2px; opacity: 1; }

  .reserve-cta { position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 20px 28px; background: linear-gradient(transparent, white 30%); }
  .reserve-btn { width: 100%; padding: 18px; background: var(--ink); color: white; border: none; border-radius: 16px; font-weight: 700; font-size: 15px; display: flex; align-items: center; justify-content: space-between; }
  .reserve-btn .price { color: var(--mint); }

  /* ============= SCREEN 6: RESERVATION ============= */
  .reserve-screen { background: var(--cream); }
  .reserve-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 26px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin-top: 8px; line-height: 1.2; }
  .reserve-sub { color: var(--text-soft); font-size: 13px; margin-top: 6px; }

  .reserve-place-card { background: white; border: 1px solid var(--line); border-radius: 14px; padding: 12px; display: flex; align-items: center; gap: 12px; margin-top: 18px; }
  .reserve-place-img { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #88C9A1, #2DD4BF); flex-shrink: 0; }
  .reserve-place-name { font-weight: 700; font-size: 14px; color: var(--ink); }
  .reserve-place-meta { font-size: 11px; color: var(--text-soft); margin-top: 2px; }

  .field-group { margin-top: 20px; }
  .field-label { font-size: 12px; font-weight: 700; color: var(--ink); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .field-row { display: flex; gap: 8px; }
  .field-row .field-input { flex: 1; }
  .field-input { background: white; border: 1.5px solid var(--line); border-radius: 14px; padding: 14px; font-size: 14px; font-weight: 600; color: var(--ink); }
  .field-input.active { border-color: var(--mint); }
  .field-row.times { gap: 6px; }
  .time-pill { flex: 1; background: white; border: 1.5px solid var(--line); border-radius: 12px; padding: 10px; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink); }
  .time-pill.selected { background: var(--ink); color: white; border-color: var(--ink); }

  .counter-row { background: white; border: 1.5px solid var(--line); border-radius: 14px; padding: 14px; display: flex; align-items: center; justify-content: space-between; }
  .counter-row .label { font-size: 14px; font-weight: 700; color: var(--ink); }
  .counter-row .label small { display: block; font-size: 11px; color: var(--text-soft); font-weight: 500; margin-top: 1px; }
  .counter { display: flex; align-items: center; gap: 10px; }
  .counter-btn { width: 30px; height: 30px; border-radius: 50%; background: var(--warm-gray); border: none; font-weight: 700; font-size: 16px; color: var(--ink); }
  .counter-value { font-weight: 800; font-size: 16px; min-width: 18px; text-align: center; }

  .obs-input { background: white; border: 1.5px solid var(--line); border-radius: 14px; padding: 14px; font-size: 13px; color: var(--text-soft); min-height: 64px; }
  .obs-input strong { color: var(--ink); }

  .summary-bar { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px 28px; background: white; border-top: 1px solid var(--line); }
  .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 13px; }
  .summary-row strong { color: var(--ink); font-weight: 700; font-size: 14px; }

  .scroll-area { overflow-y: hidden; height: 100%; padding-bottom: 0; }

  /* ============= ANNOTATIONS ============= */
  .annotations-section { max-width: 1400px; margin: 80px auto 0; padding-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); }
  .annotations-section h2 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 36px; font-weight: 700; color: white; letter-spacing: -0.02em; margin-bottom: 32px; }
  .annotations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .annotation-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; }
  .annotation-num { font-family: 'Bricolage Grotesque', sans-serif; font-size: 28px; font-weight: 800; color: var(--mint); }
  .annotation-card h3 { color: white; font-size: 17px; font-weight: 700; margin-top: 8px; }
  .annotation-card p { color: var(--text-faint); font-size: 14px; line-height: 1.6; margin-top: 10px; }

  /* Icons inline */
  .icon { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .icon-lg { width: 22px; height: 22px; }
  .icon-sm { width: 14px; height: 14px; }

  @media (max-width: 1280px) {
    .frames-grid { grid-template-columns: repeat(2, 375px); }
  }
  @media (max-width: 880px) {
    .frames-grid { grid-template-columns: 375px; }
    .annotations-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<div class="board-header">
  <h1>Pakas <span>MVP</span></h1>
  <p>Showcase visual das telas-chave da versão 1. Cidade-piloto: Maringá. Stack: Lovable + Supabase. Identidade visual extraída do logo oficial (verde água + dark base).</p>
  <div class="meta">
    <div>6 telas principais</div>
    <div>Mobile-first 375px</div>
    <div>Plus Jakarta Sans + Bricolage Grotesque</div>
    <div>Maio 2026</div>
  </div>
</div>

<div class="frames-grid">

  <!-- ====== SCREEN 1: SPLASH / WELCOME ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>01</span>Boas-vindas</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar dark">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="splash">
        <div class="logo-mark">P</div>
        <h1>Pakas</h1>
        <p class="tag">Sair pra comer, beber ou curtir a cidade do jeito que você quer ficou simples Pakas.</p>
        <div class="bottom">
          <button class="btn-primary">Começar</button>
          <button class="btn-ghost">Já tenho conta</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== SCREEN 2: HOME ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>02</span>Home</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="screen-content home-screen">
        <div class="home-header">
          <div class="greeting">
            <div>
              <div class="greeting-text">Boa noite,</div>
              <div class="greeting-name">Lucas</div>
              <div class="location-pill">
                <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                Centro, Maringá
              </div>
            </div>
            <div class="avatar">L</div>
          </div>
        </div>

        <div class="hero-card">
          <h2>Do que você tá <span>afim hoje?</span></h2>
          <p>Responde 5 perguntas rápidas e a gente acha o lugar certo.</p>
          <div class="hero-cta">
            Começar
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </div>
        </div>

        <div class="section-title">Por ocasião</div>

        <div class="intent-grid">
          <div class="intent-card">
            <div class="intent-icon pink">♥</div>
            <div class="intent-name">Date romântico</div>
            <div class="intent-sub">Ambiente íntimo</div>
          </div>
          <div class="intent-card">
            <div class="intent-icon yellow">★</div>
            <div class="intent-name">Família</div>
            <div class="intent-sub">Com playground</div>
          </div>
          <div class="intent-card">
            <div class="intent-icon mint">♪</div>
            <div class="intent-name">Música ao vivo</div>
            <div class="intent-sub">Rolê agitado</div>
          </div>
          <div class="intent-card">
            <div class="intent-icon dark">●</div>
            <div class="intent-name">Reunião</div>
            <div class="intent-sub">Mesa pra grupo</div>
          </div>
        </div>
      </div>
      <div class="tabbar">
        <div class="tabbar-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Início
        </div>
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4-4"/></svg>
          Explorar
        </div>
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0-9 0c0 2.5 1.5 4.5 3 6l6 6z"/></svg>
          Favoritos
        </div>
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
          Eu
        </div>
      </div>
    </div>
  </div>

  <!-- ====== SCREEN 3: QUIZ ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>03</span>Quiz de descoberta</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="screen-content quiz-screen">
        <div class="quiz-header">
          <div class="back-btn">
            <svg class="icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
          <div class="progress-track"><div class="progress-fill"></div></div>
          <div class="progress-text">3/5</div>
        </div>

        <div class="quiz-step">Pergunta 3 de 5</div>
        <div class="quiz-question">Como você quer o ambiente?</div>
        <div class="quiz-sub">Pode escolher mais de um.</div>

        <div class="quiz-options">
          <div class="quiz-option selected">
            <div class="quiz-option-emoji">♥</div>
            <div class="quiz-option-content">
              <div class="quiz-option-name">Romântico e tranquilo</div>
              <div class="quiz-option-sub">Pouco barulho, mesa íntima</div>
            </div>
            <div class="quiz-option-check">
              <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="white"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
          </div>
          <div class="quiz-option">
            <div class="quiz-option-emoji">♪</div>
            <div class="quiz-option-content">
              <div class="quiz-option-name">Animado com música</div>
              <div class="quiz-option-sub">Som ao vivo, agitação</div>
            </div>
            <div class="quiz-option-check"></div>
          </div>
          <div class="quiz-option">
            <div class="quiz-option-emoji">★</div>
            <div class="quiz-option-content">
              <div class="quiz-option-name">Familiar</div>
              <div class="quiz-option-sub">Pra ir com crianças</div>
            </div>
            <div class="quiz-option-check"></div>
          </div>
          <div class="quiz-option">
            <div class="quiz-option-emoji">●</div>
            <div class="quiz-option-content">
              <div class="quiz-option-name">Sofisticado</div>
              <div class="quiz-option-sub">Pra ocasião especial</div>
            </div>
            <div class="quiz-option-check"></div>
          </div>
        </div>

        <div class="quiz-next">
          <button class="btn-full">
            Próxima
            <svg class="icon" viewBox="0 0 24 24" stroke="white"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ====== SCREEN 4: RESULTS ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>04</span>Resultados</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="screen-content results-screen">
        <div class="results-top">
          <div class="search-pill">
            <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="#64748B"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4-4"/></svg>
            Pra família com playground
          </div>
          <div class="filter-btn">
            <svg class="icon" viewBox="0 0 24 24"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
            <div class="filter-badge">4</div>
          </div>
        </div>

        <div class="active-filters">
          <div class="chip mint">Playground <span class="chip-x">×</span></div>
          <div class="chip">Aberto agora <span class="chip-x">×</span></div>
          <div class="chip">Até R$60 <span class="chip-x">×</span></div>
          <div class="chip">Estacionamento</div>
        </div>

        <div class="results-meta"><strong>12 lugares</strong> compatíveis em Maringá · ordenado por match</div>

        <div class="place-card">
          <div class="place-image yellow">
            <div class="match-badge">
              <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>
              94% match
            </div>
            <div class="heart-btn">
              <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="#0B1620" fill="none"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0-9 0c0 2.5 1.5 4.5 3 6l6 6z"/></svg>
            </div>
            <div class="place-tags">
              <span class="place-tag">Playground</span>
              <span class="place-tag">Mesa p/ grupo</span>
              <span class="place-tag">Estacionamento</span>
            </div>
          </div>
          <div class="place-info">
            <div class="place-name-row">
              <div class="place-name">Pizzaria Vila Verde</div>
              <div class="place-rating">★ 4.8</div>
            </div>
            <div class="place-meta">
              Pizzaria <span class="meta-dot"></span> R$45/pessoa <span class="meta-dot"></span> 1,2 km
            </div>
          </div>
        </div>

        <div class="place-card">
          <div class="place-image green">
            <div class="match-badge">
              <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>
              87% match
            </div>
            <div class="heart-btn">
              <svg class="icon icon-sm" viewBox="0 0 24 24" stroke="#0B1620" fill="none"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0-9 0c0 2.5 1.5 4.5 3 6l6 6z"/></svg>
            </div>
            <div class="place-tags">
              <span class="place-tag">Área kids</span>
              <span class="place-tag">Cardápio infantil</span>
            </div>
          </div>
          <div class="place-info">
            <div class="place-name-row">
              <div class="place-name">Quintal do Lima</div>
              <div class="place-rating">★ 4.6</div>
            </div>
            <div class="place-meta">
              Boteco <span class="meta-dot"></span> R$50/pessoa <span class="meta-dot"></span> 2,8 km
            </div>
          </div>
        </div>
      </div>
      <div class="tabbar">
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Início
        </div>
        <div class="tabbar-item active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4-4"/></svg>
          Explorar
        </div>
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0-9 0c0 2.5 1.5 4.5 3 6l6 6z"/></svg>
          Favoritos
        </div>
        <div class="tabbar-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
          Eu
        </div>
      </div>
    </div>
  </div>

  <!-- ====== SCREEN 5: PLACE DETAIL ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>05</span>Página do lugar</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar dark">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="screen-content place-screen">
        <div class="place-cover">
          <div class="cover-overlay"></div>
          <div class="cover-nav">
            <div class="cover-btn">
              <svg class="icon" viewBox="0 0 24 24" stroke="#0B1620"><path d="M15 18l-6-6 6-6"/></svg>
            </div>
            <div class="cover-btn">
              <svg class="icon" viewBox="0 0 24 24" stroke="#0B1620" fill="none"><path d="M19 14c1.5-1.5 3-3.5 3-6a4.5 4.5 0 0 0-9 0 4.5 4.5 0 0 0-9 0c0 2.5 1.5 4.5 3 6l6 6z"/></svg>
            </div>
          </div>
          <div class="cover-name">
            <h1>Pizzaria Vila Verde</h1>
            <div class="cover-name-meta">
              <span>★ 4.8 · 312 avaliações</span>
              <span class="meta-dot"></span>
              <span>Aberto agora</span>
            </div>
          </div>
        </div>

        <div class="place-quick-info">
          <div class="quick-item">
            <div class="quick-item-value">R$45</div>
            <div class="quick-item-label">por pessoa</div>
          </div>
          <div class="quick-item">
            <div class="quick-item-value">15min</div>
            <div class="quick-item-label">preparo</div>
          </div>
          <div class="quick-item">
            <div class="quick-item-value">1,2km</div>
            <div class="quick-item-label">de você</div>
          </div>
        </div>

        <div class="match-card">
          <div class="match-percent">94%</div>
          <div class="match-text">
            <strong>Bate com o que você quer</strong>
            Playground, mesa pra grupo, estacionamento e ticket dentro da sua faixa.
          </div>
        </div>

        <div class="features-section">
          <div class="section-title" style="margin: 16px 0 0;">Estrutura</div>
          <div class="features-grid">
            <div class="feature-tag">
              <div class="check"><svg class="icon icon-sm" viewBox="0 0 24 24" stroke="white"><path d="M20 6L9 17l-5-5"/></svg></div>
              Playground
            </div>
            <div class="feature-tag">
              <div class="check"><svg class="icon icon-sm" viewBox="0 0 24 24" stroke="white"><path d="M20 6L9 17l-5-5"/></svg></div>
              Mesa p/ 10+
            </div>
            <div class="feature-tag">
              <div class="check"><svg class="icon icon-sm" viewBox="0 0 24 24" stroke="white"><path d="M20 6L9 17l-5-5"/></svg></div>
              Estacionamento
            </div>
            <div class="feature-tag">
              <div class="check"><svg class="icon icon-sm" viewBox="0 0 24 24" stroke="white"><path d="M20 6L9 17l-5-5"/></svg></div>
              Cardápio infantil
            </div>
          </div>
        </div>
      </div>
      <div class="reserve-cta">
        <button class="reserve-btn">
          Reservar mesa
          <span class="price">R$45/pessoa</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ====== SCREEN 6: RESERVATION ====== -->
  <div class="frame-wrapper">
    <div class="frame-label"><span>06</span>Reserva</div>
    <div class="phone">
      <div class="notch"></div>
      <div class="status-bar">
        <span>9:41</span>
        <div class="status-icons">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M2 12h2M6 8v8M10 4v16M14 6v12M18 10v4M22 12h-2"/></svg>
          <svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4"/></svg>
        </div>
      </div>
      <div class="screen-content reserve-screen">
        <div class="quiz-header" style="padding-bottom: 4px;">
          <div class="back-btn">
            <svg class="icon" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </div>
        </div>

        <div class="reserve-title">Sua reserva</div>
        <div class="reserve-sub">A gente avisa o restaurante. Você só chega.</div>

        <div class="reserve-place-card">
          <div class="reserve-place-img"></div>
          <div>
            <div class="reserve-place-name">Pizzaria Vila Verde</div>
            <div class="reserve-place-meta">Centro · 1,2km · ★ 4.8</div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Quando</div>
          <div class="field-row">
            <div class="field-input active">Hoje, qui · 21 mai</div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Horário</div>
          <div class="field-row times">
            <div class="time-pill">19:00</div>
            <div class="time-pill selected">19:30</div>
            <div class="time-pill">20:00</div>
            <div class="time-pill">20:30</div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Pessoas</div>
          <div class="counter-row">
            <div class="label">Adultos<small>13 anos ou mais</small></div>
            <div class="counter">
              <button class="counter-btn">−</button>
              <span class="counter-value">4</span>
              <button class="counter-btn">+</button>
            </div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">Crianças</div>
          <div class="counter-row">
            <div class="label">Crianças<small>até 12 anos</small></div>
            <div class="counter">
              <button class="counter-btn">−</button>
              <span class="counter-value">2</span>
              <button class="counter-btn">+</button>
            </div>
          </div>
        </div>
      </div>
      <div class="summary-bar">
        <div class="summary-row">
          <span style="color: var(--text-soft);">Mesa pra <strong>6 pessoas</strong> hoje às <strong>19:30</strong></span>
        </div>
        <button class="btn-full" style="background: var(--mint); color: var(--ink);">Confirmar reserva</button>
      </div>
    </div>
  </div>

</div>

<div class="annotations-section">
  <h2>Notas de design</h2>
  <div class="annotations-grid">
    <div class="annotation-card">
      <div class="annotation-num">01</div>
      <h3>Identidade fiel ao logo</h3>
      <p>Verde água (#2DD4BF) como cor de ação e match. Ink dark (#0B1620) como fundo de contraste e CTA secundário. Cream (#FAFAF7) como fundo principal para leitura confortável.</p>
    </div>
    <div class="annotation-card">
      <div class="annotation-num">02</div>
      <h3>Match como protagonista</h3>
      <p>Cada card de lugar mostra o % de compatibilidade no canto superior esquerdo. Isso é o que diferencia Pakas de tudo que existe — não é avaliação genérica, é "quanto este lugar bate com o que você pediu".</p>
    </div>
    <div class="annotation-card">
      <div class="annotation-num">03</div>
      <h3>Tipografia com personalidade</h3>
      <p>Bricolage Grotesque para títulos (display, característico, jovem). Plus Jakarta Sans para corpo (legível, moderno, com peso). Fontes que diferenciam o Pakas de qualquer app brasileiro existente.</p>
    </div>
    <div class="annotation-card">
      <div class="annotation-num">04</div>
      <h3>Filtros como peças manipuláveis</h3>
      <p>Chips horizontais que o usuário adiciona/remove com um toque. Filtro ativo em verde água, inativo em dark. O ato de filtrar fica visualmente claro e gratificante.</p>
    </div>
    <div class="annotation-card">
      <div class="annotation-num">05</div>
      <h3>Hierarquia clara nos cards</h3>
      <p>Foto grande, match em destaque, tags de contexto sobre a imagem (playground, mesa grupo, estacionamento), nome e meta (categoria · preço · distância). Tudo legível em 2 segundos.</p>
    </div>
    <div class="annotation-card">
      <div class="annotation-num">06</div>
      <h3>Reserva sem fricção</h3>
      <p>Formulário curto com defaults inteligentes (hoje, próximo slot, 2 adultos). Pills de horário ao invés de timepicker. Counters grandes pra adultos/crianças. Confirmação em verde água, alto contraste.</p>
    </div>
  </div>
</div>

</body>
</html>