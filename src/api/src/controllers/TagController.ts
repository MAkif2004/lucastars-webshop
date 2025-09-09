import { ITagService } from "@api/interfaces/ITagService";
import { TagService } from "@api/services/TagsService";
import { Tag } from "@shared/types";
import { Request, Response } from "express";

export class TagController {
    private readonly _tagService: ITagService = new TagService();

    public async getTags(_req: Request, res: Response): Promise<void> {
        const tags: Tag[] = await this._tagService.getTags();

        res.json(tags);
    }
}
