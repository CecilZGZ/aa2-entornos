<script setup>
import { ref, onMounted } from 'vue';

const videogames = ref([]);
const platforms = ref([]);
const errorMessage = ref('');

const newGame = ref({
  title: '',
  genre: '',
  release_year: '',
  platform_id: ''
});

const newPlatform = ref({
  name: '',
  company: ''
});

const editingId = ref(null);
const editingPlatformId = ref(null);

const fetchVideogames = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/videogames');
    videogames.value = await response.json();
  } catch (error) {
    errorMessage.value = 'Error connecting to server.';
  }
};

const fetchPlatforms = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/platforms');
    platforms.value = await response.json();
  } catch (error) {
    console.error('There was an error loading the platforms:', error); 
  }
};

const getPlatformName = (id) => {
  const platform = platforms.value.find(p => p.id === id);
  return platform ? platform.name : 'N/A';
}

const addVideogame = async () => {
  try {
    const response = await fetch ('http://localhost:3000/api/videogames', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGame.value)
    });

    if (response.ok) {
      fetchVideogames();
      newGame.value = { title: '', genre: '', release_year: '', platform_id: '' };
    } else {
      const errorData = await response.json();
      alert('Error while validating. One or more fields could have invalid data.');
      console.log(errorData);
    }
  } catch (error) {
    console.error('Error while saving:', error);
  }
};

const addPlatform = async () => {
  try {
    const response = await fetch ('http://localhost:3000/api/platforms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlatform.value)
    });

    if (response.ok) {
      fetchPlatforms();
      newPlatform.value = { name: '', company: '' };
    } else {
      const errorData = await response.json();
      alert('Error while validating. One or more fields could have invalid data.');
      console.log(errorData);
    }
  } catch (error) {
    console.error('Error while saving:', error);
  }
};

const updateVideogame = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/videogames/${editingId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newGame.value)
    });

    if (response.ok) {
      fetchVideogames();
      cancelEdit();
    } else {
      console.error('There was an error while updating the game.');
    }
  } catch (error) {
    console.error('Error in update', error);
  }
};

const updatePlatform = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/platforms/${editingPlatformId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPlatform.value)
    });

    if (response.ok) {
      fetchPlatforms();
      cancelEditPlatform();
      fetchVideogames();
    } else {
      console.error('There was an error while updating the platform.');
    }
  } catch (error) {
    console.error('Error in update', error);
  }
};

const handleFormSubmit = () => {
  if (editingId.value !== null) {
    updateVideogame();
  } else {
    addVideogame();
  }
};

const handlePlatformSubmit = () => {
  if (editingPlatformId.value !== null) { updatePlatform(); } else { addPlatform(); }
};

const deleteVideogame = async (id) => {
  if (!confirm('Are you sure you want to delete this game from the database?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/videogames/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      fetchVideogames();
    }
  } catch (error) {
    console.error('There was an error while deleting.');
  }
};

const deletePlatform = async (id) => {
  if (!confirm('Are you sure you want to delete this platform? Games associated with it may lose their platform data.')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/platforms/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchPlatforms();
      fetchVideogames(); // Refresca los juegos para mostrar 'N/A' en los huérfanos
    }
  } catch (error) { console.error(error); }
};

const editVideogame = (game) => {
  newGame.value = {
    title: game.title,
    genre: game.genre,
    release_year: game.release_year,
    platform_id: game.platform_id
  };

  editingId.value = game.id;
};

const editPlatform = (plat) => {
  newPlatform.value = { name: plat.name, company: plat.company };
  editingPlatformId.value = plat.id;
};

const cancelEdit = () => {
  newGame.value = { title: '', genre: '', release_year: '', platform_id: ''};
  editingId.value = null;
};

const cancelEditPlatform = () => {
  newPlatform.value = { name: '', company: '' };
  editingPlatformId.value = null;
};

onMounted(() => {
    fetchVideogames();
    fetchPlatforms();
});
</script>

