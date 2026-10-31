import type { Quiz, Topic, Track } from "@/lib/types";

/**
 * 内容注册表：静态导入全部 JSON，构建期完成合并，零请求、静态导出友好。
 * topics:  src/data/topics/<track>/<topicId>.json
 * quizzes: src/data/quiz/<track>/<topicId>.json（与 topics 同构组织）
 */

/* ---- Spring 核心（第一批） ---- */
import iocContainerBasics from "@/data/topics/spring/ioc-container-basics.json";
import beanRegistration from "@/data/topics/spring/bean-registration.json";
import diThreeWays from "@/data/topics/spring/di-three-ways.json";
import autowiredVsResource from "@/data/topics/spring/autowired-vs-resource.json";
import beanLifecycle from "@/data/topics/spring/bean-lifecycle.json";
import beanScopes from "@/data/topics/spring/bean-scopes.json";
import aopConcepts from "@/data/topics/spring/aop-concepts.json";
import jdkCglibProxy from "@/data/topics/spring/jdk-cglib-proxy.json";
import aopAdviceTypes from "@/data/topics/spring/aop-advice-types.json";
import pointcutExpressions from "@/data/topics/spring/pointcut-expressions.json";

import iocQuiz from "@/data/quiz/spring/ioc-container-basics.json";
import beanRegistrationQuiz from "@/data/quiz/spring/bean-registration.json";
import diQuiz from "@/data/quiz/spring/di-three-ways.json";
import autowiredQuiz from "@/data/quiz/spring/autowired-vs-resource.json";
import beanLifecycleQuiz from "@/data/quiz/spring/bean-lifecycle.json";
import beanScopesQuiz from "@/data/quiz/spring/bean-scopes.json";
import aopConceptsQuiz from "@/data/quiz/spring/aop-concepts.json";
import jdkCglibQuiz from "@/data/quiz/spring/jdk-cglib-proxy.json";
import aopAdviceQuiz from "@/data/quiz/spring/aop-advice-types.json";
import pointcutQuiz from "@/data/quiz/spring/pointcut-expressions.json";

/* ---- Spring Boot（第二批） ---- */
import sbApplicationClass from "@/data/topics/springboot/sb-application-class.json";
import sbAutoconfiguration from "@/data/topics/springboot/sb-autoconfiguration.json";
import sbStarter from "@/data/topics/springboot/sb-starter.json";
import sbConfigSystem from "@/data/topics/springboot/sb-config-system.json";
import sbProfiles from "@/data/topics/springboot/sb-profiles.json";
import sbActuator from "@/data/topics/springboot/sb-actuator.json";
import sbSecurityJwt from "@/data/topics/springboot/sb-security-jwt.json";
import sbRedisCache from "@/data/topics/springboot/sb-redis-cache.json";
import sbExceptionHandling from "@/data/topics/springboot/sb-exception-handling.json";
import sbLogging from "@/data/topics/springboot/sb-logging.json";

import sbApplicationClassQuiz from "@/data/quiz/springboot/sb-application-class.json";
import sbAutoconfigurationQuiz from "@/data/quiz/springboot/sb-autoconfiguration.json";
import sbStarterQuiz from "@/data/quiz/springboot/sb-starter.json";
import sbConfigSystemQuiz from "@/data/quiz/springboot/sb-config-system.json";
import sbProfilesQuiz from "@/data/quiz/springboot/sb-profiles.json";
import sbActuatorQuiz from "@/data/quiz/springboot/sb-actuator.json";
import sbSecurityJwtQuiz from "@/data/quiz/springboot/sb-security-jwt.json";
import sbRedisCacheQuiz from "@/data/quiz/springboot/sb-redis-cache.json";
import sbExceptionHandlingQuiz from "@/data/quiz/springboot/sb-exception-handling.json";
import sbLoggingQuiz from "@/data/quiz/springboot/sb-logging.json";

export const TRACKS: Track[] = ["spring", "springboot", "ruoyi"];

export const TRACK_META: Record<
  Track,
  { label: string; brief: string; gradient: string; text: string }
