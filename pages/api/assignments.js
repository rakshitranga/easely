import axios from 'axios';

export default async function handler(req, res) {
    await axios.get('https://canvas.tufts.edu/api/v1/courses', {
        params: {
            access_token: "7513~9ktrwkzffGNEzRZcew8wNXNnwFHLMhvyTyCJtQXTwuZVmxhBXhvXw3MGVaNaPcHz"
        }
    }).then((response) => {
        let courses = [];
        console.log(response.data)
        for (let i in response.data) {
            if (response.data[i].course_code) {
                courses.push(response.data[i].course_code);
            }
        }
        res.send(courses);
    }).catch((error) => {
        throw error;
    })
}