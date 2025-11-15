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
"[project]/src/store/useProductStore.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/zustand [external] (zustand, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const useProductStore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$zustand__$5b$external$5d$__$28$zustand$2c$__esm_import$29$__["create"])((set)=>({
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
"[project]/src/pages/products.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ProductsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Layout.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useProductStore.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
"use client";
;
;
;
;
;
const LIMIT = 8;
function ProductsPage() {
    const { items, page, hasMore, appendPage, reset, updateItem, addItem, removeItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useProductStore$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useProductStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const loaderRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("edit");
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [sortKey, setSortKey] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("recent");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("all");
    const [categoryOptions, setCategoryOptions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [categoryLoading, setCategoryLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [categoryError, setCategoryError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [modalLoading, setModalLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [modalSaving, setModalSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [modalError, setModalError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handle = setTimeout(()=>{
            setSearch(searchInput.trim());
        }, 400);
        return ()=>clearTimeout(handle);
    }, [
        searchInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        async function init() {
            reset();
            setLoading(true);
            const { sort, dir } = mapSort(sortKey);
            try {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchProducts"])(1, LIMIT, {
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
    }, [
        reset,
        appendPage,
        search,
        sortKey,
        category
    ]);
    const loadMore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (loading || !hasMore) return;
        const nextPage = page + 1;
        setLoading(true);
        const { sort, dir } = mapSort(sortKey);
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchProducts"])(nextPage, LIMIT, {
                q: search || undefined,
                sort,
                dir,
                category
            });
            appendPage(res.data, nextPage, LIMIT);
        } catch (e) {
            console.error("[ProductsPage] error loadMore", e);
        } finally{
            setLoading(false);
        }
    }, [
        loading,
        hasMore,
        page,
        appendPage,
        sortKey,
        search,
        category
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver((entries)=>{
            const first = entries[0];
            if (first.isIntersecting) {
                console.log("[ProductsPage] observer intersecting");
                loadMore();
            }
        });
        observer.observe(loaderRef.current);
        return ()=>observer.disconnect();
    }, [
        loadMore
    ]);
    console.log("[ProductsPage] render", {
        itemsLength: items.length,
        page,
        hasMore,
        loading
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        async function loadCategories() {
            setCategoryLoading(true);
            setCategoryError(null);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchProductCategories"])();
                setCategoryOptions(data);
            } catch (err) {
                console.error("[ProductsPage] loadCategories error", err);
                setCategoryError("Failed to load categories");
            } finally{
                setCategoryLoading(false);
            }
        }
        loadCategories();
    }, []);
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
            const detail = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["fetchProductDetail"])(id);
            setForm({
                sku: detail.sku,
                title: detail.title,
                price: String(detail.price ?? 0),
                description: detail.description ?? "",
                image_url: detail.image_url ?? "",
                category: detail.category ?? null
            });
        } catch (e) {
            console.error("[ProductsPage] error fetching detail", e);
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
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["createProduct"])({
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
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(editingId, {
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
                updateItem(result.data);
                handleCloseModal();
            }
        } catch (e) {
            console.error("[ProductsPage] unexpected error saving product", e);
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
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["deleteProduct"])(editingId);
            if (!result.ok) {
                setModalError(result.message);
                return;
            }
            removeItem(editingId);
            handleCloseModal();
        } catch (e) {
            console.error("[ProductsPage] unexpected error deleting product", e);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Layout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "surface",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "surface-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "surface-title",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        children: "Products"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: "Overview of imported products with current stock calculated from adjustments."
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 337,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "toolbar",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        className: "input",
                                        placeholder: "Search by SKU or name...",
                                        value: searchInput,
                                        onChange: (e)=>setSearchInput(e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        className: "input",
                                        value: category,
                                        onChange: (e)=>setCategory(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: categoryLoading ? "Loading categories..." : "All categories"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 356,
                                                columnNumber: 15
                                            }, this),
                                            categoryError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "__error",
                                                disabled: true,
                                                children: categoryError
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this),
                                            categoryOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                    value: opt.value,
                                                    children: [
                                                        opt.label,
                                                        " (",
                                                        opt.count,
                                                        ")"
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/src/pages/products.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        className: "input",
                                        value: sortKey,
                                        onChange: (e)=>setSortKey(e.target.value),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "recent",
                                                children: "Newest first"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 378,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "title_az",
                                                children: "Title A → Z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 379,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "title_za",
                                                children: "Title Z → A"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 380,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "price_low",
                                                children: "Price low → high"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 381,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "price_high",
                                                children: "Price high → low"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 382,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "stock_low",
                                                children: "Stock low → high"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 383,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                value: "stock_high",
                                                children: "Stock high → low"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 384,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "chip",
                                        children: [
                                            "Page ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: page
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 388,
                                                columnNumber: 20
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 387,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "chip",
                                        children: [
                                            "Items ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                children: items.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 391,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 390,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "btn btn-primary",
                                        onClick: handleOpenCreate,
                                        children: "Add product"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 343,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "products-grid",
                        children: items.map((p)=>{
                            const stock = p.stock ?? 0;
                            const stockClass = stock <= 3 ? "product-stock-badge product-stock-low" : "product-stock-badge product-stock-ok";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                className: "product-card",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-image-wrapper",
                                        children: p.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: p.image_url,
                                            alt: p.title,
                                            className: "product-image",
                                            onError: (e)=>{
                                                e.currentTarget.style.display = "none";
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 414,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "product-image-placeholder",
                                            children: "No image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 423,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 412,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-card-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "product-sku",
                                                children: p.sku
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 431,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: stockClass,
                                                children: [
                                                    "Stock ",
                                                    stock
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 432,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 430,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-title",
                                        children: p.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-price",
                                        children: Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 2
                                        }).format(p.price ?? 0)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 437,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "product-footer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "product-meta",
                                                children: [
                                                    "ID: ",
                                                    p.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 446,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "btn btn-ghost",
                                                onClick: ()=>handleOpenDetail(p.id),
                                                children: "Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 447,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 445,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, p.id, true, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 410,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "Loading more…"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 472,
                                columnNumber: 23
                            }, this),
                            !loading && !hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "No more products"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/products.tsx",
                                lineNumber: 473,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/products.tsx",
                        lineNumber: 460,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/products.tsx",
                lineNumber: 333,
                columnNumber: 7
            }, this),
            modalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "modal-backdrop",
                onClick: handleCloseModal,
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
                                            children: mode === "create" ? "Add product" : "Product detail"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 484,
                                            columnNumber: 17
                                        }, this),
                                        mode === "edit" && editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "modal-subtitle",
                                            children: [
                                                "ID: ",
                                                editingId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 488,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 483,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    className: "modal-close-btn",
                                    type: "button",
                                    onClick: handleCloseModal,
                                    disabled: modalSaving,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 491,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 482,
                            columnNumber: 13
                        }, this),
                        modalError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-error",
                            children: modalError
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 501,
                            columnNumber: 28
                        }, this),
                        modalLoading || !form ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: "0.8rem",
                                color: "#9ca3af"
                            },
                            children: "Loading..."
                        }, void 0, false, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 504,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-body",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Image preview"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 510,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "product-image-preview",
                                            children: form.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                src: form.image_url,
                                                alt: form.title || "Product image",
                                                onError: (e)=>{
                                                    e.currentTarget.style.display = "none";
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.classList.add("product-image-preview--empty");
                                                        parent.innerHTML = "<span>No image</span>";
                                                    }
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 513,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "No image"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/products.tsx",
                                                lineNumber: 526,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 511,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 509,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "SKU"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 532,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.sku,
                                            onChange: (e)=>handleFormChange("sku", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 533,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Title"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 541,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.title,
                                            onChange: (e)=>handleFormChange("title", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 542,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 540,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Price"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 552,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            inputMode: "decimal",
                                            pattern: "^\\d*([.,]\\d{0,2})?$",
                                            value: form.price,
                                            onChange: (e)=>{
                                                const raw = e.target.value;
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
                                            lineNumber: 553,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 551,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Category"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 578,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            inputMode: "numeric",
                                            value: form.category || "",
                                            onChange: (e)=>handleFormChange("category", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 579,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 577,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Description"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 591,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                            className: "modal-textarea",
                                            value: form.description,
                                            onChange: (e)=>handleFormChange("description", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 592,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 590,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "modal-field",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                            className: "modal-label",
                                            children: "Image URL"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 603,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            className: "modal-input",
                                            value: form.image_url,
                                            onChange: (e)=>handleFormChange("image_url", e.target.value),
                                            placeholder: "Optional"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 604,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 602,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 508,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "modal-footer",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: modalSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: "#9ca3af"
                                        },
                                        children: mode === "create" ? "Creating…" : "Saving…"
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/products.tsx",
                                        lineNumber: 619,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        gap: "0.4rem",
                                        alignItems: "center"
                                    },
                                    children: [
                                        mode === "edit" && editingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-ghost",
                                            onClick: handleDelete,
                                            disabled: modalSaving,
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 626,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-ghost",
                                            onClick: handleCloseModal,
                                            disabled: modalSaving,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "btn btn-primary",
                                            onClick: handleSave,
                                            disabled: modalSaving || modalLoading || !form,
                                            children: mode === "create" ? "Create product" : "Save changes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/products.tsx",
                                            lineNumber: 643,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/products.tsx",
                                    lineNumber: 624,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/products.tsx",
                            lineNumber: 616,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/products.tsx",
                    lineNumber: 478,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/pages/products.tsx",
                lineNumber: 477,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/pages/products.tsx",
        lineNumber: 332,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__f5d0eb34._.js.map