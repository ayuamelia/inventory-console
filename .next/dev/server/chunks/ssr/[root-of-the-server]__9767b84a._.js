module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/components/layout/Layout.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
;
function Layout({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isProducts = router.pathname === "/products" || router.pathname === "/";
    const isAdjustments = router.pathname === "/adjustments";
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
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
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.documentElement.dataset.theme = theme;
        try {
            window.localStorage.setItem("app-theme", theme);
        } catch  {}
    }, [
        theme
    ]);
    function toggleTheme() {
        setTheme((prev)=>prev === "dark" ? "light" : "dark");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "app-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: "app-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "app-header-inner",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "app-brand",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "app-brand-avatar",
                                    children: "IN"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "app-brand-text",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "app-brand-title",
                                            children: "Inventory Console"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 58,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "app-brand-subtitle",
                                            children: "Products & stock adjustments overview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Layout.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "app-header-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                                    className: "app-nav",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/products",
                                            className: "app-nav-link" + (isProducts ? " app-nav-link--active" : ""),
                                            children: "Products"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 67,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/adjustments",
                                            className: "app-nav-link" + (isAdjustments ? " app-nav-link--active" : ""),
                                            children: "Adjustments"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/layout/Layout.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "theme-toggle-btn",
                                    onClick: toggleTheme,
                                    children: theme === "dark" ? "☀️ Light" : "🌙 Dark"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/Layout.tsx",
                                    lineNumber: 86,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/Layout.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/layout/Layout.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Layout.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "app-main",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/Layout.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/Layout.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
}),
"[externals]/zustand [external] (zustand, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("zustand");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/store/useAdjustmentStore.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useAdjustmentStore",
    ()=>useAdjustmentStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/zustand [external] (zustand, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const useAdjustmentStore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__["create"])((set)=>({
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/api.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
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
}),
"[project]/src/pages/adjustments.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AdjustmentsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Layout.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useAdjustmentStore.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const LIMIT = 10;
function AdjustmentsPage() {
    const { items, page, hasMore, setPage, setData, reset, prepend, updateItem, removeItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAdjustmentStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAdjustmentStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [skuInput, setSkuInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [qtyInput, setQtyInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [amountInput, setAmountInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [formSubmitting, setFormSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [filterSku, setFilterSku] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [filterSkuInput, setFilterSkuInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [editModalOpen, setEditModalOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editFormError, setEditFormError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [editSubmitting, setEditSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [editQty, setEditQty] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [editAmount, setEditAmount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    async function loadPage(targetPage, opts) {
        if (loading) return;
        setLoading(true);
        setFormError(null);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchAdjustments"])(targetPage, LIMIT, {
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        reset();
        loadPage(1);
    }, [
        reset
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handle = setTimeout(()=>{
            setFilterSku(filterSkuInput.trim());
        }, 400);
        return ()=>clearTimeout(handle);
    }, [
        filterSkuInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        reset();
        loadPage(1);
    }, [
        filterSku
    ]);
    async function handleSubmitAdjustment(e) {
        e.preventDefault();
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
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["createAdjustment"])({
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
        const qtyNum = Number(editQty);
        if (!Number.isFinite(qtyNum) || qtyNum === 0) {
            setEditFormError("Qty must be a non-zero number");
            return;
        }
        let amountNum = null;
        if (editAmount.trim() !== "") {
            const norm = editAmount.replace(",", ".");
            amountNum = Number(norm);
            if (!Number.isFinite(amountNum)) {
                setEditFormError("Amount must be a valid number");
                return;
            }
        }
        setEditSubmitting(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateAdjustment"])(editingId, {
                qty: qtyNum,
                amount: amountNum ?? undefined
            });
            if (!result.ok) {
                setEditFormError(result.message);
                return;
            }
            updateItem(result.data);
            handleCloseEdit();
        } catch (err) {
            console.error("[AdjustmentsPage] unexpected edit error", err);
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
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["deleteAdjustment"])(editingId);
            if (!result.ok) {
                setEditFormError(result.message);
                return;
            }
            removeItem(editingId);
            handleCloseEdit();
        } catch (err) {
            console.error("[AdjustmentsPage] unexpected delete error", err);
            setEditFormError("Unexpected error while deleting");
        } finally{
            setEditSubmitting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "surface",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "surface-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "surface-title",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    children: "Stock Adjustments"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    children: "Transaction history of stock movements per product."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 219,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "toolbar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    className: "input toolbar-input",
                                    placeholder: "Filter by SKU…",
                                    value: filterSkuInput,
                                    onChange: (e)=>setFilterSkuInput(e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 223,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "chip",
                                    children: [
                                        "Page ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: page
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 230,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 229,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "chip",
                                    children: [
                                        "Rows ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: items.length
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 233,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 232,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmitAdjustment,
                    className: "adjustment-form",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Product SKU"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    value: skuInput,
                                    onChange: (e)=>setSkuInput(e.target.value),
                                    placeholder: "e.g. 1, 2, or dummy SKU"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Qty (+ / -)"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    inputMode: "numeric",
                                    value: qtyInput,
                                    onChange: (e)=>{
                                        const raw = e.target.value;
                                        if (raw === "" || /^-?\d*$/.test(raw)) {
                                            setQtyInput(raw);
                                        }
                                    },
                                    placeholder: "e.g. 5 or -3"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-field",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    className: "modal-label",
                                    children: "Amount (USD)"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    className: "modal-input",
                                    inputMode: "decimal",
                                    value: amountInput,
                                    onChange: (e)=>{
                                        const raw = e.target.value;
                                        if (raw === "") {
                                            setAmountInput("");
                                            return;
                                        }
                                        const normalized = raw.replace(",", ".");
                                        if (/^-?\d*\.?\d{0,2}$/.test(normalized)) {
                                            setAmountInput(raw);
                                        }
                                    },
                                    placeholder: "Optional, auto = price * qty"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                alignSelf: "flex-end",
                                paddingBottom: "0.1rem"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-primary",
                                disabled: formSubmitting,
                                children: formSubmitting ? "Saving…" : "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 238,
                    columnNumber: 9
                }, this),
                formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "modal-error",
                    style: {
                        marginBottom: "0.5rem"
                    },
                    children: formError
                }, void 0, false, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 301,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "table-wrapper",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                        className: "table",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "ID"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 310,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "SKU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 311,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "Product"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 312,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "Qty"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 313,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "Amount (USD)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 314,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            children: "Created"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 315,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/adjustments.tsx",
                                    lineNumber: 309,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                children: [
                                    items.map((a)=>{
                                        const isPositive = a.qty > 0;
                                        const badgeClass = isPositive ? "badge badge-green" : "badge badge-red";
                                        const sign = isPositive ? "+" : "";
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: a.id
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: a.sku
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 329,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: a.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: badgeClass,
                                                        children: [
                                                            sign,
                                                            a.qty
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/adjustments.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 2
                                                    }).format(a.amount ?? 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: new Date(a.created_at).toLocaleString("id-ID")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "btn btn-ghost",
                                                        onClick: ()=>handleOpenEdit(a),
                                                        children: "Edit"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/adjustments.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, a.id, true, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 327,
                                            columnNumber: 19
                                        }, this);
                                    }),
                                    editModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "modal-backdrop",
                                        onClick: handleCloseEdit,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "modal",
                                            onClick: (e)=>e.stopPropagation(),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "modal-header",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "modal-title",
                                                                    children: "Edit adjustment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 365,
                                                                    columnNumber: 25
                                                                }, this),
                                                                editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "modal-subtitle",
                                                                    children: [
                                                                        "ID: ",
                                                                        editingId
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 367,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: "modal-close-btn",
                                                            type: "button",
                                                            onClick: handleCloseEdit,
                                                            disabled: editSubmitting,
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 363,
                                                    columnNumber: 21
                                                }, this),
                                                editFormError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "modal-error",
                                                    children: editFormError
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "modal-body",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "modal-field",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "modal-label",
                                                                    children: "Qty (+/-)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 386,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    className: "modal-input",
                                                                    inputMode: "numeric",
                                                                    value: editQty,
                                                                    onChange: (e)=>{
                                                                        const raw = e.target.value;
                                                                        if (raw === "" || /^-?\d*$/.test(raw)) {
                                                                            setEditQty(raw);
                                                                        }
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 387,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "modal-field",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "modal-label",
                                                                    children: "Amount (USD)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 401,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    className: "modal-input",
                                                                    inputMode: "decimal",
                                                                    value: editAmount,
                                                                    onChange: (e)=>{
                                                                        const raw = e.target.value;
                                                                        if (raw === "") {
                                                                            setEditAmount("");
                                                                            return;
                                                                        }
                                                                        const norm = raw.replace(",", ".");
                                                                        if (/^-?\d*\.?\d{0,2}$/.test(norm)) {
                                                                            setEditAmount(raw);
                                                                        }
                                                                    },
                                                                    placeholder: "Optional, auto = price * qty"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 402,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 400,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "modal-footer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: editSubmitting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: "#9ca3af"
                                                                },
                                                                children: "Saving…"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/adjustments.tsx",
                                                                lineNumber: 425,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 423,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                gap: "0.4rem",
                                                                alignItems: "center"
                                                            },
                                                            children: [
                                                                editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-ghost",
                                                                    onClick: handleDeleteEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Delete"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 430,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-ghost",
                                                                    onClick: handleCloseEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Cancel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 439,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    className: "btn btn-primary",
                                                                    onClick: handleSaveEdit,
                                                                    disabled: editSubmitting,
                                                                    children: "Save changes"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                                    lineNumber: 447,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/adjustments.tsx",
                                                            lineNumber: 428,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/adjustments.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 359,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/adjustments.tsx",
                                        lineNumber: 358,
                                        columnNumber: 17
                                    }, this),
                                    items.length === 0 && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: 6,
                                            style: {
                                                textAlign: "center",
                                                padding: "0.8rem"
                                            },
                                            children: "No adjustment data"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/adjustments.tsx",
                                            lineNumber: 463,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/adjustments.tsx",
                                        lineNumber: 462,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/adjustments.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/adjustments.tsx",
                        lineNumber: 307,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 306,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "pagination",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost",
                            disabled: page <= 1 || loading,
                            onClick: ()=>loadPage(page - 1),
                            children: "Prev"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            children: [
                                "Page ",
                                page
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 480,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            className: "btn btn-ghost",
                            disabled: !hasMore || loading,
                            onClick: ()=>loadPage(page + 1, {
                                    keepItems: true
                                }),
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 481,
                            columnNumber: 11
                        }, this),
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                            children: "Loading…"
                        }, void 0, false, {
                            fileName: "[project]/src/pages/adjustments.tsx",
                            lineNumber: 488,
                            columnNumber: 23
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/adjustments.tsx",
                    lineNumber: 472,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/pages/adjustments.tsx",
            lineNumber: 215,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/adjustments.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9767b84a._.js.map