"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_openapi_1 = require("../../zod-openapi");
const registry_1 = require("../../core/openapi/registry");
const home_hero_schema_1 = require("./home-hero.schema");
registry_1.openAPIRegistry.registerPath({
    method: "get",
    path: "/home-hero-slides",
    summary: "List active home hero slides (resolved for storefront)",
    tags: ["HomeHero"],
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: home_hero_schema_1.HomeHeroSlideResolvedSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
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
                    schema: home_hero_schema_1.HomeHeroSlideRecordSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "post",
    path: "/home-hero-slides",
    summary: "Create home hero slide",
    tags: ["HomeHero"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: home_hero_schema_1.CreateHomeHeroSlideBodySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: "Created",
            content: {
                "application/json": {
                    schema: home_hero_schema_1.HomeHeroSlideRecordSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/home-hero-slides/reorder",
    summary: "Reorder home hero slides",
    tags: ["HomeHero"],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: home_hero_schema_1.ReorderHomeHeroSlidesBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: home_hero_schema_1.HomeHeroSlideRecordSchema.array(),
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "patch",
    path: "/home-hero-slides/{slideId}",
    summary: "Update home hero slide",
    tags: ["HomeHero"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({ slideId: zod_openapi_1.z.string() }),
        body: {
            content: {
                "application/json": {
                    schema: home_hero_schema_1.UpdateHomeHeroSlideBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "OK",
            content: {
                "application/json": {
                    schema: home_hero_schema_1.HomeHeroSlideRecordSchema,
                },
            },
        },
    },
});
registry_1.openAPIRegistry.registerPath({
    method: "delete",
    path: "/home-hero-slides/{slideId}",
    summary: "Delete home hero slide",
    tags: ["HomeHero"],
    security: [{ bearerAuth: [] }],
    request: {
        params: zod_openapi_1.z.object({ slideId: zod_openapi_1.z.string() }),
    },
    responses: {
        204: {
            description: "No content",
        },
    },
});
//# sourceMappingURL=openapi.paths.js.map