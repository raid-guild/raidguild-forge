const PARAGRAPH_API_BASE = "https://api.paragraph.com/api/v1";
const FORGE_PUBLICATION_SLUG = "raidguild-forge";
const FORGE_PUBLICATION_ID = "h4XhXsddbakuhoBAxme2";
const POST_LIMIT = 60;

export type LearnTopic =
  | "Autonomous Worlds"
  | "Forge Notes"
  | "Game Systems"
  | "Hardware"
  | "Royalties";

export type LearnArticle = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  href: string;
  imageUrl: string | null;
  publishedAt: string;
  topics: LearnTopic[];
};

type ParagraphPublication = {
  id?: unknown;
};

type ParagraphPost = {
  id?: unknown;
  title?: unknown;
  subtitle?: unknown;
  slug?: unknown;
  publishedAt?: unknown;
  imageUrl?: unknown;
  categories?: unknown;
};

type ParagraphPostsResponse = {
  items?: ParagraphPost[];
  pagination?: {
    hasMore?: boolean;
    cursor?: string;
  };
};

export const learnTopics: LearnTopic[] = [
  "Game Systems",
  "Autonomous Worlds",
  "Hardware",
  "Royalties",
  "Forge Notes",
];

export async function getLearnArticles(): Promise<LearnArticle[]> {
  try {
    const publicationId = await getPublicationId();
    const posts = await getAllPublishedPosts(publicationId);

    return posts
      .map(normalizePost)
      .filter((article): article is LearnArticle => Boolean(article))
      .sort(
        (left, right) =>
          new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
      );
  } catch (error) {
    console.error("Unable to fetch Paragraph posts", error);
    return [];
  }
}

async function getPublicationId() {
  const publication = await fetchJson<ParagraphPublication>(
    `${PARAGRAPH_API_BASE}/publications/slug/${FORGE_PUBLICATION_SLUG}`,
  );

  return typeof publication.id === "string" ? publication.id : FORGE_PUBLICATION_ID;
}

async function getAllPublishedPosts(publicationId: string) {
  const posts: ParagraphPost[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ limit: String(POST_LIMIT) });

    if (cursor) {
      params.set("cursor", cursor);
    }

    const page = await fetchJson<ParagraphPostsResponse>(
      `${PARAGRAPH_API_BASE}/publications/${publicationId}/posts?${params.toString()}`,
    );

    posts.push(...(Array.isArray(page.items) ? page.items : []));
    cursor = page.pagination?.hasMore ? page.pagination.cursor : undefined;
  } while (cursor);

  return posts;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`Paragraph request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function normalizePost(post: ParagraphPost): LearnArticle | null {
  if (
    typeof post.id !== "string" ||
    typeof post.title !== "string" ||
    typeof post.slug !== "string" ||
    typeof post.publishedAt !== "string"
  ) {
    return null;
  }

  const publishedAt = normalizeDate(post.publishedAt);

  if (!publishedAt) {
    return null;
  }

  const categories = Array.isArray(post.categories)
    ? post.categories.filter((category): category is string => typeof category === "string")
    : [];

  return {
    id: post.id,
    title: post.title,
    subtitle: typeof post.subtitle === "string" ? post.subtitle : "",
    slug: post.slug,
    href: `https://paragraph.com/@${FORGE_PUBLICATION_SLUG}/${post.slug}`,
    imageUrl: typeof post.imageUrl === "string" && post.imageUrl ? post.imageUrl : null,
    publishedAt,
    topics: getTopics(categories),
  };
}

function normalizeDate(value: string) {
  const numericValue = Number(value);
  const date = Number.isFinite(numericValue) ? new Date(numericValue) : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getTopics(categories: string[]): LearnTopic[] {
  const normalizedCategories = new Set(categories.map((category) => category.toLowerCase()));
  const topics = new Set<LearnTopic>();

  if (hasAny(normalizedCategories, ["hardware", "console", "raspberry", "pi", "arcade"])) {
    topics.add("Hardware");
  }

  if (
    hasAny(normalizedCategories, [
      "auto",
      "tower",
      "defense",
      "game",
      "gaming",
      "mud",
      "redstone",
    ])
  ) {
    topics.add("Game Systems");
  }

  if (hasAny(normalizedCategories, ["autonomous", "worlds", "mud", "redstone"])) {
    topics.add("Autonomous Worlds");
  }

  if (hasAny(normalizedCategories, ["patent", "royalty", "royalties"])) {
    topics.add("Royalties");
  }

  if (hasAny(normalizedCategories, ["forge", "raidguild", "dao", "venture"])) {
    topics.add("Forge Notes");
  }

  return topics.size > 0 ? [...topics] : ["Forge Notes"];
}

function hasAny(values: Set<string>, candidates: string[]) {
  return candidates.some((candidate) => values.has(candidate));
}
