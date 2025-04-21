# ScreenshotToCode

ScreenshotToCode is an application that turns screenshots into functional landing pages and web apps using AI. Upload a screenshot, and the application will analyze it and generate clean, responsive HTML, CSS, and JavaScript code.

## Features

- **AI-Powered Analysis**: Advanced AI analyzes your screenshots to identify UI elements, layout structure, colors, and more.
- **Clean, Responsive Code**: Generate semantic HTML, modern CSS, and functional JavaScript that works across all devices.
- **Customizable Output**: Edit and customize the generated code to match your exact requirements and preferences.
- **Export & Deploy**: Download your code or deploy directly to popular hosting platforms with just a few clicks.
- **Mobile-First Design**: All generated code follows mobile-first design principles for optimal performance on all devices.
- **Accessibility Built-In**: Generated code follows accessibility best practices to ensure your site works for everyone.

## Prerequisites

- [Yao](https://yaoapps.com/) - Application engine
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Grok API Key](https://grok.x.ai/) (preferred) or [OpenAI API Key](https://platform.openai.com/) - For AI-powered code generation

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/screenshot-to-code.git
   cd screenshot-to-code
   ```

2. Copy the example environment file and update it with your settings:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your API keys and configuration options:
   - Set `AI_PROVIDER` to either "grok" (default) or "openai"
   - Add your Grok API key (preferred) or OpenAI API key (fallback)
   - The application will use Grok if available, and fall back to OpenAI if needed

4. Install Yao CLI (if not already installed):
   ```bash
   curl -fsSL https://website.yaoapps.com/install.sh | bash
   ```

5. Start the application:
   ```bash
   yao start
   ```

6. Access the application at `http://localhost:5099`

## Usage

1. **Create a New Project**:
   - Click on the "New Project" button
   - Enter a project name and description
   - Select the project type (Landing Page or Web App)
   - Upload a screenshot of the design you want to convert to code
   - Click "Create Project"

2. **Generate Code**:
   - The AI will analyze your screenshot and generate HTML, CSS, and JavaScript code
   - This process may take a few moments depending on the complexity of the design

3. **Edit and Customize**:
   - Use the built-in code editor to modify the generated code
   - Preview your changes in real-time
   - Test the responsiveness with desktop, tablet, and mobile views

4. **Download or Deploy**:
   - Download the generated code as a ZIP file
   - Or deploy directly to a hosting platform

## Project Structure

```
screenshot-to-code/
├── app.json                # Application configuration
├── models/                 # Database models
│   └── project.mod.json    # Project model definition
├── apis/                   # API endpoints
│   └── project.http.json   # Project API definition
├── scripts/                # Business logic
│   └── project.js          # Project management scripts
├── app/                    # Frontend application
│   └── public/             # Public assets
│       ├── index.html      # Landing page
│       ├── css/            # CSS files
│       ├── js/             # JavaScript files
│       └── app/            # Application interface
├── .env.example            # Example environment variables
└── README.md               # Project documentation
```

## API Endpoints

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `POST /api/projects/:id/generate` - Generate code for a project
- `GET /api/projects/:id/preview` - Preview a project
- `POST /api/upload/screenshot` - Upload a screenshot

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Grok](https://grok.x.ai/) and [OpenAI](https://openai.com/) - For the AI vision and code generation capabilities
- [Yao](https://yaoapps.com/) - For the application engine
- [Font Awesome](https://fontawesome.com/) - For the icons used in the UI
