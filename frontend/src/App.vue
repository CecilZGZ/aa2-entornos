<script setup>
import { ref, onMounted } from 'vue';

const errorMessage = ref('');

const videogames = ref([]);
const newGame = ref({ title: '', genre: '', release_year: '', platform_id: '', store_id: '', image: null });
const editingId = ref(null);

const platforms = ref([]);
const newPlatform = ref({ name: '', company: '' });
const editingPlatformId = ref(null);

const stores = ref([]);
const newStore = ref({ name: '', format: '' });
const editingStoreId = ref(null);

const fetchVideogames = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/videogames');
    videogames.value = await response.json();
  } catch (error) { errorMessage.value = 'Error connecting to server.'; }
};

const getPlatformName = (id) => {
  const platform = platforms.value.find(p => p.id === id);
  return platform ? platform.name : 'N/A';
};

const getStoreName = (id) => {
  const store = stores.value.find(s => s.id === id);
  return store ? `${store.name} (${store.format})` : 'N/A';
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    newGame.value.image = e.target.result;
  };
  reader.readAsDataURL(file);
};

const addVideogame = async () => {
  try {
    const response = await fetch ('http://localhost:3000/api/videogames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame.value)
    });
    if (response.ok) {
      fetchVideogames();
      newGame.value = { title: '', genre: '', release_year: '', platform_id: '', store_id: '', image: null };
    } else {
      alert('Error while validating game data.');
    }
  } catch (error) { console.error(error); }
};

const updateVideogame = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/videogames/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame.value)
    });
    if (response.ok) {
      fetchVideogames();
      cancelEdit();
    }
  } catch (error) { console.error(error); }
};

const handleFormSubmit = () => {
  if (editingId.value !== null) { updateVideogame(); } else { addVideogame(); }
};

const deleteVideogame = async (id) => {
  if (!confirm('Are you sure you want to delete this game?')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/videogames/${id}`, { method: 'DELETE' });
    if (response.ok) fetchVideogames();
  } catch (error) { console.error(error); }
};

const editVideogame = (game) => {
  newGame.value = { 
    title: game.title, 
    genre: game.genre, 
    release_year: game.release_year, 
    platform_id: game.platform_id,
    store_id: game.store_id || '',
    image: game.image || null
  };
  editingId.value = game.id;
};

const cancelEdit = () => {
  newGame.value = { title: '', genre: '', release_year: '', platform_id: '', store_id: '', image: null };
  editingId.value = null;
};

const fetchPlatforms = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/platforms');
    platforms.value = await response.json();
  } catch (error) { console.error(error); }
};

const addPlatform = async () => {
  try {
    const response = await fetch ('http://localhost:3000/api/platforms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlatform.value)
    });
    if (response.ok) {
      fetchPlatforms();
      newPlatform.value = { name: '', company: '' };
    } else { alert('Error while validating platform data.'); }
  } catch (error) { console.error(error); }
};

const updatePlatform = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/platforms/${editingPlatformId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlatform.value)
    });
    if (response.ok) {
      fetchPlatforms();
      cancelEditPlatform();
      fetchVideogames(); 
    }
  } catch (error) { console.error(error); }
};

const handlePlatformSubmit = () => {
  if (editingPlatformId.value !== null) { updatePlatform(); } else { addPlatform(); }
};

const deletePlatform = async (id) => {
  if (!confirm('Are you sure you want to delete this platform?')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/platforms/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchPlatforms();
      fetchVideogames(); 
    }
  } catch (error) { console.error(error); }
};

const editPlatform = (plat) => {
  newPlatform.value = { name: plat.name, company: plat.company };
  editingPlatformId.value = plat.id;
};

const cancelEditPlatform = () => {
  newPlatform.value = { name: '', company: '' };
  editingPlatformId.value = null;
};

const fetchStores = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/stores');
    stores.value = await response.json();
  } catch (error) { console.error(error); }
};

const addStore = async () => {
  try {
    const response = await fetch ('http://localhost:3000/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStore.value)
    });
    if (response.ok) {
      fetchStores();
      newStore.value = { name: '', format: '' };
    } else { alert('Error validating store data.'); }
  } catch (error) { console.error(error); }
};

const updateStore = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/stores/${editingStoreId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStore.value)
    });
    if (response.ok) {
      fetchStores();
      cancelEditStore();
      fetchVideogames(); 
    }
  } catch (error) { console.error(error); }
};

const handleStoreSubmit = () => {
  if (editingStoreId.value !== null) { updateStore(); } else { addStore(); }
};

const deleteStore = async (id) => {
  if (!confirm('Are you sure you want to delete this store?')) return;
  try {
    const response = await fetch(`http://localhost:3000/api/stores/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchStores();
      fetchVideogames(); 
    }
  } catch (error) { console.error(error); }
};

