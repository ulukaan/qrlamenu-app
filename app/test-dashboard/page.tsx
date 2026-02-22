"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Shield, Activity, Database, Globe, Key, Settings,
    RefreshCw, CheckCircle2, XCircle, Clock, Eye, EyeOff,
    ExternalLink, AlertTriangle, Play, Square, Trash2,
    ChevronRight, Terminal, Wifi, Server, Users,
    BarChart3, Zap, Lock, Unlock, Copy, Check,
    TrendingUp, Package, ShoppingCart, Star
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────── //
type TabId = 'overview' | 'security' | 'api' | 'auth' | 'performance' | 'themes' | 'logs' | 'restaurant';
type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'warn';
interface TestResult { name: string; status: TestStatus; message: string; duration?: number; response?: string; }

// ─── Constants ─────────────────────────────────────────────────────────── //
const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Genel Bakış', icon: <Activity size={14} /> },
    { id: 'security', label: 'Güvenlik', icon: <Shield size={14} /> },
    { id: 'restaurant', label: 'Restoran', icon: <ShoppingCart size={14} /> },
    { id: 'api', label: 'API Explorer', icon: <Globe size={14} /> },
    { id: 'auth', label: 'Auth & Oturum', icon: <Key size={14} /> },
    { id: 'performance', label: 'Performans', icon: <Zap size={14} /> },
    { id: 'themes', label: 'Temalar', icon: <Star size={14} /> },
    { id: 'logs', label: 'Loglar', icon: <Terminal size={14} /> },
];

const SECURITY_CHECKS = [
    { label: 'Debug DB endpoint → 404', url: '/api/debug/inspect-db', method: 'GET', body: null, expect: 404, desc: 'DB tablo listesi herkese açık olmamalı' },
    { label: 'Debug Seed endpoint → 404', url: '/api/debug/seed', method: 'GET', body: null, expect: 404, desc: 'Seed endpoint production\'da kapalı olmalı' },
    { label: 'Boş body → 400', url: '/api/auth/login', method: 'POST', body: {}, expect: 400, desc: 'Eksik alanlar 400 döndürmeli' },
    { label: 'Yanlış şifre → 401', url: '/api/auth/login', method: 'POST', body: { email: 'x@x.com', password: 'wrong' }, expect: 401, desc: 'Hatalı kimlik 401 döndürmeli' },
    { label: 'SQL injection → 400/401', url: '/api/auth/login', method: 'POST', body: { email: "' OR 1=1--", password: 'x' }, expect: 400, desc: 'SQL enjeksiyon girdisi reddedilmeli' },
    { label: 'XSS payload → 400/401', url: '/api/auth/login', method: 'POST', body: { email: '<script>alert(1)</script>', password: 'x' }, expect: 400, desc: 'XSS payload reddedilmeli' },
    { label: 'Uzun input → 400/401', url: '/api/auth/login', method: 'POST', body: { email: 'a'.repeat(500) + '@x.com', password: 'x' }, expect: 400, desc: 'Çok uzun girdiler reddedilmeli' },
    { label: 'auth/me korumalı → 401', url: '/api/auth/me', method: 'GET', body: null, expect: 401, desc: 'Oturumsuz erişim reddedilmeli' },
    { label: 'admin/tenants korumalı → 401', url: '/api/admin/tenants', method: 'GET', body: null, expect: 401, desc: 'Admin API korumalı olmalı' },
    { label: 'admin/plans korumalı → 401', url: '/api/admin/plans', method: 'GET', body: null, expect: 401, desc: 'Plan yönetimi korumalı olmalı' },
    { label: 'admin/admins korumalı → 401', url: '/api/admin/admins', method: 'GET', body: null, expect: 401, desc: 'Kullanıcı listesi korumalı olmalı' },
];

const API_ENDPOINTS = [
    {
        category: 'Auth', endpoints: [
            { method: 'GET', url: '/api/auth/me', desc: 'Aktif kullanıcı bilgisi' },
            { method: 'POST', url: '/api/auth/login', desc: 'Giriş yap', body: { email: '', password: '' } },
            { method: 'POST', url: '/api/auth/logout', desc: 'Çıkış yap' },
        ]
    },
    {
        category: 'Admin', endpoints: [
            { method: 'GET', url: '/api/admin/tenants', desc: 'Tüm kiracılar' },
            { method: 'GET', url: '/api/admin/plans', desc: 'Abonelik planları' },
            { method: 'GET', url: '/api/admin/admins', desc: 'Admin listesi' },
            { method: 'GET', url: '/api/admin/stats', desc: 'Genel istatistikler' },
            { method: 'GET', url: '/api/admin/audit', desc: 'Denetim kayıtları' },
        ]
    },
    {
        category: 'Restoran', endpoints: [
            { method: 'GET', url: '/api/restaurant/analytics', desc: 'Analitik verisi' },
            { method: 'GET', url: '/api/restaurant/orders', desc: 'Siparişler' },
            { method: 'GET', url: '/api/restaurant/products', desc: 'Ürünler' },
            { method: 'GET', url: '/api/restaurant/categories', desc: 'Kategoriler' },
            { method: 'GET', url: '/api/restaurant/settings', desc: 'Restoran ayarları' },
            { method: 'GET', url: '/api/restaurant/stats', desc: 'İstatistikler' },
        ]
    },
    {
        category: 'Public', endpoints: [
            { method: 'GET', url: '/api/themes', desc: 'Tema listesi' },
            { method: 'GET', url: '/api/restaurant/campaigns/public?tenantId=test', desc: 'Kampanyalar (Public)' },
        ]
    },
];

