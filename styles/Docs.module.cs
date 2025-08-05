.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.banner {
  height: 200px;
  width: 100%;
  margin-top: 2rem;
  border-radius: 12px;
  background-image: url('/banner.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.bannerOverlay {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    border-radius: 12px;
    background: linear-gradient(45deg, rgba(83, 8, 218, 0.2), rgba(218, 8, 142, 0.2));
    background-blend-mode: hard-light;
}

.main {
  padding: 2.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.apiSection {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease-in-out;
}

.apiSection:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.sectionTitle {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.form {
  display: grid;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.form label {
  font-size: 0.85rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.4rem;
}

.form input, .form select {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: var(--bg);
}

.form button {
  padding: 0.7rem 1.5rem;
  background-color: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-self: start;
}

.form button:hover {
  background-color: #333;
}

.form button:disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
}

.resultContainer {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

.resultBox {
    display: flex;
    flex-direction: column;
}

.resultHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    font-weight: 500;
}

.copyButton {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
}

.copyButton:hover {
    border-color: #999;
}

.codeBlock {
  background-color: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  word-wrap: break-word;
}

.responseBlock {
    min-height: 150px;
    overflow: auto;
    display: flex;
    flex-direction: column;
}

.responseBlock pre {
    white-space: pre-wrap;
}

.placeholder {
    margin: auto;
    color: var(--secondary-text);
    font-size: 0.9rem;
}

.responseImage {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 6px;
    margin: auto;
}

.code200 { color: #28a745; }
.code400, .code405 { color: #fd7e14; }
.code500 { color: #dc3545; }
