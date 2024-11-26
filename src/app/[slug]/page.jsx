import fs from "fs";
import path from "path";
import matter from "gray-matter";
import markdownToHtml from "@/utils/markdownToHtml";
import { notFound } from "next/navigation";
const SLUGS = ["privacy-policy", "terms", "cookie-policy"];

const getMarkdownData = (slug) => {
  const filePath = path.join(process.cwd(), "public", "pages", `${slug}.md`);
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    return { data, content };
  } else {
    return null;
  }
};

const LegalPages = async ({ params }) => {
  const { slug } = params;

  if (!SLUGS.includes(slug)) {
    return notFound(); // Redirect to the not-found page
  }

  const data = getMarkdownData(slug);

  if (!data) {
    console.log("error");

    // return notFound(); // Also handle case where data might be null
  }

  const htmlContent = await markdownToHtml(data.content);

  return (
    <>
      <section className="top-section pb-8 md:pb-15 xl:pb-30 text-gray-800">
        <div>
          <div className="w-full text-center py-10">
            <h1 className="text-textPrimary text-3xl sm:text-4xl md:text-[4vw] xl:text-6xl font-geistSemibold xl:leading-tight">
              {slug === "privacy-policy"
                ? "Privacy Policy"
                : slug === "terms"
                ? "Terms and Conditions"
                : slug === "cookie-policy"
                ? "Cookie Policy"
                : null}{" "}
            </h1>
            <h2 className="text-textParagraph sm:text-lg xl:text-2xl text-center mt-1">
              {slug === "privacy-policy"
                ? "Privacy Policy"
                : slug === "terms"
                ? "Terms and Conditions"
                : slug === "cookie-policy"
                ? "Cookie Policy"
                : null}{" "}
              for Dotix Auth
            </h2>
            <p className="text-textParagraph sm:text-lg xl:text-2xl font-geistSemibold mt-2">
              Last Updated: 14-10-2024
            </p>
          </div>

          <div className="w-full max-w-[94%] md:max-w-[84%] xl:max-w-6xl mx-auto pt-8 pb-12 px-4 sm:px-8 xl:px-14 border border-borderLight border-t-0 border-dashed">
            <div
              className="w-full"
              id="legal"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalPages;
