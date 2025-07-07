import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default async function PostPage({ params }) {
    const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return (
        <div className="prose mx-auto py-12 text-white">
            {/* Cover 圖片 */}
            {data.cover && (
                <img
                    src={data.cover}
                    alt={data.title}
                    className="mb-6 w-full max-h-[400px] object-cover rounded-xl shadow"
                />
            )}
            <h1>{data.title}</h1>
            {data.description && (
                <p className="text-lg text-gray-400 mb-2">{data.description}</p>
            )}
            {data.tags && (
                <div className="flex gap-2 mb-4">
                    {data.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded bg-yellow-600 text-white">{tag}</span>
                    ))}
                </div>
            )}
            {data.travel_date && (
                <span className="mr-2">
                    <span className="font-semibold">旅行時間：</span>{data.travel_date}
                </span>
            )}
            {/* 撰寫日期 */}
            {data.date && (
                <span className="mr-2">
                    <span className="font-semibold">發文日期：</span>{data.date}
                </span>
            )}
            {/* 地點 */}
            {data.city && <>・{data.city}</>}
            {data.country && <>・{data.country}</>}
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}

export async function generateStaticParams() {
    const postsDir = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDir);
    return filenames.map((file) => ({
        slug: file.replace(/\.md$/, ''),
    }));
}
