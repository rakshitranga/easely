import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    console.log(req.query.prompt);

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: req.query.prompt,
                },
            ],
            model: "llama3-8b-8192",
        });

        // Send the content of the first response message back to the client
        res.send(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
        console.error("Error fetching chat completion:", error);
        res.status(500).send("An error occurred while processing your request.");
    }
}
