<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Deployment Instructions:

**_Google AI Studio to GitHub_**
1.	Build and test the Weather Intelligence App in Google AI Studio App Build.
2.	Use the GitHub integration available in AI Studio to connect the application to a GitHub repository.
3.	Publish the generated source code to the selected repository.
4.	Verify that the repository contains the application source files, configuration files, and README documentation.
**_GitHub to Cloudflare Pages_**
1.	Sign in to Cloudflare and navigate to Workers & Pages.
2.	Create a new Pages project and connect the GitHub repository containing the Weather Intelligence App.
3.	Configure the build settings as required by the project.
   * 	Build Command: npm run build
   *	Build Output Directory: dist
4.	Start the deployment and wait for the build process to complete successfully.
5.	Open the generated pages.dev URL and confirm that the application is accessible.**
**_Validation Steps:_**
1.	Search for at least two valid cities and verify that current weather information and forecast details are displayed.
2.	Search for an invalid city and confirm that an appropriate error message is shown.
3.	Refresh the application and verify that it continues to load correctly.
4.	Test the application on different screen sizes to ensure the layout remains usable.
5.	Review the Cloudflare deployment logs to confirm that the deployment completed successfully.

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/563c74da-42c0-45bb-85a0-e2f7acedf916

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:   `npm run dev`
