import Blogcard from "@/components/features/Blogcard/Blogcard";
import fs from 'fs'
import matter from "gray-matter";

export default function Blog(props: { posts: any }) {
  console.log(props.posts.data)
  const { posts } = props
  return (
    <div>

      {posts.map((post: any, index: any) => (
        <Blogcard key={index} post={post} />
      ))}

    </div>
  );
}
export async function getStaticProps() {
  // Getting all our posts at build time

  // Get all the posts from posts folder
  const files = fs.readdirSync("posts");

  // Loop over each post to extract the frontmatter which we need
  const posts = files.map((file) => {
    // getting the slug here which we will need as a URL query parameter
    const slug = file.replace(".md", "");
    // Reading the contents of the file
    const filecontent = fs.readFileSync(`posts/${file}`, "utf-8");
    const parsedContent = matter(filecontent);
    //The parsed content contains data and content we only need the data which is the frontmatter
    const { data } = parsedContent
    return {
      slug,
      data,
    };
  });

  return {
    props: {
      posts
    }
  }
}