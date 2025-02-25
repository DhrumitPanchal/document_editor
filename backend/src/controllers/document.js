const Document = require("../models/Document");

const createNewDoc = async (req, res) => {
  const { title } = await req.body;
  if (!title || title === "") {
    return res.status(400).json({ msg: "Please provide title" });
  }
  const userID = await req.user.id;
  try {
    const doc = await Document.findOne({ title, ownerId: userID });

    if (doc) {
      return res
        .status(400)
        .json({ msg: "Document already exists with this name " });
    }

    const newDoc = new Document({
      title,
      ownerId: userID,
      content: "",
    });

    await newDoc.save();

    res.json(newDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const updateDoc = async (req, res) => {
  const { content } = await req.body;
  const userID = await req.user.id;
  console.log(content);
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ msg: "Document not found" });
    }
    if (
      ![
        ...doc.collaborators.map((e) => e.toString()),
        doc.ownerId.toString(),
      ].includes(userID)
    ) {
      console.log();
      return res.status(401).json({ msg: "Not authorized" });
    }

    doc.content = content;

    await doc.save();

    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const ShareDoc = async (req, res) => {
  const { share } = await req.body;
  console.log("share to : " + share);
  const id = await req.user.id;
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ msg: "Document not found" });
    }
    if (doc.ownerId.toString() !== id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    if (doc.collaborators.includes(share)) {
      return res.status(400).json({ msg: "User already added" });
    }

    doc.collaborators = [...doc?.collaborators, share];
    await doc.save();

    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getSingleDocData = async (req, res) => {
  const { id } = await req.params;
  try {
    const doc = await Document.findById(id);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getallDoc = async (req, res) => {
  const id = await req.user.id;
  console.log("user id id : " + id);
  try {
    const docs = await Document.find({
      $or: [{ ownerId: id }, { collaborators: id }],
    });

    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  createNewDoc,
  updateDoc,
  getallDoc,
  getSingleDocData,
  ShareDoc,
};