> = {
  spring: {
    label: "Spring 核心",
    brief: "IoC / AOP / 事务 / 事件",
    gradient: "from-cyan-400 to-blue-500",
    text: "text-cyan-300",
  },
  springboot: {
    label: "Spring Boot",
    brief: "自动装配 / 配置 / 安全 / 缓存",
    gradient: "from-violet-400 to-purple-500",
    text: "text-violet-300",
  },
  ruoyi: {
    label: "RuoYi",
    brief: "RBAC / 权限模型 / 核心源码",
    gradient: "from-amber-400 to-pink-500",
    text: "text-amber-300",
  },
};

export const LEVEL_LABEL: Record<Topic["level"], string> = {
  1: "入门",
  2: "进阶",
  3: "源码级",
};

interface QuizFile {
  topicId: string;
  quizzes: Quiz[];
}

function topic(raw: unknown): Topic {
  return raw as Topic;
}

function quizzes(raw: unknown): Quiz[] {
  return (raw as QuizFile).quizzes;
}

export const SPRING_TOPICS: Topic[] = [
  { ...topic(iocContainerBasics), quiz: quizzes(iocQuiz) },
  { ...topic(beanRegistration), quiz: quizzes(beanRegistrationQuiz) },
  { ...topic(diThreeWays), quiz: quizzes(diQuiz) },
  { ...topic(autowiredVsResource), quiz: quizzes(autowiredQuiz) },
  { ...topic(beanLifecycle), quiz: quizzes(beanLifecycleQuiz) },
  { ...topic(beanScopes), quiz: quizzes(beanScopesQuiz) },
  { ...topic(aopConcepts), quiz: quizzes(aopConceptsQuiz) },
  { ...topic(jdkCglibProxy), quiz: quizzes(jdkCglibQuiz) },
  { ...topic(aopAdviceTypes), quiz: quizzes(aopAdviceQuiz) },
  { ...topic(pointcutExpressions), quiz: quizzes(pointcutQuiz) },
];

export const SPRINGBOOT_TOPICS: Topic[] = [
  { ...topic(sbApplicationClass), quiz: quizzes(sbApplicationClassQuiz) },
  { ...topic(sbAutoconfiguration), quiz: quizzes(sbAutoconfigurationQuiz) },
  { ...topic(sbStarter), quiz: quizzes(sbStarterQuiz) },
  { ...topic(sbConfigSystem), quiz: quizzes(sbConfigSystemQuiz) },
  { ...topic(sbProfiles), quiz: quizzes(sbProfilesQuiz) },
  { ...topic(sbActuator), quiz: quizzes(sbActuatorQuiz) },
  { ...topic(sbSecurityJwt), quiz: quizzes(sbSecurityJwtQuiz) },
  { ...topic(sbRedisCache), quiz: quizzes(sbRedisCacheQuiz) },
  { ...topic(sbExceptionHandling), quiz: quizzes(sbExceptionHandlingQuiz) },
  { ...topic(sbLogging), quiz: quizzes(sbLoggingQuiz) },
];

export const ALL_TOPICS: Topic[] = [...SPRING_TOPICS, ...SPRINGBOOT_TOPICS];

const TOPIC_MAP = new Map(ALL_TOPICS.map((t) => [t.id, t]));

export function getTopicsByTrack(track: Track): Topic[] {
  return ALL_TOPICS.filter((t) => t.track === track);
}

export function getTopicById(id: string): Topic | undefined {
  return TOPIC_MAP.get(id);
}

export function getTopicOrThrow(id: string): Topic {
  const found = TOPIC_MAP.get(id);
  if (!found) throw new Error(`topic not found: ${id}`);
  return found;
}

export function getAllQuizzes(): Quiz[] {
  return ALL_TOPICS.flatMap((t) => t.quiz);
}

export function getQuizzesByTrack(track: Track): Quiz[] {
  return getTopicsByTrack(track).flatMap((t) => t.quiz);
}

export function getQuizById(id: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.id === id);
}

/** 轨道是否已有内容（未开放的轨道在列表页显示占位态） */
export function trackHasContent(track: Track): boolean {
  return getTopicsByTrack(track).length > 0;
}

/** 前置依赖深度（用于路线图分列） */
export function prereqDepth(topicId: string, seen = new Set<string>()): number {
  const t = TOPIC_MAP.get(topicId);
  if (!t || t.prereq.length === 0 || seen.has(topicId)) return 0;
  seen.add(topicId);
  return 1 + Math.max(...t.prereq.map((p) => prereqDepth(p, seen)));
}
