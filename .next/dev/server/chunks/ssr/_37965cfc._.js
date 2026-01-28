module.exports = [
"[project]/lib/db.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
let prismaInstance;
try {
    // Check if we can instantiate it (this might fail if not generated)
    // We use the imported class. If import failed, we wouldn't be here, 
    // but if the internal require fails, it might crash. 
    // Actually, import static is hoisted. 
    // We need to use require for safety if we suspect the module itself is broken.
    if (globalForPrisma.prisma) {
        prismaInstance = globalForPrisma.prisma;
    } else {
        prismaInstance = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
            log: [
                "query"
            ]
        });
    }
} catch (e) {
    console.error("Failed to initialize Prisma Client. Database features disabled.", e);
    // Mock Prisma to prevent crash on property access
    const mockHandler = {
        get: (target, prop)=>{
            return new Proxy({}, {
                get: ()=>async ()=>{
                        console.warn(`Database operation '${prop}' skipped: Client not initialized.`);
                        return null;
                    }
            });
        }
    };
    prismaInstance = new Proxy({}, mockHandler);
}
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prismaInstance;
const prisma = prismaInstance;
}),
"[project]/app/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"005bcc49a176be9b54cab20fcc4c25fe580da9bcac":"getAdminDashboardData","00abadca8d4a37c50d928261bd453c4de769dffc57":"logoutUser","00b43f61ee8dbf88d12957ea3a3121bbfe4f75eb22":"loginAdmin","60b5e11864e1c2698f0b50d17a82ad5218c790b369":"loginUser","78186fbaf50b5d1c08513ef68c5eb7bed62526ec53":"updateSessionActivity","7c831059db3053eb84c64eff502e2027c4f80408f7":"submitQuizResult"},"",""] */ __turbopack_context__.s([
    "getAdminDashboardData",
    ()=>getAdminDashboardData,
    "loginAdmin",
    ()=>loginAdmin,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "submitQuizResult",
    ()=>submitQuizResult,
    "updateSessionActivity",
    ()=>updateSessionActivity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function loginUser(officialId, name) {
    try {
        // Upsert user (create if not exists)
        const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.upsert({
            where: {
                officialId
            },
            update: {
                name
            },
            create: {
                officialId,
                name
            }
        });
        // Create active session
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].activeSession.upsert({
            where: {
                userId: user.id
            },
            update: {
                lastActive: new Date()
            },
            create: {
                userId: user.id
            }
        });
        // Set cookie for simple auth
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set('userId', user.id, {
            secure: false,
            httpOnly: true,
            path: '/'
        });
        return {
            success: true,
            userId: user.id
        };
    } catch (error) {
        console.error("Login Error:", error);
        return {
            success: false,
            error: "Failed to login"
        };
    }
}
async function submitQuizResult(userId, moduleId, score, totalQuestions, answers) {
    try {
        const attempt = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].quizAttempt.create({
            data: {
                userId,
                moduleId,
                score,
                answers: JSON.stringify(answers),
                isCompleted: true,
                completedAt: new Date()
            }
        });
        // Update session
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].activeSession.update({
            where: {
                userId
            },
            data: {
                lastActive: new Date(),
                currentModuleId: null // Clear current activity
            }
        });
        return {
            success: true,
            attemptId: attempt.id
        };
    } catch (error) {
        console.error("Submit Error:", error);
        return {
            success: false,
            error: "Failed to save result"
        };
    }
}
async function updateSessionActivity(userId, moduleId, currentQuestionIndex = 0, totalQuestions = 50) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].activeSession.update({
            where: {
                userId
            },
            data: {
                lastActive: new Date(),
                currentModuleId: moduleId,
                currentQuestionIndex,
                totalQuestions
            }
        });
    } catch (e) {
        // Ignore session update errors (non-critical)
        console.warn("Session update failed", e);
    }
}
async function getAdminDashboardData() {
    try {
        const users = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findMany({
            where: {
                officialId: {
                    not: 'ADMIN'
                }
            },
            include: {
                activeSession: true,
                attempts: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const attempts = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].quizAttempt.findMany({
            include: {
                user: true
            },
            orderBy: {
                completedAt: 'desc'
            },
            take: 50 // Latest 50
        });
        // Transform for UI
        const formattedUsers = users.map((u)=>{
            let status = "Idle";
            let liveProgress = null;
            if (u.activeSession) {
                const timeDiff = new Date().getTime() - new Date(u.activeSession.lastActive).getTime();
                if (timeDiff < 5 * 60 * 1000) {
                    status = "Active";
                    if (u.activeSession.currentModuleId) {
                        status = "In Quiz";
                        liveProgress = {
                            module: u.activeSession.currentModuleId,
                            current: u.activeSession.currentQuestionIndex || 0,
                            total: u.activeSession.totalQuestions || 50,
                            percentage: Math.round((u.activeSession.currentQuestionIndex || 0) / (u.activeSession.totalQuestions || 50) * 100)
                        };
                    }
                }
            }
            return {
                id: u.id,
                officialId: u.officialId,
                name: u.name,
                status,
                liveProgress,
                history: u.attempts.map((a)=>{
                    const diff = a.completedAt ? new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime() : 0;
                    const durationMinutes = Math.floor(diff / 60000);
                    const durationSeconds = Math.floor(diff % 60000 / 1000);
                    return {
                        id: a.id,
                        module: a.moduleId,
                        score: a.score || 0,
                        total: 50,
                        startedAt: new Date(a.startedAt).toLocaleString(),
                        completedAt: a.completedAt ? new Date(a.completedAt).toLocaleString() : "In Progress",
                        duration: a.completedAt ? `${durationMinutes}m ${durationSeconds}s` : "N/A"
                    };
                })
            };
        });
        const formattedAttempts = attempts.map((a)=>({
                id: a.id,
                user: a.user.officialId,
                module: a.moduleId,
                score: a.score || 0,
                total: 50,
                date: a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : 'N/A'
            }));
        return {
            success: true,
            users: formattedUsers,
            attempts: formattedAttempts
        };
    } catch (error) {
        console.error("Admin Data Error:", error);
        return {
            success: false,
            users: [],
            attempts: []
        };
    }
}
async function logoutUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('userId');
    return {
        success: true
    };
}
async function loginAdmin() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    // Non-secure for local IP access
    cookieStore.set('userId', 'ADMIN-SESSION-TOKEN', {
        secure: false,
        httpOnly: true,
        path: '/'
    });
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginUser,
    submitQuizResult,
    updateSessionActivity,
    getAdminDashboardData,
    logoutUser,
    loginAdmin
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginUser, "60b5e11864e1c2698f0b50d17a82ad5218c790b369", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitQuizResult, "7c831059db3053eb84c64eff502e2027c4f80408f7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateSessionActivity, "78186fbaf50b5d1c08513ef68c5eb7bed62526ec53", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminDashboardData, "005bcc49a176be9b54cab20fcc4c25fe580da9bcac", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutUser, "00abadca8d4a37c50d928261bd453c4de769dffc57", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAdmin, "00b43f61ee8dbf88d12957ea3a3121bbfe4f75eb22", null);
}),
"[project]/.next-internal/server/app/modules/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/modules/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00abadca8d4a37c50d928261bd453c4de769dffc57",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutUser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$modules$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/modules/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_37965cfc._.js.map