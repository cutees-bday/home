# Protected Video Gallery

A responsive website with password protection for displaying two video files.

## Features

- 🔒 Password protection for secure access
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎥 Support for multiple video formats (MP4, WebM)
- 🎨 Modern, gradient-based UI design
- 🚪 Session-based authentication
- ⚡ Fast loading with video preloading
- 🛡️ Basic security features (disabled right-click, F12, etc.)

## Setup Instructions

1. **Add Your Videos**: Place your video files in the `video/` folder:
   - `video1.mp4` - First video
   - `video2.mp4` - Second video

2. **Change Password**: Edit the password in `script.js`:
   ```javascript
   const CORRECT_PASSWORD = "12345"; // Change this to your desired password
   ```

3. **Open the Website**: Open `index.html` in your web browser

## Default Password

The default password is: `12345`

## File Structure

```
bday/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── video/              # Video files folder
│   ├── README.md       # Video folder instructions
│   ├── video1.mp4      # First video (add your file)
│   └── video2.mp4      # Second video (add your file)
└── README.md           # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Security Features

- Password protection with session management
- Disabled right-click context menu
- Disabled common developer tool shortcuts
- Video download protection
- Session expires when browser is closed

## Customization

### Changing Video Titles and Descriptions

Edit the HTML in `index.html`:
```html
<div class="video-container">
    <h2>Your Video Title</h2>
    <video controls preload="metadata">
        <source src="video/your-video.mp4" type="video/mp4">
    </video>
    <p class="video-description">Your video description</p>
</div>
```

### Styling

Modify `styles.css` to change colors, fonts, and layout.

### Adding More Videos

1. Add more video containers in `index.html`
2. Place additional video files in the `video/` folder
3. Update the video sources in the HTML

## Troubleshooting

### Videos Not Loading
- Check that video files are in the `video/` folder
- Ensure video files are named correctly (`video1.mp4`, `video2.mp4`)
- Try different video formats (MP4 is most compatible)

### Password Not Working
- Check the password in `script.js`
- Ensure there are no extra spaces
- Password is case-sensitive

### Mobile Issues
- The site is responsive and should work on all devices
- If videos don't play on mobile, try different video formats

## License

This project is open source and available under the MIT License.