<template>
  <div>
    <h1 class="white-title">Profile</h1>
    <form class="profile-form" @submit.prevent="updateProfile">
      <div class="profile-picture">
        <img :src="previewUrl || userData.picture" alt="Profile Picture">
        <input type="file" @change="handleFileUpload" accept="image/*">
        <button type="button" @click="confirmPictureUpload" v-if="newPicture">Confirm</button>
        <button type="button" @click="cancelPictureUpload" v-if="newPicture">Cancel</button>
      </div>
      <div class="profile-info">
        <label>Name</label>
        <input type="text" v-model="userData.name">
        <label>Surname</label>
        <input type="text" v-model="userData.surname">
        <label>Email</label>
        <input type="text" v-model="userData.email">
        <input class="submit" type="submit" value="Save" />
      </div>
    </form>
    <div class="profile-buttons">
      <button @click="toggleModal">Delete account</button>
      <DeleteModal v-if="showModal" @close="toggleModal" />
      <button @click="redirectToPasswordChange">Change password</button>
    </div>
    <h1 v-if="showSuccessMessage">Profile updated successfully!</h1>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import useUserData from '../composables/useUserData';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import DeleteModal from '../components/DeleteModal.vue';

export default {
  name: 'Profile',
  components: {
    DeleteModal,
  },
  setup() {
    const { userData, fetchUserData } = useUserData();
    const store = useStore();
    const showSuccessMessage = ref(false);
    const newPicture = ref(null);
    const previewUrl = ref('');

    const handleFileUpload = event => {
      const file = event.target.files[0];
      newPicture.value = file;
      previewUrl.value = URL.createObjectURL(file);
    };

    const confirmPictureUpload = async () => {
      console.log('confirmPictureUpload triggered');
      const formData = new FormData();
      formData.append('picture', newPicture.value);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.VUE_APP_API_URL + "/uploadProfilePicture", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Profile picture upload failed!");
        }
        userData.picture = data.path;
        newPicture.value = null;
        previewUrl.value = '';
      
        await fetchUserData();
      } catch (error) {
        console.error("Profile picture upload error:", error);
      }
    };


    const cancelPictureUpload = () => {
      newPicture.value = null;
      previewUrl.value = '';
    };

    const updateProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(process.env.VUE_APP_API_URL + "/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(userData.value)
        });
        if (!response.ok) {
          throw new Error("Profile update failed!");
        }
        
        showSuccessMessage.value = true;
        
        setTimeout(() => {
          showSuccessMessage.value = false;
        }, 3000);
      } catch (error) {
        console.error("Profile update error:", error);
      }
    };
    const router = useRouter();
    const redirectToPasswordChange = () => {
      router.push('/password-change');
    };

    const showModal = ref(false); 

    const toggleModal = () => {
      showModal.value = !showModal.value;
    };

    onMounted(fetchUserData);
    return {
      userData,
      updateProfile,
      showSuccessMessage,
      redirectToPasswordChange,
      newPicture,
      previewUrl,
      handleFileUpload,
      confirmPictureUpload,
      cancelPictureUpload,
      showModal,
      toggleModal
    };
  }
}
</script>


<style scoped>
form {
max-width: 720px;
margin: 30px auto;
background: white;
text-align: left;
padding: 40px;
border-radius: 10px;
}
label {
color: #aaa;
display: inline-block;
margin: 25px 0 15px;
font-size: 0.6em;
text-transform: uppercase;
letter-spacing: 1px;
font-weight: bold;
}
input, select {
display: block;
padding: 10px 6px;
width: 100%;
box-sizing: border-box;
border: none;
border-bottom: 1px solid #ddd;
color: #555;
}

.profile-form {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-picture {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.profile-picture input {
  padding: 50px;
}

.profile-picture img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-info label {
  margin-top: 10px;
}

.submit {
  margin-top: 20px;
  border-radius: 10px;
  color: #ecf0f1;
}

.link {
  background-color: #e74c3c;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.link:hover {
    background-color: #c0392b;
}

.link-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.profile-picture,
.profile-info {
  flex: 1;
}

.profile-buttons button:nth-child(1) {
  margin-right: 15px;
}

.profile-buttons button {
  background-color: #2c3e50;
  color: #ecf0f1;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 20px;
  font-weight: bold;
}


</style>