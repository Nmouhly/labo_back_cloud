import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'drcabf7f8',   // Remplacez par votre nom de Cloud
  api_key: '873569563376372',           // Remplacez par votre clé API
  api_secret: 'RlJkgQMsZmzRX138bDHjUkLIF4g'      // Remplacez par votre clé secrète
});

export default cloudinary;