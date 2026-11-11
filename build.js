/**
 * 构建脚本：把源码打包成单文件离线版
 * 用法： node build.js
 * 产物： dist/salinity-lab.html
 *
 * 原理：
 *   1. 将 app.js 内联进 <script> 标签
 *   2. 将 assets/ 下的 PNG 转为 base64 data URI，替换掉文件路径
 * 结果是一个不依赖任何外部文件、不发起任何网络请求的独立 HTML。
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, 'dist');
const OUT = path.join(OUT_DIR, 'salinity-lab.html');

/* ---------- 读取源码 ---------- */
const htmlPath = path.join(ROOT, 'index.html');
const jsPath = path.join(ROOT, 'app.js');

if (!fs.existsSync(htmlPath) || !fs.existsSync(jsPath)) {
  console.error('✘ 找不到 index.html 或 app.js，请在项目根目录运行');
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');
let js = fs.readFileSync(jsPath, 'utf8');

/* ---------- 1. 内嵌图片为 base64 ---------- */
const ASSETS_DIR = path.join(ROOT, 'assets');
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

let embedded = 0;
if (fs.existsSync(ASSETS_DIR)) {
  for (const file of fs.readdirSync(ASSETS_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (!MIME[ext]) continue;

    const b64 = fs.readFileSync(path.join(ASSETS_DIR, file)).toString('base64');
    const dataUri = `data:${MIME[ext]};base64,${b64}`;
    const ref = `assets/${file}`;

    // 同时处理单引号与双引号形式
    const before = js;
    js = js.split(`'${ref}'`).join(`'${dataUri}'`);
    js = js.split(`"${ref}"`).join(`"${dataUri}"`);
    if (js !== before) embedded++;
  }
}

/* ---------- 2. 内联脚本 ---------- */
const beforeInline = html;
html = html.replace(
  /<script\s+src=["']app\.js["']\s*><\/script>/i,
  () => `<script>\n${js}\n</script>`
);
if (html === beforeInline) {
  console.error('✘ 未在 index.html 中找到 <script src="app.js"></script>');
  process.exit(1);
}

/* ---------- 3. 校验没有残留外链 ---------- */
const external = (html.match(/(?:src|href)=["'](?:https?:)?\/\/[^"']+["']/gi) || []);
if (external.length) {
  console.warn('⚠ 检测到外部资源引用，离线环境下可能失效：');
  external.forEach(s => console.warn('   ' + s));
}

const residualAssets = js.includes('assets/');
if (residualAssets) {
  console.warn('⚠ 仍有未内嵌的 assets/ 引用');
}

/* ---------- 4. 输出 ---------- */
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');

const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log('✔ 构建完成');
console.log('  产物：' + path.relative(ROOT, OUT));
console.log('  大小：' + sizeKB + ' KB');
console.log('  内嵌图片：' + embedded + ' 个');
console.log('  外部引用：' + (external.length ? external.length + ' 个（见上）' : '无'));
