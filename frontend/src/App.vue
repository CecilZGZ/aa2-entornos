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

const editingId = ref(null);

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

const handleFormSubmit = () => {
  if (editingId.value !== null) {
    updateVideogame();
  } else {
    addVideogame();
  }
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

const editVideogame = (game) => {
  newGame.value = {
    title: game.title,
    genre: game.genre,
    release_year: game.release_year,
    platform_id: game.platform_id
  };

  editingId.value = game.id;
};

const cancelEdit = () => {
  newGame.value = { title: '', genre: '', release_year: '', platform_id: ''};
  editingId.value = null;
};

onMounted(() => {
    fetchVideogames();
    fetchPlatforms();
});
</script>

<template>
  <main>
    <h1>Videogame Manager</h1>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <section class="form-section">
      <h2>Add new game</h2>
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
          
          <button v-if="editingId" type="button" @click="cancelEdit" style="background: gray; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer;">
            Cancel
          </button>
        </div>
      </form>
    </section>

    <section class="list-section">
      <h2>Current Catalogue</h2>
      <ul v-if="videogames.length > 0">
        <li v-for="game in videogames" :key="game.id" class="game-item">
          <div class="game-info">
            <strong>{{ game.title }}</strong> ({{ game.release_year }})
            <br>
            <small>Genre: {{ game.genre }} | Platform: {{ getPlatformName(game.platform_id) }}</small>
          </div>
          <button @click="editVideogame(game)" style="background: #ffc107; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-right: 5px;">Edit</button>
          <button @click="deleteVideogame(game.id)" class="btn-delete">Delete</button>
        </li>
      </ul>
      <p v-else>Empty Catalogue</p>
    </section>
  </main>
</template>

<style scoped>
main {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.error { color: red; font-weight: bold; }
.form-section {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #ddd;
}

.form-section div {margin-bottom: 1rem; }
.form-section label {display: block; margin-bottom: 0.3rem; font-weight: bold; }
.form-section input, .form-section select {
  width: 100%; padding: 0.5rem; box-sizing: border-box;
}
.btn-add {
  background: #28a745; color: white; padding: 0.7rem 1.5rem;
  border: none; border-radius: 4px; cursor: pointer; font-weight: bold;
}
.btn-add:hover {background: #218838; }
ul {list-style-type: none; padding: 0; }
.game-item {
  background-color: #fff; border: 1px solid #ccc; margin-bottom: 0.5rem;
  padding: 1rem; border-radius: 4px; display: flex;
  justify-content: space-between; align-items: center;
}
.btn-delete {
  background: #dc3545; color: white; border: none; padding: 0.5rem 1rem;
  border-radius: 4px; cursor: pointer;
}
.btn-delete:hover { background: #c82333; }
</style>
