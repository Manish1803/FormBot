const Form = require("./../models/Form");
const Folder = require("./../models/Folder");
const Workspace = require("./../models/Workspace");
const Response = require("./../models/Response");
const FieldResponse = require("./../models/FieldResponse");

const checkWorkspacePermission = async (
  workspaceId,
  userId,
  requiredPermission = "view"
) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.owner.toString() === userId) {
    return true;
  }

  const sharedUser = workspace.sharedWith.find(
    (share) => share.user.toString() === userId
  );
  if (!sharedUser) {
    return false;
  }

  return requiredPermission === "view" || sharedUser.permission === "edit";
};

exports.createForm = async (req, res) => {
  try {
    const { title, fields, workspaceId, folderId } = req.body;

    const hasPermission = await checkWorkspacePermission(
      workspaceId,
      req.user.userId,
      "edit"
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to create forms in this workspace" });
    }

    const form = new Form({
      title,
      fields,
      workspace: workspaceId,
      folder: folderId,
    });
    await form.save();
    if (folderId) {
      await Folder.findByIdAndUpdate(folderId, { $push: { forms: form._id } });
    } else {
      await Workspace.findByIdAndUpdate(workspaceId, {
        $push: { forms: form._id },
      });
    }
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      form.workspace,
      req.user.userId
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this form" });
    }

    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { title, fields } = req.body;
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      form.workspace,
      req.user.userId,
      "edit"
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this form" });
    }

    form.title = title;
    form.fields = fields;
    await form.save();
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      form.workspace,
      req.user.userId,
      "edit"
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this form" });
    }

    if (form.folder) {
      await Folder.findByIdAndUpdate(form.folder, {
        $pull: { forms: form._id },
      });
    } else {
      await Workspace.findByIdAndUpdate(form.workspace, {
        $pull: { forms: form._id },
      });
    }
    await Form.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormResponseLink = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      form.workspace,
      req.user.userId
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this form" });
    }

    res.json({
      responseLink: `${process.env.BASE_URL}/respond/${form.responseLink}`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitFieldResponse = async (req, res) => {
  try {
    const { responseLink } = req.params;
    const { fieldId, value } = req.body;

    const form = await Form.findOne({ responseLink });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const fieldResponse = new FieldResponse({
      form: form._id,
      field: fieldId,
      value: value,
    });
    await fieldResponse.save();

    res.status(201).json({ message: "Field response submitted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitFormResponse = async (req, res) => {
  try {
    const { responseLink } = req.params;
    const { answers } = req.body;

    const form = await Form.findOne({ responseLink });
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const fieldResponses = await FieldResponse.find({ form: form._id });
    const allAnswers = [
      ...answers,
      ...fieldResponses.map((fr) => ({ field: fr.field, value: fr.value })),
    ];

    const completedPercentage = (allAnswers.length / form.fields.length) * 100;

    const response = new Response({
      form: form._id,
      answers: allAnswers,
      completedPercentage: completedPercentage,
    });
    await response.save();

    await Form.findByIdAndUpdate(form._id, {
      $push: { responses: response._id },
      $inc: { statsCount: 1 },
    });

    await FieldResponse.deleteMany({ form: form._id });

    res.status(201).json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormResponses = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).populate("workspace");
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      form.workspace._id,
      req.user.userId
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to view responses for this form" });
    }

    const responses = await Response.find({ form: form._id }).populate(
      "answers.field"
    );

    res.json({
      form: {
        id: form._id,
        title: form.title,
        viewsCount: form.viewsCount + 1,
      },
      responses: responses,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
