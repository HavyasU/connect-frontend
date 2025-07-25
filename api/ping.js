export default async function handler(req, res) {
    const response = await fetch("https://connect-backend-1.onrender.com");
    const status = response.status;
    res.status(200).json({ message: "Pinged", status });
}
