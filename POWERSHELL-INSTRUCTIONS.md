# PowerShell Instructions for VBC Web

## Running the Server in PowerShell

Since PowerShell doesn't support the `&&` operator like Bash does, you need to run commands separately:

```powershell
# First navigate to the root directory
cd ..

# Then run the server
node server.js
```

Alternatively, you can use a single line with semicolons:

```powershell
cd ..; node server.js
```

## Image Upload Issues

If you're having trouble with image uploads:

1. Make sure the server is running correctly using the PowerShell commands above
2. Ensure you're logged in with the correct admin credentials
3. Check the browser console for any specific error messages

### For Leader Images

The leader form includes an image upload button. The fixes for leader image uploads include:
- Added proper FormData handling in the upload function
- Added category specification for uploaded images
- Improved error handling to better diagnose issues
- Fixed Content-Type header handling for multipart form data

### For Event Images

For event images:
1. First upload them via the Media Library (Admin → Media tab)
2. Copy the URL of the uploaded image
3. Paste the URL into the "Image URL" field in the event form

## Working with Images in the CMS

1. **Media Library**: Use Admin → Media tab to upload and manage all images
2. **Events**: Use the "Image URL" field to paste URLs from the Media Library
3. **Leaders**: Use the image upload button in the leader form

## Troubleshooting

If uploads still fail:
- Check server logs for any errors
- Verify that all required directories exist (uploads, assets, etc.)
- Make sure your auth token is valid (try logging out and back in)
- Check that the image file size is under 5MB
- Verify you're using a supported file format (JPG, PNG, GIF)
- If using a proxy or firewall, ensure it's not blocking the upload requests 