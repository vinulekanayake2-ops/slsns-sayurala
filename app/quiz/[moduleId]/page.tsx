import QuizInterface from "@/components/QuizInterface";
import { generateQuestions } from "@/lib/questions";

// This is a Server Component
export default async function QuizPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
    // Generate and shuffle questions for randomness per session
    const questions = generateQuestions(moduleId).sort(() => Math.random() - 0.5);

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
