class HillCaloriesAI {
    constructor() {
        this.initializeEventListeners();
        console.log('Hill Calories AI initialized');
    }

    initializeEventListeners() {
        const imageInput = document.getElementById('imageInput');
        const uploadForm = document.getElementById('uploadForm');
        const uploadArea = document.getElementById('uploadArea');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const analyzeAgainBtn = document.getElementById('analyzeAgainBtn');

        console.log('Initializing event listeners...');

        // File input change
        imageInput.addEventListener('change', (e) => {
            console.log('File selected via input');
            this.handleImageSelect(e);
        });
        
        // Analyze button click
        analyzeBtn.addEventListener('click', (e) => {
            console.log('Analyze button clicked');
            this.handleAnalyzeClick(e);
        });
        
        // Analyze another meal
        analyzeAgainBtn.addEventListener('click', () => {
            console.log('Analyze again clicked');
            this.resetAnalysis();
        });

        // Drag and drop support
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
            console.log('Drag over upload area');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            console.log('Drag leave upload area');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            console.log('File dropped:', file ? file.name : 'No file');
            if (file && this.isValidImageFile(file)) {
                document.getElementById('imageInput').files = e.dataTransfer.files;
                this.handleImageSelect(null, file);
            } else {
                this.showError('Please select a valid image file (JPG, PNG, GIF)');
            }
        });
        
        // Click on upload area to trigger file input
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== imageInput) {
                console.log('Upload area clicked, triggering file input');
                imageInput.click();
            }
        });

        console.log('Event listeners initialized successfully');
    }

    handleImageSelect(event, file = null) {
        const selectedFile = file || (event ? event.target.files[0] : null);
        console.log('Handling image selection:', selectedFile ? selectedFile.name : 'No file');
        
        if (selectedFile) {
            if (this.isValidImageFile(selectedFile)) {
                this.displayImagePreview(selectedFile);
                this.enableAnalyzeButton();
            } else {
                this.showError('Please select a valid image file (JPG, PNG, GIF)');
            }
        }
    }

    isValidImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        const isValid = allowedTypes.includes(file.type);
        console.log('File validation:', file.type, isValid);
        return isValid;
    }

    displayImagePreview(file) {
        const reader = new FileReader();
        const preview = document.getElementById('imagePreview');
        const placeholder = document.querySelector('.upload-placeholder');

        reader.onload = (e) => {
            console.log('Image preview loaded successfully');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        };

        reader.onerror = (e) => {
            console.error('Error loading image preview:', e);
            this.showError('Error loading image preview');
        };

        reader.readAsDataURL(file);
    }

    enableAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = false;
        console.log('Analyze button enabled');
    }

    async handleAnalyzeClick(event) {
        event.preventDefault();
        console.log('Starting analysis process...');
        
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showError('Please select an image first');
            return;
        }

        console.log('Starting image analysis for:', file.name);
        await this.analyzeImage(file);
    }

    async analyzeImage(file) {
        this.showLoading();
        console.log('Analysis started...');
        
        const formData = new FormData();
        formData.append('image', file);

        try {
            console.log('Sending POST request to /analyze...');
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            console.log('Response received, status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            if (data.error) {
                throw new Error(data.error);
            }

            console.log('Analysis successful, displaying results');
            this.displayResults(data);
            
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message || 'Failed to analyze image. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    displayResults(data) {
        console.log('Displaying results:', data);
        
        // Update results message
        const resultsMessage = document.getElementById('resultsMessage');
        resultsMessage.textContent = data.message || 'Analysis complete! Here are your results.';
        
        if (data.error) {
            resultsMessage.textContent = data.message || 'Analysis failed';
            resultsMessage.style.color = '#ff6b6b';
        } else {
            resultsMessage.style.color = '#4a90e2';
        }

        // Update nutrition values
        document.getElementById('caloriesValue').textContent = data.calories || 0;
        document.getElementById('proteinValue').textContent = data.protein || 0;
        document.getElementById('carbsValue').textContent = data.carbs || 0;
        document.getElementById('fatValue').textContent = data.fat || 0;

        // Update detected foods
        const foodsList = document.getElementById('foodsList');
        foodsList.innerHTML = '';
        
        if (data.detected_foods && data.detected_foods.length > 0) {
            data.detected_foods.forEach(food => {
                const foodTag = document.createElement('span');
                foodTag.className = 'food-tag';
                foodTag.textContent = this.formatFoodName(food);
                foodsList.appendChild(foodTag);
            });
        } else {
            foodsList.innerHTML = '<span class="food-tag">No specific foods detected</span>';
        }

        // Show results section, hide upload section
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        console.log('Results displayed successfully');
    }

    formatFoodName(food) {
        return food.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    showLoading() {
        console.log('Showing loading state');
        const analyzeBtn = document.getElementById('analyzeBtn');
        analyzeBtn.disabled = true;
        document.querySelector('.btn-text').classList.add('hidden');
        document.querySelector('.btn-loading').classList.remove('hidden');
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('loadingSection').classList.remove('hidden');
    }

    hideLoading() {
        console.log('Hiding loading state');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const fileInput = document.getElementById('imageInput');
        
        // Only re-enable if there's still a file selected
        analyzeBtn.disabled = !fileInput.files[0];
        document.querySelector('.btn-text').classList.remove('hidden');
        document.querySelector('.btn-loading').classList.add('hidden');
        document.getElementById('loadingSection').classList.add('hidden');
    }

    showError(message) {
        console.error('Showing error:', message);
        
        // Remove any existing error messages
        this.removeExistingErrors();
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <strong>Error:</strong> ${message}
        `;
        
        // Insert error message at the top of the main content
        const mainContent = document.querySelector('.main-content');
        mainContent.insertBefore(errorDiv, mainContent.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
        
        this.hideLoading();
    }

    removeExistingErrors() {
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
    }

    resetAnalysis() {
        console.log('Resetting analysis');
        
        // Reset form and UI
        document.getElementById('uploadForm').reset();
        document.getElementById('imagePreview').classList.add('hidden');
        document.querySelector('.upload-placeholder').classList.remove('hidden');
        document.getElementById('analyzeBtn').disabled = true;

        // Reset results
        document.getElementById('caloriesValue').textContent = '0';
        document.getElementById('proteinValue').textContent = '0';
        document.getElementById('carbsValue').textContent = '0';
        document.getElementById('fatValue').textContent = '0';
        document.getElementById('foodsList').innerHTML = '<span class="food-tag">No foods detected</span>';

        // Show upload section, hide results
        document.getElementById('uploadSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('loadingSection').classList.add('hidden');
        
        // Remove any error messages
        this.removeExistingErrors();
        
        console.log('Analysis reset complete');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    try {
        new HillCaloriesAI();
        console.log('Hill Calories AI application started successfully');
    } catch (error) {
        console.error('Failed to initialize Hill Calories AI:', error);
    }
});

// Handle page errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});