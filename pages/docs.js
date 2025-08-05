import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Docs.module.css';
import { allEndpoints } from '../lib/endpoints';

const Spinner = () => <div className={styles.spinner}></div>;
const ChevronIcon = ({ isOpen }) => ( <svg className={`${styles.accordionIcon} ${isOpen ? styles.iconOpen : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>);
const CopyIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>);

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return <button onClick={handleCopy} className={styles.copyButton}>{copied ? 'Copied!' : <CopyIcon />}</button>;
};

const EndpointDetail = ({ endpoint, origin }) => {
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formState, setFormState] = useState(() => endpoint.params.reduce((acc, param) => ({ ...acc, [param.name]: param.type === 'file' ? null : param.default || '' }), {}));

    const { requestUrl, curl } = useMemo(() => {
        if (!origin) return { requestUrl: '', curl: 'Loading...' };
        if (endpoint.method === 'POST') {
            let curlCommand = `curl -X 'POST' \\\n  '${origin}${endpoint.path}'`;
            endpoint.params.forEach(param => { if (formState[param.name] || param.type === 'file') { const value = param.type === 'file' ? '@path/to/file' : formState[param.name]; curlCommand += ` \\\n  -F '${param.name}=${value}'`; }});
            return { requestUrl: `${origin}${endpoint.path}`, curl: curlCommand };
        }
        const url = new URL(`${origin}${endpoint.path}`);
        endpoint.params.forEach(param => { if (formState[param.name]) url.searchParams.append(param.name, formState[param.name]); });
        const finalUrl = url.href;
        const curlCommand = `curl -X 'GET' \\\n  '${finalUrl}' \\\n  -H 'accept: */*'`;
        return { requestUrl: finalUrl, curl: curlCommand };
    }, [origin, formState, endpoint]);

    const handleExecute = async () => {
        if (!requestUrl) return;
        setIsLoading(true); setResponse(null);
        try {
            let res;
            if (endpoint.method === 'POST') {
                const formData = new FormData();
                let hasPayload = false;
                for (const key in formState) { if (formState[key]) { formData.append(key, formState[key]); hasPayload = true; } }
                if (!hasPayload) { throw new Error("Untuk request POST, URL atau File harus diisi."); }
                res = await fetch(requestUrl, { method: 'POST', body: formData });
            } else {
                res = await fetch(requestUrl);
            }
            const contentType = res.headers.get('Content-Type');
            if (res.ok && contentType && (contentType.includes('image') || contentType.includes('video') || contentType.includes('audio'))) {
                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);
                if (contentType.includes('image')) {
                    setResponse({ isImage: true, url: objectUrl, status: res.status });
                } else {
                    const tempLink = document.createElement('a');
                    tempLink.href = objectUrl;
                    const filename = res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${endpoint.id}.${contentType.split('/')[1]}`;
                    tempLink.setAttribute('download', filename);
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(objectUrl);
                    setResponse({ status: 200, body: { success: true, message: `Download dimulai untuk: ${filename}` } });
                }
            } else {
                const data = await res.json();
                setResponse({ status: res.status, body: data });
            }
        } catch (error) {
            setResponse({ status: 500, body: { success: false, error: 'Request gagal dijalankan.', details: error.message } });
        }
        setIsLoading(false);
    };

    return (
        <div className={styles.endpointDetailWrapper}>
            <div className={styles.form}>
                {endpoint.params.map(param => ( <div key={param.name}> <label htmlFor={`${endpoint.id}-${param.name}`}>{param.name}</label> <ParamInput param={param} endpointId={endpoint.id} setFormState={setFormState}/> </div> ))}
                <button onClick={handleExecute} disabled={isLoading || !origin}>{isLoading ? 'Loading...' : 'Execute'}</button>
            </div>
            <div className={styles.resultContainer}>
                <div className={styles.resultBox}><div className={styles.resultHeader}><span>Request</span><CopyButton text={curl} /></div><div className={styles.codeBlock}><pre><code>{curl}</code></pre></div></div>
                <div className={styles.resultBox}><div className={styles.resultHeader}><span>Response {response?.status && <span className={styles[`code${response.status}`]}>{response.status}</span>}</span>{response && !response.isImage && <CopyButton text={JSON.stringify(response.body, null, 2)} />}</div><div className={`${styles.codeBlock} ${styles.responseBlock}`}>
                    {isLoading && <div className={styles.loadingWrapper}><Spinner /></div>}
                    {!isLoading && !response && <p className={styles.placeholder}>Response will appear here.</p>}
                    {response?.isImage && <img src={response.url} alt="Generated" className={styles.responseImage} />}
                    {response && !response.isImage && <pre><code>{JSON.stringify(response.body, null, 2)}</code></pre>}
                </div></div>
            </div>
        </div>
    );
};

