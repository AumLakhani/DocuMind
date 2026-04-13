class DocuMindApp {
    constructor() {
        this.messages = [];
        this.inputMessage = '';
        this.isLoading = false;
        this.uploadedFile = null;
        this.isFileUploaded = false;

        this.init();
    }

    init() {
        this.hideLoading();
        this.render();
        this.bindEvents();
    }

    hideLoading() {
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.opacity = '0';
                setTimeout(() => loading.style.display = 'none', 300);
            }
        }, 1000);
    }

    bindEvents() {
        document.addEventListener('change', (e) => {
            if (e.target && e.target.id === 'pdf-upload') {
                this.handleFileUpload(e);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target && e.target.id === 'message-input') {
                this.inputMessage = e.target.value;
                const sendBtn = document.getElementById('send-btn');
                if (sendBtn) sendBtn.disabled = !this.inputMessage.trim() || this.isLoading;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.target && e.target.id === 'message-input') {
                this.handleKeyPress(e);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'send-btn') {
                this.sendMessage();
            }
            if (e.target && e.target.closest('.clear-btn')) {
                this.clearChat();
            }
        });
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Please upload a valid PDF file.');
            event.target.value = '';
            return;
        }

        this.uploadedFile = file.name;
        this.messages = [{
            id: Date.now(),
            type: 'system',
            content: `⏳ Uploading "${file.name}"...`,
            timestamp: this.formatTime(new Date())
        }];
        this.render();

        const formData = new FormData();
        formData.append('file', file);

        // ✅ Relative URL — works on localhost AND Hugging Face Spaces
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) return res.json().then(d => { throw new Error(d.error || 'Upload failed'); });
            return res.json();
        })
        .then(data => {
            this.isFileUploaded = true;
            this.messages = [{
                id: Date.now(),
                type: 'system',
                content: `✅ "${file.name}" uploaded and processed! (${data.total_chunks} chunks indexed)\n\nYou can now ask questions about this document.`,
                timestamp: this.formatTime(new Date())
            }];
            this.render();
        })
        .catch(err => {
            this.uploadedFile = null;
            this.isFileUploaded = false;
            this.messages = [{
                id: Date.now(),
                type: 'error',
                content: `❌ Upload failed: ${err.message}`,
                timestamp: this.formatTime(new Date())
            }];
            this.render();
            event.target.value = '';
        });
    }

    sendMessage() {
        if (!this.inputMessage.trim() || this.isLoading || !this.isFileUploaded) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: this.inputMessage,
            timestamp: this.formatTime(new Date())
        };

        this.messages.push(userMessage);
        this.inputMessage = '';
        this.isLoading = true;
        this.render();
        this.scrollToBottom();

        // ✅ Relative URL — works on localhost AND Hugging Face Spaces
        fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: userMessage.content })
        })
        .then(res => {
            if (!res.ok) return res.json().then(d => { throw new Error(d.error || 'Server error'); });
            return res.json();
        })
        .then(data => {
            this.messages.push({
                id: Date.now() + 1,
                type: 'ai',
                content: data.answer || 'No answer returned.',
                timestamp: this.formatTime(new Date())
            });
            this.isLoading = false;
            this.render();
            this.scrollToBottom();
        })
        .catch(err => {
            this.messages.push({
                id: Date.now() + 1,
                type: 'error',
                content: `❌ ${err.message}`,
                timestamp: this.formatTime(new Date())
            });
            this.isLoading = false;
            this.render();
            this.scrollToBottom();
        });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    clearChat() {
        this.messages = [];
        this.uploadedFile = null;
        this.isFileUploaded = false;
        this.inputMessage = '';
        this.render();
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = document.getElementById('messages-container');
            if (container) container.scrollTop = container.scrollHeight;
        }, 50);
    }

    render() {
        const root = document.getElementById('root');
        if (!root) return;

        root.innerHTML = `
            <div class="app-container">
                <header class="header">
                    <div class="header-content">
                        <div class="logo-container">
                            <div class="logo-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14,2 14,8 20,8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                    <polyline points="10,9 9,9 8,9"/>
                                </svg>
                            </div>
                            <div>
                                <div class="logo-title">DocuMind</div>
                                <div class="logo-subtitle">AI Document Assistant</div>
                            </div>
                        </div>
                        <div class="header-actions">
                            ${this.isFileUploaded ? `
                                <div class="file-status">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20,6 9,17 4,12"/>
                                    </svg>
                                    ${this.uploadedFile}
                                </div>
                                <button class="clear-btn" title="Clear chat">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3,6 5,6 21,6"/>
                                        <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
                                        <path d="M10,11v6M14,11v6"/>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </header>

                <main class="main-content">
                    ${this.isFileUploaded ? this.renderChat() : this.renderUpload()}
                </main>
            </div>
        `;

        const input = document.getElementById('message-input');
        if (input) {
            input.value = this.inputMessage;
            input.focus();
        }

        this.scrollToBottom();
    }

    renderUpload() {
        return `
            <div class="upload-screen">
                <div class="upload-content">
                    <div class="upload-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17,8 12,3 7,8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </div>
                    <h1 class="upload-title">Upload a PDF</h1>
                    <p class="upload-subtitle">Upload any PDF document and start asking questions. The AI will read and understand your document.</p>
                    <label class="file-input-wrapper">
                        <input type="file" id="pdf-upload" class="file-input" accept=".pdf"/>
                        <div class="upload-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            Choose PDF File
                        </div>
                    </label>
                    <p class="upload-info">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        PDF files only
                    </p>
                </div>
            </div>
        `;
    }

    renderChat() {
        const messagesHtml = this.messages.map(msg => `
            <div class="message ${msg.type}">
                <div class="message-bubble">
                    <div class="message-content">${this.escapeHtml(msg.content)}</div>
                    <div class="message-meta">${msg.timestamp}</div>
                </div>
            </div>
        `).join('');

        const loadingHtml = this.isLoading ? `
            <div class="loading-message">
                <div class="message-bubble" style="background:white;border:1px solid #e5e7eb;">
                    <div class="loading-dots">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                </div>
            </div>
        ` : '';

        const emptyHtml = this.messages.length === 0 ? `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <h3 class="empty-title">Ready to answer your questions</h3>
                <p class="empty-subtitle">Ask anything about "${this.uploadedFile}"</p>
            </div>
        ` : '';

        return `
            <div class="chat-container">
                <div class="messages-container" id="messages-container">
                    ${emptyHtml}
                    ${messagesHtml}
                    ${loadingHtml}
                </div>
                <div class="input-area">
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea
                                id="message-input"
                                class="message-input"
                                placeholder="Ask a question about your document..."
                                rows="1"
                                ${this.isLoading ? 'disabled' : ''}
                            ></textarea>
                            <button id="send-btn" class="send-btn" ${!this.inputMessage.trim() || this.isLoading ? 'disabled' : ''}>
                                ${this.isLoading
                                    ? '<i class="fas fa-spinner fa-spin"></i>'
                                    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>'
                                }
                            </button>
                        </div>
                        <p class="input-hint">Press Enter to send · Shift+Enter for new line</p>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DocuMindApp();
});
