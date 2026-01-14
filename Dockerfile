# Gunakan image Node.js versi 18
FROM node:18

# Tentukan folder kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install semua dependensi
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

# Tentukan port yang digunakan aplikasi
EXPOSE 3000

CMD ["node", "app.js"]
