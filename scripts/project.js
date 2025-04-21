/**
 * Project management scripts
 */

// List all projects with pagination
function list(query) {
  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const where = {};

  if (query.type) {
    where.type = query.type;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.name = { like: `%${query.search}%` };
  }

  const projects = Process("models.project.Paginate", {
    wheres: [where],
    orders: [{ column: "created_at", option: "desc" }],
  }, page, pageSize);

  return projects;
}

// Find a project by ID
function find(id) {
  const project = Process("models.project.Find", id, {});
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }
  return project;
}

// Create a new project
function create(payload) {
  // Validate payload
  if (!payload.name) {
    throw new Error("Project name is required");
  }

  if (!payload.type) {
    payload.type = "landing_page";
  }

  payload.status = "draft";

  const id = Process("models.project.Create", payload);
  return { id, ...payload };
}

// Update a project
function update(id, payload) {
  // Check if project exists
  const project = Process("models.project.Find", id, {});
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  // Update project
  Process("models.project.Update", id, payload);

  return { id, ...payload };
}

// Delete a project
function delete_(id) {
  // Check if project exists
  const project = Process("models.project.Find", id, {});
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  // Delete project
  Process("models.project.Delete", id);

  return { success: true, message: "Project deleted successfully" };
}

// Generate code from screenshot
function generate(id, payload) {
  // Check if project exists
  const project = Process("models.project.Find", id, {});
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  // Check if screenshot exists
  if (!project.screenshot) {
    throw new Error("Project has no screenshot to generate code from");
  }

  // Update project status
  Process("models.project.Update", id, { status: "processing" });

  try {
    // Analyze screenshot using OpenAI Vision API
    const analysisResult = analyzeScreenshot(project.screenshot, project.type);

    // Generate code based on analysis
    const generatedCode = generateCode(analysisResult, project.type);

    // Update project with generated code
    Process("models.project.Update", id, {
      html_code: generatedCode.html,
      css_code: generatedCode.css,
      js_code: generatedCode.js,
      status: "completed"
    });

    return {
      success: true,
      message: "Code generated successfully",
      project: Process("models.project.Find", id, {})
    };
  } catch (error) {
    // Update project status to indicate error
    Process("models.project.Update", id, { status: "draft" });
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}

// Preview generated code
function preview(id) {
  // Check if project exists
  const project = Process("models.project.Find", id, {});
  if (!project) {
    throw new Error(`Project with ID ${id} not found`);
  }

  // Check if code has been generated
  if (!project.html_code) {
    throw new Error("No code has been generated for this project yet");
  }

  // Combine HTML, CSS, and JS into a complete webpage
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <style>
    ${project.css_code || ''}
  </style>
</head>
<body>
  ${project.html_code || ''}
  <script>
    ${project.js_code || ''}
  </script>
</body>
</html>
  `;

  return html;
}

// Upload a screenshot
function uploadScreenshot(file) {
  if (!file || !file.name) {
    throw new Error("No file uploaded");
  }

  // Check file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only PNG, JPEG, and WebP images are allowed");
  }

  // Generate a unique filename
  const timestamp = new Date().getTime();
  const filename = `screenshot_${timestamp}_${file.name}`;

  // Save file to uploads directory
  const filePath = `uploads/screenshots/${filename}`;
  Process("fs.system.WriteFile", filePath, file.content);

  return {
    success: true,
    message: "Screenshot uploaded successfully",
    filePath: filePath
  };
}

// Helper function to analyze screenshot using OpenAI Vision API
function analyzeScreenshot(screenshotPath, projectType) {
  // Read the screenshot file
  const fileContent = Process("fs.system.ReadFile", screenshotPath);

  // Prepare the prompt based on project type
  let prompt = "";
  if (projectType === "landing_page") {
    prompt = "Analyze this landing page screenshot and identify all UI elements, layout structure, colors, fonts, and content. Provide a detailed description of the page structure.";
  } else if (projectType === "web_app") {
    prompt = "Analyze this web application screenshot and identify all UI components, interactive elements, layout structure, colors, fonts, and functionality. Provide a detailed description of the application structure and behavior.";
  } else {
    prompt = "Analyze this screenshot and identify all UI elements, layout structure, colors, fonts, and content. Provide a detailed description of the page structure.";
  }

  // Call Vision API (preferring Grok if available)
  try {
    // Determine which AI provider to use (prefer Grok)
    const apiProvider = Process("env.Get", "AI_PROVIDER") || "grok"; // Default to Grok

    // Configure model based on available API keys
    let modelConfig = {};

    if (apiProvider === "grok") {
      const apiKey = Process("env.Get", "GROK_API_KEY");
      if (apiKey) {
        modelConfig = {
          driver: "grok",
          options: {
            api_key: apiKey,
            model: "grok-3"
          }
        };
      } else {
        console.warn("Grok API key not found, falling back to OpenAI");
        const openaiKey = Process("env.Get", "OPENAI_API_KEY");
        if (!openaiKey) {
          throw new Error("No API keys found. Please add either GROK_API_KEY or OPENAI_API_KEY to your .env file.");
        }
        modelConfig = {
          driver: "openai",
          options: {
            api_key: openaiKey,
            model: "gpt-4-vision-preview"
          }
        };
      }
    } else if (apiProvider === "openai") {
      const apiKey = Process("env.Get", "OPENAI_API_KEY");
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.");
      }
      modelConfig = {
        driver: "openai",
        options: {
          api_key: apiKey,
          model: "gpt-4-vision-preview"
        }
      };
    } else {
      throw new Error(`Unsupported AI provider: ${apiProvider}`);
    }

    // Configure vision service
    const visionConfig = {
      storage: {
        driver: "local",
        options: {
          path: "/tmp/vision",
          compression: true
        }
      },
      model: modelConfig
    };

    // Create a temporary file for the vision API
    const tempFilePath = `/tmp/vision/${new Date().getTime()}.png`;
    Process("fs.system.WriteFile", tempFilePath, fileContent);

    // Call the vision API
    const result = Process("neo.vision.Analyze", visionConfig, tempFilePath, prompt);

    // Clean up temporary file
    Process("fs.system.Remove", tempFilePath);

    return result;
  } catch (error) {
    console.error("Vision API error:", error);
    throw new Error(`Failed to analyze screenshot: ${error.message}`);
  }
}

// Helper function to generate code based on analysis
function generateCode(analysisResult, projectType) {
  // Prepare the prompt for code generation
  let prompt = "";
  if (projectType === "landing_page") {
    prompt = `
Based on the following analysis of a landing page screenshot, generate clean, responsive HTML, CSS, and JavaScript code that recreates this landing page as accurately as possible:

${analysisResult.description}

Please provide:
1. Clean, semantic HTML structure
2. Modern CSS with responsive design (mobile-first approach)
3. Any necessary JavaScript for interactive elements
4. Use best practices for web development
5. Ensure the code is accessible and SEO-friendly
`;
  } else if (projectType === "web_app") {
    prompt = `
Based on the following analysis of a web application screenshot, generate clean, responsive HTML, CSS, and JavaScript code that recreates this web application as accurately as possible:

${analysisResult.description}

Please provide:
1. Clean, semantic HTML structure
2. Modern CSS with responsive design (mobile-first approach)
3. JavaScript for all interactive elements and functionality
4. Use best practices for web application development
5. Ensure the code is accessible and follows modern web standards
`;
  } else {
    prompt = `
Based on the following analysis of a screenshot, generate clean, responsive HTML, CSS, and JavaScript code that recreates this interface as accurately as possible:

${analysisResult.description}

Please provide:
1. Clean, semantic HTML structure
2. Modern CSS with responsive design
3. Any necessary JavaScript for interactive elements
4. Use best practices for web development
`;
  }

  // Call AI API for code generation (preferring Grok if available)
  try {
    // Determine which AI provider to use (prefer Grok)
    const apiProvider = Process("env.Get", "AI_PROVIDER") || "grok"; // Default to Grok
    let connector = "";

    if (apiProvider === "grok") {
      const apiKey = Process("env.Get", "GROK_API_KEY");
      if (apiKey) {
        connector = "grok-3";
      } else {
        console.warn("Grok API key not found, falling back to OpenAI");
        const openaiKey = Process("env.Get", "OPENAI_API_KEY");
        if (!openaiKey) {
          throw new Error("No API keys found. Please add either GROK_API_KEY or OPENAI_API_KEY to your .env file.");
        }
        connector = "moapi:gpt-4-turbo";
      }
    } else if (apiProvider === "openai") {
      const apiKey = Process("env.Get", "OPENAI_API_KEY");
      if (!apiKey) {
        throw new Error("OpenAI API key not found. Please add OPENAI_API_KEY to your .env file.");
      }
      connector = "moapi:gpt-4-turbo";
    } else {
      throw new Error(`Unsupported AI provider: ${apiProvider}`);
    }

    const response = Process("aigc.Call", {
      connector: connector,
      prompts: [
        {
          role: "system",
          content: "You are an expert web developer who specializes in converting designs into clean, responsive, and accessible code. Your task is to generate HTML, CSS, and JavaScript code based on the description of a screenshot."
        }
      ]
    }, prompt, "");

    // Parse the response to extract HTML, CSS, and JS
    const codeBlocks = parseCodeBlocks(response);

    return {
      html: codeBlocks.html || "",
      css: codeBlocks.css || "",
      js: codeBlocks.js || ""
    };
  } catch (error) {
    console.error("Code generation error:", error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}

// Helper function to parse code blocks from AI response
function parseCodeBlocks(response) {
  const result = {
    html: "",
    css: "",
    js: ""
  };

  // Extract HTML code block
  const htmlMatch = response.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch && htmlMatch[1]) {
    result.html = htmlMatch[1].trim();
  }

  // Extract CSS code block
  const cssMatch = response.match(/```css\n([\s\S]*?)```/);
  if (cssMatch && cssMatch[1]) {
    result.css = cssMatch[1].trim();
  }

  // Extract JavaScript code block
  const jsMatch = response.match(/```javascript\n([\s\S]*?)```/) || response.match(/```js\n([\s\S]*?)```/);
  if (jsMatch && jsMatch[1]) {
    result.js = jsMatch[1].trim();
  }

  return result;
}
