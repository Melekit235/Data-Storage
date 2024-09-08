document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      alert(result.message);
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  });
  
  async function loadFiles() {
    try {
      const response = await fetch('/api/files');
      const files = await response.json();
  
      const fileList = document.getElementById('fileList');
      fileList.innerHTML = '';
      files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file;
        
        const downloadLink = document.createElement('a');
        downloadLink.href = `/api/files/download/${file}`;
        downloadLink.textContent = 'Download';
        downloadLink.className = 'btn btn-info btn-sm'; // Добавление стилей Bootstrap
        downloadLink.target = '_blank'; // Открывать в новой вкладке

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm'; // Добавление стилей Bootstrap
        deleteButton.addEventListener('click', () => deleteFile(file));

        li.appendChild(downloadLink);
        li.appendChild(deleteButton);
        fileList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }
  
  async function deleteFile(filename) {
    try {
      const response = await fetch(`/api/files/${filename}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      alert(result.message);
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  // Загрузка списка файлов при загрузке страницы
  loadFiles();
  