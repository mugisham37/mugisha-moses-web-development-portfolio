import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JARCOS",
  description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
  generator: "Framer 569fd08",
  robots: "max-image-preview:large",
  openGraph: {
    type: "website",
    title: "JARCOS",
    description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
    images: [
      {
        url: "https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png",
      },
    ],
    url: "https://jarcos.work/",
  },
  twitter: {
    card: "summary_large_image",
    title: "JARCOS",
    description: "JARCOS is a design practice led by João Ferreira, a Brazilian multidisciplinary designer with over 14 years of experience in branding and digital design.",
    images: ["https://framerusercontent.com/images/KzbPKaxMBB9pggMU52SND3kyRtE.png"],
  },
  other: {
    "framer-search-index": "https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/searchIndex-dvgMy3SuszCg.json",
    "framer-search-index-fallback": "https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/searchIndex-cXTGFU6bMlY9.json",
  },
  icons: [
    {
      url: "https://framerusercontent.com/images/yl03VZZolpRkWUTB2jeEPPtmocQ.png",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "https://framerusercontent.com/images/yl03VZZolpRkWUTB2jeEPPtmocQ.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-redirect-timezone="1" className="lenis lenis-smooth">
      <head>
        <link rel="canonical" href="https://jarcos.work/" />
        <link
          rel="modulepreload"
          href="https://framer.com/edit/init.mjs"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script async src="https://events.framer.com/script?v=2"
          data-fid="d487ba51b4e04321f404046cdd871a0f54b753d760371e89eb133a992ce6d4dd" data-no-nt=""></script>
        {/* Start of bodyStart */}

        {/* End of bodyStart */}

        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2VYGG1ZWE3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2VYGG1ZWE3');
          `}
        </Script>

        {/* Framer Editor Bar Script */}
        <Script id="framer-editor" strategy="beforeInteractive">
          {`
            try { 
              if (localStorage.getItem("__framer_force_showing_editorbar_since")) { 
                const n = document.createElement("link"); 
                n.rel = "modulepreload"; 
                n.href = "https://framer.com/edit/init.mjs"; 
                document.head.appendChild(n);
              } 
            } catch (e) { 
              // Silent fail
            }
          `}
        </Script>

        <Script id="nested-link-handler" strategy="afterInteractive">
          {`(() => { function u() { function n(t, e, i) { let r = document.createElement("a"); r.href = t, r.target = i, r.rel = e, document.body.appendChild(r), r.click(), r.remove() } function o(t) { if (this.dataset.hydrated) { this.removeEventListener("click", o); return } t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); if (!e) return; if (/Mac|iPod|iPhone|iPad/u.test(navigator.userAgent) ? t.metaKey : t.ctrlKey) return n(e, "", "_blank"); let r = this.getAttribute("rel") ?? "", c = this.getAttribute("target") ?? ""; n(e, r, c) } function a(t) { if (this.dataset.hydrated) { this.removeEventListener("auxclick", o); return } t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); e && n(e, "", "_blank") } function s(t) { if (this.dataset.hydrated) { this.removeEventListener("keydown", s); return } if (t.key !== "Enter") return; t.preventDefault(), t.stopPropagation(); let e = this.getAttribute("href"); if (!e) return; let i = this.getAttribute("rel") ?? "", r = this.getAttribute("target") ?? ""; n(e, i, r) } document.querySelectorAll("[data-nested-link]").forEach(t => { t instanceof HTMLElement && (t.addEventListener("click", o), t.addEventListener("auxclick", a), t.addEventListener("keydown", s)) }) } return u })()()`}
        </Script>

        <Script id="framer-breakpoints" strategy="afterInteractive">
          {`(() => { function i() { for (let e of document.querySelectorAll("[data-framer-original-sizes]")) { let t = e.getAttribute("data-framer-original-sizes"); t === "" ? e.removeAttribute("sizes") : e.setAttribute("sizes", t), e.removeAttribute("data-framer-original-sizes") } } function a() { window.__framer_onRewriteBreakpoints = i } return a })()()`}
        </Script>

        <Script id="framer-params" strategy="afterInteractive" data-preserve-internal-params="">
          {`!function () {
            var l = "framer_variant"; function u(a, r) { let n = r.indexOf("#"), e = n === -1 ? r : r.substring(0, n), o = n === -1 ? "" : r.substring(n), t = e.indexOf("?"), m = t === -1 ? e : e.substring(0, t), d = t === -1 ? "" : e.substring(t), s = new URLSearchParams(d), h = new URLSearchParams(a); for (let [i, g] of h) s.has(i) || i !== l && s.append(i, g); let c = s.toString(); return c === "" ? e + o : m + "?" + c + o } var w = 'div#main a[href^="#"],div#main a[href^="/"],div#main a[href^="."]', f = "div#main a[data-framer-preserve-params]", p = document.currentScript?.hasAttribute("data-preserve-internal-params"); if (window.location.search && !navigator.webdriver && !/bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(navigator.userAgent)) { let a = document.querySelectorAll(p ? \`\${w},\${f}\` : f); for (let r of a) { let n = u(window.location.search, r.href); r.setAttribute("href", n) } }
        }()`}
        </Script>

        <Script id="animator" strategy="beforeInteractive">
          {`var animator = (() => { var k = (e, t, r) => r > t ? t : r < e ? e : r; var F = () => { }; function W(e) { let t; return () => (t === void 0 && (t = e()), t) } var j = e => e; var w = e => e * 1e3, v = e => e / 1e3; function X(e, t) { return t ? e * (1e3 / t) : 0 } var Y = e => Array.isArray(e) && typeof e[0] == "number"; var q = { value: null, addProjectionMetrics: null }; var Z = { layout: 0, mainThread: 0, waapi: 0 }; var z = (e, t, r = 10) => { let o = "", s = Math.max(Math.round(t / r), 2); for (let n = 0; n < s; n++)o += Math.round(e(n / (s - 1)) * 1e4) / 1e4 + ", "; return \`linear(\${o.substring(0, o.length - 2)})\` }; function $(e) { let t = 0, r = 50, o = e.next(t); for (; !o.done && t < 2e4;)t += r, o = e.next(t); return t >= 2e4 ? 1 / 0 : t } function pe(e, t = 100, r) { let o = r({ ...e, keyframes: [0, t] }), s = Math.min($(o), 2e4); return { type: "keyframes", ease: n => o.next(s * n).value / t, duration: v(s) } } var Ee = 5; function me(e, t, r) { let o = Math.max(t - Ee, 0); return X(r - e(o), t - o) } var l = { stiffness: 100, damping: 10, mass: 1, velocity: 0, duration: 800, bounce: .3, visualDuration: .3, restSpeed: { granular: .01, default: 2 }, restDelta: { granular: .005, default: .5 }, minDuration: .01, maxDuration: 10, minDamping: .05, maxDamping: 1 }; var H = .001; function fe({ duration: e = l.duration, bounce: t = l.bounce, velocity: r = l.velocity, mass: o = l.mass }) { let s, n; F(e <= w(l.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit"); let i = 1 - t; i = k(l.minDamping, l.maxDamping, i), e = k(l.minDuration, l.maxDuration, v(e)), i < 1 ? (s = m => { let p = m * i, c = p * e, u = p - r, d = L(m, i), g = Math.exp(-c); return H - u / d * g }, n = m => { let c = m * i * e, u = c * r + r, d = Math.pow(i, 2) * Math.pow(m, 2) * e, g = Math.exp(-c), y = L(Math.pow(m, 2), i); return (-s(m) + H > 0 ? -1 : 1) * ((u - d) * g) / y }) : (s = m => { let p = Math.exp(-m * e), c = (m - r) * e + 1; return -H + p * c }, n = m => { let p = Math.exp(-m * e), c = (r - m) * (e * e); return p * c }); let f = 5 / e, a = Ce(s, n, f); if (e = w(e), isNaN(a)) return { stiffness: l.stiffness, damping: l.damping, duration: e }; { let m = Math.pow(a, 2) * o; return { stiffness: m, damping: i * 2 * Math.sqrt(o * m), duration: e } } } var Pe = 12; function Ce(e, t, r) { let o = r; for (let s = 1; s < Pe; s++)o = o - e(o) / t(o); return o } function L(e, t) { return e * Math.sqrt(1 - t * t) } var Ie = ["duration", "bounce"], Ke = ["stiffness", "damping", "mass"]; function ce(e, t) { return t.some(r => e[r] !== void 0) } function Be(e) { let t = { velocity: l.velocity, stiffness: l.stiffness, damping: l.damping, mass: l.mass, isResolvedFromDuration: !1, ...e }; if (!ce(e, Ke) && ce(e, Ie)) if (e.visualDuration) { let r = e.visualDuration, o = 2 * Math.PI / (r * 1.2), s = o * o, n = 2 * k(.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(s); t = { ...t, mass: l.mass, stiffness: s, damping: n } } else { let r = fe(e); t = { ...t, ...r, mass: l.mass }, t.isResolvedFromDuration = !0 } return t } function D(e = l.visualDuration, t = l.bounce) { let r = typeof e != "object" ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e, { restSpeed: o, restDelta: s } = r, n = r.keyframes[0], i = r.keyframes[r.keyframes.length - 1], f = { done: !1, value: n }, { stiffness: a, damping: m, mass: p, duration: c, velocity: u, isResolvedFromDuration: d } = Be({ ...r, velocity: -v(r.velocity || 0) }), g = u || 0, y = m / (2 * Math.sqrt(a * p)), h = i - n, T = v(Math.sqrt(a / p)), B = Math.abs(h) < 5; o || (o = B ? l.restSpeed.granular : l.restSpeed.default), s || (s = B ? l.restDelta.granular : l.restDelta.default); let b; if (y < 1) { let x = L(T, y); b = A => { let S = Math.exp(-y * T * A); return i - S * ((g + y * T * h) / x * Math.sin(x * A) + h * Math.cos(x * A)) } } else if (y === 1) b = x => i - Math.exp(-T * x) * (h + (g + T * h) * x); else { let x = T * Math.sqrt(y * y - 1); b = A => { let S = Math.exp(-y * T * A), G = Math.min(x * A, 300); return i - S * ((g + y * T * h) * Math.sinh(G) + x * h * Math.cosh(G)) / x } } let V = { calculatedDuration: d && c || null, next: x => { let A = b(x); if (d) f.done = x >= c; else { let S = x === 0 ? g : 0; y < 1 && (S = x === 0 ? w(g) : me(b, x, A)); let G = Math.abs(S) <= o, ke = Math.abs(i - A) <= s; f.done = G && ke } return f.value = f.done ? i : A, f }, toString: () => { let x = Math.min($(V), 2e4), A = z(S => V.next(x * S).value, x, 30); return x + "ms " + A }, toTransition: () => { } }; return V } D.applyToOptions = e => { let t = pe(e, 100, D); return e.ease = t.ease, e.duration = w(t.duration), e.type = "keyframes", e }; var ue = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"], _ = new Set(ue); var le = {}; function de(e, t) { let r = W(e); return () => le[t] ?? r() } var xe = de(() => { try { document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" }) } catch { return !1 } return !0 }, "linearEasing"); var O = ([e, t, r, o]) => \`cubic-bezier(\${e}, \${t}, \${r}, \${o})\`; var Q = { linear: "linear", ease: "ease", easeIn: "ease-in", easeOut: "ease-out", easeInOut: "ease-in-out", circIn: O([0, .65, .55, 1]), circOut: O([.55, 0, 1, .45]), backIn: O([.31, .01, .66, -.59]), backOut: O([.33, 1.53, .69, .99]) }; function J(e, t) { if (e) return typeof e == "function" ? xe() ? z(e, t) : "ease-out" : Y(e) ? O(e) : Array.isArray(e) ? e.map(r => J(r, t) || Q.easeOut) : Q[e] } function R(e, t, r, { delay: o = 0, duration: s = 300, repeat: n = 0, repeatType: i = "loop", ease: f = "easeOut", times: a } = {}, m = void 0) { let p = { [t]: r }; a && (p.offset = a); let c = J(f, s); Array.isArray(c) && (p.easing = c), q.value && Z.waapi++; let u = { delay: o, duration: s, easing: Array.isArray(c) ? "linear" : c, fill: "both", iterations: n + 1, direction: i === "reverse" ? "alternate" : "normal" }; m && (u.pseudoElement = m); let d = e.animate(p, u); return q.value && d.finished.finally(() => { Z.waapi-- }), d } var ge = e => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(); var ee = "framerAppearId", ye = "data-" + ge(ee); function Ae(e) { return e.props[ye] } var M = new Map, E = new Map; var P = (e, t) => { let r = _.has(t) ? "transform" : t; return \`\${e}: \${r}\` }; function te(e, t, r) { let o = P(e, t), s = M.get(o); if (!s) return null; let { animation: n, startTime: i } = s; function f() { window.MotionCancelOptimisedAnimation?.(e, t, r) } return n.onfinish = f, i === null || window.MotionHandoffIsComplete?.(e) ? (f(), null) : i } var N, C, re = new Set; function Ge() { re.forEach(e => { e.animation.play(), e.animation.startTime = e.startTime }), re.clear() } function oe(e, t, r, o, s) { if (window.MotionIsMounted) return; let n = e.dataset[ee]; if (!n) return; window.MotionHandoffAnimation = te; let i = P(n, t); C || (C = R(e, t, [r[0], r[0]], { duration: 1e4, ease: "linear" }), M.set(i, { animation: C, startTime: null }), window.MotionHandoffAnimation = te, window.MotionHasOptimisedAnimation = (a, m) => { if (!a) return !1; if (!m) return E.has(a); let p = P(a, m); return !!M.get(p) }, window.MotionHandoffMarkAsComplete = a => { E.has(a) && E.set(a, !0) }, window.MotionHandoffIsComplete = a => E.get(a) === !0, window.MotionCancelOptimisedAnimation = (a, m, p, c) => { let u = P(a, m), d = M.get(u); d && (p && c === void 0 ? p.postRender(() => { p.postRender(() => { d.animation.cancel() }) }) : d.animation.cancel(), p && c ? (re.add(d), p.render(Ge)) : (M.delete(u), M.size || (window.MotionCancelOptimisedAnimation = void 0))) }, window.MotionCheckAppearSync = (a, m, p) => { let c = Ae(a); if (!c) return; let u = window.MotionHasOptimisedAnimation?.(c, m), d = a.props.values?.[m]; if (!u || !d) return; let g = p.on("change", y => { d.get() !== y && (window.MotionCancelOptimisedAnimation?.(c, m), g()) }); return g }); let f = () => { C.cancel(); let a = R(e, t, r, o); N === void 0 && (N = performance.now()), a.startTime = N, M.set(i, { animation: a, startTime: N }), s && s(a) }; E.set(n, !1), C.ready ? C.ready.then(f).catch(j) : f() } var ne = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"], ze = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" }, $e = { translateX: "px", translateY: "px", translateZ: "px", x: "px", y: "px", z: "px", perspective: "px", transformPerspective: "px", rotate: "deg", rotateX: "deg", rotateY: "deg" }; function he(e, t) { let r = $e[e]; return !r || typeof t == "string" && t.endsWith(r) ? t : \`\${t}\${r}\` } function ie(e) { return ne.includes(e) } var Le = (e, t) => ne.indexOf(e) - ne.indexOf(t); function Te({ transform: e, transformKeys: t }, r) { let o = {}, s = !0, n = ""; t.sort(Le); for (let i of t) { let f = e[i], a = !0; typeof f == "number" ? a = f === (i.startsWith("scale") ? 1 : 0) : a = parseFloat(f) === 0, a || (s = !1, n += \`\${ze[i] || i}(\${e[i]}) \`), r && (o[i] = e[i]) } return n = n.trim(), r ? n = r(o, n) : s && (n = "none"), n } function ae(e, t) { let r = new Set(Object.keys(e)); for (let o in t) r.add(o); return Array.from(r) } function se(e, t) { let r = t - e.length; if (r <= 0) return e; let o = new Array(r).fill(e[e.length - 1]); return e.concat(o) } function I(e) { return e * 1e3 } var Se = { duration: .001 }, K = { opacity: 1, scale: 1, translateX: 0, translateY: 0, translateZ: 0, x: 0, y: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0 }; function ve(e, t, r, o, s) { return r.delay && (r.delay = I(r.delay)), r.type === "spring" ? Ne(e, t, r, o, s) : We(e, t, r, o, s) } function Re(e, t, r) { let o = {}, s = 0, n = 0; for (let i of ae(e, t)) { let f = e[i] ?? K[i], a = t[i] ?? K[i]; if (f === void 0 || a === void 0 || i !== "transformPerspective" && f === a && f === K[i]) continue; i === "transformPerspective" && (o[i] = [f, a]); let m = Ze(f, a, r), { duration: p, keyframes: c } = m; p === void 0 || c === void 0 || (p > s && (s = p, n = c.length), o[i] = c) } return { keyframeValuesByProps: o, longestDuration: s, longestLength: n } } function Ne(e, t, r, o, s) { let n = {}, { keyframeValuesByProps: i, longestDuration: f, longestLength: a } = Re(e, t, r); if (!a) return n; let m = { ease: "linear", duration: f, delay: r.delay }, p = s ? Se : m, c = {}; for (let [d, g] of Object.entries(i)) ie(d) ? c[d] = se(g, a) : n[d] = { keyframes: se(g, a), options: d === "opacity" ? m : p }; let u = De(c, o); return u && (n.transform = { keyframes: u, options: p }), n } function Fe(e) { let { type: t, duration: r, ...o } = e; return { duration: I(r), ...o } } function We(e, t, r, o, s) { let n = Fe(r); if (!n) return; let i = {}, f = s ? Se : n, a = {}; for (let p of ae(e, t)) { let c = e[p] ?? K[p], u = t[p] ?? K[p]; c === void 0 || u === void 0 || p !== "transformPerspective" && c === u || (ie(p) ? a[p] = [c, u] : i[p] = { keyframes: [c, u], options: p === "opacity" ? n : f }) } let m = De(a, o); return m && (i.transform = { keyframes: m, options: f }), i } var je = ["duration", "bounce"], Xe = ["stiffness", "damping", "mass"]; function we(e) { return Xe.some(t => t in e) ? !1 : je.some(t => t in e) } function Ye(e, t, r) { return we(r) ? \`\${e}-\${t}-\${r.duration}-\${r.bounce}\` : \`\${e}-\${t}-\${r.damping}-\${r.stiffness}-\${r.mass}\` } function qe(e) { return we(e) ? { ...e, duration: I(e.duration) } : e } var Me = new Map, be = 10; function Ze(e, t, r) { let o = Ye(e, t, r), s = Me.get(o); if (s) return s; let n = [e, t], i = D({ ...qe(r), keyframes: n }), f = { done: !1, value: n[0] }, a = [], m = 0; for (; !f.done && m < I(10);)f = i.next(m), a.push(f.value), m += be; n = a; let p = m - be, u = { keyframes: n, duration: p, ease: "linear" }; return Me.set(o, u), u } function De(e, t) { let r = [], o = Object.values(e)[0]?.length; if (!o) return; let s = Object.keys(e); for (let n = 0; n < o; n++) { let i = {}; for (let [a, m] of Object.entries(e)) { let p = m[n]; p !== void 0 && (i[a] = he(a, p)) } let f = Te({ transform: i, transformKeys: s }, t); r.push(f) } return r } function Ue(e, t) { if (!t) for (let r in e) { let o = e[r]; return o?.legacy === !0 ? o : void 0 } } function Oe(e, t, r, o, s, n) { for (let [i, f] of Object.entries(e)) { let a = n ? f[n] : void 0; if (a === null || !a && f.default === null) continue; let m = a ?? f.default ?? Ue(f, n); if (!m) continue; let { initial: p, animate: c, transformTemplate: u } = m; if (!p || !c) continue; let { transition: d, ...g } = c, y = ve(p, g, d, He(u, o), s); if (!y) continue; let h = {}, T = {}; for (let [b, V] of Object.entries(y)) h[b] = V.keyframes, T[b] = V.options; let B = n ? \`:not(.hidden-\${n}) \` : ""; t(\`\${B}[\${r}="\${i}"]\`, h, T) } } function He(e, t) { if (!(!e || !t)) return (r, o) => e.replace(t, o) } function Ve(e) { return e ? e.find(r => r.mediaQuery ? window.matchMedia(r.mediaQuery).matches === !0 : !1)?.hash : void 0 } var Lr = { animateAppearEffects: Oe, getActiveVariantHash: Ve, spring: D, startOptimizedAppearAnimation: oe }; return Lr })()`}
        </Script>

        <Script id="appear-animations-content" type="application/json">
          {`{"hca1ac":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":0,"skewX":0,"skewY":0,"x":-100,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":0,"duration":0.6,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1ymosjo":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.2,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1lxxoia":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.4,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"9o5tp8":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.6,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"1nu2aj7":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.4,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}},"hr269o":{"default":{"initial":{"opacity":0.001,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"x":0,"y":0},"animate":{"opacity":1,"rotate":0,"rotateX":0,"rotateY":0,"scale":1,"skewX":0,"skewY":0,"transition":{"delay":3.6,"duration":0.5,"ease":[0.75,-0.01,0.19,1],"type":"tween"},"x":0,"y":0}}}}`}
        </Script>

        <Script id="breakpoints-data" type="application/json">
          {`[{"hash":"psciyp","mediaQuery":"(min-width: 1920px)"},{"hash":"r5jr8i","mediaQuery":"(min-width: 1200px) and (max-width: 1919.98px)"},{"hash":"uo4cln","mediaQuery":"(min-width: 810px) and (max-width: 1199.98px)"},{"hash":"yzu0cc","mediaQuery":"(max-width: 809.98px)"}]`}
        </Script>

        <Script id="framer-appear-animation" strategy="afterInteractive" data-framer-appear-animation="no-preference">
          {`(() => { function c(i, o, m) { if (window.__framer_disable_appear_effects_optimization__ || typeof animator > "u") return; let e = { detail: { bg: document.hidden } }; requestAnimationFrame(() => { let a = "framer-appear-start"; performance.mark(a, e), animator.animateAppearEffects(JSON.parse(document.getElementById("appear-animations-content").textContent), (s, p, d) => { let t = document.querySelector(s); if (t) for (let [r, f] of Object.entries(p)) animator.startOptimizedAppearAnimation(t, r, f, d[r]) }, i, o, m && window.matchMedia("(prefers-reduced-motion:reduce)").matches === !0, animator.getActiveVariantHash(JSON.parse(document.getElementById("breakpoints-data").textContent))); let n = "framer-appear-end"; performance.mark(n, e), performance.measure("framer-appear", { start: a, end: n, detail: e.detail }) }) } return c })()("data-framer-appear-id", "__Appear_Animation_Transform__", false)`}
        </Script>

        <Script id="date-locale-override" strategy="afterInteractive">
          {`(() => { function d(e) { let t = Date.prototype.toLocaleString, o = Date.prototype.toLocaleDateString; t && (Date.prototype.toLocaleString = function (r, n) { let i = s(this, r, n); return u(e.current.Date.toLocaleString, i, () => t.call(this, r, n)) }), o && (Date.prototype.toLocaleDateString = function (r, n) { let i = s(this, r, n); return u(e.current.Date.toLocaleDateString, i, () => o.call(this, r, n)) }); let a = Object.getOwnPropertyDescriptors(Intl.DateTimeFormat.prototype).format.get, c = Intl.DateTimeFormat.prototype.formatRange, b = Intl.DateTimeFormat.prototype.formatToParts, D = Intl.DateTimeFormat.prototype.formatRangeToParts; a && Object.defineProperty(Intl.DateTimeFormat.prototype, "format", { get() { function m(r) { let n = p(this), i = s(r, n); return u(e.current.DateTimeFormat.format, i, () => a.call(this)(r)) } return m.bind(this) } }), c && (Intl.DateTimeFormat.prototype.formatRange = function (r, n) { let i = p(this), l = s(r, n, i); return u(e.current.DateTimeFormat.formatRange, l, () => c.call(this, r, n)) }), b && (Intl.DateTimeFormat.prototype.formatToParts = function (r) { let n = p(this), i = s(r, n); return u(e.current.DateTimeFormat.formatToParts, i, () => b.call(this, r)).map(g) }), D && (Intl.DateTimeFormat.prototype.formatRangeToParts = function (r, n) { let i = p(this), l = s(r, n, i); return u(e.current.DateTimeFormat.formatRangeToParts, l, () => D.call(this, r, n)).map(g) }); let y = Number.prototype.toLocaleString; y && (Number.prototype.toLocaleString = function (r, n) { let i = s(this, r, n); return u(e.current.Number.toLocaleString, i, () => y.call(this, r, n)) }); let h = Object.getOwnPropertyDescriptors(Intl.NumberFormat.prototype).format.get, F = Intl.NumberFormat.prototype.formatRange, T = Intl.NumberFormat.prototype.formatToParts, I = Intl.NumberFormat.prototype.formatRangeToParts; h && Object.defineProperty(Intl.NumberFormat.prototype, "format", { get() { function m(r) { let n = f(this), i = s(r, n); return u(e.current.NumberFormat.format, i, () => h.call(this)(r)) } return m.bind(this) } }), F && (Intl.NumberFormat.prototype.formatRange = function (r, n) { let i = f(this), l = s(r, n, i); return u(e.current.NumberFormat.formatRange, l, () => F.call(this, r, n)) }), T && (Intl.NumberFormat.prototype.formatToParts = function (r) { let n = f(this), i = s(r, n); return u(e.current.NumberFormat.formatToParts, i, () => T.call(this, r)).map(g) }), I && (Intl.NumberFormat.prototype.formatRangeToParts = function (r, n) { let i = f(this), l = s(r, n, i); return u(e.current.NumberFormat.formatRangeToParts, l, () => I.call(this, r, n)).map(g) }) } function P(e, t) { return typeof t == "bigint" ? \`\${t}n\` : t instanceof Date ? t.getTime() : t } function s(...e) { let t = JSON.stringify(e, P), o = 0; for (let a = 0; a < t.length; a++)o += t.charCodeAt(a), o += o << 10, o ^= o >> 6; return o += o << 3, o ^= o >> 11, o += o << 15, o >>> 0 } function u(e, t, o) { let a = e[t]; if (typeof a < "u") return a; let c = o(); return e[t] = c, c } function g(e) { return { ...e } } function p(e) { let t = e.resolvedOptions(), o = { locale: t.locale, calendar: t.calendar, numberingSystem: t.numberingSystem, timeZone: t.timeZone, hour12: t.hour12, weekday: t.weekday, era: t.era, year: t.year, month: t.month, day: t.day, hour: t.hour, minute: t.minute, second: t.second, timeZoneName: t.timeZoneName }; for (let a in t) a in o || (o[a] = t[a]); return o } function f(e) { let t = e.resolvedOptions(), o = { locale: t.locale, numberingSystem: t.numberingSystem, style: t.style, currency: t.currency, currencyDisplay: t.currencyDisplay, currencySign: t.currencySign, unit: t.unit, unitDisplay: t.unitDisplay, minimumIntegerDigits: t.minimumIntegerDigits, minimumFractionDigits: t.minimumFractionDigits, maximumFractionDigits: t.maximumFractionDigits, minimumSignificantDigits: t.minimumSignificantDigits, maximumSignificantDigits: t.maximumSignificantDigits, useGrouping: t.useGrouping === !0 ? "auto" : t.useGrouping, notation: t.notation, compactDisplay: t.compactDisplay, signDisplay: t.signDisplay, roundingIncrement: t.roundingIncrement ?? 1, roundingMode: t.roundingMode ?? "halfExpand", roundingPriority: t.roundingPriority ?? "auto", trailingZeroDisplay: t.trailingZeroDisplay ?? "auto" }; for (let a in t) a in o || (o[a] = t[a]); return o } return d })()({ current: { "Date": { "toLocaleString": {}, "toLocaleDateString": {} }, "DateTimeFormat": { "format": { "565693836": "23:02" }, "formatRange": {}, "formatToParts": {}, "formatRangeToParts": {} }, "Number": { "toLocaleString": {} }, "NumberFormat": { "format": {}, "formatRange": {}, "formatToParts": {}, "formatRangeToParts": {} } } })`}
        </Script>

        <Script id="process-env" strategy="beforeInteractive">
          {`typeof document < "u" && (window.process = { ...window.process, env: { ...window.process?.env, NODE_ENV: "production" } });`}
        </Script>

        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/react.DT_uKGTS.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/rolldown-runtime.DsXBSD_B.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/framer.BKA-AZT-.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/motion.FcH5xw95.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/8FRC49xLqUo6eiurQao_P0CTCsBlagbmUkviXE5l3hU.DipG3uEC.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/HoverDim.DdSQrOzW.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/MenuJarconico.GOtVk2Of.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/fZ1F6lARf.BnBQCwKL.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/shared-lib.CKUA0b_V.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/ProjectGallery.Ds0yNeLb.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/lYmM3ANLp.DDW3po9M.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/GlobalEasing.DJAd3gqO.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/CaHnfzwKq.Dr3Nakxc.mjs" />
        <link rel="modulepreload" fetchPriority="low"
          href="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/script_main.CZ0gu4nD.mjs" />
        <script type="module" async data-framer-bundle="main" fetchPriority="low"
          src="https://framerusercontent.com/sites/4zHLQ5JKcTmZixCag7pCtz/script_main.CZ0gu4nD.mjs"></script>
        <div id="svg-templates"
          style={{
            position: "absolute",
            overflow: "hidden",
            bottom: 0,
            left: 0,
            width: 0,
            height: 0,
            zIndex: 0,
            contain: "strict"
          }}
          aria-hidden="true">
          <svg viewBox="0 0 6 6" overflow="visible" id="svg-1245632372_353">
            <path d="M 3 0 C 4.657 0 6 1.343 6 3 C 6 4.657 4.657 6 3 6 C 1.343 6 0 4.657 0 3 C 0 1.343 1.343 0 3 0 Z"
              fill="var(--token-5758eb25-99c7-4121-a1bc-2d5bdc7fa748, rgb(0, 0, 0)) /* {&quot;name&quot;:&quot;black&quot;} */">
            </path>
          </svg>
          <svg viewBox="0 0 8.766 8.213" overflow="visible" id="svg1547463893_535">
            <path
              d="M 4.658 8.213 L 3.803 7.358 L 5.262 5.905 C 5.66 5.506 6.112 5.09 6.539 4.692 C 6.188 4.71 5.819 4.727 5.473 4.727 L 0 4.727 L 0 3.486 L 5.473 3.486 C 5.818 3.486 6.188 3.503 6.533 3.521 C 6.105 3.123 5.66 2.712 5.262 2.314 L 3.802 0.861 L 4.658 0 L 8.766 4.106 Z"
              fill="var(--token-64b44c9e-f906-49a8-a483-76d5dcfb3f62, rgb(255, 255, 255)) /* {&quot;name&quot;:&quot;white&quot;} */">
            </path>
          </svg>
        </div>
        {/* Start of bodyEnd */}

        {/* End of bodyEnd */}
        <iframe id="__framer-editorbar"
          src="https://framer.com/edit?framerSiteId=d487ba51b4e04321f404046cdd871a0f54b753d760371e89eb133a992ce6d4dd&amp;source=jarcos.work&amp;features=%7B%22editorBarDisableFrameAncestorsSecurity%22%3Afalse%2C%22onPageLocalizationSupport%22%3Afalse%2C%22onPageMoveTool%22%3Afalse%7D&amp;loadStart=1766563571836"
          aria-hidden="true" allow="autoplay" tabIndex={-1} className="status_hidden">
        </iframe>
      </body>
    </html>
  );
}