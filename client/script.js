document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authSection = document.getElementById('auth-section');
  const fileSection = document.getElementById('file-section');
  const usernameDisplay = document.getElementById('username-display');
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout-btn');
  const fileList = document.getElementById('fileList');

  // Переключение между формами регистрации и входа
  document.getElementById('show-register-form').addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('auth-title').innerText = 'Register';
  });

  document.getElementById('show-login-form').addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('auth-title').innerText = 'Login';
  });

  // Вход пользователя
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        usernameDisplay.innerText = username;
        authSection.style.display = 'none';
        fileSection.style.display = 'block';
        userInfo.style.display = 'flex';
        loadFiles();
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  });

  // Регистрация пользователя
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        alert('Registration successful! Please login.');
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        document.getElementById('auth-title').innerText = 'Login';
      } else {
        alert('Registration failed!');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  });

  // Логаут пользователя
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      authSection.style.display = 'block';
      fileSection.style.display = 'none';
      userInfo.style.display = 'none';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  });

  // Загрузка файлов
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length === 0) {
      alert('Please select a file');
      return;
    }

    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('File uploaded successfully');
        loadFiles();
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  });

  // Загрузка списка файлов
  async function loadFiles() {
    try {
      const response = await fetch('/api/files');
      const files = await response.json();

      fileList.innerHTML = '';
      files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        listItem.innerHTML = `
          ${file}
          <div>
            <a href="/api/files/download/${file}" class="btn btn-primary btn-sm mr-2">Download</a>
            <button class="btn btn-danger btn-sm" onclick="deleteFile('${file}')">Delete</button>
          </div>
        `;
        fileList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  // Удаление файла
  window.deleteFile = async function (filename) {
    try {
      const response = await fetch(`/api/files/${filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('File deleted successfully');
        loadFiles();
      } else {
        alert('File deletion failed');
      }
    } catch (error) {
      console.error('Error during file deletion:', error);
    }
  }
});

/*document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Login successful');
      // Загружаем файлы после успешного входа
      loadFiles();
    } else {
      alert('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
});

// Функция для загрузки файлов (после успешного входа)
async function loadFiles() {
  try {
    const response = await fetch('/api/files');
    const files = await response.json();

    // Логика отображения файлов
  } catch (error) {
    if (error.status === 401) {
      alert('Please log in');
    } else {
      console.error('Error fetching files:', error);
    }
  }
}
*/

/*document.getElementById('uploadForm').addEventListener('submit', async (e) => {
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
  */