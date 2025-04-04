<template>
<div class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-4" max-width="400">
        <v-card-title class="text-h5">Windows</v-card-title>
        <v-card-text>
            <v-img src="@/assets/windowsLogo.png" alt="Windows Image" class="mb-4"></v-img>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" block @click="downloadWindows()">Download</v-btn>
        </v-card-actions>
    </v-card>
</div>
</template>

<script>
export default {
    methods: {
        downloadWindows() {
            console.log("Downloading Windows");
            window.location.href = `${import.meta.env.VITE_BACK_URL}/DownloadWindows`;
        }
    }
};
</script>