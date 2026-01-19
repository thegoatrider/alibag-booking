(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://bxvyidxcbuwuascgimec.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_Wd6WN2sNJbkl8X-4xOG-Uw_5dfn-n6g"));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/p/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PropertyPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function PropertyPage() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(40);
    if ($[0] !== "a9de5013b30f4cca0653efc33e4f7fc64510bf39287a3aa39d83f4e9632b813c") {
        for(let $i = 0; $i < 40; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "a9de5013b30f4cca0653efc33e4f7fc64510bf39287a3aa39d83f4e9632b813c";
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    let t0;
    if ($[1] !== search) {
        t0 = search.get("check_in");
        $[1] = search;
        $[2] = t0;
    } else {
        t0 = $[2];
    }
    const checkIn = t0;
    let t1;
    if ($[3] !== search) {
        t1 = search.get("check_out");
        $[3] = search;
        $[4] = t1;
    } else {
        t1 = $[4];
    }
    const checkOut = t1;
    let t2;
    if ($[5] !== search) {
        t2 = search.get("lead");
        $[5] = search;
        $[6] = t2;
    } else {
        t2 = $[6];
    }
    const leadId = t2;
    const [property] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    let t3;
    let t4;
    if ($[7] !== leadId) {
        t3 = ({
            "PropertyPage[useEffect()]": ()=>{
                if (!leadId) {
                    return;
                }
                const markViewed = {
                    "PropertyPage[useEffect() > markViewed]": async ()=>{
                        const { data: lead } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("leads").select("status").eq("id", leadId).single();
                        if (lead?.status === "enquired") {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("leads").update({
                                status: "viewed"
                            }).eq("id", leadId);
                        }
                    }
                }["PropertyPage[useEffect() > markViewed]"];
                markViewed();
            }
        })["PropertyPage[useEffect()]"];
        t4 = [
            leadId
        ];
        $[7] = leadId;
        $[8] = t3;
        $[9] = t4;
    } else {
        t3 = $[8];
        t4 = $[9];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[10] !== leadId) {
        t5 = ({
            "PropertyPage[markShortlisted]": async ()=>{
                if (!leadId) {
                    return;
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("leads").update({
                    status: "shortlisted"
                }).eq("id", leadId);
            }
        })["PropertyPage[markShortlisted]"];
        $[10] = leadId;
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    const markShortlisted = t5;
    if (!property) {
        let t6;
        if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
            t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "p-10",
                children: "Loading property..."
            }, void 0, false, {
                fileName: "[project]/app/p/[slug]/page.tsx",
                lineNumber: 99,
                columnNumber: 12
            }, this);
            $[12] = t6;
        } else {
            t6 = $[12];
        }
        return t6;
    }
    let t6;
    if ($[13] !== property.name) {
        t6 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
            className: "text-2xl font-bold",
            children: property.name
        }, void 0, false, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 108,
            columnNumber: 10
        }, this);
        $[13] = property.name;
        $[14] = t6;
    } else {
        t6 = $[14];
    }
    const t7 = property.areas?.name;
    let t8;
    if ($[15] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-gray-600",
            children: [
                "Area: ",
                t7
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 117,
            columnNumber: 10
        }, this);
        $[15] = t7;
        $[16] = t8;
    } else {
        t8 = $[16];
    }
    let t9;
    if ($[17] !== property.starting_price) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-lg font-semibold",
            children: [
                "Starting ₹",
                property.starting_price,
                " / night"
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 125,
            columnNumber: 10
        }, this);
        $[17] = property.starting_price;
        $[18] = t9;
    } else {
        t9 = $[18];
    }
    let t10;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
            children: "Check-in:"
        }, void 0, false, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 133,
            columnNumber: 11
        }, this);
        $[19] = t10;
    } else {
        t10 = $[19];
    }
    const t11 = checkIn || "\u2014";
    let t12;
    if ($[20] !== t11) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t10,
                " ",
                t11
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 141,
            columnNumber: 11
        }, this);
        $[20] = t11;
        $[21] = t12;
    } else {
        t12 = $[21];
    }
    let t13;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
            children: "Check-out:"
        }, void 0, false, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 149,
            columnNumber: 11
        }, this);
        $[22] = t13;
    } else {
        t13 = $[22];
    }
    const t14 = checkOut || "\u2014";
    let t15;
    if ($[23] !== t14) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                t13,
                " ",
                t14
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 157,
            columnNumber: 11
        }, this);
        $[23] = t14;
        $[24] = t15;
    } else {
        t15 = $[24];
    }
    let t16;
    if ($[25] !== t12 || $[26] !== t15) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "border p-4 rounded space-y-2",
            children: [
                t12,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 165,
            columnNumber: 11
        }, this);
        $[25] = t12;
        $[26] = t15;
        $[27] = t16;
    } else {
        t16 = $[27];
    }
    let t17;
    if ($[28] !== markShortlisted) {
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: markShortlisted,
            className: "bg-black text-white px-4 py-2 rounded w-full",
            children: "Book Now"
        }, void 0, false, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 174,
            columnNumber: 11
        }, this);
        $[28] = markShortlisted;
        $[29] = t17;
    } else {
        t17 = $[29];
    }
    let t18;
    if ($[30] !== markShortlisted || $[31] !== property.phone) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: {
                "PropertyPage[<button>.onClick]": ()=>{
                    markShortlisted();
                    window.open(`https://wa.me/91${property.phone || ""}`, "_blank");
                }
            }["PropertyPage[<button>.onClick]"],
            className: "border px-4 py-2 rounded w-full",
            children: "Chat with Owner"
        }, void 0, false, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 182,
            columnNumber: 11
        }, this);
        $[30] = markShortlisted;
        $[31] = property.phone;
        $[32] = t18;
    } else {
        t18 = $[32];
    }
    let t19;
    if ($[33] !== t16 || $[34] !== t17 || $[35] !== t18 || $[36] !== t6 || $[37] !== t8 || $[38] !== t9) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            className: "p-6 max-w-3xl space-y-4",
            children: [
                t6,
                t8,
                t9,
                t16,
                t17,
                t18
            ]
        }, void 0, true, {
            fileName: "[project]/app/p/[slug]/page.tsx",
            lineNumber: 196,
            columnNumber: 11
        }, this);
        $[33] = t16;
        $[34] = t17;
        $[35] = t18;
        $[36] = t6;
        $[37] = t8;
        $[38] = t9;
        $[39] = t19;
    } else {
        t19 = $[39];
    }
    return t19;
}
_s(PropertyPage, "QMEj2nPOwYi95h/XSJMnGSDb2C8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = PropertyPage;
var _c;
__turbopack_context__.k.register(_c, "PropertyPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_efb638be._.js.map