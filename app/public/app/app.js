// Main JavaScript for ScreenshotToCode App

document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.app-nav a');
    const sections = document.querySelectorAll('.app-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.id.replace('nav-', '') + '-section';
            document.getElementById(sectionId).classList.add('active');
        });
    });
    
    // Settings Tabs
    const settingsTabs = document.querySelectorAll('.settings-sidebar a');
    const settingsContent = document.querySelectorAll('.settings-tab');
    
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs and content
            settingsTabs.forEach(tab => tab.classList.remove('active'));
            settingsContent.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // New Project Modal
    const newProjectBtn = document.getElementById('new-project-btn');
    const newProjectModal = document.getElementById('new-project-modal');
    const modalClose = document.querySelectorAll('.modal-close');
    const cancelButton = document.querySelector('.cancel-button');
    
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', function() {
            newProjectModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    modalClose.forEach(close => {
        close.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        });
    });
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            newProjectModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // File Upload Preview
    const fileInput = document.getElementById('project-screenshot');
    const filePreview = document.querySelector('.file-upload-preview');
    const filePreviewImg = document.getElementById('screenshot-preview');
    const filePlaceholder = document.querySelector('.file-upload-placeholder');
    const removeFileBtn = document.querySelector('.remove-file');
    
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    filePreviewImg.src = e.target.result;
                    filePreview.style.display = 'block';
                    filePlaceholder.style.display = 'none';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', function() {
            fileInput.value = '';
            filePreview.style.display = 'none';
            filePlaceholder.style.display = 'flex';
        });
    }
    
    // Project Form Submission
    const newProjectForm = document.getElementById('new-project-form');
    
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData();
            formData.append('name', document.getElementById('project-name').value);
            formData.append('description', document.getElementById('project-description').value);
            formData.append('type', document.querySelector('input[name="project-type"]:checked').value);
            formData.append('screenshot', document.getElementById('project-screenshot').files[0]);
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
            submitButton.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(function() {
                // Reset form
                newProjectForm.reset();
                filePreview.style.display = 'none';
                filePlaceholder.style.display = 'flex';
                
                // Close modal
                newProjectModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset button
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Show success message (replace with actual implementation)
                alert('Project created successfully!');
                
                // Reload projects (replace with actual implementation)
                // loadProjects();
            }, 2000);
        });
    }
    
    // Editor Tabs
    const editorTabs = document.querySelectorAll('.editor-tab');
    const editorPanes = document.querySelectorAll('.editor-pane');
    
    editorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panes
            editorTabs.forEach(tab => tab.classList.remove('active'));
            editorPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding pane
            const paneId = this.getAttribute('data-tab') + '-editor';
            document.getElementById(paneId).classList.add('active');
        });
    });
    
    // Preview Controls
    const previewControls = document.querySelectorAll('.preview-control');
    const previewFrame = document.getElementById('preview-frame');
    
    previewControls.forEach(control => {
        control.addEventListener('click', function() {
            if (this.id === 'refresh-preview') {
                updatePreview();
                return;
            }
            
            // Remove active class from all controls
            previewControls.forEach(control => control.classList.remove('active'));
            
            // Add active class to clicked control
            this.classList.add('active');
            
            // Update preview frame size based on device
            const device = this.getAttribute('data-device');
            
            if (device === 'desktop') {
                previewFrame.style.width = '100%';
                previewFrame.style.height = '100%';
            } else if (device === 'tablet') {
                previewFrame.style.width = '768px';
                previewFrame.style.height = '1024px';
            } else if (device === 'mobile') {
                previewFrame.style.width = '375px';
                previewFrame.style.height = '667px';
            }
        });
    });
    
    // Update Preview
    function updatePreview() {
        const htmlCode = document.getElementById('html-code').value;
        const cssCode = document.getElementById('css-code').value;
        const jsCode = document.getElementById('js-code').value;
        
        const previewContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}</script>
            </body>
            </html>
        `;
        
        const previewFrame = document.getElementById('preview-frame');
        const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        
        frameDoc.open();
        frameDoc.write(previewContent);
        frameDoc.close();
    }
    
    // Edit Project
    const editButtons = document.querySelectorAll('.action-button.edit');
    const projectEditorModal = document.getElementById('project-editor-modal');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectName = projectCard.querySelector('h3').textContent;
            
            // Set project name in editor
            document.getElementById('editor-project-name').textContent = projectName;
            
            // Show editor modal
            projectEditorModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Simulate loading project data (replace with actual API call)
            document.getElementById('html-code').value = '<div class="container">\n  <header>\n    <h1>Sample Project</h1>\n    <nav>\n      <ul>\n        <li><a href="#">Home</a></li>\n        <li><a href="#">About</a></li>\n        <li><a href="#">Services</a></li>\n        <li><a href="#">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  \n  <main>\n    <section class="hero">\n      <h2>Welcome to our website</h2>\n      <p>This is a sample project generated from your screenshot.</p>\n      <button class="cta-button">Get Started</button>\n    </section>\n  </main>\n  \n  <footer>\n    <p>&copy; 2023 Sample Project. All rights reserved.</p>\n  </footer>\n</div>';
            
            document.getElementById('css-code').value = 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 0;\n}\n\nnav ul {\n  display: flex;\n  list-style: none;\n  gap: 20px;\n}\n\nnav a {\n  text-decoration: none;\n  color: #333;\n  font-weight: bold;\n}\n\n.hero {\n  text-align: center;\n  padding: 100px 0;\n  background-color: #f5f5f5;\n}\n\n.cta-button {\n  background-color: #4f46e5;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 4px;\n  font-weight: bold;\n  cursor: pointer;\n}\n\nfooter {\n  text-align: center;\n  padding: 20px 0;\n  margin-top: 40px;\n  border-top: 1px solid #eee;\n}';
            
            document.getElementById('js-code').value = 'document.addEventListener("DOMContentLoaded", function() {\n  const ctaButton = document.querySelector(".cta-button");\n  \n  if (ctaButton) {\n    ctaButton.addEventListener("click", function() {\n      alert("Button clicked!");\n    });\n  }\n});';
            
            // Update preview
            updatePreview();
        });
    });
    
    // Save Changes
    const saveChangesBtn = document.getElementById('save-changes');
    
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            const htmlCode = document.getElementById('html-code').value;
            const cssCode = document.getElementById('css-code').value;
            const jsCode = document.getElementById('js-code').value;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            this.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show success message
                alert('Changes saved successfully!');
            }, 1500);
        });
    }
    
    // Regenerate Code
    const regenerateCodeBtn = document.getElementById('regenerate-code');
    
    if (regenerateCodeBtn) {
        regenerateCodeBtn.addEventListener('click', function() {
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Regenerating...';
            this.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                // Reset button
                this.innerHTML = originalText;
                this.disabled = false;
                
                // Show success message
                alert('Code regenerated successfully!');
                
                // Update code (replace with actual implementation)
                document.getElementById('html-code').value = '<div class="container">\n  <header>\n    <h1>Regenerated Project</h1>\n    <nav>\n      <ul>\n        <li><a href="#">Home</a></li>\n        <li><a href="#">About</a></li>\n        <li><a href="#">Services</a></li>\n        <li><a href="#">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  \n  <main>\n    <section class="hero">\n      <h2>Welcome to our redesigned website</h2>\n      <p>This is a regenerated project with improved code.</p>\n      <button class="cta-button">Get Started</button>\n    </section>\n    \n    <section class="features">\n      <h2>Our Features</h2>\n      <div class="feature-grid">\n        <div class="feature">\n          <h3>Feature 1</h3>\n          <p>Description of feature 1</p>\n        </div>\n        <div class="feature">\n          <h3>Feature 2</h3>\n          <p>Description of feature 2</p>\n        </div>\n        <div class="feature">\n          <h3>Feature 3</h3>\n          <p>Description of feature 3</p>\n        </div>\n      </div>\n    </section>\n  </main>\n  \n  <footer>\n    <p>&copy; 2023 Regenerated Project. All rights reserved.</p>\n  </footer>\n</div>';
                
                document.getElementById('css-code').value = 'body {\n  font-family: "Inter", sans-serif;\n  margin: 0;\n  padding: 0;\n  color: #333;\n  line-height: 1.6;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px 0;\n}\n\nnav ul {\n  display: flex;\n  list-style: none;\n  gap: 20px;\n  margin: 0;\n  padding: 0;\n}\n\nnav a {\n  text-decoration: none;\n  color: #333;\n  font-weight: 500;\n  transition: color 0.3s ease;\n}\n\nnav a:hover {\n  color: #4f46e5;\n}\n\n.hero {\n  text-align: center;\n  padding: 100px 0;\n  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);\n}\n\n.hero h2 {\n  font-size: 2.5rem;\n  margin-bottom: 20px;\n  color: #111827;\n}\n\n.hero p {\n  font-size: 1.2rem;\n  color: #6b7280;\n  max-width: 600px;\n  margin: 0 auto 30px;\n}\n\n.cta-button {\n  background: linear-gradient(135deg, #4f46e5, #0ea5e9);\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.cta-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n}\n\n.features {\n  padding: 80px 0;\n}\n\n.features h2 {\n  text-align: center;\n  font-size: 2rem;\n  margin-bottom: 40px;\n}\n\n.feature-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 30px;\n}\n\n.feature {\n  background-color: #f9fafb;\n  padding: 30px;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.feature:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n}\n\n.feature h3 {\n  font-size: 1.5rem;\n  margin-bottom: 15px;\n}\n\nfooter {\n  text-align: center;\n  padding: 20px 0;\n  margin-top: 40px;\n  border-top: 1px solid #eee;\n  color: #6b7280;\n}\n\n@media (max-width: 768px) {\n  header {\n    flex-direction: column;\n    text-align: center;\n  }\n  \n  nav ul {\n    margin-top: 20px;\n  }\n  \n  .hero h2 {\n    font-size: 2rem;\n  }\n  \n  .hero p {\n    font-size: 1rem;\n  }\n}';
                
                document.getElementById('js-code').value = 'document.addEventListener("DOMContentLoaded", function() {\n  const ctaButton = document.querySelector(".cta-button");\n  const features = document.querySelectorAll(".feature");\n  \n  if (ctaButton) {\n    ctaButton.addEventListener("click", function() {\n      alert("Welcome to our service! We\'re glad you\'re here.");\n    });\n  }\n  \n  // Animate features on scroll\n  function isInViewport(element) {\n    const rect = element.getBoundingClientRect();\n    return (\n      rect.top >= 0 &&\n      rect.left >= 0 &&\n      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&\n      rect.right <= (window.innerWidth || document.documentElement.clientWidth)\n    );\n  }\n  \n  function checkFeatures() {\n    features.forEach(feature => {\n      if (isInViewport(feature) && !feature.classList.contains("animated")) {\n        feature.classList.add("animated");\n        feature.style.opacity = "1";\n      }\n    });\n  }\n  \n  // Set initial state\n  features.forEach(feature => {\n    feature.style.opacity = "0";\n    feature.style.transition = "opacity 0.5s ease, transform 0.5s ease";\n  });\n  \n  // Check on scroll\n  window.addEventListener("scroll", checkFeatures);\n  \n  // Check on page load\n  checkFeatures();\n});';
                
                // Update preview
                updatePreview();
            }, 3000);
        });
    }
    
    // Preview Code
    const previewCodeBtn = document.getElementById('preview-code');
    
    if (previewCodeBtn) {
        previewCodeBtn.addEventListener('click', function() {
            updatePreview();
        });
    }
    
    // Download Code
    const downloadCodeBtn = document.getElementById('download-code');
    
    if (downloadCodeBtn) {
        downloadCodeBtn.addEventListener('click', function() {
            const htmlCode = document.getElementById('html-code').value;
            const cssCode = document.getElementById('css-code').value;
            const jsCode = document.getElementById('js-code').value;
            const projectName = document.getElementById('editor-project-name').textContent.trim().replace(/\s+/g, '-').toLowerCase();
            
            // Create zip file (using JSZip library - this is just a placeholder)
            alert('Download functionality would create a zip file with HTML, CSS, and JS files.');
            
            // In a real implementation, you would use a library like JSZip to create a zip file
            // and then trigger a download
        });
    }
});
