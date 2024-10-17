import axios from 'axios';

   const apiClient = axios.create({
     baseURL: '/api', // This will use the proxy we set up in vite.config.ts
     headers: {
       'Content-Type': 'application/json',
     },
   });

   export default apiClient;