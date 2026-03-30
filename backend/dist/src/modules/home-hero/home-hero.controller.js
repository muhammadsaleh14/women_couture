"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSlides = getPublicSlides;
exports.getManageSlides = getManageSlides;
exports.createSlide = createSlide;
exports.updateSlide = updateSlide;
exports.deleteSlide = deleteSlide;
exports.reorderSlides = reorderSlides;
const homeHeroService = __importStar(require("./home-hero.service"));
const home_hero_schema_1 = require("./home-hero.schema");
async function getPublicSlides(_req, res, next) {
    try {
        const slides = await homeHeroService.listResolvedPublic();
        res.json(slides);
    }
    catch (err) {
        next(err);
    }
}
async function getManageSlides(_req, res, next) {
    try {
        const slides = await homeHeroService.listAllSlideRecords();
        res.json(slides);
    }
    catch (err) {
        next(err);
    }
}
async function createSlide(req, res, next) {
    try {
        const body = home_hero_schema_1.CreateHomeHeroSlideBodySchema.parse(req.body);
        const slide = await homeHeroService.createSlide(body);
        res.status(201).json(slide);
    }
    catch (err) {
        next(err);
    }
}
async function updateSlide(req, res, next) {
    try {
        const { slideId } = home_hero_schema_1.HomeHeroSlideParamsSchema.parse(req.params);
        const body = home_hero_schema_1.UpdateHomeHeroSlideBodySchema.parse(req.body);
        const slide = await homeHeroService.updateSlide(slideId, body);
        res.json(slide);
    }
    catch (err) {
        next(err);
    }
}
async function deleteSlide(req, res, next) {
    try {
        const { slideId } = home_hero_schema_1.HomeHeroSlideParamsSchema.parse(req.params);
        await homeHeroService.deleteSlide(slideId);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function reorderSlides(req, res, next) {
    try {
        const body = home_hero_schema_1.ReorderHomeHeroSlidesBodySchema.parse(req.body);
        await homeHeroService.reorderSlides(body.orderedIds);
        const slides = await homeHeroService.listAllSlideRecords();
        res.json(slides);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=home-hero.controller.js.map