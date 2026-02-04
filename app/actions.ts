"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function loginUser(officialId: string, name: string) {
    try {
        // Upsert user (create if not exists)
        const user = await prisma.user.upsert({
            where: { officialId },
            update: { name }, // Update name if it changed
            create: {
                officialId,
                name,
            },
        });

        // Create active session
        await prisma.activeSession.upsert({
            where: { userId: user.id },
            update: { lastActive: new Date() },
            create: { userId: user.id },
        });

        // Set cookie for simple auth
        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { secure: false, httpOnly: true, path: '/' });

        return { success: true, userId: user.id };
    } catch (error) {
        console.error("Login Error:", error);
        return { success: false, error: "Failed to login" };
    }
}

export async function submitQuizResult(
    userId: string,
    moduleId: string,
    score: number,
    totalQuestions: number,
    answers: Record<string, number>
) {
    try {
        const attempt = await prisma.quizAttempt.create({
            data: {
                userId,
                moduleId,
                score,
                answers: JSON.stringify(answers),
                isCompleted: true,
                completedAt: new Date(),
            }
        });

        // Update session
        await prisma.activeSession.update({
            where: { userId },
            data: {
                lastActive: new Date(),
                currentModuleId: null // Clear current activity
            }
        });

        return { success: true, attemptId: attempt.id };
    } catch (error) {
        console.error("Submit Error:", error);
        return { success: false, error: "Failed to save result" };
    }
}

export async function updateSessionActivity(userId: string, moduleId: string, currentQuestionIndex: number = 0, totalQuestions: number = 50) {
    try {
        await prisma.activeSession.update({
            where: { userId },
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

export async function getAdminDashboardData() {
    try {
        const users = await prisma.user.findMany({
            where: {
                officialId: {
                    not: 'ADMIN'
                }
            },
            include: { activeSession: true, attempts: true },
            orderBy: { createdAt: 'desc' }
        });

        const attempts = await prisma.quizAttempt.findMany({
            include: { user: true },
            orderBy: { completedAt: 'desc' },
            take: 50 // Latest 50
        });

        // Transform for UI
        const formattedUsers = users.map((u: any) => {
            let status = "Idle";
            let liveProgress = null;

            if (u.activeSession) {
                const timeDiff = new Date().getTime() - new Date(u.activeSession.lastActive).getTime();
                if (timeDiff < 5 * 60 * 1000) { // Active in last 5 mins
                    status = "Active";
                    if (u.activeSession.currentModuleId) {
                        status = "In Quiz";
                        liveProgress = {
                            module: u.activeSession.currentModuleId,
                            current: u.activeSession.currentQuestionIndex || 0,
                            total: u.activeSession.totalQuestions || 50,
                            percentage: Math.round(((u.activeSession.currentQuestionIndex || 0) / (u.activeSession.totalQuestions || 50)) * 100)
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
                history: u.attempts.map((a: any) => {
                    const diff = a.completedAt ? new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime() : 0;
                    const durationMinutes = Math.floor(diff / 60000);
                    const durationSeconds = Math.floor((diff % 60000) / 1000);

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

        const formattedAttempts = attempts.map((a: any) => ({
            id: a.id,
            user: a.user.officialId,
            module: a.moduleId,
            score: a.score || 0,
            total: 50, // Assuming 50 for now or fetch from question count
            date: a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : 'N/A'
        }));

        return { success: true, users: formattedUsers, attempts: formattedAttempts };
    } catch (error) {
        console.error("Admin Data Error:", error);
        return { success: false, users: [], attempts: [] };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    return { success: true };
}

export async function loginAdmin() {
    const cookieStore = await cookies();
    // Non-secure for local IP access
    cookieStore.set('userId', 'ADMIN-SESSION-TOKEN', { secure: false, httpOnly: true, path: '/' });
    return { success: true };
}

export async function deleteUser(userId: string) {
    try {
        // Delete related records first (simulating Cascade)
        await prisma.activeSession.deleteMany({
            where: { userId }
        });

        await prisma.quizAttempt.deleteMany({
            where: { userId }
        });

        // Delete the user
        await prisma.user.delete({
            where: { id: userId }
        });

        return { success: true };
    } catch (error) {
        console.error("Delete User Error:", error);
        return { success: false, error: "Failed to delete user" };
    }
}

export async function deleteAttempt(attemptId: string) {
    try {
        await prisma.quizAttempt.delete({
            where: { id: attemptId }
        });
        return { success: true };
    } catch (error) {
        console.error("Delete Attempt Error:", error);
        return { success: false, error: "Failed to delete result" };
    }
}
