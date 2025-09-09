import { Tag } from "@shared/types";

export abstract class ITagService {
    public abstract getTags(): Promise<Tag[]>;
}
