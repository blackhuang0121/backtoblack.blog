import Image from "next/image";
import Link from 'next/link';
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "@/components/Header";
import HeroImage from "@/components/HeroImage";
import CategoryCards from "@/components/CategoryCards";
import Footer from "@/components/Footer";
import ImageSlider from "@/components/ImageSlider";

// 取得最新文章
async function getLatestPosts(n = 3) {
  const postsDir = path.join(process.cwd(), "posts");
  const filenames = fs.readdirSync(postsDir);

  const posts = filenames.map((file) => {
    const filePath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);
    return {
      slug: file.replace(/\.md$/, ""),
      ...data,
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts.slice(0, n);
}

export default async function Home() {
  const latestPosts = await getLatestPosts(3);
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-white">
      <Header />
      <HeroImage />
      <div className="w-full max-w-4xl px-4 mt-10 flex flex-col gap-12 mx-auto">
        {/* 最新文章區塊 */}
        <section className="w-full max-w-3xl my-10 mb-2 mx-auto">
          <CategoryCards />

          <h2 className="text-2xl font-bold mt-8 mb-4 text-white">最新文章</h2>
          <div className="flex flex-col gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="flex items-stretch bg-neutral-800 rounded-xl overflow-hidden shadow hover:scale-105 transition w-full max-w-3xl"
              >
                {/* 左側圖片 */}
                <div className="w-36 flex-shrink-0 relative">
                  <Image src={post.cover} alt={post.title} fill className="object-cover" />
                </div>
                {/* 右側文字 */}
                <div className="flex flex-col justify-between p-4 min-w-0 w-2/3">
                  <h3 className="text-base font-bold mb-1">{post.title}</h3>
                  <div className="text-gray-400 text-xs mb-2 flex gap-4">
                    <span>旅行日期：{post.travel_date}</span>
                    <span>發文日期：{post.date}</span>
                  </div>
                  <div className="text-xs text-gray-300 mb-2 truncate">
                    {post.description?.length > 30 ? post.description.slice(0, 30) + '...' : post.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="w-full max-w-3xl mt-2 mb-2 my-10 mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4 mt-4">隨著光和影的變化按下快門</h2>
          <ImageSlider />
        </section>
        <p className="mt-2 text-gray-400 text-center items-center max-w-md mx-auto">
          &quot;Won&apos;t you give yourself a try? Won&apos;t you give?&quot; - The 1975
        </p>
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/img/DSCF4701.JPG"
            alt="Howard Huang"
            width={600}
            height={200}
            style={{ height: 'auto' }}
            className="rounded object-contain"
          />
          <p className="mt-6 text-gray-400 text-center max-w-md">
            &quot;Don&apos;t wait for the tide just to dip both your feet in.&quot; - Beabadoobee
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
