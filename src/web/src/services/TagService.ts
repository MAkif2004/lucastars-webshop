import { ITagService } from "@web/interfaces/ITagService";
import { Tag } from "@shared/types";

export class TagService implements ITagService {
    public async getTags(): Promise<Tag[]> {
        const res: Response = await fetch(`${VITE_API_URL}tags`);
        return await res.json() as unknown as Tag[];
    }
}
