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

    res.json({
      id: form._id,
      title: form.title,
      fields: form.fields.map((field) => ({
        id: field._id,
        title: field.title,
        type: field.type,
        value: field.value,
        required: field.required,
      })),
      workspace: form.workspace,
      folder: form.folder,
      responseLink: form.responseLink,
      viewsCount: form.viewsCount,
      startCount: form.startCount,
      completionsCount: form.completionsCount,
    });
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

    let response = await Response.findOne({
      form: form._id,
      isCompleted: false,
    });

    if (!response) {
      response = new Response({
        form: form._id,
        answers: [],
      });
      // Increment startCount when a new response is created
      await Form.findByIdAndUpdate(form._id, { $inc: { startCount: 1 } });
    }

    const existingAnswerIndex = response.answers.findIndex(
      (a) => a.field.toString() === fieldId
    );
    if (existingAnswerIndex !== -1) {
      response.answers[existingAnswerIndex].value = value;
    } else {
      response.answers.push({ field: fieldId, value });
    }

    await response.save();

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

    let response = await Response.findOne({
      form: form._id,
      isCompleted: false,
    });

    if (!response) {
      response = new Response({
        form: form._id,
        answers: [],
      });
      // Increment startCount when a new response is created
      await Form.findByIdAndUpdate(form._id, { $inc: { startCount: 1 } });
    }

    answers.forEach((answer) => {
      const existingAnswerIndex = response.answers.findIndex(
        (a) => a.field.toString() === answer.field
      );
      if (existingAnswerIndex !== -1) {
        response.answers[existingAnswerIndex].value = answer.value;
      } else {
        response.answers.push(answer);
      }
    });

    response.isCompleted = response.answers.length === form.fields.length;
    response.submittedAt = new Date();
    await response.save();

    if (response.isCompleted) {
      await Form.findByIdAndUpdate(form._id, {
        $inc: { completionsCount: 1 },
      });
    }

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
        viewsCount: form.viewsCount,
        startsCount: form.startsCount,
        completionsCount: form.completionsCount,
      },
      responses: responses.map((response) => ({
        id: response._id,
        answers: response.answers,
        isCompleted: response.isCompleted,
        submittedAt: response.submittedAt,
      })),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormStructure = async (req, res) => {
  try {
    const { responseLink } = req.params;

    const form = await Form.findOne({ responseLink }).select("title fields");

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Increment the view count
    await Form.findByIdAndUpdate(form._id, { $inc: { viewsCount: 1 } });

    res.json({
      id: form._id,
      title: form.title,
      description: form.description,
      fields: form.fields.map((field) => ({
        id: field._id,
        title: field.title,
        type: field.type,
        value: field.value,
        placeholder: field.placeholder,
        required: field.required,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the form structure" });
  }
};

exports.incrementFormView = async (req, res) => {
  try {
    const { responseLink } = req.params;

    const form = await Form.findOneAndUpdate(
      { responseLink },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ message: "Form view count incremented successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
