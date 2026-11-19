import { readPosts } from "./site-posts.mjs";

// Prints [{title, slug}] for every published post. The publish pipeline keeps a copy as the fixture of its slug port.
console.log(JSON.stringify(readPosts().map(({ title, slug }) => ({ title, slug })), null, 2));
