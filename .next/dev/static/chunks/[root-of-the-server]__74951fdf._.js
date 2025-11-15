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
"[project]/src/store/useProductStore.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [client] (ecmascript)");
;
const useProductStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        items: [],
        page: 1,
        hasMore: true,
        loading: false,
        error: undefined,
        reset: ()=>set({
                items: [],
                page: 1,
                hasMore: true,
                loading: false,
                error: undefined
            }),
        appendPage: (newItems, page, limit)=>set((state)=>({
                    items: [
                        ...state.items,
                        ...newItems
                    ],
                    page,
                    hasMore: newItems.length === limit
                })),
        addItem: (product)=>set((state)=>({
                    items: [
                        product,
                        ...state.items
                    ]
                })),
        updateItem: (product)=>set((state)=>({
                    items: state.items.map((p)=>p.id === product.id ? {
                            ...p,
                            ...product
                        } : p)
                })),
        removeItem: (id)=>set((state)=>({
                    items: state.items.filter((p)=>p.id !== id)
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
"[project]/src/pages/products.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Layout.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useProductStore.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const LIMIT = 8;
function ProductsPage() {
    _s();
    const { items, page, hasMore, appendPage, reset, updateItem, addItem, removeItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useProductStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const loaderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("edit");
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("recent");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [categoryOptions, setCategoryOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categoryLoading, setCategoryLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [categoryError, setCategoryError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalLoading, setModalLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalSaving, setModalSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalError, setModalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            const handle = setTimeout({
                "ProductsPage.useEffect.handle": ()=>{
                    setSearch(searchInput.trim());
                }
            }["ProductsPage.useEffect.handle"], 400);
            return ({
                "ProductsPage.useEffect": ()=>clearTimeout(handle)
            })["ProductsPage.useEffect"];
        }
    }["ProductsPage.useEffect"], [
        searchInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            async function init() {
                reset();
                setLoading(true);
                const { sort, dir } = mapSort(sortKey);
                try {
                    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchProducts"])(1, LIMIT, {
                        q: search || undefined,
                        sort,
                        dir,
                        category
                    });
                    appendPage(res.data, 1, LIMIT);
                } catch (e) {
                    console.error("[ProductsPage] error initial load", e);
                } finally{
                    setLoading(false);
                }
            }
            init();
        }
    }["ProductsPage.useEffect"], [
        reset,
        appendPage,
        search,
        sortKey,
        category
    ]);
    const loadMore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProductsPage.useCallback[loadMore]": async ()=>{
            if (loading || !hasMore) return;
            const nextPage = page + 1;
            setLoading(true);
            const { sort: sort_0, dir: dir_0 } = mapSort(sortKey);
            try {
                const res_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchProducts"])(nextPage, LIMIT, {
                    q: search || undefined,
                    sort: sort_0,
                    dir: dir_0,
                    category
                });
                appendPage(res_0.data, nextPage, LIMIT);
            } catch (e_0) {
                console.error("[ProductsPage] error loadMore", e_0);
            } finally{
                setLoading(false);
            }
        }
    }["ProductsPage.useCallback[loadMore]"], [
        loading,
        hasMore,
        page,
        appendPage,
        sortKey,
        search,
        category
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            if (!loaderRef.current) return;
            const observer = new IntersectionObserver({
                "ProductsPage.useEffect": (entries)=>{
                    const first = entries[0];
                    if (first.isIntersecting) {
                        console.log("[ProductsPage] observer intersecting");
                        loadMore();
                    }
                }
            }["ProductsPage.useEffect"]);
            observer.observe(loaderRef.current);
            return ({
                "ProductsPage.useEffect": ()=>observer.disconnect()
            })["ProductsPage.useEffect"];
        }
    }["ProductsPage.useEffect"], [
        loadMore
    ]);
    console.log("[ProductsPage] render", {
        itemsLength: items.length,
        page,
        hasMore,
        loading
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductsPage.useEffect": ()=>{
            async function loadCategories() {
                setCategoryLoading(true);
                setCategoryError(null);
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchProductCategories"])();
                    setCategoryOptions(data);
                } catch (err) {
                    console.error("[ProductsPage] loadCategories error", err);
                    setCategoryError("Failed to load categories");
                } finally{
                    setCategoryLoading(false);
                }
            }
            loadCategories();
        }
    }["ProductsPage.useEffect"], []);
    function handleOpenCreate() {
        setMode("create");
        setModalError(null);
        setEditingId(null);
        setForm({
            sku: "",
            title: "",
            price: "0",
            description: "",
            image_url: "",
            category: ""
        });
        setModalOpen(true);
    }
    async function handleOpenDetail(id) {
        setMode("edit");
        setModalError(null);
        setModalOpen(true);
        setModalLoading(true);
        setEditingId(id);
        try {
            const detail = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["fetchProductDetail"])(id);
            setForm({
                sku: detail.sku,
                title: detail.title,
                price: String(detail.price ?? 0),
                description: detail.description ?? "",
                image_url: detail.image_url ?? "",
                category: detail.category ?? null
            });
        } catch (e_1) {
            console.error("[ProductsPage] error fetching detail", e_1);
            setModalError("Failed to load product detail");
        } finally{
            setModalLoading(false);
        }
    }
    function handleCloseModal() {
        if (modalSaving) return;
        setModalOpen(false);
        setEditingId(null);
        setForm(null);
        setModalError(null);
    }
    function handleFormChange(field, value) {
        setForm((prev)=>prev ? {
                ...prev,
                [field]: value
            } : prev);
    }
    async function handleSave() {
        if (!form) return;
        setModalError(null);
        if (!form.sku.trim() || !form.title.trim()) {
            setModalError("SKU and title are required");
            return;
        }
        const numericPrice = Number(form.price.replace(/[^\d.,]/g, "").replace(",", "."));
        if (Number.isNaN(numericPrice) || numericPrice < 0) {
            setModalError("Price must be a non negative number");
            return;
        }
        setModalSaving(true);
        try {
            if (mode === "create") {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["createProduct"])({
                    sku: form.sku.trim(),
                    title: form.title.trim(),
                    price: numericPrice,
                    description: form.description.trim() || null,
                    image_url: form.image_url.trim() || null,
                    category: form.category?.trim() || null
                });
                if (!result.ok) {
                    setModalError(result.message);
                    return;
                }
                addItem(result.data);
                handleCloseModal();
            } else {
                if (!editingId) return;
                const result_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["updateProduct"])(editingId, {
                    sku: form.sku.trim(),
                    title: form.title.trim(),
                    price: numericPrice,
                    description: form.description.trim() || null,
                    image_url: form.image_url.trim() || null,
                    category: form.category?.trim() || null
                });
                if (!result_0.ok) {
                    setModalError(result_0.message);
                    return;
                }
                updateItem(result_0.data);
                handleCloseModal();
            }
        } catch (e_2) {
            console.error("[ProductsPage] unexpected error saving product", e_2);
            setModalError("Unexpected error while saving");
        } finally{
            setModalSaving(false);
        }
    }
    async function handleDelete() {
        if (!editingId || mode !== "edit") return;
        const confirmed = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
        if (!confirmed) return;
        setModalError(null);
        setModalSaving(true);
        try {
            const result_1 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["deleteProduct"])(editingId);
            if (!result_1.ok) {
                setModalError(result_1.message);
                return;
            }
            removeItem(editingId);
            handleCloseModal();
        } catch (e_3) {
            console.error("[ProductsPage] unexpected error deleting product", e_3);
            setModalError("Unexpected error while deleting");
        } finally{
            setModalSaving(false);
        }
    }
    function mapSort(key) {
        switch(key){
            case "title_az":
                return {
                    sort: "title",
                    dir: "asc"
                };
            case "title_za":
                return {
                    sort: "title",
                    dir: "desc"
                };
            case "price_low":
                return {
                    sort: "price",
                    dir: "asc"
                };
            case "price_high":
                return {
                    sort: "price",
                    dir: "desc"
                };
            case "stock_low":
                return {
                    sort: "stock",
                    dir: "asc"
                };
            case "stock_high":
                return {
                    sort: "stock",
                    dir: "desc"
                };
            case "recent":
            default:
                return {
                    sort: "created_at",
                    dir: "desc"
                };
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "surface",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "surface-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "surface-title",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "Products"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 301,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Overview of imported products with current stock calculated from adjustments."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 300,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "toolbar",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "input",
                                        placeholder: "Search by SKU or name...",
                                        value: searchInput,
                                        onChange: (e_4)=>setSearchInput(e_4.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input",
                                        value: category,
                                        onChange: (e_5)=>setCategory(e_5.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: categoryLoading ? "Loading categories..." : "All categories"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 312,
                                                columnNumber: 15
                                            }, this),
                                            categoryError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "__error",
                                                disabled: true,
                                                children: categoryError
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 315,
                                                columnNumber: 33
                                            }, this),
                                            categoryOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: opt.value,
                                                    children: [
                                                        opt.label,
                                                        " (",
                                                        opt.count,
                                                        ")"
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/src/pages/products.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 43
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        className: "input",
                                        value: sortKey,
                                        onChange: (e_6)=>setSortKey(e_6.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "recent",
                                                children: "Newest first"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 324,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "title_az",
                                                children: "Title A → Z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 325,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "title_za",
                                                children: "Title Z → A"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 326,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "price_low",
                                                children: "Price low → high"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 327,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "price_high",
                                                children: "Price high → low"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 328,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "stock_low",
                                                children: "Stock low → high"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 329,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "stock_high",
                                                children: "Stock high → low"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chip",
                                        children: [
                                            "Page ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: page
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 334,
                                                columnNumber: 20
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "chip",
                                        children: [
                                            "Items ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: items.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-primary",
                                        onClick: handleOpenCreate,
                                        children: "Add product"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 339,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "products-grid",
                        children: items.map((p)=>{
                            const stock = p.stock ?? 0;
                            const stockClass = stock <= 3 ? "product-stock-badge product-stock-low" : "product-stock-badge product-stock-ok";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "product-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-image-wrapper",
                                        children: p.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: p.image_url,
                                            alt: p.title,
                                            className: "product-image",
                                            onError: (e_7)=>{
                                                e_7.currentTarget.style.display = "none";
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 352,
                                            columnNumber: 34
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "product-image-placeholder",
                                            children: "No image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 354,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 351,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-card-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "product-sku",
                                                children: p.sku
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 361,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: stockClass,
                                                children: [
                                                    "Stock ",
                                                    stock
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 362,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 360,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-title",
                                        children: p.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 365,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-price",
                                        children: Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 2
                                        }).format(p.price ?? 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 367,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-footer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "product-meta",
                                                children: [
                                                    "ID: ",
                                                    p.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 376,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "btn btn-ghost",
                                                onClick: ()=>handleOpenDetail(p.id),
                                                children: "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 377,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, p.id, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 349,
                                columnNumber: 18
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: loaderRef,
                        className: "h-10 flex items-center justify-center",
                        style: {
                            marginTop: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8rem",
                            color: "#9ca3af"
                        },
                        children: [
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Loading more…"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 393,
                                columnNumber: 23
                            }, this),
                            !loading && !hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "No more products"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 394,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this),
            modalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: handleCloseModal,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "modal",
                    onClick: (e_8)=>e_8.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-header",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "modal-title",
                                            children: mode === "create" ? "Add product" : "Product detail"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 401,
                                            columnNumber: 17
                                        }, this),
                                        mode === "edit" && editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "modal-subtitle",
                                            children: [
                                                "ID: ",
                                                editingId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 404,
                                            columnNumber: 50
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 400,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "modal-close-btn",
                                    type: "button",
                                    onClick: handleCloseModal,
                                    disabled: modalSaving,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 406,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 399,
                            columnNumber: 13
                        }, this),
                        modalError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-error",
                            children: modalError
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 411,
                            columnNumber: 28
                        }, this),
                        modalLoading || !form ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: "0.8rem",
                                color: "#9ca3af"
                            },
                            children: "Loading..."
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 413,
                            columnNumber: 38
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Image preview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 420,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "product-image-preview",
                                            children: form.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: form.image_url,
                                                alt: form.title || "Product image",
                                                onError: (e_9)=>{
                                                    e_9.currentTarget.style.display = "none";
                                                    const parent = e_9.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.classList.add("product-image-preview--empty");
                                                        parent.innerHTML = "<span>No image</span>";
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 422,
                                                columnNumber: 39
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "No image"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 429,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 421,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 419,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "SKU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 434,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.sku,
                                            onChange: (e_10)=>handleFormChange("sku", e_10.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 435,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 433,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Title"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 439,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.title,
                                            onChange: (e_11)=>handleFormChange("title", e_11.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 440,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 438,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Price"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 444,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            inputMode: "decimal",
                                            pattern: "^\\d*([.,]\\d{0,2})?$",
                                            value: form.price,
                                            onChange: (e_12)=>{
                                                const raw = e_12.target.value;
                                                if (raw === "") {
                                                    handleFormChange("price", "");
                                                    return;
                                                }
                                                const normalized = raw.replace(",", ".");
                                                const isValid = /^\d*\.?\d{0,2}$/.test(normalized);
                                                if (isValid) {
                                                    handleFormChange("price", raw);
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 445,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 443,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 460,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            inputMode: "numeric",
                                            value: form.category || "",
                                            onChange: (e_13)=>handleFormChange("category", e_13.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 461,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 459,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 465,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            className: "modal-textarea",
                                            value: form.description,
                                            onChange: (e_14)=>handleFormChange("description", e_14.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 466,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 464,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Image URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 470,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.image_url,
                                            onChange: (e_15)=>handleFormChange("image_url", e_15.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 471,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 469,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 418,
                            columnNumber: 24
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: modalSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "#9ca3af"
                                        },
                                        children: mode === "create" ? "Creating…" : "Saving…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 477,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "0.4rem",
                                        alignItems: "center"
                                    },
                                    children: [
                                        mode === "edit" && editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-ghost",
                                            onClick: handleDelete,
                                            disabled: modalSaving,
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 488,
                                            columnNumber: 50
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-ghost",
                                            onClick: handleCloseModal,
                                            disabled: modalSaving,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 491,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-primary",
                                            onClick: handleSave,
                                            disabled: modalSaving || modalLoading || !form,
                                            children: mode === "create" ? "Create product" : "Save changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 494,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 483,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 475,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products.tsx",
                    lineNumber: 398,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/products.tsx",
                lineNumber: 397,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/products.tsx",
        lineNumber: 297,
        columnNumber: 10
    }, this);
}
_s(ProductsPage, "G+YxmkFAZmhWAq6G+lA8dqfDwWE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useProductStore"]
    ];
});
_c = ProductsPage;
var _c;
__turbopack_context__.k.register(_c, "ProductsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/products";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/products.tsx [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/products\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/products.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__74951fdf._.js.map