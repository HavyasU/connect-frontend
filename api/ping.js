export default async function handler(req, res) {
    try {
        const response = await fetch("https://connect-backend-1.onrender.com/");
        const status = response.status;
        res.status(200).json({ message: "Pinged!", status });
    } catch (error) {
        console.error("Ping error:", error);
        res.status(500).json({ message: "Ping failed", error: error.message });
    }
}
