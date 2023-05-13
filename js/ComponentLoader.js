


// componentLoader.js
async function fetchAndInsertComponent(identifier, componentName,callback) {
    try {
      const response = await fetch(componentName);
      const data = await response.text();
      document.getElementById(identifier).innerHTML = data;

      if (typeof callback === 'function') {
        callback();
      }
      

    } catch (error) {
      console.error(`Error fetching ${componentName}:`, error);
    }
  }

  function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
  }


