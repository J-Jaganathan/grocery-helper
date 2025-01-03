# Grocery Helper

Grocery Helper is a simple web application that allows users to add items to a shopping list and store them in a Firebase Realtime Database. This project demonstrates the integration of Firebase services with a basic HTML, CSS, and JavaScript application.

---

## Features

- Add items to a shopping list with a user-friendly interface.
- Automatically stores shopping list data in Firebase Realtime Database.
- Dynamically displays added items on the webpage.
- Responsive design for an improved user experience on various devices.

---

## Technologies Used

### Frontend:
- **HTML**: For the structure of the application.
- **CSS**: For styling the application.
- **JavaScript**: For dynamic functionality and Firebase integration.

### Backend:
- **Firebase Realtime Database**: To store and manage shopping list data.
- **NetLify Hosting**: To host the web application.

---

## Prerequisites

Before setting up the project, ensure you have the following:

1. A Google account to access Firebase.
2. Basic knowledge of HTML, CSS, and JavaScript.
3. A code editor like VS Code.
4. Installed Node.js for Firebase CLI (optional for hosting).

---

## Setup Instructions

### Step 1: Firebase Project Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `Grocery Helper`.
3. Add a Realtime Database to your project:
   - Click **Build > Realtime Database**.
   - Select your region and create the database.
   - Set database rules to public for development:
     ```json
     {
       "rules": {
         ".read": "true",
         ".write": "true"
       }
     }
     ```
4. Note your Firebase `databaseURL`.

### Step 2: Clone and Set Up the Project
1. Clone this repository or download the files.
2. Replace the `databaseURL` in the `app.js` file with your Firebase database URL.
3. Ensure the `index.html`, `app.js`, and `app.css` files are in the root directory.

### Step 3: Running the Application Locally
1. Set up a local server (e.g., use the Live Server extension in VS Code).
2. Open `index.html` in your browser.
3. Add items to your shopping list and see them stored in Firebase Realtime Database.

### Step 4: Deploying to Firebase Hosting (Optional)
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
4. Deploy your app:
   ```bash
   firebase deploy
   ```

---

## File Structure

```
.
├── index.html      # Main HTML file
├── app.js          # JavaScript for app logic and Firebase integration
├── app.css         # Styling for the application
├── assets/         # Images and other assets
├── site.webmanifest # For Deployment in Public
```

---

## Tutorial

<a href="https://www.youtube.com/watch?v=UFD4SP91tSM" target="_blank">
  <img src="https://img.youtube.com/vi/UFD4SP91tSM/0.jpg" alt="YouTube Tutorial Thumbnail">
</a>

Follow this Video: Firebase Tutorial for Beginners – Build a Mobile App with HTML, CSS, JavaScript to understand the project in depth.


---

## Troubleshooting

- **CORS Errors**: Use a local server to avoid `file://` restrictions.
- **Firebase Permission Errors**: Ensure your Realtime Database rules are properly configured.
- **Deployment Issues**: Verify your Firebase Hosting setup and ensure all files are in the correct directory.

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for feedback and suggestions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

Thanks to [this YouTube Channel](https://www.youtube.com/@freecodecamp) for providing guidance on Firebase project integration.

---

## Preview of my app

Click into this link to know how the final website looks like

https://groceryhelperteam8.netlify.app/

---

