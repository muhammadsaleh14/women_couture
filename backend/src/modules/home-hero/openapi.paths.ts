import { z } from "../../zod-openapi";
import { openAPIRegistry } from "../../core/openapi/registry";
import {
  CreateHomeHeroSlideBodySchema,
  HomeHeroSlideRecordSchema,
  HomeHeroSlideResolvedSchema,
  ReorderHomeHeroSlidesBodySchema,
  UpdateHomeHeroSlideBodySchema,
} from "./home-hero.schema";

openAPIRegistry.registerPath({
  method: "get",
  path: "/home-hero-slides",
  summary: "List active home hero slides (resolved for storefront)",
  tags: ["HomeHero"],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: HomeHeroSlideResolvedSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "get",
  path: "/home-hero-slides/manage",
  summary: "List all home hero slides (management)",
  tags: ["HomeHero"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: HomeHeroSlideRecordSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "post",
  path: "/home-hero-slides",
  summary: "Create home hero slide",
  tags: ["HomeHero"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateHomeHeroSlideBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: HomeHeroSlideRecordSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "patch",
  path: "/home-hero-slides/reorder",
  summary: "Reorder home hero slides",
  tags: ["HomeHero"],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ReorderHomeHeroSlidesBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: HomeHeroSlideRecordSchema.array(),
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "patch",
  path: "/home-hero-slides/{slideId}",
  summary: "Update home hero slide",
  tags: ["HomeHero"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ slideId: z.string() }),
    body: {
      content: {
        "application/json": {
          schema: UpdateHomeHeroSlideBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: HomeHeroSlideRecordSchema,
        },
      },
    },
  },
});

openAPIRegistry.registerPath({
  method: "delete",
  path: "/home-hero-slides/{slideId}",
  summary: "Delete home hero slide",
  tags: ["HomeHero"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ slideId: z.string() }),
  },
  responses: {
    204: {
      description: "No content",
    },
  },
});
