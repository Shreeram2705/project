const { getTasksCollection } = require("./_db");

module.exports = async function handler(req, res) {
  try {
    const tasks = await getTasksCollection();

    if (req.method === "GET") {
      const results = await tasks.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(results.map(({ _id, ...task }) => ({ id: _id.toString(), ...task })));
    }

    if (req.method === "POST") {
      const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
      const description = typeof req.body?.description === "string" ? req.body.description.trim() : "";
      if (!title) return res.status(400).json({ message: "Task title is required" });

      const task = { title, description, status: "Pending", createdAt: new Date() };
      const result = await tasks.insertOne(task);
      return res.status(201).json({ id: result.insertedId.toString(), ...task });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Tasks API error:", error);
    return res.status(500).json({ message: "Unable to access tasks. Check the database configuration." });
  }
};
