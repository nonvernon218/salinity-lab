/* =========================================================
   盐度实验室 · 交互逻辑
   水族箱用 Canvas 绘制，素材用 SVG 转 Image 后绘制
   ========================================================= */
'use strict';

/* ---------- 1. 素材定义（SVG 内联，尺寸 64x64 视口） ---------- */
const ART = {
  rock: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="rk" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="#9aa8b4"/><stop offset="0.55" stop-color="#6d7b88"/><stop offset="1" stop-color="#43505c"/>
    </linearGradient></defs>
    <path d="M8 48 C6 40 10 30 18 26 C26 22 34 24 40 22 C48 19 56 24 57 32 C58 40 53 48 46 50 C36 53 16 53 8 48 Z" fill="url(#rk)"/>
    <path d="M18 26 C26 22 34 24 40 22 C46 20 52 22 55 26 C48 25 42 27 36 29 C28 32 22 30 18 26 Z" fill="#b3c0cb" opacity="0.55"/>
    <ellipse cx="24" cy="36" rx="5" ry="3" fill="#3b4854" opacity="0.35"/>
    <ellipse cx="44" cy="41" rx="3.5" ry="2.2" fill="#3b4854" opacity="0.28"/>
  </svg>`,

  plant: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="pl" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#5ee8a8"/><stop offset="1" stop-color="#158a5e"/>
    </linearGradient>
    <linearGradient id="pl2" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#8ef7c4"/><stop offset="1" stop-color="#1d9c69"/>
    </linearGradient></defs>
    <path d="M31 62 C31 46 28 34 22 24 C17 16 18 8 21 3 C27 8 30 16 31 24 C32 16 36 9 42 4 C45 11 43 20 37 28 C33 34 32 46 32 62 Z" fill="url(#pl)"/>
    <path d="M22 24 C18 32 12 36 6 37 C8 30 14 25 22 24 Z" fill="url(#pl2)"/>
    <path d="M37 28 C41 35 47 38 53 38 C50 31 45 27 37 28 Z" fill="url(#pl2)"/>
    <path d="M31 62 C31 50 30 44 26 38" stroke="#a8ffd8" stroke-width="1.4" fill="none" opacity="0.5"/>
  </svg>`,

  shell: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="sh" cx="0.36" cy="0.3" r="0.8">
      <stop offset="0" stop-color="#fff4e2"/><stop offset="0.55" stop-color="#f2cfae"/><stop offset="1" stop-color="#c99b78"/>
    </radialGradient></defs>
    <path d="M32 56 C16 56 8 42 12 28 C16 15 26 8 32 8 C38 8 48 15 52 28 C56 42 48 56 32 56 Z" fill="url(#sh)"/>
    <path d="M32 52 L32 12 M32 52 C24 44 18 32 20 14 M32 52 C40 44 46 32 44 14 M32 52 C20 50 12 38 14 22 M32 52 C44 50 52 38 50 22" stroke="#c2946f" stroke-width="1.6" fill="none" opacity="0.62"/>
    <path d="M20 50 C28 53 38 53 45 49 L44 55 C38 58 26 58 21 55 Z" fill="#b8855f"/>
  </svg>`,

  /* 鹿角珊瑚：分叉向上生长，粉橘过渡 */
  coral: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="coA" x1="0" y1="1" x2="0.3" y2="0">
        <stop offset="0" stop-color="#c2547a"/>
        <stop offset="0.5" stop-color="#e87a9a"/>
        <stop offset="1" stop-color="#ffb3c8"/>
      </linearGradient>
      <linearGradient id="coB" x1="0" y1="1" x2="0.4" y2="0">
        <stop offset="0" stop-color="#b8476e"/>
        <stop offset="1" stop-color="#f79ab4"/>
      </linearGradient>
    </defs>
    <!-- 主干与分枝 -->
    <path d="M32 62 C31 52 29 46 25 40 C21 34 19 26 20 18"
          stroke="url(#coA)" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M32 62 C33 52 35 45 39 39 C43 33 45 25 44 17"
          stroke="url(#coA)" stroke-width="7.5" stroke-linecap="round" fill="none"/>
    <path d="M32 50 C32 42 33 36 32 28" stroke="url(#coB)" stroke-width="6" stroke-linecap="round" fill="none"/>
    <!-- 侧枝 -->
    <path d="M25 40 C20 36 15 34 11 30" stroke="url(#coB)" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M39 39 C44 36 49 34 53 31" stroke="url(#coB)" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M20 26 C16 22 13 20 9 17" stroke="url(#coB)" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <path d="M44 25 C48 21 51 19 55 16" stroke="url(#coB)" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <!-- 顶端小球（珊瑚虫触手） -->
    <g fill="#ffd0dd">
      <circle cx="20" cy="17.5" r="4.2"/><circle cx="44" cy="16.5" r="4.2"/>
      <circle cx="32" cy="27" r="3.6"/><circle cx="10.5" cy="29.5" r="3.4"/>
      <circle cx="53.5" cy="30.5" r="3.4"/><circle cx="8.5" cy="16.5" r="3"/>
      <circle cx="55.5" cy="15.5" r="3"/>
    </g>
    <g fill="#ffffff" opacity="0.55">
      <circle cx="19" cy="16" r="1.4"/><circle cx="43" cy="15" r="1.4"/>
      <circle cx="31" cy="25.8" r="1.2"/><circle cx="9.5" cy="28.5" r="1.1"/>
    </g>
    <!-- 底部基座 -->
    <ellipse cx="32" cy="61" rx="13" ry="3.4" fill="#8e3556" opacity="0.55"/>
  </svg>`,

  wood: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="wd" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#a9794d"/><stop offset="0.5" stop-color="#7a4f2c"/><stop offset="1" stop-color="#4e3018"/>
    </linearGradient></defs>
    <path d="M10 54 C14 40 22 32 30 20 C34 14 42 10 48 12 C54 14 52 24 46 30 C38 38 30 46 26 56 C20 58 12 58 10 54 Z" fill="url(#wd)"/>
    <path d="M18 50 C22 38 28 30 34 22 C38 17 44 14 48 15" stroke="#c79a6b" stroke-width="1.8" fill="none" opacity="0.55"/>
    <path d="M14 40 C18 36 24 34 30 32" stroke="#3c2411" stroke-width="1.1" fill="none" opacity="0.4"/>
    <path d="M36 44 C40 36 44 30 48 26" stroke="#3c2411" stroke-width="1.1" fill="none" opacity="0.35"/>
  </svg>`,

  sand: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7e6c4"/><stop offset="1" stop-color="#d3b184"/>
    </linearGradient></defs>
    <path d="M4 42 C16 34 26 42 36 38 C46 34 54 40 60 38 L60 60 L4 60 Z" fill="url(#sd)"/>
    <circle cx="16" cy="48" r="1.8" fill="#b99364" opacity="0.65"/>
    <circle cx="28" cy="52" r="2.2" fill="#e0c49a" opacity="0.9"/>
    <circle cx="40" cy="47" r="1.6" fill="#b99364" opacity="0.6"/>
    <circle cx="50" cy="53" r="2" fill="#e8cfa8" opacity="0.85"/>
    <circle cx="34" cy="42" r="1.3" fill="#fff2d8" opacity="0.9"/>
  </svg>`,

  fish: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="fh" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#7fd8ff"/><stop offset="0.5" stop-color="#3a9fe0"/><stop offset="1" stop-color="#1f6fa8"/>
    </linearGradient></defs>
    <path d="M44 30 C50 24 56 20 60 20 C57 26 57 34 60 40 C55 40 49 36 44 31 Z" fill="#2c86c4"/>
    <path d="M8 30 C16 20 32 18 44 26 C46 30 46 31 44 35 C32 43 16 41 8 30 Z" fill="url(#fh)"/>
    <path d="M26 21 C30 14 36 15 34 22 Z" fill="#3a9fe0"/>
    <circle cx="17" cy="28" r="2.6" fill="#fff"/><circle cx="17.5" cy="28.4" r="1.4" fill="#0b2c42"/>
    <path d="M10 30 C12 30 12 30 10 31" stroke="#0b2c42" stroke-width="1.4" fill="none"/>
    <path d="M22 32 C27 34 33 34 38 32" stroke="#9fe4ff" stroke-width="1.2" fill="none" opacity="0.55"/>
  </svg>`,

  bubble: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bm" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#b8ccd8"/><stop offset="0.5" stop-color="#7d94a4"/><stop offset="1" stop-color="#4d616f"/>
      </linearGradient>
      <radialGradient id="bb2" cx="0.34" cy="0.28" r="0.72">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="0.5" stop-color="#bdeaff" stop-opacity="0.45"/>
        <stop offset="1" stop-color="#6ec8ef" stop-opacity="0.2"/>
      </radialGradient>
    </defs>
    <!-- 气石（发泡条） -->
    <rect x="26" y="40" width="13" height="19" rx="5" fill="url(#bm)"/>
    <circle cx="30" cy="46" r="1.1" fill="#3d505c"/><circle cx="35" cy="49" r="1.1" fill="#3d505c"/>
    <circle cx="30" cy="53" r="1.1" fill="#3d505c"/><circle cx="35" cy="55" r="1" fill="#3d505c"/>
    <!-- 上升气泡 -->
    <circle cx="32" cy="28" r="7" fill="url(#bb2)" stroke="#d6f4ff" stroke-width="1.4" stroke-opacity="0.9"/>
    <circle cx="44" cy="16" r="4.6" fill="url(#bb2)" stroke="#d6f4ff" stroke-width="1.2" stroke-opacity="0.8"/>
    <circle cx="21" cy="14" r="3.4" fill="url(#bb2)" stroke="#d6f4ff" stroke-width="1.1" stroke-opacity="0.7"/>
    <circle cx="50" cy="34" r="2.8" fill="url(#bb2)" stroke="#d6f4ff" stroke-width="1" stroke-opacity="0.65"/>
    <ellipse cx="29.5" cy="25.5" rx="2.1" ry="1.5" fill="#fff" opacity="0.85" transform="rotate(-28 29.5 25.5)"/>
  </svg>`,

  /* 中华绒螯蟹（大闸蟹）：正面视角，青绿色蟹壳、橘黄绒毛蟹钳 */
  crab: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cbShell" cx="0.38" cy="0.26" r="0.85">
        <stop offset="0" stop-color="#a8cfc2"/>
        <stop offset="0.38" stop-color="#5f9c8c"/>
        <stop offset="0.72" stop-color="#356c62"/>
        <stop offset="1" stop-color="#1d443f"/>
      </radialGradient>
      <linearGradient id="cbClaw" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#f2a15e"/>
        <stop offset="0.5" stop-color="#d97a35"/>
        <stop offset="1" stop-color="#a44b1c"/>
      </linearGradient>
      <linearGradient id="cbHair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7d9a8"/>
        <stop offset="1" stop-color="#c98f4e"/>
      </linearGradient>
      <linearGradient id="cbLeg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#7bb3a4"/>
        <stop offset="1" stop-color="#2b5a52"/>
      </linearGradient>
      <radialGradient id="cbGloss" cx="0.35" cy="0.22" r="0.5">
        <stop offset="0" stop-color="#e8fff7" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#e8fff7" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 八条步足（左右各四，带关节） -->
    <g stroke="url(#cbLeg)" stroke-width="4.6" stroke-linecap="round" fill="none">
      <path d="M22 52 L10 58 L4 70"/>
      <path d="M24 58 L14 66 L10 79"/>
      <path d="M74 52 L86 58 L92 70"/>
      <path d="M72 58 L82 66 L86 79"/>
    </g>
    <g stroke="#1b3d38" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.5">
      <path d="M22 52 L10 58 L4 70"/>
      <path d="M24 58 L14 66 L10 79"/>
      <path d="M74 52 L86 58 L92 70"/>
      <path d="M72 58 L82 66 L86 79"/>
    </g>
    <!-- 后腿（更暗，制造层次） -->
    <g stroke="#20463f" stroke-width="3.6" stroke-linecap="round" fill="none" opacity="0.8">
      <path d="M26 46 L18 34 L20 24"/>
      <path d="M70 46 L78 34 L76 24"/>
    </g>

    <!-- 蟹钳（中华绒螯蟹标志性的绒螯——钳上覆绒毛） -->
    <!-- 左螯 -->
    <path d="M30 50 C20 46 13 38 12 30" stroke="url(#cbLeg)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="10" cy="24" rx="6.5" ry="8" fill="url(#cbClaw)" transform="rotate(-18 10 24)"/>
    <path d="M4 20 C1 15 3 10 8 9 C12 8 14 12 13 17 Z" fill="url(#cbClaw)"/>
    <path d="M15 19 C18 13 15 8 9 8" stroke="#8c3d13" stroke-width="1.5" fill="none" opacity="0.7"/>
    <ellipse cx="10" cy="27" rx="5.6" ry="4.2" fill="url(#cbHair)" opacity="0.85"/>
    <!-- 右螯 -->
    <path d="M66 50 C76 46 83 38 84 30" stroke="url(#cbLeg)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="86" cy="24" rx="6.5" ry="8" fill="url(#cbClaw)" transform="rotate(18 86 24)"/>
    <path d="M92 20 C95 15 93 10 88 9 C84 8 82 12 83 17 Z" fill="url(#cbClaw)"/>
    <path d="M81 19 C78 13 81 8 87 8" stroke="#8c3d13" stroke-width="1.5" fill="none" opacity="0.7"/>
    <ellipse cx="86" cy="27" rx="5.6" ry="4.2" fill="url(#cbHair)" opacity="0.85"/>

    <!-- 蟹壳：宽扁的圆形背甲 -->
    <path d="M20 50 C20 34 32 24 48 24 C64 24 76 34 76 50 C76 64 64 72 48 72 C32 72 20 64 20 50 Z" fill="url(#cbShell)"/>
    <!-- 背甲上的斑纹与分区线 -->
    <path d="M48 26 L48 40 M34 34 C40 40 42 44 42 52 M62 34 C56 40 54 44 54 52"
          stroke="#1c423d" stroke-width="1.6" fill="none" opacity="0.45" stroke-linecap="round"/>
    <ellipse cx="36" cy="44" rx="5" ry="3.4" fill="#a8d4c6" opacity="0.28"/>
    <ellipse cx="60" cy="44" rx="5" ry="3.4" fill="#a8d4c6" opacity="0.28"/>
    <!-- 高光 -->
    <ellipse cx="38" cy="34" rx="13" ry="8" fill="url(#cbGloss)" transform="rotate(-16 38 34)"/>
    <!-- 前缘锯齿 -->
    <path d="M24 42 L20 39 L25 37 L21 34" stroke="#16332f" stroke-width="1.4" fill="none" opacity="0.5"/>
    <path d="M72 42 L76 39 L71 37 L75 34" stroke="#16332f" stroke-width="1.4" fill="none" opacity="0.5"/>

    <!-- 眼睛（眼柄 + 黑瞳 + 高光） -->
    <rect x="36" y="31" width="5" height="9" rx="2.5" fill="#2e6259"/>
    <rect x="55" y="31" width="5" height="9" rx="2.5" fill="#2e6259"/>
    <circle cx="38.5" cy="31" r="4.6" fill="#0c1f26"/>
    <circle cx="57.5" cy="31" r="4.6" fill="#0c1f26"/>
    <circle cx="37.3" cy="29.4" r="1.6" fill="#ffffff" opacity="0.95"/>
    <circle cx="56.3" cy="29.4" r="1.6" fill="#ffffff" opacity="0.95"/>

    <!-- 口部 -->
    <path d="M42 58 C45 61 51 61 54 58" stroke="#12302c" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.75"/>
    <path d="M44 63 C46 65 50 65 52 63" stroke="#12302c" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.45"/>
  </svg>`,

  /* 蟹苗：同一画风，更圆更小，壳色略浅（幼体刚变态的稚蟹） */
  crabling: `<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="clShell" cx="0.38" cy="0.24" r="0.86">
        <stop offset="0" stop-color="#c6e6db"/>
        <stop offset="0.4" stop-color="#7fb5a7"/>
        <stop offset="0.75" stop-color="#4a8177"/>
        <stop offset="1" stop-color="#2b544d"/>
      </radialGradient>
      <linearGradient id="clClaw" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#f7bd85"/>
        <stop offset="0.5" stop-color="#e2924c"/>
        <stop offset="1" stop-color="#b2602a"/>
      </linearGradient>
      <linearGradient id="clHair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fae3bd"/>
        <stop offset="1" stop-color="#d3a269"/>
      </linearGradient>
      <linearGradient id="clLeg" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="#9cc9bc"/>
        <stop offset="1" stop-color="#3c6b62"/>
      </linearGradient>
      <radialGradient id="clGloss" cx="0.35" cy="0.22" r="0.5">
        <stop offset="0" stop-color="#f2fffb" stop-opacity="0.6"/>
        <stop offset="1" stop-color="#f2fffb" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- 步足 -->
    <g stroke="url(#clLeg)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M28 60 L18 66 L13 76"/>
      <path d="M30 66 L22 73 L19 83"/>
      <path d="M68 60 L78 66 L83 76"/>
      <path d="M66 66 L74 73 L77 83"/>
    </g>
    <!-- 螯 -->
    <path d="M34 58 C26 55 20 49 19 42" stroke="url(#clLeg)" stroke-width="5.4" stroke-linecap="round" fill="none"/>
    <ellipse cx="18" cy="37" rx="5.4" ry="6.6" fill="url(#clClaw)" transform="rotate(-18 18 37)"/>
    <path d="M13 34 C11 30 12 26 16 25 C19 24 21 27 20 31 Z" fill="url(#clClaw)"/>
    <ellipse cx="18" cy="39.5" rx="4.6" ry="3.4" fill="url(#clHair)" opacity="0.85"/>
    <path d="M62 58 C70 55 76 49 77 42" stroke="url(#clLeg)" stroke-width="5.4" stroke-linecap="round" fill="none"/>
    <ellipse cx="78" cy="37" rx="5.4" ry="6.6" fill="url(#clClaw)" transform="rotate(18 78 37)"/>
    <path d="M83 34 C85 30 84 26 80 25 C77 24 75 27 76 31 Z" fill="url(#clClaw)"/>
    <ellipse cx="78" cy="39.5" rx="4.6" ry="3.4" fill="url(#clHair)" opacity="0.85"/>

    <!-- 背甲：更圆润 -->
    <path d="M24 58 C24 42 34 32 48 32 C62 32 72 42 72 58 C72 71 62 79 48 79 C34 79 24 71 24 58 Z" fill="url(#clShell)"/>
    <path d="M48 34 L48 46 M35 41 C40 46 42 50 42 57 M61 41 C56 46 54 50 54 57"
          stroke="#26514a" stroke-width="1.5" fill="none" opacity="0.38" stroke-linecap="round"/>
    <ellipse cx="38" cy="41" rx="11" ry="7" fill="url(#clGloss)" transform="rotate(-16 38 41)"/>

    <!-- 眼睛（蟹苗眼睛比例更大，显萌） -->
    <rect x="37" y="37" width="4.4" height="8" rx="2.2" fill="#3f7a6f"/>
    <rect x="54.6" y="37" width="4.4" height="8" rx="2.2" fill="#3f7a6f"/>
    <circle cx="39.2" cy="37" r="5" fill="#0c1f26"/>
    <circle cx="56.8" cy="37" r="5" fill="#0c1f26"/>
    <circle cx="37.9" cy="35.2" r="1.8" fill="#ffffff" opacity="0.96"/>
    <circle cx="55.5" cy="35.2" r="1.8" fill="#ffffff" opacity="0.96"/>

    <path d="M43 66 C46 68.5 50 68.5 53 66" stroke="#14332e" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  </svg>`
};

/* ---------- 2. 可从托盘拖出的物品清单 ---------- */
const PALETTE = [
  { k:'rock',  name:'鹅卵石', w:95,  h:62,  label:'石头' },
  { k:'plant', name:'水草',   w:78,  h:120, label:'水草' },
  { k:'shell', name:'贝壳',   w:58,  h:58,  label:'贝壳' },
  { k:'coral', name:'珊瑚',   w:74,  h:86,  label:'珊瑚' },
  { k:'wood',  name:'沉木',   w:100, h:86,  label:'沉木' },
  { k:'sand',  name:'彩砂',   w:110, h:64,  label:'彩砂' },
  { k:'fish',  name:'小鱼',   w:82,  h:56,  label:'小鱼' },
  { k:'bubble',name:'气泡石', w:56,  h:62,  label:'气泵' }
];

/* ---------- 3. 盐度分带（依据中华绒螯蟹溞状幼体适盐范围）
   溞状幼体适盐 8‰–33‰，最适 13‰–26‰，育苗生产常用 25‰ 左右 ---------- */
const SO = 1.025;
const BANDS = [
  { max:8,     key:'fresh', cls:'v-fresh', em:'🚫', t:'无法孵化',  s:'盐度太低，蟹卵无法正常发育',
    dot:'#6fa9c8' },
  { max:13,    key:'brack', cls:'v-brack', em:'⚠️', t:'勉强可以', s:'刚到孵化下限，只有零星蟹苗成活',
    dot:'#5fd4c4' },
  { max:30.01, key:'good',  cls:'v-good',  em:'🦀', t:'可以产蟹！', s:'盐度理想，大小蟹一同出现，越往中间越多',
    dot:'#5fefc0' },
  { max:33.01, key:'high',  cls:'v-high',  em:'😣', t:'蟹群变少',  s:'偏咸，幼体要耗能量排盐，成活数下降',
    dot:'#ffc37a' },
  { max:999,   key:'die',   cls:'v-die',   em:'☠️', t:'活不下来',  s:'超过耐受上限，幼体无法存活',
    dot:'#ff8b9e' }
];
const bandOf = s => BANDS.find(b => s < b.max) || BANDS[BANDS.length-1];

/* 水体类型的通俗叫法 */
function waterName(s){
  if (s < 0.5)  return '淡水 · 湖泊河流';
  if (s < 8)    return '淡水偏咸 · 仍不适蟹';
  if (s < 13)   return '微咸水 · 刚入河口';
  if (s <= 30)  return '半咸水 · 最适区间';
  if (s <= 33)  return '高盐半咸水';
  return '接近海水 · 太咸';
}

/* ---------- 4. 图像预加载 ---------- */
const IMGS = {};

/* 螃蟹用位图素材（AI 生成的卡通蟹，已抠透明底） */
const CRAB_ART = {
  crab:     'assets/crab_out.png',      // 成蟹
  crabling: 'assets/crabling_out.png'   // 蟹苗
};

function loadArt(){
  const jobs = [];

  // SVG 素材
  Object.keys(ART).forEach(k => {
    jobs.push(new Promise(res => {
      const im = new Image();
      im.onload = () => { IMGS[k] = im; res(); };
      im.onerror = () => res();
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ART[k]);
    }));
  });

  // 位图素材（必须等全部加载完，否则首次绘制会缺图）
  Object.keys(CRAB_ART).forEach(k => {
    jobs.push(new Promise(res => {
      const im = new Image();
      im.onload = () => { IMGS[k] = im; res(); };
      im.onerror = () => { console.warn('螃蟹素材加载失败:', CRAB_ART[k]); res(); };
      im.src = CRAB_ART[k];
    }));
  });

  return Promise.all(jobs);
}

/* ---------- 5. Canvas 与场景 ---------- */
const cv = document.getElementById('tank');
const ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
const WATER_TOP = 0.055;      // 水面位置（占高度比例）

const scene = {
  placed: [],                 // 已放置物品
  fish: [],                   // 小鱼（会游动）
  bubbles: [],                // 气泡颗粒
  crabs: [],                  // 小螃蟹群体
  salt: 0,                    // 当前盐度 ‰
  saltDisplay: 0,             // 平滑显示用
  t: 0,
  sandH: 46,                  // 砂层高度（px，按逻辑尺寸算）
  lightRays: []
};

/* 逻辑尺寸 = css 像素 */
let prevW = 0, prevH = 0;
function resize(){
  const frame = cv.parentElement;           // .tankframe
  const col = frame.parentElement;          // .tankcol
  const bar = col.querySelector('.tankbar');

  // 画布宽度取列容器宽度；高度直接用视口推算（stage 高度 = 100vh - 165px，小屏 -158px）
  const colRect = col.getBoundingClientRect();
  const barH = bar ? bar.getBoundingClientRect().height + 10 : 32;
  const narrow = window.innerWidth <= 1450;
  const short  = window.innerHeight <= 800;   // 与 CSS @media (max-height:800px) 对齐
  const vh = window.innerHeight || 800;
  const stageH = short ? Math.max(420, vh - 128)
               : narrow ? Math.max(470, vh - 148)
               : Math.max(540, vh - 165);

  const cssW = Math.max(400, Math.floor(colRect.width));
  const cssH = Math.max(300, Math.floor(stageH - barH));

  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cssW; H = cssH;
  cv.style.width = W + 'px';
  cv.style.height = H + 'px';
  cv.width = Math.floor(W * DPR);
  cv.height = Math.floor(H * DPR);
  frame.style.height = (H + 2) + 'px';      // 让水箱边框紧贴画布
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  scene.sandH = Math.round(H * 0.075);

  // 水底物品重新贴合底床，水中物品按比例换算坐标
  if (prevW && prevH){
    const sx = W / prevW, sy = H / prevH;
    scene.placed.forEach(p => {
      p.x = Math.max(p.w * 0.5 + 6, Math.min(W - p.w * 0.5 - 6, p.x * sx));
      if (p.isSand){
        p.y = H - scene.sandH * 0.42;
      } else if (p.ground){
        p.y = H - scene.sandH - p.h * 0.34;
      } else {
        p.y = Math.max(waterY() + p.h * 0.5 + 20, Math.min(H - scene.sandH - p.h * 0.3, p.y * sy));
      }
    });
    scene.fish.forEach(f => { f.y = f.y * sy; });
    scene.crabs.forEach(c => { c.x *= sx; });
  }
  prevW = W; prevH = H;

  scene.crabs.forEach(c => {
    c.y = crabRestY(c.kind, c);
  });
  buildRays();
  if (!scene.bubbles.length) buildBubbles(true);
}

function buildRays(){
  scene.lightRays = [];
  for (let i = 0; i < 5; i++){
    scene.lightRays.push({
      x: (0.08 + i * 0.2 + Math.random() * 0.06) * W,
      w: (0.04 + Math.random() * 0.055) * W,
      skew: (Math.random() - 0.5) * 0.34,
      a: 0.05 + Math.random() * 0.075,
      ph: Math.random() * Math.PI * 2,
      sp: 0.25 + Math.random() * 0.3
    });
  }
}

function buildBubbles(initial){
  scene.bubbles = [];
  const n = 46;
  for (let i = 0; i < n; i++){
    scene.bubbles.push({
      x: Math.random() * W,
      y: initial ? Math.random() * H : H + Math.random() * 40,
      r: 1.2 + Math.random() * 4.2,
      v: 0.22 + Math.random() * 0.5,       // 基础速度（受盐度影响）
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.35 + Math.random() * 1.1,
      a: 0.18 + Math.random() * 0.4
    });
  }
}

/* 水面 y 坐标 */
const waterY = () => H * WATER_TOP;

/* 依据盐度算水色与密度 */
function waterColor(s){
  if (s < 8)  return [ 26, 96, 132];     // 淡水偏青绿蓝
  if (s < 13) return [ 24,110,140];
  if (s < 26) return [ 20,118,142];      // 半咸水略通透的碧色
  if (s < 33) return [ 16,104,140];
  return [ 12, 86,132];                  // 高盐偏深海蓝
}
function densityOf(s){ return 1 + s * 0.00075; }   // 相对密度

/* ---------- 6. 渲染 ---------- */
function draw(t){
  if (!W) return;
  ctx.clearRect(0, 0, W, H);

  const s = scene.saltDisplay;
  const wy = waterY();
  const tone = waterColor(s);

  /* --- 背板（箱壁） --- */
  const backG = ctx.createLinearGradient(0, 0, 0, H);
  backG.addColorStop(0, '#08202f');
  backG.addColorStop(1, '#020c14');
  ctx.fillStyle = backG;
  ctx.fillRect(0, 0, W, H);

  /* --- 水 --- */
  const wg = ctx.createLinearGradient(0, wy, 0, H);
  wg.addColorStop(0,   `rgba(${tone[0]+38},${tone[1]+42},${tone[2]+40},0.95)`);
  wg.addColorStop(0.42,`rgba(${tone[0]},${tone[1]},${tone[2]},0.97)`);
  wg.addColorStop(1,   `rgba(${Math.max(0,tone[0]-14)},${Math.max(0,tone[1]-34)},${Math.max(0,tone[2]-30)},1)`);
  ctx.fillStyle = wg;
  ctx.beginPath();
  ctx.moveTo(0, wy);
  // 水面波动
  for (let x = 0; x <= W; x += 8){
    const y = wy + Math.sin(x * 0.016 + t * 1.5) * 3.4 + Math.sin(x * 0.041 - t * 2.1) * 1.5;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fill();

  /* --- 水中的体积感 / 焦散 --- */
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const r of scene.lightRays){
    const cx = r.x + Math.sin(t * r.sp + r.ph) * 16;
    const g = ctx.createLinearGradient(cx, wy, cx + H * r.skew, H);
    g.addColorStop(0, `rgba(150,230,255,${r.a * (1 + s/70)})`);
    g.addColorStop(0.55, `rgba(120,205,250,${r.a * 0.42})`);
    g.addColorStop(1, 'rgba(90,180,230,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - r.w / 2, wy);
    ctx.lineTo(cx + r.w / 2, wy);
    ctx.lineTo(cx + r.w / 2 + H * r.skew, H);
    ctx.lineTo(cx - r.w / 2 + H * r.skew, H);
    ctx.closePath();
    ctx.fill();
  }
  // 水面高光带
  const hg = ctx.createLinearGradient(0, wy - 6, 0, wy + 26);
  hg.addColorStop(0, 'rgba(220,250,255,0.42)');
  hg.addColorStop(1, 'rgba(200,245,255,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, wy - 6, W, 32);
  ctx.restore();

  /* --- 盐度高时的结晶感（细盐颗粒悬浮） --- */
  if (s > 26){
    const k = Math.min(1, (s - 26) / 9);
    ctx.save();
    for (let i = 0; i < 70; i++){
      const seed = i * 12.9898;
      const px = ((Math.sin(seed) * 43758.5453) % 1 + 1) % 1 * W;
      const py = wy + ((Math.cos(seed * 1.7) * 24634.6345) % 1 + 1) % 1 * (H - wy);
      const yy = py + Math.sin(t * 0.8 + i) * 4;
      ctx.fillStyle = `rgba(235,252,255,${0.16 + k * 0.42})`;
      ctx.beginPath(); ctx.arc(px, yy, 0.9 + k * 1.1, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  /* --- 底部砂床 --- */
  drawSand(t);

  /* --- 已放置物品（水底的先画，水中的后画） --- */
  scene.placed.filter(p => p.ground).forEach(p => drawPlaced(p, t));
  scene.placed.filter(p => !p.ground).forEach(p => drawPlaced(p, t));

  /* --- 小螃蟹群体（按 y 排序，靠后的先画） --- */
  [...scene.crabs].sort((a, b) => a.y - b.y).forEach(c => drawCrab(c, t));

  /* --- 浮游小鱼 --- */
  scene.fish.forEach(f => drawFish(f, t));

  /* --- 气泡 --- */
  drawBubbles(t, wy);

  /* --- 俯视水面反光边框 + 玻璃反光 --- */
  glassOverlay();

  /* --- 顶部标签牌 --- */
  drawTag();
}

function drawSand(t){
  const sh = scene.sandH;
  const baseY = H - sh;
  const g = ctx.createLinearGradient(0, baseY - 12, 0, H);
  g.addColorStop(0, '#e8d0a8');
  g.addColorStop(0.35, '#c9ac83');
  g.addColorStop(1, '#8d7355');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, baseY + 8);
  for (let x = 0; x <= W; x += 6){
    const y = baseY + 4 + Math.sin(x * 0.026 + 1.2) * 5 + Math.sin(x * 0.061) * 2.2;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.clip();
  // 砂粒
  for (let i = 0; i < 200; i++){
    const seed = i * 7.312;
    const px = ((Math.sin(seed) * 43758.5) % 1 + 1) % 1 * W;
    const py = baseY + 6 + ((Math.cos(seed * 2.1) * 24634.6) % 1 + 1) % 1 * sh;
    const rr = 0.7 + ((Math.sin(seed * 3.3) * 1000) % 1 + 1) % 1 * 1.5;
    ctx.fillStyle = i % 5 === 0 ? 'rgba(255,250,235,.55)' : i % 3 === 0 ? 'rgba(120,98,74,.42)' : 'rgba(255,240,215,.30)';
    ctx.beginPath(); ctx.arc(px, py, rr, 0, 7); ctx.fill();
  }
  // 水下阴影
  const sg = ctx.createLinearGradient(0, baseY, 0, baseY + 26);
  sg.addColorStop(0, 'rgba(10,40,60,.42)');
  sg.addColorStop(1, 'rgba(10,40,60,0)');
  ctx.fillStyle = sg; ctx.fillRect(0, baseY, W, 26);
  ctx.restore();
}

function drawPlaced(p, t){
  const img = IMGS[p.k]; if (!img) return;

  // 彩砂：横向平铺，只覆盖砂床上半层，露出下方原始砂色
  if (p.isSand){
    const tw = p.h * 1.5;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, p.y - p.h * 0.35, W, p.h * 0.62);
    ctx.clip();
    for (let x = -tw * 0.4; x < W + tw; x += tw * 0.9){
      ctx.globalAlpha = 0.62;
      ctx.drawImage(img, x, p.y - p.h * 0.28, tw, p.h * 0.9);
    }
    ctx.restore();
    return;
  }

  ctx.save();
  const isSoft = p.k === 'plant' || p.k === 'coral';
  const bob = p.ground ? Math.sin(t * 0.9 + p.ph) * 1.2 : Math.sin(t * 1.1 + p.ph) * 4;
  const swayAmp = p.k === 'coral' ? 0.032 : 0.055;
  const sway = isSoft ? Math.sin(t * 1.35 + p.ph) * swayAmp : 0;
  ctx.translate(p.x, p.y + bob);
  if (isSoft){                             // 水草 / 珊瑚以根部为轴摆动
    ctx.translate(0, p.h / 2);
    ctx.rotate(sway);
    ctx.translate(0, -p.h / 2);
  }
  // 水中投影
  if (p.ground){
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#1a3a4c';
    ctx.beginPath();
    ctx.ellipse(0, p.h / 2 - 2, p.w * 0.32, 4.5, 0, 0, 7);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = p.alpha != null ? p.alpha : 1;
  ctx.drawImage(img, -p.w / 2, -p.h / 2, p.w, p.h);
  ctx.restore();
}

function drawFish(f, t){
  const img = IMGS[f.kind || 'fish']; if (!img) return;
  // 水平往返
  const span = W * 0.42;
  const cyc = (t * f.sp + f.ph) % (Math.PI * 2);
  const x = W * 0.5 + Math.sin(cyc) * span;
  const dir = Math.cos(cyc) >= 0 ? 1 : -1;
  const y = f.y + Math.sin(t * 1.7 + f.ph) * 9;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dir, 1);
  ctx.rotate(Math.sin(t * 2.2 + f.ph) * 0.05);
  ctx.globalAlpha = 0.95;
  ctx.drawImage(img, -f.w / 2, -f.h / 2, f.w, f.h);
  ctx.restore();
}

function drawBubbles(t, wy){
  const s = scene.saltDisplay;
  const speedUp = 1 + s / 95;                    // 水越咸，上浮越显轻快
  for (let i = scene.bubbles.length - 1; i >= 0; i--){
    const b = scene.bubbles[i];
    b.y -= b.v * speedUp;

    if (b.v < 0){
      // 撒入的盐粒：沉到砂床就消失
      if (b.y > H - scene.sandH + 6){ scene.bubbles.splice(i, 1); continue; }
    } else if (b.y < wy + 3){
      // 气泡到水面破裂——消失，由 emitBubble 持续补充
      scene.bubbles.splice(i, 1);
      continue;
    }

    const sway = Math.sin(t * 1.7 + b.sway) * b.swayAmp;
    ctx.save();
    ctx.globalAlpha = b.a * (1 - Math.max(0, (wy + 60 - b.y) / 160) * 0.5);
    ctx.beginPath();
    ctx.arc(b.x + sway, b.y, b.r, 0, 7);
    const g = ctx.createRadialGradient(b.x + sway - b.r * 0.35, b.y - b.r * 0.4, 0, b.x + sway, b.y, b.r);
    g.addColorStop(0, 'rgba(255,255,255,.95)');
    g.addColorStop(0.5, 'rgba(200,242,255,.34)');
    g.addColorStop(1, 'rgba(140,215,245,.14)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(210,245,255,.55)';
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.restore();
  }
}

/* 持续补充上升气泡，保持画面有生命感 */
let bubbleTimer = 0;
let pumpTimer = 0;
function emitBubbles(dt){
  bubbleTimer += dt;

  // 气泵：从泵口持续冒气泡
  const pumps = scene.placed.filter(p => p.pump);
  if (pumps.length){
    pumpTimer += dt;
    if (pumpTimer > 3.1){
      pumpTimer = 0;
      for (const p of pumps){
        scene.bubbles.push({
          x: p.x + (Math.random() - 0.5) * p.w * 0.28,
          y: p.y - p.h * 0.42,
          r: 1.4 + Math.random() * 3.4,
          v: 0.4 + Math.random() * 0.6,
          sway: Math.random() * 7,
          swayAmp: 0.35 + Math.random() * 1.2,
          a: 0.26 + Math.random() * 0.4
        });
      }
    }
  }

  const rising = scene.bubbles.filter(b => b.v > 0).length;
  const want = pumps.length ? 58 : 34;
  if (rising < want && bubbleTimer > 2.4){
    bubbleTimer = 0;
    scene.bubbles.push({
      x: Math.random() * W,
      y: H - scene.sandH + 4,
      r: 1.1 + Math.random() * 3.6,
      v: 0.24 + Math.random() * 0.5,
      sway: Math.random() * 7,
      swayAmp: 0.3 + Math.random() * 1.1,
      a: 0.14 + Math.random() * 0.32
    });
  }
  if (scene.bubbles.length > 240) scene.bubbles.splice(0, scene.bubbles.length - 240);
}

/* ---------- 螃蟹群体 ----------
   低盐：只有蟹苗零星出现
   理想盐度：成蟹和蟹苗混在一起，一起变多               */
const CRAB_TIERS = [
  // 8–13‰ 刚到孵化下限：只有 1 只蟹苗
  { min:8,  adults:0, babies:1 },
  // 13–18‰ 进入理想区间：蟹苗先多起来
  { min:13, adults:1, babies:3 },
  // 18–26‰ 越来越好：成蟹加入，混编
  { min:18, adults:2, babies:4 },
  // 26–30‰ 峰值：两者都最多
  { min:26, adults:3, babies:5 },
  // 30–33‰ 偏咸：数量回落
  { min:30, adults:1, babies:2 },
  // 33‰ 临界：只剩零星蟹苗
  { min:33, adults:0, babies:1 }
];

function crabPlan(s){
  let tier = null;
  for (const t of CRAB_TIERS) if (s >= t.min) tier = t;
  if (!tier) return null;                 // 低于 8‰ 或高于 33‰ 都不出蟹
  if (s > 33) return null;
  return { adults: tier.adults, babies: tier.babies, count: tier.adults + tier.babies };
}

/* 按目标配比生成队列：成蟹落在视觉中心、两侧对称铺蟹苗，避免一侧扎堆 */
function crabRoster(plan){
  const a = plan.adults, b = plan.babies, total = a + b;
  if (!total) return [];
  const mid = Math.floor(total / 2);

  if (a === 0) return Array(total).fill('crabling');
  if (a === 1) return Array.from({ length: total }, (_, i) => i === mid ? 'crab' : 'crabling');

  // 多只成蟹：以中心为原点向两侧对称展开，其余位置填蟹苗
  const picks = new Set();
  if (a % 2 === 1) picks.add(mid);
  for (let k = 1; picks.size < a; k++){
    if (picks.size < a) picks.add(mid - k);
    if (picks.size < a) picks.add(mid + k);
  }
  return Array.from({ length: total }, (_, i) => picks.has(i) ? 'crab' : 'crabling');
}

/* 螃蟹绘制尺寸（与 drawCrab 保持同一套计算，供落点定位复用） */
function crabMetrics(kind, c){
  const img = IMGS[kind];
  const size = c ? c.size : 1;
  const targetW = (kind === 'crab' ? 152 : 118) * size *
                  Math.min(1.3, Math.max(0.82, W / 860));
  const ratio = (img && img.naturalWidth && img.naturalHeight)
    ? img.naturalWidth / img.naturalHeight
    : (kind === 'crab' ? 987 / 767 : 838 / 669);
  return { w: targetW, h: targetW / ratio };
}

/* 站立高度：脚刚好踩在砂面上（成蟹稍靠后、蟹苗稍靠前，形成层次） */
function crabRestY(kind, c){
  const sandTop = H - scene.sandH;
  const { h } = crabMetrics(kind, c);
  const sink = kind === 'crab' ? scene.sandH * 0.20 : scene.sandH * 0.06;
  return sandTop + sink - h / 2;
}

function makeCrab(i, total, kind){
  const margin = W * 0.09;
  const span = W - margin * 2;
  // 沿着砂床均匀铺开，位置带一点抖动，避免排成一条线
  const slot = span / total;
  const baseX = margin + slot * (i + 0.5);
  const isBaby = kind === 'crabling';
  return {
    kind,
    x: baseX + (Math.random() - 0.5) * slot * 0.35,
    // 蟹苗站得更靠前（更靠近观众），成蟹略靠后，形成前后层次；
    // 用比例而非固定值，确保放大后也不会沉到砂面以下
    y: crabRestY(kind) - (Math.random() * 5),
    op: 0,                                 // 从 0 淡入
    wander: slot * 0.26,                   // 活动范围不超过自己的位置槽
    speed: 0.3 + Math.random() * 0.28,     // 横向爬行快慢
    ph: Math.random() * Math.PI * 2,
    size: isBaby ? (0.86 + Math.random() * 0.1) : (0.88 + Math.random() * 0.12),
    dir: Math.random() > 0.5 ? 1 : -1,
    bubList: Array.from({ length: 3 }, () => ({
      x: 0, y: 0, r: 1.2 + Math.random() * 2.2, life: Math.random()
    }))
  };
}

function drawCrab(c, t){
  const img = IMGS[c.kind]; if (!img) return;

  // 按素材真实比例决定尺寸，避免拉伸变形
  // 成蟹图约 987x767，蟹苗图约 838x669
  const { w, h } = crabMetrics(c.kind, c);

  const cyc = t * c.speed + c.ph;
  const x = c.x + Math.sin(cyc) * c.wander;
  const dir = Math.cos(cyc) >= 0 ? 1 : -1;
  const walking = Math.abs(Math.cos(cyc)) > 0.5;
  const hop = walking ? Math.abs(Math.sin(cyc * 9)) * 2.8 : Math.sin(t * 1.5 + c.ph) * 1.0;
  const tilt = Math.cos(cyc) * 0.07;

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, c.op));

  // 底床阴影
  ctx.save();
  ctx.globalAlpha = 0.3 * Math.max(0, Math.min(1, c.op));
  ctx.fillStyle = '#12303f';
  ctx.beginPath();
  ctx.ellipse(x, c.y + h * 0.46, w * 0.34, 5, 0, 0, 7);
  ctx.fill();
  ctx.restore();

  ctx.translate(x, c.y - hop);
  ctx.rotate(tilt);
  ctx.scale(dir, 1);

  // 呼吸式轻微缩放
  const breathe = 1 + Math.sin(t * 3.2 + c.ph) * 0.02;
  ctx.drawImage(img, -w / 2 * breathe, -h / 2 * breathe, w * breathe, h * breathe);
  ctx.restore();

  // 吐泡泡
  for (const bb of c.bubList){
    bb.life -= 0.012;
    bb.y -= 0.5;
    if (bb.life <= 0){
      bb.life = 1;
      bb.x = x + (Math.random() - 0.5) * w * 0.3;
      bb.y = c.y - h * 0.3;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, bb.life) * 0.6 * Math.min(1, c.op);
    ctx.beginPath(); ctx.arc(bb.x, bb.y, bb.r, 0, 7);
    ctx.fillStyle = 'rgba(225,250,255,.35)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.65)';
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.restore();
  }
}

/* 玻璃反光 & 边框 */
function glassOverlay(){
  // 斜向反光条
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, W * 0.55, H);
  g.addColorStop(0, 'rgba(255,255,255,.09)');
  g.addColorStop(0.16, 'rgba(255,255,255,.015)');
  g.addColorStop(0.34, 'rgba(255,255,255,.055)');
  g.addColorStop(0.46, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // 四周内阴影
  const vg = ctx.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.28, W / 2, H * 0.5, Math.max(W, H) * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,8,14,.55)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/* 水面上方的小标签牌 */
function drawTag(){
  const wy = waterY();
  const pad = 16;
  ctx.save();
  ctx.font = '600 12px "PingFang SC","Microsoft YaHei",sans-serif';
  const s = scene.saltDisplay;
  const b = bandOf(s);
  const label = `${waterName(s)}　·　${s.toFixed(1)} ‰`;
  const tw = ctx.measureText(label).width;
  const bw = tw + 30, bh = 24;
  const bx = pad, by = wy - bh - 11;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = 'rgba(6,28,42,.78)';
  roundRect(bx, by, bw, bh, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(140,220,255,.3)'; ctx.lineWidth = 1;
  roundRect(bx, by, bw, bh, 12); ctx.stroke();
  // 小点
  ctx.beginPath(); ctx.arc(bx + 13, by + bh / 2, 3.2, 0, 7);
  ctx.fillStyle = b.dot; ctx.fill();
  ctx.fillStyle = '#c8ecff';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, bx + 22, by + bh / 2 + 0.5);
  ctx.restore();
}

function roundRect(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- 7. 主循环 ---------- */
let last = performance.now();
function loop(now){
  const dt = Math.min(48, now - last) / 16.667; last = now;
  scene.t += dt / 60;
  const t = scene.t;

  // 盐度平滑
  const target = scene.salt;
  scene.saltDisplay += (target - scene.saltDisplay) * Math.min(1, 0.12 * dt);
  if (Math.abs(target - scene.saltDisplay) < 0.02) scene.saltDisplay = target;

  scene.fish.forEach(f => { f.y = Math.max(waterY() + 40, Math.min(H - scene.sandH - 60, f.y)); });

  emitBubbles(dt);

  // 螃蟹逻辑：达到条件则出现，否则淡出
  updateCrab(dt, t);

  draw(t);
  requestAnimationFrame(loop);
}

function updateCrab(dt, t){
  const s = scene.saltDisplay;
  const plan = crabPlan(s);
  const group = scene.crabs;

  const countOf = kind => group.filter(c => c.kind === kind).length;

  if (plan){
    const want = { crab: plan.adults, crabling: plan.babies };

    // ---- 先淘汰：某一类超出目标，让多出来的（后加入的）钻回砂床 ----
    for (const kind of ['crab', 'crabling']){
      let over = countOf(kind) - want[kind];
      if (over <= 0) continue;
      for (let i = group.length - 1; i >= 0 && over > 0; i--){
        if (group[i].kind !== kind) continue;
        group[i].fading = true;             // 标记为退场中
        over--;
      }
    }
    // 退场中的个体逐渐透明，归零后移除
    for (let i = group.length - 1; i >= 0; i--){
      const c = group[i];
      if (!c.fading) continue;
      c.op -= 0.075 * dt;
      if (c.op <= 0) group.splice(i, 1);
    }

    // ---- 再补充：哪一类不够就补哪一类 ----
    for (const kind of ['crab', 'crabling']){
      let lack = want[kind] - group.filter(c => c.kind === kind && !c.fading).length;
      while (lack-- > 0){
        group.push(makeCrab(0, Math.max(1, plan.count), kind));
      }
    }

    // ---- 编队：总数变化后重新均匀铺开，并让两类交错 ----
    const key = plan.adults + ':' + plan.babies;
    const active = group.filter(c => !c.fading);
    const settled = active.length === plan.count && active.every(c => c.op >= 0.99);
    if (settled && scene.crabLayoutKey !== key){
      const roster = crabRoster(plan);
      // 按 roster 的顺序给每个位置指定种类，实现成蟹与蟹苗交替
      const margin = W * 0.09, span = W - margin * 2, slot = span / plan.count;
      const adults = active.filter(c => c.kind === 'crab');
      const babies = active.filter(c => c.kind === 'crabling');
      let ai = 0, bi = 0;
      roster.forEach((kind, i) => {
        const c = kind === 'crab' ? adults[ai++] : babies[bi++];
        if (!c) return;
        c.x = margin + slot * (i + 0.5) + (Math.random() - 0.5) * slot * 0.3;
        c.wander = slot * 0.26;
        c.kind = kind;
      });
      scene.crabLayoutKey = key;
    }

    // 淡入 & 贴合各自的高度
    for (const c of group){
      if (!c.fading) c.op = Math.min(1, c.op + 0.05 * dt);
      c.y = crabRestY(c.kind, c);
    }
  } else {
    scene.crabLayoutKey = '';
    // 超出耐受范围 → 全体迅速隐去
    for (const c of group){ c.op -= 0.09 * dt; }
    while (group.length && group[group.length - 1].op <= 0) group.pop();
  }
}

const isHatchable = s => s >= 8 && s <= 33;
/* ---------- 8. 右侧面板更新 ---------- */
const el = {
  num: document.getElementById('num'),
  gl: document.getElementById('gl'),
  saltname: document.getElementById('saltname'),
  saltdot: document.getElementById('saltdot'),
  verdict: document.getElementById('verdict'),
  vem: document.getElementById('vem'),
  vt: document.getElementById('vt'),
  vs: document.getElementById('vs'),
  needle: document.getElementById('needle'),
  gtrack: document.getElementById('gtrack'),
  range: document.getElementById('salt'),
  slval: document.getElementById('slval'),
  cnt: document.getElementById('cnt')
};

/* 构建刻度条分区与刻度线 */
function buildGauge(){
  const MAX = 35;
  const zones = [['zf',0,8],['zb',8,13],['zg',13,26],['zs',26,33],['zd',33,35]];  zones.forEach(([cls,a,b]) => {
    const d = document.createElement('div');
    d.className = 'g-zone ' + cls;
    d.style.left = (a / MAX * 100) + '%';
    d.style.width = ((b - a) / MAX * 100) + '%';
    el.gtrack.appendChild(d);
  });
  [[0,0],[8,1],[13,1],[26,1],[33,1]].forEach(([v,maj]) => {
    const d = document.createElement('div');
    d.className = 'g-tick' + (maj ? ' major' : '');
    d.style.left = (v / MAX * 100) + '%';
    d.dataset.l = v;
    el.gtrack.appendChild(d);
  });
  // 把针移到最上层
  el.gtrack.appendChild(el.needle);
}

let lastCls = '';
function updatePanel(s){
  el.num.textContent = s.toFixed(1);
  el.gl.textContent = (s * 1.0).toFixed(1);
  el.needle.style.left = Math.max(1, Math.min(34.4, s)) / 35 * 100 + '%';
  el.range.style.setProperty('--p', (s / 35 * 100) + '%');
  el.slval.textContent = s.toFixed(1) + ' ‰';

  const b = bandOf(s);
  if (b.cls !== lastCls){
    el.verdict.className = 'verdict ' + b.cls;
    lastCls = b.cls;
  }
  el.vem.textContent = b.em;
  el.vt.textContent = b.t;
  el.vs.textContent = b.s;
  el.saltname.textContent = waterName(s);
  el.saltdot.style.background = b.dot;
  el.saltdot.style.color = b.dot;
  moveCurveDot(s);
}

/* ---------- 8.5 存活率曲线（右侧教学插图） ---------- */
function buildCurve(){
  const box = document.getElementById('curve');
  if (!box) return;
  const W2 = 300, H2 = 74, padL = 4, padR = 4, padT = 10, padB = 16;
  const MAXS = 40;
  const x = s => padL + (s / MAXS) * (W2 - padL - padR);

  // 相对成活率：8‰ 起步，13–26‰ 平台（最高），33‰ 后降至零
  const survival = s => {
    if (s <= 5) return 0;
    if (s < 8) return 0;
    if (s < 13) return (s - 8) / 5 * 0.72;          // 8→13 爬升
    if (s <= 26) return 0.72 + Math.sin((s - 13) / 13 * Math.PI) * 0.28; // 13→26 弧顶
    if (s < 33) return (33 - s) / 7 * 0.72;          // 26→33 下滑
    return 0;
  };
  const yOf = v => padT + (1 - v) * (H2 - padT - padB);

  let d = '';
  for (let s = 0; s <= MAXS; s += 0.5){
    const px = x(s), py = yOf(Math.max(0, survival(s)));
    d += (s === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1);
  }

  // 面积填充
  const area = d + `L${x(MAXS).toFixed(1)} ${yOf(0)}L${x(0)} ${yOf(0)}Z`;

  const bands = [
    [0, 8, '#ff8b9e'], [8, 13, '#ffc37a'], [13, 26, '#5fefc0'],
    [26, 33, '#ffc37a'], [33, 40, '#ff8b9e']
  ];

  let bandEls = '';
  for (const [a, b, c] of bands){
    bandEls += `<rect x="${x(a).toFixed(1)}" y="${yOf(0)}" width="${(x(b) - x(a)).toFixed(1)}" height="3" fill="${c}" opacity="0.85"/>`;
  }

  let ticks = '';
  [[0,'0'],[8,'8'],[13,'13'],[26,'26'],[33,'33']].forEach(([v,lab]) => {
    ticks += `<line x1="${x(v)}" y1="${yOf(0)}" x2="${x(v)}" y2="${yOf(0)+4}" stroke="rgba(160,220,245,.4)" stroke-width="1"/>`;
    ticks += `<text x="${x(v)}" y="${H2-2}" font-size="8.5" fill="#6f9cb5" text-anchor="middle">${lab}</text>`;
  });

  // 当前盐度的标记点
  const cur = document.body.dataset.s || 0;

  box.innerHTML = `
  <svg viewBox="0 0 ${W2} ${H2}" preserveAspectRatio="none">
    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5fefc0" stop-opacity="0.42"/>
        <stop offset="1" stop-color="#5fefc0" stop-opacity="0.02"/>
      </linearGradient>
    </defs>
    ${bandEls}
    <path d="${area}" fill="url(#cg)"/>
    <path d="${d}" fill="none" stroke="#7df0cb" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/>
    ${ticks}
    <circle id="cdot" cx="${x(+cur).toFixed(1)}" cy="${yOf(Math.max(0,survival(+cur))).toFixed(1)}" r="3.4"
            fill="#ffffff" stroke="#0b2a3d" stroke-width="1.4"/>
  </svg>`;

  scene.curveX = x;
  scene.curveY = s => yOf(Math.max(0, survival(s)));
  scene.survival = survival;
}

function moveCurveDot(s){
  const dot = document.getElementById('cdot');
  if (!dot || !scene.curveX) return;
  dot.setAttribute('cx', scene.curveX(s).toFixed(1));
  dot.setAttribute('cy', scene.curveY(s).toFixed(1));
}
const ghost = document.getElementById('ghost');
let drag = null;

function buildPalette(){
  const box = document.getElementById('items');
  PALETTE.forEach((it, i) => {
    const d = document.createElement('div');
    d.className = 'item';
    d.dataset.k = it.k;
    d.innerHTML = `<div class="ic">${ART[it.k]}</div><span>${it.label}</span>`;
    d.addEventListener('pointerdown', e => startDrag(e, it, d));
    box.appendChild(d);
  });
}

function startDrag(e, it, node){
  e.preventDefault();
  drag = { it, node, id: e.pointerId };
  ghost.innerHTML = ART[it.k];
  ghost.classList.add('on');
  moveGhost(e.clientX, e.clientY);
  node.setPointerCapture?.(e.pointerId);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
}

function moveGhost(x, y){ ghost.style.left = x + 'px'; ghost.style.top = y + 'px'; }

function onMove(e){
  if (!drag) return;
  moveGhost(e.clientX, e.clientY);
  const inTank = isInsideTank(e.clientX, e.clientY);
  cv.style.cursor = inTank ? 'copy' : 'default';
}

function isInsideTank(cx, cy){
  const r = cv.getBoundingClientRect();
  return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
}

function onUp(e){
  if (!drag) return;
  const inside = isInsideTank(e.clientX, e.clientY);
  const r = cv.getBoundingClientRect();
  if (inside){
    const lx = (e.clientX - r.left) * (W / r.width);
    const ly = (e.clientY - r.top) * (H / r.height);
    dropItem(drag.it, lx, ly);
  }
  ghost.classList.remove('on');
  cv.style.cursor = 'default';
  drag = null;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
  window.removeEventListener('pointercancel', onUp);
}

function dropItem(it, lx, ly){
  const scale = Math.min(1.55, Math.max(0.95, W / 620));
  const w = it.w * scale, h = it.h * scale;
  const wy = waterY();
  const groundKeys = ['rock','plant','shell','coral','wood','sand'];
  const isGround = groundKeys.includes(it.k);

  if (it.k === 'fish'){
    // 小鱼：多条同游，随机高度
    scene.fish.push({
      y: Math.max(wy + 50, Math.min(H - scene.sandH - 70, ly)),
      w: w * 0.9, h: h * 0.9,
      sp: 0.22 + Math.random() * 0.16,
      ph: Math.random() * Math.PI * 2
    });
  } else {
    const p = {
      k: it.k, w, h,
      x: Math.max(w * 0.5 + 6, Math.min(W - w * 0.5 - 6, lx)),
      y: ly,
      ph: Math.random() * Math.PI * 2,
      ground: isGround
    };
    if (it.k === 'sand'){
      // 彩砂：铺在砂床上，画在砂床之上、其他装饰之下
      p.y = H - scene.sandH * 0.42;
      p.ground = true;
      p.isSand = true;
      // 砂层铺满整段砂床宽度，营造"换了一层彩砂"的效果
      p.w = W * 0.9;
      p.h = scene.sandH * 1.35;
      scene.placed.unshift(p);
    } else if (it.k === 'bubble'){
      // 气泵：贴底放置，持续冒气泡
      p.y = H - scene.sandH - h * 0.32;
      p.ground = true;
      p.pump = true;
      scene.placed.push(p);
    } else if (isGround){
      p.y = H - scene.sandH - h * 0.34;
      scene.placed.push(p);
      burst(p.x, p.y + h * 0.2, 8);
    } else {
      p.y = Math.max(wy + h * 0.5 + 24, Math.min(H - scene.sandH - h * 0.4, ly));
      scene.placed.push(p);
    }
    burst(p.x, p.y, 10);
  }
  refreshCount();
}

function burst(x, y, n){
  for (let i = 0; i < n; i++){
    scene.bubbles.push({
      x: x + (Math.random() - 0.5) * 40,
      y: y + (Math.random() - 0.5) * 24,
      r: 1 + Math.random() * 3.4,
      v: 0.5 + Math.random() * 0.8,
      sway: Math.random() * 7,
      swayAmp: 0.4 + Math.random(),
      a: 0.5
    });
  }
  // 控制总数
  if (scene.bubbles.length > 150) scene.bubbles.splice(0, scene.bubbles.length - 150);
}

function refreshCount(){
  el.cnt.textContent = scene.placed.length + scene.fish.length;
}

/* 拖动水族箱里的物品可以挪位置 / 拖回上方素材区 —— 支持拖出移走 */
function bindTankPick(){
  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect();
    const lx = (e.clientX - r.left) * (W / r.width);
    const ly = (e.clientY - r.top) * (H / r.height);
    // 从后往前找最近的
    let hit = -1, best = 1e9;
    scene.placed.forEach((p, i) => {
      const dx = Math.abs(lx - p.x), dy = Math.abs(ly - p.y);
      if (dx < p.w * 0.55 && dy < p.h * 0.55){
        const d = dx + dy;
        if (d < best){ best = d; hit = i; }
      }
    });
    if (hit >= 0){
      const p = scene.placed.splice(hit, 1)[0];
      refreshCount();
      startDragTank(e, p);
    }
  });
}

function startDragTank(e, p){
  e.preventDefault();
  let moved = false;
  const r0 = cv.getBoundingClientRect();
  const offX = (e.clientX - r0.left) * (W / r0.width) - p.x;
  const offY = (e.clientY - r0.top) * (H / r0.height) - p.y;
  ghost.innerHTML = ART[p.k];
  ghost.classList.add('on');

  const mv = ev => {
    moved = true;
    moveGhost(ev.clientX, ev.clientY);
    const r = cv.getBoundingClientRect();
    p.x = Math.max(p.w * 0.5, Math.min(W - p.w * 0.5, (ev.clientX - r.left) * (W / r.width) - offX));
    if (!p.ground){
      p.y = Math.max(waterY() + p.h * 0.5 + 20, Math.min(H - scene.sandH - p.h * 0.3, (ev.clientY - r.top) * (H / r.height) - offY));
    }
    // 实时更新绘制：临时塞回场景末尾
    if (!scene.placed.includes(p)) scene.placed.push(p);
  };
  const up = ev => {
    ghost.classList.remove('on');
    window.removeEventListener('pointermove', mv);
    window.removeEventListener('pointerup', up);
    const rect = cv.getBoundingClientRect();
    const outside = ev.clientX < rect.left - 40 || ev.clientX > rect.right + 40 ||
                    ev.clientY < rect.top - 40 || ev.clientY > rect.bottom + 40;
    if (outside){
      // 拖出 → 移走
      const i = scene.placed.indexOf(p);
      if (i >= 0) scene.placed.splice(i, 1);
      refreshCount();
      burst(p.x, p.y, 6);
    } else if (p.ground){
      p.y = p.isSand ? H - scene.sandH * 0.42 : H - scene.sandH - p.h * 0.34;
    }
  };
  window.addEventListener('pointermove', mv);
  window.addEventListener('pointerup', up);
}

/* ---------- 10. 启动 ---------- */
async function init(){
  await loadArt();
  buildPalette();
  buildGauge();
  buildCurve();
  resize();
  bindTankPick();

  el.range.addEventListener('input', () => {
    scene.salt = parseFloat(el.range.value);
    updatePanel(scene.salt);
    // 加盐时的颗粒动效
    if (Math.random() < 0.9) sprinkleSalt(4);
  });

  document.getElementById('reset').addEventListener('click', () => {
    scene.placed = [];
    scene.fish = [];
    scene.crabs = [];
    scene.salt = 0;
    el.range.value = 0;
    updatePanel(0);
    refreshCount();
    buildBubbles(true);
  });

  window.addEventListener('resize', () => { resize(); });

  // 键盘微调：聚焦滑块后 ← → 每次 0.5‰，Shift+← → 每次 2‰，便于精准对齐临界点
  el.range.addEventListener('keydown', e => {
    let d = 0;
    if (e.key === 'ArrowLeft')  d = e.shiftKey ? -2 : -0.5;
    if (e.key === 'ArrowRight') d = e.shiftKey ? 2 : 0.5;
    if (!d) return;
    e.preventDefault();
    const v = Math.max(0, Math.min(35, Math.round((scene.salt + d) * 2) / 2));
    scene.salt = v;
    el.range.value = v;
    updatePanel(v);
  });

  updatePanel(0);
  refreshCount();
  requestAnimationFrame(loop);
}

/* 撒盐颗粒（从水面向下沉） */
function sprinkleSalt(n){
  for (let i = 0; i < n; i++){
    scene.bubbles.push({
      x: Math.random() * W,
      y: waterY() + 4 + Math.random() * 20,
      r: 0.9 + Math.random() * 1.6,
      v: -0.15 - Math.random() * 0.1,        // 负速度 → 下沉
      sway: Math.random() * 7,
      swayAmp: 0.15,
      a: 0.75
    });
  }
}

/* 供自动化回归脚本读取内部状态（不影响页面表现） */
window.__dbg = {
  count(kind){ return scene.crabs.filter(c => c.kind === kind && !c.fading).length; },
  crabCount(){ return scene.crabs.filter(c => !c.fading).length; },
  placed(){ return scene.placed.length; },
  salt(){ return scene.salt; }
};

init();
