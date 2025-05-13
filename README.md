# Exhibitoon Curator Notes


## Project Overview

You’ve been invited by a coalition of museums and universities to develop a platform where users can explore virtual exhibitions from combined collections of antiquities and fine art. This platform will serve researchers, students, and art enthusiasts, providing a searchable and interactive experience of the collections. Minimum Viable Product (MVP)

The platform (web app or progressive web app) must include the following features:

Users can search artworks across collections from at least two different Museum or University APIs.
Allow users to browse artworks, from a list view, with "Previous" and "Next" page navigation options to prevent loading of too many items at once.
Users can filter and/or sort artworks to make it easier to navigate through larger lists of items.
Display images and essential details about each artwork individually.
Enable users to create, add items to, and remove items from, personal exhibition collections of saved artworks. A single user can have multiple exhibition collections.
Users can view their exhibitions and the saved items within each collection.

Refer to Completion and Submission Requirements for more details.

## Tech Choices

Programming Languages: Use JavaScript or TypeScript.
API Integration: Research and choose at least two free museum or university APIs to retrieve collection data. Be sure to sign up for any necessary developer accounts on free tiers.
Hosting: Use a free distribution platform (e.g., GitHub Pages or Netlify).
Implement security best practices (e.g. for handling of API keys).

The following technologies and tools are suggestions, not requirements:

React for the frontend.
TanStack for managing API calls from the frontend.
TypeScript Express server.

## UI Requirements

Design should be responsive and adapt well across various screen sizes.
Ensure accessibility for users with disabilities (e.g., support screen readers, keyboard navigation).
The UI should clearly provide feedback on interactions, display errors (e.g., failed requests or missing fields) and show loading states when content is being fetched.
Design should intuitively guide users to search, view, and create curated exhibitions.

## Completion and Submission Requirements

The due date will be provided, but it will be no later than four weeks after starting the project.

Your project must fulfill the following criteria:

The project should be hosted and publicly accessible (from a web browser).
README Documentation should include:
    A summary of the project
        (you may consider recording a video walkthrough of your platform, highlighting key features. Host this video on a free platform (e.g., YouTube) and include a link in your README.)
    Clear instructions on how to run the project locally, including setup steps (e.g., installing dependencies and configuring environment variables).
Meet the MVP requirements outlined above.

Failure to meet these requirements may result in project rejection.

## Optional Extensions

If you complete the MVP and have time for additional features, consider implementing the following:

User Accounts: Save curated exhibition collections within user profiles. Consider a back-end solution for securely storing data, and provide access to a whitelisted test account.
Social Media Integration: Allow users to share exhibitions or individual artworks.
Cross-Platform Access: Develop both a website and a mobile app.
Advanced Search Options: Enable multiple filters for more refined search criteria.




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
