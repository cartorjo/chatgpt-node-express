export const savePromptToDatabase = async (prompt: string): Promise<void> => {
    try {
        // Implement the actual database save logic here
        console.log('Saving prompt to database:', prompt);
        // Example: await db.collection('prompts').insertOne({ prompt });
    } catch (error) {
        console.error('Error saving prompt to database:', error);
    }
};

export const saveCompletionToDatabase = async (completion: string): Promise<void> => {
    try {
        // Implement the actual database save logic here
        console.log('Saving completion to database:', completion);
        // Example: await db.collection('completions').insertOne({ completion });
    } catch (error) {
        console.error('Error saving completion to database:', error);
    }
};