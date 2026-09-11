import express from 'express'
import path from 'path'
import fs from 'fs';

function generateIndex(folderPath: string) {
  const files = fs.readdirSync(folderPath).filter(f => f !== 'index.html');

  const html = `<!DOCTYPE html>
<html>
<head><title>Stickers</title></head>
<body>
  <h1>Stickers</h1>
  <ul>
    ${files.map(f => `<li><a href="${encodeURIComponent(f)}">${f}</a></li>`).join('\n    ')}
  </ul>
</body>
</html>`;

  fs.writeFileSync(path.join(folderPath, 'index.html'), html);
}


const app = express()

const externalPath = path.resolve("E:/mv/ix/whatsapp/nika/stickers/");
console.log(externalPath)
app.use('/static', express.static(externalPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/static/', (req, res, next) => {
  generateIndex(externalPath);
  next();
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});