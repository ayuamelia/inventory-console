(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/components/layout/Layout.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function Layout({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isProducts = router.pathname === "/products" || router.pathname === "/";
    const isAdjustments = router.pathname === "/adjustments";
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Layout.useEffect": ()=>{
            try {
                const saved = window.localStorage.getItem("app-theme");
                if (saved === "light" || saved === "dark") {
                    setTheme(saved);
                    document.documentElement.dataset.theme = saved;
                    return;
                }
                const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
                const initial = prefersDark ? "dark" : "light";
                setTheme(initial);
                document.documentElement.dataset.theme = initial;
            } catch  {
                document.documentElement.dataset.theme = "dark";
            }
        }
    }["Layout.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Layout.useEffect": ()=>{
            document.documentElement.dataset.theme = theme;
            try {
                window.localStorage.setItem("app-theme", theme);
            } catch  {}
        }
    }["Layout.useEffect"], [
        theme
    ]);
    function toggleTheme() {
        setTheme((prev)=>prev === "dark" ? "light" : "dark");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "app-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "app-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "app-header-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "app-brand",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "app-brand-avatar",
                                    children: "IN"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "app-brand-text",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "app-brand-title",
                                            children: "Inventory Console"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 46,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "app-brand-subtitle",
                                            children: "Products & stock adjustments overview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 47,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Layout.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "app-header-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                    className: "app-nav",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/products",
                                            className: "app-nav-link" + (isProducts ? " app-nav-link--active" : ""),
                                            children: "Products"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 55,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/adjustments",
                                            className: "app-nav-link" + (isAdjustments ? " app-nav-link--active" : ""),
                                            children: "Adjustments"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "theme-toggle-btn",
                                    onClick: toggleTheme,
                                    children: theme === "dark" ? "☀️ Light" : "🌙 Dark"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Layout.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Layout.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Layout.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "app-main",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Layout.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Layout.tsx",
        lineNumber: 40,
        columnNumber: 10
    }, this);
}
_s(Layout, "eL6lHDOWJzp6yZwA7v5VZkNFPAQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useAdjustmentStore.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAdjustmentStore",
    ()=>useAdjustmentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [client] (ecmascript)");
;
const useAdjustmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        items: [],
        page: 1,
        hasMore: true,
        reset: ()=>set({
                items: [],
                page: 1,
                hasMore: true
            }),
        setPage: (page)=>set({
                page
            }),
        setData: (items, hasMore)=>set({
                items,
                hasMore
            }),
        prepend: (item)=>set((state)=>({
                    items: [
                        item,
                        ...state.items
                    ]
                })),
        updateItem: (item)=>set((state)=>({
                    items: state.items.map((a)=>a.id === item.id ? {
                            ...a,
                            ...item
                        } : a)
                })),
        removeItem: (id)=>set((state)=>({
                    items: state.items.filter((a)=>a.id !== id)
                }))
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdjustment",
    ()=>createAdjustment,
    "createProduct",
    ()=>createProduct,
    "deleteAdjustment",
    ()=>deleteAdjustment,
    "deleteProduct",
    ()=>deleteProduct,
    "fetchAdjustments",
    ()=>fetchAdjustments,
    "fetchProductCategories",
    ()=>fetchProductCategories,
    "fetchProductDetail",
    ()=>fetchProductDetail,
    "fetchProducts",
    ()=>fetchProducts,
    "updateAdjustment",
    ()=>updateAdjustment,
    "updateProduct",
    ()=>updateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
async function fetchProducts(page = 1, limit = 8, opts = {}) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (opts.q) params.set("q", opts.q);
    if (opts.sort) params.set("sort", opts.sort);
    if (opts.dir) params.set("dir", opts.dir);
    if (opts.category && opts.category !== "all") {
        params.set("category", opts.category);
    }
    const url = `${API_URL}/products?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text().catch(()=>"");
        console.error("[fetchProducts] error response:", res.status, text);
        throw new Error("Failed to fetch products");
    }
    return res.json();
}
async function fetchProductDetail(id) {
    const res = await fetch(`${API_URL}/products/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch product detail");
    }
    return res.json();
}
async function fetchProductCategories() {
    const res = await fetch(`${API_URL}/products/categories`);
    if (!res.ok) {
        const text = await res.text().catch(()=>"");
        console.error("[fetchProductCategories] error:", res.status, text);
        throw new Error("Failed to fetch product categories");
    }
    const json = await res.json();
    return json.data;
}
async function createProduct(body) {
    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        let message = "Failed to create product";
        try {
            const text = await res.text();
            console.error("[createProduct] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) {
                    message = json.message;
                }
            }
            if (res.status === 409 && !message) {
                message = "Product with this SKU already exists";
            }
        } catch (err) {
            console.error("[createProduct] failed to parse error body", err);
        }
        return {
            ok: false,
            message
        };
    }
    const data = await res.json();
    return {
        ok: true,
        data
    };
}
async function updateProduct(id, body) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        let errorMessage = "Failed to update product";
        try {
            const text = await res.text();
            console.error("[updateProduct] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) {
                    errorMessage = json.message;
                }
            }
            if (res.status === 409 && !errorMessage) {
                errorMessage = "Product SKU already exists";
            }
        } catch (parseErr) {
            console.error("[updateProduct] failed to parse error body", parseErr);
        }
        return {
            ok: false,
            message: errorMessage
        };
    }
    const data = await res.json();
    return {
        ok: true,
        data
    };
}
async function deleteProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) {
        let message = "Failed to delete product";
        try {
            const text = await res.text();
            console.error("[deleteProduct] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) {
                    message = json.message;
                }
            }
        } catch (err) {
            console.error("[deleteProduct] failed to parse error body", err);
        }
        return {
            ok: false,
            message
        };
    }
    return {
        ok: true
    };
}
async function fetchAdjustments(page = 1, limit = 10, opts = {}) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (opts.sku) params.set("sku", opts.sku);
    const url = `${API_URL}/adjustments?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
        const text = await res.text().catch(()=>"");
        console.error("[fetchAdjustments] error response:", res.status, text);
        throw new Error("Failed to fetch adjustments");
    }
    return res.json();
}
async function createAdjustment(body) {
    const res = await fetch(`${API_URL}/adjustments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        let message = "Failed to create adjustment";
        try {
            const text = await res.text();
            console.error("[createAdjustment] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) {
                    message = json.message;
                }
            }
        } catch (err) {
            console.error("[createAdjustment] parse error", err);
        }
        return {
            ok: false,
            message
        };
    }
    const data = await res.json();
    return {
        ok: true,
        data
    };
}
async function updateAdjustment(id, body) {
    const res = await fetch(`${API_URL}/adjustments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    if (!res.ok) {
        let message = "Failed to update adjustment";
        try {
            const text = await res.text();
            console.error("[updateAdjustment] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) message = json.message;
            }
        } catch (err) {
            console.error("[updateAdjustment] parse error", err);
        }
        return {
            ok: false,
            message
        };
    }
    const data = await res.json();
    return {
        ok: true,
        data
    };
}
async function deleteAdjustment(id) {
    const res = await fetch(`${API_URL}/adjustments/${id}`, {
        method: "DELETE"
    });
    if (!res.ok) {
        let message = "Failed to delete adjustment";
        try {
            const text = await res.text();
            console.error("[deleteAdjustment] error response:", res.status, text);
            if (text) {
                const json = JSON.parse(text);
                if (json?.message) message = json.message;
            }
        } catch (err) {
            console.error("[deleteAdjustment] parse error", err);
        }
        return {
            ok: false,
            message
        };
    }
    return {
        ok: true
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/adjustments.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdjustmentsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Layout.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useAdjustmentStore.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const LIMIT = 10;
function AdjustmentsPage() {
    _s();
    const { items, page, hasMore, setPage, setData, reset, prepend, updateItem, removeItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAdjustmentStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [skuInput, setSkuInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [qtyInput, setQtyInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [amountInput, setAmountInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formSubmitting, setFormSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterSku, setFilterSku] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterSkuInput, setFilterSkuInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editModalOpen, setEditModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editFormError, setEditFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editSubmitting, setEditSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editQty, setEditQty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editAmount, setEditAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function loadPage(targetPage, opts) {
        if (loading) return;
        setLoading(true);
        setFormError(null);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchAdjustments"])(targetPage, LIMIT, {
                sku: filterSku || undefined
            });
            setData(res.data, res.data.length === LIMIT);
            setPage(targetPage);
        } catch (e) {
            console.error("[AdjustmentsPage] loadPage error", e);
            setFormError("Failed to load adjustments");
            if (!opts?.keepItems) {
                setData([], false);
            }
        } finally{
            setLoading(false);
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdjustmentsPage.useEffect": ()=>{
            reset();
            loadPage(1);
        }
    }["AdjustmentsPage.useEffect"], [
        reset
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdjustmentsPage.useEffect": ()=>{
            const handle = setTimeout({
                "AdjustmentsPage.useEffect.handle": ()=>{
                    setFilterSku(filterSkuInput.trim());
                }
            }["AdjustmentsPage.useEffect.handle"], 400);
            return ({
                "AdjustmentsPage.useEffect": ()=>clearTimeout(handle)
            })["AdjustmentsPage.useEffect"];
        }
    }["AdjustmentsPage.useEffect"], [
        filterSkuInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdjustmentsPage.useEffect": ()=>{
            reset();
            loadPage(1);
        }
    }["AdjustmentsPage.useEffect"], [
        filterSku
    ]);
    async function handleSubmitAdjustment(e_0) {
        e_0.preventDefault();
        setFormError(null);
        const sku = skuInput.trim();
        if (!sku) {
            setFormError("Product SKU is required");
            return;
        }
        const qtyNum = Number(qtyInput);
        if (!Number.isFinite(qtyNum) || qtyNum === 0) {
            setFormError("Qty must be a non-zero number");
            return;
        }
        let amountNum = null;
        if (amountInput.trim() !== "") {
            const normalized = amountInput.replace(",", ".");
            amountNum = Number(normalized);
            if (!Number.isFinite(amountNum)) {
                setFormError("Amount must be a valid number");
                return;
            }
        }
        setFormSubmitting(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createAdjustment"])({
                product_sku: sku,
                qty: qtyNum,
                amount: amountNum ?? undefined
            });
            if (!result.ok) {
                setFormError(result.message);
                return;
            }
            prepend(result.data);
            setSkuInput("");
            setQtyInput("");
            setAmountInput("");
        } catch (err) {
            console.error("[AdjustmentsPage] unexpected submit error", err);
            setFormError("Unexpected error while creating adjustment");
        } finally{
            setFormSubmitting(false);
        }
    }
    function handleOpenEdit(adj) {
        setEditingId(adj.id);
        setEditQty(String(adj.qty));
        setEditAmount(adj.amount != null ? String(adj.amount) : "");
        setEditFormError(null);
        setEditModalOpen(true);
    }
    function handleCloseEdit() {
        if (editSubmitting) return;
        setEditModalOpen(false);
        setEditingId(null);
        setEditFormError(null);
        setEditQty("");
        setEditAmount("");
    }
    async function handleSaveEdit() {
        if (!editingId) return;
        setEditFormError(null);
        const qtyNum_0 = Number(editQty);
        if (!Number.isFinite(qtyNum_0) || qtyNum_0 === 0) {
            setEditFormError("Qty must be a non-zero number");
            return;
        }
        let amountNum_0 = null;
        if (editAmount.trim() !== "") {
            const norm = editAmount.replace(",", ".");
            amountNum_0 = Number(norm);
            if (!Number.isFinite(amountNum_0)) {
                setEditFormError("Amount must be a valid number");
                return;
            }
        }
        setEditSubmitting(true);
        try {
            const result_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["updateAdjustment"])(editingId, {
                qty: qtyNum_0,
                amount: amountNum_0 ?? undefined
            });
            if (!result_0.ok) {
                setEditFormError(result_0.message);
                return;
            }
            updateItem(result_0.data);
            handleCloseEdit();
        } catch (err_0) {
            console.error("[AdjustmentsPage] unexpected edit error", err_0);
            setEditFormError("Unexpected error while saving");
        } finally{
            setEditSubmitting(false);
        }
    }
    async function handleDeleteEdit() {
        if (!editingId) return;
        const confirmed = window.confirm("Are you sure you want to delete this adjustment?");
        if (!confirmed) return;
        setEditFormError(null);
        setEditSubmitting(true);
        try {
            const result_1 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["deleteAdjustment"])(editingId);
            if (!result_1.ok) {
                setEditFormError(result_1.message);
                return;
            }
            removeItem(editingId);
            handleCloseEdit();
        } catch (err_1) {
            console.error("[AdjustmentsPage] unexpected delete error", err_1);
            setEditFormError("Unexpected error while deleting");
        } finally{
            setEditSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "surface",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "surface-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "surface-title",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    children: "Stock Adjustments"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 188,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Transaction history of stock movements per product."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "toolbar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "input toolbar-input",
                                    placeholder: "Filter by SKU…",
                                    value: filterSkuInput,
                                    onChange: (e_1)=>setFilterSkuInput(e_1.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 193,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "chip",
                                    children: [
                                        "Page ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: page
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 195,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "chip",
                                    children: [
                                        "Rows ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: items.length
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 198,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 197,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmitAdjustment,
                    className: "adjustment-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Product SKU"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    value: skuInput,
                                    onChange: (e_2)=>setSkuInput(e_2.target.value),
                                    placeholder: "e.g. 1, 2, or dummy SKU"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 204,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Qty (+ / -)"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    inputMode: "numeric",
                                    value: qtyInput,
                                    onChange: (e_3)=>{
                                        const raw = e_3.target.value;
                                        if (raw === "" || /^-?\d*$/.test(raw)) {
                                            setQtyInput(raw);
                                        }
                                    },
                                    placeholder: "e.g. 5 or -3"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 211,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Amount (USD)"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    inputMode: "decimal",
                                    value: amountInput,
                                    onChange: (e_4)=>{
                                        const raw_0 = e_4.target.value;
                                        if (raw_0 === "") {
                                            setAmountInput("");
                                            return;
                                        }
                                        const normalized_0 = raw_0.replace(",", ".");
                                        if (/^-?\d*\.?\d{0,2}$/.test(normalized_0)) {
                                            setAmountInput(raw_0);
                                        }
                                    },
                                    placeholder: "Optional, auto = price * qty"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                alignSelf: "flex-end",
                                paddingBottom: "0.1rem"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-primary",
                                disabled: formSubmitting,
                                children: formSubmitting ? "Saving…" : "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 203,
                    columnNumber: 9
                }, this),
                formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal-error",
                    style: {
                        marginBottom: "0.5rem"
                    },
                    children: formError
                }, void 0, false, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 244,
                    columnNumber: 23
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "table-wrapper",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "table",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "ID"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "SKU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 255,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Product"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 256,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Qty"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 257,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Amount (USD)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            children: "Created"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 252,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    items.map((a)=>{
                                        const isPositive = a.qty > 0;
                                        const badgeClass = isPositive ? "badge badge-green" : "badge badge-red";
                                        const sign = isPositive ? "+" : "";
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: a.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: a.sku
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: a.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: badgeClass,
                                                        children: [
                                                            sign,
                                                            a.qty
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/adjustments.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 2
                                                    }).format(a.amount ?? 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: new Date(a.created_at).toLocaleString("id-ID")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "btn btn-ghost",
                                                        onClick: ()=>handleOpenEdit(a),
                                                        children: "Edit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/adjustments.tsx",
                                                        lineNumber: 286,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, a.id, true, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 267,
                                            columnNumber: 22
                                        }, this);
                                    }),
                                    editModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "modal-backdrop",
                                        onClick: handleCloseEdit,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "modal",
                                            onClick: (e_5)=>e_5.stopPropagation(),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "modal-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "modal-title",
                                                                    children: "Edit adjustment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 296,
                                                                    columnNumber: 25
                                                                }, this),
                                                                editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "modal-subtitle",
                                                                    children: [
                                                                        "ID: ",
                                                                        editingId
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 39
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "modal-close-btn",
                                                            type: "button",
                                                            onClick: handleCloseEdit,
                                                            disabled: editSubmitting,
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 21
                                                }, this),
                                                editFormError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "modal-error",
                                                    children: editFormError
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 39
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "modal-body",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "modal-field",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "modal-label",
                                                                    children: "Qty (+/-)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 308,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    className: "modal-input",
                                                                    inputMode: "numeric",
                                                                    value: editQty,
                                                                    onChange: (e_6)=>{
                                                                        const raw_1 = e_6.target.value;
                                                                        if (raw_1 === "" || /^-?\d*$/.test(raw_1)) {
                                                                            setEditQty(raw_1);
                                                                        }
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "modal-field",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "modal-label",
                                                                    children: "Amount (USD)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 318,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    className: "modal-input",
                                                                    inputMode: "decimal",
                                                                    value: editAmount,
                                                                    onChange: (e_7)=>{
                                                                        const raw_2 = e_7.target.value;
                                                                        if (raw_2 === "") {
                                                                            setEditAmount("");
                                                                            return;
                                                                        }
                                                                        const norm_0 = raw_2.replace(",", ".");
                                                                        if (/^-?\d*\.?\d{0,2}$/.test(norm_0)) {
                                                                            setEditAmount(raw_2);
                                                                        }
                                                                    },
                                                                    placeholder: "Optional, auto = price * qty"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 319,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 317,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "modal-footer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: editSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: "#9ca3af"
                                                                },
                                                                children: "Saving…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/adjustments.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 44
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                gap: "0.4rem",
                                                                alignItems: "center"
                                                            },
                                                            children: [
                                                                editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-ghost",
                                                                    onClick: handleDeleteEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 344,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-ghost",
                                                                    onClick: handleCloseEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Cancel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-primary",
                                                                    onClick: handleSaveEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Save changes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 350,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 339,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/adjustments.tsx",
                                        lineNumber: 292,
                                        columnNumber: 33
                                    }, this),
                                    items.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 6,
                                            style: {
                                                textAlign: "center",
                                                padding: "0.8rem"
                                            },
                                            children: "No adjustment data"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 359,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/adjustments.tsx",
                                        lineNumber: 358,
                                        columnNumber: 50
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/adjustments.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 250,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pagination",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost",
                            disabled: page <= 1 || loading,
                            onClick: ()=>loadPage(page - 1),
                            children: "Prev"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 371,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                "Page ",
                                page
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost",
                            disabled: !hasMore || loading,
                            onClick: ()=>loadPage(page + 1, {
                                    keepItems: true
                                }),
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this),
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Loading…"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 380,
                            columnNumber: 23
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 370,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/adjustments.tsx",
            lineNumber: 185,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/adjustments.tsx",
        lineNumber: 184,
        columnNumber: 10
    }, this);
}
_s(AdjustmentsPage, "jaQesCivfxxRaPvF2XtYdq0TbDI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAdjustmentStore"]
    ];
});
_c = AdjustmentsPage;
var _c;
__turbopack_context__.k.register(_c, "AdjustmentsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/adjustments.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/adjustments";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/adjustments.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/adjustments\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/adjustments.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__49f2dc6b._.js.map