const editStore = (store) => {
  newStore.value = { name: store.name, format: store.format };
  editingStoreId.value = store.id;
};

const cancelEditStore = () => {
  newStore.value = { name: '', format: '' };
  editingStoreId.value = null;
};

onMounted(() => {
    fetchVideogames();
    fetchPlatforms();
    fetchStores();
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

        <div>
          <label>Store / Format:</label>
          <select v-model.number="newGame.store_id">
            <option value="" disabled>Select a store</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }} ({{ store.format }})
            </option>
          </select>
        </div>

        <div>
          <label>Cover Image:</label>
          <input type="file" @change="handleImageUpload" accept="image/*">
          <div v-if="newGame.image" style="margin-top: 10px;">
            <img :src="newGame.image" style="height: 100px; border-radius: 4px; border: 1px solid #ccc;">
          </div>
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
          
          <div style="display: flex; gap: 15px; align-items: center;">
            <img v-if="game.image" :src="game.image" style="width: 60px; height: 80px; object-fit: cover; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <div style="width: 60px; height: 80px; background: #eee; display: flex; align-items: center; justify-content: center; border-radius: 4px; color: #aaa;" v-else>No Img</div>
            
            <div class="info">
              <strong>{{ game.title }}</strong> ({{ game.release_year }})<br>
              <small>Genre: {{ game.genre }} | Platform: {{ getPlatformName(game.platform_id) }} | Store: {{ getStoreName(game.store_id) }}</small>
            </div>
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

    <hr class="separator">

    <h1>Store Manager</h1>
    
    <section class="form-section store-theme">
      <h2>{{ editingStoreId ? 'Edit store' : 'Add new store' }}</h2>
      <form @submit.prevent="handleStoreSubmit">
        <div>
          <label>Store Name:</label>
          <input type="text" v-model="newStore.name" placeholder="e.g. Steam, GAME, Wallapop..." required>
        </div>
        <div>
          <label>Format:</label>
          <input type="text" v-model="newStore.format" placeholder="e.g. Digital, Physical..." required>
        </div>
        <div style="display: flex; gap: 10px;">
          <button type="submit" class="btn-add store-btn" style="flex-grow: 1;">
            {{ editingStoreId ? 'Update store' : 'Save store' }}
          </button>
          <button v-if="editingStoreId" type="button" @click="cancelEditStore" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </section>

    <section class="list-section">
      <h2>Registered Stores</h2>
      <ul v-if="stores.length > 0">
        <li v-for="store in stores" :key="store.id" class="list-item">
          <div class="info">
            <strong>{{ store.name }}</strong><br>
            <small>Format: {{ store.format }}</small>
          </div>
          <div>
            <button @click="editStore(store)" class="btn-edit">Edit</button>
            <button @click="deleteStore(store.id)" class="btn-delete">Delete</button>
          </div>
        </li>
      </ul>
      <p v-else>No stores registered.</p>
    </section>

  </main>
</template>

<style scoped>

main { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
ul { list-style: none; padding: 0; }
.error { color: red; font-weight: bold; }
.separator { margin: 3rem 0; border: 0; border-top: 2px dashed #ccc; }
.info { display: flex; flex-direction: column; }

.form-section { padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px solid #ddd; background: #f9f9f9; }
.platform-theme { background: #f0f8ff; border-color: #cce5ff; }
.store-theme { background: #fdf5e6; border-color: #ffe4b5; }
.form-section div { margin-bottom: 1rem; }
.form-section label { display: block; margin-bottom: 0.3rem; font-weight: bold; }
.form-section input, .form-section select { width: 100%; padding: 0.5rem; box-sizing: border-box; }
.list-item { background: #fff; border: 1px solid #ccc; margin-bottom: 0.5rem; padding: 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }

button { border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white; padding: 0.5rem 1rem; }

.btn-add { background: #28a745; padding: 0.7rem 1.5rem; }
.btn-add:hover { background: #218838; }
.platform-btn { background: #007bff; }
.platform-btn:hover { background: #0056b3; }
.store-btn { background: #d2691e; }
.store-btn:hover { background: #a0522d; }
.btn-cancel { background: gray; }
.btn-edit { background: #ffc107; color: black; margin-right: 5px; }
.btn-edit:hover { background: #e0a800; }
.btn-delete { background: #dc3545; }
.btn-delete:hover { background: #c82333; }
</style>