import axios from 'axios';

export default async function handler(req, res) {
    try {
        // Fetch courses
        const courseResponse = await axios.get('https://canvas.tufts.edu/api/v1/courses', {
            params: {
                access_token: "7513~9ktrwkzffGNEzRZcew8wNXNnwFHLMhvyTyCJtQXTwuZVmxhBXhvXw3MGVaNaPcHz"
            }
        });

        let assignments = [];
        const coursePromises = courseResponse.data.map(async (course) => {
            if (course.id) {
                try {
                    const response = await axios.get(`https://canvas.tufts.edu/api/v1/courses/${course.id}/assignments`, {
                        headers: {
                            Authorization: `Bearer 7513~9ktrwkzffGNEzRZcew8wNXNnwFHLMhvyTyCJtQXTwuZVmxhBXhvXw3MGVaNaPcHz`
                        },
                        params: {
                            bucket: "future"
                        }
                    });
                    assignments.push(...response.data);
                } catch (err) {
                    console.error(`Failed to fetch assignments for course ${course.id}`, err.message);
                }
            }
        });

        await Promise.all(coursePromises);
        res.send(assignments);

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
}
