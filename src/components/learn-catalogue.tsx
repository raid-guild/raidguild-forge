"use client";

import { ArrowUpRight, BookOpen, CalendarDays, Filter } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { TrackLink } from "@/components/track-link";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  formatArticleDate,
  type LearnArticle,
  type LearnTopic,
  learnTopics,
} from "@/lib/learn";
import { cn } from "@/lib/utils";

type TopicFilter = LearnTopic | "all";

const topicOptions: TopicFilter[] = ["all", ...learnTopics];

export function LearnCatalogue({ articles }: { articles: LearnArticle[] }) {
  const [topic, setTopic] = useState<TopicFilter>("all");
  const visibleArticles = useMemo(
    () =>
      topic === "all"
        ? articles
        : articles.filter((article) => article.topics.includes(topic)),
    [articles, topic],
  );

  function selectTopic(nextTopic: TopicFilter) {
    if (nextTopic === topic) {
      return;
    }

    setTopic(nextTopic);
    trackEvent(analyticsEvents.learnTopicFilterChange, {
      filter: "topic",
      value: nextTopic,
    });
  }

  if (articles.length === 0) {
    return (
      <div className="border border-moloch-800/15 bg-scroll-100 p-6 shadow-[8px_8px_0_rgba(41,16,10,0.08)]">
        <p className="type-label-sm mb-3 text-moloch-500">No posts loaded</p>
        <p className="type-body-lg max-w-2xl text-moloch-800/76">
          Published Learn posts from Paragraph will appear here once the index is
          available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3 border-y border-moloch-800/15 py-4 md:flex-row md:items-center md:justify-between">
        <div className="type-label-sm flex items-center gap-2 text-moloch-800/70">
          <Filter aria-hidden="true" size={15} strokeWidth={1.8} />
          Topic
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {topicOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "type-label-sm cursor-pointer border px-3 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                topic === option
                  ? "border-moloch-500 bg-moloch-500 text-scroll-100"
                  : "border-moloch-800/18 bg-scroll-100 text-moloch-800/75 hover:border-moloch-500 hover:text-moloch-500",
              )}
              aria-pressed={topic === option}
              onClick={() => selectTopic(option)}
            >
              {option === "all" ? "All" : option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        {visibleArticles.length > 0 ? (
          visibleArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        ) : (
          <div role="status" className="border border-moloch-800/15 bg-scroll-100 p-6">
            <p className="type-label-sm mb-3 text-moloch-500">No posts found</p>
            <p className="type-body-lg max-w-2xl text-moloch-800/76">
              No published posts match this topic yet.
            </p>
            <button
              type="button"
              className="type-label-sm mt-5 cursor-pointer border border-moloch-800 px-3 py-2 text-moloch-800 transition-colors hover:bg-moloch-800 hover:text-scroll-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => selectTopic("all")}
            >
              View all topics
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: LearnArticle }) {
  return (
    <TrackLink
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      eventName={analyticsEvents.learnArticleClick}
      eventProperties={{
        article: article.title,
        location: "learn_page",
        slug: article.slug,
      }}
      className="group grid overflow-hidden border border-moloch-800/15 bg-scroll-100 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-[5px_5px_0_rgba(41,16,10,0.08)] md:grid-cols-[0.48fr_1fr]"
    >
      <div className="relative min-h-64 border-b border-moloch-800/15 md:border-b-0 md:border-r">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="project-card-media object-cover"
            sizes="(min-width: 768px) 34vw, 100vw"
          />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center bg-moloch-800 text-scroll-100">
            <BookOpen aria-hidden="true" size={44} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="grid p-5 md:p-6">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {article.topics.map((articleTopic) => (
              <span
                key={articleTopic}
                className="type-label-sm border border-moloch-800/12 px-2 py-1 text-moloch-800/60"
              >
                {articleTopic}
              </span>
            ))}
          </div>
          <p className="type-label-sm mb-3 flex items-center gap-2 text-moloch-500">
            <CalendarDays aria-hidden="true" size={14} strokeWidth={1.8} />
            {formatArticleDate(article.publishedAt)}
          </p>
          <h2 className="type-heading-md text-moloch-800">{article.title}</h2>
          {article.subtitle ? (
            <p className="type-body-md mt-3 text-moloch-800/75">{article.subtitle}</p>
          ) : null}
        </div>
        <span className="type-label-sm mt-8 inline-flex items-center gap-2 self-end text-moloch-500">
          Read on Paragraph
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
        </span>
      </div>
    </TrackLink>
  );
}
