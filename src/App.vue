<script setup lang="ts">
declare let auth0: any
import HelloWorld from './components/HelloWorld.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { onMounted, ref } from 'vue'

const debug = true
const host = 'johnson-iot-device.local'

interface SSIDInfo {
  ID: number
  SSID: string
  RSSI: number
}

const webAuth = new auth0.WebAuth({
  domain: 'dev-5dn0170ujcob41ub.us.auth0.com',
  clientID: 'Oo1iX5plkrAMgbPp7JUoWL65G8fLslAH',
  redirectUri: debug ? 'http://localhost:5173' : 'https://johnson-iot-device.local',
  responseType: 'token',
  // responseMode: 'form_post',
  scope: 'openid profile email',
})

const selectedSSID = ref<SSIDInfo | null>(null)
const SSIDList = ref<SSIDInfo[]>([])

const feachSSIDList = async () => {
  let response
  if (debug) {
    response = await fetch('http://' + host + '/api/getAPList')
  } else {
    response = await fetch('https://' + window.location.host + '/api/getAPList')
  }
  response.json().then((data) => {
    SSIDList.value = data.APList
  })
}

const handleLogin = () => {
  // Use window.auth0 api for authentication
  // we cannot use auth0-vue becuase it need to run on a server with https
  webAuth.authorize({
    connection: 'google-oauth2',
  })
}

const raw_token = window.location.href.split('#access_token=')
if (raw_token.length == 2) {
  webAuth.client.userInfo(raw_token[1]?.split('&scope=')[0], (err: any, user: any) => {
    if (err) {
      console.log(err)
      return
    }
    fetch('http://' + host + '/api/setUserInfo', {
      method: 'POST',
      body: user,
    }).then((response) => {
      console.log('User info sent to device', response)
      window.location.href = debug ? 'http://localhost:5173' : 'https://johnson-iot-device.local'
    })
  })
}

onMounted(() => {
  feachSSIDList()
})
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Choose Your Network" />
      <DataTable
        v-model:selection="selectedSSID"
        :value="SSIDList"
        selectionMode="single"
        dataKey="id"
        tableStyle="min-width: 50rem"
      >
        <Column field="ID" header="ID"></Column>
        <Column field="SSID" header="SSID"></Column>
        <Column field="RSSI" header="dBm"></Column>
      </DataTable>
      <button @click="handleLogin" class="button login">Login by Google</button>
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