const ParamInput = ({ param, endpointId, setFormState }) => {
    const handleChange = (e) => { const { name, value, files } = e.target; setFormState(s => ({...s, [name]: files ? files[0] : value})); };
    if (param.type === 'file') return <input type="file" name={param.name} id={`${endpointId}-${param.name}`} onChange={handleChange} />;
    if (param.type === 'select') return <select name={param.name} id={`${endpointId}-${param.name}`} defaultValue={param.default} onChange={handleChange}>{param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>;
    return <input type="text" name={param.name} id={`${endpointId}-${param.name}`} defaultValue={param.default || ''} onChange={handleChange} placeholder={param.placeholder} />;
};

const EndpointAccordion = ({ endpoint, origin }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.accordionItem}>
            <button className={styles.accordionHeader} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.accordionTitle}>{endpoint.name}</span>
                <div className={styles.accordionHeaderRight}><span className={styles.categoryBadge}>{endpoint.category}</span><ChevronIcon isOpen={isOpen} /></div>
            </button>
            <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className={styles.accordionContent}><EndpointDetail endpoint={endpoint} origin={origin} /></motion.div>}</AnimatePresence>
        </div>
    );
};

const StatsDisplay = ({ stats }) => ( <div className={styles.statsDisplay}><div className={styles.statsItem}><span>TOTAL</span><strong>{new Intl.NumberFormat().format(stats.total_requests)}</strong></div><div className={styles.statsItem}><span>TODAY</span><strong>{new Intl.NumberFormat().format(stats.today_requests)}</strong></div></div>);

export default function Docs() {
    const [origin, setOrigin] = useState('');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [stats, setStats] = useState({ total_requests: 0, today_requests: 0 });

    useEffect(() => {
        if (typeof window !== 'undefined') setOrigin(window.location.origin);
        fetch('/api/stats').then(res => res.json()).then(data => setStats(data));
        const interval = setInterval(() => { fetch('/api/stats').then(res => res.json()).then(data => setStats(data)); }, 5000);
        return () => clearInterval(interval);
    }, []);
    
    const categories = ['All', ...Array.from(new Set(allEndpoints.map(e => e.category)))];
    const filteredEndpoints = useMemo(() => allEndpoints.filter(e => (category === 'All' || e.category === category) && e.name.toLowerCase().includes(search.toLowerCase())), [search, category]);

    return (
        <div className={styles.container}>
            <Head><title>LIPP - API | Documentation</title></Head>
            <div className={styles.banner}><video autoPlay loop muted playsInline className={styles.bannerVideo} key="banner-video"><source src="/banner-video.mp4" type="video/mp4" /></video></div>
            <div className={styles.topBar}><div className={styles.searchWrapper}><input type="text" placeholder="Cari endpoint..." className={styles.searchInput} onChange={(e) => setSearch(e.target.value)} /></div><StatsDisplay stats={stats} /></div>
            <div className={styles.tabs}>{categories.map(cat => <button key={cat} onClick={() => setCategory(cat)} className={`${styles.tabButton} ${category === cat ? styles.activeTab : ''}`}>{cat}</button>)}</div>
            <div className={styles.main}>{filteredEndpoints.map(endpoint => <EndpointAccordion key={endpoint.id} endpoint={endpoint} origin={origin} />)}</div>
        </div>
    );
}
