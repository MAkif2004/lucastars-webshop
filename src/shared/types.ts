/**
 * Represents a session
 */
export type SessionResponse = {
    /** ID of the session */
    sessionId: string;
};

/**
 * Represents a welcome message
 */
export type WelcomeResponse = {
    /** Contents of the welcome message */
    message: string;
};

/**
 * Represents a secret message
 */
export type SecretResponse = {
    /** ID of the session */
    sessionId: string;
    /** ID of the user */
    userId: string;
};

export type PaymentReturnResponse = {
    status: string;
    transactionId: string | null;
};

export type Payment = {
    orderId: number;
    value: number;
};

export type PaymentResponse = {
    /** Transaction ID of the payment */
    transactionId: string;
    redirectUrl: string | null;
};

export type CheckoutItem = {
    orderId: number | null;
    street: string | null;
    houseNumber: string | null;
    postalCode: string | null;
    city: string | null;
    totalPrice: number;
};

export type CartItem = {
    userId: number;
    gameId: number;
    quantity: number;
    thumbnail: string;
    name: string;
    description: string;
    price: number;
};
/**
 * Represents the query options for getting games
 */
export type GetGamesOptions = {
    /** Page number for pagination */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Sort order for the games */
    sort?: "asc" | "desc";
    /** Sort field for the games */
    sortBy?: "name" | "price" | "created";
    /** Filter for tags */
    tags?: number[];
    /** Minimum price for filtering */
    minPrice?: number;
    /** Maximum price for filtering */
    maxPrice?: number;
};

/**
 * Represents a list of games
 */
export type GamesResponse = {
    /** List of games */
    games: Game[];
};

/**
 * Represents a list of games
 */
export type CartResponse = {
    /** List of games */
    cart: Cart[];
};

/**
 * Represents a game product
 */
export type Game = {
    /** ID of the game */
    id: string;
    /** SKU (stock keeping unit) of the game */
    sku: string;
    /** Name of the game */
    name: string;
    /** Thumbnail image url of the game */
    thumbnail: string;
    /** Description of the game with HTML formatting */
    description: string;
    /** Price of the game */
    price: number;
    /** List of images of the game */
    images: string[];
    /** List of tags associated with the game */
    tags: string[];
    /**
     * URL of the game
     * @remarks This will only be filled if the user owns the game
     */
    url?: string;
};

/**
 * Represents a game product
 */
export type Cart = {
    id: number;
    userId: number;
    gameId: number;
    quantity: number;
};

export type OrdersGamesResponse = {
    /** List of games */
    ordersGames: OrdersGames[];
};

export type OrdersGames = {
    gameId: number;
    userId: number;
    name: string;
    thumbnail: string;
    price: number;
};

export interface IUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    prefix: string | null;
    lastName: string;
    street: string | null;
    houseNumber: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    created: Date;
    updated: Date;
}

export interface IUserRegisterDTO {
    username: string;
    email: string;
    firstName: string;
    prefix?: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}

export interface ICartData {
    id: number;
    userId: number;
    gameId: number;
    quantity: number;
}

export interface IAuthResponse {
    success: boolean;
    message: string;
    sessionId?: string;
}

export interface ICartResponse {
    success: boolean;
}

export type AuthReponse = {
    success: boolean;
    message: string;
    sessionId?: string;
};

export type AuthVerifyResponse = {
    loggedIn: boolean;
};

/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> {
    /** Actual data items */
    items: T[];
    /** Pagination data */
    pagination: {
        /** Total number of items across all pages */
        totalItems: number;
        /** Number of items per page */
        itemsPerPage: number;
        /** Current page number */
        currentPage: number;
        /** Total number of pages */
        totalPages: number;
    };
}

/**
 * Represents a tag
 */
export type Tag = {
    /** ID of the tag */
    id: number;
    /** Name of the tag */
    value: string;
};

/**
 * Represents a review
 */
export interface Review {
    id: number;
    userId: number;
    gameId: number;
    gameName?: string;
    gameThumbnail?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    rating: number;
    title: string;
    content: string;
    helpful: number;
    created: Date;
    updated?: Date;
}

/**
 * DTO for creating a review
 */
export interface ReviewCreateDTO {
    rating: number;
    title: string;
    content: string;
}

/**
 * DTO for updating a review
 */
export interface ReviewUpdateDTO {
    rating?: number;
    title?: string;
    content?: string;
}

/**
 * Review statistics
 */
export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    totalHelpful: number;
}

// Also update the UserController to extend functionality
export interface UserUpdateDTO {
    firstName?: string;
    prefix?: string;
    lastName?: string;
}

export interface AddressUpdateDTO {
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}