<template>
  <main>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <h1>Videogame Manager</h1>
    
    <section class="form-section">
      <h2>{{ editingId ? 'Edit game' : 'Add new game' }}</h2>
      <form @submit.prevent="handleFormSubmit">
        <div>
          <label>Title:</label>
          <input type="text" v-model="newGame.title" required>
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" v-model="newGame.genre">
        </div>
        <div>
          <label>Release Year:</label>
          <input type="number" v-model="newGame.release_year">
        </div>
        <div>
          <label>Platform:</label>
          <select v-model.number="newGame.platform_id" required>
            <option value="" disabled>Select a platform</option>
            <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
              {{ platform.name }}
            </option>
          </select>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" class="btn-add" style="flex-grow: 1;">
            {{ editingId ? 'Update game' : 'Save game' }}
          </button>
          <button v-if="editingId" type="button" @click="cancelEdit" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </section>

    <section class="list-section">
      <h2>Current Catalogue</h2>
      <ul v-if="videogames.length > 0">
        <li v-for="game in videogames" :key="game.id" class="list-item">
          <div class="info">
            <strong>{{ game.title }}</strong> ({{ game.release_year }})<br>
            <small>Genre: {{ game.genre }} | Platform: {{ getPlatformName(game.platform_id) }}</small>
          </div>
          <div>
            <button @click="editVideogame(game)" class="btn-edit">Edit</button>
            <button @click="deleteVideogame(game.id)" class="btn-delete">Delete</button>
          </div>
        </li>
      </ul>
      <p v-else>Empty Catalogue</p>
    </section>

    <hr class="separator">

    <h1>Platform Manager</h1>
    
    <section class="form-section platform-theme">
      <h2>{{ editingPlatformId ? 'Edit platform' : 'Add new platform' }}</h2>
      <form @submit.prevent="handlePlatformSubmit">
        <div>
          <label>Name:</label>
          <input type="text" v-model="newPlatform.name" placeholder="e.g. PC, PS5..." required>
        </div>
        <div>
          <label>Company:</label>
          <input type="text" v-model="newPlatform.company" placeholder="e.g. Sony, Microsoft...">
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" class="btn-add platform-btn" style="flex-grow: 1;">
            {{ editingPlatformId ? 'Update platform' : 'Save platform' }}
          </button>
          <button v-if="editingPlatformId" type="button" @click="cancelEditPlatform" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </section>

    <section class="list-section">
      <h2>Registered Platforms</h2>
      <ul v-if="platforms.length > 0">
        <li v-for="plat in platforms" :key="plat.id" class="list-item">
          <div class="info">
            <strong>{{ plat.name }}</strong><br>
            <small>Company: {{ plat.company }}</small>
          </div>
          <div>
            <button @click="editPlatform(plat)" class="btn-edit">Edit</button>
            <button @click="deletePlatform(plat.id)" class="btn-delete">Delete</button>
          </div>
        </li>
      </ul>
      <p v-else>No platforms registered.</p>
    </section>

  </main>
</template>

<style scoped>
main { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
.error { color: red; font-weight: bold; }
.form-section { background: #f9f9f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #ddd; }
.platform-theme { background: #f0f8ff; border-color: #cce5ff; }
.form-section div {margin-bottom: 1rem; }
.form-section label {display: block; margin-bottom: 0.3rem; font-weight: bold; }
.form-section input, .form-section select { width: 100%; padding: 0.5rem; box-sizing: border-box; }
.btn-add { background: #28a745; color: white; padding: 0.7rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-add:hover { background: #218838; }
.platform-btn { background: #007bff; }
.platform-btn:hover { background: #0056b3; }
.btn-cancel { background: gray; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold; }
ul { list-style-type: none; padding: 0; }
.list-item { background-color: #fff; border: 1px solid #ccc; margin-bottom: 0.5rem; padding: 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
.info { display: flex; flex-direction: column; }
.btn-edit { background: #ffc107; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: bold;}
.btn-edit:hover { background: #e0a800; }
.btn-delete { background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;}
.btn-delete:hover { background: #c82333; }
.separator { margin: 3rem 0; border: 0; border-top: 2px dashed #ccc; }
</style>