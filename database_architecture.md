# ApnaGhar: Database Connection Architecture

Bohot achha sawaal hai! MySQL Workbench aapki website se **direct connect nahi hota**. Iske peechhe ek "3-Tier Architecture" kaam karta hai jismein aapka Node.js backend ek **bridge (pul)** ki tarah kaam karta hai.

Chaliye main aapko iska poora flow samajhata hoon ki actual mein data kaise travel kar raha hai:

### 1. The Request (Frontend - React)
Jab koi naya user website (\`localhost:5173\`) par Signup form bharta hai aur "Signup" par click karta hai, toh React ek \`POST\` request bhejta hai aapke Node.js Backend API (\`http://localhost:5000/api/signup\`) ko.
*(React database ke baare mein kuch nahi jaanta, woh sirf API ko data bhejta hai).*

### 2. The Bridge (Backend - Node.js \`db.js\`)
Ab Node.js ko data database mein dalna hai. Iske liye humne aapki \`backend/db.js\` file banayi thi. Usme yeh code hai:
\`\`\`javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '23126',
    database: 'realestateDB',
});
\`\`\`
Yeh code kya karta hai? Yeh ek "Connection Pool" banata hai. Yeh theek waise hi behave karta hai jaise aap login karne ke liye apna username/password daalte hain. Node.js \`mysql2\` package ki madad se aapke background mein chal rahe MySQL Server (jo usually Port 3306 par chalta hai) ke paas jaata hai, password \`23126\` deta hai aur andar entry le leta hai.

### 3. Executing the Query (Backend - \`routes/auth.js\`)
Jab connection successfully ban jata hai, tab Node.js aapka SQL command chalaata hai:
\`\`\`javascript
// Data ko users table me insert karne ki query
await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', 
    [email, hashedPassword, userRole]);
\`\`\`
Ab yeh naya user permanently MySQL database ki Hard Drive (storage) mein save ho gaya hai.

### 4. Viewing the Data (MySQL Workbench)
Ab aate hain **MySQL Workbench** par. MySQL Workbench aapki website ya Node.js backend ka hissa **nahi** hai. 

Workbench sirf ek "Viewer" software hai. Woh bhi Node.js ki tarah MySQL Server ke paas jaata hai, username (\`root\`) aur password (\`23126\`) deta hai aur data padh leta hai.

**Summary in Short:**
\`Aapki Website (React) ---> Node.js API (Axios se) ---> Node.js MySQL me save karta hai (db.js se) ---> Data MySQL me save ho gaya.\`
\`MySQL Workbench ---> Seedha MySQL se connect hota hai (Data dekhne ke liye).\`

Yani Frontend aur Workbench kabhi ek doosre se baat nahi karte. Dono ka center point **MySQL Server** hai. Node.js usme likhne (Write) ka kaam kar raha hai aur Workbench usko padhne (Read/View) ka kaam kar raha hai.
