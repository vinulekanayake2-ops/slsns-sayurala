export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

export const generateQuestions = (moduleId: string): Question[] => {
    // Generate 50 mock questions for the given module
    return Array.from({ length: 50 }).map((_, i) => ({
        id: `${moduleId}-q-${i + 1}`,
        text: `Question ${i + 1} for ${moduleId.replace(/-/g, ' ').toUpperCase()}: What is the primary function of component X?`,
        options: [
            "To regulate flow",
            "To increase pressure",
            "To monitor temperature",
            "To secure the deck"
        ],
        correctIndex: Math.floor(Math.random() * 4)
    }));
};
