const { ObjectId } = require("mongodb");
const { getTasksCollection } = require("../_db");

module.exports = async function handler(req, res) {
  const id = req.query.id;
  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task ID" });
  }

  try {
    const tasks = await getTasksCollection();
    const objectId = new ObjectId(id);

    if (req.method === "PUT") {
      const allowedStatuses = ["Pending", "Ongoing", "Completed"];
      const { status } = req.body || {};
      if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid task status" });

      const result = await tasks.findOneAndUpdate(
        { _id: objectId },
        { $set: { status } },
        { returnDocument: "after" }
      );
      if (!result) return res.status(404).json({ message: "Task not found" });
      const { _id, ...task } = result;
      return res.status(200).json({ id: _id.toString(), ...task });
    }

    if (req.method === "DELETE") {
      const result = await tasks.deleteOne({ _id: objectId });
      if (!result.deletedCount) return res.status(404).json({ message: "Task not found" });
      return res.status(200).json({ message: "Task deleted successfully" });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Task API error:", error);
    return res.status(500).json({ message: "Unable to access tasks. Check the database configuration." });
  }
};
