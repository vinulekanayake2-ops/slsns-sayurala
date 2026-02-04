import QuizInterface from "@/components/QuizInterface";
import { generateQuestions } from "@/lib/questions";
import { prisma } from "@/lib/db";

export default async function QuizPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;

    // Try to fetch from DB first
    const moduleData = await prisma.module.findUnique({
        where: { slug: moduleId },
        include: { questions: true }
    });

    let questions;

    if (moduleData && moduleData.questions.length > 0) {
        questions = moduleData.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: JSON.parse(q.options), // Options are stored as JSON string in DB
            correctIndex: q.correctIndex
        })).sort(() => Math.random() - 0.5);
    } else {
        // Fallback to mock generation
        questions = generateQuestions(moduleId).sort(() => Math.random() - 0.5);
    }

    return (
        <main className="h-screen w-screen bg-navy-900 text-steel-100 relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gold-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full h-full">
                <QuizInterface moduleId={moduleId} questions={questions} />
            </div>
        </main>
    );
}
