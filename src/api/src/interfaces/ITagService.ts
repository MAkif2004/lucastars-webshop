import { Tag } from "@shared/types";

@Interface
export abstract class ITagService {
    public abstract getTags(): Promise<Tag[]>;
}
