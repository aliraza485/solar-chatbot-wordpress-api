<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SunPeak Solar Support</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="topbar">
      <div class="container nav">
        <div class="brand">SunPeak Solar</div>
        <nav>
          <a href="#">Residential</a>
          <a href="#">Commercial</a>
          <a href="#">Battery Storage</a>
          <a href="#">Support</a>
        </nav>
      </div>
    </header>

    <main class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">Clean energy, simplified</span>
          <h1>Power your home with smarter solar support.</h1>
          <p>
            Ask about installation, maintenance, battery backups, financing, and customized solar quotes.
          </p>
          <div class="cta-row">
            <button class="primary-btn" onclick="document.getElementById('chat-panel').scrollIntoView({ behavior: 'smooth' })">
              Talk to a solar advisor
            </button>
            <button class="secondary-btn" onclick="openLeadForm()">Request a quote</button>
          </div>
        </div>

        <div class="hero-panel" id="chat-panel">
          <div class="chat-shell">
            <div class="chat-header">
              <div>
                <strong>Solar Support</strong>
                <small>AI assistant online</small>
              </div>
            </div>
            <div id="chat-messages" class="chat-messages">
              <div class="message bot">Hello! I can help with solar quotes, installation, batteries, financing, and support.</div>
            </div>
            <form id="chat-form" class="chat-form">
              <input id="chat-input" type="text" placeholder="Ask about solar panels..." />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </main>

    <section class="features container">
      <div class="feature-card">
        <h3>Custom Quotes</h3>
        <p>Get a detailed solar estimate based on your property and energy usage.</p>
      </div>
      <div class="feature-card">
        <h3>Battery Backup</h3>
        <p>Protect your home with resilient energy storage during outages.</p>
      </div>
      <div class="feature-card">
        <h3>Expert Support</h3>
        <p>From system design to service requests, our team is ready to help.</p>
      </div>
    </section>

    <section class="container tool-section">
      <div class="tool-box">
        <h2>Upload company PDFs to the vector knowledge base</h2>
        <p>Upload PDFs such as pricing sheets, installation guides, or warranty documents.</p>
        <form id="pdf-form" class="pdf-form">
          <input type="file" id="pdf-file" accept="application/pdf" required />
          <button type="submit" class="primary-btn">Upload PDF</button>
        </form>
        <div id="pdf-status" class="status-box">No file uploaded yet.</div>
      </div>
    </section>

    <section id="lead-form-section" class="lead-section hidden">
      <div class="container lead-box">
        <h2>Request a free solar consultation</h2>
        <form id="lead-form">
          <div class="form-row">
            <input type="text" name="name" placeholder="Your name" required />
            <input type="email" name="email" placeholder="Email address" required />
          </div>
          <div class="form-row">
            <input type="tel" name="phone" placeholder="Phone number" />
            <select name="service">
              <option value="solar_installation">Solar installation</option>
              <option value="battery_storage">Battery storage</option>
              <option value="maintenance">Maintenance</option>
              <option value="financing">Financing</option>
            </select>
          </div>
          <button type="submit" class="primary-btn">Submit request</button>
        </form>
      </div>
    </section>

    <script src="/chat-widget.js"></script>
    <script>
      const apiUrl = 'http://localhost:3000';

      window.SolarChat.init({
        apiUrl,
        companyName: 'SunPeak Solar',
        containerId: 'chat-panel',
        onReady: () => {
          const form = document.getElementById('chat-form');
          const input = document.getElementById('chat-input');
          const messages = document.getElementById('chat-messages');

          form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            addMessage('user', text, messages);
            input.value = '';

            try {
              const response = await fetch(`${apiUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, customerName: 'Visitor' })
              });

              const data = await response.json();
              addMessage('bot', data.reply || 'Thanks for contacting us.', messages);
            } catch (error) {
              addMessage('bot', 'Sorry, I could not reach the support service. Please try again.', messages);
            }
          });

          const leadForm = document.getElementById('lead-form');
          leadForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(leadForm);
            const payload = {
              name: formData.get('name'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              service: formData.get('service')
            };

            try {
              const response = await fetch(`${apiUrl}/api/lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              const result = await response.json();
              alert(result.message || 'Thank you for contacting us.');
              leadForm.reset();
            } catch (error) {
              alert('Unable to submit your request right now. Please try again later.');
            }
          });

          const pdfForm = document.getElementById('pdf-form');
          const pdfStatus = document.getElementById('pdf-status');
          pdfForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const fileInput = document.getElementById('pdf-file');
            const file = fileInput.files[0];

            if (!file) {
              pdfStatus.textContent = 'Please choose a PDF file first.';
              return;
            }

            const formData = new FormData();
            formData.append('file', file);

            pdfStatus.textContent = 'Uploading and indexing PDF...';

            try {
              const response = await fetch(`${apiUrl}/api/upload-pdf`, {
                method: 'POST',
                body: formData
              });

              const data = await response.json();
              if (response.ok) {
                pdfStatus.textContent = `${file.name} uploaded successfully. ${data.chunks} processing chunks added to the knowledge base.`;
              } else {
                pdfStatus.textContent = data.message || 'Failed to upload PDF.';
              }
            } catch (error) {
              pdfStatus.textContent = 'Upload failed. Please verify Pinecone and OpenAI settings.';
            }
          });
        }
      });

      function addMessage(role, text, messageContainer) {
        const message = document.createElement('div');
        message.className = `message ${role}`;
        message.textContent = text;
        messageContainer.appendChild(message);
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }

      function openLeadForm() {
        document.getElementById('lead-form-section').classList.remove('hidden');
        document.getElementById('lead-form-section').scrollIntoView({ behavior: 'smooth' });
      }
    </script>
  </body>
</html>
