<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { onMounted, ref } from 'vue';
interface SSIDInfo {
  ID: number;
  SSID: string;
  RSSI: number;
}

const selectedSSID = ref<SSIDInfo | null>(null);
const SSIDList = ref<SSIDInfo[]>([]);

const feachSSIDList = async () => {
  const response = await fetch('http://' + window.location.host + '/api/getAPList');
  // const response = await fetch('http://192.168.0.10/api/getAPList');
  response.json().then(data => {
    SSIDList.value = data.APList;
  });
  // SSIDList.value = await response.json();
};

onMounted(() => {
  feachSSIDList();
});
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Choose Your Network" />
      <DataTable v-model:selection="selectedSSID" :value="SSIDList" selectionMode="single" dataKey="id" tableStyle="min-width: 50rem">
        <Column field="ID" header="ID"></Column>
        <Column field="SSID" header="SSID"></Column>
        <Column field="RSSI" header="dBm"></Column>
      </DataTable>
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