const THEME_LIST = [
    { name: 'Lite', param: 'LITE', color: '#64748b', emoji: '⚡' },
    { name: 'Classic', param: 'CLASSIC', color: '#92400e', emoji: '📜' },
    { name: 'Modern', param: 'MODERN', color: '#4f46e5', emoji: '🎨' },
    { name: 'Signature', param: 'SIGNATURE', color: '#0f766e', emoji: '✍️' },
    { name: 'Luxury', param: 'LUXURY', color: '#7c3aed', emoji: '💎' },
    { name: 'FastFood', param: 'FASTFOOD', color: '#dc2626', emoji: '🍔' },
];

// ─── Helpers ───────────────────────────────────────────────────────────── //
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
    return (
        <button onClick={copy} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        </button>
    );
}

function Badge({ status }: { status: TestStatus }) {
    const cfg = {
        idle: { cls: 'bg-gray-100 text-gray-500', icon: <Clock size={11} />, label: 'Bekliyor' },
        running: { cls: 'bg-blue-50 text-blue-600', icon: <RefreshCw size={11} className="animate-spin" />, label: 'Çalışıyor' },
        pass: { cls: 'bg-green-50 text-green-700', icon: <CheckCircle2 size={11} />, label: 'Geçti' },
        fail: { cls: 'bg-red-50 text-red-700', icon: <XCircle size={11} />, label: 'Başarısız' },
        warn: { cls: 'bg-amber-50 text-amber-700', icon: <AlertTriangle size={11} />, label: 'Uyarı' },
    }[status];
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function MethodBadge({ method }: { method: string }) {
    const colors: Record<string, string> = {
        GET: 'bg-blue-50 text-blue-700', POST: 'bg-green-50 text-green-700',
        PUT: 'bg-amber-50 text-amber-700', DELETE: 'bg-red-50 text-red-700', PATCH: 'bg-purple-50 text-purple-700',
    };
    return <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold font-mono ${colors[method] ?? 'bg-gray-100 text-gray-600'}`}>{method}</span>;
}

// ─── Tab: Overview ─────────────────────────────────────────────────────── //
function OverviewTab() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [timeStr, setTimeStr] = useState<string>('');
    const [userAgentStr, setUserAgentStr] = useState<string>('Yükleniyor...');

    useEffect(() => {
        setTimeStr(new Date().toLocaleString('tr-TR'));
        setUserAgentStr(navigator.userAgent.slice(0, 60) + '…');
        Promise.all([
            fetch('/api/auth/me').then(r => r.json()).catch(() => null),
            fetch('/api/admin/stats').then(r => r.json()).catch(() => null),
        ]).then(([u, s]) => { setUser(u); setStats(s); setLoading(false); });
    }, []);

    const cards = [
        { label: 'Restoran', value: stats?.tenantCount ?? '—', icon: <Server size={16} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Kullanıcı', value: stats?.userCount ?? '—', icon: <Users size={16} />, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Sipariş', value: stats?.orderCount ?? '—', icon: <ShoppingCart size={16} />, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Ürün', value: stats?.productCount ?? '—', icon: <Package size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-6">
            {/* Session Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${user?.user ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                {user?.user ? <Unlock size={16} className="text-green-600 shrink-0" /> : <Lock size={16} className="text-gray-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                    {user?.user ? (
                        <p className="text-sm font-medium text-green-800">
                            <strong>{user.user.name}</strong> olarak giriş yapıldı
                            <span className="ml-2 text-xs font-normal opacity-70">({user.user.email} · {user.user.role})</span>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">Aktif oturum yok</p>
                    )}
                </div>
                {!user?.user && <Link href="/login" className="text-xs font-semibold text-indigo-600 hover:underline shrink-0">Giriş →</Link>}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cards.map(c => (
                    <div key={c.label} className="border border-gray-200 rounded-xl p-4">
                        <div className={`inline-flex p-2 rounded-lg ${c.bg} ${c.color} mb-3`}>{c.icon}</div>
                        <p className="text-2xl font-bold text-gray-900">{loading ? '…' : c.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Hızlı Erişim</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                        { href: '/login', label: 'Login Sayfası', icon: '🔐' },
                        { href: '/super-admin', label: 'Super Admin', icon: '🛡️' },
                        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
                        { href: '/', label: 'Ana Sayfa', icon: '🏠' },
                        { href: '/siparisler', label: 'Siparişler', icon: '🍽️' },
                        { href: '/hesap-ayarlari', label: 'Hesap Ayarları', icon: '⚙️' },
                    ].map(l => (
                        <Link key={l.href} href={l.href} className="flex items-center gap-2.5 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                            <span>{l.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{l.label}</span>
                            <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Environment */}
            <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Ortam Bilgisi</p>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                    {[
                        ['NODE_ENV', process.env.NODE_ENV ?? 'development'],
                        ['Next.js', '14.1.0'],
                        ['Zaman', timeStr || 'Yükleniyor...'],
                        ['User Agent', userAgentStr],
                    ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between px-4 py-2.5 gap-4">
                            <span className="text-xs text-gray-400 font-mono shrink-0">{k}</span>
                            <span className="text-xs text-gray-700 font-medium text-right truncate">{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Security ─────────────────────────────────────────────────────── //
function SecurityTab() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [running, setRunning] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const runAll = useCallback(async () => {
        setRunning(true);
        setResults(SECURITY_CHECKS.map(c => ({ name: c.label, status: 'running', message: c.desc })));

        for (const check of SECURITY_CHECKS) {
            const start = Date.now();
            try {
                const res = await fetch(check.url, {
                    method: check.method,
                    headers: check.body ? { 'Content-Type': 'application/json' } : {},
                    body: check.body ? JSON.stringify(check.body) : undefined,
                });
                const duration = Date.now() - start;
                let text = '';
                try { text = await res.text(); } catch { }
                const pass = res.status === check.expect ||
                    (check.label.includes('→ 400/401') && (res.status === 400 || res.status === 401));
                setResults(prev => prev.map(r => r.name === check.label
                    ? { name: check.label, status: pass ? 'pass' : 'fail', message: `HTTP ${res.status} (beklenen ${check.expect})`, duration, response: text }
                    : r
                ));
            } catch (e: any) {
                setResults(prev => prev.map(r => r.name === check.label
                    ? { name: check.label, status: 'fail', message: e.message }
                    : r
                ));
            }
            await new Promise(r => setTimeout(r, 100));
        }
        setRunning(false);
    }, []);

    const pass = results.filter(r => r.status === 'pass').length;
    const fail = results.filter(r => r.status === 'fail').length;
    const total = SECURITY_CHECKS.length;
    const score = results.length === total ? Math.round((pass / total) * 100) : null;

    return (
        <div className="space-y-4">
            {/* Score Header */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Güvenlik Skoru</p>
                    <p className="text-xs text-gray-400">{total} test · {pass} geçti · {fail} başarısız</p>
                </div>
                <div className="flex items-center gap-3">
                    {score !== null && (
                        <span className={`text-2xl font-black ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {score}%
                        </span>
                    )}
                    <button onClick={runAll} disabled={running}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors">
                        {running ? <><RefreshCw size={12} className="animate-spin" /> Taranıyor…</> : <><Play size={12} fill="white" /> Tüm Testleri Çalıştır</>}
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            {results.length > 0 && score !== null && (
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${score}%` }} />
                </div>
            )}

            {/* Test List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {SECURITY_CHECKS.map((check, i) => {
                    const result = results[i];
                    return (
                        <div key={check.label} className={`border-b border-gray-100 last:border-0 ${result?.status === 'fail' ? 'bg-red-50/50' : ''}`}>
                            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => result?.response && setExpanded(expanded === check.label ? null : check.label)}>
                                <div className="shrink-0">{result ? <Badge status={result.status} /> : <Badge status="idle" />}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{check.label}</p>
                                    <p className="text-xs text-gray-400 truncate">{check.desc}</p>
                                </div>
                                {result?.duration && <span className="text-xs text-gray-400 shrink-0">{result.duration}ms</span>}
                                {result?.message && result.status !== 'idle' && (
                                    <span className={`text-xs font-mono shrink-0 ${result.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.message}
                                    </span>
                                )}
                            </div>
                            {expanded === check.label && result?.response && (
                                <div className="px-4 pb-3">
                                    <pre className="text-xs bg-gray-950 text-green-400 p-3 rounded-lg overflow-auto max-h-40 font-mono">{result.response}</pre>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Tab: API Explorer ─────────────────────────────────────────────────── //
function ApiTab() {
    const [results, setResults] = useState<Record<string, { status: number; body: any; duration: number }>>({});
    const [loading, setLoading] = useState<string | null>(null);
    const [customUrl, setCustomUrl] = useState('/api/auth/me');
    const [customMethod, setCustomMethod] = useState('GET');
    const [customBody, setCustomBody] = useState('');
    const [customResult, setCustomResult] = useState<any>(null);

    const testEndpoint = async (url: string, method = 'GET', body?: any) => {
        setLoading(url);
        const start = Date.now();
        try {
            const res = await fetch(url, {
                method,
                headers: body ? { 'Content-Type': 'application/json' } : {},
                body: body ? JSON.stringify(body) : undefined,
            });
            let b: any = {};
            try { b = await res.json(); } catch { }
            setResults(p => ({ ...p, [url]: { status: res.status, body: b, duration: Date.now() - start } }));
        } catch (e: any) {
            setResults(p => ({ ...p, [url]: { status: 0, body: { error: e.message }, duration: Date.now() - start } }));
        }
        setLoading(null);
    };

    const runCustom = async () => {
        setCustomResult(null);
        const start = Date.now();
        try {
            let parsedBody: any;
            if (customBody.trim()) { try { parsedBody = JSON.parse(customBody); } catch { parsedBody = null; } }
            const res = await fetch(customUrl, {
                method: customMethod,
                headers: parsedBody ? { 'Content-Type': 'application/json' } : {},
                body: parsedBody ? JSON.stringify(parsedBody) : undefined,
            });
            let b: any = {};
            try { b = await res.json(); } catch { }
            setCustomResult({ status: res.status, ok: res.ok, body: b, duration: Date.now() - start });
        } catch (e: any) {
            setCustomResult({ error: e.message });
        }
    };

    return (
        <div className="space-y-6">
            {/* Custom Request */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-800">🔧 Özel İstek</p>
                <div className="flex gap-2">
                    <select value={customMethod} onChange={e => setCustomMethod(e.target.value)}
                        className="text-xs font-bold border border-gray-200 rounded-lg px-2 py-2 outline-none bg-white">
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => <option key={m}>{m}</option>)}
                    </select>
                    <input value={customUrl} onChange={e => setCustomUrl(e.target.value)} placeholder="/api/..."
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none font-mono focus:border-gray-400" />
                    <button onClick={runCustom} className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700">
                        Gönder
                    </button>
                </div>
                {['POST', 'PUT', 'PATCH'].includes(customMethod) && (
                    <textarea value={customBody} onChange={e => setCustomBody(e.target.value)} placeholder='{"key": "value"}'
                        className="w-full text-xs border border-gray-200 rounded-lg p-3 outline-none font-mono h-20 resize-none focus:border-gray-400" />
                )}
                {customResult && (
                    <div className={`rounded-lg overflow-hidden border ${customResult.ok ? 'border-green-200' : 'border-red-200'}`}>
                        <div className={`flex items-center justify-between px-3 py-2 text-xs font-semibold ${customResult.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            <span>HTTP {customResult.status} · {customResult.duration}ms</span>
                            <CopyButton text={JSON.stringify(customResult.body, null, 2)} />
                        </div>
                        <pre className="text-xs p-3 bg-gray-950 text-green-400 overflow-auto max-h-48 font-mono">
                            {JSON.stringify(customResult.body ?? { error: customResult.error }, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Endpoint Catalog */}
            {API_ENDPOINTS.map(cat => (
                <div key={cat.category}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{cat.category}</p>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        {cat.endpoints.map((ep, i) => {
                            const r = results[ep.url];
                            return (
                                <div key={ep.url} className={`${i > 0 ? 'border-t border-gray-100' : ''}`}>
                                    <div className="flex items-center gap-3 px-4 py-2.5">
                                        <MethodBadge method={ep.method} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-mono text-gray-700 truncate">{ep.url}</p>
                                            <p className="text-xs text-gray-400">{ep.desc}</p>
                                        </div>
                                        {r && (
                                            <span className={`text-xs font-mono font-medium shrink-0 ${r.status < 300 ? 'text-green-600' : r.status < 400 ? 'text-blue-600' : 'text-red-600'}`}>
                                                {r.status} · {r.duration}ms
                                            </span>
                                        )}
                                        <button onClick={() => testEndpoint(ep.url, ep.method, (ep as any).body)} disabled={loading === ep.url}
                                            className="shrink-0 text-xs px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                                            {loading === ep.url ? '…' : 'Test'}
                                        </button>
                                    </div>
                                    {r && (
                                        <div className="px-4 pb-3">
                                            <pre className="text-xs bg-gray-950 text-green-400 p-2.5 rounded-lg overflow-auto max-h-32 font-mono">
                                                {JSON.stringify(r.body, null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Tab: Auth ─────────────────────────────────────────────────────────── //
function AuthTab() {
    const [email, setEmail] = useState('sametdursun@yaani.com');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(setSession).catch(() => setSession(null));
    }, []);

    const login = async (wrong = false) => {
        setLoading(true); setResult(null);
        const start = Date.now();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: wrong ? 'YANLIS_SIFRE_TEST!' : password }),
            });
            const data = await res.json();
            setResult({ status: res.status, ok: res.ok, data, duration: Date.now() - start, wrong });
            if (res.ok) { const s = await fetch('/api/auth/me').then(r => r.json()); setSession(s); }
        } catch (e: any) { setResult({ error: e.message }); }
        setLoading(false);
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setSession(null); setResult(null);
    };

    return (
        <div className="space-y-5">
            {/* Current Session */}
            <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Aktif Oturum</p>
                    <button onClick={logout} className="text-xs text-red-500 hover:text-red-700 font-medium">Çıkış Yap</button>
                </div>
                {session?.user ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[['Ad', session.user.name], ['E-posta', session.user.email], ['Rol', session.user.role], ['Tenant Durumu', session.user.tenant?.status ?? '—']].map(([k, v]) => (
                            <div key={k}>
                                <p className="text-xs text-gray-400">{k}</p>
                                <p className="text-sm font-semibold text-gray-900">{v}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Aktif oturum bulunamadı</p>
                )}
            </div>

            {/* Login Form */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold">Giriş Testi</p>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400" />
                <div className="relative">
                    <input value={password} onChange={e => setPassword(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Şifre"
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 outline-none focus:border-gray-400" />
                    <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => login(false)} disabled={loading}
                        className="py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">
                        ✅ Doğru şifre ile giriş
                    </button>
                    <button onClick={() => login(true)} disabled={loading}
                        className="py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-40">
                        ❌ Yanlış şifre testi
                    </button>
                </div>
                <AnimatePresence>
                    {result && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`rounded-xl overflow-hidden border ${result.ok ? 'border-green-200' : 'border-red-200'}`}>
                            <div className={`px-3 py-2 text-xs font-semibold flex items-center justify-between ${result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                <span>HTTP {result.status} · {result.duration}ms{result.wrong ? ' (yanlış şifre testi)' : ''}</span>
                                <CopyButton text={JSON.stringify(result.data, null, 2)} />
                            </div>
                            <pre className="text-xs p-3 bg-gray-950 text-green-400 font-mono overflow-auto max-h-32">
                                {JSON.stringify(result.data ?? { error: result.error }, null, 2)}
                            </pre>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Token Info */}
            <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">Cookie Bilgisi</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-mono text-gray-500">auth-token:</span>
                    <span className="text-xs font-mono text-gray-400 flex-1 truncate">
                        {typeof document !== 'undefined'
                            ? (document.cookie.includes('auth-token') ? '[HTTP-only cookie mevcut]' : 'Cookie bulunamadı')
                            : '—'}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">HTTP-only cookie'ler JavaScript'ten okunamaz — bu güvenlik özelliğidir ✓</p>
            </div>
        </div>
    );
}

// ─── Tab: Performance ──────────────────────────────────────────────────── //
function PerformanceTab() {
    const [results, setResults] = useState<{ url: string; times: number[]; avg: number; min: number; max: number }[]>([]);
    const [running, setRunning] = useState(false);

    const PERF_URLS = [
        '/api/auth/me', '/api/themes',
        '/api/restaurant/orders', '/api/restaurant/products',
        '/api/admin/plans',
    ];

    const run = async () => {
        setRunning(true); setResults([]);
        for (const url of PERF_URLS) {
            const times: number[] = [];
            for (let i = 0; i < 5; i++) {
                const start = Date.now();
                try { await fetch(url); } catch { }
                times.push(Date.now() - start);
                await new Promise(r => setTimeout(r, 50));
            }
            const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
            setResults(prev => [...prev, { url, times, avg, min: Math.min(...times), max: Math.max(...times) }]);
        }
        setRunning(false);
    };

    const maxAvg = Math.max(...results.map(r => r.avg), 1);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                    <p className="text-sm font-semibold">Yanıt Süresi Testi</p>
                    <p className="text-xs text-gray-400">Her endpoint 5 kez çağrılır, ortalama hesaplanır</p>
                </div>
                <button onClick={run} disabled={running}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-40">
                    {running ? <><RefreshCw size={12} className="animate-spin" /> Ölçülüyor…</> : <><Zap size={12} /> Başlat</>}
                </button>
            </div>

            {results.length > 0 && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {results.map(r => (
                        <div key={r.url} className="border-b border-gray-100 last:border-0 px-4 py-3.5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono text-gray-700">{r.url}</span>
                                <div className="flex gap-3 text-xs font-medium">
                                    <span className="text-gray-400">min <strong className="text-gray-700">{r.min}ms</strong></span>
                                    <span className="text-gray-400">max <strong className="text-gray-700">{r.max}ms</strong></span>
                                    <span className={`font-bold ${r.avg < 200 ? 'text-green-600' : r.avg < 500 ? 'text-amber-600' : 'text-red-600'}`}>
                                        ø {r.avg}ms
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${r.avg < 200 ? 'bg-green-500' : r.avg < 500 ? 'bg-amber-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min((r.avg / maxAvg) * 100, 100)}%`, transition: 'width 0.5s' }} />
                            </div>
                            <div className="flex gap-1 mt-1.5">
                                {r.times.map((t, i) => (
                                    <span key={i} className="text-xs text-gray-400 font-mono">{t}ms{i < r.times.length - 1 ? ' ·' : ''}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {!running && results.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">Performans testini başlatmak için "Başlat" butonuna tıklayın</p>
            )}
        </div>
    );
}

// ─── Tab: Themes ───────────────────────────────────────────────────────── //
function ThemesTab() {
    const [slug, setSlug] = useState('test');
    return (
        <div className="space-y-5">
            <div className="flex gap-2">
                <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="restoran-slug"
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400" />
                <span className="text-sm text-gray-400 self-center">slug'ını değiştirin</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {THEME_LIST.map(t => (
                    <a key={t.name} href={`/r/${slug}?theme=${t.param}`} target="_blank" rel="noreferrer"
                        className="group flex flex-col gap-3 p-5 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all">
                        <div className="text-2xl">{t.emoji}</div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">{t.name}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">?theme={t.param}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600">
                            <ExternalLink size={11} /> Yeni sekmede aç
                        </div>
                    </a>
                ))}
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">Tema URL Oluşturucu</p>
                <div className="flex gap-2 flex-wrap">
                    {THEME_LIST.map(t => (
                        <div key={t.name} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                            <span className="text-xs font-mono text-gray-600">/r/{slug}?theme={t.param}</span>
                            <CopyButton text={`/r/${slug}?theme=${t.param}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Tab: Logs ─────────────────────────────────────────────────────────── //
function LogsTab() {
    const [logs, setLogs] = useState<{ time: string; level: string; msg: string }[]>([]);
    const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');
    const ref = useRef<HTMLDivElement>(null);

    const addLog = useCallback((level: string, msg: string) => {
        const time = new Date().toLocaleTimeString('tr-TR');
        setLogs(prev => [...prev.slice(-200), { time, level, msg }]);
    }, []);

    useEffect(() => {
        addLog('info', 'Test Dashboard başlatıldı');
        addLog('info', `NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`);
        addLog('info', `Kullanıcı dili: ${navigator.language}`);

        const originalFetch = window.fetch;
        (window as any).fetch = async (...args: any[]) => {
            const url = typeof args[0] === 'string' ? args[0] : args[0]?.url ?? '';
            const method = (args[1]?.method ?? 'GET').toUpperCase();
            const start = Date.now();
            try {
                const res = await originalFetch(...(args as Parameters<typeof originalFetch>));
                const duration = Date.now() - start;
                const level = res.status >= 500 ? 'error' : res.status >= 400 ? 'warn' : 'info';
                addLog(level, `${method} ${url} → ${res.status} (${duration}ms)`);
                return res;
            } catch (e: any) {
                addLog('error', `${method} ${url} → HATA: ${e.message}`);
                throw e;
            }
        };
        return () => { (window as any).fetch = originalFetch; };
    }, [addLog]);

    useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [logs]);

    const filtered = filter === 'all' ? logs : logs.filter(l => l.level === filter);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex gap-1">
                    {(['all', 'info', 'warn', 'error'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {f === 'all' ? 'Tümü' : f.toUpperCase()}
                            <span className="ml-1 opacity-60">{f === 'all' ? logs.length : logs.filter(l => l.level === f).length}</span>
                        </button>
                    ))}
                </div>
                <button onClick={() => setLogs([])} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                    <Trash2 size={12} /> Temizle
                </button>
            </div>
            <div ref={ref} className="h-96 overflow-y-auto bg-gray-950 rounded-xl p-3 font-mono text-xs space-y-0.5 scroll-smooth">
                {filtered.length === 0 && <p className="text-gray-600 text-center pt-8">Henüz log yok — API testleri yapın</p>}
                {filtered.map((l, i) => (
                    <div key={i} className={`flex gap-3 ${l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-amber-400' : 'text-green-400'}`}>
                        <span className="text-gray-600 shrink-0">{l.time}</span>
                        <span className={`shrink-0 font-bold ${l.level === 'error' ? 'text-red-500' : l.level === 'warn' ? 'text-amber-500' : 'text-blue-500'}`}>
                            [{l.level.toUpperCase()}]
                        </span>
                        <span className="break-all">{l.msg}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-400 text-center">Sayfadaki tüm fetch istekleri otomatik olarak loglanır</p>
        </div>
    );
}

// ─── Tab: Restaurant ───────────────────────────────────────────────────── //
function RestaurantTab() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [tenantId, setTenantId] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [testResults, setTestResults] = useState<Record<string, any>>({});

    // Auth'dan tenant bilgisini al
    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => {
            if (d?.user?.tenant?.id) { setTenantId(d.user.tenant.id); }
            if (d?.user?.tenant?.slug) { setSlug(d.user.tenant.slug); }
        }).catch(() => { });
    }, []);

    const load = async (key: string, url: string) => {
        setLoading(p => ({ ...p, [key]: true }));
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (key === 'stats') setStats(data);
            else if (key === 'analytics') setAnalytics(data);
            else if (key === 'orders') setOrders(Array.isArray(data) ? data : data.orders ?? []);
            else if (key === 'products') setProducts(Array.isArray(data) ? data : data.products ?? []);
            else if (key === 'categories') setCategories(Array.isArray(data) ? data : data.categories ?? []);
            setTestResults(p => ({ ...p, [key]: { status: res.status, ok: res.ok, count: Array.isArray(data) ? data.length : undefined } }));
        } catch (e: any) {
            setTestResults(p => ({ ...p, [key]: { error: e.message } }));
        }
        setLoading(p => ({ ...p, [key]: false }));
    };

    const loadAll = () => {
        const tid = tenantId ? `?tenantId=${tenantId}` : '';
        load('stats', `/api/restaurant/stats${tid}`);
        load('analytics', `/api/restaurant/analytics`);
        load('orders', `/api/restaurant/orders${tid}`);
        load('products', `/api/restaurant/products${tid}`);
        load('categories', `/api/restaurant/categories${tid}`);
    };

    const ORDER_STATUS_COLORS: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-700',
        PREPARING: 'bg-blue-50 text-blue-700',
        SERVED: 'bg-green-50 text-green-700',
        COMPLETED: 'bg-gray-100 text-gray-600',
        CANCELLED: 'bg-red-50 text-red-600',
    };

    // Test: Sipariş durumu güncelleme
    const testOrderStatus = async (orderId: string, status: string) => {
        const res = await fetch(`/api/restaurant/orders`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status }),
        });
        const d = await res.json();
        setTestResults(p => ({ ...p, [`order_${orderId}`]: { status: res.status, ok: res.ok, data: d } }));
    };

    return (
        <div className="space-y-5">
            {/* Tenant Config */}
            <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-800">🏪 Restoran Yapılandırması</p>
                    <button onClick={loadAll}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700">
                        <RefreshCw size={12} /> Tümünü Yükle
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Tenant ID</label>
                        <input value={tenantId} onChange={e => setTenantId(e.target.value)} placeholder="tenant-id-giriniz"
                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none font-mono focus:border-gray-400" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Slug</label>
                        <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="restoran-slug"
                            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none font-mono focus:border-gray-400" />
                    </div>
                </div>
                {slug && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                        <a href={`/r/${slug}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-medium">
                            <ExternalLink size={11} /> Menüyü Aç: /r/{slug}
                        </a>
                        {['LITE', 'CLASSIC', 'MODERN', 'SIGNATURE', 'LUXURY', 'FASTFOOD'].map(t => (
                            <a key={t} href={`/r/${slug}?theme=${t}`} target="_blank" rel="noreferrer"
                                className="text-xs text-gray-400 hover:text-gray-700 font-mono hover:underline">
                                {t}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Live Stats */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">📊 Canlı İstatistikler</p>
                    <button onClick={() => load('stats', `/api/restaurant/stats${tenantId ? `?tenantId=${tenantId}` : ''}`)}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <RefreshCw size={11} className={loading.stats ? 'animate-spin' : ''} /> Yenile
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { key: 'orderCount', label: 'Sipariş', icon: <ShoppingCart size={14} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { key: 'pendingOrders', label: 'Bekleyen', icon: <Clock size={14} />, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { key: 'categoryCount', label: 'Kategori', icon: <Package size={14} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { key: 'scanCount', label: 'QR Tarama', icon: <Activity size={14} />, color: 'text-green-600', bg: 'bg-green-50' },
                    ].map(c => (
                        <div key={c.key} className="border border-gray-200 rounded-xl p-3.5">
                            <div className={`inline-flex p-1.5 rounded-lg ${c.bg} ${c.color} mb-2`}>{c.icon}</div>
                            <p className="text-xl font-bold text-gray-900">{loading.stats ? '…' : (stats?.[c.key] ?? '—')}</p>
                            <p className="text-xs text-gray-400">{c.label}</p>
                        </div>
                    ))}
                </div>
                {testResults.stats && (
                    <p className={`text-xs mt-2 font-medium ${testResults.stats.ok ? 'text-green-600' : 'text-red-600'}`}>
                        HTTP {testResults.stats.status} {testResults.stats.ok ? '✓' : '✗'}
                    </p>
                )}
            </div>

            {/* Analytics */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">💰 Analitik (Auth Gerekli)</p>
                    <button onClick={() => load('analytics', '/api/restaurant/analytics')}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <RefreshCw size={11} className={loading.analytics ? 'animate-spin' : ''} /> Yükle
                    </button>
                </div>
                {analytics?.stats ? (
                    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
                            {[
                                ['Toplam Gelir', `₺${(analytics.stats.totalRevenue ?? 0).toLocaleString('tr-TR')}`],
                                ['Sipariş', analytics.stats.orderCount],
                                ['Tamamlanan', analytics.stats.completedOrders],
                                ['Ortalama', `₺${Math.round(analytics.stats.avgOrderValue ?? 0)}`],
                            ].map(([k, v]) => (
                                <div key={String(k)} className="p-3 text-center">
                                    <p className="text-lg font-bold text-gray-900">{v}</p>
                                    <p className="text-xs text-gray-400">{k}</p>
                                </div>
                            ))}
                        </div>
                        {analytics.topProducts?.length > 0 && (
                            <div className="p-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2">🏆 En Çok Satan Ürünler</p>
                                <div className="space-y-1.5">
                                    {analytics.topProducts.slice(0, 5).map((p: any, i: number) => (
                                        <div key={p.name} className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                                            <span className="text-xs font-medium text-gray-700 flex-1 truncate">{p.name}</span>
                                            <span className="text-xs text-gray-500">{p.quantity} adet</span>
                                            <span className="text-xs font-semibold text-green-600">₺{p.revenue?.toLocaleString('tr-TR')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {analytics.revenueChart?.length > 0 && (
                            <div className="p-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2">📈 Son 7 Gün Gelir</p>
                                <div className="flex items-end gap-1 h-16">
                                    {analytics.revenueChart.map((d: any) => {
                                        const max = Math.max(...analytics.revenueChart.map((x: any) => x.amount), 1);
                                        const pct = Math.max((d.amount / max) * 100, 4);
                                        return (
                                            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="w-full bg-indigo-200 rounded-t" style={{ height: `${pct}%` }} title={`₺${d.amount}`} />
                                                <span className="text-[9px] text-gray-400">{d.date.slice(5)}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`border rounded-xl p-4 text-center ${testResults.analytics?.ok === false ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                        <p className="text-sm text-gray-500">
                            {loading.analytics ? 'Yükleniyor…' : testResults.analytics?.ok === false ? `HTTP ${testResults.analytics.status} — Giriş yapmanız gerekiyor` : '"Yükle" butonuna tıklayın'}
                        </p>
                    </div>
                )}
            </div>

            {/* Orders */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">📋 Son Siparişler</p>
                    <button onClick={() => load('orders', `/api/restaurant/orders${tenantId ? `?tenantId=${tenantId}` : ''}`)}
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <RefreshCw size={11} className={loading.orders ? 'animate-spin' : ''} /> Yükle
                    </button>
                </div>
                {orders.length > 0 ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        {orders.slice(0, 8).map((o: any, i: number) => (
                            <div key={o.id} className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                                <span className="text-xs font-mono text-gray-400 w-16 truncate">#{o.id?.slice(-6)}</span>
                                <span className="text-xs font-medium text-gray-700 flex-1">Masa {o.tableNumber ?? '—'}</span>
                                <span className="text-xs font-semibold text-gray-900">₺{o.totalAmount?.toLocaleString('tr-TR') ?? '—'}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                    {o.status}
                                </span>
                                <div className="flex gap-1">
                                    {['PREPARING', 'SERVED', 'COMPLETED'].map(s => (
                                        <button key={s} onClick={() => testOrderStatus(o.id, s)}
                                            className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 hover:bg-gray-50">
                                            {s.slice(0, 4)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                            <p className="text-xs text-gray-400">{orders.length} sipariş • ilk 8 gösteriliyor</p>
                        </div>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400">
                        {loading.orders ? 'Yükleniyor…' : '"Yükle" butonuna tıklayın'}
                    </div>
                )}
            </div>

            {/* Products & Categories */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">🍕 Ürünler</p>
                        <button onClick={() => load('products', `/api/restaurant/products${tenantId ? `?tenantId=${tenantId}` : ''}`)}
                            className="text-xs text-gray-400 hover:text-gray-600">
                            <RefreshCw size={11} className={loading.products ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-xl">
                        {products.length > 0 ? (
                            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                {products.slice(0, 10).map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-2 px-3 py-2">
                                        <span className="text-xs text-gray-700 flex-1 truncate">{p.name}</span>
                                        <span className="text-xs font-semibold text-gray-900">₺{p.price}</span>
                                        <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? 'bg-green-400' : 'bg-gray-300'}`} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-6">{loading.products ? '…' : 'Yükle →'}</p>
                        )}
                        {testResults.products && (
                            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                                <p className={`text-xs font-medium ${testResults.products.ok ? 'text-green-600' : 'text-red-600'}`}>
                                    HTTP {testResults.products.status} · {products.length} kayıt
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">📂 Kategoriler</p>
                        <button onClick={() => load('categories', `/api/restaurant/categories${tenantId ? `?tenantId=${tenantId}` : ''}`)}
                            className="text-xs text-gray-400 hover:text-gray-600">
                            <RefreshCw size={11} className={loading.categories ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-xl">
                        {categories.length > 0 ? (
                            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                                {categories.slice(0, 10).map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-2 px-3 py-2">
                                        <span className="text-sm">{c.emoji ?? '📁'}</span>
                                        <span className="text-xs text-gray-700 flex-1 truncate">{c.name}</span>
                                        <span className="text-xs text-gray-400">{c._count?.products ?? 0} ürün</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 text-center py-6">{loading.categories ? '…' : 'Yükle →'}</p>
                        )}
                        {testResults.categories && (
                            <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
                                <p className={`text-xs font-medium ${testResults.categories.ok ? 'text-green-600' : 'text-red-600'}`}>
                                    HTTP {testResults.categories.status} · {categories.length} kategori
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* API Test: Waiter calls */}
            <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">🔔 Garson Çağır Testi</p>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(table => (
                        <button key={table} onClick={async () => {
                            if (!tenantId) {
                                alert("Tenant ID eksik! Lütfen 'Restoran Yapılandırması' bölümüne bir Tenant ID girin.");
                                return;
                            }
                            const res = await fetch('/api/restaurant/waiter-calls', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ tableId: `table-${table}`, tenantId }),
                            });
                            const d = await res.json();
                            setTestResults(p => ({ ...p, waiter: { status: res.status, ok: res.ok, table, data: d } }));
                        }} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                            Masa {table}
                        </button>
                    ))}
                </div>
                {testResults.waiter && (
                    <div className={`mt-2 text-xs font-medium ${testResults.waiter.ok ? 'text-green-600' : 'text-amber-600'}`}>
                        Masa {testResults.waiter.table} → HTTP {testResults.waiter.status}
                        <pre className="text-gray-500 font-normal mt-1">{JSON.stringify(testResults.waiter.data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}



// ─── Main Page ─────────────────────────────────────────────────────────── //
export default function TestDashboard() {
    const [tab, setTab] = useState<TabId>('overview');

    const tabContent: Record<TabId, React.ReactNode> = {
        overview: <OverviewTab />,
        security: <SecurityTab />,
        restaurant: <RestaurantTab />,
        api: <ApiTab />,
        auth: <AuthTab />,
        performance: <PerformanceTab />,
        themes: <ThemesTab />,
        logs: <LogsTab />,
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Top Bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">QRlamenü</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-sm font-medium text-gray-500">Test Paneli</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Canlı
                    </span>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex gap-1">
                        {[['/', '🏠'], ['/super-admin', '🛡️'], ['/dashboard', '📊'], ['/login', '🔐']].map(([href, icon]) => (
                            <Link key={href} href={href}
                                className="text-sm px-2 py-1 rounded hover:bg-gray-100 transition-colors" title={href}>
                                {icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-2 px-6 py-2 bg-amber-50 border-b border-amber-100">
                <AlertTriangle size={12} className="text-amber-500" />
                <p className="text-xs text-amber-700">Sadece geliştirme ortamı — production'da bu sayfayı kapatın.</p>
            </div>

            {/* Tab Bar */}
            <div className="border-b border-gray-200 px-6 overflow-x-auto">
                <div className="flex gap-0 min-w-max">
                    {TABS.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300'
                                }`}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto p-6">
                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {tabContent[tab]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="text-center py-4 text-xs text-gray-300 border-t border-gray-100">
                QRlamenü Test Dashboard · {new Date().getFullYear()}
            </div>
        </div>
    );
}
